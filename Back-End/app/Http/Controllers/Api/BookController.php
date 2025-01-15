<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Services\BookService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Book;

class BookController extends Controller
{
    protected $bookService;

    public function __construct(BookService $bookService)
    {
        $this->bookService = $bookService;
    }

    public function index(Request $request)
    {
        try {
            $query = Book::with('category')->orderBy('created_at', 'desc');
            $perPage = $request->get('limit', 12);
            $books = $query->paginate($perPage);

            // Transform response để thêm category_name
            $books->getCollection()->transform(function ($book) {
                $bookArray = $book->toArray();
                $bookArray['category_name'] = $book->category ? $book->category->name : null;
                return $bookArray;
            });

            return response()->json([
                'success' => true,
                'data' => $books->items(),
                'total' => $books->total(),
                'current_page' => $books->currentPage(),
                'per_page' => $books->perPage(),
                'last_page' => $books->lastPage()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error getting books: ' . $e->getMessage()
            ], 500);
        }
    }

    public function search(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'query' => 'required|string|min:2',
            'type' => 'nullable|in:title,author'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $result = $this->bookService->search(
                $request->input('query'),
                $request->input('type', 'title')
            );
            
            return response()->json($result);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error performing search',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        $result = $this->bookService->getBookDetails($id);
        return response()->json($result);
    }

    public function checkAvailability($id)
    {
        $result = $this->bookService->checkAvailability($id);
        return response()->json($result);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'isbn' => 'required|string|max:13',
            'publisher' => 'required|string|max:255',
            'publication_year' => 'required|integer|min:1800|max:' . date('Y'),
            'category_id' => 'required|exists:categories,id',
            'total_copies' => 'required|integer|min:0',
            'available_copies' => 'required|integer|min:0|lte:total_copies',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $book = $this->bookService->createBook($request->all());
        return response()->json($book, 201);
    }

    public function update(Request $request, $id)
    {
        \Log::info('Update book request received:', [
            'id' => $id,
            'all_data' => $request->all(),
            'has_file' => $request->hasFile('image'),
            'content_type' => $request->header('Content-Type')
        ]);

        $validator = Validator::make($request->all(), [
            'title' => 'string|max:255',
            'author' => 'string|max:255',
            'isbn' => 'string|max:13',
            'publisher' => 'string|max:255',
            'publication_year' => 'integer|min:1800|max:' . date('Y'),
            'category_id' => 'exists:categories,id',
            'quantity' => 'integer|min:0',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048'
        ]);

        if ($validator->fails()) {
            // \Log::error('Validation failed:', [
            //     'errors' => $validator->errors()->toArray()
            // ]);
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $updateData = $request->except(['_method', '_token']);
            
            if ($request->hasFile('image')) {
                $updateData['image'] = $request->file('image');
            }
            
            \Log::info('Filtered update data:', ['data' => $updateData]);
            
            $book = $this->bookService->updateBook($id, $updateData);
            \Log::info('Book updated successfully:', ['book' => $book]);
            
            return response()->json([
                'message' => 'Cập nhật sách thành công',
                'data' => $book
            ]);
        } catch (\Exception $e) {
            \Log::error('Error updating book:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'message' => 'Có lỗi xảy ra khi cập nhật sách',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Xóa sách
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        try {
            $book = Book::findOrFail($id);
            
            // Xóa file ảnh cũ nếu có
            if ($book->image) {
                $imagePath = public_path('images/books/' . $book->image);
                if (file_exists($imagePath)) {
                    unlink($imagePath);
                }
            }
            
            // Xóa sách khỏi database
            $book->delete();
            
            return response()->json([
                'message' => 'Xóa sách thành công'
            ], 200);
            
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Không tìm thấy sách'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Có lỗi xảy ra khi xóa sách',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getBookImage($filename)
    {
        $path = storage_path('app/public/profile_image/' . $filename);
        
        if (!file_exists($path)) {
            return response()->json(['message' => 'Image not found'], 404);
        }

        return response()->file($path);
    }
}
