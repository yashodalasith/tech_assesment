from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.serializers import UserSerializer
from audit.models import ActivityLog
from crm.models import Company, Contact


class MeView(APIView):
	permission_classes = [IsAuthenticated]

	def get(self, request):
		serializer = UserSerializer(request.user)
		return Response(serializer.data)


class DashboardView(APIView):
	permission_classes = [IsAuthenticated]

	def get(self, request):
		org = request.user.organization
		data = {
			"organization": {
				"id": org.id,
				"name": org.name,
				"subscription_plan": org.subscription_plan,
			},
			"counts": {
				"companies": Company.objects.filter(
					organization=org, is_deleted=False
				).count(),
				"contacts": Contact.objects.filter(
					organization=org, is_deleted=False
				).count(),
				"activities": ActivityLog.objects.filter(organization=org).count(),
			},
		}
		return Response(data)
