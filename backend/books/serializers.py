from rest_framework import serializers
from .models import Book, Request


class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = '__all__'


class RequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Request
        fields = '__all__'


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()


class ReviewSerializer(serializers.Serializer):
    rating = serializers.IntegerField()
    comment = serializers.CharField()