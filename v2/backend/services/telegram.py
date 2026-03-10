import os
import logging
from django.utils import timezone

logger = logging.getLogger(__name__)


def send_service_contact_to_telegram(service, payload: dict) -> bool:
  """
  Xizmat sahifasidan bog'lanish tugmasi bosilganda Telegram ga xabar yuboradi.

  Sozlamalar: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID (.env).
  """
  import urllib.request
  import urllib.parse

  from django.conf import settings

  token = (
      getattr(settings, "TELEGRAM_BOT_TOKEN", None)
      or os.environ.get("TELEGRAM_BOT_TOKEN", "")
      or ""
  ).strip()
  chat_id = (
      getattr(settings, "TELEGRAM_CHAT_ID", None)
      or os.environ.get("TELEGRAM_CHAT_ID", "")
      or os.environ.get("ADMIN_CHAT_ID", "")
      or ""
  ).strip()
  if not token or not chat_id:
      logger.warning(
          "TELEGRAM_BOT_TOKEN yoki TELEGRAM_CHAT_ID berilmagan; xizmat bog'lanish xabari yuborilmaydi"
      )
      return False

  slug = payload.get("service_slug") or (getattr(service, "slug", None) or "—")
  title = payload.get("service_title") or (getattr(service, "title", None) or slug)
  message = (payload.get("message") or "").strip()
  source = (payload.get("source") or "xizmat sahifasidan Telegram tugmasi").strip()

  now = timezone.localtime()
  dt_str = now.strftime("%Y-%m-%d %H:%M")

  lines = [
      "📨 XIZMAT BO'YICHA BOG'LANISH",
      "",
      f"📄 Xizmat: {title}",
      f"🔗 Sahifa: /xizmatlar/{slug}",
      f"ℹ️ Manba: {source}",
  ]
  if message:
      lines.append("")
      lines.append("💬 Xabar:")
      lines.append(message)
  lines.append("")
  lines.append(f"⏰ Sana: {dt_str}")

  text = "\n".join(lines)

  url = f"https://api.telegram.org/bot{token}/sendMessage"
  try:
      data = urllib.parse.urlencode(
          {
              "chat_id": chat_id,
              "text": text,
          }
      ).encode()
      req = urllib.request.Request(url, data=data, method="POST")
      req.add_header("Content-Type", "application/x-www-form-urlencoded")
      with urllib.request.urlopen(req, timeout=10) as resp:
          if resp.status != 200:
              logger.error("Telegram sendMessage status %s", resp.status)
              return False
      return True
  except Exception as e:
      logger.exception("Xizmat bog'lanish xabarini Telegram ga yuborishda xato: %s", e)
      return False

