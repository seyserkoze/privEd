from django.urls import path, include
from . import views
from rest_framework import routers
from django.conf.urls import url
from django.conf.urls.static import static
from privEd import settings
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

router = routers.DefaultRouter()
router.register('URLAssociations', views.URLView)
router.register('Users', views.UserView)

urlpatterns = [
    path('', include(router.urls)),
    path('register', views.RegisterView.as_view(), name='register'),
    path('history/<slug:slug>', views.history, name='history'),
    path('track', views.VisitView.as_view(), name='visit')
]



urlpatterns += staticfiles_urlpatterns()