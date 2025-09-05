import { Card } from 'antd';
import React from 'react';
import { useParams } from 'react-router-dom';

import CustomInventoryViewDetail from './CustomInventoryViewDetail';
import { BasePage, BackButton } from '@/common/components';
import { RouteMap } from '@/configs';

const { CustomInventoryPaths } = RouteMap;

//* FC -------------------------------------------------------------------------
const EducationViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const inventoryId = id!;

  //* JSX ----------------------------------------------------------------------
  return (
    <BasePage
      actions={
        <BackButton href={CustomInventoryPaths.CustomInventoryList}>
          Back to listing
        </BackButton>
      }
    >
      <Card>
        <CustomInventoryViewDetail inventoryId={inventoryId} />
      </Card>
    </BasePage>
  );
};

//* Export ---------------------------------------------------------------------
export default EducationViewPage;
