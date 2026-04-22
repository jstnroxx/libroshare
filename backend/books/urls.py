from django.urls import path
from .views import *

urlpatterns = [
    path('books/', BookListCreateAPIView.as_view()),
    path('books/<int:id>/', BookDetailAPIView.as_view()),

    path('requests/', RequestAPIView.as_view()),
    path('requests/action/<int:id>/', RequestActionAPIView.as_view()),

    path('profile/', ProfileAPIView.as_view()),
    path('profile/<int:id>/', ProfileAPIView.as_view()),
    path('register/', RegisterAPIView.as_view()),
    path('logout/', LogoutView.as_view()),

    path('reviews/', ReviewAPIView.as_view()),

    path('stats/', book_stats),
    path('dashboard/', user_dashboard),
]