from django.conf.urls import url

from . import views

app_name = 'subjects'
urlpatterns = [
    url(r'^$', views.subjects, name='list'),
    url(r'^delete/$', views.delete_subject, name='delete'),
    url(r'^add/$', views.add_subject, name='add'),
    url(r'^edit/$', views.edit_subject, name='edit'),
]
