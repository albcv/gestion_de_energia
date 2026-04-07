from .base import TimeStampedSerializer
from app_gestion.models import Sector_economico

class SectorEconomicoSerializer(TimeStampedSerializer):
    class Meta:
        model = Sector_economico
        fields = '__all__'