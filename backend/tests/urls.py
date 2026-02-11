from django.urls import path
from .views import (
    AddTestQuestionsView,
    CreateTestView,
    MyTestsView,
    RemoveQuestionFromTestView,
    TestDetailView,
    ChangePasscodeView,
    LockTestView,
    UnlockTestView,
)

urlpatterns = [
    path("", CreateTestView.as_view()),                      # POST
    path("my/", MyTestsView.as_view()),                      # GET
    path("<int:test_id>/", TestDetailView.as_view()),        # GET / PUT / DELETE
    path("<int:test_id>/passcode/", ChangePasscodeView.as_view()),  # PUT
    path("<int:test_id>/lock/", LockTestView.as_view()),     # POST
    path("<int:test_id>/unlock/", UnlockTestView.as_view()), # POST
    path("<int:test_id>/questions/", AddTestQuestionsView.as_view()),
    path(
        "<int:test_id>/questions/<int:question_id>/",
        RemoveQuestionFromTestView.as_view(),
    ),

]

