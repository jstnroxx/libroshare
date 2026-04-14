from django.urls import path
from .views import BookListCreateAPIView

urlpatterns = [
    path('books/', BookListCreateAPIView.as_view()),
]