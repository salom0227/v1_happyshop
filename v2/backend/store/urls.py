from django.urls import path
from . import views

urlpatterns = [
    path('categories/', views.CategoryList.as_view()),
    path('categories/<slug:slug>/products/', views.CategoryProductList.as_view()),
    path('promo-categories/', views.PromoCategoryList.as_view()),
    path('promo-categories/<slug:slug>/products/', views.PromoCategoryProductList.as_view()),
    path('banners/', views.BannerList.as_view()),
    path('banners/<int:pk>/products/', views.BannerProductsView.as_view()),
    path('products/', views.ProductList.as_view()),
    path('products/search/', views.ProductSearchList.as_view()),
    path('products/view/', views.ProductViewView.as_view()),
    path('products/<slug:slug>/', views.ProductDetail.as_view()),
    path('featured-products/', views.FeaturedProductList.as_view()),
    path('new-products/', views.NewProductsList.as_view()),
    path('best-sellers/', views.BestSellersList.as_view()),
    # Cart:
    path('cart/', views.CartDetailView.as_view()),
    path('cart/add/', views.CartAddView.as_view()),
    path('cart/update/', views.CartUpdateView.as_view()),
    path('cart/remove/', views.CartRemoveView.as_view()),
    path('cart/<str:session_id>/', views.CartDetailView.as_view()),
    # Order
    path('order/', views.OrderCreateView.as_view()),
    # Newsletter (footer «Yangiliklardan xabardor»)
    path('newsletter/', views.NewsletterSubscribeView.as_view()),
    # Wishlist
    path('wishlist/', views.WishlistListView.as_view()),
    path('wishlist/add/', views.WishlistAddView.as_view()),
    path('wishlist/remove/', views.WishlistRemoveView.as_view()),
]
