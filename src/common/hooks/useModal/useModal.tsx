/**
 * A wrapped useModal hook that simulate Antd's static useModal hook.
 */
import { App } from 'antd';
import type { ModalFuncProps } from 'antd';

//* Default Configs ------------------------------------------------------------
const defaultConfigs: ModalFuncProps = {
  centered: true,
};

const defaultConfirmConfigs: ModalFuncProps = {
  okText: 'Yes, confirm',
};

//* Hook -----------------------------------------------------------------------
const useModal = () => {
  const { modal } = App.useApp();

  // Wrapped functions ---------------------------------------------------------
  const info = (props: ModalFuncProps) =>
    modal.info({ ...defaultConfigs, ...props });

  const success = (props: ModalFuncProps) =>
    modal.success({ ...defaultConfigs, ...props });

  const error = (props: ModalFuncProps) =>
    modal.error({ ...defaultConfigs, ...props });

  const warning = (props: ModalFuncProps) =>
    modal.warning({ ...defaultConfigs, ...props });

  const confirm = (props: ModalFuncProps) =>
    modal.confirm({ ...defaultConfigs, ...defaultConfirmConfigs, ...props });

  //* Return -------------------------------------------------------------------
  return {
    info,
    success,
    error,
    warning,
    confirm,
  };
};

//* Export ---------------------------------------------------------------------
export default useModal;
