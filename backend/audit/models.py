from django.db import models

from accounts.models import Organization, User


class ActivityLog(models.Model):
	class Actions(models.TextChoices):
		CREATE = "CREATE", "Create"
		UPDATE = "UPDATE", "Update"
		DELETE = "DELETE", "Delete"

	actor = models.ForeignKey(
		User,
		on_delete=models.PROTECT,
		related_name="activity_logs",
	)
	organization = models.ForeignKey(
		Organization,
		on_delete=models.PROTECT,
		related_name="activity_logs",
	)
	action = models.CharField(max_length=16, choices=Actions.choices)
	model_name = models.CharField(max_length=64)
	object_id = models.CharField(max_length=64)
	timestamp = models.DateTimeField(auto_now_add=True)

	class Meta:
		ordering = ["-timestamp"]

	def __str__(self):
		return f"{self.action} {self.model_name}({self.object_id})"
