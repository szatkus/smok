from django.db import models
from groups.models import Group
from subjects.models import Subject


class Teacher(models.Model):
    class Meta:
        unique_together = ('first_name', 'last_name',)
    first_name = models.CharField(max_length=200)
    last_name = models.CharField(max_length=200)

    def __str__(self):
        return self.last_name + ' ' + self.first_name


class TeacherClassSubject(models.Model):
    class Meta:
        unique_together = ('teacher', 'subject', 'group',)
        ordering = ['group']
    teacher = models.ForeignKey(Teacher)
    subject = models.ForeignKey(Subject)
    group = models.ForeignKey(Group)


