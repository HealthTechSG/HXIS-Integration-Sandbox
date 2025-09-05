import { Card, Flex, Form } from 'antd';
import React, { useState } from 'react';

import CustomInventoryAddSuccessModal from './CustomInventoryAddSuccessModal';
import CustomInventoryFormBody from './CustomInventoryFormBody';
import {
  BackButton,
  BasePage,
  CancelButton,
  SubmitButton,
} from '@/common/components';
import { useNotification } from '@/common/hooks';
import { RouteMap } from '@/configs';
import { useCreateCustomInventoryMutation } from '@/services/CustomInventory/CustomInventoryService';

const { CustomInventoryPaths } = RouteMap;

//* FC -------------------------------------------------------------------------
const CustomInventoryAddPage: React.FC = () => {
  const { showError } = useNotification();

  const [triggerMutation, { isLoading }] = useCreateCustomInventoryMutation();

  //* Form Params --------------------------------------------------------------
  const [form] = Form.useForm();

  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [newEducationId, setNewEducationId] = useState('');

  //* Form Handlers ------------------------------------------------------------
  const onFormFinish = (values: any) => {
    triggerMutation(values)
      .unwrap()
      .then((data) => {
        // Success
        setNewEducationId(data.id);
        setSuccessModalOpen(true);
      })
      .catch((error) => {
        console.error(error);
        showError(error);
      });
  };

  // TODO: Add a confirmation modal before cancel (if form is dirty)

  //* JSX ----------------------------------------------------------------------
  return (
    <BasePage
      actions={
        <BackButton href={CustomInventoryPaths.CustomInventoryList}>
          Back to listing
        </BackButton>
      }
    >
      <CustomInventoryAddSuccessModal
        inventoryId={newEducationId}
        open={successModalOpen}
      />

      <Form
        disabled={isLoading}
        form={form}
        layout="vertical"
        onFinish={onFormFinish}
        size="large"
      >
        <Flex gap="small" vertical>
          <Card>
            <CustomInventoryFormBody />
          </Card>

          <Card size="small">
            <Flex gap="small">
              <SubmitButton loading={isLoading} />
              <CancelButton href={CustomInventoryPaths.CustomInventoryList} />
            </Flex>
          </Card>
        </Flex>
      </Form>
    </BasePage>
  );
};

//* Export ---------------------------------------------------------------------
export default CustomInventoryAddPage;
