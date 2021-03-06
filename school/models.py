# -*- coding: utf-8 -*-
from django.db import models
from django.contrib.auth.models import User

class School_type(models.Model):
    type_name = models.CharField(max_length=36, unique=True, verbose_name="typ szkoły")
    def __str__(self):
        return self.type_name
    
class School(models.Model):
    school_name = models.CharField(max_length=200, verbose_name="Nazwa szkoły")
    school_address = models.CharField(max_length=200, verbose_name="Adres szkoły")
    school_type = models.ForeignKey(School_type, on_delete=models.CASCADE, verbose_name="Typ szkoły")
    school_type_name = models.CharField(max_length=200, blank=True, verbose_name="Typ szkoły")
    
    def __str__(self):
        return self.school_name
        
