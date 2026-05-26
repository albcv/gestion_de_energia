from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsAdminOrReadOnly(BasePermission):
    """
    Permite lectura (GET) a cualquier usuario autenticado.
    Solo los administradores (is_staff o is_superuser) pueden modificar (POST, PUT, DELETE).
    """
    def has_permission(self, request, view):
        # Si es método seguro (GET, HEAD, OPTIONS) => requiere autenticación
        if request.method in SAFE_METHODS:
            return request.user and request.user.is_authenticated
        # Si es método de escritura => requiere ser staff o superuser
        return request.user and (request.user.is_staff or request.user.is_superuser)