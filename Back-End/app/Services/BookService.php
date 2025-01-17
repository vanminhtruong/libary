<?php

namespace App\Services;

use App\Repositories\Interfaces\BookRepositoryInterface;
use App\Services\Interfaces\FileUploadServiceInterface;
use App\Traits\RepositoryFileUploadTrait;

class BookService
{
    use RepositoryFileUploadTrait;

    protected $bookRepository;

    public function __construct(
        BookRepositoryInterface $bookRepository,
        FileUploadServiceInterface $fileUploadService
    ) {
        $this->bookRepository = $bookRepository;
        $this->setFileUploadService($fileUploadService);
    }

    public function getAllBooks($params)
    {
        return $this->bookRepository->getAllBooks($params);
    }

    public function search($query, $type)
    {
        if ($type === 'title') {
            return $this->bookRepository->searchByTitle($query);
        }
        return $this->bookRepository->searchByAuthor($query);
    }

    public function getBookDetails($id)
    {
        $book = $this->bookRepository->getBookWithAuthors($id);
        $availability = $this->bookRepository->checkAvailability($id);

        return [
            'book' => $book,
            'available_copies' => $availability['available_copies']
        ];
    }

    public function checkAvailability($id)
    {
        return $this->bookRepository->checkAvailability($id);
    }

    public function find($id)
    {
        return $this->bookRepository->findById($id);
    }

    public function createBook($data)
    {
        if (isset($data['image']) && $data['image'] !== null) {
            $data = $this->handleFileUploads($data, [
                'image' => [
                    'path' => 'profile_image',
                    'options' => [
                        'mimeTypes' => ['image/jpeg', 'image/png', 'image/jpg'],
                        'maxSize' => 5 
                    ],
                    'deleteOld' => true
                ]
            ]);
        }

        return $this->bookRepository->create($data);
    }

    public function updateBook($id, $data)
    {
        \Log::info('BookService updateBook called:', [
            'id' => $id,
            'data' => $data,
            'has_image' => isset($data['image'])
        ]);

        if (isset($data['image']) && $data['image'] !== null) {
            $data['id'] = $id;
            $data = $this->handleFileUploads($data, [
                'image' => [
                    'path' => 'profile_image',
                    'options' => [
                        'mimeTypes' => ['image/jpeg', 'image/png', 'image/jpg'],
                        'maxSize' => 5 
                    ],
                    'deleteOld' => true
                ]
            ]);
            unset($data['id']);
        }

        $result = $this->bookRepository->update($id, $data);
        \Log::info('BookService update result:', ['result' => $result]);
        return $result;
    }

    public function getBookById($id)
    {
        return $this->bookRepository->findById($id);
    }
} 