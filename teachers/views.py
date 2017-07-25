from django.shortcuts import render

from django.http import HttpResponse;
from django.shortcuts import render

from django.urls import reverse_lazy


from django.views.generic import ListView;
from django.views.generic.edit import FormView, CreateView, UpdateView, DeleteView;

from school.models import School
from teachers.models import Teacher

from teachers.forms import TeacherUpdateForm
	
def index(request):
	username = request.user.username if request.user.is_authenticated else 'niezalogowano';
	return render(
		request,
		'teachers/index.html',
		{
			'username': username
		}
	)
	
class TeachersList(ListView):
	model = Teacher
	template_name = 'teachers/index.html'
	
	def get_context_data(self,**kwargs):
		context = super(TeachersList,self).get_context_data(**kwargs)
		user = self.request.user
		context['username'] = user.username if user.is_authenticated else 'niezalogowany'
		return context;
		
class TeacherUpdate(UpdateView):
	model = Teacher
	form_class = TeacherUpdateForm
	success_url = reverse_lazy('teachers:list')
	
class TeacherCreate(CreateView):
	model = Teacher
	form_class = TeacherUpdateForm
	success_url = reverse_lazy('teachers:list')
	
class TeacherDelete(DeleteView):
	model = Teacher;
	success_url = reverse_lazy('teachers:list')