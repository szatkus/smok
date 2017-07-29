from django import forms
from .models import Group

class GroupForm(forms.ModelForm):

    
    class Meta:
        model = Group
        fields = ('name', 'group_profile',)
        widgets = {
            'name': forms.TextInput(attrs={'class': 'input-field'}),
            'group_profile': forms.TextInput(attrs={'class': "input-field"}),         
            }