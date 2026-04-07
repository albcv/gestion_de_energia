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
    Endpoint para obtener el consumo total por mes para un año específico.
    Ejemplo: /api/consultas/consumo-por-mes/?año=2025
    """
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        año = request.query_params.get('anio')
        if not año:
            return Response(
                {"error": "Debe proporcionar el parámetro 'año'."},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            año = int(año)
        except ValueError:
            return Response(
                {"error": "El año debe ser un número entero."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Obtener los datos agrupados por mes
        datos = (
            Portador_energetico_elec.objects
            .filter(año=año)
            .values('mes')
            .annotate(total=Sum('consumo_real'))
            .order_by('mes')
        )

        # Construir una lista con todos los meses (1-12) incluyendo los que no tienen datos
        meses = list(range(1, 13))
        resultado = []
        for mes in meses:
            total = next((item['total'] for item in datos if item['mes'] == mes), 0)
            resultado.append({
                'mes': mes,
                'mes_nombre': calendar.month_name[mes],  # nombre en inglés, pero puedes traducir si prefieres
                'total': total
            })

        return Response(resultado, status=status.HTTP_200_OK)