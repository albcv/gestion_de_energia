from .base import TimeStampedSerializer
from rest_framework import serializers
from django.contrib.auth.models import User


class UserSerializer(TimeStampedSerializer):
    password = serializers.CharField(write_only=True, required=False, allow_blank=True)
    last_login = serializers.SerializerMethodField()
    date_joined = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'password', 
                  'is_active', 'is_staff', 'is_superuser', 'date_joined', 'last_login']
        read_only_fields = ['date_joined', 'last_login']

    def to_internal_value(self, data):
        """
        Convierte los valores null de first_name, last_name y email a cadenas vacías.
        """
        
        mutable_data = data.copy() if isinstance(data, dict) else data
        for field in ['first_name', 'last_name', 'email']:
            if field in mutable_data and mutable_data[field] is None:
                mutable_data[field] = ''
        return super().to_internal_value(mutable_data)

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        # Asegurar que first_name, last_name, email nunca sean None
        for field in ['first_name', 'last_name', 'email']:
            if validated_data.get(field) is None:
                validated_data[field] = ''
        user = User(**validated_data)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()  
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        # Actualizar los campos, convirtiendo None a '' si es necesario
        for attr, value in validated_data.items():
            if value is None and attr in ['first_name', 'last_name', 'email']:
                value = ''
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance

    def get_last_login(self, obj):
        if obj.last_login:
            return obj.last_login.strftime('%d/%m/%Y %H:%M')
        return None

    def get_date_joined(self, obj):
        if obj.date_joined:
            return obj.date_joined.strftime('%d/%m/%Y %H:%M')
        return None