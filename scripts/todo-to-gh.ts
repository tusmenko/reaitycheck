/**
 * Parse docs/TODO.md and create GitHub Project draft issues via gh CLI.
 * After creating each draft issue, appends a [Project](url) link to the corresponding TODO line.
 * Usage: pnpm exec tsx scripts/todo-to-gh.ts [--dry-run] [--todo path] [--config path] <project-number> [owner]
 */

import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import { execFileSync } from "child_process";

const DEFAULT_TODO_PATH = resolve(process.cwd(), "docs/TODO.md");
const DEFAULT_CONFIG_PATH = resolve(process.cwd(), "scripts/gh-project.config.json");

export interface ParsedTask {
  title: string;
  description: string;
  section: string;
  epic: string;
}

const TASK_LINE_BOLD = /^\s*-\s+(?:-\s+)?\[ \]\s+\*\*(.+?)\*\*(?:\s*[—:]?\s*(.*))?$/;
const TASK_LINE_PLAIN = /^\s*-\s+-\s+\[ \]\s+(.+)$/;
const SUB_TASK_PREFIX = /^\s*-\s+-\s+\[ \]/;
const SUB_BULLET = /^\s*-\s+-\s+(.*)$/;
const SECTION_H2 = /^##\s+(.+)$/;
const SECTION_H3 = /^###\s+(.+)$/;

const PHASE_OPTIONS = [
  "MVP",
  "Post-MVP",
  "Social",
  "Technical",
  "Agentic suggestion",
] as const;

export interface ParseResult {
  tasks: ParsedTask[];
  lineIndices: number[];
}

export function parseTodo(content: string): ParsedTask[] {
  const result = parseTodoWithLineIndices(content);
  return result.tasks;
}

export function parseTodoWithLineIndices(content: string): ParseResult {
  const lines = content.split(/\r?\n/);
  const tasks: ParsedTask[] = [];
  const lineIndices: number[] = [];
  let section = "";
  let epic = "";
  let parentTitle = "";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const h2 = line.match(SECTION_H2);
    const h3 = line.match(SECTION_H3);

    if (h2) {
      section = h2[1].trim();
      epic = section;
      parentTitle = "";
      continue;
    }
    if (h3) {
      section = h3[1].trim();
      epic = section;
      parentTitle = "";
      continue;
    }

    let title = "";
    let description = "";
    let match = line.match(TASK_LINE_BOLD);
    if (match) {
      title = match[1].trim();
      description = (match[2] || "").trim();
    } else {
      match = line.match(TASK_LINE_PLAIN);
      if (match) {
        title = match[1].trim();
        description = "";
      }
    }

    if (title) {
      const isSubTask = SUB_TASK_PREFIX.test(line);
      if (parentTitle === "Agentic suggestion pre-validation" && isSubTask) {
        epic = "Agentic suggestion";
        if (description)
          description = `Part of: Agentic suggestion pre-validation.\n\n${description}`;
        else description = "Part of: Agentic suggestion pre-validation.";
      } else {
        epic = section;
      }

      let j = i + 1;
      while (j < lines.length) {
        const next = lines[j];
        if (next.match(SECTION_H2) || next.match(SECTION_H3)) break;
        if (next.match(TASK_LINE_BOLD) || next.match(TASK_LINE_PLAIN)) break;
        const sub = next.match(SUB_BULLET);
        if (sub) {
          description = description
            ? `${description}\n\n- ${sub[1].trim()}`
            : `- ${sub[1].trim()}`;
          j++;
        } else {
          break;
        }
      }

      tasks.push({
        title,
        description: description || "",
        section,
        epic,
      });
      lineIndices.push(i);

      if (section === "Post-MVP" && title === "Agentic suggestion pre-validation") {
        parentTitle = title;
      } else if (parentTitle && !isSubTask) {
        parentTitle = "";
      }
      continue;
    }
  }

  return { tasks, lineIndices };
}

function runGh(args: string[], input?: string): string {
  const result = execFileSync("gh", args, {
    encoding: "utf-8",
    input,
    maxBuffer: 10 * 1024 * 1024,
  });
  return (result as string).trim();
}

function getProjectNodeId(owner: string, projectNumber: string): string {
  const out = runGh([
    "project",
    "list",
    "--owner",
    owner,
    "--format",
    "json",
    "--limit",
    "100",
  ]);
  const data = JSON.parse(out) as { projects?: { number: number; id: string }[] } | { number: number; id: string }[];
  const projects = Array.isArray(data) ? data : (data.projects ?? []);
  const proj = projects.find((p) => String(p.number) === projectNumber);
  if (!proj) throw new Error(`Project number ${projectNumber} not found for owner ${owner}`);
  return proj.id;
}

interface FieldOption {
  id: string;
  name: string;
}

interface ProjectField {
  id: string;
  name: string;
  dataType: string;
  options?: FieldOption[];
}

function getFields(owner: string, projectNumber: string): ProjectField[] {
  const out = runGh([
    "project",
    "field-list",
    projectNumber,
    "--owner",
    owner,
    "--format",
    "json",
    "--limit",
    "50",
  ]);
  const data = JSON.parse(out) as { fields?: ProjectField[] } | ProjectField[];
  return Array.isArray(data) ? data : (data.fields ?? []);
}

function findOptionId(fields: ProjectField[], fieldName: string, optionName: string): string | null {
  const field = fields.find(
    (f) => f.name.toLowerCase() === fieldName.toLowerCase() && f.options?.length
  );
  if (!field?.options) return null;
  const opt = field.options.find((o) => o.name === optionName);
  return opt?.id ?? null;
}

function findFieldId(fields: ProjectField[], fieldName: string): string | null {
  const field = fields.find((f) => f.name.toLowerCase() === fieldName.toLowerCase());
  return field?.id ?? null;
}

function createDraftIssue(
  projectNumber: string,
  owner: string,
  title: string,
  body: string
): string {
  const args = [
    "project",
    "item-create",
    projectNumber,
    "--owner",
    owner,
    "--title",
    title,
    "--body",
    body,
    "--format",
    "json",
  ];
  const out = runGh(args);
  const data = JSON.parse(out) as { id: string };
  return data.id;
}

function editItemField(
  itemId: string,
  projectId: string,
  fieldId: string,
  singleSelectOptionId: string
): void {
  runGh([
    "project",
    "item-edit",
    "--id",
    itemId,
    "--project-id",
    projectId,
    "--field-id",
    fieldId,
    "--single-select-option-id",
    singleSelectOptionId,
  ]);
}

function getViewerLogin(): string {
  const out = runGh(["api", "user", "-q", ".login"]);
  return out.trim();
}

function buildProjectItemUrl(
  owner: string,
  projectNumber: string,
  itemId: string
): string {
  const effectiveOwner = owner === "@me" ? getViewerLogin() : owner;
  let pathPrefix = "users";
  if (owner !== "@me") {
    try {
      runGh(["api", "orgs/" + encodeURIComponent(effectiveOwner), "-q", ".login"]);
      pathPrefix = "orgs";
    } catch {
      pathPrefix = "users";
    }
  }
  const base = `https://github.com/${pathPrefix}/${effectiveOwner}/projects/${projectNumber}`;
  return `${base}?card=${encodeURIComponent(itemId)}`;
}

const PROJECT_LINK_MARKER = "[Project](";

function updateTodoWithProjectLinks(
  todoPath: string,
  lineIndices: number[],
  urls: string[]
): void {
  let content = readFileSync(todoPath, "utf-8");
  const lines = content.split(/\r?\n/);
  for (let k = 0; k < lineIndices.length && k < urls.length; k++) {
    const idx = lineIndices[k];
    const url = urls[k];
    if (idx < 0 || idx >= lines.length) continue;
    const line = lines[idx];
    if (line.includes(PROJECT_LINK_MARKER)) continue;
    const link = ` [Project](${url})`;
    lines[idx] = line.trimEnd() + link;
  }
  writeFileSync(todoPath, lines.join("\n") + (content.endsWith("\n") ? "\n" : ""), "utf-8");
}

function loadConfig(configPath: string): { projectNumber: string; owner: string; todoPath: string } | null {
  try {
    const raw = readFileSync(configPath, "utf-8");
    const data = JSON.parse(raw) as { projectNumber?: string; owner?: string; todoPath?: string };
    if (data.projectNumber && data.owner) {
      return {
        projectNumber: String(data.projectNumber),
        owner: data.owner,
        todoPath: data.todoPath ? resolve(process.cwd(), data.todoPath) : DEFAULT_TODO_PATH,
      };
    }
  } catch {
    // no config or invalid
  }
  return null;
}

function main(): void {
  const argv = process.argv.slice(2);
  let dryRun = false;
  let todoPath = DEFAULT_TODO_PATH;
  let configPath = DEFAULT_CONFIG_PATH;
  let projectNumber = "";
  let owner = "@me";

  let i = 0;
  while (i < argv.length) {
    const a = argv[i];
    if (a === "--dry-run") {
      dryRun = true;
      i++;
    } else if (a === "--todo" && argv[i + 1]) {
      todoPath = resolve(process.cwd(), argv[i + 1]);
      i += 2;
    } else if (a === "--config" && argv[i + 1]) {
      configPath = resolve(process.cwd(), argv[i + 1]);
      i += 2;
    } else if (a.startsWith("-")) {
      i++;
    } else {
      if (!projectNumber) projectNumber = a;
      else owner = a;
      i++;
    }
  }

  const config = loadConfig(configPath);
  if (config) {
    if (!projectNumber) projectNumber = config.projectNumber;
    if (owner === "@me" && config.owner) owner = config.owner;
    if (todoPath === DEFAULT_TODO_PATH && config.todoPath) todoPath = config.todoPath;
  }

  if (!projectNumber) {
    console.error("Usage: pnpm exec tsx scripts/todo-to-gh.ts [--dry-run] [--todo path] [--config path] <project-number> [owner]");
    process.exit(1);
  }

  const content = readFileSync(todoPath, "utf-8");
  const { tasks, lineIndices } = parseTodoWithLineIndices(content);

  console.log(`Parsed ${tasks.length} open tasks from ${todoPath}`);

  if (dryRun) {
    console.log(JSON.stringify(tasks, null, 2));
    return;
  }

  const projectId = getProjectNodeId(owner, projectNumber);
  const fields = getFields(owner, projectNumber);

  const statusFieldId = findFieldId(fields, "Status");
  const statusTodoId = statusFieldId
    ? findOptionId(fields, "Status", "Todo") ?? findOptionId(fields, "Status", "Backlog")
    : null;

  const phaseFieldId = findFieldId(fields, "Phase") ?? findFieldId(fields, "Epic");
  const phaseOptionIds: Record<string, string | null> = {};
  if (phaseFieldId) {
    for (const name of PHASE_OPTIONS) {
      phaseOptionIds[name] = findOptionId(fields, "Phase", name) ?? findOptionId(fields, "Epic", name);
    }
  }

  const projectUrls: string[] = [];

  for (const task of tasks) {
    const body = task.description || "";
    const itemId = createDraftIssue(projectNumber, owner, task.title, body);
    console.log(`Created: ${task.title} (${itemId})`);

    if (statusFieldId && statusTodoId) {
      editItemField(itemId, projectId, statusFieldId, statusTodoId);
    }
    const phaseOptId = phaseFieldId ? phaseOptionIds[task.epic] ?? null : null;
    if (phaseFieldId && phaseOptId) {
      editItemField(itemId, projectId, phaseFieldId, phaseOptId);
    }

    const itemUrl = buildProjectItemUrl(owner, projectNumber, itemId);
    projectUrls.push(itemUrl);
  }

  updateTodoWithProjectLinks(todoPath, lineIndices, projectUrls);
  console.log(`Done. Created ${tasks.length} draft issues and updated ${todoPath} with Project links.`);
}

main();
