<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Fiction', 'description' => 'Fiction books including novels and short stories'],
            ['name' => 'Fantasy', 'description' => 'Fantasy and magical fiction books'],
            ['name' => 'Science Fiction', 'description' => 'Science fiction and futuristic books'],
            ['name' => 'Non-fiction', 'description' => 'Non-fiction books including biographies and educational materials'],
            ['name' => 'Classic', 'description' => 'Classic literature and timeless works']
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
