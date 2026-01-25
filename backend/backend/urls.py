from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', include('auth_app.urls')),
    path("tests/", include("tests.urls")),
    path("access/", include("access.urls")),
    path("session/", include("session.urls")),
    path("results/", include("results.urls")),


]
