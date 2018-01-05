from django import forms
from .models import Teacher, TeacherClassSubject


class TeacherForm(forms.ModelForm):
    class Meta:
        model = Teacher
        fields = ('first_name', 'last_name')


class TeacherClassSubjectForm(forms.ModelForm):
    class Meta:
        model = TeacherClassSubject
        fields = ('subject', 'group')

