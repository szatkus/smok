from django.shortcuts import render, redirect
from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpResponse, Http404
from .models import Class_profile, HoursAmount
from .forms import ClassProfileForm, HoursAmountForm
from django.core import serializers
from django.forms import inlineformset_factory
from subjects.models import Subject

def profiles(request):
    username = request.user.username if request.user.is_authenticated else 'niezalogowano'
    #class_profile = Class_profile.objects.order_by('name')
    all_profiles_list = Class_profile.objects.select_related()
    print(all_profiles_list)
    context = {'models': all_profiles_list, 'username': username}
    return render(request, 'class-profiles.html', context)

def custom_form_field_callback(field, **kwargs):
    #subjects_query = Subject.objects.filter(filter_field=filter_value)
    if field.name == "subject":
        #return Subject(queryset= subjects_query)
        pass
    else:
         return field.formfield(**kwargs)

def profile(request, profile_id):
    username = request.user.username if request.user.is_authenticated else 'niezalogowano'
    profile = Class_profile.objects.get(pk=profile_id)
    inline_form = inlineformset_factory(Class_profile, HoursAmount, exclude=('profile',),
                                        can_delete=False,
                                        extra=0,
                                        form=HoursAmountForm
                                        #,formfield_callback=custom_form_field_callback
                                        )
    form = inline_form(instance=profile)
    context = {'model': profile, 'username': username, 'form': form}
    return render(request, 'class-profile.html', context)

"""
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
"""
def add_profile(request):
    if request.method == "POST":
        form = ClassProfileForm(request.POST)
        if form.is_valid():
            new_profile = form.save()
            data = serializers.serialize('json', [new_profile])
            return HttpResponse(data)
    else:
        form = ClassProfileForm()
    return HttpResponse(form)

def edit_profile(request):
    if request.method == "POST":
        try:
            record_id = request.POST['id']
            profile = Class_profile.objects.get(pk=record_id)
            form = ClassProfileForm(request.POST, instance=profile)
            if form.is_valid():
                new_profile = form.save()
                data = serializers.serialize('json', [new_profile])
                return HttpResponse(data)
        except ObjectDoesNotExist:
            raise Http404("Brak profilu o id %s w bazie." % record_id)
    elif request.method == "GET":
        try:
            record_id = request.GET['id']
            profile = Class_profile.objects.get(pk=record_id)
            form = ClassProfileForm(instance=profile)
        except ObjectDoesNotExist:
            raise Http404("Brak profilu o id %s w bazie." % record_id)
        return HttpResponse(form)

def delete_profile(request):
    if request.method == "POST":
        record_id = request.POST.get("id")
        try:
            profile = Class_profile.objects.get(pk=record_id)
        except ObjectDoesNotExist:
            raise Http404("Brak przedmiotu o id %s w bazie." % record_id)
        profile.delete()
        return HttpResponse()
