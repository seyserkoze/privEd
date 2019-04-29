from rest_framework import serializers
from .models import *
from rest_framework.validators import UniqueValidator


class URLSerializer(serializers.ModelSerializer):
	class Meta:
		model = Website
		fields = ('url', 'rating')


class UserSerializer(serializers.ModelSerializer):
	class Meta:
		model = User
		fields= '__all__'