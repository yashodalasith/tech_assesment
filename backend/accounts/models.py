from django.contrib.auth.models import AbstractUser
from django.db import models


class Organization(models.Model):
	class Plans(models.TextChoices):
		BASIC = "BASIC", "Basic"
		PRO = "PRO", "Pro"

	name = models.CharField(max_length=255, unique=True)
	subscription_plan = models.CharField(
		max_length=16,
		choices=Plans.choices,
		default=Plans.BASIC,
	)
	created_at = models.DateTimeField(auto_now_add=True)

	class Meta:
		ordering = ["-created_at"]

	def __str__(self):
		return f"{self.name} ({self.subscription_plan})"


class User(AbstractUser):
	class Roles(models.TextChoices):
		ADMIN = "ADMIN", "Admin"
		MANAGER = "MANAGER", "Manager"
		STAFF = "STAFF", "Staff"

	organization = models.ForeignKey(
		Organization,
		on_delete=models.PROTECT,
		related_name="users",
		null=True,
		blank=True,
	)
	role = models.CharField(max_length=16, choices=Roles.choices, default=Roles.STAFF)

	def __str__(self):
		return f"{self.username} [{self.role}]"
