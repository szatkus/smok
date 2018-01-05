from django.shortcuts import render
from django.utils.timezone import now
from django.contrib.auth.decorators import login_required
from .models import Timetable, TimetablePosition
from django.http import HttpResponse, Http404, JsonResponse
from django.core.exceptions import ObjectDoesNotExist
from .forms import TimetableForm
from django.core import serializers
from groups.models import Group
from commons.models import Hours, Days
from school.models import School
from teachers.models import Teacher
from subjects.models import Subject
from classrooms.models import Classroom
import json
#from reportlab.pdfgen import canvas


@login_required
def timetables(request):
    all_timetables_list = Timetable.objects.order_by('name')
    context = {'models': all_timetables_list}
    return render(request, 'timetables.html', context)

@login_required
def timetable(request, timetable_id):
    timetable = Timetable.objects.get(pk=timetable_id)
    context = {'model': timetable}
    return render(request, 'timetable.html', context)

"""
def export_timetable(request):
    print(request)
    # Create the HttpResponse object with the appropriate PDF headers.
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = 'attachment;filename="somefilename.pdf"'

    # Create the PDF object, using the response object as its "file."
    p = canvas.Canvas(response)

    # Draw things on the PDF. Here's where the PDF generation happens.
    # See the ReportLab documentation for the full list of functionality.
    p.drawString(100, 750, "Welcome to Reportlab!")

    # Close the PDF object cleanly, and we're done.
    p.showPage()
    p.save()
    return response
"""

def add_timetable(request):
    if request.method == "POST":
        form = TimetableForm(request.POST)
        if form.is_valid():
            new_timetable = form.save(commit=False)
            new_timetable.school = request.user.school_id
            new_timetable.save()
            data = serializers.serialize('json', [new_timetable])
            return HttpResponse(data)
        return HttpResponse('FAILED')
    else:
        form = TimetableForm()
    return HttpResponse(form)

def add_timetable_position(request):
    print('add_timetable_position')
    if request.method == "POST" and request.is_ajax():
        #if timetablePosition exist then update
        isUpdate = False
        currentTimetable = Timetable.objects.get(pk=request.POST['timetable'])
        timetablePositions = TimetablePosition.objects.all().filter(timetable=currentTimetable)
        currentTimetablePosition = TimetablePosition.objects.none()
        for position in timetablePositions:
            if str(position.hour.order) == str(request.POST['hour']) and str(position.day.order) == str(request.POST['day']):
                isUpdate = True
                currentTimetablePosition = position
                break
        
        if isUpdate:
            print('update')
            #update
            currentTimetablePosition.teacher = Teacher.objects.get(first_name=request.POST['teacherFirstName'], last_name=request.POST['teacherLastName'])
            currentTimetablePosition.subject = Subject.objects.filter(name=request.POST['subject'])[0]
            currentTimetablePosition.classroom = Classroom.objects.get(name=request.POST['classroom'])
            currentTimetablePosition.save()            
        else:
            print('add')
            #add new 
            new_timetable_possition = TimetablePosition()
            new_timetable_possition.timetable = Timetable.objects.get(pk=request.POST.get('timetable', False))
            new_timetable_possition.group = Group.objects.get(pk=request.POST['group'])
            new_timetable_possition.hour = Hours.objects.get(pk=request.POST['hour'])
            new_timetable_possition.day = Days.objects.get(pk=request.POST['day'])
            new_timetable_possition.teacher = Teacher.objects.get(first_name=request.POST['teacherFirstName'], last_name=request.POST['teacherLastName'])
            new_timetable_possition.subject = Subject.objects.filter(name=request.POST['subject'])[0]
            new_timetable_possition.classroom = Classroom.objects.get(name=request.POST['classroom'])
            new_timetable_possition.save()
    
    return HttpResponse('')

def get_timetable_position(request):
    print('get_timetable_position')
    if  request.method == "GET" and request.is_ajax():
        print(request.GET)
        currentTimetable = Timetable.objects.get(pk=request.GET['timetableId'])
        timetablePositions = TimetablePosition.objects.all().filter(timetable=currentTimetable)
        allHours = Hours.objects.all()
        allHoursOrders = []
        allHoursFrom = []
        allHoursTo = []
        for hour in allHours:
            allHoursOrders.append(hour.order)
            allHoursFrom.append(hour.hour_from)
            allHoursTo.append(hour.hour_to)
        allGroups = Group.objects.all()
        allGroupNames = []
        for group in allGroups:
            allGroupNames.append(group.name)
        responseData = []
        for position in timetablePositions:
            responseData.append(
                {
                    'allGroupNamesArray': allGroupNames,
                    'ordersArray': allHoursOrders,
                    'fromArray': allHoursFrom,
                    'toArray': allHoursTo,
                    'to': position.hour.hour_to,
                    'from': position.hour.hour_from,
                    'hour': position.hour.order,
                    'day': position.day.order,
                    'group': position.group.name,
                    'teacher': position.teacher.first_name + " " + position.teacher.last_name,
                    'subject': position.subject.name,
                    'classroom': position.classroom.name,
                }
            )


    return JsonResponse(responseData, safe=False)

def edit_timetable(request):
    if request.method == "POST":
        try:
            record_id = request.POST['id']
            timetable = Timetable.objects.get(pk=record_id)
            form = TimetableForm(request.POST, instance=timetable)
            if form.is_valid():
                new_timetable = form.save(commit=False)
                new_timetable.last_updated_timestamp = now()
                new_timetable.save()
                data = serializers.serialize('json', [new_timetable])
                return HttpResponse(data)
            else:
                return HttpResponse(json.dumps([{'error': 'UNIQUE_NAME_VIOLATED'}]))
        except ObjectDoesNotExist:
            raise Http404("Brak planu o id %s w bazie." % record_id)
    elif request.method == "GET":
        try:
            record_id = request.GET['id']
            timetable = Timetable.objects.get(pk=record_id)
            form = TimetableForm(instance=timetable)
        except ObjectDoesNotExist:
            raise Http404("Brak planu o id %s w bazie." % record_id)
        return HttpResponse(form)

def delete_timetable(request):
    if request.method == "POST":
        record_id = request.POST.get("id")
        try:
            timetable = Timetable.objects.get(pk=record_id)
            timetable.delete()
        except ObjectDoesNotExist:
            raise Http404("Brak planu o id %s w bazie." % record_id)
        return HttpResponse()

