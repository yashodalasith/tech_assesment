from rest_framework.permissions import BasePermission


class IsAdminManagerOrReadOnly(BasePermission):
    """Admin: full access, Manager: no delete, Staff: read + create/update only."""

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        role = request.user.role
        if request.method in ("GET", "HEAD", "OPTIONS"):
            return True
        if request.method == "DELETE":
            return role == request.user.Roles.ADMIN
        if request.method in ("POST", "PUT", "PATCH"):
            return role in {
                request.user.Roles.ADMIN,
                request.user.Roles.MANAGER,
                request.user.Roles.STAFF,
            }
        return False


class IsAdminOrReadOnly(BasePermission):
    """Admin writes, others read-only."""

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        if request.method in ("GET", "HEAD", "OPTIONS"):
            return True
        return request.user.role == request.user.Roles.ADMIN
