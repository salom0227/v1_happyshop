# Generated migration: ServicePage card image + gallery (1-10 images)

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("services", "0001_service_page"),
    ]

    operations = [
        migrations.AddField(
            model_name="servicepage",
            name="image",
            field=models.ImageField(
                blank=True,
                null=True,
                upload_to="services/",
                verbose_name="Kartochka rasmi",
                help_text="Bosh sahifa va ro'yxatda ko'rinadigan rasm.",
            ),
        ),
        migrations.CreateModel(
            name="ServicePageImage",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("image", models.ImageField(upload_to="services/gallery/", verbose_name="Rasm")),
                ("order", models.PositiveIntegerField(default=0, verbose_name="Tartib")),
                (
                    "service",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="gallery_images",
                        to="services.servicepage",
                        verbose_name="Xizmat",
                    ),
                ),
            ],
            options={
                "ordering": ["order", "id"],
                "verbose_name": "Xizmat rasmi",
                "verbose_name_plural": "Xizmat rasmlari",
            },
        ),
    ]
