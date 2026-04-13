from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Q
from ...models import Portador_energetico_elec

class TopEntidadesConsumoView(APIView):
    """
    Endpoint para las 10 entidades de mayor consumo en un año VISUAL.
    Parámetros:
        - anio (en URL): año visual.
        - unidad (query): 'kW' (default) o 'MW'.
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

        unidad = request.query_params.get('unidad', 'kW').upper()
        if unidad not in ('KW', 'MW'):
            unidad = 'MW'

        condicion = Q(año=anio, mes__gte=2, mes__lte=12) | Q(año=anio + 1, mes=1)

        resultados = (
            Portador_energetico_elec.objects
            .filter(condicion)
            .values('servicio__entidad__nombre', 'servicio__entidad__codigo_REEUP')
            .annotate(consumo_total=Sum('consumo_real'))
            .order_by('-consumo_total')[:10]
        )

        data = []
        for item in resultados:
            total_kw = item['consumo_total'] or 0
            total = total_kw / 1000.0 if unidad == 'MW' else total_kw
            data.append({
                "nombre": item['servicio__entidad__nombre'],
                "codigo_reeup": item['servicio__entidad__codigo_REEUP'],
                "consumo_total": total
            })

        return Response(data, status=status.HTTP_200_OK)