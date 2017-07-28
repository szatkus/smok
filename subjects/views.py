from django.shortcuts import render, redirect
from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpResponse, Http404
from .models import Subject
from .forms import SubjectForm
from django.core import serializers

def subjects(request):
    username = request.user.username if request.user.is_authenticated else 'niezalogowano'
    all_subjects_list = Subject.objects.order_by('name')
    context = {'models': all_subjects_list, 'username': username}
    return render(request, 'subjects.html', context)

def add_subject(request):
    if request.method == "POST":
        form = SubjectForm(request.POST)
        if form.is_valid():
            new_subject = form.save()
            data = serializers.serialize('json', [new_subject])
            return HttpResponse(data)
    else:
        form = SubjectForm()
    return HttpResponse(form)

def edit_subject(request):
    if request.method == "POST":
        try:
            record_id = request.POST['id']
            subject = Subject.objects.get(pk=record_id)
            form = SubjectForm(request.POST, instance=subject)
            if form.is_valid():
                new_subject = form.save()
                data = serializers.serialize('json', [new_subject])
                return HttpResponse(data)
        except ObjectDoesNotExist:
            raise Http404("Brak przedmiotu o id %s w bazie." % record_id)
    elif request.method == "GET":
        try:
            record_id = request.GET['id']
            subject = Subject.objects.get(pk=record_id)
            form = SubjectForm(instance=subject)
        except ObjectDoesNotExist:
            raise Http404("Brak przedmiotu o id %s w bazie." % record_id)
        return HttpResponse(form)

def delete_subject(request):
    if request.method == "POST":
        record_id = request.POST.get("id")
        try:
            subject = Subject.objects.get(pk=record_id)
        except ObjectDoesNotExist:
            raise Http404("Brak przedmiotu o id %s w bazie." % record_id)
        subject.delete()
        return HttpResponse()
