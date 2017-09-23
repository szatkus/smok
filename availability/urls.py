from django.conf.urls import include, url

from availability import views

app_name = 'availability'

urlpatterns = [
    #url(r'^$', views.index,name='input'),
	url(r'^(?P<teacher_id>[0-9]+)/$', views.input,name='input'),
	url(r'^save/(?P<teacher_id>[0-9]+)/$', views.save,name='save'),
	#url(r'^add/$', views.TeacherCreate.as_view(),name='add'),
	#url(r'^(?P<pk>[0-9]+)/rm/$', views.TeacherDelete.as_view(),name='delete'),
]
