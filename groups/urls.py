from django.conf.urls import url

from . import views

app_name = 'groups'
urlpatterns = [
    url(r'^$', views.group_list, name='group_list'),
    url(r'^delete/$', views.delete_group, name='delete'),
    url(r'^add/$', views.add_group, name='add'),
    url(r'^edit/$', views.edit_group, name='edit'),
]