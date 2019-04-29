from django.shortcuts import render
from rest_framework import viewsets
from .models import *
from rest_framework.views import APIView
from .serializers import *
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404

class URLView(viewsets.ModelViewSet):
	queryset = Website.objects.all()
	serializer_class = URLSerializer

	def create(self, request):
		queryset = Website.objects.all()

	def retrieve(self, request, pk=None):
		print(pk)
		queryset = Website.objects.all()

		try:
			rating = Website.objects.get(url=pk)
			serializer = URLSerializer(rating)
		except:
			new_rating = Website(url=pk,rating=0)
			new_rating.save()
			serializer = URLSerializer(new_rating)
		return Response(serializer.data)


class RegisterView(APIView):

	def post(self, request, format='json'):

		email = request.data['email']
		identity = request.data['id']

		print (email, identity)

		if (not User.objects.filter(identity=identity).exists()):
			new_user = User.objects.create(identity=identity, email=email)
			new_user.save()
			return Response({'message': 'user created'}, status=status.HTTP_200_OK)

		return Response({'message': 'user already exists'}, status= status.HTTP_200_OK)


class UserView(viewsets.ModelViewSet):
	queryset= User.objects.all()
	serializer_class = UserSerializer

class VisitView(APIView):

	def post(self, request, format='json'):
		print(request.data)

		identity = request.data['id']
		advSet = request.data.getlist('advSet[]')
		trackSet = request.data.getlist('trackSet[]')
		socSet = request.data.getlist('socSet[]')
		otherSet = request.data.getlist('otherSet[]')
		website = request.data['website']

		user = User.objects.get(identity=identity)

		new_website = None

		if Website.objects.filter(url=website).exists():
			new_website = Website.objects.get(url=website)
			user.history.add(new_website)
			user.save()

		else:
			new_website = Website.objects.create(url=website, rating=0)
			new_website.save()
			user.history.add(new_website)
			user.save()

		for elem in advSet:
			print(elem)
			if not Tracker.objects.filter(url=elem).exists():
				new_tracker = Tracker.objects.create(url=elem, kind="advertising")
				new_tracker.save()
				new_website.trackers.add(new_tracker)
				new_website.save()

		for elem in socSet:
			if not Tracker.objects.filter(url=elem).exists():
				new_tracker = Tracker.objects.create(url=elem, kind="social")
				new_tracker.save()
				new_website.trackers.add(new_tracker)
				new_website.save()

		for elem in trackSet:
			if not Tracker.objects.filter(url=elem).exists():
				new_tracker = Tracker.objects.create(url=elem, kind="analytics")
				new_tracker.save()
				new_website.trackers.add(new_tracker)
				new_website.save()

		for elem in otherSet:
			if not Tracker.objects.filter(url=elem).exists():
				new_tracker = Tracker.objects.create(url=elem, kind="other")
				new_tracker.save()
				new_website.trackers.add(new_tracker)
				new_website.save()

		return Response({'message': 'graphing'}, status=status.HTTP_200_OK)


@csrf_exempt
def history(request):

	if (request.method=="POST"):
		print(request.POST)
		print("done")
		identity = request.POST['identity']

	return render(request, 'graph.html', {"identity": identity})