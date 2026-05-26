import subprocess
import tempfile
import os
import logging
from django.conf import settings
from django.http import HttpResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

logger = logging.getLogger(__name__)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def realizar_backup(request):
    # Solo superusuarios
    if not request.user.is_superuser:
        return Response({"error": "No tienes permisos para realizar esta acción"}, status=403)

    db_settings = settings.DATABASES['default']
    db_name = str(db_settings['NAME'])
    db_user = str(db_settings['USER'])
    db_password = str(db_settings.get('PASSWORD', ''))
    db_host = str(db_settings.get('HOST', 'localhost'))
    db_port = str(db_settings.get('PORT', '5432'))   # convertir a string

    # Verificar si pg_dump existe
    try:
        subprocess.run(['pg_dump', '--version'], capture_output=True, check=True)
    except (subprocess.CalledProcessError, FileNotFoundError):
        return Response({"error": "pg_dump no está instalado o no es accesible"}, status=500)

    env = {'PGPASSWORD': db_password, **os.environ}

    cmd = [
        'pg_dump',
        '--data-only',
        '--no-owner',
        '--no-privileges',
        '-U', db_user,
        '-h', db_host,
        '-p', db_port,
        db_name
    ]

    try:
        with tempfile.NamedTemporaryFile(suffix='.sql', delete=False) as tmp_file:
            result = subprocess.run(cmd, stdout=tmp_file, stderr=subprocess.PIPE, env=env, text=True)
            tmp_file_path = tmp_file.name

        if result.returncode != 0:
            os.unlink(tmp_file_path)
            logger.error(f"pg_dump stderr: {result.stderr}")
            return Response({"error": f"Error en pg_dump: {result.stderr}"}, status=500)

        with open(tmp_file_path, 'r') as f:
            backup_content = f.read()
        os.unlink(tmp_file_path)

        response = HttpResponse(backup_content, content_type='application/sql')
        response['Content-Disposition'] = 'attachment; filename="backup_datos.sql"'
        return response

    except Exception as e:
        logger.exception("Error inesperado en backup")
        return Response({"error": f"Error interno: {str(e)}"}, status=500)