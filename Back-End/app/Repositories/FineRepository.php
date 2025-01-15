<?php

namespace App\Repositories;

use App\Models\Fine;
use App\Repositories\Interfaces\FineRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class FineRepository implements FineRepositoryInterface
{
    protected $model;

    public function __construct(Fine $model)
    {
        $this->model = $model;
    }

    /**
     * Lấy danh sách phạt với phân trang
     *
     * @param array $params
     * @return LengthAwarePaginator
     */
    public function getAllWithPagination(array $params): LengthAwarePaginator
    {
        $query = $this->model->newQuery()
            ->with(['user', 'borrowing.book']);

        // Sắp xếp
        $sortBy = $params['sort_by'] ?? 'created_at';
        $sortOrder = $params['sort_order'] ?? 'desc';
        $query->orderBy($sortBy, $sortOrder);

        // Phân trang
        $perPage = $params['per_page'] ?? 10;
        return $query->paginate($perPage);
    }

    /**
     * Tìm khoản phạt theo ID
     *
     * @param int $id
     * @return Fine|null
     */
    public function findById(int $id): ?Fine
    {
        return $this->model->with(['user', 'borrowing.book'])->find($id);
    }

    /**
     * Tạo mới khoản phạt
     *
     * @param array $data
     * @return Fine
     */
    public function create(array $data): Fine
    {
        return $this->model->create($data);
    }

    /**
     * Cập nhật thông tin khoản phạt
     *
     * @param int $id
     * @param array $data
     * @return bool
     */
    public function update(int $id, array $data): bool
    {
        $fine = $this->findById($id);
        if (!$fine) {
            return false;
        }
        return $fine->update($data);
    }

    /**
     * Xóa khoản phạt
     *
     * @param int $id
     * @return bool
     */
    public function delete(int $id): bool
    {
        return $this->model->destroy($id) > 0;
    }

    /**
     * Lấy danh sách tiền phạt của một user
     *
     * @param int $userId
     * @return Collection
     */
    public function getFinesByUserId(int $userId): Collection
    {
        return $this->model
            ->where('user_id', $userId)
            ->with(['borrowing.book'])
            ->orderBy('created_at', 'desc')
            ->get();
    }
} 