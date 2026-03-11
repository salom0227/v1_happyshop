from decimal import Decimal
from django.db import models
from django.utils.text import slugify


class Category(models.Model):
    name = models.CharField(max_length=255, verbose_name='Nomi')
    slug = models.SlugField(max_length=255, unique=True, verbose_name='Slug')
    image = models.URLField(max_length=500, blank=True, null=True, verbose_name='Rasm URL')

    class Meta:
        verbose_name = 'Kategoriya'
        verbose_name_plural = 'Kategoriyalar'

    def __str__(self):
        return self.name


class PromoCategory(models.Model):
    """«Kimga sovg'a tanlaymiz?» bo'limi uchun admin orqali boshqariladigan elementlar."""
    name = models.CharField(max_length=255, verbose_name='Nomi')
    slug = models.SlugField(max_length=255, unique=True, verbose_name='Slug')
    image = models.URLField(max_length=500, blank=True, null=True, verbose_name='Rasm URL')
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='promo_categories',
        verbose_name='Kategoriya (havola)',
    )
    link = models.CharField(
        max_length=500,
        blank=True,
        help_text='Agar kategoriya tanlanmasa, qo\'lda kiriting. Masalan: /catalog/birthday',
    )
    order = models.PositiveIntegerField(default=0, verbose_name='Tartib')

    class Meta:
        verbose_name = "Kimga sovg'a (promo)"
        verbose_name_plural = "Kimga sovg'a (promo kategoriyalar)"
        ordering = ['order', 'id']

    def __str__(self):
        return self.name


class Banner(models.Model):
    """Bosh sahifa hero slayder bannerlari (admin orqali boshqariladi)."""
    title = models.CharField(max_length=255, verbose_name='Sarlavha')
    subtitle = models.CharField(max_length=500, blank=True, verbose_name='Qisqa matn')
    image = models.URLField(max_length=500, blank=True, verbose_name='Rasm URL')
    button_text = models.CharField(max_length=100, blank=True, verbose_name='Tugma matni')
    link = models.CharField(max_length=500, blank=True, verbose_name='Tugma havolasi')
    products = models.ManyToManyField(
        "Product",
        blank=True,
        related_name="banners",
        verbose_name="Bog'langan mahsulotlar",
        help_text="Bu banner uchun ko'rinadigan mahsulotlar (masalan: 8-mart sovg'alari).",
    )
    order = models.PositiveIntegerField(default=0, verbose_name='Tartib')

    class Meta:
        verbose_name = 'Banner'
        verbose_name_plural = 'Bannerlar'
        ordering = ['order', 'id']

    def __str__(self):
        return self.title


class Product(models.Model):
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name='products',
        verbose_name='Kategoriya (mahsulot turi)',
        help_text='Masalan: Surprise box, Gul buketi',
        db_index=True,
    )
    title = models.CharField(max_length=255, verbose_name='Nomi')
    slug = models.SlugField(max_length=255, unique=True, verbose_name='Slug', db_index=True)
    description = models.TextField(blank=True, verbose_name='Tavsif')
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Narx')
    discount_percent = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name='Chegirma foizi',
        help_text='Masalan: 10.00 = 10%',
    )
    discount_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name='Chegirma narxi',
        help_text='Avtomatik hisoblanadi agar discount_percent berilgan bo\'lsa',
    )
    view_count = models.PositiveIntegerField(default=0, verbose_name='Ko\'rilishlar soni', db_index=True)
    favorite_count = models.PositiveIntegerField(default=0, verbose_name='Sevimlilar soni', db_index=True)
    sold_count = models.PositiveIntegerField(default=0, verbose_name='Sotilgan soni', db_index=True)
    is_active = models.BooleanField(default=True, verbose_name='Faol', db_index=True)
    is_featured = models.BooleanField(default=False, verbose_name='Xit savdo', db_index=True)
    promo_categories = models.ManyToManyField(
        PromoCategory,
        blank=True,
        related_name='tagged_products',
        verbose_name="Kim uchun (sovg'a kimga mos)",
        help_text="Mahsulot qaysi «Kimga sovg'a» bo'limlarida ko'rinsin: Onamga, Otamga, Sevgilimga va h.k.",
    )
    order_note = models.TextField(
        blank=True,
        default='',
        verbose_name="Buyurtma eslatmasi",
        help_text="Faqat admin panelda ko'rinadi va buyurtma Telegram botga yuborilganda chekda chiqadi. Saytda ko'rinmaydi.",
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Qoʻshilgan sana')

    class Meta:
        verbose_name = 'Mahsulot'
        verbose_name_plural = 'Mahsulotlar'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['category', 'is_active'], name='store_product_cat_active_idx'),
            models.Index(fields=['is_featured', 'is_active'], name='store_product_feat_active_idx'),
        ]

    def save(self, *args, **kwargs):
        if not self.slug and self.title:
            self.slug = self._generate_unique_slug()
        if self.discount_percent is not None and self.discount_percent > 0:
            self.discount_price = (self.price * (Decimal('100') - self.discount_percent) / Decimal('100')).quantize(Decimal('0.01'))
        else:
            self.discount_price = None
        super().save(*args, **kwargs)

    def _generate_unique_slug(self):
        base = slugify(self.title) or 'product'
        slug = base[:255]
        qs = Product.objects.filter(slug=slug)
        if self.pk:
            qs = qs.exclude(pk=self.pk)
        if qs.exists():
            from django.utils import timezone
            slug = f'{base[:240]}-{timezone.now().strftime("%Y%m%d%H%M")}'
        return slug[:255]

    def increase_view_count(self):
        Product.objects.filter(pk=self.pk).update(view_count=models.F('view_count') + 1)
        self.refresh_from_db(fields=['view_count'])

    def increase_favorite_count(self):
        Product.objects.filter(pk=self.pk).update(favorite_count=models.F('favorite_count') + 1)
        self.refresh_from_db(fields=['favorite_count'])

    def increase_sold_count(self, quantity=1):
        Product.objects.filter(pk=self.pk).update(sold_count=models.F('sold_count') + quantity)
        self.refresh_from_db(fields=['sold_count'])


class ProductImage(models.Model):
    """Mahsulot rasmlari — har bir mahsulotda 1 tadan 5 tagacha rasm bo'lishi kerak."""
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='images',
        verbose_name='Mahsulot',
    )
    image = models.URLField(max_length=500, verbose_name='Rasm URL')
    order = models.PositiveIntegerField(default=0, verbose_name='Tartib')

    class Meta:
        ordering = ['order', 'id']
        verbose_name = 'Mahsulot rasmi'
        verbose_name_plural = 'Mahsulot rasmlari'

    def __str__(self):
        if self.product_id:
            return f"{self.product.title} — rasm #{self.order + 1}"
        return f"Rasm #{self.order + 1}"


class ProductSpec(models.Model):
    """Mahsulot xususiyatlari (admin orqali kiritiladi). Masalan: Kategoriya, Rang, Uzunligi."""
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='specs',
        verbose_name='Mahsulot',
    )
    key = models.CharField(max_length=255, verbose_name='Xususiyat nomi')
    value = models.CharField(max_length=500, verbose_name='Qiymat', blank=True)
    order = models.PositiveIntegerField(default=0, verbose_name='Tartib')

    class Meta:
        ordering = ['order', 'id']
        verbose_name = 'Mahsulot xususiyati'
        verbose_name_plural = 'Mahsulot xususiyatlari'

    def __str__(self):
        return f"{self.key}: {self.value or '—'}"


class ProductAnalytics(models.Model):
    """Per-product analytics: views, favorites, cart additions, purchases."""
    product = models.OneToOneField(
        Product,
        on_delete=models.CASCADE,
        related_name='analytics',
        verbose_name='Mahsulot',
        primary_key=True,
        db_index=True,
    )
    views = models.PositiveIntegerField(default=0, verbose_name='Ko\'rilishlar', db_index=True)
    favorites = models.PositiveIntegerField(default=0, verbose_name='Sevimlilar', db_index=True)
    cart_additions = models.PositiveIntegerField(default=0, verbose_name='Savatga qo\'shilgan', db_index=True)
    purchases = models.PositiveIntegerField(default=0, verbose_name='Sotilgan (dona)', db_index=True)
    last_viewed_at = models.DateTimeField(null=True, blank=True, verbose_name='Oxirgi ko\'rilgan', db_index=True)

    class Meta:
        verbose_name = 'Mahsulot analitikasi'
        verbose_name_plural = 'Mahsulotlar analitikasi'
        indexes = [
            models.Index(fields=['-views'], name='store_prodan_views_idx'),
            models.Index(fields=['-purchases'], name='store_prodan_purch_idx'),
            models.Index(fields=['-last_viewed_at'], name='store_prodan_lastview_idx'),
        ]

    def __str__(self):
        return f"Analitika: {self.product.title}"


class Wishlist(models.Model):
    """User's favorite products. Uses session_id (same as cart) for anonymous users."""
    session_id = models.CharField(max_length=255, db_index=True, verbose_name='Sessiya ID')
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='wishlist_entries',
        verbose_name='Mahsulot',
        db_index=True,
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Qoʻshilgan sana')

    class Meta:
        verbose_name = 'Sevimlilar'
        verbose_name_plural = 'Sevimlilar'
        ordering = ['-created_at']
        constraints = [
            models.UniqueConstraint(fields=['session_id', 'product'], name='unique_wishlist_session_product'),
        ]

    def __str__(self):
        return f'{self.session_id} — {self.product.title}'


class Cart(models.Model):
    session_id = models.CharField(max_length=255, db_index=True, verbose_name='Sessiya ID')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Yaratilgan sana')

    class Meta:
        verbose_name = 'Savatcha'
        verbose_name_plural = 'Savatchalar'
        ordering = ['-created_at']

    def __str__(self):
        return f'Cart {self.session_id}'

    def get_total_price(self):
        return sum(
            item.product.price * item.quantity
            for item in self.items.select_related('product').all()
        )


class CartItem(models.Model):
    cart = models.ForeignKey(
        Cart,
        on_delete=models.CASCADE,
        related_name='items',
        verbose_name='Savatcha',
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='cart_items',
        verbose_name='Mahsulot',
    )
    quantity = models.PositiveIntegerField(default=1, verbose_name='Miqdor')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Qoʻshilgan sana')

    class Meta:
        verbose_name = 'Savat elementi'
        verbose_name_plural = 'Savat elementlari'
        ordering = ['created_at']
        constraints = [
            models.UniqueConstraint(fields=['cart', 'product'], name='unique_cart_product'),
        ]

    def __str__(self):
        return f'{self.product.title} x {self.quantity}'


class Order(models.Model):
    STATUS_PENDING = 'pending'
    STATUS_COMPLETED = 'completed'
    STATUS_CANCELLED = 'cancelled'
    STATUS_CHOICES = [
        (STATUS_PENDING, 'Kutilmoqda'),
        (STATUS_COMPLETED, 'Bajarilgan'),
        (STATUS_CANCELLED, 'Bekor qilingan'),
    ]
    name = models.CharField(max_length=255, verbose_name='Ism')
    phone = models.CharField(max_length=50, verbose_name='Telefon')
    delivery_address = models.CharField(
        max_length=500,
        blank=True,
        default='',
        verbose_name='Yetkazib berish manzili',
    )
    cart = models.ForeignKey(
        Cart,
        on_delete=models.PROTECT,
        related_name='orders',
        verbose_name='Savatcha',
    )
    total_price = models.DecimalField(max_digits=12, decimal_places=2, verbose_name='Jami summa')
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default=STATUS_PENDING,
        db_index=True,
        verbose_name='Holat',
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Buyurtma sanasi')

    class Meta:
        verbose_name = 'Buyurtma'
        verbose_name_plural = 'Buyurtmalar'
        ordering = ['-created_at']

    def __str__(self):
        return f'Order #{self.id} - {self.name}'


class NewsletterSubscriber(models.Model):
    """Footerdagi «Yangiliklardan xabardor» formasi orqali yig‘iladigan email manzillar."""
    email = models.EmailField(unique=True, verbose_name='Email')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Qoʻshilgan sana')

    class Meta:
        verbose_name = 'Yangiliklardan xabardor'
        verbose_name_plural = 'Yangiliklardan xabardor (email roʻyxati)'
        ordering = ['-created_at']

    def __str__(self):
        return self.email
