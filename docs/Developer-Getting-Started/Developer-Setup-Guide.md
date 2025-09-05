This guide will walk you through the steps to set up your development environment for the project.

> **Note**: This guide is meant for Synapxe SEED members using DIM machine.

[[_TOC_]]

---

# Node.js

For DIM machine, it might come with Node.js pre-installed. Check that your version is compatible with the project.

If the version is incompatible (eg: too outdated), we recommend uninstalling it from the DIM, and use the prebuilt-binaries version for local development.

Refer to [NodeJS Installation Guide](./Developer-Setup-Guide/Install-NodeJS.md).

---

# Visual Studio Code (VS Code)

This IDE should come pre-installed with DIM. If you do not have it, you may try to install it yourself, or head over to Tech Cafe and get them to install for you.

For the rest of the guides (including development guides), it will be based on the assumptions that VS Code is the primary IDE that we use.

Below are the VS Code extensions recommended for this project.

- **ESLint** (by Microsoft) - Integrates with ESLint configured for the project.
- **Prettier - Code formatter** (by Prettier) - Integrates with Prettier configured for the project.
- **Tailwind CSS IntelliSense** (by Tailwind Labs) - Provides code auto-suggest for tailwind classes.
- **Vitest** (by Vitest) - Provides a nice UI for running tests.

VSCode comes with built-in Git features.

Below are some optional but useful extensions that you may consider adding.

- **Pretty TypeScript Errors** (by yoavbls) - Provides a nicer view of TypeScript errors.
- **Azure DevOps Wiki Markdown** (by NI) - Provides additional markdown preview, useful for writing markdown documentations for Azure DevOps wiki.

---

# Setup HIP Nexus Repository

The React App Template project is setup to download all dependencies via HIP Nexus Repository.

Please refer to [Guide for Configuring HIP Nexus Repository](./Developer-Setup-Guide/Configure-HIP-Nexus-Repository.md).
