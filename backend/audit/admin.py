from django.contrib import admin

from audit.models import ActivityLog


@admin.register(ActivityLog)
class ActivityLogAdmin(admin.ModelAdmin):
	list_display = ("id", "action", "model_name", "object_id", "actor", "timestamp")
	list_filter = ("action", "model_name")
	search_fields = ("model_name", "object_id", "actor__username")
