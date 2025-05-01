<?php

namespace App\Services;

use App\Repositories\Interfaces\BookRepositoryInterface;
use App\Repositories\Interfaces\BorrowingRepositoryInterface;
use App\Repositories\Interfaces\UserRepositoryInterface;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class BorrowingService
{
    protected $borrowingRepository;
    protected $bookRepository;
    protected $userRepository;

    public function __construct(
        BorrowingRepositoryInterface $borrowingRepository,
        BookRepositoryInterface $bookRepository,
        UserRepositoryInterface $userRepository
    ) {
        $this->borrowingRepository = $borrowingRepository;
        $this->bookRepository = $bookRepository;
        $this->userRepository = $userRepository;
    }

    public function borrowBook($userId, $bookId)
    {
        // Check for overdue books
        if ($this->borrowingRepository->hasOverdueBooks($userId)) {
            throw new \Exception('You have overdue books. Please return them first.');
        }

        // Check book availability
        $book = $this->bookRepository->findById($bookId);
        if ($book->available_copies <= 0) {
            throw new \Exception('No copies available for borrowing');
        }

        return $this->borrowingRepository->create([
            'user_id' => $userId,
            'book_id' => $bookId,
            'borrow_date' => now(),
            'due_date' => now()->addDays(14),
            'status' => 'pending'
        ]);
    }

    public function returnBook($userId, $borrowId)
    {
        $borrowing = $this->borrowingRepository->findById($borrowId);

        if ($borrowing->user_id !== $userId) {
            throw new \Exception('Unauthorized');
        }

        if ($borrowing->status !== 'borrowed') {
            throw new \Exception('Book already returned');
        }

        DB::transaction(function () use ($borrowing) {
            $this->borrowingRepository->updateStatus($borrowing->id, 'returned');
            
            // Tăng số lượng sách có sẵn
            $book = $this->bookRepository->findById($borrowing->book_id);
            $book->available_copies = $book->available_copies + 1;
            $book->save();
            
            // Calculate and add fine if overdue
            if ($borrowing->due_date < now()) {
                $daysOverdue = now()->diffInDays($borrowing->due_date);
                $fineAmount = $daysOverdue * 1.00; // $1 per day
                $this->borrowingRepository->addFine($borrowing->id, $fineAmount);
            }
        });

        return $borrowing->fresh();
    }

    public function extendBorrowing($userId, $borrowId)
    {
        $borrowing = $this->borrowingRepository->findById($borrowId);

        if ($borrowing->user_id !== $userId) {
            throw new \Exception('Unauthorized');
        }

        if ($borrowing->status !== 'borrowed') {
            throw new \Exception('Cannot extend returned book');
        }

        if ($borrowing->due_date < now()) {
            throw new \Exception('Cannot extend overdue book');
        }

        return $this->borrowingRepository->extendDueDate($borrowId, 7);
    }

    public function getCurrentBorrowings($userId)
    {
        return $this->borrowingRepository->getUserCurrentBorrowings($userId);
    }

    public function getBorrowingHistory($userId)
    {
        return $this->borrowingRepository->getUserBorrowings($userId);
    }


    public function getAllBorrowings()
    {
        return $this->borrowingRepository->getAllBorrowings();
    }

    public function approveBorrowing($id)
    {
        $borrowing = $this->borrowingRepository->findById($id);

        // Kiểm tra xem sách có sẵn để mượn không
        $book = $this->bookRepository->findById($borrowing->book_id);
        if ($book->available_copies <= 0) {
            throw new \Exception('No copies available for borrowing');
        }

        // Kiểm tra người dùng có sách quá hạn không
        if ($this->borrowingRepository->hasOverdueBooks($borrowing->user_id)) {
            throw new \Exception('User has overdue books. Cannot approve new borrowing.');
        }

        // Cập nhật trạng thái và ngày mượn/hạn trả
        DB::transaction(function () use ($borrowing, $book) {
            $borrowing->status = 'borrowed';
            $borrowing->borrow_date = now();
            $borrowing->due_date = now()->addDays(14);
            $borrowing->save();
            
            // Giảm số lượng sách có sẵn
            $book->available_copies = $book->available_copies - 1;
            $book->save();
        });

        return $borrowing->fresh();
    }

    public function rejectBorrowing($id, $reason = null)
    {
        $borrowing = $this->borrowingRepository->findById($id);

        $borrowing->status = 'rejected';
        $borrowing->reason = $reason;
        $borrowing->save();

        return $borrowing;
    }

    public function deleteBorrowing($userId, $borrowId)
    {
        $borrowing = $this->borrowingRepository->findById($borrowId);
        
        // Kiểm tra quyền xóa (chỉ người dùng đã mượn mới có quyền xóa)
        if ($borrowing->user_id !== $userId) {
            throw new \Exception('Unauthorized: You do not have permission to delete this record');
        }
        
        // Chỉ cho phép xóa các bản ghi có trạng thái returned hoặc rejected
        if (!in_array($borrowing->status, ['returned', 'rejected'])) {
            throw new \Exception('Cannot delete active borrowing record');
        }
        
        return $this->borrowingRepository->delete($borrowId);
    }
    
    /**
     * Lấy số lượng yêu cầu mượn sách đang chờ duyệt
     * 
     * @return int
     */
    public function getPendingBorrowingsCount()
    {
        return $this->borrowingRepository->countByStatus('pending');
    }
} 