# Architecture Notes

## Boundaries

- The library owns rendering, visual styling, keyboard behavior, and consumer-facing APIs.
- Consumers own business rules, async orchestration, data fetching, and domain validation.
- DOM attributes and browser events are treated as untrusted edges; component APIs normalize them into narrower contracts where useful.

## Layering Rules

- Foundations may not import from components.
- Primitives may import from foundations and internal utilities.
- Components may import from foundations, primitives, and internal utilities.
- Stories and tests may import public entry points and test helpers, not private internals unless they are explicitly marked internal test utilities.

## Design Principles

- Strong defaults first. Optionality exists only when it creates real ergonomic value.
- Components should be easy to compose with form libraries and app layout systems.
- Variants express visual or semantic differences, not arbitrary one-off styling access.
- Error, disabled, loading, and long-content states are part of the contract.

## Initial Folder Shape

```text
src/
  components/
  foundations/
  hooks/
  internal/
  index.ts
stories/
docs/
```

## Export Rules

- `src/index.ts` is the public barrel.
- Components re-export their own types when those types are part of the supported API.
- Internal helpers remain unexported until there is demonstrated external value.

## Accessibility Rules

- Prefer native semantics before ARIA.
- Only add ARIA roles or relationships when native HTML does not cover the interaction.
- Interactive controls must support keyboard use and visible focus indication.
- Form controls must support label, description, and error association.

## CSS Rules

- Tokens are semantic at component-consumption points.
- Component styles remain low-specificity and module-scoped.
- State styles are explicit via data attributes or native attributes, not incidental selector chains.