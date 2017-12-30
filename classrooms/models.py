# -*- coding: utf-8 -*-
from django.db import models
from school.models import School
from subjects.models import Subject

class Classroom(models.Model):
    class Meta:
        unique_together = (('name', 'building'),)
    name = models.CharField(max_length=200, verbose_name="Numer")
    building = models.CharField(max_length=200, verbose_name="Budynek")
    seats = models.IntegerField(default=0, verbose_name="Liczba miejsc")
    subjects = models.CharField(max_length=200, verbose_name="Przedmioty")
    available_subjects = models.ManyToManyField(Subject) 
	
    #subjects = models.ManyToManyField(Subject, blank=True)
	#Szymon, hashuje to bo już dodałem relacje jako available_subjects i mogło by się rozsypać; Michał
	
    school = models.ForeignKey(School, on_delete=models.CASCADE, verbose_name="Szkoła", default='-1' )
    

