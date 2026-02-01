from django.urls import path
from .views import StartTestView

urlpatterns = [
    path("start/", StartTestView.as_view()),
]
