from django.shortcuts import render

from django.http import HttpResponse;
from django.shortcuts import render

from school.models import School
	
def index(request):
	username = request.user.username if request.user.is_authenticated else 'niezalogowano';
	return render(
		request,
		'teachers\index.html',
		{
			'username': username
		}
	)
	

# Create your views here.
