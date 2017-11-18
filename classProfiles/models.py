from django.db import models
from django.utils.timezone import now
from subjects.models import Subject

class Grade(models.Model):
    grade = models.PositiveIntegerField(default=1)

    def __str__(self):
        return str(self.grade)

class Class_profile(models.Model):
    class Meta:
        unique_together = (('name', 'grade'),)

    name = models.CharField(max_length=50)
    grade = models.ForeignKey(Grade)
    description = models.CharField(max_length=200, blank=True, default='')
    last_updated_timestamp = models.DateTimeField(default=now)

    def __str__(self):
        return '%s, %s rok' % (self.name, self.grade)

class HoursAmount(models.Model):
    profile = models.ForeignKey(Class_profile)
    subject = models.ForeignKey(Subject)
    hoursno = models.PositiveIntegerField(default=0)

    def get_subject_name(self):
        return self.subject.name

    def __str__(self):
        return str(self.subject)
