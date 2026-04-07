<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        $categories = Category::with('products')->get();
        return Inertia::render('Welcome', [
            'categories' => $categories
        ]);
    }
}
