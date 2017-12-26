# -*- coding=utf-8 -*-

from django.db import models

from groups.models import Group
from commons.models import Hours, Days
from teachers.models import Teacher
from subjects.models import Subject
from classrooms.models import Classroom
from school.models import School
from django.utils.timezone import now

class Timetable(models.Model):
	school = models.ForeignKey(School, on_delete=models.CASCADE, verbose_name="Szkoła")
	name = models.CharField(unique=True, max_length=150)
	last_updated_timestamp = models.DateTimeField(default=now)
	is_processed = models.BooleanField(default=False)

	def __str__(self):
		return '%s' % (self.name)
	
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
	