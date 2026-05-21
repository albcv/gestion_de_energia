import { Navigate } from 'react-router-dom';
import { useAuth } from './Auth';

export const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};