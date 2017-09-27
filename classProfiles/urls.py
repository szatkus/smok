from django.conf.urls import url

from . import views

app_name = 'classProfiles'
urlpatterns = [
    url(r'^$', views.profiles, name='list'),
    url(r'^delete/$', views.delete_profile, name='delete'),
    url(r'^add/$', views.add_profile, name='add'),
    url(r'^edit/$', views.edit_profile, name='edit'),
]
