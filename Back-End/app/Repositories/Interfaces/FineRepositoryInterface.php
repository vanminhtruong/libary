<?php

namespace App\Repositories\Interfaces;

use App\Models\Fine;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface FineRepositoryInterface
{
    /**
     * Lấy danh sách phạt với phân trang
     *
     * @param array $params
     * @return LengthAwarePaginator
     */
    public function getAllWithPagination(array $params): LengthAwarePaginator;

    /**
     * Tìm khoản phạt theo ID
     *
     * @param int $id
     * @return Fine|null
     */
    public function findById(int $id): ?Fine;

    /**
     * Tạo mới khoản phạt
     *
     * @param array $data
     * @return Fine
     */
    public function create(array $data): Fine;

    /**
     * Cập nhật thông tin khoản phạt
     *
     * @param int $id
     * @param array $data
     * @return bool
     */
    public function update(int $id, array $data): bool;

    /**
     * Xóa khoản phạt
     *
     * @param int $id
     * @return bool
     */
    public function delete(int $id): bool;

    /**
     * Lấy danh sách tiền phạt của một user
     *
     * @param int $userId
     * @return Collection
     */
    public function getFinesByUserId(int $userId): Collection;
} 