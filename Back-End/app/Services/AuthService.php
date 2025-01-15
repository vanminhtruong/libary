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
        $user = $this->userRepository->findByEmail($credentials['email']);
        
        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return null;
        }

        $customClaims = ['role' => 1];
        $token = auth()->guard('api')->claims($customClaims)->login($user);

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
} 