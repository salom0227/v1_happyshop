import uuid
import requests
import os
from django.contrib.admin.views.decorators import staff_member_required
from django.http import JsonResponse
from django.views.decorators.http import require_POST

@staff_member_required
@require_POST
def upload_image(request):
    file = request.FILES.get('file')
    folder = request.POST.get('folder', 'misc')
    if not file:
        return JsonResponse({'error': 'Fayl yuq'}, status=400)
    ext = file.name.split('.')[-1]
    filename = f"{uuid.uuid4().hex}.{ext}"
    path = f"{folder}/{filename}"

    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_SECRET_KEY")

    url = f"{supabase_url}/storage/v1/object/media/{path}"
    r = requests.post(url, headers={
        'Authorization': f"Bearer {supabase_key}",
        'Content-Type': file.content_type,
        'x-upsert': 'true',
    }, data=file.read())
    if r.status_code in [200, 201]:
        public_url = f"{supabase_url}/storage/v1/object/public/media/{path}"
        return JsonResponse({'url': public_url})
    return JsonResponse({'error': r.text}, status=400)
