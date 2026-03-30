from audit.models import ActivityLog


def log_activity(*, actor, action, model_name, object_id, organization):
    ActivityLog.objects.create(
        actor=actor,
        action=action,
        model_name=model_name,
        object_id=object_id,
        organization=organization,
    )
