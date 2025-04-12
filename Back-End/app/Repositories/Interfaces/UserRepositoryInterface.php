<?php

namespace App\Repositories\Interfaces;

interface UserRepositoryInterface
{
    public function create(array $data);
    public function update($id, array $data);
    public function findByEmail($email);
    public function findByPhone($phone);
    public function getBorrowingHistory($userId);
    public function getCurrentBorrowings($userId);
    public function getPendingFines($userId);
}