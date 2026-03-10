from django.db import models
from django.conf import settings


class Profile(models.Model):
    """Extended user profile: name, phone. User has email and password."""
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="profile",
        primary_key=True,
    )
    name = models.CharField(max_length=255, verbose_name="Ism", blank=True)
    phone = models.CharField(max_length=50, verbose_name="Telefon", blank=True)

    class Meta:
        verbose_name = "Profil"
        verbose_name_plural = "Profillar"

    def __str__(self):
        return self.name or self.user.email
