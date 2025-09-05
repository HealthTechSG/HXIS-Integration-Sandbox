import {
  StyleProvider as AntdStyleProvider,
  px2remTransformer,
} from '@ant-design/cssinjs';
import { App as AntdApp, ConfigProvider as AntdConfigProvider } from 'antd';
import React from 'react';

import { ROOT_REM_PX, ANTD_THEME_CONFIG } from '@/configs/theme';

const px2rem = px2remTransformer({ rootValue: ROOT_REM_PX });

//* Props ----------------------------------------------------------------------
interface AntdProviderProps {
  children: React.ReactNode;
}

//* FC -------------------------------------------------------------------------
const AntdProvider: React.FC<AntdProviderProps> = ({ children }) => (
  <AntdConfigProvider theme={ANTD_THEME_CONFIG}>
    <AntdStyleProvider hashPriority="high" transformers={[px2rem]}>
      <AntdApp>{children}</AntdApp>
    </AntdStyleProvider>
  </AntdConfigProvider>
);
//* Export ---------------------------------------------------------------------
export default AntdProvider;
