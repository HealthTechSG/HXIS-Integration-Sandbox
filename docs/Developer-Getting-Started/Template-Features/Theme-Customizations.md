In this guide, we will explore how to customize the theme from the React App Template.

[[_TOC_]]

---

# Introduction

The React App Template comes pre-coded with Synapxe color theme, and a sample basic layout for a typical backend system (login page, CRUD page flow with header, side menu, footer, etc).

---

# Layout Customization

The pre-coded layout components are in `/app/components/RootLayout`, and are comprises mostly from Ant Design's Layout components.

All the routes will be wrapped with the `RootLayout` by default, unless when the route is specified with `handle: { noWrap: true }` in the route definition.

For example, see `AuthRoutes.tsx` (this causes the login page to not use the `RootLayout`).

---

# Theme Customization

> Note: The theme customization template codes are still work-in-progress. Please use them as a guideline reference, they are not enforced nor a final recommendation.

The theme configurations are mostly in `/configs/theme` folder.

The template uses Ant Design and Tailwind, so the configurations are split into different files.

## AntdThemeConfig.ts

This is for customizing Ant Design's components globally via Antd's design token system. Use this file to globally customize the theme for Ant Design's components.

References

- [Ant Design's Customization Docs](https://ant.design/docs/react/customize-theme)
- [Ant Design's Theme Editor](https://ant.design/theme-editor)

## AntdTheme.css

Ant Design's built-in customization options (ie. design tokens) are very limited. There are times we will need to use additional CSS to override Ant Design's component styles.

We use this file as a workaround file to customize or fix Ant Design's limited customization capabilities.

## SynapxeTheme.css

This file contains the pre-configured Synapxe theme. We use this file to configure CSS globally.

TBA - should remove the fonts from index.html, and customize in here.

---

# Reset Theme

If you wish to remove the pre-configured theme and reset all the theme to their base form, follow below steps.

1. Edit `AntdThemeConfig.ts`, make `ANTD_THEME_CONFIG` export empty object.

```TypeScript
export const ANTD_THEME_CONFIG: ThemeConfig = { /* Delete everything inside */ }
```

2. Edit `AntdTheme.css`, and delete everything within `#app` (replace the entire file just below code)

```CSS
#app { /* Delete everything inside */ }
```

3. Edit `SynapxeTheme.css`, delete everything except the first line that import the Tailwind theme base.

```CSS
/* Pre-configured Synapxe theme */
@import './TailwindThemeBase.css';

/* Delete everything below this */
```

Once above are done, the entire app will be reset into the default Tailwind and default Ant Design theme.
