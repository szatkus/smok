# -*- coding: utf-8 -*-
from django.db import models
from school.models import  School


class Group(models.Model):
    name = models.CharField(max_length=200, verbose_name="Klasa")
    group_profile = models.CharField(max_length=200, verbose_name="Profil")
    school = models.ForeignKey(School, on_delete=models.CASCADE, verbose_name="Szkoła", default='-1' )
    
    def __str__(self):
        return self.name
