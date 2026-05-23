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
        """
        Importa servicios eléctricos desde un archivo Excel (.xlsx, .xls) o CSV.
        Espera un archivo en el campo 'archivo' del formulario.
        """
        archivo: UploadedFile = request.FILES.get('archivo')
        if not archivo:
            return Response({'error': 'No se proporcionó ningún archivo'}, status=400)

        # Detectar tipo y leer contenido
        contenido = archivo.read()
        try:
            if archivo.name.endswith('.csv'):
                import csv
                data = csv.reader(io.StringIO(contenido.decode('utf-8')))
                filas = list(data)
            else:
                wb = openpyxl.load_workbook(io.BytesIO(contenido), data_only=True)
                ws = wb.active
                filas = [list(row) for row in ws.iter_rows(values_only=True)]
        except Exception as e:
            return Response({'error': f'Error leyendo archivo: {str(e)}'}, status=400)

        # Detectar primera fila de datos (con fecha '02/')
        start_idx = None
        for i, row in enumerate(filas):
            if len(row) > 0 and row[0] and isinstance(row[0], str) and row[0].strip().startswith('02/'):
                start_idx = i
                break

        if start_idx is None:
            return Response({'error': 'No se encontró ninguna fila con fecha (formato "02/...")'}, status=400)

        # Encontrar encabezados (columna anterior)
        header_indices = {}
        if start_idx > 0:
            possible_header = filas[start_idx-1]
            header_str = ' '.join(str(cell).upper() for cell in possible_header if cell)
            if any(keyword in header_str for keyword in ['CODCLI', 'JCP', 'KWHT']):
                header_indices = self._find_column_indices(possible_header)

        if not header_indices:
            # Índices fijos por defecto
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

        # Obtener todas las entidades para mapeo REEUP -> id
        entidad_map = {e.codigo_REEUP: e.id for e in Entidad.objects.all()}

        objetos = []  # Lista para bulk_create
        reeup_faltantes = set()

        for row in filas[start_idx:]:
            if len(row) <= max(idx_codcli, idx_nta, idx_dc, idx_turnos, idx_jcp, idx_kwht):
                continue

            # Fecha
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

            # Código servicio
            codcli = str(row[idx_codcli]).strip()
            if not codcli:
                continue
            try:
                codigo_servicio = int(float(codcli))
            except ValueError:
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

            # Régimen
            turnos_str = str(row[idx_turnos]).strip()
            try:
                regimen = int(float(turnos_str))
            except ValueError:
                continue

            # REEUP
            jcp = str(row[idx_jcp]).strip()
            reeup = self._format_reeup(jcp)
            if not reeup:
                continue

            # Consumo real
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

            # Crear objeto del modelo (sin guardar aún)
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

        # Inserción masiva con manejo de conflictos (unique_together o UniqueConstraint)
        created_count = 0
        try:
            with transaction.atomic():
                # ignore_conflicts=True omite filas que violarían la restricción única
                # (asumiendo que el modelo tiene unique_together = ('codigo_servicio', 'mes', 'año'))
                created_objs = Servicio_electrico.objects.bulk_create(
                    objetos,
                    ignore_conflicts=True,
                    batch_size=500  # Ajusta según el tamaño de tu archivo
                )
                created_count = len(created_objs)
        except Exception as e:
            return Response({'error': f'Error durante la inserción: {str(e)}'}, status=500)

        resultado = {
            'insertados': created_count,
            'duplicados': len(objetos) - created_count,
            'total_procesados': len(objetos),
            'reeup_faltantes': list(reeup_faltantes) if reeup_faltantes else []
        }
        return Response(resultado, status=200)



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