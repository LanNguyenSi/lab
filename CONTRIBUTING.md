# Contributing to lab

Thanks for your interest. `lab` is a home for smaller, self-contained projects, each in its own top-level directory.

## Issues

- Bug reports: name the affected sub-project (e.g. `frost-core`, `taskflow`, `notification-service`).
- Feature requests: describe the use case before the proposed shape.

## Pull Requests

1. Fork, branch off `master` (e.g. `feat/<sub-project>/<scope>`).
2. Keep changes scoped to a single sub-project where possible.
3. Run the sub-project's local checks (each has its own README and tooling):

   ```bash
   cd <sub-project>
   # follow that project's README for install / build / test
   ```

4. Open the PR with a clear summary, motivation, and test plan; mention which sub-project it touches.

## Sub-projects

Each top-level directory is independent. See `<sub-project>/README.md` for what it does and how to run it.

## Style

Match the surrounding code in the affected sub-project. Prefer small, reviewable diffs.
