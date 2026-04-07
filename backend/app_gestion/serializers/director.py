from .base import TimeStampedSerializer
from rest_framework import serializers
from app_gestion.models import Director
from rest_framework.validators import UniqueValidator
from django.core.validators import RegexValidator

class DirectorSerializer(TimeStampedSerializer):
    entidad_nombre = serializers.CharField(source='entidad.nombre', read_only=True)
    municipio_nombre = serializers.CharField(source='entidad.municipio.nombre', read_only=True)
    provincia_nombre = serializers.CharField(source='entidad.municipio.provincia.nombre', read_only=True)


    telefono = serializers.CharField(
        max_length=20,
        min_length=6,
        validators=[
            UniqueValidator(
                queryset=Director.objects.all(),
                message="Este teléfono ya está registrado"
            ),
            RegexValidator(
                regex=r'^\d+$',
                message="El teléfono debe contener solo dígitos."
            )
        ],
        error_messages={
            'min_length': 'El teléfono debe tener al menos 6 dígitos.'
        }
    )



    class Meta:
        model = Director
        fields = '__all__'
