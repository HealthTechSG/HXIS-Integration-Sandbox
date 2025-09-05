import { Alert, AlertProps } from 'antd';
import React from 'react';

//* FC -------------------------------------------------------------------------
const ErrorAlert: React.FC<AlertProps> = ({
  message = 'Error loading data.',
  ...props
}) => <Alert message={message} showIcon type="error" {...props} />;

//* Export ---------------------------------------------------------------------
export default ErrorAlert;
