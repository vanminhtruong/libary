<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Services\BorrowingService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BorrowingController extends Controller
{
    protected $borrowingService;

    public function __construct(BorrowingService $borrowingService)
    {
        $this->borrowingService = $borrowingService;
    }

    public function borrowBook(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'book_id' => 'required|exists:books,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $borrowingRecord = $this->borrowingService->borrowBook(
                $request->user()->id,
                $request->book_id
            );

            return response()->json([
                'message' => 'Book borrowed successfully',
                'borrowing_record' => $borrowingRecord
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    public function returnBook(Request $request, $borrowId)
    {
        try {
            $borrowingRecord = $this->borrowingService->returnBook(
                $request->user()->id,
                $borrowId
            );

            return response()->json([
                'message' => 'Book returned successfully',
                'borrowing_record' => $borrowingRecord
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    public function extend(Request $request, $borrowId)
    {
        try {
            $borrowingRecord = $this->borrowingService->extendBorrowing(
                $request->user()->id,
                $borrowId
            );

            return response()->json([
                'message' => 'Borrowing period extended successfully',
                'borrowing_record' => $borrowingRecord
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    public function currentBorrowings(Request $request)
    {
        $borrowings = $this->borrowingService->getCurrentBorrowings($request->user()->id);
        return response()->json($borrowings);
    }

    public function borrowingHistory(Request $request)
    {
        $history = $this->borrowingService->getBorrowingHistory($request->user()->id);
        return response()->json($history);
    }

    public function index()
    {
        try {
            $borrowings = $this->borrowingService->getAllBorrowings();
            return response()->json([
                'success' => true,
                'data' => $borrowings
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function approve(Request $request, $id)
    {
        try {
            $borrowingRecord = $this->borrowingService->approveBorrowing($id);

            return response()->json([
                'message' => 'Borrowing request approved successfully',
                'borrowing_record' => $borrowingRecord
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    public function reject(Request $request, $id)
    {
        try {
            $borrowingRecord = $this->borrowingService->rejectBorrowing($id);

            return response()->json([
                'message' => 'Borrowing request rejected successfully',
                'borrowing_record' => $borrowingRecord
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }
}
