from rest_framework.permissions import BasePermission


class RoleBasedCRMPermission(BasePermission):
    """Role-aware permission rules for CRM endpoints."""

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        role = request.user.role
        basename = getattr(view, "basename", "")

        if request.method in ("GET", "HEAD", "OPTIONS"):
            return True

        if request.method == "DELETE":
            return role == request.user.Roles.ADMIN

        if request.method in ("POST", "PUT", "PATCH"):
            if role == request.user.Roles.ADMIN:
                return True
            if role == request.user.Roles.MANAGER:
                return True
            if role == request.user.Roles.STAFF:
                return basename == "contact"

        return False


class IsAdminOrReadOnly(BasePermission):
    """Admin writes, others read-only."""

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        if request.method in ("GET", "HEAD", "OPTIONS"):
            return True
        return request.user.role == request.user.Roles.ADMIN
