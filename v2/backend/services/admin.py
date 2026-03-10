from django.contrib import admin
from django.forms import BaseInlineFormSet
from django.core.exceptions import ValidationError
from .models import ServicePage, ServicePageImage


class ServicePageImageFormSet(BaseInlineFormSet):
    def clean(self):
        super().clean()
        kept = 0
        for f in self.forms:
            if f.cleaned_data is None or f.cleaned_data.get("DELETE"):
                continue
            if f.cleaned_data.get("image") or f.cleaned_data.get("id"):
                kept += 1
        if kept < 1:
            raise ValidationError("Har bir xizmatda kamida 1 ta rasm bo'lishi kerak.")
        if kept > 10:
            raise ValidationError("Har bir xizmatda eng ko'pi 10 ta rasm bo'lishi mumkin.")


class ServicePageImageInline(admin.TabularInline):
    model = ServicePageImage
    formset = ServicePageImageFormSet
    extra = 0
    min_num = 1
    max_num = 10
    validate_max = True
    ordering = ["order"]
    fields = ("image", "order")


@admin.register(ServicePage)
class ServicePageAdmin(admin.ModelAdmin):
    list_display = ("title", "slug", "image_preview", "order", "is_active")
    list_editable = ("order", "is_active")
    list_filter = ("is_active",)
    search_fields = ("title", "slug", "content")
    ordering = ("order", "id")
    inlines = [ServicePageImageInline]

    fieldsets = (
        (None, {"fields": ("title", "content", "is_active", "order")}),
        ("Rasm", {"fields": ("image", "icon"), "description": "Kartochka rasmi — bosh sahifa va ro'yxatda. Bo'sh qoldirilsa galereyadagi birinchi rasm ishlatiladi."}),
    )

    def image_preview(self, obj):
        if not obj:
            return "—"
        img = obj.image
        if not img:
            first = obj.gallery_images.first() if obj.pk else None
            img = first.image if first else None
        if img:
            from django.utils.html import format_html
            return format_html(
                '<img src="{}" style="max-height: 50px; max-width: 80px; object-fit: contain;" />',
                img.url,
            )
        return "—"

    image_preview.short_description = "Rasm"
