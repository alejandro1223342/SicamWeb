import { Navigate, Outlet, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
    allowedRoles: string[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
    const location = useLocation();
    const userStr = localStorage.getItem('user');

    if (!userStr) {
        // Redirigir al inicio de sesión pero guardar la ruta a la que intentaba ir
        return <Navigate to="/signin" state={{ from: location }} replace />;
    }

    const user = JSON.parse(userStr);

    // Si el rol del usuario no está en la lista de roles permitidos para esta ruta
    if (!allowedRoles.includes(user.role)) {
        // Redirigir a su panel principal correspondiente por seguridad
        if (user.role === 'PACIENTE') {
            return <Navigate to="/patient/dashboard" replace />;
        }
        // Para MEDICO, SECRETARIA o ADMIN
        return <Navigate to="/dashboard" replace />;
    }

    // Si está autenticado y tiene permiso, renderizar las sub-rutas protegidas
    return <Outlet />;
}
