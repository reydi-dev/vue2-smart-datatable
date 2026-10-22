# Security Policy

## Supported versions

The project is currently in pre-release development. Security fixes are applied to the latest code on `main` and to the latest published release candidate, when one exists.

| Version              | Supported |
| -------------------- | --------- |
| `0.1.x` pre-releases | Yes       |
| Older snapshots      | No        |

## Reporting a vulnerability

Do not open a public issue for a suspected vulnerability. Use GitHub's private vulnerability reporting feature from the repository's **Security** tab.

Include:

- affected version or commit;
- impact and realistic attack scenario;
- reproduction steps or a minimal proof of concept;
- any suggested mitigation.

Please allow the maintainer reasonable time to investigate before public disclosure. General security boundaries and known framework risks are documented in [`docs/security.md`](docs/security.md).

## Framework status

Vue 2 is end-of-life. Vuetify is no longer a dependency of this package; existing hosts may still use it. Some upstream advisories do not have compatible fixes in this project's supported version range. Consumers must review the documented risks and apply application-level mitigations where appropriate.
