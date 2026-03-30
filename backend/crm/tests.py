from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from accounts.models import Organization, User
from audit.models import ActivityLog
from crm.models import Company, Contact


class CRMApiTests(APITestCase):
	def setUp(self):
		self.org_a = Organization.objects.create(name="Org A")
		self.org_b = Organization.objects.create(name="Org B")

		self.admin_a = User.objects.create_user(
			username="admin_a",
			password="pass1234",
			organization=self.org_a,
			role=User.Roles.ADMIN,
		)
		self.manager_a = User.objects.create_user(
			username="manager_a",
			password="pass1234",
			organization=self.org_a,
			role=User.Roles.MANAGER,
		)
		self.staff_a = User.objects.create_user(
			username="staff_a",
			password="pass1234",
			organization=self.org_a,
			role=User.Roles.STAFF,
		)
		self.admin_b = User.objects.create_user(
			username="admin_b",
			password="pass1234",
			organization=self.org_b,
			role=User.Roles.ADMIN,
		)

		self.company_a = Company.objects.create(
			organization=self.org_a,
			name="Alpha Co",
			industry="Travel",
			country="LK",
		)
		self.company_b = Company.objects.create(
			organization=self.org_b,
			name="Beta Co",
			industry="Finance",
			country="SG",
		)

		self.contact_a = Contact.objects.create(
			organization=self.org_a,
			company=self.company_a,
			full_name="Alice",
			email="alice@alpha.com",
			phone="94771234567",
			role="Owner",
		)

	def test_tenant_isolation_for_company_list(self):
		self.client.force_authenticate(self.admin_a)
		response = self.client.get(reverse("company-list"))

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		payload = response.json()["data"]
		self.assertEqual(len(payload), 1)
		self.assertEqual(payload[0]["name"], "Alpha Co")

	def test_staff_cannot_create_company(self):
		self.client.force_authenticate(self.staff_a)
		response = self.client.post(
			reverse("company-list"),
			{"name": "Staff Attempt", "industry": "X", "country": "LK"},
			format="json",
		)
		self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

	def test_manager_cannot_delete_company(self):
		self.client.force_authenticate(self.manager_a)
		response = self.client.delete(reverse("company-detail", args=[self.company_a.id]))
		self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

	def test_admin_soft_delete_creates_audit_log(self):
		self.client.force_authenticate(self.admin_a)
		response = self.client.delete(reverse("company-detail", args=[self.company_a.id]))

		self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
		self.company_a.refresh_from_db()
		self.assertTrue(self.company_a.is_deleted)
		self.assertTrue(
			ActivityLog.objects.filter(
				organization=self.org_a,
				actor=self.admin_a,
				action=ActivityLog.Actions.DELETE,
				model_name="Company",
				object_id=str(self.company_a.id),
			).exists()
		)

	def test_invalid_phone_rejected(self):
		self.client.force_authenticate(self.manager_a)
		response = self.client.post(
			reverse("contact-list"),
			{
				"company": self.company_a.id,
				"full_name": "Bad Phone",
				"email": "bad@alpha.com",
				"phone": "phone123",
				"role": "Lead",
			},
			format="json",
		)
		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

	def test_cross_tenant_company_forbidden(self):
		self.client.force_authenticate(self.manager_a)
		response = self.client.post(
			reverse("contact-list"),
			{
				"company": self.company_b.id,
				"full_name": "Leak Attempt",
				"email": "leak@beta.com",
				"phone": "94770001111",
				"role": "Lead",
			},
			format="json",
		)
		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

	def test_email_unique_per_company(self):
		self.client.force_authenticate(self.manager_a)
		response = self.client.post(
			reverse("contact-list"),
			{
				"company": self.company_a.id,
				"full_name": "Duplicate",
				"email": "alice@alpha.com",
				"phone": "94771112233",
				"role": "Ops",
			},
			format="json",
		)
		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
