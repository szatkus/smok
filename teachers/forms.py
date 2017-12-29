# -*- coding: utf-8 -*-

from teachers.models import Teacher
from django import forms

class TeacherUpdateForm(forms.ModelForm):
	class Meta:
		model = Teacher
		fields = ('first_name','last_name','subjects','groups',)
		labels = {
		'first_name': 'Imię',
		'last_name': 'Nazwisko',
		'subjects': 'Przedmioty',
		'groups': 'Grupy',
		}
