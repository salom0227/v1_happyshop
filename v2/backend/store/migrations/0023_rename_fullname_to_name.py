from django.db import migrations

class Migration(migrations.Migration):
    dependencies = [
        ('store', '0022_alter_banner_image_alter_category_image_and_more'),
    ]
    operations = [
        migrations.RunSQL(
            "ALTER TABLE store_order RENAME COLUMN full_name TO name;",
            reverse_sql="ALTER TABLE store_order RENAME COLUMN name TO full_name;"
        ),
    ]
