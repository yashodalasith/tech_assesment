import re

from rest_framework import serializers

from crm.models import Company, Contact


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = [
            "id",
            "name",
            "industry",
            "country",
            "logo",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = [
            "id",
            "company",
            "full_name",
            "email",
            "phone",
            "role",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]

    def validate_phone(self, value):
        if value and not re.fullmatch(r"\d{8,15}", value):
            raise serializers.ValidationError(
                "Phone must contain 8 to 15 numeric digits."
            )
        return value

    def validate(self, attrs):
        request = self.context["request"]
        company = attrs.get("company") or self.instance.company
        email = attrs.get("email") or self.instance.email

        if company.organization_id != request.user.organization_id:
            raise serializers.ValidationError(
                {"company": "Selected company does not belong to your organization."}
            )

        duplicate_qs = Contact.objects.filter(
            company=company,
            email=email,
            is_deleted=False,
        )
        if self.instance:
            duplicate_qs = duplicate_qs.exclude(pk=self.instance.pk)
        if duplicate_qs.exists():
            raise serializers.ValidationError(
                {"email": "Email must be unique within the same company."}
            )

        return attrs
