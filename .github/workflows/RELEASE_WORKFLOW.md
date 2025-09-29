# :package: Release Workflow

This repository uses GitHub Actions to automatically publish to:

-   **npmjs.org**
-   **GitHub Packages**
-   **GitHub Releases**

To keep everything in sync, follow this workflow:

---

## 1. Work on a dev branch

Make your changes in a feature branch (or `dev`), and open a PR into `main`.

---

## 2. Bump the version

Once the PR is merged, update the version locally:

```bash
npm version patch     # or minor / major
```

This will:

-   Update package.json and package-lock.json
-   Create a git tag like v1.2.3

---

## 3. Push the branch and tag

```bash
git push origin main
git push origin v1.2.3
```

⚠️ **Do not skip the tag** — the GitHub Actions workflow only runs on version tags.

---

## 4. CI/CD runs automatically

The GitHub Actions pipeline will:

-   Verify the package.json version matches the tag
-   Check npm authentication
-   Publish to npmjs.org (skips gracefully if version already exists)
-   Publish to GitHub Packages
-   Create a GitHub Release

---

## 5. Done!

-   npmjs.org has the new version
-   GitHub Packages tab is updated
-   GitHub Releases tab is updated
-   Everything stays in sync ✅

---

## ⚠️ Don’ts

-   **Don’t run `npm publish` manually**
-   **Don’t create tags by hand without bumping `package.json`**
-   **Don’t skip pushing the tag**

---
