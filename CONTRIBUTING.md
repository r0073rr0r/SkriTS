# Contributing to SkriTS

Thanks for contributing.

## Development Setup

1. Use Node.js 18+.
2. Clone the repository.
3. Install dependencies:

```bash
npm install
```

4. Run tests:

```bash
npm test
```

5. Run coverage (required):

```bash
npm run test:coverage
```

## Project Scope

SkriTS contains multiple text transformation modules:

- `src/satrovacki.ts`
- `src/utrovacki.ts`
- `src/leet.ts`
- `src/leetrovacki.ts`
- `src/skrit.ts` (main router API)
- `src/core/` (shared utilities)

If you add a new transformation mode, wire it through `src/skrit.ts` and `src/index.ts`, and add tests.

## Coding Guidelines

- Keep code and comments in English.
- Preserve existing behavior unless your PR explicitly changes a rule.
- Add or update tests for every behavior change.
- Keep examples in `README.md` aligned with real output.
- Maintain parity with Python `skrit` and `SkritPHP` behavior.

## Pull Requests

1. Open an issue first for non-trivial changes.
2. Create a focused branch and keep the PR small.
3. Include:
   - what changed
   - why it changed
   - test details
4. Ensure all tests pass before requesting review.

## Commit Messages

Use clear, scoped commit messages. Example:

`feat(leet): add readable profile edge-case handling`
