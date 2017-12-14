#!/bin/bash

SCRIPT=$(readlink -f "$0")
SCRIPTPATH=$(dirname "$SCRIPT")

pushd $SCRIPTPATH

find . -name migrations -type d -not -path "./venv/*" -exec rm -r {} \; 2>/dev/null
[ -f db.sqlite3 ] && rm db.sqlite3

venv/bin/python manage.py makemigrations school users subjects groups teachers timetables classrooms commons availability classProfiles
venv/bin/python manage.py migrate
venv/bin/python manage.py loaddata testdata.json
echo "Loaded test data"
echo "from django.contrib.auth import get_user_model; get_user_model().objects.create_superuser('admin', 'admin@example.com', 'pass')" | venv/bin/python manage.py shell
echo "Created superuser with login: admin and password: pass"
echo "from school.models import School; from django.contrib.auth import get_user_model; get_user_model().objects.create_user(username='testuser', email='testuser@example.com', password='pass', school_id=School.objects.first())" | venv/bin/python manage.py shell
echo "Created user with login: testuser and password: pass"
