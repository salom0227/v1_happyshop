from django.db import models
from django.utils.text import slugify


class ServicePage(models.Model):
    title = models.CharField(max_length=255, verbose_name="Sarlavha")
    slug = models.SlugField(max_length=255, unique=True, verbose_name="Slug")
    content = models.TextField(blank=True, verbose_name="Matn (HTML mumkin)")
    image = models.ImageField(
        upload_to="services/",
        blank=True,
        null=True,
        verbose_name="Kartochka rasmi",
        help_text="Bosh sahifa va ro'yxatda ko'rinadigan rasm. Bo'sh qoldirilsa galereyadagi birinchi rasm ishlatiladi.",
    )
    icon = models.CharField(
        max_length=100,
        blank=True,
        verbose_name="Icon",
        help_text="CSS class yoki icon nomi (ixtiyoriy)",
    )
    is_active = models.BooleanField(default=True, verbose_name="Faol", db_index=True)
    order = models.PositiveIntegerField(default=0, verbose_name="Tartib")

    class Meta:
        verbose_name = "Xizmat sahifasi"
        verbose_name_plural = "Xizmat sahifalari"
        ordering = ["order", "id"]

    def __str__(self):
        return self.title

    def _generate_unique_slug(self) -> str:
        base = slugify(self.title) or "xizmat"
        slug = base[:255]
        qs = ServicePage.objects.filter(slug=slug)
        if self.pk:
            qs = qs.exclude(pk=self.pk)
        if qs.exists():
            from django.utils import timezone

            slug = f"{base[:240]}-{timezone.now().strftime('%Y%m%d%H%M')}"
        return slug[:255]

    def save(self, *args, **kwargs):
        if not self.slug and self.title:
            self.slug = self._generate_unique_slug()
        super().save(*args, **kwargs)


class ServicePageImage(models.Model):
    """Xizmat sahifasi galereyasi — 1 tadan 10 tagacha rasm."""
    service = models.ForeignKey(
        ServicePage,
        on_delete=models.CASCADE,
        related_name="gallery_images",
        verbose_name="Xizmat",
    )
    image = models.ImageField(upload_to="services/gallery/", verbose_name="Rasm")
    caption = models.CharField(
        max_length=255,
        blank=True,
        verbose_name="Rasm matni",
        help_text="Xizmat rasmiga mos qisqa izoh (ixtiyoriy).",
    )
    order = models.PositiveIntegerField(default=0, verbose_name="Tartib")

    class Meta:
        ordering = ["order", "id"]
        verbose_name = "Xizmat rasmi"
        verbose_name_plural = "Xizmat rasmlari"

    def __str__(self):
        return f"{self.service.title} — rasm #{self.order}"
