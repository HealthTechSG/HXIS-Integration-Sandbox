import {
  CustomInventoryListPage,
  CustomInventoryAddPage,
  CustomInventoryViewPage,
  CustomInventoryEditPage,
} from '../components';
import type { BasePageRouteObject } from '@/common/types';
import { RouteMap } from '@/configs';

const { CustomInventoryPaths } = RouteMap;

//* The Const ------------------------------------------------------------------
const CustomInventoryRoutes: BasePageRouteObject[] = [
  {
    path: CustomInventoryPaths.CustomInventoryList,
    element: <CustomInventoryListPage />,
    handle: {
      pageTitle: 'Custom Inventory List',
      breadcrumbs: [{ title: 'Custom Inventory List' }],
    },
  },
  {
    path: CustomInventoryPaths.CustomInventoryCreate,
    element: <CustomInventoryAddPage />,
    handle: {
      pageTitle: 'Add New Custom Inventory',
      breadcrumbs: [
        {
          title: 'Custom Inventory List',
          path: CustomInventoryPaths.CustomInventoryList,
        },
        { title: 'Add New Custom Inventory' },
      ],
    },
  },
  {
    path: CustomInventoryPaths.CustomInventoryView,
    element: <CustomInventoryViewPage />,
    handle: {
      pageTitle: 'Custom Inventory Details',
      breadcrumbs: [
        {
          title: 'Custom Inventory List',
          path: CustomInventoryPaths.CustomInventoryList,
        },
        { title: 'Custom Inventory Details' },
      ],
    },
  },
  {
    path: CustomInventoryPaths.CustomInventoryEdit,
    element: <CustomInventoryEditPage />,
    handle: {
      pageTitle: 'Edit Custom Inventory Info',
      breadcrumbs: [
        {
          title: 'Custom Inventory List',
          path: CustomInventoryPaths.CustomInventoryList,
        },
        {
          title: 'Custom Inventory Details',
          path: CustomInventoryPaths.CustomInventoryView,
        },
        { title: 'Edit Custom Inventory Info' },
      ],
    },
  },
];

//* Export ---------------------------------------------------------------------
export default CustomInventoryRoutes;
