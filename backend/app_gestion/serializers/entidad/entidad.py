from ..base import TimeStampedSerializer
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from django.core.validators import RegexValidator
from app_gestion.models import Entidad, Organismo
from ..director import DirectorSerializer

class EntidadSerializer(TimeStampedSerializer):
    
    nae_nombre = serializers.CharField(source='nae.actividad', read_only=True)
    nae_codigo = serializers.CharField(source='nae.codigo', read_only=True) 
    municipio_nombre = serializers.CharField(source='municipio.nombre', read_only=True)
    tipo = serializers.SerializerMethodField()
    director = DirectorSerializer(read_only=True)
    organismo = serializers.SerializerMethodField()
    cuenta_bancaria_formateada = serializers.SerializerMethodField()

    # Validaciones
    codigo_REEUP = serializers.CharField(
        max_length=11,
        min_length=11,
        validators=[
            UniqueValidator(
                queryset=Entidad.objects.all(),
                message="Este código REEUP ya existe en la base de datos."
            ),
            RegexValidator(
                regex=r'^\d{3}\.[0-2]\.\d{5}$',
                message="El código REEUP debe tener el formato: 3 dígitos, punto, 1 dígito (0,1 o 2), punto, 5 dígitos. Ejemplo: 131.0.03527"
            )
        ],
        error_messages={
            'min_length': 'El código REEUP debe tener exactamente 11 caracteres.',
            'max_length': 'El código REEUP debe tener exactamente 11 caracteres.'
        }
    )

    cuenta_bancaria = serializers.CharField(
        max_length=16,
        min_length=16,
        required=False,
        allow_blank=True,
        allow_null=True,
        validators=[
            UniqueValidator(
                queryset=Entidad.objects.all(),
                message="Esta cuenta bancaria ya existe en la base de datos."
            ),
            RegexValidator(
                regex=r'^\d{16}$',
                message="La cuenta bancaria debe tener exactamente 16 dígitos."
            )
        ],
        error_messages={
            'min_length': 'La cuenta bancaria debe tener exactamente 16 dígitos.',
            'max_length': 'La cuenta bancaria debe tener exactamente 16 dígitos.'
        }
    )

     # Campos opcionales con unicidad
    nombre = serializers.CharField(
        max_length=20,
        required=False,
        allow_blank=True,
        allow_null=True,
        validators=[
            UniqueValidator(
                queryset=Entidad.objects.all(),
                message="Este nombre ya está registrado en otra entidad."
            )
        ]
    )

    siglas = serializers.CharField(
        max_length=20,
        required=False,
        allow_blank=True,
        allow_null=True,
        validators=[
            UniqueValidator(
                queryset=Entidad.objects.all(),
                message="Estas siglas ya están registradas en otra entidad."
            )
        ]
    )

    telefono = serializers.CharField(
        max_length=20,
        required=False,
        allow_blank=True,
        allow_null=True,
        validators=[
            UniqueValidator(
                queryset=Entidad.objects.all(),
                message="Este teléfono ya está registrado en otra entidad."
            ),
            RegexValidator(
                regex=r'^\d+$',
                message="El teléfono debe contener solo dígitos."
            )
        ]
    )

    NIT = serializers.CharField(
        max_length=11,
        min_length=11,
        required=False,
        allow_blank=True,
        allow_null=True,
        validators=[
            UniqueValidator(
                queryset=Entidad.objects.all(),
                message="Este NIT ya está registrado en otra entidad."
            ),
            RegexValidator(
                regex=r'^\d{11}$',
                message="El NIT debe tener exactamente 11 dígitos."
            )
        ],
        error_messages={
            'min_length': 'El NIT debe tener exactamente 11 dígitos.',
            'max_length': 'El NIT debe tener exactamente 11 dígitos.'
        }
    )

    direccion = serializers.CharField(
        max_length=300,
        required=False,
        allow_blank=True,
        allow_null=True,
        validators=[
            UniqueValidator(
                queryset=Entidad.objects.all(),
                message="Esta dirección ya está registrada en otra entidad."
            )
        ]
    )

    geolocalizacion = serializers.CharField(
        max_length=200,
        required=False,
        allow_blank=True,
        allow_null=True,
        validators=[
            UniqueValidator(
                queryset=Entidad.objects.all(),
                message="Esta geolocalización ya está registrada en otra entidad."
            )
        ]
    )

    class Meta:
        model = Entidad
        fields = '__all__'

    def get_tipo(self, obj):
        if hasattr(obj, 'entidad_empresarial'):
            return 'empresarial'
        elif hasattr(obj, 'entidad_presupuestada'):
            return 'presupuestada'
        return None

    def get_organismo(self, obj):
        if obj.codigo_REEUP:
            partes = obj.codigo_REEUP.split('.')
            if partes:
                codigo_org = partes[0]
                try:
                    organismo = Organismo.objects.get(codigo=codigo_org)
                    return organismo.nombre  
                except Organismo.DoesNotExist:
                    return None
        return None

    def get_cuenta_bancaria_formateada(self, obj):
        cuenta = obj.cuenta_bancaria
        if cuenta and isinstance(cuenta, str) and len(cuenta) == 16 and cuenta.isdigit():
            return f"{cuenta[:4]}-{cuenta[4:8]}-{cuenta[8:12]}-{cuenta[12:16]}"
        return cuenta