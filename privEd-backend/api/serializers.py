from rest_framework import serializers
from .models import URLAssociations
from rest_framework.validators import UniqueValidator


class URLSerializer(serializers.ModelSerializer):
	class Meta:
		model = URLAssociations
		fields = "__all__"