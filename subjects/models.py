from django.db import models
from django.utils.timezone import now

class Subject(models.Model):
    class Meta:
        unique_together = ('name', 'code',)
    name = models.CharField(max_length=50)
    code = models.CharField(max_length=5)
    description = models.CharField(max_length=200, blank=True, default='')
    last_updated_timestamp = models.DateTimeField(default=now)
    special_classroom_req = models.BooleanField(default=False)

    def __str__(self):
        return self.name + ' (' + self.code + ')'
