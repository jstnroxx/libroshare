from django.contrib import admin
from .models import Book, BookOffer, Review, Request, Profile, UserReview

# Регистрация моделей, чтобы они появились в админке
admin.site.register(Book)
admin.site.register(BookOffer)
admin.site.register(Review)
admin.site.register(Request)
admin.site.register(Profile)
admin.site.register(UserReview)