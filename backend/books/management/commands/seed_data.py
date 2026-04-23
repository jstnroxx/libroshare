import random
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from books.models import Book, BookOffer, Profile


class Command(BaseCommand):
    help = "Seed the database with verified high-quality book data"

    def handle(self, *args, **options):
        self.stdout.write("Starting verified data seeding...")

        BOOKS_DATA = [
            {
                "title": "Dune",
                "author": "Frank Herbert",
                "genre": "Sci-Fi",
                "year": 1965,
                "isbn": "9780441013593",
                "cover": "https://images-na.ssl-images-amazon.com/images/P/0441013597.jpg",
                "desc": "Epic science fiction novel set on the desert planet Arrakis where politics, religion, and survival collide in a struggle for control of the most valuable resource in the universe."
            },
            {
                "title": "1984",
                "author": "George Orwell",
                "genre": "Dystopian",
                "year": 1949,
                "isbn": "9780451524935",
                "cover": "https://images-na.ssl-images-amazon.com/images/P/0451524934.jpg",
                "desc": "A dystopian world ruled by total surveillance and propaganda where Winston Smith struggles to maintain individuality and truth under the oppressive rule of Big Brother."
            },
            {
                "title": "The Great Gatsby",
                "author": "F. Scott Fitzgerald",
                "genre": "Classic",
                "year": 1925,
                "isbn": "9780743273565",
                "cover": "https://images-na.ssl-images-amazon.com/images/P/0743273567.jpg",
                "desc": "A story about wealth, love, and illusion in the Jazz Age, following Jay Gatsby's obsessive pursuit of Daisy Buchanan and the emptiness behind the American Dream."
            },
            {
                "title": "The Hobbit",
                "author": "J.R.R. Tolkien",
                "genre": "Fantasy",
                "year": 1937,
                "isbn": "9780547928227",
                "cover": "https://images-na.ssl-images-amazon.com/images/P/054792822X.jpg",
                "desc": "Bilbo Baggins is taken on an unexpected journey with dwarves to reclaim treasure from a dragon, discovering courage and a world beyond his quiet life."
            },
            {
                "title": "Atomic Habits",
                "author": "James Clear",
                "genre": "Self-Help",
                "year": 2018,
                "isbn": "9780735211292",
                "cover": "https://images-na.ssl-images-amazon.com/images/P/0735211299.jpg",
                "desc": "A guide to building good habits and breaking bad ones through small, consistent changes that compound into remarkable long-term personal transformation."
            },
            {
                "title": "Sapiens",
                "author": "Yuval Noah Harari",
                "genre": "History",
                "year": 2011,
                "isbn": "9780062316097",
                "cover": "https://images-na.ssl-images-amazon.com/images/P/0062316095.jpg",  

                "desc": "A sweeping history of humankind exploring how Homo sapiens evolved, built civilizations, and came to dominate the planet through cognitive and scientific revolutions."
            },
            {
    "title": "The Midnight Library",
    "author": "Matt Haig",
    "genre": "Contemporary",
    "year": 2020,
    "isbn": "9780525559474",
    "cover": "https://images-na.ssl-images-amazon.com/images/P/0525559477.jpg",
    "desc": "A woman discovers a library between life and death where each book represents a different life she could have lived, forcing her to choose what truly makes life worth living."
},
            {
    "title": "The Midnight Library",
    "author": "Matt Haig",
    "genre": "Contemporary",
    "year": 2020,
    "isbn": "9780525559474",
    "cover": "https://images-na.ssl-images-amazon.com/images/P/0143034901.jpg",
    "desc": "A woman discovers a library between life and death where each book represents a different life she could have lived, forcing her to choose what truly makes life worth living."
},
            {
                "title": "Foundation",
                "author": "Isaac Asimov",
                "genre": "Sci-Fi",
                "year": 1951,
                "isbn": "9780553293357",
                "cover": "https://images-na.ssl-images-amazon.com/images/P/0553293354.jpg",
                "desc": "A mathematician predicts the fall of a galactic empire and creates a plan to shorten the coming dark age through science, prediction, and strategic knowledge preservation."
            },
            {
                "title": "The Alchemist",
                "author": "Paulo Coelho",
                "genre": "Adventure",
                "year": 1988,
                "isbn": "9780062315007",
                "cover": "https://images-na.ssl-images-amazon.com/images/P/0062315005.jpg",
                "desc": "A shepherd boy travels across deserts in search of treasure and learns about destiny, purpose, and listening to one's heart while following his personal legend."
            },
            {
                "title": "Pride and Prejudice",
                "author": "Jane Austen",
                "genre": "Classic",
                "year": 1813,
                "isbn": "9780141439518",
                "cover": "https://images-na.ssl-images-amazon.com/images/P/0141439513.jpg",
                "desc": "A romantic story about Elizabeth Bennet and Mr. Darcy exploring love, pride, and social expectations in 19th-century English society."
            },
            {
                "title": "Brave New World",
                "author": "Aldous Huxley",
                "genre": "Dystopian",
                "year": 1932,
                "isbn": "9780060850524",
                "cover": "https://images-na.ssl-images-amazon.com/images/P/0060850523.jpg",
                "desc": "A futuristic society engineered for stability through genetic control and artificial happiness, questioning freedom, identity, and the cost of perfect order."
            },
            {
                "title": "Thinking, Fast and Slow",
                "author": "Daniel Kahneman",
                "genre": "Psychology",
                "year": 2011,
                "isbn": "9780374533557",
                "cover": "https://images-na.ssl-images-amazon.com/images/P/0374533555.jpg",
                "desc": "Explains how humans think using fast intuitive and slow logical systems, revealing cognitive biases that affect judgment and decision-making."
            },
            {
                "title": "The Shadow of the Wind",
                "author": "Carlos Ruiz Zafón",
                "genre": "Mystery",
                "year": 2001,
                "isbn": "9780143034902",
                "cover": "https://images-na.ssl-images-amazon.com/images/P/0143034901.jpg",
                "desc": "A boy discovers a forgotten book that leads him into a mystery involving obsession, literature, and secrets hidden in post-war Barcelona."
            },
            {
                "title": "Crime and Punishment",
                "author": "Fyodor Dostoevsky",
                "genre": "Classic",
                "year": 1866,
                "isbn": "9780143058144",
                "cover": "https://images-na.ssl-images-amazon.com/images/P/0143058142.jpg",
                "desc": "A psychological exploration of guilt and morality as a young man commits murder and struggles with overwhelming conscience and redemption."
            },
            {
                "title": "Project Hail Mary",
                "author": "Andy Weir",
                "genre": "Sci-Fi",
                "year": 2021,
                "isbn": "9780593135204",
                "cover": "https://images-na.ssl-images-amazon.com/images/P/0593135202.jpg",
                "desc": "An astronaut wakes up alone on a spaceship with no memory and must use science and intelligence to save humanity from extinction."
            },
            {
                "title": "Circe",
                "author": "Madeline Miller",
                "genre": "Fantasy",
                "year": 2018,
                "isbn": "9780316556347",
                "cover": "https://images-na.ssl-images-amazon.com/images/P/0316556343.jpg",
                "desc": "A retelling of Greek mythology about Circe, a goddess who discovers witchcraft, independence, and identity while living in exile."
            },
            {
                "title": "The Silent Patient",
                "author": "Alex Michaelides",
                "genre": "Thriller",
                "year": 2019,
                "isbn": "9781250301697",
                "cover": "https://images-na.ssl-images-amazon.com/images/P/1250301696.jpg",
                "desc": "A woman stops speaking after murdering her husband, and a psychotherapist becomes obsessed with uncovering the truth behind her silence."
            },
            {
                "title": "Meditations",
                "author": "Marcus Aurelius",
                "genre": "Philosophy",
                "year": 180,
                "isbn": "9780812968255",
                "cover": "https://images-na.ssl-images-amazon.com/images/P/0812968255.jpg",
                "desc": "Personal reflections of a Roman emperor on Stoic philosophy, focusing on discipline, control, and inner peace."
            },
            {
                "title": "Life of Pi",
                "author": "Yann Martel",
                "genre": "Adventure",
                "year": 2001,
                "isbn": "9780156027328",
                "cover": "https://images-na.ssl-images-amazon.com/images/P/0156027321.jpg",
                "desc": "A boy survives a shipwreck in the ocean on a lifeboat with a tiger, exploring survival, faith, and storytelling."
            },
            {
                "title": "Educated",
                "author": "Tara Westover",
                "genre": "Memoir",
                "year": 2018,
                "isbn": "9780399590504",
                "cover": "https://images-na.ssl-images-amazon.com/images/P/0399590501.jpg",
                "desc": "A memoir of a girl raised in isolation who escapes her strict family to pursue education and self-discovery."
            },
            {
                "title": "Normal People",
                "author": "Sally Rooney",
                "genre": "Contemporary",
                "year": 2018,
                "isbn": "9781984822178",
                "cover": "https://images-na.ssl-images-amazon.com/images/P/1984822179.jpg",
                "desc": "A story of two people whose lives remain deeply connected over years, exploring love, class, and emotional complexity."
            }
        ]

        alice, _ = User.objects.get_or_create(username="alice")
        alice.set_password("alice123")
        alice.save()
        Profile.objects.get_or_create(user=alice, defaults={"location": "Almaty", "rating": 4.8})

        bob, _ = User.objects.get_or_create(username="bob")
        bob.set_password("bob123")
        bob.save()
        Profile.objects.get_or_create(user=bob, defaults={"location": "Astana", "rating": 4.5})

        owners = [alice, bob]
        conditions = ["New", "Fine", "Good", "Fair"]

        for i, data in enumerate(BOOKS_DATA):
            book, created = Book.objects.update_or_create(
                title=data["title"],
                author=data["author"],
                defaults={
                    "description": data["desc"],
                    "year": data["year"],
                    "genre": data["genre"],
                    "cover": data["cover"]
                }
            )

            for j in range(random.randint(1, 2)):
                BookOffer.objects.update_or_create(
                    book=book,
                    owner=owners[(i + j) % 2],
                    defaults={
                        "condition": random.choice(conditions),
                        "is_available": True,
                        "total_lends": random.randint(0, 15)
                    }
                )

            self.stdout.write(f"{'Created' if created else 'Updated'}: {book.title}")

        self.stdout.write(self.style.SUCCESS("\nDone! Database seeded successfully."))