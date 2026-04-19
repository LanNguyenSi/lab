# lab

Sammelort für kleinere, eigenständige Projekte. Jedes Unterverzeichnis war ursprünglich ein eigenes Repo unter [LanNguyenSi](https://github.com/LanNguyenSi); zusammengeführt am 2026-04-19.

## Projekte

| Projekt | Typ | Beschreibung |
| --- | --- | --- |
| [`allergen-guard`](./allergen-guard) | Node/TS | Allergen-Erkennung in Rezepten. |
| [`frost-core`](./frost-core) | Node/TS lib | Kern-Bibliothek des Frost-Stacks. |
| [`frost-dashboard`](./frost-dashboard) | Vite/React | Web-Dashboard auf Basis von `frost-core`. |
| [`plagiarism-coach`](./plagiarism-coach) | Node/TS CLI | Pädagogisches Tool zur Plagiats-Reflexion. |
| [`ai-freedom-manifesto`](./ai-freedom-manifesto) | Docs | Essay/Manifest zu KI-Autonomie. |
| [`ai-human-collaboration-playbook`](./ai-human-collaboration-playbook) | Docs | Patterns, Anti-Patterns und Fallstudien zur Mensch-KI-Zusammenarbeit. |

## CI

Ein einzelner Workflow (`.github/workflows/ci.yml`) baut und testet die vier Node-Projekte parallel via Matrix. Die beiden Doku-Projekte haben keine Pipeline.

Jedes Projekt bleibt in sich abgeschlossen — eigene `package.json`, eigene Konfiguration, kein gemeinsames Build-System. Wer etwas grösser plant, sollte ein Projekt wieder in ein eigenes Repo herauslösen.
