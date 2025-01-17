<?php

namespace App\Repositories;

use App\Models\Book;
use App\Repositories\Interfaces\BookRepositoryInterface;

class BookRepository implements BookRepositoryInterface
{
    protected $model;

    public function __construct(Book $model)
    {
        $this->model = $model;
    }

    public function getAllBooks($params)
    {
        $query = $this->model->with('authors');

        // Apply category filter
        if (isset($params['category_id'])) {
            $query->whereHas('categories', function ($q) use ($params) {
                $q->where('categories.id', $params['category_id']);
            });
        }

        // Apply sorting
        $sortBy = $params['sort_by'] ?? 'created_at';
        $sortDirection = $params['sort_direction'] ?? 'desc';
        $query->orderBy($sortBy, $sortDirection);

        // Apply pagination
        $perPage = $params['per_page'] ?? 10;
        return $query->paginate($perPage);
    }

    public function searchByTitle($query)
    {
        $books = $this->model->where('title', 'like', "%{$query}%")
            ->with('authors')
            ->get();
            
        if ($books->isEmpty()) {
            return response()->json([
                'message' => 'No books found matching your search criteria',
                'data' => [],
                'total' => 0
            ]);
        }

        return response()->json([
            'data' => $books,
            'total' => $books->count()
        ]);
    }

    public function searchByAuthor($query)
    {
        $books = $this->model->where('author', 'like', "%{$query}%")
            ->with('authors')
            ->get();
            
        if ($books->isEmpty()) {
            return response()->json([
                'message' => 'No books found matching your search criteria',
                'data' => [],
                'total' => 0
            ]);
        }

        return response()->json([
            'data' => $books,
            'total' => $books->count()
        ]);
    }

    public function findById($id)
    {
        return Book::with('category')->findOrFail($id);
    }

    public function checkAvailability($id)
    {
        $book = $this->getBookWithAuthors($id);
        $borrowedCount = $this->getBorrowedCopiesCount($id);
        $availableCount = $book->total_copies - $borrowedCount;

        return [
            'book_id' => $id,
            'total_copies' => $book->total_copies,
            'borrowed_copies' => $borrowedCount,
            'available_copies' => $availableCount,
            'is_available' => $availableCount > 0
        ];
    }

    public function getBookWithAuthors($id)
    {
        return $this->model->with(['authors', 'borrowingRecords' => function($query) {
            $query->where('status', 'borrowed');
        }])->findOrFail($id);
    }

    public function getBorrowedCopiesCount($bookId)
    {
        return $this->model->findOrFail($bookId)
            ->borrowingRecords()
            ->where('status', 'borrowed')
            ->count();
    }

    public function create(array $data)
    {
        return $this->model->create($data);
    }

    public function update($id, array $data)
    {
        \Log::info('BookRepository update called:', [
            'id' => $id,
            'data' => $data
        ]);

        $book = $this->model->findOrFail($id);
        \Log::info('Found book to update:', ['book' => $book->toArray()]);

        // Directly update using query builder to ensure update happens
        $updated = $this->model->where('id', $id)->update($data);
        \Log::info('Update operation result:', ['updated' => $updated]);

        if (!$updated) {
            throw new \Exception('Failed to update book');
        }

        // Refresh the model instance
        $book = $this->model->findOrFail($id);
        \Log::info('Book after update:', ['book' => $book->toArray()]);

        $updatedBook = $this->model->with(['authors', 'borrowingRecords' => function($query) {
            $query->where('status', 'borrowed');
        }])->findOrFail($id);
        \Log::info('Final updated book:', ['book' => $updatedBook->toArray()]);

        return $updatedBook;
    }
} 