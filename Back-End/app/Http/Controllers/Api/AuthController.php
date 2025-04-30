<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Services\AuthService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    protected $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
        // $this->middleware('auth:api', ['except' => ['login', 'register']]);
    }

    public function register(Request $request)
    {
        // Check if email was previously used by a deleted account
        $baseEmail = $request->email;
        $deletedUser = \App\Models\User::where('email', 'like', $baseEmail . '.deleted.%')->first();
        
        if ($deletedUser) {
            return response()->json([
                'status' => false,
                'message' => 'Email này đã được sử dụng trước đó và không thể đăng ký lại.',
                'errors' => ['email' => ['Email này đã được sử dụng trước đó và không thể đăng ký lại.']]
            ], 422);
        }
        
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'phone' => 'nullable|string|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $result = $this->authService->register($request->all());
        return response()->json($result);
    }

    public function login(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'email' => 'required|string|email',
                'password' => 'required|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Validation Error',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Check if user exists and is active
            $user = \App\Models\User::where('email', $request->email)->first();
            
            if ($user && $user->is_active === 0) {
                return response()->json([
                    'status' => false,
                    'message' => 'Tài khoản này đã bị xóa. Vui lòng đăng ký tài khoản mới.'
                ], 401);
            }

            $credentials = $request->only('email', 'password');
            $result = $this->authService->login($credentials);

            if (!$result) {
                return response()->json([
                    'status' => false,
                    'message' => 'Email hoặc mật khẩu không đúng'
                ], 401);
            }

            return response()->json([
                'status' => true,
                'message' => 'Đăng nhập thành công',
                'data' => $result
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Đăng nhập thất bại',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function logout(Request $request)
    {
        auth()->logout();
        return response()->json(['message' => 'Successfully logged out']);
    }

    public function getProfile(Request $request)
    {
        return response()->json($request->user());
    }

    public function updateProfile(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'string|max:255',
            'phone' => 'nullable|string|max:20',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp,bmp|max:2048',
            'current_password' => 'required_with:new_password',
            'new_password' => 'nullable|string|min:6'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Verify current password if changing password
        if ($request->has('new_password')) {
            if (!Hash::check($request->current_password, $request->user()->password)) {
                return response()->json([
                    'errors' => ['current_password' => ['Current password is incorrect']]
                ], 422);
            }
        }

        $updateData = $request->only(['name', 'phone', 'image']);

        // Add new password to update data if provided
        if ($request->has('new_password')) {
            $updateData['password'] = Hash::make($request->new_password);
        }

        $user = $this->authService->updateProfile($request->user()->id, $updateData);

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user
        ]);
    }

    public function getProfileImage($filename)
    {
        $path = storage_path('app/public/profile_images/' . $filename);
        \Log::debug('Requested image path: ' . $path);
        \Log::debug('File exists: ' . (file_exists($path) ? 'true' : 'false'));

        if (!file_exists($path)) {
            return response()->json(['error' => 'Image not found'], 404);
        }

        return response()->file($path);
    }

    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60,
            'user' => auth()->user()
        ]);
    }

    /**
     * Reset password using email
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function resetPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
            'password' => 'required|string|min:6',
            'password_confirmation' => 'required|same:password',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation Error',
                'errors' => $validator->errors()
            ], 422);
        }

        $result = $this->authService->resetPasswordByEmail(
            $request->email,
            $request->password
        );

        if (!$result) {
            return response()->json([
                'status' => false,
                'message' => 'Email không tồn tại trong hệ thống'
            ], 404);
        }

        return response()->json([
            'status' => true,
            'message' => 'Đặt lại mật khẩu thành công',
            'data' => $result
        ], 200);
    }

    /**
     * Delete current user account
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteAccount(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'password' => 'required|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Validation Error',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Check if password matches
            if (!Hash::check($request->password, $request->user()->password)) {
                return response()->json([
                    'status' => false,
                    'message' => 'Mật khẩu không chính xác'
                ], 422);
            }

            // Get the user before we invalidate tokens
            $user = $request->user();
            $userId = $user->id;
            $userEmail = $user->email;
            
            // Invalidate JWT token
            try {
                auth()->logout();
            } catch (\Exception $e) {
                \Log::error('Error logging out user: ' . $e->getMessage());
            }
            
            // Start a transaction to ensure all related data is handled properly
            \DB::beginTransaction();
            
            try {
                // Instead of deleting the user, mark it as inactive
                $updated = \DB::table('users')
                    ->where('id', $userId)
                    ->update([
                        'is_active' => false,
                        // Append a timestamp to email to allow reuse of the original email for new accounts
                        'email' => $userEmail . '.deleted.' . time(),
                        // Invalidate the password
                        'password' => Hash::make(\Illuminate\Support\Str::random(32))
                    ]);
                
                if (!$updated) {
                    throw new \Exception('Failed to deactivate user account');
                }
                
                // Delete all related records
                
                // Delete fines
                \DB::table('fines')->where('user_id', $userId)->delete();
                
                // Delete borrowing records
                \DB::table('borrowing_records')->where('user_id', $userId)->delete();
                
                // Delete reservations
                \DB::table('reservations')->where('user_id', $userId)->delete();
                
                // Delete password reset tokens
                if (\Schema::hasTable('password_reset_tokens')) {
                    \DB::table('password_reset_tokens')->where('email', $userEmail)->delete();
                }
                
                // Delete personal access tokens
                if (\Schema::hasTable('personal_access_tokens')) {
                    \DB::table('personal_access_tokens')
                        ->where('tokenable_id', $userId)
                        ->where('tokenable_type', 'App\\Models\\User')
                        ->delete();
                }
                
                // Commit the transaction
                \DB::commit();
                
                return response()->json([
                    'status' => true,
                    'message' => 'Tài khoản đã được xóa thành công'
                ], 200);
                
            } catch (\Exception $e) {
                // Rollback the transaction if any error occurs
                \DB::rollBack();
                \Log::error('Error deactivating user account: ' . $e->getMessage());
                throw $e;
            }
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Không thể xóa tài khoản',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
