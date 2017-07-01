from django.test import TestCase
from django.urls import reverse
from .models import Subject

class SubjectModelTests(TestCase):

    def test_subject_name(self):
        subject = Subject(name="Krzywe eliptyczne")
        self.assertIs(subject.__str__(), "Krzywe eliptyczne")

class SubjectSubjectsViewTests(TestCase):

    def test_no_subjects(self):
        response = self.client.get(reverse('subjects-views-subjects'))
        self.assertEqual(response.status_code, 200)
        self.assertQuerysetEqual(response.context['models'], [])

    def test_multiple_subjects(self):
        Subject.objects.create(name='Fizyka dla informatyków')
        Subject.objects.create(name='Algorytmy i struktury danych')
        
        response = self.client.get(reverse('subjects-views-subjects'))
        self.assertEqual(response.status_code, 200)
        self.assertQuerysetEqual(
            response.context['models'],
            ['<Subject: Algorytmy i struktury danych>', '<Subject: Fizyka dla informatyków>']
        )
