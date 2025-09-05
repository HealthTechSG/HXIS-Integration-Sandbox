import { PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }: PropsWithChildren) => {
  const isLogin = localStorage.getItem('isLoggedIn') === 'true';

  return isLogin ? <>{children}</> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
