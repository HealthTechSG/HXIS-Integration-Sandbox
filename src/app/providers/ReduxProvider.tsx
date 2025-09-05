import React from 'react';
import { Provider } from 'react-redux';

import store from '@/redux/store';

//* Props ----------------------------------------------------------------------
interface ReduxProviderProps {
  children: React.ReactNode;
}

//* FC -------------------------------------------------------------------------
const ReduxProvider: React.FC<ReduxProviderProps> = ({ children }) => (
  <Provider store={store}>{children}</Provider>
);

//* Export ---------------------------------------------------------------------
export default ReduxProvider;
