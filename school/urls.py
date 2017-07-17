from django.conf.urls import url

from . import views

app_name = 'school'
urlpatterns = [
    url(r'^$', views.school_list, name='school_list'),
    url(r'^(?P<school_id>[0-9]+)/$', views.details, name='details'),
    url(r'^add/$', views.add, name='add'),
   # url(r'^(?P<school_id>[0-9]+)/delete/$', views.delete, name='delete'),      
]