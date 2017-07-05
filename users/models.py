from django.contrib.auth.models import AbstractUser
from django.db.models.fields import CharField
from django.db import models
from school.models import  School

class User(AbstractUser):
    remove_me = CharField(max_length=255)    
    school_id = models.ManyToManyField(School)
