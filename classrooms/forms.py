from django import forms
from .models import Classroom

class ClassroomForm(forms.ModelForm):

    
    class Meta:
        model = Classroom
        fields = ('name', 'building', 'seats', 'subjects', )
        widgets = {
            'name': forms.TextInput(attrs={'class': 'input-field'}),
            'building': forms.TextInput(attrs={'class': "input-field"}),         
            'seats': forms.TextInput(attrs={'class': "input-field"}),  
            'subjects': forms.TextInput(attrs={'class': "input-field"}),             
            }