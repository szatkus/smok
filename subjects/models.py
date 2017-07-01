from django.db import models
from django.utils.timezone import now

class Subject(models.Model):
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=200)
    last_updated_timestamp = models.DateTimeField(default=now)

    def __str__(self):
        return self.name
