import { Card, Alert, Divider } from 'antd';
import React from 'react';

import CustomInventoryTable from './CustomInventoryTable';
import { BasePage, AddButton } from '@/common/components';
import { RouteMap } from '@/configs';

//* FC -------------------------------------------------------------------------
const CustomInventoryListPage: React.FC = () => (
  <BasePage
    actions={
      <AddButton href={RouteMap.CustomInventoryPaths.CustomInventoryCreate} />
    }
  >
    <Card>
      <Alert
        className="mb-4"
        message={
          <p>
            This is a custom resource demonstrated in the{' '}
            <b>FHIR Nexus (Demo)</b> project. Please refer to the project wiki
            for the setup guide.
          </p>
        }
        showIcon
        type="info"
      />
      <Divider />

      <CustomInventoryTable />
    </Card>
  </BasePage>
);

//* Export ---------------------------------------------------------------------
export default CustomInventoryListPage;
