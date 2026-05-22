from django.conf import settings
from django.middleware.csrf import get_token
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from django.shortcuts import get_object_or_404
from ..serializers import UserSerializer
from ..authentication import CookieTokenAuthentication

@api_view(['POST'])
@authentication_classes([])          
@permission_classes([AllowAny])      
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response({"error": "Usuario y contraseña requeridos"}, status=400)
    
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response({"error": "Usuario no encontrado"}, status=404)
    
    if not user.check_password(password):
        return Response({"error": "Contraseña incorrecta"}, status=400)
    
    token, _ = Token.objects.get_or_create(user=user)
    serializer = UserSerializer(instance=user)
    
    response = Response({"user": serializer.data}, status=200)
    
    is_debug = settings.DEBUG
    response.set_cookie(
        key='auth_token',
        value=token.key,
        httponly=True,
        secure=not is_debug,
        samesite='None' if not is_debug else 'Lax',
        max_age=60 * 60 * 24 * 7,
        path='/',
    )
    get_token(request)  
    return response

@api_view(['POST'])
@authentication_classes([CookieTokenAuthentication])
@permission_classes([IsAuthenticated])
def logout(request):
    request.user.auth_token.delete()
    response = Response({"message": "Sesión cerrada"}, status=200)
    response.delete_cookie('auth_token')
    return response

@api_view(['GET'])
@authentication_classes([CookieTokenAuthentication])
@permission_classes([IsAuthenticated])
def perfil_usuario(request):
    user = request.user
    data = {
        'username': user.username,
        'email': user.email,
        'date_joined': user.date_joined.strftime('%Y-%m-%d'),
    }
    return Response(data, status=200)

@api_view(['POST'])
@authentication_classes([CookieTokenAuthentication])
@permission_classes([IsAuthenticated])
def cambiar_password(request):
    user = request.user
    current = request.data.get('current_password')
    new = request.data.get('new_password')
    if not current or not new:
        return Response({"error": "Faltan campos"}, status=400)
    if not user.check_password(current):
        return Response({"error": "Contraseña actual incorrecta"}, status=400)
    if len(new) < 6:
        return Response({"error": "Mínimo 6 caracteres"}, status=400)
    user.set_password(new)
    user.save()
    return Response({"message": "Contraseña cambiada"}, status=200)

@api_view(['GET'])
@authentication_classes([])          
@permission_classes([AllowAny])      
def set_csrf_cookie(request):
    get_token(request)
    return Response({"detail": "CSRF cookie establecida"}, status=200)