from django.db import models
from django.contrib.auth.models import User


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    rating = models.FloatField(default=0)
    bio = models.TextField(blank=True)
    is_blocked = models.BooleanField(default=False)


class Book(models.Model):
    CONDITION_CHOICES = [
        ('new', 'New'),
        ('used', 'Used'),
    ]

    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    description = models.TextField()
    year = models.IntegerField()
    condition = models.CharField(max_length=10, choices=CONDITION_CHOICES)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="books")
    available = models.BooleanField(default=True)
    genre = models.CharField(max_length=100, blank=True)
    cover = models.URLField(blank=True)


class BookOffer(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name="offers")
    owner = models.ForeignKey(User, on_delete=models.CASCADE)

    condition = models.CharField(max_length=20)
    available_copies = models.IntegerField(default=1)
    total_lends = models.IntegerField(default=0)
    real_photos = models.JSONField(default=list, blank=True)
    is_available = models.BooleanField(default=True)


class Review(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name="reviews")
    reviewer = models.ForeignKey(User, on_delete=models.CASCADE, related_name="reviews")

    rating = models.IntegerField()
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)


class Request(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name="requests")
    requester = models.ForeignKey(User, on_delete=models.CASCADE, related_name="requests_sent")

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
