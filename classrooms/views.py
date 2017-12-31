from django.shortcuts import render, redirect
from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpResponse, Http404
from .models import Classroom
from .forms import ClassroomForm
from django.core import serializers
from django.contrib.auth.decorators import login_required
import json


@login_required
def classroom_list(request):
    username = request.user.username if request.user.is_authenticated else 'niezalogowano'
    all_classrooms_list = Classroom.objects.order_by('name')
    context = {'models': all_classrooms_list, 'username': username}
    return render(request, 'classrooms/classrooms.html', context)

def add_classroom(request):
    if request.method == "POST":
        form = ClassroomForm(request.POST)
        if form.is_valid():
            new_classroom = form.save()
            related_subjects = [str(subj) for subj in new_classroom.available_subjects.all()]
            data = serializers.serialize('json', [new_classroom])
            data = json.loads(data)
            for s in range(len(data)):
                data[s]['relatedSubjects'] = ', '.join(related_subjects)
            return HttpResponse(json.dumps(data))
        else:
            return HttpResponse(json.dumps([{'error': 'UNIQUE_NAME_VIOLATED'}]))
    else:
        form = ClassroomForm()
    return HttpResponse(form) 

def edit_classroom(request):
    if request.method == "POST":
        try:
            record_id = request.POST['id']
            classroom = Classroom.objects.get(pk=record_id)
            form = ClassroomForm(request.POST, instance=classroom)
            if form.is_valid():
                new_classroom = form.save()
                related_subjects = [str(subj) for subj in new_classroom.available_subjects.all()]
                data = serializers.serialize('json', [new_classroom])
                data = json.loads(data)
                for s in range(len(data)):
                    data[s]['relatedSubjects'] = ', '.join(related_subjects)
                return HttpResponse(json.dumps(data))
            else:
                return HttpResponse(json.dumps([{'error': 'UNIQUE_NAME_VIOLATED'}]))
        except ObjectDoesNotExist:
            raise Http404("Brak sali o id %s w bazie." % record_id)
    elif request.method == "GET":
        try:
            record_id = request.GET['id']
            classroom = Classroom.objects.get(pk=record_id)
            form = ClassroomForm(instance=classroom)
        except ObjectDoesNotExist:
            raise Http404("Brak sali o id %s w bazie." % record_id)
        return HttpResponse(form)

def delete_classroom(request):
    if request.method == "POST":
        record_id = request.POST.get("id")
        try:
            classroom = Classroom.objects.get(pk=record_id)
        except ObjectDoesNotExist:
            raise Http404("Brak sali o id %s w bazie." % record_id)
        classroom.delete()
        return HttpResponse()