# -*- coding: utf-8 -*-
from django.db import models
from school.models import School
from subjects.models import Subject

class Classroom(models.Model):
    name = models.CharField(max_length=200, verbose_name="Numer")
    building = models.CharField(max_length=200, verbose_name="Budynek")
    seats = models.IntegerField(default=0, verbose_name="Liczba miejsc")
    subjects = models.CharField(max_length=200, verbose_name="Przedmioty")
    available_subjects = models.ManyToManyField(Subject)
    school = models.ForeignKey(School, on_delete=models.CASCADE, verbose_name="Szkoła", default='-1' )
    

