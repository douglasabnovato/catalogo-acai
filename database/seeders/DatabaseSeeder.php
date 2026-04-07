<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Aqui chamamos o seeder específico do catálogo que você criou
        $this->call([
            CatalogSeeder::class,
        ]);
    }
}
