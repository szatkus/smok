from django.conf.urls import include, url

from teachers import views

app_name = 'teachers'

urlpatterns = [
    url(r'^$', views.TeachersList.as_view(),name='list'),
	url(r'^(?P<pk>[0-9]+)/$', views.TeacherUpdate.as_view(),name='update'),
	url(r'^add/$', views.TeacherCreate.as_view(),name='add'),
	url(r'^(?P<pk>[0-9]+)/rm/$', views.TeacherDelete.as_view(),name='delete'),
]