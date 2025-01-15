<?php

namespace Database\Seeders;

use App\Models\Book;
use Illuminate\Database\Seeder;

class BookSeeder extends Seeder
{
    public function run(): void
    {
        $books = [
            [
                'isbn' => '9780747532743',
                'title' => 'Harry Potter and the Philosopher\'s Stone',
                'author' => 'J.K. Rowling',
                'publisher' => 'Bloomsbury Publishing',
                'publication_year' => 1997,
                'category_id' => 1, // Fiction
                'price' => 19.99,
                'total_copies' => 10,
                'available_copies' => 8,
                'location_shelf' => 'A1',
                'description' => 'The first book in the Harry Potter series, following the life of a young wizard, Harry Potter, and his friends Hermione Granger and Ron Weasley.',
                'image' => 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8tJNht14fvNnXeIC-rBSFwwIxODNd_R0zQ8s='
            ],
            [
                'isbn' => '9780547928227',
                'title' => 'The Hobbit',
                'author' => 'J.R.R. Tolkien',
                'publisher' => 'Houghton Mifflin Harcourt',
                'publication_year' => 1937,
                'category_id' => 2, // Fantasy
                'price' => 24.99,
                'total_copies' => 8,
                'available_copies' => 5,
                'location_shelf' => 'B2',
                'description' => 'A fantasy novel about the adventures of hobbit Bilbo Baggins, who embarks on a quest to help a group of dwarves reclaim their mountain home.',
                'image' => 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8tJNht14fvNnXeIC-rBSFwwIxODNd_R0zQ8s='
            ],
            [
                'isbn' => '9781984801258',
                'title' => 'Project Hail Mary',
                'author' => 'Andy Weir',
                'publisher' => 'Ballantine Books',
                'publication_year' => 2021,
                'category_id' => 3, // Science Fiction
                'price' => 29.99,
                'total_copies' => 6,
                'available_copies' => 4,
                'location_shelf' => 'C3',
                'description' => 'A science fiction novel about an astronaut who wakes up alone on a spaceship with no memory of how he got there.',
                'image' => 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8tJNht14fvNnXeIC-rBSFwwIxODNd_R0zQ8s='
            ],
            [
                'isbn' => '9780062316097',
                'title' => 'Sapiens: A Brief History of Humankind',
                'author' => 'Yuval Noah Harari',
                'publisher' => 'Harper',
                'publication_year' => 2015,
                'category_id' => 4, // Non-fiction
                'price' => 34.99,
                'total_copies' => 5,
                'available_copies' => 3,
                'location_shelf' => 'D4',
                'description' => 'A book that explores the history of human evolution and how we became the dominant species on Earth.',
                'image' => 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8tJNht14fvNnXeIC-rBSFwwIxODNd_R0zQ8s='
            ],
            [
                'isbn' => '9780141439518',
                'title' => 'Pride and Prejudice',
                'author' => 'Jane Austen',
                'publisher' => 'Penguin Classics',
                'publication_year' => 1813,
                'category_id' => 5, // Classic
                'price' => 15.99,
                'total_copies' => 12,
                'available_copies' => 9,
                'location_shelf' => 'E5',
                'description' => 'A romantic novel following the character of Elizabeth Bennet as she deals with issues of manners, upbringing, morality, education, and marriage.',
                'image' => 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8tJNht14fvNnXeIC-rBSFwwIxODNd_R0zQ8s='
            ]
        ];

        foreach ($books as $book) {
            Book::create($book);
        }
    }
}