/**
 * A wrapped notification hook that simulate Antd's static notification hook.
 */
import { App } from 'antd';
import type { NotificationArgsProps } from 'antd';
import { has, get } from 'lodash-es';
import React from 'react';

//* Default Configs ------------------------------------------------------------
const defaultConfigs: NotificationArgsProps = {
  message: 'Notification message.',
  placement: 'bottomRight',
};

//* The Hook -------------------------------------------------------------------
const useNotification = () => {
  const { notification } = App.useApp();

  //* Show Info ----------------------------------------------------------------
  const showInfo = (message: string) => {
    notification.info({
      ...defaultConfigs,
      message,
    });
  };

  //* Show Success -------------------------------------------------------------
  const showSuccess = (message: string) => {
    notification.success({
      ...defaultConfigs,
      message,
    });
  };

  //* Show Error ---------------------------------------------------------------
  const showError = (error: any) => {
    let message;

    if (typeof error === 'string') {
      message = error;
    } else if (React.isValidElement(error)) {
      // Is a ReactNode
      message = error;
    } else if (error instanceof Error) {
      message = error.message;
    } else if (has(error, 'message')) {
      message = get(error, 'message');
    } else if (has(error, 'data.message')) {
      message = get(error, 'data.message');
    } else {
      // Unknown type...
      console.error(error);
      message = 'An error occurred';
    }

    return notification.error({
      ...defaultConfigs,
      message,
    });
  };

  //* Return -------------------------------------------------------------------
  return { showInfo, showSuccess, showError };
};

export default useNotification;
