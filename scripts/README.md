# Scripts

## TODO to GitHub Projects (draft issues)

`todo-to-gh.ts` parses `docs/TODO.md` and creates **draft issues** in a GitHub Project via the `gh` CLI. Only **open** tasks (`[ ]`) are synced; completed items (`[x]`) are skipped. After each draft issue is created, the script appends a **Project** link to the corresponding line in the TODO file (e.g. ` [Project](https://github.com/...)`) so you can jump from the TODO to the item in the project.

### Prerequisites

- [GitHub CLI](https://cli.github.com/) installed and authenticated (`gh auth login`)
- **Project scope** for `gh`: run `gh auth refresh -s project` so the token can list and create project items
- A GitHub Project (classic or Projects v2) with the desired board

### Usage

```bash
# Dry run: parse TODO and print task list as JSON (no API calls)
pnpm run todo-to-gh -- --dry-run <project-number> [owner]

# Create draft issues in the project (default owner: @me)
pnpm run todo-to-gh -- <project-number> [owner]

# Use a config file (copy gh-project.config.example.json to gh-project.config.json)
pnpm run todo-to-gh

# Override TODO path or config path
pnpm run todo-to-gh -- --todo docs/TODO.md --config scripts/gh-project.config.json 1 @me
```

You can also run `pnpm exec tsx scripts/todo-to-gh.ts ...` directly.

**Arguments**

- `project-number` — Your GitHub Project number (e.g. `1`). Required unless provided via config.
- `owner` — Project owner: `@me` (default) or an org/user login.

**Flags**

- `--dry-run` — Parse only; output JSON and exit. No `gh` calls.
- `--todo <path>` — Path to the TODO file (default: `docs/TODO.md`).
- `--config <path>` — Path to JSON config (default: `scripts/gh-project.config.json`).

### Config file

Optional. Copy the example and set your project and owner:

```bash
cp scripts/gh-project.config.example.json scripts/gh-project.config.json
# Edit scripts/gh-project.config.json: projectNumber, owner, optional todoPath
```

`scripts/gh-project.config.json` is gitignored so your local project/owner stay out of the repo.

### Project setup (optional but recommended)

The script sets two kinds of fields when they exist:

1. **Status** — Single-select. It looks for an option named **Todo** or **Backlog** and assigns it to every new draft issue.
2. **Phase** or **Epic** — Single-select. If you add a field named **Phase** or **Epic** with these options, the script will set them from the TODO structure:
   - **MVP**
   - **Post-MVP**
   - **Social**
   - **Technical**
   - **Agentic suggestion**

If Status or Phase/Epic are missing, draft issues are still created with title and description only.

### Mapping from TODO to Phase/Epic

| TODO section / nesting | Phase / Epic |
|-------------------------|--------------|
| `## MVP`                 | MVP          |
| `## Post-MVP` (top-level)| Post-MVP     |
| Sub-tasks under "Agentic suggestion pre-validation" | Agentic suggestion |
| `### Social`             | Social       |
| `### Technical`          | Technical    |

### Notes

- **One-way sync**: TODO → Project only. Re-running the script creates **new** draft issues; it does not update or deduplicate existing ones.
- **TODO links**: After creating draft issues, the script updates the TODO file in place, appending a ` [Project](url)` link to each corresponding task line. Lines that already contain a Project link are left unchanged.
- **Draft issues** live only in the project until you convert them to repo issues (e.g. from the project UI). No issues are created in the repository by this script.
