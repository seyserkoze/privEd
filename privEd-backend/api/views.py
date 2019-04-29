from django.shortcuts import render, redirect
from rest_framework import viewsets
from .models import *
from rest_framework.views import APIView
from .serializers import *
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

class URLView(viewsets.ModelViewSet):
	queryset = Website.objects.all()
	serializer_class = URLSerializer

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