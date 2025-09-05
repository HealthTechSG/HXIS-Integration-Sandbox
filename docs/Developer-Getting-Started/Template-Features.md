This document will outline the features and resources included in the template.

Below is a summarized view of the core libraries included in the template:

| Type               | Library Name                     |
| ------------------ | -------------------------------- |
| Language/Framework | React (v18), TypeScript (v5)     |
| Dev Tools          | Vite, ESLint, Husky, Prettier    |
| Routing            | React Router (v6)                |
| UI Component       | Ant Design (v5)                  |
| Styling            | Tailwind CSS (v3)                |
| Data Fetching      | SMART on FHIR JavaScript Library |
| State Management   | Redux Toolkit & RTK Query        |
| Testing            | Vitest                           |
| Utilities          | Lodash, PWA Vite Plugin          |

[[_TOC_]]

---

# Vite

Vite - https://vitejs.dev/

We use Vite mainly for its local dev and build feature.

In the `package.json` file, under the `scripts` section, there is a list of Vite scripts pre-configured for the project.

For example:

```json
{
  "scripts": {
    "dev": "vite --mode development",
    "build-staging": "tsc && vite build --mode staging",
    "build-production": "tsc && vite build --mode production",
    "preview": "vite preview"
  }
}
```

Using `npm run dev` will start the frontend SPA in development mode, which Vite supports hot-reload.

Using `npm run build-staging` will compile the React code into a deployable bundle (loaded with staging's environment variables), which we can use it for release via HIP CI/CD.

You can configure other Vite related configurations via `vite.config.ts`. Refer to the official Vite documentations for more info.

---

# ESLint, Prettier, and Husky

ESLint - https://eslint.org/

Prettier - https://prettier.io/

Husky - https://github.com/typicode/husky

The project is pre-configured with a default set of linting and formatting rules (linting rules are extended from Airbnb's TypeScript rules).

Using Husky, We have included `pre-commit` git hooks in our template which will perform type-checking and linting during git commit.

Project teams are encouraged to use the current pre-configured rules as a base guideline, and only change the rules when necessary (up for team lead's discretion).

See [HIP Setup and Deployment](./Template-Features/HIP-Setup-and-Deployment.md) on setting up PR rules on type-checking and linting.

---

# Routing

React Router - https://reactrouter.com/en/main

The project mainly uses the `BrowserRouter` for setting up the routes.

To add new routes:

1. Add new entries into `RouteMap.ts`.
1. Each `feature` should have their own sets of `XxxRoutes.tsx` files. Define the routes and the page components.
1. Update the `/src/features/Routes.ts` if necessary.

---

# Ant Design

Ant Design - https://ant.design/

The project and the pre-built CRUD flow are primarily made using Ant Design's components. Please refer to Ant Design's official documentations when using and developing UI components.

The React App Template project has included a few pre-made pre-styled components that are built on top of Ant Design's components. They can be found in the `/common/components` folders. Some uesful ones including the buttons, `BasePage`, `BaseTable`, etc.

---

# Tailwind CSS

Tailwind CSS - https://tailwindcss.com/

There are 2 main ways we utilize Tailwind CSS:

**1. Apply Tailwind CSS classes onto DOM or components.**

Example:

```React
<SomeComponent className='p-0 mr-2' />
```

**2. Apply Tailwind rules in CSS**

Example:

```CSS
.ant-pagination {
  @apply justify-center;

  .ant-pagination-total-text {
    @apply absolute left-0;
  }

  .ant-pagination-options {
    @apply absolute right-0;
  }
}
```

Project is configured with postcss-nesting, so css styles can be nested.

---

# SMART on FHIR

SMART on FHIR JavaScript Library - https://docs.smarthealthit.org/client-js/

We use the FhirClient in conjunction with RTK Query, in order to parse and process the JSON data objects used in the UI components into FHIR format when calling the FHIR backend API.

---

# Redux Toolkit & RTK Query

Redux Toolkit - https://redux-toolkit.js.org/

RTK Query - https://redux-toolkit.js.org/rtk-query/overview

Redux Toolkit & RTK Query are both very complex library to be explained in a project documentation.

If you wish to learn more about Redux Toolkit and RTK Query, please refer to SEED Induction Learning section.

[SEED Knowledge Hub - SEED Induction (Intranet)](https://healthsg.sharepoint.com/sites/SEEDKnowledgeHub/SitePages/SEED-Induction.aspx)

---

# Vite PWA Plugin

Vite PWA - https://vite-pwa-org.netlify.app/

This library simplifies the integration and implementation of service-workers into the React App, and makes it compatible with Vite for development use.

The main reason we are using service-workers is because the FHIR client has issues resolving references when:

- The FHIR server has a non-conventional auth method, or;
- The FHIR server is configured to block CORS.

Feel free to remove or extend the service-workers pre-implemented in the FHIR React App Template.

---

# Vitest

Vitest - https://vitest.dev/

Vitest is included into the template, and is used primarily for Unit Testing.

To run the tests, use `npm run test`.

To run the test in VS Code IDE, install the "Vitest" extension.
