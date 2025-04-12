<?php

namespace App\Services;

use App\Repositories\Interfaces\UserRepositoryInterface;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class AuthService
{
    protected $userRepository;

    public function __construct(UserRepositoryInterface $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    public function register(array $data)
    {
        $data['password'] = Hash::make($data['password']);
        $user = $this->userRepository->create($data);
        $token = auth()->guard('api')->login($user);

        return [
            'user' => $user,
            'access_token' => $token,
            'token_type' => 'Bearer'
        ];
    }

    public function login(array $credentials)
    {
        if (!$token = auth()->guard('api')->attempt($credentials)) {
            return null;
        }

        $user = auth()->guard('api')->user();

        return [
            'user' => $user,
            'access_token' => $token,
            'token_type' => 'Bearer',
            'expires_in' => auth()->factory()->getTTL() * 60
        ];
    }

    public function updateProfile($userId, array $data)
    {
        if (isset($data['image']) && $data['image']) {
            $imagePath = $data['image']->store('profile_images', 'public');
            $data['image'] = $imagePath;
        }

        return $this->userRepository->update($userId, $data);
    }

    public function logout($user)
    {
        return $user->currentAccessToken()->delete();
    }

    /**
     * Reset password using email
     *
     * @param string $email
     * @param string $password
     * @return array|null
     */
    public function resetPasswordByEmail(string $email, string $password)
    {
        // Find user by email
        $user = $this->userRepository->findByEmail($email);

        if (!$user) {
            return null;
        }

        // Update user password
        $this->userRepository->update($user->id, [
            'password' => Hash::make($password)
        ]);

        // Return user data
        return [
            'user' => $user,
            'message' => 'Password reset successfully'
        ];
    }
}