<?php

namespace App\Providers;

use App\Repositories\BookRepository;
use App\Repositories\BorrowingRepository;
use App\Repositories\Interfaces\BookRepositoryInterface;
use App\Repositories\Interfaces\BorrowingRepositoryInterface;
use App\Repositories\Interfaces\UserRepositoryInterface;
use App\Repositories\UserRepository;
use App\Services\FileUploadService;
use App\Services\Interfaces\FileUploadServiceInterface;
use App\Repositories\FineRepository;
use App\Repositories\Interfaces\FineRepositoryInterface;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(UserRepositoryInterface::class, UserRepository::class);
        $this->app->bind(BookRepositoryInterface::class, BookRepository::class);
        $this->app->bind(BorrowingRepositoryInterface::class, BorrowingRepository::class);
        $this->app->bind(FileUploadServiceInterface::class, FileUploadService::class);
        $this->app->bind(FineRepositoryInterface::class, FineRepository::class);
    }

    public function boot(): void
    {
        //
    }
}
