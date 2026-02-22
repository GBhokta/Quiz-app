from django.urls import path
from .views import StartTestView, SubmitTestView

urlpatterns = [
    path("start/", StartTestView.as_view()),
    path("submit/", SubmitTestView.as_view()),
]