from django.conf.urls import url

from . import views

app_name = 'school'
urlpatterns = [
    url(r'^$', views.details, name='details'),
    url(r'^edit/$', views.edit_school, name='edit'), 	
]