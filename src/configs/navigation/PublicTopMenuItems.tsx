/**
 * Items in the SideMenu.
 * Template's SideMenu is using Ant Design's Menu component.
 *
 * This is to configure the items on the side menu.
 */
import { HomeOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Link } from 'react-router-dom';

import RouteMap from './RouteMap';

type MenuItem = Required<MenuProps>['items'][number];

// const appId = sessionStorage.getItem('appId');

//* ----------------------------------------------------------------------------
const PUBLIC_TOP_MENU_ITEMS: MenuItem[] = [
  {
    key: RouteMap.RootPath,
    label: <Link to={RouteMap.RootPath}>Home</Link>,
    icon: <HomeOutlined />,
  },
  {
    key: RouteMap.PatientPaths.PatientList,
    label: <Link to={RouteMap.PatientPaths.PatientList}>Patients</Link>,
    icon: <UserOutlined />,
  },
  // {
  //   key: 'Educations',
  //   label: <Link to={RouteMap.EducationPaths.EducationList}>Educations</Link>,
  //   icon: <SolutionOutlined />,
  // },
  // {
  //   key: 'Custom Inventory',
  //   label: (
  //     <Link to={RouteMap.CustomInventoryPaths.CustomInventoryList}>
  //       Custom Inventory
  //     </Link>
  //   ),
  //   icon: <TruckOutlined />,
  // },
];

//* Export ---------------------------------------------------------------------
export default PUBLIC_TOP_MENU_ITEMS;
