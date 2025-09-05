import React from 'react';

import BareBoneStatusPage from './BareBoneStatusPage';
import Spinner from './Spinner';

const LoadingSplashScreen: React.FC = () => (
  <BareBoneStatusPage>
    <h2 className="m-4 flex items-center gap-4 font-sans">
      <Spinner />
      Loading...
    </h2>
  </BareBoneStatusPage>
);

export default LoadingSplashScreen;
