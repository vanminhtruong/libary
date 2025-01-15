<?php

namespace App\Services;

use App\Services\Interfaces\FileUploadServiceInterface;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FileUploadService implements FileUploadServiceInterface
{
    public function upload(UploadedFile $file, string $path, array $options = []): ?string
    {
        try {
            // Validate file
            if (!$this->validateFile($file, $options)) {
                return null;
            }

            // Generate filename
            $filename = $this->generateFileName($file);

            // Store file
            $filePath = $file->storeAs($path, $filename, 'public');

            return $filePath;
        } catch (\Exception $e) {
            \Log::error('File upload error: ' . $e->getMessage());
            return null;
        }
    }

    public function uploadMultiple(array $files, string $path, array $options = []): array
    {
        $uploadedPaths = [];

        foreach ($files as $file) {
            if ($file instanceof UploadedFile) {
                $uploadedPath = $this->upload($file, $path, $options);
                if ($uploadedPath) {
                    $uploadedPaths[] = $uploadedPath;
                }
            }
        }

        return $uploadedPaths;
    }

    public function delete(string $path): bool
    {
        try {
            return Storage::disk('public')->delete($path);
        } catch (\Exception $e) {
            \Log::error('File deletion error: ' . $e->getMessage());
            return false;
        }
    }

    protected function validateFile(UploadedFile $file, array $options): bool
    {
        // Check mime type
        if (isset($options['mimeTypes']) && !empty($options['mimeTypes'])) {
            if (!in_array($file->getMimeType(), $options['mimeTypes'])) {
                return false;
            }
        }

        // Check file size
        if (isset($options['maxSize'])) {
            $maxSizeInBytes = $options['maxSize'] * 1024 * 1024; // Convert MB to bytes
            if ($file->getSize() > $maxSizeInBytes) {
                return false;
            }
        }

        return true;
    }

    protected function generateFileName(UploadedFile $file): string
    {
        $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $extension = $file->getClientOriginalExtension();
        $timestamp = now()->timestamp;
        $random = Str::random(8);
        
        return Str::slug($originalName) . '-' . $timestamp . '-' . $random . '.' . $extension;
    }
} 