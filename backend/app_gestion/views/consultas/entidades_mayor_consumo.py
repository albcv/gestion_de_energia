from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Q
from ...models import Portador_energetico_elec

class TopEntidadesConsumoView(APIView):
    """
    Endpoint para obtener las 10 entidades con mayor consumo total en un año VISUAL,
    aplicando el desplazamiento: el consumo de un mes es el consumo del mes siguiente.
    
    Para el año visual Y se suman los consumos reales de:
    - febrero a diciembre de Y (meses 2..12)
    - enero de Y+1 (mes 1)
    
    Ejemplo: /api/consultas/top-entidades/2025/
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

        # Condición para sumar los consumos que corresponden al año visual 'anio'
        condicion = Q(año=anio, mes__gte=2, mes__lte=12) | Q(año=anio + 1, mes=1)

        resultados = (
            Portador_energetico_elec.objects
            .filter(condicion)
            .values('servicio__entidad__nombre', 'servicio__entidad__codigo_REEUP')
            .annotate(consumo_total=Sum('consumo_real'))
            .order_by('-consumo_total')[:10]
        )

        data = [
            {
                "nombre": item['servicio__entidad__nombre'],
                "codigo_reeup": item['servicio__entidad__codigo_REEUP'],
                "consumo_total": item['consumo_total'] or 0,
            }
            for item in resultados
        ]

        return Response(data, status=status.HTTP_200_OK)