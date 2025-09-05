/* eslint-disable import/first */
/* eslint-disable import/order */
/* Disable ESLint for this file, so we can group the imports in a nicer way */
//* ----------------------------------------------------------------------------

//* App Providers --------------------------------------------------------------
import ReduxProvider from './providers/ReduxProvider';
import AntdProvider from './providers/AntdProvider';
import RouterProvider from './providers/RouterProvider';
import { AuthProvider, type AuthProviderProps } from 'react-oidc-context';

//* Styling --------------------------------------------------------------------
import '@/configs/theme/SynapxeTheme.css';
import '@/configs/theme/AntdTheme.css';
import { WebStorageStateStore } from 'oidc-client-ts';

//* Auth Configuration ---------------------------------------------------------
const AuthProviderConfig: AuthProviderProps = {
  // OIDC Configuration
  authority: import.meta.env.VITE_OIDC_AUTHORITY,
  client_id: import.meta.env.VITE_OIDC_CLIENT_ID,
  redirect_uri: import.meta.env.VITE_OIDC_REDIRECT_URI,

  // Uses localStorage for user session
  userStore: new WebStorageStateStore({
    store: window.localStorage,
  }),
};

//* ----------------------------------------------------------------------------
//* The App FC
//* ----------------------------------------------------------------------------
const App = () => (
  //* JSX ----------------------------------------------------------------------
  <AuthProvider {...AuthProviderConfig}>
    <ReduxProvider>
      <AntdProvider>
        <RouterProvider />
      </AntdProvider>
    </ReduxProvider>
  </AuthProvider>
);
//* Export ---------------------------------------------------------------------
export default App;
