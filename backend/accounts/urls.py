from django.urls import path

from accounts.views import DashboardView, MeView

urlpatterns = [
    path("me/", MeView.as_view(), name="me"),
    path("dashboard/", DashboardView.as_view(), name="dashboard"),
]
