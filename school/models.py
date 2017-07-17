# -*- coding: utf-8 -*-
from django.db import models


class School_type(models.Model):
    type_name = models.CharField(max_length=36, unique=True, verbose_name="typ szkoły")
    def __str__(self):
        return self.type_name
    
class School(models.Model):
    school_name = models.CharField(max_length=200, verbose_name="Nazwa szkoły")
    school_address = models.CharField(max_length=200, verbose_name="Adres szkoły")
    school_type = models.ForeignKey(School_type, on_delete=models.CASCADE, verbose_name="typ szkoły" )
    last_updated_timestamp = models.DateTimeField('date published')
    
    def __str__(self):
        return self.school_name
        
