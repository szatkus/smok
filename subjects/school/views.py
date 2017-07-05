# -*- coding: utf-8 -*-
from django.shortcuts import render, get_object_or_404
from django.http import HttpResponseRedirect, HttpResponse
from django.urls import reverse
from django.utils import timezone
from .forms import SchoolForm
from .models import School
from users.models import User

def school_list(request):
    school_list = School.objects.filter(user=request.user)
    context = {'school_list': school_list}
    return render(request, 'school/school_list.html', context)
    
def details(request, school_id):
    current_school = School.objects.get(id=school_id)
    if request.method == "POST":
        form = SchoolForm(request.POST, instance=current_school)
        if form.is_valid():
            form.save(commit=False)
            current_school.last_updated_timestamp = timezone.now()
            form.save()
        return HttpResponseRedirect(reverse('school:school_list'))
    else:
        form = SchoolForm(instance=current_school)
        context = {'current_school': current_school, 'form': form}
        return render(request, 'school/school_edit.html', context)
 
def add(request):
    new_school = School()
    if request.method == "POST":
        form = SchoolForm(request.POST, instance=new_school)
        if form.is_valid():
            form.save(commit=False)
            new_school.last_updated_timestamp = timezone.now()
            form.save()
            current_user = request.user
            current_user.school_id.add(new_school)
        return HttpResponseRedirect(reverse('school:school_list'))
    else:
        form = SchoolForm(instance=new_school)
        context = {'new_school': new_school, 'form': form}
        return render(request, 'school/school_edit.html', context)

    
  #  https://docs.djangoproject.com/pl/1.11/intro/tutorial07/