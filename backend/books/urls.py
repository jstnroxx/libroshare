from django.urls import path
from .views import (
    BookListCreateAPIView,
    BookDetailAPIView,
    RequestAPIView,
    RequestActionAPIView,
    LogoutView,
    MyBooksAPIView,
    ProfileAPIView,
    RegisterAPIView
)

urlpatterns = [
    path('books/', BookListCreateAPIView.as_view()),
    path('books/<int:id>/', BookDetailAPIView.as_view()),
    path('requests/', RequestAPIView.as_view()),
    path('requests/<int:id>/', RequestActionAPIView.as_view()),
    path('my-books/', MyBooksAPIView.as_view()),
    path('profile/', ProfileAPIView.as_view()),
    path('register/', RegisterAPIView.as_view()),
    path('logout/', LogoutView.as_view()),
]