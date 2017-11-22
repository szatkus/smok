from django.contrib import admin

from .models import School
from .models import School_type

admin.site.register(School)
admin.site.register(School_type)