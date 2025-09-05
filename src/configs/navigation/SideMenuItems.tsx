/**
 * Items in the SideMenu.
 * Template's SideMenu is using Ant Design's Menu component.
 *
 * This is to configure the items on the side menu.
 */
import type { MenuProps } from 'antd';
import { Link } from 'react-router-dom';

import RouteMap from './RouteMap';

type MenuItem = Required<MenuProps>['items'][number];

// const appId = sessionStorage.getItem('appId');

//* ----------------------------------------------------------------------------
const SIDE_MENU_ITEMS: MenuItem[] = [
  {
    key: RouteMap.PatientPaths.PatientList,
    label: <Link to={RouteMap.PatientPaths.PatientList}>Patient List</Link>,
  },
  {
    key: RouteMap.PatientPaths.PatientProfile,
    label: (
      <Link to={RouteMap.PatientPaths.PatientProfile}>Patient Profile</Link>
    ),
  },
];

//* Export ---------------------------------------------------------------------
export default SIDE_MENU_ITEMS;
