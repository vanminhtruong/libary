<?php

namespace App\Repositories;

use App\Models\BorrowingRecord;
use App\Models\Fine;
use App\Repositories\Interfaces\BorrowingRepositoryInterface;
use Carbon\Carbon;

class BorrowingRepository implements BorrowingRepositoryInterface
{
    protected $model;
    protected $fine;

    public function __construct(BorrowingRecord $model, Fine $fine)
    {
        $this->model = $model;
        $this->fine = $fine;
    }

    public function create(array $data)
    {
        return $this->model->create($data);
    }

    public function findById($id)
    {
        return $this->model->findOrFail($id);
    }

    public function getUserBorrowings($userId)
    {
        return $this->model->where('user_id', $userId)
            ->with('book')
            ->orderBy('created_at', 'desc')
            ->paginate(10);
    }

    public function getUserCurrentBorrowings($userId)
    {
        return $this->model->where('user_id', $userId)
            ->whereIn('status', ['borrowed', 'rejected'])
            ->with('book')
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function getAllBorrowings()
    {
        return $this->model->with(['book', 'user'])
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function hasOverdueBooks($userId)
    {
        return $this->model->where('user_id', $userId)
            ->where('status', 'borrowed')
            ->where('due_date', '<', now())
            ->exists();
    }

    public function updateStatus($id, $status)
    {
        $record = $this->findById($id);
        $record->status = $status;
        $record->save();
        return $record;
    }

    public function extendDueDate($id, $days)
    {
        $record = $this->findById($id);
        $record->due_date = Carbon::parse($record->due_date)->addDays($days);
        $record->save();
        return $record;
    }

    public function addFine($borrowId, $amount)
    {
        $borrowing = $this->findById($borrowId);
        
        $fine = $this->fine->create([
            'user_id' => $borrowing->user_id,
            'borrow_id' => $borrowId,
            'amount' => $amount,
            'fine_date' => now(),
            'status' => 'pending'
        ]);

        $borrowing->fine_amount = $amount;
        $borrowing->save();

        return $fine;
    }

    public function delete($id)
    {
        $borrowing = $this->findById($id);
        return $borrowing->delete();
    }
} 