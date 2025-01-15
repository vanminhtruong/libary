<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AdminAccess
{
    public function handle(Request $request, Closure $next)
    {
        $user = auth()->user();
        $token = auth()->getToken();
        $payload = auth()->getPayload($token);
        
        // Kiểm tra role từ JWT payload
        if (!$payload || !$payload->get('role') || $payload->get('role') !== 3) {
            return response()->json([
                'message' => 'Unauthorized. Admin access required.'
            ], 403);
        }
        
        return $next($request);
    }
}
