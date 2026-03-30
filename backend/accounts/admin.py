from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from accounts.models import Organization, User


@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
	list_display = ("id", "name", "subscription_plan", "created_at")
	search_fields = ("name",)


@admin.register(User)
class CustomUserAdmin(UserAdmin):
	fieldsets = UserAdmin.fieldsets + (
		("Tenant Access", {"fields": ("organization", "role")}),
	)
	list_display = ("id", "username", "email", "organization", "role", "is_staff")
