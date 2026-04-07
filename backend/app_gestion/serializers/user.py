from .base import TimeStampedSerializer
from rest_framework import serializers
from django.contrib.auth.models import User

class UserSerializer(TimeStampedSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']
     

   