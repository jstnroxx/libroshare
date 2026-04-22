from django.urls import path
from . import views 

urlpatterns = [
    path('books/', views.BookListCreateAPIView.as_view()),
    path('books/<int:id>/', views.BookDetailAPIView.as_view()),
    path('requests/', views.RequestAPIView.as_view()),
    path('requests/action/<int:id>/', views.RequestActionAPIView.as_view()),
    path('profile/', views.ProfileAPIView.as_view()),
    path('profile/<int:id>/', views.ProfileAPIView.as_view()),
    path('register/', views.RegisterAPIView.as_view()),
    path('logout/', views.LogoutView.as_view()),
    path('reviews/', views.ReviewAPIView.as_view()),
    path('stats/', views.book_stats),
    path('dashboard/', views.user_dashboard),
    
    path('my-shelf/', views.MyShelfView.as_view(), name='my-shelf'),
    path('add-instance/', views.AddInstanceView.as_view(), name='add-instance'),
]