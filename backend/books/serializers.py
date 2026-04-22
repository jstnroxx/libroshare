from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Book, BookOffer, Review, Request, Profile

class BookSerializer(serializers.ModelSerializer):
    instances = serializers.SerializerMethodField()
    totalBorrows = serializers.SerializerMethodField()
    ownerId = serializers.IntegerField(source='owner.id', read_only=True)
    ownerName = serializers.CharField(source='owner.username', read_only=True)

    class Meta:
        model = Book
        fields = [
            'id',
            'title',
            'author',
            'genre',
            'description',
            'year',
            'cover',
            'available',

            'ownerId',
            'ownerName',

            'instances',
            'totalBorrows'
        ]

    def get_instances(self, obj):
        return [
            {
                "id": o.id,
                "ownerId": o.owner.id,
                "ownerName": o.owner.username,
                "ownerRating": getattr(getattr(o.owner, "profile", None), "rating", 0),

                "condition": o.condition,
                "realPhotos": o.real_photos or [],
                "isAvailable": o.is_available,

                "pendingRequestsCount": obj.requests.filter(status="pending").count()
            }
            for o in obj.offers.all()
        ]

    def get_totalBorrows(self, obj):
        return sum(o.total_lends for o in obj.offers.all())


class BookOfferSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookOffer
        fields = '__all__'


class ReviewSerializer(serializers.ModelSerializer):
    reviewerId = serializers.IntegerField(source='reviewer.id', read_only=True)
    reviewerName = serializers.CharField(source='reviewer.username', read_only=True)
    date = serializers.DateTimeField(source='created_at', read_only=True)

    class Meta:
        model = Review
        fields = [
            'id',
            'reviewerId',
            'reviewerName',
            'rating',
            'comment',
            'date'
        ]


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


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password']

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class ReviewCreateSerializer(serializers.Serializer):
    book_id = serializers.IntegerField()
    rating = serializers.IntegerField()
    comment = serializers.CharField()

    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("Rating must be 1-5")
        return value