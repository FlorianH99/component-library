# Aster UI

Aster UI is a custom React component library built as a production-style system rather than a demo bundle.

## Product Direction

- Audience: product teams that want accessible, composable primitives with stronger defaults than ad hoc in-app components.
- Primary success condition: teams can adopt components quickly without fighting weak typing, inconsistent styling, or inaccessible defaults.
- Distinctive qualities: restrained, editorial visual language; strict TypeScript contracts; CSS Modules backed by shared design tokens; low-level primitives that scale into higher-level components.
- Constraints: React + TypeScript, CSS Modules, no styling framework dependency, public-library-grade docs/tests, strong accessibility defaults.
- Anti-goals: generic prop bags, template-looking demos, theme drift, snapshot-only tests, style systems coupled to DOM accidents.

## Architecture Summary

The library is organized in four layers:

1. `foundations`
   - design tokens, semantic theme variables, typography, motion, focus-ring rules, visually hidden utility
2. `primitives`
   - low-level building blocks such as slots, field context helpers, portals, and reusable hooks
3. `components`
   - opinionated but composable UI components built on primitives and tokens
4. `docs/tests`
   - Storybook stories, API examples, behavior tests, and architecture notes that prove real usage

## Initial Component Taxonomy

- Foundations
  - theme tokens
  - typography and surface rules
  - spacing, radii, shadows, motion, z-index scale
  - focus ring and visually hidden utility
- Form primitives
  - `Field`
  - `FieldLabel`
  - `FieldDescription`
  - `FieldError`
- Actions and status
  - `Button`
  - `IconButton`
  - `Badge`
- Content containers
  - `Card`
- Inputs
  - `Input`
  - `Textarea`
  - `Checkbox`
  - `Switch`
- Disclosure and navigation
  - `Tabs`
  - `Dialog`

## Public API Strategy

- Export only stable component entry points from `src/index.ts`.
- Keep internal utilities under `src/internal` and avoid exporting them until there is a real external use case.
- Prefer focused component props and composition APIs over broad style or behavior overrides.
- Reserve polymorphism for cases where it improves ergonomics without weakening type safety.

## Styling Strategy

- Use CSS Modules for component-level styles.
- Define tokens once in `src/foundations/tokens.css`.
- Map raw tokens to semantic variables in `src/foundations/theme.css`.
- Components consume semantic variables instead of hard-coded values.
- Treat hover, focus-visible, disabled, invalid, loading, and awkward-content states as first-class states in styles.

## TypeScript Strategy

- Use strict compiler settings and declaration output suitable for library consumers.
- Model mutually exclusive props with discriminated unions.
- Preserve literals with `as const` and `satisfies`.
- Add runtime guards only at trust boundaries and DOM interop edges.

## Testing Strategy

- Use Vitest + Testing Library for behavior tests.
- Test keyboard interaction, accessibility-critical behavior, controlled/uncontrolled APIs, and disabled/error states.
- Avoid snapshot-driven coverage as the primary quality signal.

## Documentation Strategy

- Use Storybook for live component documentation and state coverage.
- Keep short architecture notes in `docs/`.
- Each component should ship with stories that cover meaningful states, not just default renders.