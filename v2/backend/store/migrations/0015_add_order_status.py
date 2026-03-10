# Generated manually for Order.status

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("store", "0014_wishlist_model"),
    ]

    operations = [
        migrations.AddField(
            model_name="order",
            name="status",
            field=models.CharField(
                choices=[
                    ("pending", "Kutilmoqda"),
                    ("completed", "Bajarilgan"),
                    ("cancelled", "Bekor qilingan"),
                ],
                db_index=True,
                default="pending",
                max_length=20,
                verbose_name="Holat",
            ),
        ),
    ]
