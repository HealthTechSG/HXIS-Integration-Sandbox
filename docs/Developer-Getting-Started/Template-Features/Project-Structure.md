This document outlines the project structure of the React App Template.

[[_TOC_]]

---

# Root Folder

From the project root, below are the representation of the first-level folders and important files.

```
.
|
+-- /docs           # For markdown documentations used for the project wiki.
|
+-- /env            # Config files for environment variables.
|
+-- /node_modules   # Contains downloaded sources of dependency libraries.
|
+-- /public         # For publicly accessible static files.
|
+-- /src            # Application source files.
|
+-- index.html      # The entry point that loads the entire React application.
|
+-- package.json    # The main configuration file for npm.
|
+-- (...other root level config files)
```

## docs folder

The `/docs` folder contains markdown documentations used for the project wiki. The wiki is published as a code wiki (TBA - Add the React App Template wiki link here).

Reference: [Azure DevOps Markdown Guide](https://learn.microsoft.com/en-us/azure/devops/project/wiki/markdown-guidance?view=azure-devops)

## env folder

The `/env` folder contains the `.env` environment variable config files for use in React and Vite.

To add more environment variables:

1. Add the same entry into all the `.env` files in the `/env` folder. Make sure the variable name start with `VITE_`.
1. Edit `env.d.ts` file to add in the new variable name.
1. Use `import.meta.env.VITE_xxx` in your code to access the environment variable value.

## node_modules folder

The `/node-modules` folder is the default folder automatically created by npm when downloading and installing project-specific dependencies.

It should be added into `.gitignore` and should not be committed into the repo.

If your project is having library or dependency issues, one of the first thing to try during troubleshooting is to delete this folder and re-install the dependencies via `npm install`.

## public folder

The `/public` folder is for storing publicly accessible static files. Any files stored within this folder will be directly packaged into the build output without any processing.

You should use this to store static images, fonts, documents (eg. user guide PDFs), or any other static data files that are meant to be publicly accessible.

FAQ - [Public vs Assets](#public-vs-assets)

---

# src folder

The `/src` folder contains most of the code in the React app. Below are the representation of the first-level folders and important files.

```
/src
|
+-- /app
|   +-- /components     # Core components for the app, including layouts, templates, etc.
|   +-- /hooks          # Hooks used only by the app.
|   +-- /providers      # App providers and configurations.
|   +-- /utils          # Utils used only by the app.
|   +-- App.tsx         # Entry-point for the React app, initialized by main.tsx
|
+-- /assets             # Static files used by the app.
|
+-- /common             # Contains common reuseable code shared by the features.
|   +-- /components     # Common components shared by the features.
|   +-- /constants      # Common constants shared by the features.
|   +-- /hooks          # Common hooks shared by the features.
|   +-- /types          # Common TypeScript types.
|   +-- /utils          # Common utility class and wrappers.
|
+-- /configs            # Global configurations for the app, external libraries, etc.
|
+-- /features           # Feature based modules.
|
+-- /redux              # Redux slice and stores.
|
+-- /services           # API-related code, mostly RTK Query APIs.
|
+-- /utils              # Utility functions used globally, not directly related to the features.
|
+-- main.tsx            # Main entry-point for the React app.
```

## app folder

The `/app` folder contains all the core features for the app, including layout, template, global
initialization related code.

## assets folder

The `/assets` folder is for storing static assets used in the app, including images, svgs,
or other static data files.

FAQ - [Public vs Assets](#public-vs-assets)

## services folder

The `/services` folder will contain the API calls and their related codes. If you're using RTK Query, the queries and mutations will be here.

---

# features folder

For easy scalability and maintenance, organize most of the code within the `/features` folder. Each feature folder should contain code specific to that feature, keeping things neatly separated.

A feature could have the following structure:

```
/src/FeatureName
|
+-- /assets         # Static files used within this feature.
|
+-- /components     # Components for this feature.
|
+-- /constants      # Constants defined for this feature.
|
+-- /hooks          # Custom hooks used in this feature.
|
+-- /routes         # Routes defined for this feature.
|
+-- /types          # TypeScript type definitions used in this feature.
|
+-- /utils          # Utility functions used in this feature.
|
+-- index.ts
```

NOTE: You don't need all of these folders for every feature. Only include the ones that are necessary for the feature.

## Unidirectional Codebase

Under normal circumstances, code should flow only in one direction:

::: mermaid
flowchart LR
Services --> Common --> Features --> App
:::

This means:

- App can import from Features/Common/Services
- Features can import from Common/Services
- Common can only import from Service

## Avoid Cross-Feature import

Code within a feature should only be scoped to use within the feature itself. Cross-feature import should be avoided.

TBA - solution on refactoring cross-feature codes

---

# Public vs Assets

Read [Vite's Docs - Static Asset Handling](https://vitejs.dev/guide/assets.html#the-public-directory)

In short, use the `/public` folder if:

- You need to reference this file outside of React (eg: `index.html`, favicon, font file).
- You want to retain the original file path and file name, to expose it as a publicly accessible file (eg. `UserManual.pdf`, `UploadTemplate.xlsx`).

Otherwise, use the `/src/assets` or `/features/Xxx/assets` folder.
