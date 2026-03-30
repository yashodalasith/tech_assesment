from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, viewsets
from rest_framework.permissions import IsAuthenticated

from audit.models import ActivityLog
from audit.serializers import ActivityLogSerializer


class ActivityLogViewSet(viewsets.ReadOnlyModelViewSet):
	serializer_class = ActivityLogSerializer
	permission_classes = [IsAuthenticated]
	filter_backends = [DjangoFilterBackend, filters.SearchFilter]
	filterset_fields = ["action", "model_name"]
	search_fields = ["actor__username", "model_name", "object_id"]

	def get_queryset(self):
		return ActivityLog.objects.filter(organization=self.request.user.organization)
