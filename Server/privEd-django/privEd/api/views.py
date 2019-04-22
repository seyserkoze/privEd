from django.shortcuts import render, redirect
from rest_framework import viewsets
from .models import URLAssociations
from rest_framework.views import APIView
from .serializers import *
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

class URLView(viewsets.ModelViewSet):
	queryset = URLAssociations.objects.all()
	serializer_class = URLSerializer

	def retrieve(self, request, pk=None):
		print(pk)
		queryset = URLAssociations.objects.all()

		try:
			rating = URLAssociations.objects.get(url=pk)
			serializer = URLSerializer(rating)
		except:
			new_rating = URLAssociations(url=pk,rating=0)
			new_rating.save()
			serializer = URLSerializer(new_rating)
		return Response(serializer.data)