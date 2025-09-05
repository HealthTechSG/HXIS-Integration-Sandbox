import { PropsWithChildren } from 'react';
import { withAuthenticationRequired } from 'react-oidc-context';

const ProtectedRoute = withAuthenticationRequired(
  ({ children }: PropsWithChildren) => children,
  {
    OnRedirecting: () => (
      <div className="flex h-screen items-center justify-center">
        <h1 className="text-2xl font-bold">Redirecting to login...</h1>
      </div>
    ),
  },
);

export default ProtectedRoute;
