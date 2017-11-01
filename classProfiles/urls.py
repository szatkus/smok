from django.conf.urls import url

from . import views

app_name = 'classProfiles'
urlpatterns = [
    url(r'^$', views.profiles, name='list'),
    url(r'^(?P<profile_id>[0-9]+)/$', views.profile, name='profile'),
    url(r'^delete/$', views.delete_profile, name='delete'),
    url(r'^add/$', views.add_profile, name='add'),
    url(r'^edit/$', views.edit_profile, name='edit'),
    url(r'^profile-edit-subjects-hours/$', views.save_new_hoursno_on_profile, name='profile-edit-subjects-hours'),
    url(r'^profile-add-subjects/$', views.add_subject_to_profile, name='profile-add-subjects')
]
