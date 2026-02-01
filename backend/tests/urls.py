from django.urls import path
from .views import (
    CreateTestView,
    MyTestsView,
    TestDetailView,
    ChangePasscodeView,
    LockTestView,
    UnlockTestView,
)

urlpatterns = [
    path("", CreateTestView.as_view()),
    path("my/", MyTestsView.as_view()),
    path("<int:test_id>/", TestDetailView.as_view()),
    path("<int:test_id>/passcode/", ChangePasscodeView.as_view()),
    path("<int:test_id>/lock/", LockTestView.as_view()),
    path("<int:test_id>/unlock/", UnlockTestView.as_view()),
    path("<int:test_id>/questions/", TestDetailView.as_view()),
    path("<int:test_id>/edit/", MyTestsView.as_view()),
]
