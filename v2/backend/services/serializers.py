from rest_framework import serializers
from .models import ServicePage, ServicePageImage


class ServicePageImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = ServicePageImage
        fields = ["image", "caption", "order"]

    def _request_url(self, file_field):
        if not file_field:
            return None
        request = self.context.get("request")
        if request:
            return request.build_absolute_uri(file_field.url)
        return file_field.url

    def get_image(self, obj):
        return self._request_url(obj.image)


class ServicePageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    images = serializers.SerializerMethodField()
    gallery = ServicePageImageSerializer(source="gallery_images", many=True, read_only=True)

    class Meta:
        model = ServicePage
        fields = [
            "id",
            "title",
            "slug",
            "content",
            "icon",
            "image",
            "images",
            "gallery",
            "is_active",
            "order",
        ]

    def _request_url(self, file_field):
        if not file_field:
            return None
        request = self.context.get("request")
        if request:
            return request.build_absolute_uri(file_field.url)
        return file_field.url

    def get_image(self, obj):
        if obj.image:
            return self._request_url(obj.image)
        first = obj.gallery_images.first() if hasattr(obj, "gallery_images") else None
        if first and first.image:
            return self._request_url(first.image)
        return None

    def get_images(self, obj):
        if not hasattr(obj, "gallery_images"):
            return []
        return [
            self._request_url(img.image)
            for img in obj.gallery_images.all()
            if img.image
        ]


class ServiceContactSerializer(serializers.Serializer):
    service_slug = serializers.SlugField(max_length=255)
    service_title = serializers.CharField(max_length=255)
    message = serializers.CharField(max_length=1000, required=False, allow_blank=True)
    source = serializers.CharField(max_length=255, required=False, allow_blank=True)
