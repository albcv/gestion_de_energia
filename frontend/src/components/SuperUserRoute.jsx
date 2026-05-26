import { Navigate } from 'react-router-dom';
import { useAuth } from './Auth';

export const SuperUserRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const isAdmin = user?.is_superuser === true;

if (!isAdmin) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50">
      <div className="text-center p-8">
        <div className="text-6xl mb-4">⛔</div>
        <h1 className="text-4xl md:text-5xl font-bold text-red-600 mb-2">
          Acceso denegado
        </h1>
        <p className="text-xl text-gray-700">
          No tienes permisos de administrador.
        </p>
        <button
          onClick={() => window.location.href = '/inicio'}
          className="mt-6 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
}

  return <>{children}</>;
};