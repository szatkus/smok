from django.db import models

class Hours(models.Model):
	app_label = 'availability'
	hour_from = models.CharField(max_length=5)
	hour_to = models.CharField(max_length=5)
	order = models.IntegerField()
	
	def __str__(self):
		return self.hour_from+" - "+self.hour_to;
		
class Days(models.Model):
	app_label = 'availability'
	name = models.CharField(max_length=50)
	order = models.IntegerField()
	
	def __str__(self):
		return self.name
