from django.contrib import admin

from crm.models import Company, Contact


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
	list_display = ("id", "name", "organization", "industry", "country", "is_deleted")
	list_filter = ("industry", "country", "is_deleted")
	search_fields = ("name",)


@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
	list_display = ("id", "full_name", "company", "organization", "email", "is_deleted")
	list_filter = ("role", "is_deleted")
	search_fields = ("full_name", "email")
