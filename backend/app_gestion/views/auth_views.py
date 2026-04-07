from rest_framework.decorators import api_view
from rest_framework.response import Response
from ..serializers import UserSerializer
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework import status
from django.shortcuts import get_object_or_404

from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication



@api_view(['POST'])
def login(request):

    user = get_object_or_404(User, username=request.data['username'])

    if not user.check_password(request.data['password']):
        return Response({"Error": "Contraseña no válida"}, status=status.HTTP_400_BAD_REQUEST)
    
    token, created = Token.objects.get_or_create(user=user)
    serializer = UserSerializer(instance=user)

    return Response({"Token": token.key, "Usuario": serializer.data}, status=status.HTTP_200_OK)

@api_view(['POST'])
def register(request):
    serializer = UserSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()

        user = User.objects.get(username=serializer.data['username'])
        user.set_password(serializer.data['password'])
        user.save()

        token = Token.objects.create(user=user)

        return Response({'token': token.key, 'user':serializer.data}, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def logout(request):
    # Eliminar el token del usuario
    request.user.auth_token.delete()
    return Response({"message": "Sesión cerrada correctamente"}, status=status.HTTP_200_OK)


@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def perfil_usuario(request):
    user = request.user

    data = {
        'username': user.username,
        'email': user.email,
        'date_joined': user.date_joined.strftime('%Y-%m-%d'),
    }
    return Response(data, status=status.HTTP_200_OK)



@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def cambiar_password(request):
    user = request.user
    current_password = request.data.get('current_password')
    new_password = request.data.get('new_password')

    if not current_password or not new_password:
        return Response({"error": "Faltan campos"}, status=status.HTTP_400_BAD_REQUEST)

    if not user.check_password(current_password):
        return Response({"error": "Contraseña actual incorrecta"}, status=status.HTTP_400_BAD_REQUEST)

    if len(new_password) < 6:
        return Response({"error": "La nueva contraseña debe tener al menos 6 caracteres"}, status=status.HTTP_400_BAD_REQUEST)

    user.set_password(new_password)
    user.save()

    return Response({"message": "Contraseña cambiada correctamente"}, status=status.HTTP_200_OK)



@api_view(['GET'])
@authentication_classes([])  
@permission_classes([])     
def health_check(request):
    """
    OK
    """
    return Response({"status": "ok"}, status=200)



@api_view(['GET'])
@authentication_classes([])
@permission_classes([])
def keep_alive(request):
    """
    Endpoint para mantener la base de datos activa.
    Ejecuta un SELECT mínimo a la base de datos.
    """
    from django.db import connection
    with connection.cursor() as cursor:
        cursor.execute("SELECT 1;")
        cursor.fetchone()
    return Response({"status": "ok", "db": "alive"}, status=200)