from django.conf.urls import include, url
from teachers import views

app_name = 'teachers'

urlpatterns = [
    url(r'^$', views.teachers, name='list'),
    url(r'^delete/$', views.delete_teacher, name='delete'),
    url(r'^add/$', views.add_teacher, name='add'),
    url(r'^edit/$', views.edit_teacher, name='edit'),
    url(r'^add-teacher-assignment/$', views.add_teacher_assignment, name='add-teacher-assignment'),
    url(r'^delete-teacher-assignment/$', views.delete_teacher_assignment, name='delete-teacher-assignment')
]
