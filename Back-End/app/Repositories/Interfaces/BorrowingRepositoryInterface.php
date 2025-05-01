<?php

namespace App\Repositories\Interfaces;

interface BorrowingRepositoryInterface
{
    public function create(array $data);
    public function findById($id);
    public function getUserBorrowings($userId);
    public function getUserCurrentBorrowings($userId);
    public function hasOverdueBooks($userId);
    public function updateStatus($id, $status);
    public function extendDueDate($id, $days);
    public function addFine($borrowId, $amount);
    public function delete($id);
    public function countByStatus($status);
} 