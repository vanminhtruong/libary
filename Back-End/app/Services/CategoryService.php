<?php

namespace App\Services;

use App\Repositories\CategoryRepository;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\Eloquent\Collection;

class CategoryService
{
    protected $categoryRepository;

    public function __construct(CategoryRepository $categoryRepository)
    {
        $this->categoryRepository = $categoryRepository;
    }

    public function getAllCategories()
    {
        try {
            Log::info('Fetching all categories');
            $categories = $this->categoryRepository->getAll();
            Log::info('Categories fetched successfully', ['count' => count($categories)]);
            return $categories;
        } catch (\Exception $e) {
            Log::error('Error fetching categories', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }

    public function getAllForDropdown(): Collection
    {
        return $this->categoryRepository->getAllForDropdown();
    }

    public function getCategoryById($id)
    {
        try {
            Log::info('Fetching category by ID', ['id' => $id]);
            $category = $this->categoryRepository->findById($id);
            if (!$category) {
                Log::warning('Category not found', ['id' => $id]);
                return null;
            }
            Log::info('Category fetched successfully', ['id' => $id]);
            return $category;
        } catch (\Exception $e) {
            Log::error('Error fetching category', [
                'id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }

    public function createCategory(array $data)
    {
        try {
            Log::info('Creating new category', ['data' => $data]);
            $category = $this->categoryRepository->create($data);
            Log::info('Category created successfully', ['id' => $category->id]);
            return $category;
        } catch (\Exception $e) {
            Log::error('Error creating category', [
                'data' => $data,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }

    public function updateCategory($id, array $data)
    {
        try {
            Log::info('Updating category', ['id' => $id, 'data' => $data]);
            $category = $this->categoryRepository->update($id, $data);
            if (!$category) {
                Log::warning('Category not found for update', ['id' => $id]);
                return null;
            }
            Log::info('Category updated successfully', ['id' => $id]);
            return $category;
        } catch (\Exception $e) {
            Log::error('Error updating category', [
                'id' => $id,
                'data' => $data,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }

    public function deleteCategory($id)
    {
        try {
            Log::info('Deleting category', ['id' => $id]);
            $result = $this->categoryRepository->delete($id);
            
            if (!$result['success']) {
                Log::warning($result['message'], ['id' => $id]);
                return [
                    'success' => false,
                    'message' => $result['message']
                ];
            }

            Log::info('Category deleted successfully', ['id' => $id]);
            return [
                'success' => true,
                'message' => $result['message']
            ];
        } catch (\Exception $e) {
            Log::error('Error deleting category', [
                'id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }

    /**
     * Tìm kiếm danh mục theo tên
     *
     * @param string $query
     * @return Collection
     */
    public function searchCategories(string $query): Collection
    {
        return $this->categoryRepository->searchByName($query);
    }
} 