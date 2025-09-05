import { PropsWithChildren } from 'react';

/**
 * PublicRoute simply renders its children without requiring authentication.
 */
const PublicRoute = ({ children }: PropsWithChildren) => children;

export default PublicRoute;
