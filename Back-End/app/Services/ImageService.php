<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class ImageService
{
    public function uploadImage(UploadedFile $image, string $folder = 'images')
    {
        // Generate unique filename
        $filename = uniqid() . '_' . time() . '.' . $image->getClientOriginalExtension();
        
        // Store image in public storage
        $path = $image->storeAs("public/{$folder}", $filename);
        
        // Return the relative path
        return str_replace('public/', '', $path);
    }
} 