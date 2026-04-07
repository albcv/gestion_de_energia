from .base import TimeStampedSerializer
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from app_gestion.models import OACE

class OACESerializer(TimeStampedSerializer):
    nombre = serializers.CharField(
        max_length=100,
        validators=[
            UniqueValidator(
                queryset=OACE.objects.all(),
                message="Ya existe un OACE con este nombre."
            )
        ]
    )
    siglas = serializers.CharField(
        max_length=20,
        validators=[
            UniqueValidator(
                queryset=OACE.objects.all(),
                message="Ya existe un OACE con estas siglas."
            )
        ]
    )
    direccion_sede_principal = serializers.CharField(
        required=False,
        allow_blank=True,
        allow_null=True,
        max_length=300
    )
    telefono_sede_principal = serializers.CharField(
        required=False,
        allow_blank=True,
        allow_null=True,
        max_length=20
    )

    class Meta:
        model = OACE
        fields = '__all__'

    def validate(self, data):
        # Validar unicidad de dirección si se proporciona
        if data.get('direccion_sede_principal'):
            qs = OACE.objects.filter(direccion_sede_principal=data['direccion_sede_principal'])
            if self.instance:
                qs = qs.exclude(pk=self.instance.pk)
            if qs.exists():
                raise serializers.ValidationError(
                    {'direccion_sede_principal': 'Ya existe un OACE con esta dirección.'}
                )
        # Validar unicidad de teléfono si se proporciona
        if data.get('telefono_sede_principal'):
            qs = OACE.objects.filter(telefono_sede_principal=data['telefono_sede_principal'])
            if self.instance:
                qs = qs.exclude(pk=self.instance.pk)
            if qs.exists():
                raise serializers.ValidationError(
                    {'telefono_sede_principal': 'Ya existe un OACE con este teléfono.'}
                )
        return data