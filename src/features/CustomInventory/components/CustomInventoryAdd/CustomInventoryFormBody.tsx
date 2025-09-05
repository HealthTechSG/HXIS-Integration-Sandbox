import { Form, Row, Col, Input, InputNumber, DatePicker } from 'antd';
import React from 'react';

import { CustomInventoryLabels as Labels } from '@/features/CustomInventory/constants';

//* FC -------------------------------------------------------------------------
// This is shared between Add and Edit Form.
const CustomInventoryFormBody: React.FC = () => (
  <Row gutter={16}>
    <Col span={8}>
      <Form.Item
        label={Labels.product}
        name="product"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
    </Col>
    <Col span={8}>
      <Form.Item
        label={Labels.category}
        name="category"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
    </Col>
    <Col span={8}>
      <Form.Item
        label={Labels.warehouse}
        name="warehouse"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
    </Col>
    <Col span={8}>
      <Form.Item
        label={Labels.quantity}
        name="quantity"
        rules={[{ required: true }, { type: 'number' }]}
      >
        <InputNumber />
      </Form.Item>
    </Col>
    <Col span={12}>
      <Form.Item label={Labels.date} name="date" rules={[{ required: true }]}>
        <DatePicker />
      </Form.Item>
    </Col>
  </Row>
);

//* Export ---------------------------------------------------------------------
export default CustomInventoryFormBody;
