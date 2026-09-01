# Contributing

Use Node.js 20 or newer. Install dependencies with `npm install` and keep public implementation changes under `src/`.

Before submitting a change, run:

```sh
npm run format:check
npm run lint
npm run typecheck
npm run test:unit
npm run build
npm run test:dist
```

Do not publish or push releases from automation. The final npm identity and license require owner confirmation.
