from django.contrib.auth.models import AbstractUser
from django.db.models.fields import CharField


class User(AbstractUser):
    remove_me = CharField(max_length=255)
