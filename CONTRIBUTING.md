# Contributing

Use Node.js 20 or newer. Install dependencies with `npm install` and keep public implementation changes under `src/`.

Open an issue before starting a large API change. Keep pull requests focused, add tests for behavior changes, and update the public documentation when a contract changes. New functionality must remain backend-neutral and must not require application-owned routing, state, permissions, services, or assets.

Before submitting a change, run:

```sh
npm run format:check
npm run lint
npm run typecheck
npm run test:unit
npm run test:e2e
npm run build
npm run test:dist
npm run build:demo
```

Do not publish packages or create release tags without maintainer approval. The npm package identity remains intentionally undecided during the GitHub preview phase.
