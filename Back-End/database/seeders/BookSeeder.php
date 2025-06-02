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
                'image' => 'https://covers.openlibrary.org/b/id/10523868-L.jpg'
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
                'image' => 'https://covers.openlibrary.org/b/id/12003830-L.jpg'
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
                'image' => 'https://covers.openlibrary.org/b/id/12767095-L.jpg'
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
                'image' => 'https://covers.openlibrary.org/b/id/7327676-L.jpg'
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
                'image' => 'https://covers.openlibrary.org/b/id/12645114-L.jpg'
            ],
            [
                'isbn' => '9780547928234',
                'title' => 'The Hobbit: An Unexpected Journey',
                'author' => 'J.R.R. Tolkien',
                'publisher' => 'HarperCollins',
                'publication_year' => 2012,
                'category_id' => 2, // Fantasy
                'price' => 24.99,
                'total_copies' => 10,
                'available_copies' => 7,
                'location_shelf' => 'F1',
                'description' => 'The first part of the epic adventure of Bilbo Baggins, a hobbit who embarks on a journey with a group of dwarves to reclaim their homeland from the dragon Smaug.',
                'image' => 'https://covers.openlibrary.org/b/id/12003830-L.jpg'
            ],
            [
                'isbn' => '9780547928241',
                'title' => 'The Hobbit: The Desolation of Smaug',
                'author' => 'J.R.R. Tolkien',
                'publisher' => 'HarperCollins',
                'publication_year' => 2013,
                'category_id' => 2, // Fantasy
                'price' => 26.99,
                'total_copies' => 8,
                'available_copies' => 5,
                'location_shelf' => 'F2',
                'description' => 'The second part of the Hobbit trilogy where Bilbo Baggins continues his journey with Thorin Oakenshield and the dwarves as they encounter the fearsome dragon Smaug.',
                'image' => 'https://covers.openlibrary.org/b/id/12003830-L.jpg'
            ],
            [
                'isbn' => '9780547928258',
                'title' => 'The Hobbit: The Battle of the Five Armies',
                'author' => 'J.R.R. Tolkien',
                'publisher' => 'HarperCollins',
                'publication_year' => 2014,
                'category_id' => 2, // Fantasy
                'price' => 27.99,
                'total_copies' => 7,
                'available_copies' => 4,
                'location_shelf' => 'F3',
                'description' => 'The final part of the Hobbit trilogy where Thorin Oakenshield and the dwarves have reclaimed their homeland, but now face the consequences of awakening the dragon Smaug, leading to an epic battle.',
                'image' => 'https://covers.openlibrary.org/b/id/12003830-L.jpg'
            ],
            [
                'isbn' => '9780547928265',
                'title' => 'Legolas: Prince of the Woodland Realm',
                'author' => 'J.R.R. Tolkien',
                'publisher' => 'HarperCollins',
                'publication_year' => 2015,
                'category_id' => 2, // Fantasy
                'price' => 29.99,
                'total_copies' => 6,
                'available_copies' => 3,
                'location_shelf' => 'G1',
                'description' => 'A tale focusing on the elven prince Legolas and his adventures before joining the Fellowship of the Ring, exploring his life in the Woodland Realm and his relationship with his father, King Thranduil.',
                'image' => 'https://covers.openlibrary.org/b/id/12003830-L.jpg'
            ],
            [
                'isbn' => '9780547928272',
                'title' => 'Tauriel: Captain of the Woodland Guard',
                'author' => 'J.R.R. Tolkien',
                'publisher' => 'HarperCollins',
                'publication_year' => 2016,
                'category_id' => 2, // Fantasy
                'price' => 28.99,
                'total_copies' => 5,
                'available_copies' => 2,
                'location_shelf' => 'G2',
                'description' => 'The story of Tauriel, the fierce elven warrior and Captain of the Woodland Guard, as she protects the realm from dark forces and finds herself torn between her duty to her people and her feelings for a dwarf named Kili.',
                'image' => 'https://covers.openlibrary.org/b/id/12003830-L.jpg'
            ]
        ];

        foreach ($books as $book) {
            Book::create($book);
        }
    }
}