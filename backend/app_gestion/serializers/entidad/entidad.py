from ..base import TimeStampedSerializer
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from django.core.validators import RegexValidator
from app_gestion.models import Entidad
from ..director import DirectorSerializer

class EntidadSerializer(TimeStampedSerializer):
    oace_nombre = serializers.CharField(source='oace.nombre', read_only=True)
    osde_nombre = serializers.CharField(source='osde.nombre', read_only=True)
    sector_economico_nombre = serializers.CharField(source='sector_economico.nombre', read_only=True)
    nae_nombre = serializers.CharField(source='nae.actividad', read_only=True)
    nae_codigo = serializers.CharField(source='nae.codigo', read_only=True) 
    municipio_nombre = serializers.CharField(source='municipio.nombre', read_only=True)
    tipo = serializers.SerializerMethodField()
    director = DirectorSerializer(read_only=True)

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

    ruta_documento_contrato_electrico = serializers.CharField(
        max_length=255,
        required=False,
        allow_blank=True,
        allow_null=True,
        validators=[
            UniqueValidator(
                queryset=Entidad.objects.all(),
                message="Esta ruta de contrato ya está registrada en otra entidad."
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
    


    def validate(self, data):
        oace = data.get('oace')
        osde = data.get('osde')
        # Si ambos están presentes -> error
        if oace and osde:
            raise serializers.ValidationError("La entidad no puede pertenecer a un OACE y a un OSDE simultáneamente. Debe elegir solo uno.")
        
        return data