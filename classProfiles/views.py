from django.shortcuts import render, redirect
from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpResponse, Http404
from .models import Class_profile
from .forms import ClassProfileForm
from django.core import serializers


def profiles(request):
    username = request.user.username if request.user.is_authenticated else 'niezalogowano'
    all_profiles_list = Class_profile.objects.order_by('name')
    context = {'models': all_profiles_list, 'username': username}
    return render(request, 'class-profiles.html', context)

def add_profile(request):
    if request.method == "POST":
        form = ClassProfileForm(request.POST)
        if form.is_valid():
            new_profile = form.save()
            data = serializers.serialize('json', [new_profile])
            return HttpResponse(data)
    else:
        form = ClassProfileForm()
    return HttpResponse(form)

def edit_profile(request):
    if request.method == "POST":
        try:
            record_id = request.POST['id']
            profile = Class_profile.objects.get(pk=record_id)
            form = ClassProfileForm(request.POST, instance=profile)
            if form.is_valid():
                new_profile = form.save()
                data = serializers.serialize('json', [new_profile])
                return HttpResponse(data)
        except ObjectDoesNotExist:
            raise Http404("Brak profilu o id %s w bazie." % record_id)
    elif request.method == "GET":
        try:
            record_id = request.GET['id']
            profile = Class_profile.objects.get(pk=record_id)
            form = ClassProfileForm(instance=profile)
        except ObjectDoesNotExist:
            raise Http404("Brak profilu o id %s w bazie." % record_id)
        return HttpResponse(form)

def delete_profile(request):
    if request.method == "POST":
        record_id = request.POST.get("id")
        try:
            profile = Class_profile.objects.get(pk=record_id)
        except ObjectDoesNotExist:
            raise Http404("Brak przedmiotu o id %s w bazie." % record_id)
        profile.delete()
        return HttpResponse()
