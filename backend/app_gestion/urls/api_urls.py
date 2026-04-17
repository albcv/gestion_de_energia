from django.urls import path, include
from rest_framework.routers import DefaultRouter
from ..views import (
    OrganismoViewSet, EntidadViewSet, DirectorViewSet,
    SectorEconomicoViewSet, EstablecimientoViewSet, MunicipioViewSet,
    ProvinciaViewSet, ServicioElectricoViewSet, 
    EntidadEmpresarialViewSet, EntidadPresupuestadaViewSet,
    NAEViewSet
   
)

router = DefaultRouter()
router.register(r'organismo', OrganismoViewSet, basename='organismo')
router.register(r'entidades', EntidadViewSet, basename='entidades')
router.register(r'entidades_emp', EntidadEmpresarialViewSet, basename='entidades_emp')
router.register(r'entidades_pre', EntidadPresupuestadaViewSet, basename='entidades_pre')
router.register(r'directores', DirectorViewSet, basename='directores')
router.register(r'sectores-economicos', SectorEconomicoViewSet, basename='sectores-economicos')
router.register(r'establecimientos', EstablecimientoViewSet, basename='establecimientos')
router.register(r'municipios', MunicipioViewSet, basename='municipios')
router.register(r'provincias', ProvinciaViewSet, basename='provincias')
router.register(r'servicios-electricos', ServicioElectricoViewSet, basename='servicios-electricos')
router.register(r'nae', NAEViewSet, basename='nae')



urlpatterns = [
    path('', include(router.urls)),
]