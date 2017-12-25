from django import forms
from .models import Subject

class SubjectForm(forms.ModelForm):
    #add_another = forms.BooleanField(required=False, label = "Dodaj kolejny")
    
    class Meta:
        model = Subject
        fields = ('name', 'code','description','special_classroom_req')
        widgets = {
            'name': forms.TextInput(attrs={'class': 'input-field'}),
            'code': forms.TextInput(attrs={'class': "input-field"}),
            'description': forms.TextInput(attrs={'class': "input-field"}),
            }
