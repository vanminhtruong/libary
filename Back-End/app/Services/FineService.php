<?php

namespace App\Services;

use App\Models\Fine;
use App\Repositories\Interfaces\FineRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class FineService
{
    protected $fineRepository;

    public function __construct(FineRepositoryInterface $fineRepository)
    {
        $this->fineRepository = $fineRepository;
    }

    /**
     * Lấy danh sách tất cả các khoản phạt với phân trang
     *
     * @param array $params
     * @return LengthAwarePaginator
     */
    public function getAllFines(array $params): LengthAwarePaginator
    {
        return $this->fineRepository->getAllWithPagination($params);
    }

    /**
     * Tạo mới khoản phạt
     *
     * @param array $data
     * @return Fine
     */
    public function createFine(array $data): Fine
    {
        // Mặc định status là pending nếu không được cung cấp
        if (!isset($data['status'])) {
            $data['status'] = 'pending';
        }

        return $this->fineRepository->create($data);
    }

    /**
     * Lấy thông tin chi tiết một khoản phạt
     *
     * @param int $id
     * @return Fine
     * @throws NotFoundHttpException
     */
    public function getFineById(int $id): Fine
    {
        $fine = $this->fineRepository->findById($id);
        if (!$fine) {
            throw new NotFoundHttpException('Fine not found');
        }
        return $fine;
    }

    /**
     * Đánh dấu khoản phạt đã được thanh toán
     *
     * @param int $id
     * @return bool
     * @throws NotFoundHttpException
     */
    public function markFineAsPaid(int $id): bool
    {
        $fine = $this->getFineById($id);
        return $this->fineRepository->update($id, ['status' => 'paid']);
    }

    /**
     * Hủy khoản phạt
     *
     * @param int $id
     * @return bool
     * @throws NotFoundHttpException
     */
    public function cancelFine(int $id): bool
    {
        $fine = $this->getFineById($id);
        return $this->fineRepository->update($id, ['status' => 'cancelled']);
    }

    /**
     * Xóa khoản phạt
     *
     * @param int $id
     * @return bool
     * @throws NotFoundHttpException
     */
    public function deleteFine(int $id): bool
    {
        $fine = $this->getFineById($id);
        return $this->fineRepository->delete($id);
    }

    /**
     * Lấy danh sách tiền phạt của user hiện tại
     *
     * @param int $userId
     * @return Collection
     */
    public function getUserFines(int $userId): Collection
    {
        return $this->fineRepository->getFinesByUserId($userId);
    }
} 