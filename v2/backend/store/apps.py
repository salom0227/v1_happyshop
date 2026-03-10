from django.apps import AppConfig


def run_seed(sender, **kwargs):
    """Seed categories and products when database is empty."""
    from .models import Category, Product, PromoCategory
    if sender.name != 'store':
        return
    try:
        if not Category.objects.exists():
            pass  # will create categories and products below
        elif PromoCategory.objects.exists():
            return  # both already seeded
        else:
            # Categories exist, seed only PromoCategory (categorydan tanlash)
            by_slug = {c.slug: c for c in Category.objects.all()}
            promo_data = [
                {'name': 'Otamga', 'slug': 'otamga', 'category': by_slug.get('birthday'), 'order': 1},
                {'name': 'Onamga', 'slug': 'onamga', 'category': by_slug.get('birthday'), 'order': 2},
                {'name': 'Singlimga', 'slug': 'singlimga', 'category': by_slug.get('corporate'), 'order': 3},
                {'name': 'Sevgilimga', 'slug': 'sevgilimga', 'category': by_slug.get('romantic'), 'order': 4},
                {'name': 'Ayollar', 'slug': 'ayollar', 'category': by_slug.get('corporate'), 'order': 5},
                {'name': 'Erkaklar', 'slug': 'erkaklar', 'category': by_slug.get('corporate'), 'order': 6},
                {'name': 'Bolalar', 'slug': 'bolalar', 'category': by_slug.get('birthday'), 'order': 7},
            ]
            for data in promo_data:
                PromoCategory.objects.create(**data)
            return
    except Exception:
        return
    categories_data = [
        {'name': 'Birthday 🎂', 'slug': 'birthday'},
        {'name': 'Romantic ❤️', 'slug': 'romantic'},
        {'name': 'Corporate 💼', 'slug': 'corporate'},
        {'name': 'Surprise Box 🎁', 'slug': 'surprise-box'},
    ]
    categories = []
    for data in categories_data:
        cat = Category.objects.create(**data)
        categories.append(cat)

    products_data = [
        # Birthday
        {'category': categories[0], 'title': 'Birthday Cake', 'slug': 'birthday-cake', 'description': 'Delicious birthday cake.', 'price': 29.99, 'is_featured': True},
        {'category': categories[0], 'title': 'Birthday Balloons', 'slug': 'birthday-balloons', 'description': 'Colorful balloon set.', 'price': 14.99, 'is_featured': False},
        # Romantic
        {'category': categories[1], 'title': 'Romantic Bouquet', 'slug': 'romantic-bouquet', 'description': 'Fresh flower bouquet.', 'price': 49.99, 'is_featured': True},
        {'category': categories[1], 'title': 'Love Chocolate Box', 'slug': 'love-chocolate-box', 'description': 'Premium chocolates.', 'price': 24.99, 'is_featured': False},
        # Corporate
        {'category': categories[2], 'title': 'Corporate Gift Set', 'slug': 'corporate-gift-set', 'description': 'Professional gift set.', 'price': 59.99, 'is_featured': False},
        {'category': categories[2], 'title': 'Office Hamper', 'slug': 'office-hamper', 'description': 'Gourmet office hamper.', 'price': 79.99, 'is_featured': True},
        # Surprise Box
        {'category': categories[3], 'title': 'Mystery Surprise Box', 'slug': 'mystery-surprise-box', 'description': 'Curated surprise items.', 'price': 39.99, 'is_featured': True},
        {'category': categories[3], 'title': 'Mini Surprise Pack', 'slug': 'mini-surprise-pack', 'description': 'Small surprise pack.', 'price': 19.99, 'is_featured': False},
    ]
    for data in products_data:
        Product.objects.create(**data)

    # Promo kategoriyalar (Kimga sovg'a tanlaymiz?) — kategoriyadan tanlash
    promo_data = [
        {'name': 'Otamga', 'slug': 'otamga', 'category': categories[0], 'order': 1},
        {'name': 'Onamga', 'slug': 'onamga', 'category': categories[0], 'order': 2},
        {'name': 'Singlimga', 'slug': 'singlimga', 'category': categories[2], 'order': 3},
        {'name': 'Sevgilimga', 'slug': 'sevgilimga', 'category': categories[1], 'order': 4},
        {'name': 'Ayollar', 'slug': 'ayollar', 'category': categories[2], 'order': 5},
        {'name': 'Erkaklar', 'slug': 'erkaklar', 'category': categories[2], 'order': 6},
        {'name': 'Bolalar', 'slug': 'bolalar', 'category': categories[0], 'order': 7},
    ]
    for data in promo_data:
        PromoCategory.objects.create(**data)


class StoreConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'store'

    def ready(self):
        from django.db.models.signals import post_migrate
        from django.contrib import admin
        post_migrate.connect(run_seed, sender=self)
        from . import signals  # noqa: F401 — admin o'zgartirganda cache tozalanadi
        # Admin panel sarlavhalari o'zbek tilida
        admin.site.site_header = "Boshqaruv paneli"
        admin.site.site_title = "Sayt boshqaruvi"
        admin.site.index_title = "Bosh sahifa"
