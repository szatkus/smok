from django.shortcuts import render

def common(request):
	username = None
	if request.user.is_authenticated():
		username = request.user.username
	return render(request, 'navbar_template.html', {'username': username})