from django.db import models
from django.utils.timezone import now
#from groups import models as group_models

class Class_profile(models.Model):
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=200, blank=True, default='')
    #group = models.ManyToManyField(group_models.Group)
    last_updated_timestamp = models.DateTimeField(default=now)

    def __str__(self):
        return self.name
