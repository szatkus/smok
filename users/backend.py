from django.contrib.auth.hashers import check_password
from users.models import User


class AuthenticationBackend(object):

    def authenticate(self, request, username=None, password=None):
        try:
            user = User.objects.get(username=username)
            if check_password(password, user.password):
                return user
        except User.DoesNotExist:
            return None
        return None

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None
