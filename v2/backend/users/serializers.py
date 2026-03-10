from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Profile

User = get_user_model()


class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True, min_length=8, style={"input_type": "password"})
    name = serializers.CharField(max_length=255, required=False, allow_blank=True)
    phone = serializers.CharField(max_length=50, required=False, allow_blank=True)

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("Bu email allaqachon ro'yxatdan o'tgan.")
        return value.lower()

    def create(self, validated_data):
        email = validated_data["email"]
        password = validated_data["password"]
        name = validated_data.get("name", "")
        phone = validated_data.get("phone", "")
        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
        )
        Profile.objects.create(user=user, name=name, phone=phone)
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True, style={"input_type": "password"})


class ProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = Profile
        fields = ["name", "phone", "email"]

    def update(self, instance, validated_data):
        instance.name = validated_data.get("name", instance.name)
        instance.phone = validated_data.get("phone", instance.phone)
        instance.save()
        return instance
