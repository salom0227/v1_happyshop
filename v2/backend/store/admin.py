from django.contrib import admin, messages
from django.core.exceptions import ValidationError
from django.db.models import Sum
from django.utils.html import format_html
from .models import Category, Product, ProductImage, ProductSpec, ProductAnalytics, Wishlist, Cart, CartItem, Order, PromoCategory, Banner, NewsletterSubscriber


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'image_preview')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name',)

    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-height:50px;max-width:80px;object-fit:contain;" />', obj.image)
        return '—'
    image_preview.short_description = 'Rasm'


@admin.register(PromoCategory)
class PromoCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'category', 'get_link', 'order', 'image_preview')
    list_editable = ('order',)
    list_filter = ('category',)
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name',)
    autocomplete_fields = ('category',)

    def get_link(self, obj):
        return f'/gift-for/{obj.slug}'
    get_link.short_description = 'Havola'

    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-height:50px;max-width:80px;object-fit:contain;" />', obj.image)
        return '—'
    image_preview.short_description = 'Rasm'


@admin.register(Banner)
class BannerAdmin(admin.ModelAdmin):
    list_display = ('title', 'order', 'image_preview', 'link')
    list_editable = ('order',)
    search_fields = ('title', 'subtitle')
    filter_horizontal = ('products',)

    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-height:50px;max-width:120px;object-fit:contain;" />', obj.image)
        return '—'
    image_preview.short_description = 'Rasm'


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    min_num = 0
    max_num = 5
    validate_max = True
    ordering = ['order']
    fields = ('image', 'order')


class ProductSpecInline(admin.TabularInline):
    model = ProductSpec
    extra = 1
    ordering = ['order']
    fields = ('key', 'value', 'order')


class HasDiscountFilter(admin.SimpleListFilter):
    title = 'chegirma'
    parameter_name = 'has_discount'

    def lookups(self, request, model_admin):
        return (('yes', "Chegirma bor"), ('no', "Chegirma yo'q"))

    def queryset(self, request, queryset):
        if self.value() == 'yes':
            return queryset.filter(discount_percent__isnull=False).exclude(discount_percent=0)
        if self.value() == 'no':
            return queryset.filter(discount_percent__isnull=True) | queryset.filter(discount_percent=0)
        return queryset


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'price', 'discount_percent', 'discount_display', 'view_count', 'favorite_count', 'sold_count', 'is_featured', 'is_active', 'image_preview', 'created_at')
    list_filter = ('category', 'is_featured', 'is_active', HasDiscountFilter, 'promo_categories')
    list_editable = ('discount_percent', 'is_featured', 'is_active')
    list_per_page = 25
    prepopulated_fields = {'slug': ('title',)}
    search_fields = ('title', 'description')
    raw_id_fields = ('category',)
    filter_horizontal = ('promo_categories',)
    inlines = [ProductImageInline, ProductSpecInline]
    date_hierarchy = 'created_at'

    fieldsets = (
        (None, {'fields': ('category', 'title', 'slug', 'description', 'is_active', 'is_featured')}),
        ('Narx', {'fields': ('price', 'discount_percent', 'discount_price')}),
        ("Analitika (faqat ko'rish)", {'fields': ('view_count', 'favorite_count', 'sold_count'), 'classes': ('collapse',)}),
        ('Promo', {'fields': ('promo_categories',), 'classes': ('collapse',)}),
        ('Buyurtma eslatmasi', {'fields': ('order_note',), 'classes': ('collapse',)}),
    )
    readonly_fields = ('discount_price', 'view_count', 'favorite_count', 'sold_count')
    actions = ['mark_as_featured', 'mark_not_featured', 'apply_discount_10', 'apply_discount_20', 'remove_discount', 'disable_products', 'enable_products']

    @admin.action(description="Xit savdo qilib belgilash")
    def mark_as_featured(self, request, queryset):
        updated = queryset.update(is_featured=True)
        self.message_user(request, f"{updated} ta mahsulot xit savdo qilib belgilandi.", messages.SUCCESS)

    @admin.action(description="Xit savdodan olib tashlash")
    def mark_not_featured(self, request, queryset):
        updated = queryset.update(is_featured=False)
        self.message_user(request, f"{updated} ta mahsulot xit savdodan olib tashlandi.", messages.SUCCESS)

    @admin.action(description="10 foiz chegirma qo'llash")
    def apply_discount_10(self, request, queryset):
        count = 0
        for p in queryset:
            p.discount_percent = 10
            p.save()
            count += 1
        self.message_user(request, f"{count} ta mahsulotga 10% chegirma qo'llandi.", messages.SUCCESS)

    @admin.action(description="20 foiz chegirma qo'llash")
    def apply_discount_20(self, request, queryset):
        count = 0
        for p in queryset:
            p.discount_percent = 20
            p.save()
            count += 1
        self.message_user(request, f"{count} ta mahsulotga 20% chegirma qo'llandi.", messages.SUCCESS)

    @admin.action(description="Chegirmani olib tashlash")
    def remove_discount(self, request, queryset):
        count = 0
        for p in queryset:
            p.discount_percent = None
            p.discount_price = None
            p.save(update_fields=['discount_percent', 'discount_price'])
            count += 1
        self.message_user(request, f"{count} ta mahsulotdan chegirma olib tashlandi.", messages.SUCCESS)

    @admin.action(description="Mahsulotlarni o'chirish (faol emas)")
    def disable_products(self, request, queryset):
        updated = queryset.update(is_active=False)
        self.message_user(request, f"{updated} ta mahsulot o'chirildi.", messages.WARNING)

    @admin.action(description="Mahsulotlarni yoqish (faol)")
    def enable_products(self, request, queryset):
        updated = queryset.update(is_active=True)
        self.message_user(request, f"{updated} ta mahsulot yoqildi.", messages.SUCCESS)

    def discount_display(self, obj):
        if obj.discount_percent and obj.discount_percent > 0:
            return format_html('<span style="color:green;">{}%</span> → {}', obj.discount_percent, obj.discount_price or '—')
        return '—'
    discount_display.short_description = 'Chegirma'

    def save_formset(self, request, form, formset, change):
        if formset.model == ProductImage and formset.cleaned_data is not None:
            total = sum(1 for d in formset.cleaned_data if d and not d.get('DELETE'))
            if total > 5:
                raise ValidationError("Har bir mahsulotda eng ko'pi 5 ta rasm bo'lishi mumkin.")
        super().save_formset(request, form, formset, change)

    def image_preview(self, obj):
        first = obj.images.first()
        if first and first.image:
            return format_html('<img src="{}" style="max-height:50px;max-width:80px;object-fit:contain;" />', first.image)
        return '—'
    image_preview.short_description = 'Rasm'


@admin.register(ProductAnalytics)
class ProductAnalyticsAdmin(admin.ModelAdmin):
    list_display = ('product_link', 'views', 'favorites', 'cart_additions', 'purchases', 'last_viewed_at', 'conversion_hint')
    list_filter = ('product__category',)
    search_fields = ('product__title', 'product__slug')
    ordering = ('-views',)
    readonly_fields = ('product', 'views', 'favorites', 'cart_additions', 'purchases', 'last_viewed_at')
    list_per_page = 25
    list_select_related = ('product', 'product__category')
    date_hierarchy = 'last_viewed_at'

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('product', 'product__category')

    def product_link(self, obj):
        if obj.product_id:
            url = f'/admin/store/product/{obj.product_id}/change/'
            return format_html('<a href="{}">{}</a>', url, obj.product.title)
        return '—'
    product_link.short_description = 'Mahsulot'
    product_link.admin_order_field = 'product__title'

    def conversion_hint(self, obj):
        if obj.views and obj.purchases:
            pct = min(100, round(100 * obj.purchases / obj.views, 1))
            return format_html('<span style="color:green;">{}%</span>', pct)
        return '—'
    conversion_hint.short_description = 'Konversiya'

    def changelist_view(self, request, extra_context=None):
        extra_context = extra_context or {}
        qs = self.get_queryset(request)
        extra_context['analytics_summary'] = qs.aggregate(
            total_views=Sum('views'),
            total_favorites=Sum('favorites'),
            total_cart_adds=Sum('cart_additions'),
            total_purchases=Sum('purchases'),
        )
        return super().changelist_view(request, extra_context)


@admin.register(Wishlist)
class WishlistAdmin(admin.ModelAdmin):
    list_display = ('id', 'session_id', 'product', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('session_id', 'product__title')
    raw_id_fields = ('product',)
    date_hierarchy = 'created_at'

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('product', 'product__category')


class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0
    raw_id_fields = ('product',)


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ('id', 'session_id', 'created_at')
    list_filter = ('created_at',)
    inlines = [CartItemInline]
    search_fields = ('session_id',)


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'cart', 'product', 'quantity', 'created_at')
    list_filter = ('cart',)
    raw_id_fields = ('cart', 'product')


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'phone', 'total_price', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('name', 'phone')
    raw_id_fields = ('cart',)
    date_hierarchy = 'created_at'
    list_editable = ('status',)
    readonly_fields = ('cart', 'total_price', 'created_at')


@admin.register(NewsletterSubscriber)
class NewsletterSubscriberAdmin(admin.ModelAdmin):
    list_display = ('email', 'created_at')
    search_fields = ('email',)
    readonly_fields = ('created_at',)
    date_hierarchy = 'created_at'
    list_per_page = 50
