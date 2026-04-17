from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Q
from ...models import Servicio_electrico

class TopEntidadesConsumoView(APIView):
    """
    Endpoint para las 10 entidades de mayor consumo en un año VISUAL.
    Parámetros:
        - anio (en URL): año visual.
        - unidad (query): 'kWh', 'MWh' o 'GWh' (por defecto 'kWh').
    """
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, anio):
        try:
            anio = int(anio)
        except (TypeError, ValueError):
            return Response(
                {"error": "El año debe ser un número entero válido."},
                status=status.HTTP_400_BAD_REQUEST
            )

        unidad = request.query_params.get('unidad', 'kWh').upper()
        if unidad not in ('KWH', 'MWH', 'GWH'):
            unidad = 'KWH'

        # Condición: meses reales del período visual:
        # - Meses 2 a 12 del año visual
        # - Mes 1 del año siguiente
        condicion = Q(año=anio, mes__gte=2, mes__lte=12) | Q(año=anio + 1, mes=1)

        resultados = (
            Servicio_electrico.objects
            .filter(condicion)
            .values('entidad__nombre', 'entidad__codigo_REEUP')
            .annotate(consumo_total=Sum('consumo_real'))
            .order_by('-consumo_total')[:10]
        )

        data = []
        for item in resultados:
            total_kwh = item['consumo_total'] or 0
            if unidad == 'MWH':
                total = total_kwh / 1000.0
            elif unidad == 'GWH':
                total = total_kwh / 1000000.0
            else:
                total = total_kwh
            data.append({
                "nombre": item['entidad__nombre'],
                "codigo_reeup": item['entidad__codigo_REEUP'],
                "consumo_total": total
            })

        return Response(data, status=status.HTTP_200_OK)