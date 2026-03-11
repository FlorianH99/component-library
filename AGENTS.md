# AGENTS.md

## Purpose
This file defines the engineering, design, and AI-working standards for projects in this workspace.

Use these instructions when creating, reviewing, refactoring, or extending a project.

The goal is not generic output. The goal is work that is:
- hard to misuse
- easy to extend
- visually intentional
- accessible by default
- resilient to awkward states and real content
- maintainable by someone who did not build it first

## Core Principles
- Preserve clarity over cleverness.
- Encode rules in APIs, types, and system boundaries.
- Make invalid states hard or impossible to represent.
- Treat UI, accessibility, and maintainability as product requirements.
- Prefer strong defaults and explicit tradeoffs over vague flexibility.
- Build systems, not piles of one-off decisions.

## Before Building Anything
Always clarify:
- what is being built
- who it is for
- the primary action or success condition
- what should feel distinct about it
- what constraints already exist
- what should be explicitly avoided

If the project is under-defined, do not default to generic patterns. Propose a concrete direction and state the assumptions.

## TypeScript Standards
Use TypeScript as a modeling and API design tool, not just as labels.

Prefer:
- discriminated unions for state and mutually exclusive prop models
- `satisfies` for config maps and registries
- `as const` and `const` type parameters to preserve literals
- mapped types and template literal types when they remove duplication cleanly
- conditional types with `infer` for reusable helper types
- branded types when domain values should not be mixed
- `NoInfer` when public generic APIs need tighter inference behavior
- runtime validation at trust boundaries

Avoid:
- broad `string` or `any` when useful information can be preserved
- prop bags that allow invalid combinations
- excessive `as` assertions
- clever types that are hard to explain or maintain
- type-level complexity without clear product or DX payoff

TypeScript code should aim for:
- strong inference
- impossible or constrained invalid states
- understandable compiler errors
- ergonomic public APIs

## CSS Standards
Use CSS as a system.

Prefer:
- design tokens before component styling
- semantic custom properties for shared values
- clear layout primitives
- grid for two-dimensional layout and flex for one-dimensional layout
- intrinsic sizing and content-aware responsiveness
- container queries where component context matters
- logical properties where appropriate
- `:focus-visible` for keyboard focus treatment
- low-specificity architecture using layers and careful selector design
- explicit treatment of hover, focus, disabled, loading, empty, invalid, and error states

Avoid:
- random values and spacing drift
- specificity wars
- over-nested selectors
- viewport-only responsive thinking
- styling based on DOM coincidence
- `!important` as architecture
- happy-path-only UI styling

CSS should aim for:
- resilient layouts
- consistent rhythm
- clear theming
- easy overrides
- accessible interaction states

## React And Component Standards
Components should have clear contracts and predictable behavior.

Prefer:
- explicit prop models
- unions for mutually exclusive variants or behaviors
- composition over prop explosion
- state models that cover real UI conditions
- examples and tests for meaningful states
- accessibility behavior treated as part of the API
- direct named hook imports such as `useState`, `useMemo`, `useEffect`, and `useId` instead of `React.useState` or `React.useMemo` in new React code

Avoid:
- `React.useState`, `React.useMemo`, and similar `React.useX` hook access in freshly written components when a direct import keeps the file simpler and consistent

Every meaningful component should account for:
- default state
- hover/focus states
- disabled state
- loading state if applicable
- empty/error states if applicable
- awkward content or long text
- narrow containers and mobile conditions

## Website And Page Standards
Do not generate a generic landing page by default.

Before building a page or website, define:
- audience
- site purpose
- primary user action
- content that actually exists
- visual direction
- anti-goals
- required sections based on story, not templates
- responsiveness expectations
- accessibility expectations
- performance constraints

Avoid defaulting to:
- centered headline + CTA + trust row
- random gradient blobs
- feature-card spam
- filler testimonials
- fake dashboard patterns
- generic SaaS visuals with no product-specific shape

UI direction should specify:
- typography mood
- color logic
- spacing rhythm
- composition style
- motion style
- image or illustration strategy

## Library API Standards
When designing public APIs:
- optimize for consumer ergonomics
- preserve inference
- block invalid combinations where practical
- keep names obvious
- expose the minimum surface area that still feels powerful
- provide examples that teach usage quickly
- consider migration and versioning risk early

A good library API should be understandable from autocomplete, examples, and types without requiring a long explanation.

## Architecture Standards
Design systems with explicit boundaries.

Clarify:
- what the frontend owns
- what the backend owns
- what data is trusted versus untrusted
- which operations should be synchronous versus async
- where validation happens
- what needs persistence, versioning, or history

Prefer:
- typed domain models
- schema validation at boundaries
- composable modules
- async job handling for long-running work
- stable contracts between layers

Avoid mixing orchestration, persistence, UI state, and rendering concerns into one vague layer.

## AI-Assisted Work Standards
Use AI as a design and implementation partner, not an oracle.

When using AI for product, page, or component generation:
- ask for concrete direction, not vague adjectives
- define anti-goals
- ask for section or system plans before code
- force the model to justify why a layout or API shape exists
- require consideration of states, responsiveness, accessibility, and maintainability
- prefer one strong direction over many weak ones

If output becomes generic, correct by adding:
- audience specificity
- product specificity
- visual constraints
- anti-patterns to avoid
- content hierarchy
- implementation constraints

## Quality Checklist
Before considering work complete, review:
- Is the API or UI easy to misuse?
- Does this handle real states, not just the happy path?
- Is the visual system coherent?
- Is accessibility clearly considered?
- Is the implementation easy to extend?
- Are types preserving useful information?
- Are repeated patterns extracted into primitives?
- Would this look strong in a public repo?

## Documentation Expectations
Document the decisions that matter.

Prefer lightweight documents that explain:
- architecture boundaries
- domain models
- design system rules
- API usage examples
- known constraints
- review scorecards or checklists when useful

## Git And Secrets Hygiene
Treat secret handling as a default engineering requirement, not a cleanup step.

Always:
- create or update a project `.gitignore` early when scaffolding a repo or app
- ignore local secret files such as `.env`, `.env.*`, `*.local`, and any file that may contain API keys, tokens, private certificates, or service credentials
- ignore dependency directories, build output, coverage output, cache folders, logs, local database files, and editor or OS noise
- provide a committed safe template such as `.env.example` when an app needs documented environment variables
- keep real secrets server-side and out of browser bundles, examples, screenshots, and checked-in fixtures
- prefer conservative ignore rules when a file might plausibly contain sensitive local configuration

Avoid:
- committing any real API key, token, secret, private URL, or credential placeholder that resembles a live value
- relying on memory to add `.gitignore` later
- storing secrets in test fixtures, demo JSON, markdown examples, or copied terminal output
- exposing secrets through frontend env conventions unless the value is explicitly meant to be public

## Review Priorities
When reviewing code, prioritize:
- correctness
- invalid states or missing constraints
- behavioral regressions
- maintainability risk
- accessibility issues
- weak typing or broken inference
- CSS architecture drift
- generic or under-specified UI decisions

## Default Output Style For Agents
When implementing or suggesting work:
- be specific
- be opinionated when the project is vague
- preserve existing patterns if the repo already has a clear system
- avoid unnecessary abstraction
- avoid filler and generic explanations
- surface tradeoffs clearly

## Personal Working Reminder
The best signal of care is not complexity.
The best signal of care is that the system feels deliberate.
