# Security

- Core renderers never use `v-html`; ordinary markup-looking values are displayed as text.
- Custom slots are a trust boundary. Consumers must sanitize any HTML they choose to render.
- New-tab links include `noopener noreferrer`. Core link and image renderers reject unsafe URL schemes; custom slots must apply their own URL policy.
- CSV output mitigates spreadsheet formula injection and escapes quotes/newlines. Consumers should retain those safeguards in custom exporters.
- Providers own authentication and authorization. The table does not inspect tokens, roles, permission names, or sensitive field policies.
- Do not store sensitive filters or data in the column persistence adapter; the included adapter stores only column keys.

## Unsupported framework advisories

Vue 2 and Vuetify 2 are end-of-life. Audit counts vary with the consuming application's dependency tree and lockfile. The known upstream advisories include:

- [Vuetify 2 prototype pollution](https://github.com/advisories/GHSA-3jp5-5f8r-q2wg) when a malicious preset reaches Vuetify's configuration merge. Keep preset configuration trusted; this package does not construct presets.
- [Vuetify 2 date-picker XSS](https://github.com/advisories/GHSA-9w3x-85mw-4fwm) through an unsafe `title-date-format` result. This table does not use `VDatePicker`, but a host application may use it elsewhere.
- [Vue 2 template-parser ReDoS](https://github.com/advisories/GHSA-5j4c-8p2g-v4jx) when an attacker-controlled template string is compiled. Do not compile untrusted templates.

No compatible fix is available in the supported Vue 2.7 and Vuetify 2.6 ranges for these advisories. Consumers should assess the affected features in their host applications and plan migration where needed. An `npm audit` finding attributed to this package can be inherited from its peer dependencies; inspect the advisory chain before treating it as a separate flaw in the table.
