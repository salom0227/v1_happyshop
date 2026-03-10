import os
import logging
from django.db import transaction
from django.db.models import F
from django.utils import timezone

logger = logging.getLogger(__name__)


def record_product_view(product):
    """Call when product detail page is opened. Thread-safe."""
    from .models import ProductAnalytics
    try:
        with transaction.atomic():
            obj, _ = ProductAnalytics.objects.get_or_create(
                product=product,
                defaults={'views': 0, 'favorites': 0, 'cart_additions': 0, 'purchases': 0},
            )
            ProductAnalytics.objects.filter(product=product).update(
                views=F('views') + 1,
                last_viewed_at=timezone.now(),
            )
    except Exception as e:
        logger.warning('record_product_view failed: %s', e)


def record_product_cart_add(product):
    """Call when product is added to cart. Thread-safe."""
    from .models import ProductAnalytics
    try:
        with transaction.atomic():
            ProductAnalytics.objects.get_or_create(
                product=product,
                defaults={'views': 0, 'favorites': 0, 'cart_additions': 0, 'purchases': 0},
            )
            ProductAnalytics.objects.filter(product=product).update(
                cart_additions=F('cart_additions') + 1,
            )
    except Exception as e:
        logger.warning('record_product_cart_add failed: %s', e)


def record_product_purchase(product, quantity=1):
    """Call when product is purchased (order created). Thread-safe."""
    from .models import ProductAnalytics
    try:
        with transaction.atomic():
            ProductAnalytics.objects.get_or_create(
                product=product,
                defaults={'views': 0, 'favorites': 0, 'cart_additions': 0, 'purchases': 0},
            )
            ProductAnalytics.objects.filter(product=product).update(
                purchases=F('purchases') + quantity,
            )
    except Exception as e:
        logger.warning('record_product_purchase failed: %s', e)


def _fmt_sum(n):
    """Raqamni bo'shliq bilan formatlash (masalan: 1 150 000)."""
    try:
        x = int(float(n))
        return f"{x:,}".replace(",", " ")
    except (TypeError, ValueError):
        return str(n)


def send_order_to_telegram(order, cart_items):
    """
    Buyurtmani Telegram ga chek sifatida yuboradi.
    Sozlamalar: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID (.env).
    Shaxsiy chat_id (masalan 5269410357) bo'lsa, avval botga /start yuborilgan bo'lishi kerak.
    """
    import json
    import urllib.error
    import urllib.parse
    import urllib.request

    from django.conf import settings
    token = (getattr(settings, "TELEGRAM_BOT_TOKEN", None) or os.environ.get("TELEGRAM_BOT_TOKEN", "") or "").strip()
    chat_id = (getattr(settings, "TELEGRAM_CHAT_ID", None) or os.environ.get("TELEGRAM_CHAT_ID", "") or os.environ.get("ADMIN_CHAT_ID", "") or "").strip()
    if not token or not chat_id:
        logger.warning("TELEGRAM_BOT_TOKEN yoki TELEGRAM_CHAT_ID berilmagan; Telegram ga yuborilmaydi")
        return False

    lines = [
        "🛒 YANGI BUYURTMA",
        "",
        "👤 Mijoz: " + (order.name or "—"),
        "📞 Telefon: " + (order.phone or "—"),
        "📍 Manzil: " + ((order.delivery_address or "").strip() or "—"),
        "",
        "📦 Buyurtma:",
        "",
    ]
    for item in cart_items:
        title = item.product.title or "Mahsulot"
        qty = item.quantity
        price_num = int(float(item.product.price)) if item.product.price is not None else 0
        line_num = price_num * qty
        lines.append("• " + title)
        lines.append("  Soni: " + str(qty))
        lines.append("  Narxi: " + _fmt_sum(price_num))
        lines.append("  Jami: " + _fmt_sum(line_num))
        note = (getattr(item.product, "order_note", None) or "").strip()
        if note:
            lines.append("  📝 " + note)
        lines.append("")
    total_num = int(float(order.total_price)) if order.total_price is not None else 0
    lines.append("💰 Umumiy summa:")
    lines.append(_fmt_sum(total_num) + " so'm")
    text = "\n".join(lines)

    url = f"https://api.telegram.org/bot{token}/sendMessage"
    try:
        data = urllib.parse.urlencode({
            "chat_id": chat_id,
            "text": text,
        }).encode()
        req = urllib.request.Request(url, data=data, method="POST")
        req.add_header("Content-Type", "application/x-www-form-urlencoded")
        logger.info("Telegram: buyurtma xabarini yuborish (chat_id=%s)", chat_id)
        with urllib.request.urlopen(req, timeout=10) as resp:
            if resp.status != 200:
                body = resp.read().decode("utf-8", errors="replace")
                logger.error("Telegram sendMessage status %s: %s", resp.status, body)
                return False
        logger.info("Telegram: buyurtma xabari muvaffaqiyatli yuborildi")
        return True
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace")
        try:
            err = json.loads(body)
            desc = err.get("description", body)
        except Exception:
            desc = body
        logger.error("Telegram API xatosi (%s): %s", e.code, desc)
        if "can't initiate conversation" in (desc or "").lower() or "have not started" in (desc or "").lower():
            logger.warning("Botga avval /start yuboring (shaxsiy chat_id uchun majburiy)")
        return False
    except Exception as e:
        logger.exception("Telegram ga xabar yuborishda xato: %s", e)
        return False

