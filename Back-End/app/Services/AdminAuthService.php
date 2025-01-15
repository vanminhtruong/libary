<?php

namespace App\Services;

use App\Repositories\Interfaces\UserRepositoryInterface;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AdminAuthService
{
    protected $userRepository;
    private const ADMIN_EMAIL = 'vanminhtruong95@gmail.com';

    public function __construct(UserRepositoryInterface $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    public function adminLogin(array $credentials) 
    {
        // Check if email matches admin email
        if ($credentials['email'] !== self::ADMIN_EMAIL) {
            return null;
        }

        // Get user from database
        $user = $this->userRepository->findByEmail($credentials['email']);
        
        if (!$user) {
            return null;
        }

        // Verify password from database
        if (!Hash::check($credentials['password'], $user->password)) {
            return null;
        }

        // Login and generate token
        $token = auth()->login($user);

        if (!$token) {
            return null;
        }

        return [
            'status' => 200,
            'message' => 'Login successful',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email
            ],
            'token' => $token,
            'token_type' => 'Bearer',
            'expires_in' => auth()->factory()->getTTL() * 60
        ];
    }

    public function adminLogout()
    {
        auth()->logout();
        return true;
    }
}