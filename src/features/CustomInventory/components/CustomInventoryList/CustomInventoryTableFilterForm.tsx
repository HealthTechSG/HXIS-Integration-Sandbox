import { Flex, Form, Input } from 'antd';
import { isEmpty, omitBy } from 'lodash-es';
import React from 'react';

import { FilterButton } from '@/common/components';
import { CustomInventoryLabels as Labels } from '@/features/CustomInventory/constants';

//* Props ----------------------------------------------------------------------
interface CustomInventoryTableFilterFormProps {
  onFilter?: (filterValues: Record<string, string>) => void;
}

//* FC -------------------------------------------------------------------------
const CustomInventoryTableFilterForm: React.FC<
  CustomInventoryTableFilterFormProps
> = ({ onFilter }) => {
  //* Form Params --------------------------------------------------------------
  const [form] = Form.useForm();

  const onFormFinish = (values: Record<string, string>) => {
    const nonEmptyValues = omitBy(values, (value) => isEmpty(value));
    onFilter?.(nonEmptyValues);
  };

  //* JSX ----------------------------------------------------------------------
  return (
    <Form form={form} layout="inline" onFinish={onFormFinish}>
      <Flex align="center" className="w-full" gap="small">
        <label>Filters:</label>
        <Form.Item className="flex-auto" name="product">
          <Input placeholder={`Filter by ${Labels.product}`} />
        </Form.Item>
        <Form.Item className="flex-auto" name="warehouse">
          <Input placeholder={`Filter by ${Labels.warehouse}`} />
        </Form.Item>
        <Form.Item className="flex-auto" name="category">
          <Input placeholder={`Filter by ${Labels.category}`} />
        </Form.Item>
        <FilterButton htmlType="submit" type="primary" />
      </Flex>
    </Form>
  );
};

//* Export ---------------------------------------------------------------------
export default CustomInventoryTableFilterForm;
