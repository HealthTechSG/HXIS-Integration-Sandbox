import React, { useState } from 'react';

import CustomInventoryDeleteModal from './CustomInventoryDeleteModal';
import { DeleteButton } from '@/common/components';

//* Props ----------------------------------------------------------------------
interface CustomInventoryDeleteButtonProps {
  id: string;
  onDelete?: () => void;
}

//* FC -------------------------------------------------------------------------
const CustomInventoryDeleteButton: React.FC<
  CustomInventoryDeleteButtonProps
> = ({ id, onDelete = () => {} }) => {
  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    setOpen(false);
    onDelete();
  };

  //* JSX ----------------------------------------------------------------------
  return (
    <>
      <DeleteButton
        onClick={() => {
          setOpen(true);
        }}
      />
      <CustomInventoryDeleteModal
        id={id}
        onCancel={() => setOpen(false)}
        onDelete={handleDelete}
        open={open}
      />
    </>
  );
};

//* Export ---------------------------------------------------------------------
export default CustomInventoryDeleteButton;
