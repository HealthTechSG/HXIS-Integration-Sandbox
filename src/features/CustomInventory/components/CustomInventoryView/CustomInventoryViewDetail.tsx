import type { DescriptionsProps } from 'antd';
import { Descriptions, Flex } from 'antd';
import React from 'react';
import { generatePath, useNavigate } from 'react-router-dom';

import { CustomInventoryDeleteButton } from '../CustomInventoryDelete';
import { EditButton, LoadingOverlay } from '@/common/components';
import { DateUtils } from '@/common/utils';
import { RouteMap } from '@/configs';
import { CustomInventoryLabels as Labels } from '@/features/CustomInventory/constants';
import { useGetCustomInventoryByIdQuery } from '@/services/CustomInventory/CustomInventoryService';

const { CustomInventoryPaths } = RouteMap;

//* Props ----------------------------------------------------------------------
interface CustomInventoryViewDetailProps {
  inventoryId: string;
}

//* FC -------------------------------------------------------------------------
const CustomInventoryViewDetail: React.FC<CustomInventoryViewDetailProps> = ({
  inventoryId,
}) => {
  const navigate = useNavigate();

  //* Query --------------------------------------------------------------------
  const { data, isError, isFetching } =
    useGetCustomInventoryByIdQuery(inventoryId);

  const items: DescriptionsProps['items'] = [
    {
      key: 'product',
      label: Labels.product,
      children: data?.product,
    },
    {
      key: 'warehouse',
      label: Labels.warehouse,
      children: data?.warehouse,
    },
    {
      key: 'category',
      label: Labels.category,
      children: data?.category,
    },
    {
      key: 'quantity',
      label: Labels.quantity,
      children: data?.quantity,
    },
    {
      key: 'date',
      label: Labels.date,
      children: `${DateUtils.formatDate(data?.date)}`,
    },
  ];

  const onDelete = () => {
    navigate(CustomInventoryPaths.CustomInventoryList);
  };

  //* JSX ----------------------------------------------------------------------
  return (
    <LoadingOverlay isError={isError} isLoading={isFetching}>
      <Flex gap="small" vertical>
        <Descriptions
          extra={
            <Flex gap="small">
              <EditButton
                href={generatePath(CustomInventoryPaths.CustomInventoryEdit, {
                  id: inventoryId,
                })}
              />
              <CustomInventoryDeleteButton
                id={inventoryId}
                onDelete={onDelete}
              />
            </Flex>
          }
          items={items}
          layout="vertical"
          title="Custom Inventory Details"
        />
      </Flex>
    </LoadingOverlay>
  );
};

//* Export ---------------------------------------------------------------------
export default CustomInventoryViewDetail;
