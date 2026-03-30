from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from accounts.permissions import RoleBasedCRMPermission
from audit.models import ActivityLog
from audit.services import log_activity
from crm.models import Company, Contact
from crm.serializers import CompanySerializer, ContactSerializer


class TenantScopedModelViewSet(viewsets.ModelViewSet):
	permission_classes = [IsAuthenticated, RoleBasedCRMPermission]
	filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]

	def get_queryset(self):
		return (
			self.queryset.filter(organization=self.request.user.organization)
			.filter(is_deleted=False)
			.order_by("-created_at")
		)

	def perform_create(self, serializer):
		instance = serializer.save(organization=self.request.user.organization)
		log_activity(
			actor=self.request.user,
			action=ActivityLog.Actions.CREATE,
			model_name=instance.__class__.__name__,
			object_id=str(instance.pk),
			organization=self.request.user.organization,
		)

	def perform_update(self, serializer):
		instance = serializer.save()
		log_activity(
			actor=self.request.user,
			action=ActivityLog.Actions.UPDATE,
			model_name=instance.__class__.__name__,
			object_id=str(instance.pk),
			organization=self.request.user.organization,
		)

	def destroy(self, request, *args, **kwargs):
		instance = self.get_object()
		instance.is_deleted = True
		instance.save(update_fields=["is_deleted"])
		log_activity(
			actor=request.user,
			action=ActivityLog.Actions.DELETE,
			model_name=instance.__class__.__name__,
			object_id=str(instance.pk),
			organization=request.user.organization,
		)
		return Response(status=status.HTTP_204_NO_CONTENT)


class CompanyViewSet(TenantScopedModelViewSet):
	queryset = Company.objects.all()
	serializer_class = CompanySerializer
	filterset_fields = ["industry", "country"]
	search_fields = ["name", "industry", "country"]
	ordering_fields = ["created_at", "name"]


class ContactViewSet(TenantScopedModelViewSet):
	queryset = Contact.objects.select_related("company")
	serializer_class = ContactSerializer
	filterset_fields = ["company", "role"]
	search_fields = ["full_name", "email", "role", "phone"]
	ordering_fields = ["created_at", "full_name"]
