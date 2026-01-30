---
description: Build, package, and ship code to the CEMOS repository on main branch
---

This workflow automates the process of building the application and pushing the latest changes to the main branch of the CEMOS repository.

1. **Build Verification**: Ensures the codebase is stable and passes all build checks.
// turbo
2. Run `npm run build`

3. **Staging**: Stage all modified and new files.
// turbo
4. Run `git add .`

5. **Commit**: Capture the current state with a ship message.
6. Run `git commit -m "Ship: OutcomeOS Pulse Intelligent UI enhancements"`

7. **Push**: Deploy the changes to the remote main branch.
// turbo
8. Run `git push origin main`
