from django.shortcuts import render

from django.http import HttpResponse;
from django.shortcuts import render

from django.urls import reverse_lazy


from django.views.generic import ListView;
from django.views.generic.edit import FormView, CreateView, UpdateView, DeleteView;

from commons import models as commons_models

def index(request,teacher_id):
	username = request.user.username if request.user.is_authenticated else 'niezalogowano';
	hours = commons_models.Hours.objects.all().order_by('order');
	days = commons_models.Days.objects.all().order_by('order');
	return render(
		request,
		'availability/availability.html',
		{
			'username': username,
			'hours': hours,
			'days':days,
			'days_count': len(days),
			'teacher_id':123
		}
	)