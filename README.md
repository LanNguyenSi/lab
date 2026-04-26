# lab

A home for smaller, self-contained projects. Each subdirectory used to live as its own repo under [LanNguyenSi](https://github.com/LanNguyenSi); consolidated on 2026-04-19.

## Projects

| Project | Type | Description |
| --- | --- | --- |
| [`allergen-guard`](./allergen-guard) | Node/TS | Allergen detection in recipes. |
| [`frost-core`](./frost-core) | Node/TS lib | Core library of the Frost stack. |
| [`frost-dashboard`](./frost-dashboard) | Vite/React | Web dashboard built on `frost-core`. |
| [`plagiarism-coach`](./plagiarism-coach) | Node/TS CLI | Pedagogical tool for plagiarism reflection. |
| [`notification-service`](./notification-service) | PHP | Notification dispatcher service. |
| [`taskflow`](./taskflow) | Next.js / Prisma / SQLite | Multilingual personal task manager (EN/DE/VI). Imported as-is; not in the matrix CI. |
| [`ai-freedom-manifesto`](./ai-freedom-manifesto) | Docs | Essay/manifesto on AI autonomy. |
| [`ai-human-collaboration-playbook`](./ai-human-collaboration-playbook) | Docs | Patterns, anti-patterns, and case studies for human–AI collaboration. |

## CI

A single workflow (`.github/workflows/ci.yml`) builds and tests the four Node projects in parallel via a matrix. The PHP and docs-only projects have no pipeline yet.

Each project stays self-contained — its own `package.json`, its own configuration, no shared build system. If a project outgrows this setup, extract it back into a dedicated repo.
