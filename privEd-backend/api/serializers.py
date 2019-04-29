from rest_framework import serializers
from .models import Website
from rest_framework.validators import UniqueValidator


class URLSerializer(serializers.ModelSerializer):
	class Meta:
		model = Website
		fields = ('url', 'rating')