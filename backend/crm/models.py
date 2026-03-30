from django.db import models
from django.db.models import Q

from accounts.models import Organization


class TenantSoftDeleteModel(models.Model):
	organization = models.ForeignKey(
		Organization,
		on_delete=models.PROTECT,
		related_name="%(class)ss",
	)
	created_at = models.DateTimeField(auto_now_add=True)
	is_deleted = models.BooleanField(default=False)

	class Meta:
		abstract = True


class Company(TenantSoftDeleteModel):
	name = models.CharField(max_length=255)
	industry = models.CharField(max_length=128, blank=True)
	country = models.CharField(max_length=128, blank=True)
	logo = models.ImageField(upload_to="company-logos/", null=True, blank=True)

	class Meta:
		ordering = ["-created_at"]
		constraints = [
			models.UniqueConstraint(
				fields=["organization", "name"],
				condition=Q(is_deleted=False),
				name="uniq_company_name_per_org_active",
			)
		]

	def __str__(self):
		return self.name


class Contact(TenantSoftDeleteModel):
	company = models.ForeignKey(
		Company,
		on_delete=models.PROTECT,
		related_name="contacts",
	)
	full_name = models.CharField(max_length=255)
	email = models.EmailField(max_length=255)
	phone = models.CharField(max_length=15, null=True, blank=True)
	role = models.CharField(max_length=128, blank=True)

	class Meta:
		ordering = ["-created_at"]
		constraints = [
			models.UniqueConstraint(
				fields=["company", "email"],
				condition=Q(is_deleted=False),
				name="uniq_contact_email_per_company_active",
			)
		]

	def __str__(self):
		return f"{self.full_name} - {self.company.name}"
