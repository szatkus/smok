from django.shortcuts import render
from django.utils.timezone import now
from django.contrib.auth.decorators import login_required
from .models import Timetable
from django.http import HttpResponse, Http404
from django.core.exceptions import ObjectDoesNotExist
from .forms import TimetableForm
from django.core import serializers
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

