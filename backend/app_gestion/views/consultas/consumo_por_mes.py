from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum
import calendar
from ...models import Servicio_electrico

class ConsumoPorMesView(APIView):
    """
    Endpoint para obtener el consumo por mes con desplazamiento hacia adelante.
    Parámetros:
        - anio (requerido): año visual.
        - unidad (opcional): 'kWh', 'MWh' o 'GWh' (por defecto 'kWh').
    """
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        año_param = request.query_params.get('anio')
        unidad = request.query_params.get('unidad', 'kWh').upper()

        if not año_param:
            return Response(
                {"error": "Debe proporcionar el parámetro 'anio'."},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            año = int(año_param)
        except ValueError:
            return Response(
                {"error": "El año debe ser un número entero."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if unidad not in ('KWH', 'MWH', 'GWH'):
            unidad = 'KWH'

        resultado = []
        for mes_visual in range(1, 13):
            # Desplazamiento: mes visual 1 corresponde a mes real 2 del año visual
            # mes visual 12 corresponde a mes real 1 del año siguiente
            if mes_visual == 12:
                año_real = año + 1
                mes_real = 1
            else:
                año_real = año
                mes_real = mes_visual + 1

            total_kwh = (
                Servicio_electrico.objects
                .filter(año=año_real, mes=mes_real)
                .aggregate(total=Sum('consumo_real'))['total'] or 0
            )

            # Conversión según unidad
            if unidad == 'MWH':
                total = total_kwh / 1000.0
            elif unidad == 'GWH':
                total = total_kwh / 1000000.0
            else:
                total = total_kwh

            resultado.append({
                'mes': mes_visual,
                'mes_nombre': calendar.month_name[mes_visual],
                'total': total
            })

        return Response(resultado, status=status.HTTP_200_OK)