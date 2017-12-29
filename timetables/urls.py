from django.conf.urls import url

from . import views

app_name = 'timetables'
urlpatterns = [
    url(r'^$', views.timetables, name='list'),
    url(r'^(?P<timetable_id>[0-9]+)/$', views.timetable, name='timetable'),
    url(r'^delete/$', views.delete_timetable, name='delete'),
    url(r'^add/$', views.add_timetable, name='add'),
    url(r'^edit/$', views.edit_timetable, name='edit')
]
