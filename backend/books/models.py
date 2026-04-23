from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    rating = models.FloatField(default=0)
    bio = models.TextField(blank=True)
    location = models.CharField(max_length=255, blank=True)
    is_blocked = models.BooleanField(default=False)

class Book(models.Model):
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    description = models.TextField()
    year = models.IntegerField()
    genre = models.CharField(max_length=100, blank=True)
    cover = models.URLField(blank=True)
    available = models.BooleanField(default=True)
    def __str__(self):
        return self.title

class BookOffer(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name="offers")
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="owned_offers")
    condition = models.CharField(max_length=20, default="New", blank=True, null=True)
    available_copies = models.IntegerField(default=1)
    total_lends = models.IntegerField(default=0)
    real_photos = models.JSONField(default=list, blank=True)
    is_available = models.BooleanField(default=True)
    def __str__(self):
        return f"{self.book.title} - {self.owner.username}"

class Review(models.Model):
    offer = models.ForeignKey(BookOffer, on_delete=models.CASCADE, related_name="reviews")
    reviewer = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.IntegerField()
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

class Request(models.Model):
    STATUS_CHOICES = [('pending', 'Pending'), ('approved', 'Approved'), ('rejected', 'Rejected')]
    offer = models.ForeignKey(BookOffer, on_delete=models.CASCADE, related_name="requests")
    requester = models.ForeignKey(User, on_delete=models.CASCADE)
    for_days = models.IntegerField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    resolved_at = models.DateTimeField(blank=True, null=True)

class UserReview(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_reviews")
    reviewer = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.IntegerField()
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.get_or_create(user=instance)