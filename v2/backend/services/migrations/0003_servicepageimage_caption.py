from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("services", "0002_servicepage_image_gallery"),
    ]

    operations = [
        migrations.AddField(
            model_name="servicepageimage",
            name="caption",
            field=models.CharField(
                max_length=255,
                blank=True,
                verbose_name="Rasm matni",
                help_text="Xizmat rasmiga mos qisqa izoh (ixtiyoriy).",
            ),
        ),
    ]

