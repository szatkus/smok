# -*- coding=utf-8 -*-

from django.db import models

from groups.models import Group
from commons.models import Hours, Days
from teachers.models import Teacher
from subjects.models import Subject
from classrooms.models import Classroom
from school.models import School

class Timetable(models.Model):
	school = models.ForeignKey(School, on_delete=models.CASCADE, verbose_name="Szkoła")
	is_processed = models.BooleanField(default=False)
	
class TimetablePosition(models.Model):
	timetable = models.ForeignKey(Timetable)
	group = models.ForeignKey(Group)
	hour = models.ForeignKey(Hours)
	day = models.ForeignKey(Days)
	teacher = models.ForeignKey(Teacher)
	subject = models.ForeignKey(Subject)
	classroom = models.ForeignKey(Classroom)
	
	class Meta:
		unique_together = (
			('timetable','hour','day','group'),
			('timetable','hour','day','teacher'),
			('timetable','hour','day','classroom'),
		)
	