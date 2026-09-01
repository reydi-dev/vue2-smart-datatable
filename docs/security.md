# Security

- Core renderers never use `v-html`; ordinary markup-looking values are displayed as text.
- Custom slots are a trust boundary. Consumers must sanitize any HTML they choose to render.
- New-tab links include `noopener noreferrer`. Core link and image renderers reject unsafe URL schemes; custom slots must apply their own URL policy.
- CSV output mitigates spreadsheet formula injection and escapes quotes/newlines. Consumers should retain those safeguards in custom exporters.
- Providers own authentication and authorization. The table does not inspect tokens, roles, permission names, or sensitive field policies.
- Do not store sensitive filters or data in the column persistence adapter; the included adapter stores only column keys.

## Unsupported framework advisories

Vue 2 and Vuetify 2 are end-of-life. At the time of the 0.1.0 implementation, `npm audit` reports three low, one moderate, and one high advisory in the required toolchain, including Vuetify prototype-pollution and date-picker XSS advisories. No compatible Vuetify 2 fix is available; npm proposes a breaking upgrade outside this package's Vue 2.7/Vuetify 2.6 contract. Owners must explicitly accept this risk or migrate the host application before a public release.
