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
    cover = serializers.URLField(required=False, allow_blank=True)
    totalBorrows = serializers.SerializerMethodField()

    class Meta:
        model = Book
        fields = ['id', 'title', 'author', 'description', 'genre', 'year', 'cover', 'totalBorrows', 'instances']

    def get_totalBorrows(self, obj):
        return sum(o.total_lends for o in obj.offers.all())

    def get_instances(self, obj):
        offers = BookOffer.objects.filter(book=obj).select_related('owner__profile')
        result = []
        for offer in offers:
            try:
                owner_rating = offer.owner.profile.rating
            except Exception:
                owner_rating = 0

            approved_request = Request.objects.filter(offer=offer, status='approved').order_by('-created_at').first()
            current_borrower_id = approved_request.requester_id if approved_request else None

            reviews = BookReviewSerializer(offer.reviews.all(), many=True).data

            result.append({
                "id": offer.id,
                "ownerId": offer.owner_id,
                "ownerName": offer.owner.username,
                "ownerRating": owner_rating,
                "condition": offer.condition or "Good",
                "isAvailable": offer.is_available,
                "status": "available" if offer.is_available else "on_loan",
                "realPhotos": offer.real_photos or [],
                "instanceReviews": reviews,
                "currentBorrowerId": current_borrower_id,
                "nextAvailableDate": None,
                "pendingRequestsCount": Request.objects.filter(offer=offer, status='pending').count(),
            })
        return result


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
    rating = serializers.IntegerField(min_value=1, max_value=5)
    comment = serializers.CharField()
