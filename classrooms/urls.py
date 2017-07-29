from django.conf.urls import url

from . import views

app_name = 'classrooms'
urlpatterns = [
    url(r'^$', views.classroom_list, name='classroom_list'),
    url(r'^delete/$', views.delete_classroom, name='delete'),
    url(r'^add/$', views.add_classroom, name='add'),
    url(r'^edit/$', views.edit_classroom, name='edit'), 
]