/**
 * This is the Suspence/Error Fallback for React.
 *
 * DO NOT USE ANY LARGE LIBRARIES OR COMPONENTS HERE!!!
 * Assume ONLY React and vite is loaded. No libraries are loaded at all.
 */
import React, { PropsWithChildren } from 'react';

const BareBoneStatusPage: React.FC<PropsWithChildren> = ({ children }) => (
  <div className="flex h-screen items-center justify-center bg-gray-100">
    <div className="m-0 rounded-lg bg-white px-6 py-4">{children}</div>
  </div>
);

export default BareBoneStatusPage;
