from django.contrib import admin
from . import models

admin.site.register(models.Timetable)
admin.site.register(models.TimetablePosition)