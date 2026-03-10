from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("store", "0020_newsletter_subscriber"),
    ]

    operations = [
        migrations.AddField(
            model_name="banner",
            name="products",
            field=models.ManyToManyField(
                to="store.product",
                blank=True,
                related_name="banners",
                verbose_name="Bog'langan mahsulotlar",
                help_text="Bu banner uchun ko'rinadigan mahsulotlar (masalan: 8-mart sovg'alari).",
            ),
        ),
    ]

