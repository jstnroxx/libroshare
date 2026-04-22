from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAuthenticatedOrReadOnly
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework import status
from .models import Book, BookOffer, Request, Profile, Review, UserReview
from .serializers import *

from rest_framework.permissions import IsAuthenticated

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Book, BookOffer
from .serializers import BookSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Book, BookOffer
from .serializers import BookSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Book, BookOffer
from .serializers import BookSerializer

class MyShelfView(APIView):
    permission_classes = [IsAuthenticated] # Только для залогиненных

    def get(self, request):
        # Находим офферы юзера и берем связанные с ними книги
        my_offers = BookOffer.objects.filter(owner=request.user)
        books = [offer.book for offer in my_offers]
        
        serializer = BookSerializer(books, many=True)
        return Response(serializer.data)
    
class AddInstanceView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        book_id = request.data.get('book_id')
        if not book_id:
            return Response({"error": "ID книги обязателен"}, status=400)
            
        book = Book.objects.get(id=book_id)
        
        # Создаем запись о владении (оффер)
        BookOffer.objects.create(
            book=book,
            owner=request.user,
            condition=request.data.get('condition', 'Good')
        )
        return Response({"message": "Книга добавлена на полку"}, status=201)
    


class BookListCreateAPIView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get(self, request):
        books = Book.objects.all()
        return Response(BookSerializer(books, many=True).data)

    def post(self, request):
        serializer = BookSerializer(data=request.data)
        
        if serializer.is_valid():
            # 1. Сохраняем саму книгу
            book = serializer.save()
            
            # 2. Создаем оффер (связываем книгу с юзером и состоянием)
            BookOffer.objects.create(
                book=book,
                owner=request.user,
                condition=request.data.get("condition", "Good")
            )
            
            # ВАЖНО: Этот return должен быть ВНУТРИ if
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        # ВАЖНО: Этот return должен быть ВНЕ if (сработает, если данные невалидны)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class BookDetailAPIView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get(self, request, id):
        book = get_object_or_404(Book, id=id)
        return Response(BookSerializer(book).data)

    def put(self, request, id):
        book = get_object_or_404(Book, id=id)
        if not BookOffer.objects.filter(book=book, owner=request.user).exists():
            return Response({"error": "Forbidden"}, status=403)
        serializer = BookSerializer(book, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

class RequestAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "incoming": RequestSerializer(Request.objects.filter(offer__owner=request.user), many=True).data,
            "outgoing": RequestSerializer(Request.objects.filter(requester=request.user), many=True).data
        })

    def post(self, request):
        serializer = RequestSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(requester=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

class RequestActionAPIView(APIView):
    permission_classes = [IsAuthenticated] 

    def patch(self, request, id):
        req = get_object_or_404(Request, id=id)
        if req.offer.owner != request.user:
            return Response({"error": "Forbidden"}, status=403)

        status_value = request.data.get("status")
        if status_value in ["approved", "rejected"]:
            req.resolved_at = timezone.now()
            req.status = status_value
            req.save()
            return Response({"message": "updated"})
        return Response({"error": "Invalid status"}, status=400)

class ProfileAPIView(APIView):
    def get(self, request, id=None):
        if id:
            profile = get_object_or_404(Profile, user_id=id)
        else:
            profile = request.user.profile
        return Response(ProfileSerializer(profile).data)

class RegisterAPIView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        try:
            token = RefreshToken(request.data["refresh"])
            token.blacklist()
            return Response({"message": "logged out"})
        except:
            return Response({"error": "invalid token"}, status=400)


class ReviewAPIView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request):
        # Получаем все отзывы на книги (BookOffer)
        reviews = Review.objects.all()
        return Response(BookReviewSerializer(reviews, many=True).data)

    def post(self, request):
        # Используем специальный сериализатор для создания отзыва
        serializer = ReviewCreateSerializer(data=request.data)

        if serializer.is_valid():
            # Находим конкретное предложение (экземпляр) книги по ID
            offer = get_object_or_404(BookOffer, id=serializer.validated_data["offer_id"])

            # Создаем отзыв в базе
            Review.objects.create(
                offer=offer,
                reviewer=request.user,
                rating=serializer.validated_data["rating"],
                comment=serializer.validated_data["comment"]
            )

            return Response({"message": "Review created successfully"}, status=201)

        return Response(serializer.errors, status=400)
@api_view(['GET'])
def book_stats(request):
    return Response({
        "total_books": Book.objects.count(),
        "available_books": BookOffer.objects.filter(is_available=True).count(),
        "users": User.objects.count()
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_dashboard(request):
    return Response({
        "username": request.user.username,
        "my_books": BookOffer.objects.filter(owner=request.user).count(),
        "sent_requests": Request.objects.filter(requester=request.user).count(),
        "incoming_requests": Request.objects.filter(offer__owner=request.user).count()
    })