import { Spin } from 'antd';
import React from 'react';

import ErrorAlert from './ErrorAlert';

//* Props ----------------------------------------------------------------------
interface LoadingOverlayProps {
  isError?: boolean;
  isLoading?: boolean;
  children: React.ReactNode;
}

//* FC -------------------------------------------------------------------------
const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  children,
  isError = false,
  isLoading = false,
}) => {
  // Workaround to make the AntD error overlay look nicer.
  const errorSpinClassNames = isError ? 'flex justify-center items-center' : '';

  //* JSX ----------------------------------------------------------------------
  return (
    <Spin
      className={errorSpinClassNames}
      indicator={
        isError ? (
          <ErrorAlert className="start-auto top-auto m-0 flex size-auto text-left text-base" />
        ) : undefined
      }
      spinning={isLoading || isError}
    >
      {children}
    </Spin>
  );
};

//* Export ---------------------------------------------------------------------
export default LoadingOverlay;
