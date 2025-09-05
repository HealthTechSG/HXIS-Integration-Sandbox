import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { ErrorBoundary } from 'react-error-boundary';

import {
  LoadingSplashScreen,
  LoadErrorScreen,
} from './app/components/LoadingSplashScreen';

import '@/configs/theme/SynapxeTheme.css';

const rootElement = document.getElementById('root') as HTMLElement;
if (!rootElement) throw new Error('No root element found');

const App = React.lazy(() => import('./app/App'));

// * Add a data-version attribute into the root div.
const hash = import.meta.env.VITE_GIT_COMMIT_HASH;
const rootDiv = document.getElementById('root') as HTMLElement;
rootDiv.setAttribute('data-version', hash);

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ErrorBoundary FallbackComponent={LoadErrorScreen}>
      <Suspense fallback={<LoadingSplashScreen />}>
        <App />
      </Suspense>
    </ErrorBoundary>
  </React.StrictMode>,
);
