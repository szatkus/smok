from django.db import models

from teachers import models as teachers_models
from commons import models as commons_models

class TeachersAvailability(models.Model):
	teacher = models.ForeignKey(teachers_models.Teacher);
	hour = models.ForeignKey(commons_models.Hours);
	day = models.ForeignKey(commons_models.Days);
	available = models.BooleanField();