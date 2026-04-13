from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum
from ...models import Portador_energetico_elec
import calendar

class ConsumoPorMesView(APIView):
    """
    Endpoint para obtener el consumo por mes con desplazamiento hacia adelante.
    Parámetros:
        - anio (requerido): año visual.
        - unidad (opcional): 'kW' (default) o 'MW'.
    """
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        año_param = request.query_params.get('anio')
        unidad = request.query_params.get('unidad', 'kW').upper()

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

        if unidad not in ('KW', 'MW'):
            unidad = 'MW'

        resultado = []
        for mes_visual in range(1, 13):
            if mes_visual == 12:
                año_real = año + 1
                mes_real = 1
            else:
                año_real = año
                mes_real = mes_visual + 1

            total_kw = (
                Portador_energetico_elec.objects
                .filter(año=año_real, mes=mes_real)
                .aggregate(total=Sum('consumo_real'))['total'] or 0
            )

            # Conversión según unidad
            total = total_kw / 1000.0 if unidad == 'MW' else total_kw

            resultado.append({
                'mes': mes_visual,
                'mes_nombre': calendar.month_name[mes_visual],
                'total': total
            })

        return Response(resultado, status=status.HTTP_200_OK)