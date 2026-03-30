from rest_framework import serializers

from audit.models import ActivityLog


class ActivityLogSerializer(serializers.ModelSerializer):
    actor_username = serializers.CharField(source="actor.username", read_only=True)

    class Meta:
        model = ActivityLog
        fields = [
            "id",
            "action",
            "model_name",
            "object_id",
            "actor_username",
            "timestamp",
        ]
