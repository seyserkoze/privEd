from django.urls import path, include
from . import views
from rest_framework import routers
from django.conf.urls import url

router = routers.DefaultRouter()
router.register('URLAssociations', views.URLView)

urlpatterns = [
    path('', include(router.urls)),
]
