from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from accounts.models import Organization, User


class AuthAndProfileTests(APITestCase):
	def setUp(self):
		self.org = Organization.objects.create(name="Auth Org")
		self.user = User.objects.create_user(
			username="auth_user",
			password="pass1234",
			organization=self.org,
			role=User.Roles.ADMIN,
		)

	def test_token_obtain_pair(self):
		response = self.client.post(
			reverse("token_obtain_pair"),
			{"username": "auth_user", "password": "pass1234"},
			format="json",
		)
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		payload = response.json()["data"]
		self.assertIn("access", payload)
		self.assertIn("refresh", payload)

	def test_me_endpoint_requires_authentication(self):
		response = self.client.get(reverse("me"))
		self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

	def test_me_endpoint_returns_authenticated_user(self):
		self.client.force_authenticate(self.user)
		response = self.client.get(reverse("me"))

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(response.json()["data"]["username"], "auth_user")
		self.assertEqual(response.json()["data"]["organization"]["name"], "Auth Org")
