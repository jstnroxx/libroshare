from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User

from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Book, Request, Profile, Review
from .serializers import (
    BookSerializer,
    RequestSerializer,
    ProfileSerializer,
    RegisterSerializer,
    ReviewSerializer,
    ReviewCreateSerializer
)


class BookListCreateAPIView(APIView):

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAuthenticated()]
        return [AllowAny()]

    def get(self, request):
        books = Book.objects.all()
        return Response(BookSerializer(books, many=True).data)

    def post(self, request):
        permission_classes = [AllowAny]
        serializer = BookSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(owner=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


class BookDetailAPIView(APIView):

    def get(self, request, id):
        book = get_object_or_404(Book, id=id)
        return Response(BookSerializer(book).data)

    def put(self, request, id):
        book = get_object_or_404(Book, id=id, owner=request.user)
        serializer = BookSerializer(book, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=400)

    def delete(self, request, id):
        book = get_object_or_404(Book, id=id, owner=request.user)
        book.delete()
        return Response(status=204)



class RequestAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "incoming": RequestSerializer(
                Request.objects.filter(book__owner=request.user),
                many=True
            ).data,
            "outgoing": RequestSerializer(
                Request.objects.filter(requester=request.user),
                many=True
            ).data
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
        if req.book.owner != request.user:
            return Response({"error": "Forbidden"}, status=403)

        status_value = request.data.get("status")
        if status_value not in ["approved", "rejected"]:
            return Response({"error": "Invalid status"}, status=400)

        req.status = status_value
        req.save()

        return Response({"message": "updated"})



class ProfileAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile, _ = Profile.objects.get_or_create(user=request.user)
        return Response(ProfileSerializer(profile).data)



class RegisterAPIView(APIView):
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
    permission_classes = [IsAuthenticated]

    def get(self, request):
        reviews = Review.objects.all()
        return Response(ReviewSerializer(reviews, many=True).data)

    def post(self, request):
        serializer = ReviewCreateSerializer(data=request.data)

        if serializer.is_valid():
            book = get_object_or_404(Book, id=serializer.validated_data["book_id"])

            Review.objects.create(
                book=book,
                reviewer=request.user,
                rating=serializer.validated_data["rating"],
                comment=serializer.validated_data["comment"]
            )

            return Response({"message": "created"}, status=201)

        return Response(serializer.errors, status=400)
    
    
@api_view(['GET'])
def book_stats(request):
    return Response({
        "total_books": Book.objects.count(),
        "available_books": Book.objects.filter(available=True).count(),
        "users": User.objects.count()
    })


@api_view(['GET'])
def user_dashboard(request):
    if not request.user.is_authenticated:
        return Response({"error": "Not authenticated"}, status=401)

    return Response({
        "username": request.user.username,
        "my_books": Book.objects.filter(owner=request.user).count(),
        "sent_requests": Request.objects.filter(requester=request.user).count(),
        "incoming_requests": Request.objects.filter(book__owner=request.user).count()
    })