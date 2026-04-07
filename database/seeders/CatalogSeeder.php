<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CatalogSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Criar Categorias Principais
        $catAcai = Category::create(['name' => 'Açaí Artesanal', 'slug' => 'acai-artesanal']);
        $catSalgados = Category::create(['name' => 'Salgados', 'slug' => 'salgados']);
        $catBebidas = Category::create(['name' => 'Sucos e Vitaminas', 'slug' => 'sucos-e-vitaminas']);
        $catCasa = Category::create(['name' => 'Para Casa', 'slug' => 'para-casa']);

        // 2. Inserir Açaís (Montagem Artesanal)
        $acais = [
            ['name' => 'Açaí 300ml', 'price' => 17.90],
            ['name' => 'Açaí 400ml', 'price' => 21.90],
            ['name' => 'Açaí 500ml', 'price' => 24.90],
            ['name' => 'Açaí 700ml', 'price' => 26.90],
        ];

        foreach ($acais as $item) {
            Product::create([
                'category_id' => $catAcai->id,
                'name' => $item['name'],
                'price' => $item['price'],
                'description' => 'Monte do seu jeito: Direito a 3 acompanhamentos grátis em camadas.'
            ]);
        }

        // 3. Inserir Adicional Especial (Upsell)
        Product::create([
            'category_id' => $catAcai->id,
            'name' => 'Adicional de Whey Protein',
            'price' => 9.00,
            'description' => 'Pode ser adicionado no açaí ou nas vitaminas.'
        ]);

        // 4. Inserir Salgados (Preço Único R$ 9,50)
        $salgados = [
            'Esfiha de Frango c/ Catupiry',
            'Esfiha de Carne',
            'Enrolado Presunto e Queijo',
            'Pastel Integral de Frango',
            'Cigarrete Presunto e Queijo',
            'Coxinha de Frango c/ Catupiry'
        ];

        foreach ($salgados as $nome) {
            Product::create([
                'category_id' => $catSalgados->id,
                'name' => $nome,
                'price' => 9.50
            ]);
        }

        // 5. Inserir Bebidas e Vitaminas (Preço Único R$ 11,90)
        $bebidas = ['Suco de Morango', 'Suco de Frutas Vermelhas', 'Suco de Maracujá', 'Vitamina de Banana'];

        foreach ($bebidas as $nome) {
            Product::create([
                'category_id' => $catBebidas->id,
                'name' => $nome,
                'price' => 11.90
            ]);
        }

        // 6. Inserir Linha Para Casa (Bulk)
        Product::create(['category_id' => $catCasa->id, 'name' => 'Açaí 1 Litro', 'price' => 39.00]);
        Product::create(['category_id' => $catCasa->id, 'name' => 'Açaí Barra 1kg', 'price' => 29.00]);
        Product::create(['category_id' => $catCasa->id, 'name' => 'Granola 1kg', 'price' => 39.00]);
    }
}
