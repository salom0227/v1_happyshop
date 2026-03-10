"""
Custom AdminSite with dashboard statistics and charts.
"""
import json
from django.contrib import admin
from django.contrib.admin import AdminSite
from django.utils import timezone
from django.db.models import Sum, Count
from django.db.models.functions import TruncDate


class HappyShopAdminSite(AdminSite):
    site_header = "Happy Shop Admin"
    site_title = "Happy Shop"
    index_title = "Boshqaruv paneli"
    index_template = "admin/dashboard.html"

    def index(self, request, extra_context=None):
        extra_context = extra_context or {}
        from django.contrib.auth import get_user_model
        from store.models import Product, Order, Wishlist, Category, ProductAnalytics

        User = get_user_model()
        today = timezone.now().date()

        # Stats cards
        extra_context["stat_total_products"] = Product.objects.count()
        extra_context["stat_total_orders"] = Order.objects.count()
        extra_context["stat_total_users"] = User.objects.count()
        extra_context["stat_total_revenue"] = (
            Order.objects.aggregate(s=Sum("total_price"))["s"] or 0
        )
        extra_context["stat_total_wishlist"] = Wishlist.objects.count()
        extra_context["stat_total_categories"] = Category.objects.count()

        # Recent orders (last 10)
        extra_context["recent_orders"] = (
            Order.objects.select_related("cart")
            .order_by("-created_at")[:10]
        )

        # Top selling products
        extra_context["top_selling_products"] = (
            Product.objects.filter(sold_count__gt=0)
            .select_related("category")
            .order_by("-sold_count")[:10]
        )

        # Most viewed (from Product or ProductAnalytics)
        extra_context["most_viewed_products"] = (
            Product.objects.filter(view_count__gt=0)
            .select_related("category")
            .order_by("-view_count")[:10]
        )

        # Newest users
        extra_context["newest_users"] = User.objects.order_by("-date_joined")[:10]

        # Chart data: sales (revenue) last 7 days
        seven_days_ago = today - timezone.timedelta(days=7)
        orders_by_day = list(
            Order.objects.filter(created_at__date__gte=seven_days_ago)
            .annotate(day=TruncDate("created_at"))
            .values("day")
            .annotate(total=Sum("total_price"), count=Count("id"))
            .order_by("day")
        )
        days_labels = []
        sales_data = []
        orders_count_data = []
        for d in range(7, -1, -1):
            day = today - timezone.timedelta(days=d)
            days_labels.append(day.strftime("%d.%m"))
            row = next((o for o in orders_by_day if o["day"] == day), None)
            sales_data.append(float(row["total"] or 0) if row else 0)
            orders_count_data.append(row["count"] or 0 if row else 0)
        extra_context["chart_sales_labels"] = json.dumps(days_labels)
        extra_context["chart_sales_data"] = json.dumps(sales_data)
        extra_context["chart_orders_labels"] = json.dumps(days_labels)
        extra_context["chart_orders_data"] = json.dumps(orders_count_data)

        # Top 5 selling for bar chart
        top5 = list(
            Product.objects.filter(sold_count__gt=0)
            .order_by("-sold_count")
            .values_list("title", "sold_count")[:5]
        )
        top5_labels = [t[0][:20] + "…" if len(t[0]) > 20 else t[0] for t in top5]
        extra_context["chart_top_products_labels"] = json.dumps(top5_labels)
        extra_context["chart_top_products_data"] = json.dumps([t[1] for t in top5])

        # Most viewed 5 for bar chart
        top5views = list(
            Product.objects.filter(view_count__gt=0)
            .order_by("-view_count")
            .values_list("title", "view_count")[:5]
        )
        views_labels = [t[0][:20] + "…" if len(t[0]) > 20 else t[0] for t in top5views]
        extra_context["chart_views_labels"] = json.dumps(views_labels)
        extra_context["chart_views_data"] = json.dumps([t[1] for t in top5views])

        return super().index(request, extra_context)


# Use this as the default admin site so that index uses our dashboard.
admin_site = HappyShopAdminSite(name="admin")

# Ensure store admin runs its admin_site.register() calls
import store.admin  # noqa: F401

# Register auth and other app models so they appear in our admin
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.contrib.auth.admin import UserAdmin as AuthUserAdmin, GroupAdmin

User = get_user_model()
admin_site.register(User, AuthUserAdmin)
admin_site.register(Group, GroupAdmin)

from users.models import Profile
from users.admin import ProfileAdmin
from services.models import ServicePage
from services.admin import ServicePageAdmin

admin_site.register(Profile, ProfileAdmin)
admin_site.register(ServicePage, ServicePageAdmin)
