from rest_framework.permissions import BasePermission
from .utils import user_has_role


class IsTestMaker(BasePermission):
    def has_permission(self, request, view):
        return user_has_role(request.user, "TEST_MAKER")


class IsStudent(BasePermission):
    def has_permission(self, request, view):
        return user_has_role(request.user, "STUDENT")


class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return user_has_role(request.user, "ADMIN") or user_has_role(request.user, "SUPER_ADMIN")
