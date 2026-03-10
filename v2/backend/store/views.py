from django.core.cache import cache
from django.db.models import F, Case, When, Value, Q

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Category, Product, Cart, CartItem, Order, PromoCategory, Banner, Wishlist, NewsletterSubscriber
from .services import record_product_view, record_product_cart_add, record_product_purchase, send_order_to_telegram
from .serializers import (
    CategorySerializer,
    ProductSerializer,
    ProductSearchSerializer,
    ProductViewSerializer,
    PromoCategorySerializer,
    BannerSerializer,
    CartAddSerializer,
    CartItemSerializer,
    CartUpdateSerializer,
    OrderCreateSerializer,
    WishlistItemSerializer,
    WishlistAddSerializer,
    WishlistRemoveSerializer,
    NewsletterSubscribeSerializer,
)

CACHE_TIMEOUT = 300  # 5 minutes for categories, featured, banners, promo (home page data)
CACHE_HEADERS = {"Cache-Control": "public, max-age=300"}


def _cached_list_response(request, cache_key, queryset, serializer_class):
    """Return cached JSON list or compute, cache, and return with Cache-Control.
    If cache backend (e.g. Redis) is unavailable, returns fresh data without caching.
    """
    try:
        data = cache.get(cache_key)
        if data is not None:
            return Response(data, headers=CACHE_HEADERS)
    except Exception:
        pass
    serializer = serializer_class(queryset, many=True, context={"request": request})
    data = serializer.data
    try:
        cache.set(cache_key, data, CACHE_TIMEOUT)
    except Exception:
        pass
    return Response(data, headers=CACHE_HEADERS)


class CategoryList(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def list(self, request, *args, **kwargs):
        return _cached_list_response(
            request, "store:categories", self.get_queryset(), self.get_serializer_class()
        )


class ProductList(generics.ListAPIView):
    queryset = Product.objects.filter(is_active=True).select_related('category').prefetch_related('images', 'specs').all()
    serializer_class = ProductSerializer


class ProductSearchList(generics.ListAPIView):
    """GET /api/products/search/?q=keyword — search by title, description, category name (icontains)."""
    serializer_class = ProductSearchSerializer

    def get_queryset(self):
        q = (self.request.query_params.get('q') or '').strip()
        if not q:
            return Product.objects.none()
        return (
            Product.objects.filter(is_active=True)
            .filter(
                Q(title__icontains=q)
                | Q(description__icontains=q)
                | Q(category__name__icontains=q)
            )
            .select_related('category')
            .prefetch_related('images')
            .distinct()[:20]
        )


class FeaturedProductList(generics.ListAPIView):
    """Featured products for home page (cached for home)."""
    queryset = (
        Product.objects.filter(is_active=True, is_featured=True)
        .select_related('category')
        .prefetch_related('images', 'specs')
    )
    serializer_class = ProductSerializer

    def list(self, request, *args, **kwargs):
        return _cached_list_response(
            request, "store:featured_products", self.get_queryset(), self.get_serializer_class()
        )


class NewProductsList(generics.ListAPIView):
    """Yangi mahsulotlar (bosh sahifa uchun, limit 8, cached)."""
    serializer_class = ProductSerializer

    def get_queryset(self):
        return (
            Product.objects.filter(is_active=True)
            .select_related('category')
            .prefetch_related('images', 'specs')
            .order_by('-created_at')[:8]
        )

    def list(self, request, *args, **kwargs):
        return _cached_list_response(
            request, "store:new_products", self.get_queryset(), self.get_serializer_class()
        )


class BestSellersList(generics.ListAPIView):
    """Eng ko'p sotilganlar (bosh sahifa uchun, limit 8, cached)."""
    serializer_class = ProductSerializer

    def get_queryset(self):
        return (
            Product.objects.filter(is_active=True)
            .select_related('category')
            .prefetch_related('images', 'specs')
            .order_by('-sold_count')[:8]
        )

    def list(self, request, *args, **kwargs):
        return _cached_list_response(
            request, "store:best_sellers", self.get_queryset(), self.get_serializer_class()
        )


class ProductViewView(APIView):
    """POST /api/products/view/ — record product page view. Increments Product.view_count and ProductAnalytics."""

    def post(self, request):
        ser = ProductViewSerializer(data=request.data)
        if not ser.is_valid():
            return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)
        product_id = ser.validated_data['product_id']
        try:
            product = Product.objects.get(pk=product_id, is_active=True)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
        Product.objects.filter(pk=product_id).update(view_count=F('view_count') + 1)
        record_product_view(product)
        return Response({'status': 'ok'}, status=status.HTTP_200_OK)


class ProductDetail(generics.RetrieveAPIView):
    queryset = Product.objects.select_related('category').prefetch_related('images', 'specs').filter(is_active=True)
    serializer_class = ProductSerializer
    lookup_field = 'slug'
    lookup_url_kwarg = 'slug'


class CategoryProductList(generics.ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        slug = self.kwargs['slug']
        return Product.objects.filter(category__slug=slug, is_active=True).select_related('category').prefetch_related('images', 'specs')


class PromoCategoryList(generics.ListAPIView):
    queryset = PromoCategory.objects.all()
    serializer_class = PromoCategorySerializer

    def list(self, request, *args, **kwargs):
        return _cached_list_response(
            request, "store:promo_categories", self.get_queryset(), self.get_serializer_class()
        )


class PromoCategoryProductList(generics.ListAPIView):
    """Mahsulotlar «kim uchun» bo'yicha: Onamga, Otamga va h.k."""
    serializer_class = ProductSerializer

    def get_queryset(self):
        slug = self.kwargs['slug']
        return (
            Product.objects.filter(promo_categories__slug=slug, is_active=True)
            .select_related('category')
            .prefetch_related('images', 'specs')
            .distinct()
        )


class BannerList(generics.ListAPIView):
    queryset = Banner.objects.all()
    serializer_class = BannerSerializer

    def list(self, request, *args, **kwargs):
        return _cached_list_response(
            request, "store:banners", self.get_queryset(), self.get_serializer_class()
        )


class BannerProductsView(generics.ListAPIView):
    """GET /api/banners/<id>/products/ — banner bilan bog'langan mahsulotlar (masalan, 8-mart sovg'alari)."""
    serializer_class = ProductSerializer

    def get_queryset(self):
        banner_id = self.kwargs["pk"]
        return (
            Product.objects.filter(banners__id=banner_id, is_active=True)
            .select_related("category")
            .prefetch_related("images", "specs")
            .distinct()
        )


# --- Cart ---

class CartAddView(APIView):
    def post(self, request):
        ser = CartAddSerializer(data=request.data)
        if not ser.is_valid():
            return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)
        data = ser.validated_data
        cart, _ = Cart.objects.get_or_create(session_id=data['session_id'])
        product_id = data['product_id']
        quantity = data['quantity']
        try:
            product = Product.objects.get(pk=product_id, is_active=True)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
        item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            defaults={'quantity': quantity},
        )
        if not created:
            item.quantity += quantity
            item.save(update_fields=['quantity'])
        record_product_cart_add(product)
        items = cart.items.select_related('product').prefetch_related('product__images').all()
        total = sum(i.product.price * i.quantity for i in items)
        return Response({
            'items': CartItemSerializer(items, many=True, context={'request': request}).data,
            'total_price': str(total),
        })


class CartDetailView(APIView):
    def get(self, request, session_id=None):
        session_id = session_id or request.query_params.get('session_id')
        if not session_id:
            return Response({'items': [], 'total_price': '0.00'})
        try:
            cart = Cart.objects.prefetch_related('items__product').get(session_id=session_id)
        except Cart.DoesNotExist:
            return Response({'items': [], 'total_price': '0.00'})
        items = cart.items.select_related('product').prefetch_related('product__images').all()
        total = cart.get_total_price()
        return Response({
            'items': CartItemSerializer(items, many=True, context={'request': request}).data,
            'total_price': str(total),
        })


class CartUpdateView(APIView):
    def patch(self, request):
        ser = CartUpdateSerializer(data=request.data)
        if not ser.is_valid():
            return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)
        data = ser.validated_data
        try:
            cart = Cart.objects.get(session_id=data['session_id'])
        except Cart.DoesNotExist:
            return Response({'error': 'Cart not found'}, status=status.HTTP_404_NOT_FOUND)
        try:
            product = Product.objects.get(pk=data['product_id'])
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
        if data['quantity'] == 0:
            CartItem.objects.filter(cart=cart, product=product).delete()
        else:
            CartItem.objects.update_or_create(
                cart=cart,
                product=product,
                defaults={'quantity': data['quantity']},
            )
        items = cart.items.select_related('product').prefetch_related('product__images').all()
        total = cart.get_total_price()
        return Response({
            'items': CartItemSerializer(items, many=True, context={'request': request}).data,
            'total_price': str(total),
        })


class CartRemoveView(APIView):
    def post(self, request):
        session_id = request.data.get('session_id')
        product_id = request.data.get('product_id')
        if not session_id or product_id is None:
            return Response(
                {'error': 'session_id and product_id required'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            cart = Cart.objects.get(session_id=session_id)
        except Cart.DoesNotExist:
            return Response({'items': [], 'total_price': '0.00'})
        try:
            product = Product.objects.get(pk=product_id)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
        CartItem.objects.filter(cart=cart, product=product).delete()
        items = cart.items.select_related('product').prefetch_related('product__images').all()
        total = cart.get_total_price()
        return Response({
            'items': CartItemSerializer(items, many=True, context={'request': request}).data,
            'total_price': str(total),
        })


# --- Order ---

class OrderCreateView(APIView):
    def post(self, request):
        ser = OrderCreateSerializer(data=request.data)
        if not ser.is_valid():
            return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)
        data = ser.validated_data
        try:
            cart = Cart.objects.prefetch_related('items__product').get(session_id=data['session_id'])
        except Cart.DoesNotExist:
            return Response({'error': 'Cart not found'}, status=status.HTTP_404_NOT_FOUND)
        if cart.items.count() == 0:
            return Response({'error': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)
        total_price = cart.get_total_price()
        order = Order.objects.create(
            name=data['name'],
            phone=data['phone'],
            delivery_address=data.get('delivery_address', '') or '',
            cart=cart,
            total_price=total_price,
        )
        cart_items = list(cart.items.select_related('product').prefetch_related('product__images').all())
        for item in cart_items:
            record_product_purchase(item.product, item.quantity)
        send_order_to_telegram(order, cart_items)
        return Response({'status': 'order_created'}, status=status.HTTP_201_CREATED)


# --- Wishlist ---

class WishlistListView(APIView):
    """GET /api/wishlist/?session_id=xxx — list favorites."""

    def get(self, request):
        session_id = request.query_params.get('session_id')
        if not session_id:
            return Response({'items': []})
        items = (
            Wishlist.objects.filter(session_id=session_id)
            .select_related('product')
            .prefetch_related('product__images')
            .order_by('-created_at')
        )
        return Response({
            'items': WishlistItemSerializer(items, many=True, context={'request': request}).data,
        })


class WishlistAddView(APIView):
    """POST /api/wishlist/add/ — add product to favorites. Updates product.favorite_count."""

    def post(self, request):
        ser = WishlistAddSerializer(data=request.data)
        if not ser.is_valid():
            return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)
        data = ser.validated_data
        session_id = data['session_id']
        product_id = data['product_id']
        try:
            product = Product.objects.get(pk=product_id, is_active=True)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
        obj, created = Wishlist.objects.get_or_create(
            session_id=session_id,
            product=product,
        )
        if created:
            Product.objects.filter(pk=product_id).update(
                favorite_count=F('favorite_count') + 1,
            )
        return Response(
            {'status': 'added', 'items': WishlistItemSerializer(
                Wishlist.objects.filter(session_id=session_id).select_related('product').prefetch_related('product__images').order_by('-created_at'),
                many=True,
                context={'request': request},
            ).data},
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )


class WishlistRemoveView(APIView):
    """POST /api/wishlist/remove/ — remove product from favorites. Updates product.favorite_count."""

    def post(self, request):
        ser = WishlistRemoveSerializer(data=request.data)
        if not ser.is_valid():
            return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)
        data = ser.validated_data
        session_id = data['session_id']
        product_id = data['product_id']
        deleted, _ = Wishlist.objects.filter(session_id=session_id, product_id=product_id).delete()
        if deleted:
            Product.objects.filter(pk=product_id).update(
                favorite_count=Case(
                    When(favorite_count__gt=0, then=F('favorite_count') - 1),
                    default=Value(0),
                ),
            )
        return Response({
            'status': 'removed',
            'items': WishlistItemSerializer(
                Wishlist.objects.filter(session_id=session_id).select_related('product').prefetch_related('product__images').order_by('-created_at'),
                many=True,
                context={'request': request},
            ).data,
        })


# --- Newsletter ---

class NewsletterSubscribeView(APIView):
    """POST /api/newsletter/ — save email for «Yangiliklardan xabardor». No auth."""

    def post(self, request):
        ser = NewsletterSubscribeSerializer(data=request.data)
        if not ser.is_valid():
            return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)
        email = ser.validated_data['email'].strip().lower()
        obj, created = NewsletterSubscriber.objects.get_or_create(
            email=email,
            defaults={},
        )
        return Response(
            {'status': 'subscribed', 'message': 'Email roʻyxatga qoʻshildi.'},
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )
