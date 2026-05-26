from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, BasePermission
from django.db.models import Q
from django.contrib.auth.models import User
from ..authentication import CookieTokenAuthentication
from ..serializers import UserSerializer


class IsSuperUser(BasePermission):
    """
    Permite el acceso solo a usuarios con is_superuser=True.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_superuser
    

class UserViewSet(viewsets.ModelViewSet):
    authentication_classes = [CookieTokenAuthentication]
    permission_classes = [IsAuthenticated, IsSuperUser]   
    serializer_class = UserSerializer
    queryset = User.objects.all().order_by('-date_joined')

    def get_queryset(self):
        queryset = super().get_queryset()
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(username__icontains=search) |
                Q(email__icontains=search) |
                Q(first_name__icontains=search) |
                Q(last_name__icontains=search)
            )
        return queryset


  