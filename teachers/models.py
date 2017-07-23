from django.db import models

from subjects import models as subjects_models

class Teacher(models.Model):
	app_label='teachers';
	first_name = models.CharField(max_length=200)
	last_name = models.CharField(max_length=200)
	subjects = models.ManyToManyField(subjects_models.Subject)
	
	def __str__(self):
		return self.first_name+' '+self.last_name

# Create your models here.
