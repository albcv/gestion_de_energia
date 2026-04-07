from .base import TimeStampedSerializer
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from django.core.validators import RegexValidator
from app_gestion.models import Provincia

class ProvinciaSerializer(TimeStampedSerializer):
    nombre = serializers.CharField(
        max_length=Provincia._meta.get_field('nombre').max_length,
        min_length=4,
        error_messages={
            'max_length': 'Nombre incorrecto',
            'min_length': 'Nombre incorrecto'
        },
        validators=[
            UniqueValidator(
                queryset=Provincia.objects.all(),
                message="Ya existe en la base de datos"
            ),
            RegexValidator(
                regex=r'^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$',
                message='Nombre incorrecto'
            )
        ]
    )

    class Meta:
        model = Provincia
        fields = '__all__'