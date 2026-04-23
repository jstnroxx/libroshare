from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAuthenticatedOrReadOnly
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from .models import Book, BookOffer, Request, Profile, Review, UserReview
from .serializers import (
    BookSerializer, RequestSerializer, ProfileSerializer,
    RegisterSerializer, BookReviewSerializer, ReviewCreateSerializer
)


class MyShelfView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        my_offers = BookOffer.objects.filter(owner=request.user).select_related('book')
        # Return unique books that the user has offers for
        seen = set()
        books = []
        for offer in my_offers:
            if offer.book_id not in seen:
                seen.add(offer.book_id)
                books.append(offer.book)
        return Response(BookSerializer(books, many=True).data)


class AddInstanceView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        book_id = request.data.get('book_id')
        try:
            book = Book.objects.get(id=book_id)
            BookOffer.objects.create(
                book=book,
                owner=request.user,
                condition=request.data.get('condition', 'Good')
            )
            return Response({"message": "Instance added"}, status=201)
        except Book.DoesNotExist:
            return Response({"error": "Book not found"}, status=404)


class BookListCreateAPIView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request):
        genre = request.query_params.get('genre')
        books = Book.objects.all()
        if genre:
            books = books.filter(genre=genre)
        return Response(BookSerializer(books, many=True).data)

    def post(self, request):
        serializer = BookSerializer(data=request.data)
        if serializer.is_valid():
            book = serializer.save()
            BookOffer.objects.create(
                book=book,
                owner=request.user,
                condition=request.data.get("condition", "Good")
            )
            return Response(BookSerializer(book).data, status=status.HTTP_201_CREATED)
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


class SimilarBooksView(APIView):
    def get(self, request):
        genre = request.query_params.get('genre')
        exclude_id = request.query_params.get('exclude')
        books = Book.objects.filter(genre=genre)
        if exclude_id:
            books = books.exclude(id=exclude_id)
        books = books[:4]
        return Response(BookSerializer(books, many=True).data)


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
            req.status = status_value
            req.save()
            # If approved, mark offer as unavailable
            if status_value == "approved":
                req.offer.is_available = False
                req.offer.total_lends += 1
                req.offer.save()
            return Response({"message": "updated"})
        return Response({"error": "Invalid status"}, status=400)


class ProfileAPIView(APIView):
    def get_permissions(self):
        if self.request.method == 'PATCH':
            return [IsAuthenticated()]
        return [AllowAny()]

    def get(self, request, id=None):
        if id:
            profile = get_object_or_404(Profile, user_id=id)
        else:
            if not request.user.is_authenticated:
                return Response({"error": "Authentication required"}, status=401)
            profile = request.user.profile
        return Response(ProfileSerializer(profile).data)

    def patch(self, request, id=None):
        profile = request.user.profile
        # Allow updating bio and location
        for field in ['bio', 'location']:
            if field in request.data:
                setattr(profile, field, request.data[field])
        profile.save()
        return Response(ProfileSerializer(profile).data)


class RegisterAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            # Return tokens right after registration so user is logged in immediately
            from rest_framework_simplejwt.tokens import RefreshToken
            refresh = RefreshToken.for_user(user)
            return Response({
                "username": user.username,
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            }, status=201)
        return Response(serializer.errors, status=400)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            token = RefreshToken(request.data["refresh"])
            token.blacklist()
            return Response({"message": "logged out"})
        except Exception:
            return Response({"error": "invalid token"}, status=400)


class ReviewAPIView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request):
        reviews = Review.objects.all()
        return Response(BookReviewSerializer(reviews, many=True).data)

    def post(self, request):
        serializer = ReviewCreateSerializer(data=request.data)
        if serializer.is_valid():
            offer = get_object_or_404(BookOffer, id=serializer.validated_data["offer_id"])
            Review.objects.create(
                offer=offer,
                reviewer=request.user,
                rating=serializer.validated_data["rating"],
                comment=serializer.validated_data["comment"]
            )
            return Response({"message": "Review created"}, status=201)
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
