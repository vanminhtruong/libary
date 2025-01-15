<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\BookController;
use App\Http\Controllers\API\BorrowingController;
use App\Http\Controllers\API\AdminAuthController;
use App\Http\Controllers\API\CategoryController;
use App\Http\Controllers\API\FineController;
use Illuminate\Support\Facades\Route;

// Admin Authentication Routes
Route::prefix('admin')->group(function () {
    Route::post('/login', [AdminAuthController::class, 'login']);
    Route::middleware('auth:api')->post('/logout', [AdminAuthController::class, 'logout']);
});

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/user/profile/image/{filename}', [AuthController::class, 'getProfileImage']);

Route::prefix('books')->group(function () {
    Route::get('/image/{filename}', [BookController::class, 'getBookImage']);
});

Route::get('/categories/dropdown', [CategoryController::class, 'getForDropdown']);

// Admin routes
Route::middleware(['auth:api', 'admin'])->prefix('admin')->group(function () {
    Route::prefix('books')->group(function () {
        Route::get('/{id}', [BookController::class, 'show']);
        Route::post('/', [BookController::class, 'store']);
        Route::match(['put', 'post'], '/{id}', [BookController::class, 'update']);
        Route::delete('/{id}', [BookController::class, 'destroy']);
    });
    
    Route::prefix('categories')->group(function () {
        Route::get('/', [CategoryController::class, 'index']);
        Route::get('/{id}', [CategoryController::class, 'show']);
        Route::post('/', [CategoryController::class, 'store']);
        Route::put('/{id}', [CategoryController::class, 'update']);
        Route::delete('/{id}', [CategoryController::class, 'destroy']);
    });
    
    Route::get('/borrowings', [BorrowingController::class, 'index']);
    Route::post('/borrowings/approve/{id}', [BorrowingController::class, 'approve']);
    Route::post('/borrowings/reject/{id}', [BorrowingController::class, 'reject']);
    
    Route::get('/users', [AdminAuthController::class, 'users']);
    Route::post('/users', [AdminAuthController::class, 'createUser']);
    Route::get('/users/{id}', [AdminAuthController::class, 'user']);
    Route::post('/users/{id}/update', [AdminAuthController::class, 'updateUser']);
    Route::delete('/users/{id}', [AdminAuthController::class, 'deleteUser']);

    Route::prefix('fines')->group(function () {
        Route::get('/', [FineController::class, 'index']);
        Route::post('/', [FineController::class, 'store']);
        Route::get('/{id}', [FineController::class, 'show']);
        Route::post('/{id}/pay', [FineController::class, 'markAsPaid']);
        Route::post('/{id}/cancel', [FineController::class, 'cancel']);
        Route::delete('/{id}', [FineController::class, 'destroy']);
    });
});

Route::middleware('auth:api')->group(function () {
    Route::prefix('user')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/profile', [AuthController::class, 'getProfile']);
        Route::post('/profile/update', [AuthController::class, 'updateProfile']);
    });
    
    Route::prefix('books')->group(function () {
        Route::post('/{id}/borrow', [BorrowingController::class, 'borrow']);
        Route::post('/{id}/return', [BorrowingController::class, 'return']);
        Route::get('/{id}', [BookController::class, 'show']);
        Route::get('/', [BookController::class, 'index']);
        Route::get('/search', [BookController::class, 'search']);
    });

    Route::prefix('borrowing')->group(function () {
        Route::post('/borrow', [BorrowingController::class, 'borrowBook']);
        Route::post('/return/{borrowId}', [BorrowingController::class, 'returnBook']);
        Route::post('/extend/{borrowId}', [BorrowingController::class, 'extend']);
    });

    Route::prefix('categories')->group(function () {
        Route::get('/', [CategoryController::class, 'index']);
        Route::get('/dropdown', [CategoryController::class, 'getForDropdown']);
        Route::get('/search', [CategoryController::class, 'search']);
        Route::get('/{id}/books', [CategoryController::class, 'getBooks']);
    });

    Route::prefix('fines')->group(function () {
        Route::get('/', [FineController::class, 'getUserFines']);
        Route::get('/{id}', [FineController::class, 'getUserFineDetail']);
    });
});
