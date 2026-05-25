import io
import re
import openpyxl

from rest_framework import viewsets
from ..authentication import CookieTokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from ..models import Servicio_electrico
from ..serializers import ServicioElectricoSerializer

from rest_framework.parsers import MultiPartParser
from django.db import transaction
from django.core.files.uploadedfile import UploadedFile
from ..models import Servicio_electrico, Entidad

from weasyprint import HTML
from datetime import datetime
from django.template.loader import render_to_string
from django.http import HttpResponse


class ServicioElectricoViewSet(viewsets.ModelViewSet):
    authentication_classes = [CookieTokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = ServicioElectricoSerializer

    def get_queryset(self):
        queryset = Servicio_electrico.objects.select_related('entidad').all()

        # Búsqueda general (texto)
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(codigo_servicio__icontains=search) |
                Q(tarifa_contratada__icontains=search) |
                Q(entidad__nombre__icontains=search) |
                Q(entidad__codigo_REEUP__icontains=search)
            )

        # Filtros específicos
        codigo_servicio = self.request.query_params.get('codigo_servicio')
        if codigo_servicio:
            queryset = queryset.filter(codigo_servicio=codigo_servicio)

        mes = self.request.query_params.get('mes')
        if mes:
            queryset = queryset.filter(mes=mes)

        año = self.request.query_params.get('año')
        if año:
            queryset = queryset.filter(año=año)

        codigo_REEUP = self.request.query_params.get('codigo_REEUP')
        if codigo_REEUP:
            queryset = queryset.filter(entidad__codigo_REEUP__icontains=codigo_REEUP)

        return queryset.order_by('mes', 'año')

    @action(detail=False, methods=['get'], url_path='anios-disponibles')
    def anios_disponibles(self, request):
        """
        Devuelve los años únicos presentes en los servicios eléctricos.
        """
        años = (
            Servicio_electrico.objects
            .values_list('año', flat=True)
            .distinct()
            .order_by('-año')
        )
        return Response(list(años))

    
    @action(detail=False, methods=['post'], url_path='importar', parser_classes=[MultiPartParser])
    def importar_excel(self, request):
        archivo: UploadedFile = request.FILES.get('archivo')
        if not archivo:
            return Response({'error': 'No se proporcionó ningún archivo'}, status=400)

        nombre_archivo = archivo.name.lower()
        es_menor = 'menor' in nombre_archivo

        contenido = archivo.read()
        # Limpiar posibles BOM al inicio
        if contenido.startswith(b'\xef\xbb\xbf'):
            contenido = contenido[3:]

        try:
            if archivo.name.endswith('.csv'):
                import csv
                data = csv.reader(io.StringIO(contenido.decode('utf-8-sig')))
                filas = list(data)
            else:
                wb = openpyxl.load_workbook(io.BytesIO(contenido), data_only=True)
                ws = wb.active
                filas = [list(row) for row in ws.iter_rows(values_only=True)]
        except Exception as e:
            return Response({'error': f'Error leyendo archivo: {str(e)}'}, status=400)

        # ==================== ARCHIVOS MENOR ====================
        if es_menor:
            match = re.search(r'\b(19|20)\d{2}\b', archivo.name)
            if not match:
                return Response({'error': 'No se pudo extraer el año del nombre del archivo'}, status=400)
            año_import = int(match.group())

            if len(filas) == 0:
                return Response({'error': 'El archivo está vacío'}, status=400)

            # Para archivos MENOR, los encabezados están en la fila 3 (índice 2)
            header_row_idx = 2  # Fila 3 (0-based)
            if len(filas) <= header_row_idx:
                return Response({'error': 'El archivo no tiene suficientes filas para los encabezados'}, status=400)

            # Verificar que las columnas existan en la fila de encabezados (opcional, para depuración)
            # Las columnas se usarán con índices fijos, no necesitamos parsear nombres
            # Pero podemos comprobar que la fila no esté vacía
            if not any(filas[header_row_idx]):
                return Response({'error': 'La fila de encabezados está vacía'}, status=400)

            # Índices fijos de las columnas según las coordenadas proporcionadas
            # MES = columna A (0)
            # CODCLI = columna C (2)
            # JCP = columna H (7)
            # NTA = columna I (8)
            # DC = columna L (11)
            # KWHT = columna N (13)
            idx_mes = 0
            idx_codcli = 2
            idx_jcp = 7
            idx_nta = 8
            idx_dc = 11
            idx_kwht = 13

            entidad_map = {e.codigo_REEUP: e.id for e in Entidad.objects.all()}
            objetos = []
            reeup_faltantes = set()

            # Los datos comienzan después de la fila de encabezados
            for row in filas[header_row_idx + 1:]:
                # Saltar filas con menos columnas de las necesarias
                if len(row) <= max(idx_mes, idx_codcli, idx_jcp, idx_nta, idx_dc, idx_kwht):
                    continue

                # Mes
                mes_val = str(row[idx_mes]).strip()
                if not mes_val:
                    continue
                try:
                    mes = int(mes_val)
                    if not 1 <= mes <= 12:
                        continue
                except ValueError:
                    continue

                # Código servicio
                try:
                    codigo_servicio = int(float(str(row[idx_codcli]).strip()))
                except (ValueError, TypeError):
                    continue

                # Tarifa
                tarifa = str(row[idx_nta]).strip()
                if not tarifa:
                    continue

                # Demanda
                dc_str = str(row[idx_dc]).strip().replace(',', '.')
                try:
                    demanda = float(dc_str)
                except ValueError:
                    continue

                # REEUP
                jcp = str(row[idx_jcp]).strip()
                reeup = self._format_reeup(jcp)
                if not reeup:
                    continue

                # Consumo
                kwht_str = str(row[idx_kwht]).strip().replace(',', '.')
                try:
                    consumo_real = float(kwht_str)
                except ValueError:
                    continue

                entidad_id = entidad_map.get(reeup)
                if entidad_id is None:
                    reeup_faltantes.add(reeup)
                    continue

                # Se omite regimen_trabajo (será NULL)
                objetos.append(
                    Servicio_electrico(
                        entidad_id=entidad_id,
                        codigo_servicio=codigo_servicio,
                        tarifa_contratada=tarifa,
                        demanda_contratada=demanda,
                        consumo_real=consumo_real,
                        mes=mes,
                        año=año_import
                    )
                )

            if not objetos:
                return Response({
                    'error': 'No hay datos válidos para importar',
                    'reeup_faltantes': list(reeup_faltantes)
                }, status=400)

            with transaction.atomic():
                created_objs = Servicio_electrico.objects.bulk_create(objetos, ignore_conflicts=True, batch_size=500)
                created_count = len(created_objs)

            return Response({
                'insertados': created_count,
                'duplicados': len(objetos) - created_count,
                'total_procesados': len(objetos),
                'reeup_faltantes': list(reeup_faltantes),
                'año_importado': año_import,
                'tipo': 'MENOR'
            }, status=200)

        # ==================== ARCHIVOS NORMALES (con fecha) ====================
        else:
            # Detectar primera fila con fecha '02/...'
            start_idx = None
            for i, row in enumerate(filas):
                if len(row) > 0 and row[0] and isinstance(row[0], str) and row[0].strip().startswith('02/'):
                    start_idx = i
                    break

            if start_idx is None:
                return Response({'error': 'No se encontró ninguna fila con fecha (formato "02/...")'}, status=400)

            header_indices = {}
            if start_idx > 0:
                possible_header = filas[start_idx-1]
                header_str = ' '.join(str(cell).upper() for cell in possible_header if cell)
                if any(keyword in header_str for keyword in ['CODCLI', 'JCP', 'KWHT']):
                    header_indices = self._find_column_indices(possible_header)

            if not header_indices:
                idx_codcli, idx_nta, idx_dc, idx_turnos, idx_jcp, idx_kwht = 4, 10, 15, 36, 9, 38
            else:
                idx_codcli = header_indices.get('codcli')
                idx_nta = header_indices.get('nta')
                idx_dc = header_indices.get('dc')
                idx_turnos = header_indices.get('turnos')
                idx_jcp = header_indices.get('jcp')
                idx_kwht = header_indices.get('kwht')
                if None in (idx_codcli, idx_nta, idx_dc, idx_turnos, idx_jcp, idx_kwht):
                    return Response({'error': 'Estructura de columnas desconocida'}, status=400)

            entidad_map = {e.codigo_REEUP: e.id for e in Entidad.objects.all()}
            objetos = []
            reeup_faltantes = set()

            for row in filas[start_idx:]:
                if len(row) <= max(idx_codcli, idx_nta, idx_dc, idx_turnos, idx_jcp, idx_kwht):
                    continue

                date_str = str(row[0]).strip()
                if '/' not in date_str:
                    continue
                parts = date_str.split('/')
                if len(parts) < 3:
                    continue
                try:
                    mes = int(parts[1])
                    año = int(parts[2])
                except ValueError:
                    continue

                codcli = str(row[idx_codcli]).strip()
                if not codcli:
                    continue
                try:
                    codigo_servicio = int(float(codcli))
                except ValueError:
                    continue

                tarifa = str(row[idx_nta]).strip()
                if not tarifa:
                    continue

                dc_str = str(row[idx_dc]).strip().replace(',', '.')
                try:
                    demanda = float(dc_str)
                except ValueError:
                    continue

                turnos_str = str(row[idx_turnos]).strip()
                try:
                    regimen = int(float(turnos_str))
                except ValueError:
                    continue

                jcp = str(row[idx_jcp]).strip()
                reeup = self._format_reeup(jcp)
                if not reeup:
                    continue

                kwht_str = str(row[idx_kwht]).strip().replace(',', '.')
                if not kwht_str:
                    continue
                try:
                    consumo_real = float(kwht_str)
                except ValueError:
                    continue

                entidad_id = entidad_map.get(reeup)
                if entidad_id is None:
                    reeup_faltantes.add(reeup)
                    continue

                objetos.append(
                    Servicio_electrico(
                        entidad_id=entidad_id,
                        codigo_servicio=codigo_servicio,
                        tarifa_contratada=tarifa,
                        demanda_contratada=demanda,
                        regimen_trabajo=regimen,
                        consumo_real=consumo_real,
                        mes=mes,
                        año=año
                    )
                )

            if not objetos:
                return Response({
                    'error': 'No hay datos válidos para importar',
                    'reeup_faltantes': list(reeup_faltantes)
                }, status=400)

            with transaction.atomic():
                created_objs = Servicio_electrico.objects.bulk_create(objetos, ignore_conflicts=True, batch_size=500)
                created_count = len(created_objs)

            return Response({
                'insertados': created_count,
                'duplicados': len(objetos) - created_count,
                'total_procesados': len(objetos),
                'reeup_faltantes': list(reeup_faltantes)
            }, status=200)


    @action(detail=False, methods=['post'], url_path='exportar-reeup-pdf')
    def exportar_reeup_pdf(self, request):
        """
        Recibe una lista de códigos REEUP faltantes y genera un PDF.
        Espera JSON: {"reeup_faltantes": ["131003768", ...]}
        """
        reeup_faltantes = request.data.get('reeup_faltantes', [])
        if not reeup_faltantes:
            return Response({"error": "No hay REEUP faltantes para exportar"}, status=400)

        contexto = {
            'reeup_faltantes': reeup_faltantes,
            'total': len(reeup_faltantes),
            'fecha_generacion': datetime.now().strftime('%d/%m/%Y %H:%M:%S'),
        }
        html_string = render_to_string('reeup_faltantes_pdf.html', contexto)
        pdf_file = HTML(string=html_string).write_pdf()
        response = HttpResponse(pdf_file, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="reeup_faltantes_{datetime.now().strftime("%Y%m%d_%H%M%S")}.pdf"'
        return response



    # ---------- MÉTODOS AUXILIARES ----------
    def _format_reeup(self, jcp):
        jcp = jcp.strip()
        if re.fullmatch(r'\d{9}', jcp):
            return f"{jcp[:3]}.{jcp[3]}.{jcp[4:]}"
        return jcp

    def _find_column_indices(self, header_row):
        indices = {}
        for idx, col in enumerate(header_row):
            if col is None:
                continue
            col_clean = str(col).strip().upper()
            if col_clean == 'CODCLI':
                indices['codcli'] = idx
            elif col_clean == 'NTA':
                indices['nta'] = idx
            elif col_clean == 'DC':
                indices['dc'] = idx
            elif col_clean == 'TURNOS':
                indices['turnos'] = idx
            elif col_clean == 'JCP':
                indices['jcp'] = idx
            elif col_clean == 'KWHT':
                indices['kwht'] = idx
        return indices

    
    @action(detail=False, methods=['post'], url_path='eliminar-todos')
    def eliminar_todos(self, request):
        """
        Elimina TODOS los registros de servicios eléctricos.
        """

        count = Servicio_electrico.objects.count()
        if count == 0:
            return Response({'message': 'No hay registros para eliminar', 'deleted': 0}, status=200)

        # Eliminar todos los registros
        deleted_count, _ = Servicio_electrico.objects.all().delete()

        return Response({
            'message': f'Se eliminaron {deleted_count} registros correctamente',
            'deleted': deleted_count
        }, status=200)