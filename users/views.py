from django.http import HttpResponse
from mako.template import Template


def login(request):
    return HttpResponse(Template(filename='users/login.html').render(person='dziwko'))
