<?php

namespace App\Services;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class OtpService
{
    /**
     * Generate a new OTP for the user
     *
     * @param User $user
     * @return string
     */
    public function generateOtp(User $user): string
    {
        // Generate a 6-digit OTP
        $otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        
        // Store OTP in the database
        $user->update([
            'otp_code' => $otp,
            'otp_expires_at' => Carbon::now()->addMinutes(10), // OTP expires in 10 minutes
            'otp_verified' => false,
            'otp_attempts' => 0
        ]);
        
        return $otp;
    }
    
    /**
     * Verify the OTP provided by the user
     *
     * @param User $user
     * @param string $otp
     * @return bool
     */
    public function verifyOtp(User $user, string $otp): bool
    {
        // Check if OTP is expired
        if (Carbon::now()->gt($user->otp_expires_at)) {
            return false;
        }
        
        // Check if OTP matches
        if ($user->otp_code !== $otp) {
            // Increment attempts
            $user->increment('otp_attempts');
            return false;
        }
        
        // Mark OTP as verified
        $user->update([
            'otp_verified' => true
        ]);
        
        return true;
    }
    
    /**
     * Check if the user has a verified OTP
     *
     * @param User $user
     * @return bool
     */
    public function hasVerifiedOtp(User $user): bool
    {
        return $user->otp_verified;
    }
    
    /**
     * Reset the OTP verification status
     *
     * @param User $user
     * @return void
     */
    public function resetOtpVerification(User $user): void
    {
        $user->update([
            'otp_code' => null,
            'otp_expires_at' => null,
            'otp_verified' => false,
            'otp_attempts' => 0
        ]);
    }
    
    /**
     * Check if the user has exceeded the maximum number of OTP attempts
     *
     * @param User $user
     * @param int $maxAttempts
     * @return bool
     */
    public function hasExceededMaxAttempts(User $user, int $maxAttempts = 3): bool
    {
        return $user->otp_attempts >= $maxAttempts;
    }
}
