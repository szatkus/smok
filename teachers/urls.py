from django.conf.urls import include, url
from django.contrib.auth.decorators import login_required
from teachers import views

app_name = 'teachers'

urlpatterns = [
    url(r'^$', views.teachers, name='list'),
	url(r'^(?P<pk>[0-9]+)/$', views.TeacherUpdate.as_view(),name='update'),
	#url(r'^(?P<pk>[0-9]+)/$', views.edit_teacher, name='update'),
	url(r'^add/$', views.TeacherCreate.as_view(),name='add'),
	url(r'^(?P<pk>[0-9]+)/rm/$', views.TeacherDelete.as_view(),name='delete'),
]
