from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Book, BookOffer, Review, Request, Profile, UserReview

class BookReviewSerializer(serializers.ModelSerializer):
    reviewerId = serializers.IntegerField(source='reviewer.id', read_only=True)
    reviewerName = serializers.CharField(source='reviewer.username', read_only=True)
    date = serializers.DateTimeField(source='created_at', read_only=True)

    class Meta:
        model = Review
        fields = ['reviewerId', 'reviewerName', 'rating', 'comment', 'date']

class BookSerializer(serializers.ModelSerializer):
    instances = serializers.SerializerMethodField()
    totalBorrows = serializers.SerializerMethodField()

    class Meta:
        model = Book
        fields = ['id', 'title', 'author', 'genre', 'description', 'year', 'cover', 'available', 'instances', 'totalBorrows']

    def get_instances(self, obj):
        return [{
            "id": o.id,
            "ownerId": o.owner.id,
            "ownerName": o.owner.username,
            "ownerRating": getattr(o.owner.profile, 'rating', 0) if hasattr(o.owner, 'profile') else 0,
            "condition": o.condition,
            "realPhotos": o.real_photos or [],
            "isAvailable": o.is_available,
            "pendingRequestsCount": o.requests.filter(status="pending").count(),
            "instanceReviews": BookReviewSerializer(o.reviews.all(), many=True).data
        } for o in obj.offers.all()]

    def get_totalBorrows(self, obj):
        return sum(o.total_lends for o in obj.offers.all())

class UserReviewSerializer(serializers.ModelSerializer):
    author = serializers.CharField(source='reviewer.username', read_only=True)
    date = serializers.DateTimeField(source='created_at', read_only=True)
    class Meta:
        model = UserReview
        fields = ['id', 'author', 'rating', 'comment', 'date']

class ProfileSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='user.username', read_only=True)
    stats = serializers.SerializerMethodField()
    reviews = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = ['id', 'name', 'location', 'bio', 'rating', 'stats', 'reviews']

    def get_stats(self, obj):
        return {
            "given": obj.user.owned_offers.count(),
            "borrowed": Request.objects.filter(requester=obj.user, status='approved').count()
        }

    def get_reviews(self, obj):
        return UserReviewSerializer(obj.user.user_reviews.all(), many=True).data

class RequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Request
        fields = '__all__'
        extra_kwargs = {'requester': {'read_only': True}}

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password']
        extra_kwargs = {'password': {'write_only': True}}
    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

class ReviewCreateSerializer(serializers.Serializer):
    offer_id = serializers.IntegerField()
    rating = serializers.IntegerField()
    comment = serializers.CharField()