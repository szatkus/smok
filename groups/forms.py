from django import forms
from .models import Group

class GroupForm(forms.ModelForm):

    
    class Meta:
        model = Group
        fields = ('name', 'group_profile')
