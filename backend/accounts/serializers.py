from rest_framework import serializers

from accounts.models import Organization, User


class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = ["id", "name", "subscription_plan", "created_at"]


class UserSerializer(serializers.ModelSerializer):
    organization = OrganizationSerializer(read_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "email", "role", "organization"]
