/**
 * Items in the SideMenu.
 * Template's SideMenu is using Ant Design's Menu component.
 *
 * This is to configure the items on the side menu.
 */
import type { MenuProps } from 'antd';

type MenuItem = Required<MenuProps>['items'][number];

// const appId = sessionStorage.getItem('appId');

//* ----------------------------------------------------------------------------
const SIDE_MENU_ITEMS: MenuItem[] = [
  {
    key: 'patient-list',
    label: 'Patient List',
  },
  {
    key: 'practitioner-list',
    label: 'Practitioner List',
  },
  {
    key: 'location-list',
    label: 'Location List',
  },
  {
    key: 'list-list',
    label: 'List Management',
  },
];

//* Export ---------------------------------------------------------------------
export default SIDE_MENU_ITEMS;
