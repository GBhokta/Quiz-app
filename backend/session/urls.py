from django.urls import path
from .views import StartTestView, SubmitTestView, ResultDetailView

urlpatterns = [
    path("start/", StartTestView.as_view()),
    path("submit/", SubmitTestView.as_view()),
    path("result/<int:result_id>/", ResultDetailView.as_view()),
]