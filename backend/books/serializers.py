from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Book, BookOffer, Review, Request, Profile


class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = '__all__'
        extra_kwargs = {
            'owner': {'read_only': True}
        }

class BookOfferSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookOffer
        fields = '__all__'


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'


class RequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Request
        fields = '__all__'
        extra_kwargs = {
            'requester': {'read_only': True}
        }


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = '__all__'
        
    
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()
  

class ReviewCreateSerializer(serializers.Serializer):
    book_id = serializers.IntegerField()
    rating = serializers.IntegerField()
    comment = serializers.CharField()  
    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("Rating must be 1-5")
        return value
    
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password']

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)