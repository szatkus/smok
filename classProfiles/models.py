from django.db import models
from django.utils.timezone import now
from subjects.models import Subject

class Class_profile(models.Model):
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=200, blank=True, default='')
    last_updated_timestamp = models.DateTimeField(default=now)
    #subjects = models.ManyToManyField('Subject', through='HoursAmount')

    def __str__(self):
        return self.name

class HoursAmount(models.Model):
    profile = models.ForeignKey(Class_profile)
    subject = models.ForeignKey(Subject)
    hoursno = models.PositiveIntegerField(default=0)

    def __str__(self):
        return str(self.subject)
