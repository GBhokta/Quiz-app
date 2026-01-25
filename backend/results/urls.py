from django.urls import path
from .views import MyResultsView, TestResultsView

urlpatterns = [
    path("my/", MyResultsView.as_view()),
    path("test/<int:test_id>/", TestResultsView.as_view()),
]
