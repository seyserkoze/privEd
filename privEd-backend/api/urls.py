from django.urls import path, include
from . import views
from rest_framework import routers
from django.conf.urls import url

router = routers.DefaultRouter()
router.register('URLAssociations', views.URLView)
router.register('Users', views.UserView)

urlpatterns = [
    path('', include(router.urls)),
    path('register', views.RegisterView.as_view(), name='register'),
    path('history', views.history, name='history'),
    path('track', views.VisitView.as_view(), name='visit')
]
