# Generated manually for newsletter subscriber

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('store', '0019_product_order_note'),
    ]

    operations = [
        migrations.CreateModel(
            name='NewsletterSubscriber',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('email', models.EmailField(max_length=254, unique=True, verbose_name='Email')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name="Qoʻshilgan sana")),
            ],
            options={
                'verbose_name': 'Yangiliklardan xabardor',
                'verbose_name_plural': 'Yangiliklardan xabardor (email roʻyxati)',
                'ordering': ['-created_at'],
            },
        ),
    ]
