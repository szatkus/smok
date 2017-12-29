from django.db import models
from groups.models import Group
from subjects.models import Subject


class Teacher(models.Model):
    app_label = 'teachers'
    first_name = models.CharField(max_length=200)
    last_name = models.CharField(max_length=200)
    subjects = models.ManyToManyField(Subject, blank=True)
    groups = models.ManyToManyField(Group, blank=True)
    #subjects = models.ManyToManyField(Subject, blank=True, through='TeacherClassSubject')
    #groups = models.ManyToManyField(Group, blank=True, through='TeacherClassSubject')

    def __str__(self):
        return self.first_name + ' ' + self.last_name

"""
class TeacherClassSubject(models.Model):
    teacher = models.ForeignKey(Teacher)
    subject = models.ForeignKey(Subject)
    group = models.ForeignKey(Group)
"""
