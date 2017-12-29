# -*- coding: utf-8 -*-
from django.shortcuts import render, get_object_or_404
from django.http import HttpResponseRedirect, HttpResponse
from django.urls import reverse
from django.utils import timezone
from .forms import SchoolForm
from .models import School
from users.models import User
from django.core import serializers
from django.contrib.auth.decorators import login_required
from django.core.exceptions import ObjectDoesNotExist

@login_required
def details(request):	
	username = request.user.username if request.user.is_authenticated else 'niezalogowano'
	school_details = School.objects.first()
	context = {'model': school_details, 'username': username}
	return render(request, 'school/school_details.html', context)

@login_required	
def edit_school(request):	
    if request.method == "POST":
        try:
            school = School.objects.first()
            form = SchoolForm(request.POST, instance=school)
            if form.is_valid():
                updated_school = form.save()
                updated_school.school_type_name = updated_school.school_type.type_name
                data = serializers.serialize('json', [updated_school])
                return HttpResponse(data)
        except ObjectDoesNotExist:
            raise Http404("Szkoła nie istnieje.")
    elif request.method == "GET":
        try:
            school = School.objects.first()
            form = SchoolForm(instance=school)
        except ObjectDoesNotExist:
            raise Http404("Szkoła nie istnieje.")
        return HttpResponse(form)