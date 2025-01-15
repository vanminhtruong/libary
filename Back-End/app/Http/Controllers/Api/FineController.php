<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Fine;
use App\Services\FineService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class FineController extends Controller
{
    protected $fineService;

    public function __construct(FineService $fineService)
    {
        $this->fineService = $fineService;
    }

    /**
     * Lấy danh sách tất cả các khoản phạt
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $fines = $this->fineService->getAllFines($request->all());
        return response()->json([
            'success' => true,
            'data' => $fines
        ]);
    }

    /**
     * Tạo mới khoản phạt
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'borrow_id' => 'required|exists:borrowing_records,id',
            'amount' => 'required|numeric|min:0',
            'fine_date' => 'required|date',
            'status' => 'required|in:pending,paid,cancelled',
            'payment_method' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $fine = $this->fineService->createFine($request->all());
            return response()->json([
                'success' => true,
                'message' => 'Fine created successfully',
                'data' => $fine
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create fine',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Xem chi tiết một khoản phạt
     *
     * @param int $id
     * @return JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        $fine = $this->fineService->getFineById($id);
        return response()->json([
            'success' => true,
            'data' => $fine
        ]);
    }

    /**
     * Đánh dấu khoản phạt đã được thanh toán
     *
     * @param int $id
     * @return JsonResponse
     */
    public function markAsPaid(int $id): JsonResponse
    {
        $this->fineService->markFineAsPaid($id);
        return response()->json([
            'success' => true,
            'message' => 'Fine has been marked as paid successfully'
        ]);
    }

    /**
     * Hủy khoản phạt
     *
     * @param int $id
     * @return JsonResponse
     */
    public function cancel(int $id): JsonResponse
    {
        $this->fineService->cancelFine($id);
        return response()->json([
            'success' => true,
            'message' => 'Fine has been cancelled successfully'
        ]);
    }

    /**
     * Xóa khoản phạt
     *
     * @param int $id
     * @return JsonResponse
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            $this->fineService->deleteFine($id);
            return response()->json([
                'success' => true,
                'message' => 'Fine deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete fine',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Lấy danh sách tiền phạt của user đang đăng nhập
     *
     * @return JsonResponse
     */
    public function getUserFines(): JsonResponse
    {
        try {
            $userId = auth()->id();
            $fines = $this->fineService->getUserFines($userId);
            
            return response()->json([
                'success' => true,
                'data' => $fines
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get user fines',
                'error' => $e->getMessage()
            ], 500);
        }
    }
} 