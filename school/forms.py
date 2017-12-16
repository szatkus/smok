from django import forms

from .models import School

class SchoolForm(forms.ModelForm):

    class Meta:
        model = School
        fields = ('school_name', 'school_address', 'school_type',)
        widgets = {
            'school_name': forms.TextInput(attrs={'class': 'input-field'}),
            'school_address': forms.TextInput(attrs={'class': "input-field"}),                  
            }