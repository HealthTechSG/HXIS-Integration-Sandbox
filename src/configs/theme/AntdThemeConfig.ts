/*
Use this to configure the Ant Design theme.
The default is now configured using Synapxe theme.

Antd Reference - https://ant.design/docs/react/customize-theme
*/
import { ThemeConfig } from 'antd';

import { SynColor, SynFont } from './SynapxeConstants';

//* ----------------------------------------------------------------------------
export const ROOT_REM_PX = 16;

//* ----------------------------------------------------------------------------
/**
 * Please add them in this logical order:
 * Color > Size > Style.
 *
 * For style of the same category that has different positions,
 * please add them in this directional order:
 * Top > Right > Bottom > Left
 *
 * For within same category, please order them logically, then alphabetically.
 * Eg: Primary > Secondary
 */
//* ----------------------------------------------------------------------------
export const ANTD_THEME_CONFIG: ThemeConfig = {
  token: {
    colorPrimary: SynColor.Purple,
    colorLink: SynColor.Purple,
    colorSplit: SynColor.BorderColor,
    fontFamily: `"${SynFont.Body}", sans-serif`,
  },
  components: {
    /**
     * Please order the components according to Antd order.
     * https://ant.design/components/overview/
     */

    //* ------------------------------------------------------------------------
    //* General
    Button: {
      defaultBorderColor: SynColor.Purple,
      defaultColor: SynColor.Purple,
      defaultHoverColor: SynColor.Fuchsia,
      defaultHoverBorderColor: SynColor.Fuchsia,

      borderColorDisabled: SynColor.Purple,
      colorBgContainerDisabled: SynColor.Lilac,
    },
    Typography: {
      colorLinkActive: SynColor.FuchsiaDark,
      colorLinkHover: SynColor.Fuchsia,
    },

    //* ------------------------------------------------------------------------
    //* Navigation
    Breadcrumb: {
      linkColor: SynColor.Purple,
      linkHoverColor: SynColor.Fuchsia,
      colorBgTextHover: 'none',
    },
    Menu: {
      itemSelectedBg: SynColor.Lavender,
      itemBorderRadius: 0,
      itemMarginInline: 0,
    },

    //* ------------------------------------------------------------------------
    //* Data Display
    Card: {
      headerBg: SynColor.LilacDark,
      colorBorderSecondary: SynColor.BorderColorDark,
    },
    Collapse: {
      headerBg: SynColor.LilacDark,
      colorBorder: SynColor.BorderColorDark,
    },
    Table: {
      headerBg: SynColor.Lilac,
      borderColor: SynColor.BorderColor,
      colorSplit: SynColor.LilacDark,
    },
    Tabs: {
      colorBorderSecondary: SynColor.BorderColor,
    },

    //* ------------------------------------------------------------------------
    //* Feedback
    Spin: {
      colorPrimary: SynColor.Fuchsia,
    },

    //* ------------------------------------------------------------------------
  },
};
