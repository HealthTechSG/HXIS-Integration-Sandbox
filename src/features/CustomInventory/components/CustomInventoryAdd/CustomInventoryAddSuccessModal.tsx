import { Modal, Alert } from 'antd';
import React from 'react';
import { generatePath } from 'react-router-dom';

import { RedirectButton, BackButton } from '@/common/components';
import { RouteMap } from '@/configs';

const { CustomInventoryPaths } = RouteMap;

//* Props ----------------------------------------------------------------------
interface CustomInventoryAddSuccessModalProps {
  open: boolean;
  inventoryId?: string;
}

//* FC -------------------------------------------------------------------------
const CustomInventoryAddSuccessModal: React.FC<
  CustomInventoryAddSuccessModalProps
> = ({ inventoryId, open }) => {
  const listingPath = generatePath(CustomInventoryPaths.CustomInventoryList);

  const detailPath = generatePath(CustomInventoryPaths.CustomInventoryView, {
    id: inventoryId,
  });

  //* JSX ----------------------------------------------------------------------
  return (
    <Modal
      closable={false}
      footer={[
        <BackButton key="list" href={listingPath}>
          Back to listing
        </BackButton>,
        <RedirectButton key="detail" href={detailPath} type="primary">
          Go to details
        </RedirectButton>,
      ]}
      open={open}
    >
      <Alert
        description="Inventory record has been created successfully."
        message="Success!"
        showIcon
        type="success"
      />
    </Modal>
  );
};

//* Export ---------------------------------------------------------------------
export default CustomInventoryAddSuccessModal;
