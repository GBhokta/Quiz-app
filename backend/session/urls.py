from django.urls import path
from .views import StartTestSessionView, SubmitTestView

urlpatterns = [
    path("start/", StartTestSessionView.as_view()),
    path("submit/", SubmitTestView.as_view()),
]
