from rest_framework.routers import DefaultRouter

from audit.views import ActivityLogViewSet

router = DefaultRouter()
router.register("activities", ActivityLogViewSet, basename="activity")

urlpatterns = router.urls
