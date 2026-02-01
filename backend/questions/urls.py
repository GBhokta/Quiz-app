from django.urls import path
from .views import (
    QuestionCreateView,
    QuestionListView,
    QuestionDetailView,
    TopicListCreateView,
)

urlpatterns = [
    # Questions
    path("", QuestionListView.as_view()),               # GET
    path("create/", QuestionCreateView.as_view()),      # POST
    path("<int:pk>/", QuestionDetailView.as_view()),    # GET / PUT / DELETE

    # Topics
    path("topics/", TopicListCreateView.as_view()),     # GET / POST
]
