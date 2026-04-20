from django.shortcuts import get_object_or_404

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics

from rest_framework_simplejwt.tokens import RefreshToken

from django.contrib.auth.models import User

from .models import Book, BookOffer, Review, Request, Profile
from .serializers import (
    BookSerializer,
    BookOfferSerializer,
    ReviewSerializer,
    RequestSerializer,
    ProfileSerializer,
    RegisterSerializer
)


class BookListCreateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        books = Book.objects.all()

        title = request.GET.get('title')
        if title:
            books = books.filter(title__icontains=title)

        author = request.GET.get('author')
        if author:
            books = books.filter(author__icontains=author)

        return Response(BookSerializer(books, many=True).data)

    def post(self, request):
        serializer = BookSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(owner=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


class BookDetailAPIView(APIView):

    def get(self, request, id):
        book = get_object_or_404(Book, id=id)

        return Response({
            "book": BookSerializer(book).data,
            "offers": BookOfferSerializer(book.offers.all(), many=True).data,
            "reviews": ReviewSerializer(book.reviews.all(), many=True).data,
        })

    def patch(self, request, id):
        book = get_object_or_404(Book, id=id)
        serializer = BookSerializer(book, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=400)

    def delete(self, request, id):
        book = get_object_or_404(Book, id=id)
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
    permission_classes = []

    def patch(self, request, id):
        req = get_object_or_404(Request, id=id)

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



class MyBooksAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        books = Book.objects.filter(owner=request.user)
        return Response(BookSerializer(books, many=True).data)



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
