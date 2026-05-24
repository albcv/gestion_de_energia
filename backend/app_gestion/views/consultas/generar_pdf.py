# views/consultas/generate_pdf.py
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import HttpResponse
from django.template.loader import render_to_string
from weasyprint import HTML
from datetime import datetime
from ...authentication import CookieTokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Q, Count
from ...models import Servicio_electrico, Entidad

class GenerateReportPDFView(APIView):
    """
    Endpoint para generar un reporte PDF de la consulta seleccionada.
    """
    authentication_classes = [CookieTokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        consulta = request.query_params.get('consulta')
        anio_str = request.query_params.get('anio')
        entidad_id = request.query_params.get('entidadId')
        unidad = request.query_params.get('unidad', 'kWh').upper()

        if not consulta:
            return Response({"error": "Falta el parámetro 'consulta'"}, status=400)

        if consulta in ['consumo', 'servicios', 'info'] and not entidad_id:
            return Response({"error": "Esta consulta requiere entidadId"}, status=400)

        if consulta in ['consumo', 'consumo_global', 'top_consumo'] and not anio_str:
            return Response({"error": "Esta consulta requiere año"}, status=400)

        anio = int(anio_str) if anio_str else None

        meses_nombres = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ]

        context = {
            'consulta': consulta,
            'anio': anio,
            'unidad': unidad,
            'fecha_generacion': datetime.now().strftime('%d/%m/%Y %H:%M:%S'),
        }

        try:
            if consulta == 'info' and entidad_id:
                entidad = Entidad.objects.get(pk=entidad_id)
                campos = [
                    ('Nombre', entidad.nombre),
                    ('Código REEUP', entidad.codigo_REEUP),
                    ('Municipio', entidad.municipio.nombre if entidad.municipio else None),
                    ('NAE', f"{entidad.nae.codigo} - {entidad.nae.actividad}" if entidad.nae else None),
                    ('Siglas', entidad.siglas),
                    ('Cuenta bancaria', entidad.cuenta_bancaria),
                    ('Teléfono', entidad.telefono),
                    ('NIT', entidad.NIT),
                    ('Dirección', entidad.direccion),
                    ('Geolocalización', entidad.geolocalizacion),
                ]
                context['datos'] = [{'label': lbl, 'value': val} for lbl, val in campos if val]

           
            elif consulta == 'servicios' and entidad_id:
                entidad = Entidad.objects.get(pk=entidad_id)
                context['entidad_nombre'] = entidad.nombre
                context['codigo_reeup'] = entidad.codigo_REEUP
                servicios_qs = (
                    Servicio_electrico.objects
                    .filter(entidad_id=entidad_id)
                    .values('codigo_servicio', 'mes', 'año', 'consumo_real')
                    .order_by('año', 'mes')
                )
                servicios = []
                for s in servicios_qs:
                    mes_orig = s['mes']
                    año_orig = s['año']
                    # Restar 1 al mes, ajustando año
                    if mes_orig == 1:
                        mes_display = 12
                        año_display = año_orig - 1
                    else:
                        mes_display = mes_orig - 1
                        año_display = año_orig
                   
                   
                    s['mes_display'] = mes_display
                    s['año_display'] = año_display
                  
                    servicios.append(s)
                context['servicios'] = servicios

            elif consulta == 'consumo' and entidad_id and anio:
                entidad = Entidad.objects.get(pk=entidad_id)
                context['entidad_nombre'] = entidad.nombre
                context['codigo_reeup'] = entidad.codigo_REEUP

                resultado_mensual = []
                for mes_visual in range(1, 13):
                    if mes_visual == 12:
                        año_real = anio + 1
                        mes_real = 1
                    else:
                        año_real = anio
                        mes_real = mes_visual + 1

                    total_kwh = Servicio_electrico.objects.filter(
                        entidad=entidad, año=año_real, mes=mes_real
                    ).aggregate(total=Sum('consumo_real'))['total'] or 0

                    if unidad == 'MWH':
                        total = total_kwh / 1000.0
                    elif unidad == 'GWH':
                        total = total_kwh / 1_000_000.0
                    else:
                        total = total_kwh

                    resultado_mensual.append({
                        'mes': mes_visual,
                        'nombre_mes': meses_nombres[mes_visual - 1],
                        'total': total
                    })

                max_total = max((item['total'] for item in resultado_mensual), default=0)
                for item in resultado_mensual:
                    item['ancho'] = (item['total'] / max_total * 100) if max_total > 0 else 0

                context['consumo_mensual'] = resultado_mensual

            elif consulta == 'consumo_global' and anio:
                resultado_mensual = []
                for mes_visual in range(1, 13):
                    if mes_visual == 12:
                        año_real = anio + 1
                        mes_real = 1
                    else:
                        año_real = anio
                        mes_real = mes_visual + 1

                    total_kwh = Servicio_electrico.objects.filter(
                        año=año_real, mes=mes_real
                    ).aggregate(total=Sum('consumo_real'))['total'] or 0

                    if unidad == 'MWH':
                        total = total_kwh / 1000.0
                    elif unidad == 'GWH':
                        total = total_kwh / 1_000_000.0
                    else:
                        total = total_kwh

                    resultado_mensual.append({
                        'mes': mes_visual,
                        'nombre_mes': meses_nombres[mes_visual - 1],
                        'total': total
                    })

                max_total = max((item['total'] for item in resultado_mensual), default=0)
                for item in resultado_mensual:
                    item['ancho'] = (item['total'] / max_total * 100) if max_total > 0 else 0

                context['consumo_mensual'] = resultado_mensual

            elif consulta == 'top_consumo' and anio:
                condicion = Q(año=anio, mes__gte=2, mes__lte=12) | Q(año=anio + 1, mes=1)
                resultados = (
                    Servicio_electrico.objects
                    .filter(condicion)
                    .values('entidad__nombre', 'entidad__codigo_REEUP')
                    .annotate(consumo_total=Sum('consumo_real'))
                    .order_by('-consumo_total')[:10]
                )
                top = []
                for item in resultados:
                    total_kwh = item['consumo_total'] or 0
                    if unidad == 'MWH':
                        total = total_kwh / 1000.0
                    elif unidad == 'GWH':
                        total = total_kwh / 1_000_000.0
                    else:
                        total = total_kwh
                    top.append({
                        'nombre': item['entidad__nombre'],
                        'codigo_reeup': item['entidad__codigo_REEUP'],
                        'consumo_total': total
                    })
                context['top_entidades'] = top

            elif consulta == 'sin_servicio':
                entidades = Entidad.objects.annotate(
                    num_servicios=Count('servicios_electricos')
                ).filter(num_servicios=0)
                context['listado'] = entidades.values('nombre', 'codigo_REEUP', 'municipio__nombre')

            elif consulta == 'sin_nombre':
                entidades = Entidad.objects.filter(Q(nombre__isnull=True) | Q(nombre=''))
                context['listado'] = entidades.values('nombre', 'codigo_REEUP', 'municipio__nombre')

            else:
                return Response({"error": "Tipo de consulta no soportado"}, status=400)

        except Exception as e:
            return Response({"error": f"Error al obtener datos: {str(e)}"}, status=500)

        html_string = render_to_string('reporte_pdf.html', context)

        try:
            pdf_file = HTML(string=html_string).write_pdf()
        except Exception as e:
            return Response({"error": f"Error al generar PDF: {str(e)}"}, status=500)

        response = HttpResponse(pdf_file, content_type='application/pdf')
        filename = f"reporte_{consulta}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
        response['Content-Disposition'] = f'inline; filename="{filename}"'
        return response