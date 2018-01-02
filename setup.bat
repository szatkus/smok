@echo off

echo buduje venv...
python -m venv venv

echo instaluje potrzebne biblioteki z requirements.txt...
venv\Scripts\pip.exe   install -r requirements.txt

echo przygotowuje i robie migracje
venv\Scripts\python   manage.py makemigrations school users subjects groups teachers timetables classrooms commons availability classProfiles
venv\Scripts\python   manage.py migrate
 
echo laduje dane testowe 
venv\Scripts\python   manage.py loaddata testdata.json
 
echo tworze uzytkownikow admin i testuser 
venv\Scripts\python manage.py shell -c "from django.contrib.auth import get_user_model; get_user_model().objects.create_superuser('admin', 'admin@example.com', 'pass')" 
venv\Scripts\python manage.py shell -c "from school.models import School; from django.contrib.auth import get_user_model; get_user_model().objects.create_user(username='testuser', email='testuser@example.com', password='pass', school_id=School.objects.first())"