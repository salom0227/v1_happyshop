# Generated migration: remove stock_quantity from Product

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("store", "0015_add_order_status"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="product",
            name="stock_quantity",
        ),
    ]
