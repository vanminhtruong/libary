<?php

namespace App\Repositories;

use App\Models\User;
use App\Repositories\Interfaces\UserRepositoryInterface;

class UserRepository implements UserRepositoryInterface
{
    protected $model;

    public function __construct(User $model)
    {
        $this->model = $model;
    }

    public function create(array $data)
    {
        return $this->model->create($data);
    }

    public function update($id, array $data)
    {
        $user = $this->model->findOrFail($id);
        $user->update($data);
        return $user;
    }

    public function findByEmail($email)
    {
        return $this->model->where('email', $email)->first();
    }

    public function getBorrowingHistory($userId)
    {
        return $this->model->findOrFail($userId)
            ->borrowingRecords()
            ->with('book')
            ->orderBy('created_at', 'desc')
            ->paginate(10);
    }

    public function getCurrentBorrowings($userId)
    {
        return $this->model->findOrFail($userId)
            ->borrowingRecords()
            ->with('book')
            ->where('status', 'borrowed')
            ->get();
    }

    public function getPendingFines($userId)
    {
        return $this->model->findOrFail($userId)
            ->fines()
            ->with('borrowingRecord.book')
            ->where('status', 'pending')
            ->get();
    }
} 