from .base import TimeStampedSerializer
from rest_framework import serializers
from django.contrib.auth.models import User


class UserSerializer(TimeStampedSerializer):
    password = serializers.CharField(write_only=True, required=False, allow_blank=True)
    last_login = serializers.SerializerMethodField()
    date_joined = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'password', 'is_active', 'is_staff', 'is_superuser', 'date_joined', 'last_login']
        read_only_fields = ['date_joined', 'last_login']

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User(**validated_data)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()  
        user.save()
        return user

    def get_last_login(self, obj):
        """Formatea el último acceso como dd/mm/aaaa HH:MM"""
        if obj.last_login:
            return obj.last_login.strftime('%d/%m/%Y %H:%M')
        return None

    def get_date_joined(self, obj):
        """Formatea el último acceso como dd/mm/aaaa HH:MM"""
        if obj.date_joined:
            return obj.date_joined.strftime('%d/%m/%Y %H:%M')
        return None

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance
   