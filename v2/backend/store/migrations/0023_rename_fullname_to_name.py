from django.db import migrations

class Migration(migrations.Migration):
    dependencies = [
        ('store', '0022_alter_banner_image_alter_category_image_and_more'),
    ]
    operations = [
        migrations.RunSQL(
            "ALTER TABLE store_order DROP COLUMN IF EXISTS full_name;",
            reverse_sql="SELECT 1;"
        ),
    ]
