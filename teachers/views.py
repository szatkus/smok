from django.shortcuts import render
from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpResponse, Http404
from django.shortcuts import render
from django.urls import reverse_lazy
from django.views.generic import ListView
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

    def get_context_data(self, **kwargs):
        context = super(TeachersList, self).get_context_data(**kwargs)
        user = self.request.user
        context['username'] = user.username if user.is_authenticated else 'niezalogowany'
        return context

"""
def edit_teacher(request, pk):
    if request.method == "POST":
        try:
            record_id = request.POST['id']
            subject = Subject.objects.get(pk=record_id)
            form = SubjectForm(request.POST, instance=subject)
            if form.is_valid():
                new_subject = form.save()
                data = serializers.serialize('json', [new_subject])
                return HttpResponse(data)
            else:
                return HttpResponse('FAILED')
        except ObjectDoesNotExist:
            raise Http404("Brak przedmiotu o id %s w bazie." % record_id)
    elif request.method == "GET":
        try:
            teacher = Teacher.objects.get(pk=pk)
            form = TeacherUpdateForm(instance=teacher)
        except ObjectDoesNotExist:
            raise Http404("Brak przedmiotu o id %s w bazie." % pk)
    #return HttpResponse(form)  # HttpResponse(form)
        context = {'form': form}
        return render(request, 'teacher_form.html', context)
"""

class TeacherUpdate(UpdateView):
    """
    def post(self, request, **kwargs):
        print(request.POST)
        # request.POST = request.POST.copy()
        # request.POST['some_key'] = 'some_value'
        return super(TeacherUpdate, self).post(request, **kwargs)

    def form_valid(self, form):
        instance = form.save(commit=False)
        print('enterd here as well!!')
        # instance.user = self.request.user
        return super(TeacherUpdate, self).form_valid(form)
    """
    model = Teacher
    form_class = TeacherUpdateForm
    success_url = reverse_lazy('teachers:list')


class TeacherCreate(CreateView):
    model = Teacher
    form_class = TeacherUpdateForm
    success_url = reverse_lazy('teachers:list')


class TeacherDelete(DeleteView):
    model = Teacher
    success_url = reverse_lazy('teachers:list')
