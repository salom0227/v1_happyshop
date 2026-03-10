from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import ServicePage
from .serializers import ServicePageSerializer, ServiceContactSerializer
from .telegram import send_service_contact_to_telegram


class ServicePageListView(generics.ListAPIView):
    """GET /api/services/ — active service pages for frontend."""
    queryset = (
        ServicePage.objects.filter(is_active=True)
        .prefetch_related("gallery_images")
        .order_by("order", "id")
    )
    serializer_class = ServicePageSerializer


class ServicePageDetailView(generics.RetrieveAPIView):
    """GET /api/services/<slug>/ — single service page by slug."""
    queryset = (
        ServicePage.objects.filter(is_active=True).prefetch_related("gallery_images")
    )
    serializer_class = ServicePageSerializer
    lookup_field = "slug"
    lookup_url_kwarg = "slug"


class ServiceContactView(APIView):
    """POST /api/services/contact/ — Telegram ga xizmat bo'yicha bog'lanish signali.

    Bu foydalanuvchi Telegram tugmasini bosganda backend orqali keladi.
    """

    def post(self, request):
        ser = ServiceContactSerializer(data=request.data)
        if not ser.is_valid():
            return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)
        data = ser.validated_data
        service = ServicePage.objects.filter(slug=data["service_slug"]).first()
        send_service_contact_to_telegram(service, data)
        return Response({"status": "ok"}, status=status.HTTP_200_OK)
