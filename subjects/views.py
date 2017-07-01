from django.shortcuts import render
from .models import Subject

def subjects(request):
    all_subjects_list = Subject.objects.order_by('name')
    context = {'models': all_subjects_list}
    return render(request, 'subjects.html', context)
