from django import forms
from .models import Class_profile, HoursAmount

class ClassProfileForm(forms.ModelForm):
    
    class Meta:
        model = Class_profile
        fields = ('name', 'grade', 'description')

class HoursAmountForm(forms.ModelForm):
    class Meta:
        model = HoursAmount
        exclude = ()
        labels = {
            'profile': 'Profil',
            'subject': 'Przedmiot',
            'hoursno': 'L. godzin',
        }

"""
class HoursAmountForm(forms.ModelForm):

    test = forms.ChoiceField()
    #days = forms.ChoiceField(choices=[(x, x) for x in range(1, 32)])
    def __init__(self, *args, **kwargs):
         super(HoursAmountForm, self).__init__(*args, **kwargs)
         self.fields["test"].choices = \
         [(item.subject.name, item.subject.name) for item in HoursAmount.objects.all()]

    class Meta:
        model = HoursAmount
        fields = ('profile', 'hoursno', 'test')
"""
"""
class Customer(models.Model):
  phone_number = models.ForeignKey(PhoneNumber)

class PhoneNumber(models.Model):
  TYPES = (
      ('Cell', 'Cell'),
      ('Home', 'Home'),
      ('Fax', 'Fax'),
      ('Work', 'Work'),
  )
  primary = models.BooleanField(default=False)
  phone_type = models.CharField(max_length=30, choices=TYPES, default='Cell')
  number = models.CharField(max_length=15)
  
from yourapp.models import PhoneNumber    

class CustomerCreateForm(forms.ModelForm):
    '''
    Base form for creating customers
    '''
    def __init__(self, *args, **kwargs):
        self.helper = FormHelper()
        self.helper.layout = Layout(
            Fieldset(
                'Personal Information',
                'phone_number',
            ),
         FormActions(
             Submit('submit' , 'Submit' , css_class='btn btn-success'), 
             Button('cancel' , 'Cancel' , css_class='btn btn-warning', 
                    onclick='javascript:history.go(-1);'), 
             )
         )
         super(CustomerCreateForm, self).__init__(*args, **kwargs)
         self.fields["phone_number"].choices = \
         [(item.number, item.number) for item in PhoneNumber.objects.all()]

         class Meta:
             model = Customer
             exclude = (
                 'create_user',
                 'modify_user'
             )
"""
