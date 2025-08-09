<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Category;
use App\Models\User;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Str;
use Illuminate\Database\QueryException;

class AdminController extends Controller
{
    public function stats() {
        $totalArticles = Article::where('status', 'published')->count();
        $totalCategories = Category::count();
        $totalUsers = User::count();
        return response()->json([
            'data' => [
                'total_articles' => $totalArticles,
                'total_categories' => $totalCategories,
                'total_users' => $totalUsers
            ]
        ]);
    }    
}