from .models import Role, UserRole


def user_has_role(user, role_name: str) -> bool:
    if not user or not user.is_authenticated:
        return False
    return UserRole.objects.filter(
        user=user,
        role__name=role_name
    ).exists()


def assign_role(user, role_name: str):
    role, _ = Role.objects.get_or_create(name=role_name)
    UserRole.objects.get_or_create(user=user, role=role)
