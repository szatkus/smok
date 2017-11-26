# -*- coding: utf-8 -*-
from django.db import models
from school.models import  School
from classProfiles.models import Class_profile


class Group(models.Model):
    class Meta:
        unique_together = ('name',)

    name = models.CharField(max_length=200, verbose_name="Klasa")
    #group_profile = models.CharField(max_length=200, blank=True, default='')
    group_profile = models.ForeignKey(Class_profile, verbose_name="Profil", on_delete=models.SET_NULL, blank=True, null=True)
    school = models.ForeignKey(School, on_delete=models.CASCADE, verbose_name="Szkoła", blank=True, null=True, default=None)
    
    def __str__(self):
        return self.name
