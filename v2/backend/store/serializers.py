from rest_framework import serializers
from django.conf import settings

def _build_url(path):
    if not path:
        return None
    if str(path).startswith('http'):
        return str(path)
    site_url = getattr(settings, 'SITE_URL', 'http://16.171.226.43:8000')
    return f"{site_url}/media/{str(path)}"

from .models import Category, Product, ProductImage, Cart, CartItem, Order, PromoCategory, Banner, Wishlist


class CategorySerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'image']

    def get_image(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return _build_url(obj.image)
            return obj.image.url if hasattr(obj.image, "url") else obj.image if hasattr(obj.image, "url") else obj.image
        return None


def _product_image_urls(obj, request):
    """ProductImage dan URL lar ro'yxati (tartib bo'yicha)."""
    if not hasattr(obj, 'images'):
        return []
    urls = []
    for img in obj.images.all():
        if img.image:
            url = _build_url(img.image)
            urls.append(url)
    return urls


class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    image = serializers.SerializerMethodField()
    images = serializers.SerializerMethodField()
    specs = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id',
            'category',
            'title',
            'slug',
            'description',
            'price',
            'discount_percent',
            'discount_price',
            'view_count',
            'favorite_count',
            'sold_count',
            'is_active',
            'image',
            'images',
            'specs',
            'is_featured',
            'created_at',
        ]

    def get_image(self, obj):
        urls = _product_image_urls(obj, self.context.get('request'))
        return urls[0] if urls else None

    def get_images(self, obj):
        return _product_image_urls(obj, self.context.get('request'))

    def get_specs(self, obj):
        if not hasattr(obj, 'specs'):
            return []
        return [{'key': s.key, 'value': s.value or '—'} for s in obj.specs.all()]


class ProductSearchSerializer(serializers.ModelSerializer):
    """Minimal fields for search results: id, title, price, image, slug."""
    image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ['id', 'title', 'price', 'image', 'slug']

    def get_image(self, obj):
        urls = _product_image_urls(obj, self.context.get('request'))
        return urls[0] if urls else None


class ProductViewSerializer(serializers.Serializer):
    product_id = serializers.IntegerField(min_value=1)


class PromoCategorySerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    link = serializers.SerializerMethodField()

    class Meta:
        model = PromoCategory
        fields = ['id', 'name', 'slug', 'image', 'link', 'order']

    def get_image(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return _build_url(obj.image)
            return obj.image.url if hasattr(obj.image, "url") else obj.image if hasattr(obj.image, "url") else obj.image
        return None

    def get_link(self, obj):
        # «Kim uchun» bo'yicha mahsulotlar: /gift-for/onamga, /gift-for/otamga va h.k.
        return f'/gift-for/{obj.slug}'


class BannerSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    buttonText = serializers.CharField(source='button_text', read_only=True)

    class Meta:
        model = Banner
        fields = ['id', 'title', 'subtitle', 'image', 'buttonText', 'link', 'order']

    def get_image(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return _build_url(obj.image)
            return obj.image.url if hasattr(obj.image, "url") else obj.image if hasattr(obj.image, "url") else obj.image
        return None


# --- Cart ---

class CartAddSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)
    session_id = serializers.CharField()


class CartItemProductSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ['id', 'title', 'slug', 'price', 'image']

    def get_image(self, obj):
        urls = _product_image_urls(obj, self.context.get('request'))
        return urls[0] if urls else None


class CartItemSerializer(serializers.ModelSerializer):
    product = CartItemProductSerializer(read_only=True)
    line_total = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'quantity', 'line_total', 'created_at']

    def get_line_total(self, obj):
        return obj.product.price * obj.quantity


class CartUpdateSerializer(serializers.Serializer):
    session_id = serializers.CharField()
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=0)


# --- Wishlist ---

class WishlistItemSerializer(serializers.ModelSerializer):
    product = CartItemProductSerializer(read_only=True)

    class Meta:
        model = Wishlist
        fields = ['id', 'product', 'created_at']


class WishlistAddSerializer(serializers.Serializer):
    session_id = serializers.CharField()
    product_id = serializers.IntegerField()


class WishlistRemoveSerializer(serializers.Serializer):
    session_id = serializers.CharField()
    product_id = serializers.IntegerField()


# --- Order ---

class OrderCreateSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=255)
    phone = serializers.CharField(max_length=50)
    delivery_address = serializers.CharField(max_length=500, required=False, allow_blank=True, default='')
    session_id = serializers.CharField()


# --- Newsletter ---

class NewsletterSubscribeSerializer(serializers.Serializer):
    email = serializers.EmailField()
