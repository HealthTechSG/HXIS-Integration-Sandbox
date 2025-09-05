import { Modal, Form } from 'antd';
import type { ModalProps, FormProps } from 'antd';
import React from 'react';

//* Props ----------------------------------------------------------------------
interface TableFilterFormModalProps extends ModalProps {
  open: boolean;
  initialValues?: Record<string, string>;
  onCancel: () => void;
  onSubmit: FormProps['onFinish'];
}

//* FC -------------------------------------------------------------------------
const TableFilterFormModal: React.FC<TableFilterFormModalProps> = ({
  children,
  initialValues = {},
  onCancel,
  onSubmit,
  open,
  ...props
}) => {
  const [form] = Form.useForm();

  //* Modal Handlers -----------------------------------------------------------
  const renderForm = (formBody: React.ReactNode) => (
    <Form
      form={form}
      initialValues={initialValues}
      layout="vertical"
      onFinish={onSubmit}
    >
      {formBody}
    </Form>
  );

  const onModalCancelled: ModalProps['onCancel'] = () => {
    form.resetFields();
    onCancel();
  };

  //* JSX ----------------------------------------------------------------------
  return (
    <Modal
      modalRender={renderForm}
      okButtonProps={{ htmlType: 'submit' }}
      onCancel={onModalCancelled}
      open={open}
      width="60vw"
      {...props}
    >
      {children}
    </Modal>
  );
};

//* Export ---------------------------------------------------------------------
export default TableFilterFormModal;
