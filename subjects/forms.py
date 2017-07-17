from django import forms
from .models import Subject

class SubjectForm(forms.ModelForm):
    #add_another = forms.BooleanField(required=False, label = "Dodaj kolejny")
    
    class Meta:
        model = Subject
        fields = ('name', 'description',)
        widgets = {
            'name': forms.TextInput(attrs={'class': 'input-field'}),
            'description': forms.TextInput(attrs={'class': "input-field"}),
            }
