# -*- coding: utf-8 -*-

from django.shortcuts import render

from django.http import HttpResponse;
from django.shortcuts import render, redirect

from django.urls import reverse_lazy


from django.views.generic import ListView;
from django.views.generic.edit import FormView, CreateView, UpdateView, DeleteView;

from commons import models as commons_models
from teachers.models import Teacher;
from availability.models import TeachersAvailability;
from commons.models import Days,Hours;

def input(request,teacher_id):
	username = request.user.username if request.user.is_authenticated else 'niezalogowano';
	hours = commons_models.Hours.objects.all().order_by('order');
	days = commons_models.Days.objects.all().order_by('order');
	teacher  = Teacher.objects.get(pk=teacher_id)
	
	is_check_selected = {};
	
	for elem in teacher.teachersavailability_set.all():
		#key = elem.day.pk+"/"+elem.hour.pk;
		key = '{}/{}'.format(elem.day.pk, elem.hour.pk);
		is_check_selected[key]=True;
	return render(
		request,
		'availability/availability.html',
		{
			'username': username,
			'hours': hours,
			'days':days,
			'days_count': len(days),
			'teacher_id':teacher_id,
			'teacher':teacher,
			'is_check_selected':is_check_selected,
			'test':'1/1'
		}
	)
	
def save(request,teacher_id):
	#usuwam stare wpisy o dostepnosci
	teacher = Teacher.objects.get(pk=teacher_id);
	teacher.teachersavailability_set.all().delete();
	
	# na wejściu zaznaczone checkboxy o kluczy a/b, gdzie a=pk dnia (np. piniedzialek), b= pk godziny lekcyjnej
	selected = [k.split('/') for k,v in request.POST.dict().items() if k!='csrfmiddlewaretoken']
	for elem in selected:
		day = Days.objects.get(pk=elem[0]);
		hour = Hours.objects.get(pk=elem[1]);
		avail = TeachersAvailability(teacher=teacher,day=day,hour=hour,available=True);
		avail.save();
		
	return redirect('teachers:list');
