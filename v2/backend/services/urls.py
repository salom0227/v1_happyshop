from django.urls import path
from . import views

urlpatterns = [
    path("", views.ServicePageListView.as_view()),
    path("contact/", views.ServiceContactView.as_view()),
    path("<slug:slug>/", views.ServicePageDetailView.as_view()),
]
