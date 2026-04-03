import uuid
import requests
from django.conf import settings
from django.contrib.admin.views.decorators import staff_member_required
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
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
    url = f"{settings.AWS_S3_ENDPOINT_URL}/storage/v1/object/media/{path}"
    r = requests.post(url, headers={
        'Authorization': f"Bearer {settings.AWS_SECRET_ACCESS_KEY}",
        'Content-Type': file.content_type,
        'x-upsert': 'true',
    }, data=file.read())
    if r.status_code in [200, 201]:
        public_url = f"{settings.AWS_S3_ENDPOINT_URL}/storage/v1/object/public/media/{path}"
        return JsonResponse({'url': public_url})
    return JsonResponse({'error': r.text}, status=400)
