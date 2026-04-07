<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->string('name'); // Ex: Açaí 500ml, Coxinha, etc.
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2); // Ex: 17.90
            $table->string('image_url')->nullable(); // Para as fotos reais do Açaí
            $table->boolean('is_available')->default(true); // Controle de estoque simples
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
