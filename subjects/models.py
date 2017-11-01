from django.db import models
from django.utils.timezone import now
#from classProfiles.models import Class_profile, HoursAmount

class Subject(models.Model):
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=200)
    last_updated_timestamp = models.DateTimeField(default=now)
    #profiles = models.ManyToManyField('Class_profile', through='HoursAmount')

    def __str__(self):
        return self.name
