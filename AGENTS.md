
# React Development Guideline

This guide outlines best practices, conventions, and standards for modern web development using TypeScript and React.js with Next.js framework

## Technologies

- TypeScript
- ReactJS
- Next.js
- Framer Motion
- React Hook Form
- Zod
- Tailwind CSS

## Development Philosophy

- Write clean, maintainable, and scalable code.
- Apply **YAGNI** and **KISS** principles; avoid speculative hooks.
- Consider SOLID and DRY when they don't harm readability.
- Prefer functional and declarative patterns.
- Emphasize type safety and static analysis.
- Practice component-driven development.

## Code Implementation Guidelines

### Code Style

- Follow ESLint rules (see `eslint.config.mjs`).
- Limit line length to 100 characters (enforced by `max-len` rule).
- Use double quotes for strings (enforced by `quotes` rule).
- Always use semicolons (enforced by `semi` rule).
- Eliminate unused variables (enforced by `@typescript-eslint/no-unused-vars`).
- Keep files under 200 lines.
- Maximum 1 class per file (enforced by `max-classes-per-file`).
- Alphabetize imports within their groups (enforced by `import/order`).
- Import groups order: builtin → external → internal → sibling/parent → index.
- No newlines between import groups.
- Use consistent brace style (1tbs with single-line allowed).
- Maintain proper block spacing and end-of-line formatting.

## Naming Conventions

### General Rules

- **PascalCase**: Components, type definitions, interfaces
- **kebab-case**: Directory names (e.g., `components/auth-wizard`)
- **camelCase**: Hooks files, variables, functions, methods, hooks, properties, props
- **UPPERCASE**: Environment variables, component-level constants, global configs

### Specific Patterns

- Event handlers: `handleClick`, `handleSubmit`
- Boolean variables: `isLoading`, `hasError`, `canSubmit`
- Custom hooks: `useAuth`, `useForm`
- Use complete words except: `err`, `req`, `res`, `props`, `ref`

## React Best Practices

### Component Architecture

- Use functional components with TypeScript interfaces.
- Define components as arrow functions.
- Extract props interface to separate `.types.ts` file
  - **Never create empty interfaces** that just extend other types
  - Use base types directly when no additional properties are needed
- When component logic exceeds 5 lines of code - extract it into component-specific hook(s).
- Avoid logic and calculations in .jsx files. Only basic branching allowed.
- Use `React.memo()` only when needed to optimize performance issue.
- Clean up in `useEffect`.
- Compose components followint Component Structure.
- Extract repeated small (under 10 lines) jsx components into sub-components from the component,
but keep in the same parents' component file.

### Component Structure

``` js
my-component/
    ├─ MyComponent.tsx
    ├─ MyComponent.types.ts
    ├─ MyComponent.constants.ts
    ├─ useMyComponent.ts
    └─ index.ts
```

### Folder Naming Guidelines

- **Default**: Folder names should align with component names
- **Exception**: Use shorter names when parent folders provide clear context
  - ✅ `/triggers/email/automated/AutomatedEmailTriggers.tsx`
  - ❌ `/triggers/email/automated-email-triggers/AutomatedEmailTriggers.tsx`
- **Rule**: If it feels redundant, use contextual naming

### Performance Optimization

- Use `useMemo` for expensive computations.
- Avoid inline functions in JSX.
- Use proper `key` props in lists (avoid index as key).

## TypeScript Implementation

- Enable strict mode.
- Prefer derived types when possible
- don't use `any` type
- Define clear interfaces for props, state, Redux state, but only when not empty.
  - ❌ Avoid: `interface MyProps extends SomeType {}` (empty interface)
  - ✅ Prefer: Use the base type directly `(props: SomeType) => {}`
  - ✅ Good: `interface MyProps { customProp: string; otherProp: number }` (adds value)
- Avoid specifying return type when possible
- Re-export from index files only components beein used elsewhere
- Use type guards for `undefined`/`null`.
- Apply generics where needed.
- Use utility types (`Partial`, `Pick`, `Omit`).
- Prefer `interface` for objects, `type` for unions.
- Use mapped types for dynamic variations.

## Next.js utilisation

- Follow App Router approach
- Prefer server-side rendering when possible
- Prefer static pages over dynamic pages while possible
- Do most calculation and data aggregation server side

## UI and Styling

### Component Libraries

- Use radix-ui and shadcn/ui for consistent, customisable and accessible design.
- Apply composition for modular, reusable components.
- Keep component focused on one goal
- Extract component to reusable component library when it's used more than once
- Avoid customizing component structure with boolean props when possible

### Styling Guidelines

- Use Tailwind CSS for utility-first styling.
- Design desktop-first, then implement mobile adaptation.
- Follow Tailwind theme and variables.
- Maintain consistent spacing.
- **Keep Tailwind classes inline** in components for better readability.
- Only extract styling constants for truly reusable values (colors, spacing scales).

### Constants

- Keep reusable stings and variables in separate constants file
- That should include URLs, Env variables and commonly used values

### Local State

- Keep state minimal; rely on remote API API state when possible.
- Use `useState` for component state.
- Use `useContext` for shared state only when needed.
- Initialize state properly.

## Error Handling and Validation

### Form Validation

- Use Zod for schema validation.
- Prefer minimal Zod schemas.
- Use React Hook Form for forms.
- Consider different in/out schemas for `useForm`.
- Implement proper error messages.

### Error Boundaries

- Use error boundaries to catch errors in React trees.
- Log errors to external services (e.g., Sentry).
- Design user-friendly fallback UIs.

## Testing

### Unit Testing

- Write thorough unit tests for functions and components.
- Use Vitest and React Testing Library.
- Follow Arrange-Act-Assert pattern.
- Mock dependencies and API calls.

### Integration Testing

- Focus on user workflows.
- Set up/tear down environments for test independence.
- Use snapshot testing selectively.
- Use utilities (e.g., `screen` in RTL) for readability.

## Accessibility (a11y)

- Use semantic HTML.
- Apply accurate ARIA attributes.
- Ensure keyboard navigation.
- Manage focus order and visibility.
- Maintain color contrast.
- Follow logical heading hierarchy.
- Make interactive elements accessible.
- Provide clear error feedback.

## Security

- Sanitize input to prevent XSS.
- Use DOMPurify for HTML sanitization.
- Use authentication to hide any sensetive data.
- Prevent secret leaks in environment variables.

## Documentation

- Preffer good nameing instead of documentation.
- Use JSDoc for reusable hooks.
- Keep descriptions concise.

## Development Server Rules

- **NEVER start development servers without explicit user permission**
- **ALWAYS ask before running `pnpm dev` or any development server commands**
- **ALWAYS stop development servers after use** - Use `pkill -f "pnpm dev"` or `kill -9 <PID>` to terminate processes
- **Check for running processes** with `lsof -i :3000` (frontend) and `lsof -i :3001` (backend) before starting new sessions
- **Verify ports are free** before starting new development sessions

## Utils

- Use `pnpm` as package manager.
- Use `npx` if package isn't installed.
- Use common scripts from `package.json` for:
  - build
  - test
  - lint
  - start dev server (ONLY with explicit permission)
