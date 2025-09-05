import { Card, Flex, Form } from 'antd';
import React, { useEffect } from 'react';
import { generatePath, useParams, useNavigate } from 'react-router-dom';

import { CustomInventoryFormBody } from '../CustomInventoryAdd';
import {
  BasePage,
  CancelButton,
  LoadingOverlay,
  SubmitButton,
} from '@/common/components';
import { useNotification } from '@/common/hooks';
import { DateUtils } from '@/common/utils';
import { RouteMap } from '@/configs';
import {
  useGetCustomInventoryByIdQuery,
  useUpdateCustomInventoryMutation,
} from '@/services/CustomInventory/CustomInventoryService';

const { CustomInventoryPaths } = RouteMap;

//* FC -------------------------------------------------------------------------
const CustomInventoryEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const inventoryId = id!;

  const navigate = useNavigate();
  const customInventoryViewPath = generatePath(
    CustomInventoryPaths.CustomInventoryView,
    {
      id: inventoryId,
    },
  );

  const { showError, showSuccess } = useNotification();
  const [form] = Form.useForm();

  const { data, isError, isFetching } =
    useGetCustomInventoryByIdQuery(inventoryId);
  const [triggerMutation, { isLoading: isSaving }] =
    useUpdateCustomInventoryMutation();

  //* Submit -------------------------------------------------------------------
  const onFormFinish = (values: any) => {
    triggerMutation({
      ...data,
      ...values,
    })
      .unwrap()
      .then(() => {
        showSuccess('Custom Inventory updated successfully!');
        navigate(customInventoryViewPath);
      })
      .catch((error) => {
        console.error(error);
        showError(error);
      });
  };

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        ...DateUtils.transformDatesInObject(data, ['date']),
      });
    }
  }, [data, form]);

  //* JSX ----------------------------------------------------------------------
  return (
    <BasePage breadcrumbParams={{ id: inventoryId }}>
      <Form
        disabled={isFetching || isSaving}
        form={form}
        layout="vertical"
        onFinish={onFormFinish}
        size="large"
      >
        <Flex gap="small" vertical>
          <Card>
            <LoadingOverlay isError={isError} isLoading={isFetching}>
              <CustomInventoryFormBody />
            </LoadingOverlay>
          </Card>

          <Card size="small">
            <Flex gap="small">
              <SubmitButton loading={isFetching || isSaving} />
              <CancelButton href={customInventoryViewPath} />
            </Flex>
          </Card>
        </Flex>
      </Form>
    </BasePage>
  );
};

//* Export ---------------------------------------------------------------------
export default CustomInventoryEditPage;
