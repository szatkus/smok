from django.conf.urls import include, url

from teachers import views

app_name = 'teachers'

urlpatterns = [
    url(r'^$', views.index),
]
