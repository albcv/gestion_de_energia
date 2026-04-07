from .base import TimeStampedSerializer
from rest_framework import serializers
from app_gestion.models import Municipio
from rest_framework.validators import UniqueValidator
from django.core.validators import RegexValidator

class MunicipioSerializer(TimeStampedSerializer):
    provincia_nombre = serializers.CharField(source='provincia.nombre', read_only=True)

    nombre = serializers.CharField(
        max_length=Municipio._meta.get_field('nombre').max_length,
        min_length=3,
        error_messages={
            'max_length': 'Nombre incorrecto',
            'min_length': 'Nombre incorrecto'
        },
        validators=[
            UniqueValidator(
                queryset=Municipio.objects.all(),
                message="Ese nombre ya existe en la base de datos"
            ),
            RegexValidator(
                regex=r'^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+$',
                message='Nombre incorrecto'
            )
        ]
    )

    class Meta:
        model = Municipio
        fields = '__all__'