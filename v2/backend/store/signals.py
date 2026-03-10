"""
Admin orqali ma'lumot o'zgartirilganda API cache'ini tozalash.
Barcha kategoriya, banner, promo, featured mahsulotlar yangilanganda
frontend yangi ma'lumotlarni oladi.
"""
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.core.cache import cache

from .models import Category, Banner, PromoCategory, Product

CACHE_KEYS = [
    "store:categories",
    "store:banners",
    "store:promo_categories",
    "store:featured_products",
    "store:new_products",
    "store:best_sellers",
]


def invalidate_store_list_caches():
    for key in CACHE_KEYS:
        try:
            cache.delete(key)
        except Exception:
            pass


@receiver([post_save, post_delete], sender=Category)
def invalidate_on_category_change(sender, **kwargs):
    invalidate_store_list_caches()


@receiver([post_save, post_delete], sender=Banner)
def invalidate_on_banner_change(sender, **kwargs):
    invalidate_store_list_caches()


@receiver([post_save, post_delete], sender=PromoCategory)
def invalidate_on_promo_category_change(sender, **kwargs):
    invalidate_store_list_caches()


@receiver([post_save, post_delete], sender=Product)
def invalidate_on_product_change(sender, instance, **kwargs):
    invalidate_store_list_caches()
