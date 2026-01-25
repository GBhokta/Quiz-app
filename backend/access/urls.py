from django.urls import path
from .views import ValidateTestAccessView

urlpatterns = [
    path("validate/", ValidateTestAccessView.as_view()),
]
