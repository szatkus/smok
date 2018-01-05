# -*- coding: utf-8 -*-

from django.shortcuts import render, redirect
from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpResponse, Http404, HttpResponseRedirect
from django.urls import reverse_lazy
from .models import Teacher, TeacherClassSubject
from .forms import TeacherForm, TeacherClassSubjectForm
from django.core import serializers
from subjects.models import Subject
import re, json
from django.contrib.auth.decorators import login_required
from classProfiles.models import Class_profile, HoursAmount
from groups.models import Group
from itertools import chain
from datetime import date, datetime
from django.db import IntegrityError


@login_required
def teachers(request):
    all_teachers_list = Teacher.objects.select_related().order_by('last_name')
    teachers_list_custom = [[teacher] for teacher in all_teachers_list]

    for t in teachers_list_custom:
        hours_total = 0
        t.append(hours_total)
        t.append([])
        tcs_queryset = TeacherClassSubject.objects.filter(teacher=t[0])
        for i, tcs in enumerate(tcs_queryset):
            group = tcs.group
            profile = group.group_profile
            subject = tcs.subject
            t[2].append([])
            t[2][i].append(tcs)
            t[2][i].append('MISSING')
            for ha in HoursAmount.objects.filter(profile=profile, subject=subject):
                t[2][i][1] = str(ha.hoursno)
                hours_total += ha.hoursno
                #hours_assignment['teacher'+str(t[0].id)+'-subject'+str(subject.id)+'-group'+str(group.id)] = ha.hoursno
            t[1] = hours_total
            """
            [[<Teacher: Alala Pawel>, 0, []], 
                [<Teacher: Nowy Adam>, 10, [[<TeacherClassSubject: TeacherClassSubject object>, '2'], [<TeacherClassSubject: TeacherClassSubject object>, 'MISSING'], [<TeacherClassSubject: TeacherClassSubject object>, '8'], [<TeacherClassSubject: TeacherClassSubject object>, 'MISSING'], [<TeacherClassSubject: TeacherClassSubject object>, 'MISSING']]]]
            """

    context = {'models': all_teachers_list, 'teachers_list_custom': teachers_list_custom}
    return render(request, 'teachers.html', context)


def json_serial(obj):
    """JSON serializer for objects not serializable by default json code"""

    if isinstance(obj, (datetime, date)):
        return obj.isoformat()
    raise TypeError ("Type %s not serializable" % type(obj))

def add_teacher_assignment(request):

    if request.method == "GET":
        teacher = str(Teacher.objects.get(pk=int(dict(request.GET)['teacher-id'][0])))
        subjects_list = list(Subject.objects.order_by('name').values())
        groups_list = list(Group.objects.order_by('name').values())

        combined_subj_group = json.dumps({'subjects': subjects_list, 'groups': groups_list, 'teacher': teacher}, default=json_serial)

        return HttpResponse(combined_subj_group)

    if request.method == "POST":

        teacher_id = int(dict(request.POST)['teacher-id'][0])
        subject_id = int(dict(request.POST)['subject'][0])
        group_id = int(dict(request.POST)['group'][0])

        teacher = Teacher.objects.get(pk=teacher_id)
        subject = Subject.objects.get(pk=subject_id)
        group = Group.objects.get(pk=group_id)

        try:
            new_tcs = TeacherClassSubject(teacher=teacher, subject=subject, group=group)
            new_tcs.save()
        except IntegrityError:
            print('su ORA: integrity constraint')
            return HttpResponse(json.dumps({'error': 'UNIQUE_CONSTRAINT_VIOLATED'}))

        tcs_queryset = TeacherClassSubject.objects.filter(teacher=teacher)
        hours_total = 0
        for i, tcs in enumerate(tcs_queryset):
            for ha in HoursAmount.objects.filter(profile=tcs.group.group_profile, subject=tcs.subject):
                hours_total += ha.hoursno

        try:
            assignment_hours = HoursAmount.objects.get(profile=group.group_profile, subject=subject).hoursno
        except HoursAmount.DoesNotExist:
            assignment_hours = 'MISSING'

        response_json = json.dumps({'subject': str(subject), 'teacher_id': teacher_id, 'group': str(group), 'new_tcs': new_tcs.pk, 'total_hours': hours_total, 'assignment_hours': assignment_hours, 'group_profile_id': group.group_profile.pk},
                                         default=json_serial)

        return HttpResponse(response_json)

    return HttpResponse('')

def delete_teacher_assignment(request):
    if request.method == "POST":
        assignment_id = int(dict(request.POST)['assignmentId'][0])

        tcs = TeacherClassSubject.objects.get(pk=assignment_id)
        tcs.delete()

        tcs_queryset = TeacherClassSubject.objects.filter(teacher=tcs.teacher)
        hours_total = 0
        for i, tcs in enumerate(tcs_queryset):
            for ha in HoursAmount.objects.filter(profile=tcs.group.group_profile, subject=tcs.subject):
                hours_total += ha.hoursno

        return HttpResponse(json.dumps({'hours_total': hours_total}))
    return HttpResponse('')

def add_teacher(request):
    if request.method == "POST":
        form = TeacherForm(request.POST)
        if form.is_valid():
            new_teacher = form.save()
            data = serializers.serialize('json', [new_teacher])
            return HttpResponse(data)
        return HttpResponse('FAILED')
    else:
        form = TeacherForm()
    return HttpResponse(form)

def edit_teacher(request):
    if request.method == "POST":
        try:
            record_id = request.POST['id']
            teacher = Teacher.objects.get(pk=record_id)
            form = TeacherForm(request.POST, instance=teacher)
            if form.is_valid():
                new_teacher = form.save()
                data = serializers.serialize('json', [new_teacher])
                return HttpResponse(data)
            else:
                return HttpResponse(json.dumps([{'error': 'UNIQUE_NAME_VIOLATED'}]))
        except ObjectDoesNotExist:
            raise Http404("Brak nauczyciela o id %s w bazie." % record_id)
    elif request.method == "GET":
        try:
            record_id = request.GET['id']
            teacher = Teacher.objects.get(pk=record_id)
            form = TeacherForm(instance=teacher)
        except ObjectDoesNotExist:
            raise Http404("Brak profilu o id %s w bazie." % record_id)
        return HttpResponse(form)

def delete_teacher(request):
    if request.method == "POST":
        record_id = request.POST.get("id")
        try:
            teacher = Teacher.objects.get(pk=record_id)
        except ObjectDoesNotExist:
            raise Http404("Brak nauczyciela o id %s w bazie." % record_id)
        teacher.delete()
        return HttpResponse()
