from django import forms
from .models import Class_profile

class ClassProfileForm(forms.ModelForm):
    
    class Meta:
        model = Class_profile
        fields = ('name', 'description',)
        widgets = {
            'name': forms.TextInput(attrs={'class': 'input-field'}),
            'description': forms.TextInput(attrs={'class': "input-field"}),
            }
