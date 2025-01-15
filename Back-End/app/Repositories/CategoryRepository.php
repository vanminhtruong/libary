<?php

namespace App\Repositories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Collection;

class CategoryRepository
{
    protected $model;

    public function __construct(Category $category)
    {
        $this->model = $category;
    }

    public function getAll()
    {
        return $this->model->orderBy('created_at', 'desc')->get();
    }

    public function getAllForDropdown(): Collection
    {
        return $this->model->select('id', 'name')->orderBy('name')->get();
    }

    public function findById($id)
    {
        return $this->model->find($id);
    }

    public function create(array $data)
    {
        return $this->model->create($data);
    }

    public function update($id, array $data)
    {
        $category = $this->model->find($id);
        if ($category) {
            $category->update($data);
            return $category;
        }
        return null;
    }

    public function hasBooks($id)
    {
        $category = $this->model->find($id);
        return $category ? $category->books()->exists() : false;
    }

    public function delete($id)
    {
        $category = $this->model->find($id);
        if ($category) {
            if ($this->hasBooks($id)) {
                return [
                    'success' => false,
                    'message' => 'Không thể xóa danh mục này vì đang có sách thuộc danh mục'
                ];
            }
            return [
                'success' => $category->delete(),
                'message' => 'Xóa danh mục thành công'
            ];
        }
        return [
            'success' => false,
            'message' => 'Không tìm thấy danh mục'
        ];
    }

    /**
     * Tìm kiếm danh mục theo tên
     *
     * @param string $query
     * @return Collection
     */
    public function searchByName(string $query): Collection
    {
        return $this->model
            ->where('name', 'like', "%{$query}%")
            ->orderBy('name')
            ->get();
    }
} 