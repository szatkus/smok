from django.shortcuts import render, redirect
from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpResponse, Http404
from .models import Subject

def subjects(request):
    all_subjects_list = Subject.objects.order_by('name')
    context = {'models': all_subjects_list}
    return render(request, 'subjects.html', context)

def delete_subject(request):
    if request.method == "POST":
        record_id = request.POST.get("id")
        try:
            subject = Subject.objects.get(pk=record_id)
        except ObjectDoesNotExist:
            raise Http404("Brak przedmiotu o id %s w bazie." % record_id)
        subject.delete()
        return HttpResponse()
