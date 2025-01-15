<?php

namespace App\Repositories\Interfaces;

interface BookRepositoryInterface
{
    public function searchByTitle($query);
    public function searchByAuthor($query);
    public function findById($id);
    public function checkAvailability($id);
    public function getBookWithAuthors($id);
    public function getBorrowedCopiesCount($bookId);
    public function create(array $data);
    public function update($id, array $data);
} 