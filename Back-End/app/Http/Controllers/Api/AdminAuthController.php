<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Services\AdminAuthService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use App\Traits\RepositoryFileUploadTrait;
use App\Services\Interfaces\FileUploadServiceInterface;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AdminAuthController extends Controller
{
    use RepositoryFileUploadTrait;
    
    protected $adminAuthService;
    protected $fileUploadService;

    public function __construct(AdminAuthService $adminAuthService, FileUploadServiceInterface $fileUploadService)
    {
        $this->adminAuthService = $adminAuthService;
        $this->setFileUploadService($fileUploadService);
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $result = $this->adminAuthService->adminLogin($request->only('email', 'password'));
        
        if (!$result) {
            return response()->json([
                'message' => 'Invalid admin credentials or unauthorized access'
            ], 401);
        }

        return response()->json($result);
    }

    public function logout(Request $request)
    {
        $this->adminAuthService->adminLogout($request->user());
        return response()->json(['message' => 'Admin successfully logged out']);
    }

    // Lấy danh sách người dùng
    public function users()
    {
        // Lọc ra danh sách user không bao gồm admin (dựa vào email admin)
        $users = User::where('email', '!=', 'vanminhtruong95@gmail.com')->get();
        return response()->json($users);
    }

    // Lấy thông tin một người dùng cụ thể
    public function user($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }
        
        // Không cho phép xem thông tin của admin
        if ($user->email === 'vanminhtruong95@gmail.com') {
            return response()->json(['message' => 'Unauthorized access to admin information'], 403);
        }
        
        return response()->json($user);
    }

    // Cập nhật thông tin người dùng
    public function updateUser(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }
        
        // Không cho phép cập nhật thông tin của admin
        if ($user->email === 'vanminhtruong95@gmail.com') {
            return response()->json(['message' => 'Unauthorized to update admin information'], 403);
        }

        // Validate dữ liệu đầu vào
        $rules = [];
        
        // Chỉ validate các trường được gửi lên và không null
        if ($request->filled('name')) {
            $rules['name'] = 'required|string|max:255';
        }
        if ($request->filled('email')) {
            $rules['email'] = 'required|string|email|max:255';
            // Thêm rule unique nếu email thay đổi
            if ($request->email !== $user->email) {
                $rules['email'] .= '|unique:users,email,' . $id;
            }
        }
        if ($request->filled('phone')) {
            $rules['phone'] = 'nullable|string|max:20';
        }
        if ($request->filled('password')) {
            $rules['password'] = 'string|min:6';
        }
        if ($request->hasFile('image')) {
            $rules['image'] = 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048';
        }

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $data = [];
            
            // Chỉ cập nhật các trường được gửi lên và không null
            if ($request->filled('name')) {
                $data['name'] = $request->name;
            }
            if ($request->filled('email')) {
                $data['email'] = $request->email;
            }
            if ($request->filled('phone')) {
                $data['phone'] = $request->phone;
            } else if ($request->has('phone') && $request->phone === null) {
                // Nếu phone được gửi lên là null, set về null
                $data['phone'] = null;
            }
            
            // Cập nhật mật khẩu nếu được cung cấp
            if ($request->filled('password')) {
                $data['password'] = Hash::make($request->password);
            }
            
            // Xử lý upload file nếu có
            if ($request->hasFile('image')) {
                $fileFields = [
                    'image' => [
                        'path' => 'profile_images',
                        'options' => [
                            'disk' => 'public'
                        ],
                        'deleteOld' => true
                    ]
                ];
                $data = array_merge($data, $this->handleFileUploads($request->all(), $fileFields));
            } else if ($request->has('image') && $request->image === null) {
                // Nếu image được gửi lên là null, set về null
                $data['image'] = null;
            }
            
            $user->update($data);
            return response()->json([
                'message' => 'User updated successfully', 
                'user' => $user
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error updating user',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Xóa một người dùng
    public function deleteUser($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }
        
        // Không cho phép xóa tài khoản admin
        if ($user->email === 'vanminhtruong95@gmail.com') {
            return response()->json(['message' => 'Unauthorized to delete admin account'], 403);
        }

        $user->delete();
        return response()->json(['message' => 'User deleted successfully']);
    }
    
    /**
     * Kích hoạt hoặc vô hiệu hóa tài khoản người dùng
     *
     * @param int $id ID của người dùng
     * @return \Illuminate\Http\JsonResponse
     */
    public function toggleActive($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }
        
        // Không cho phép thay đổi trạng thái tài khoản admin
        if ($user->email === 'vanminhtruong95@gmail.com') {
            return response()->json(['message' => 'Unauthorized to modify admin account'], 403);
        }
        
        // Đảo ngược trạng thái kích hoạt
        $user->is_active = !$user->is_active;
        
        // Nếu đang kích hoạt lại tài khoản và email có định dạng .deleted.
        if ($user->is_active && strpos($user->email, '.deleted.') !== false) {
            // Khôi phục email ban đầu
            $originalEmail = explode('.deleted.', $user->email)[0];
            
            // Kiểm tra xem email gốc đã được sử dụng bởi tài khoản khác chưa
            $existingUser = User::where('email', $originalEmail)->first();
            if (!$existingUser) {
                $user->email = $originalEmail;
            }
        }
        
        $user->save();
        
        $status = $user->is_active ? 'activated' : 'deactivated';
        
        return response()->json([
            'message' => "User account has been {$status} successfully",
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'is_active' => $user->is_active
            ]
        ]);
    }

    // Thêm người dùng mới
    public function createUser(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'phone' => 'nullable|string|max:20',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $data = $request->all();
            
            // Xử lý upload file
            $fileFields = [
                'image' => [
                    'path' => 'profile_images',
                    'options' => [
                        'disk' => 'public'
                    ]
                ]
            ];
            
            $data = $this->handleFileUploads($data, $fileFields);
            
            // Sử dụng mật khẩu từ request
            $data['password'] = Hash::make($request->password);

            $user = User::create($data);

            return response()->json([
                'message' => 'User created successfully',
                'user' => $user
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error creating user',
                'error' => $e->getMessage()
            ], 500);
        }
    }
} 