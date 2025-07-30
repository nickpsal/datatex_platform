<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Blog\ArticlesController;
use App\Http\Controllers\Blog\CategoriesController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::get('/getarticles', [ArticlesController::class, 'getAllArticles']);
Route::get('/getarticlesbycategory', [ArticlesController::class, 'getAllArticlesByCategory']);
Route::get('/getarticle/{slug}', [ArticlesController::class, 'getArticleBySlug']);

Route::get('/getcategories', [CategoriesController::class, 'getAllCategories']);

Route::middleware('auth:api')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/updateuser', [AuthController::class, 'updateUser']);
    Route::delete('/deleteuser', [AuthController::class, 'deleteUser']);
    Route::post('/isactive', [AuthController::class, 'isActive']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/refresh', [AuthController::class, 'refresh']);

    //checking if user is admin
    Route::get('/isadmin', [AuthController::class, 'isAdmin']);

    // Categories routes
    Route::post('/createcategory', [CategoriesController::class, 'postCategory']);
    Route::put('/updatecategory/{id}', [CategoriesController::class, 'updateCategory']);
    Route::delete('/deletecategory/{id}', [CategoriesController::class, 'deleteCategory']);
    
    // Articles routes
    Route::post('/uploadimage', [ArticlesController::class, 'uploadFeaturedImage']);
    Route::post('/createarticle', [ArticlesController::class, 'postArticle']);
    Route::put('/updatearticle/{id}', [ArticlesController::class, 'updateArticle']);
    Route::delete('/deletearticle/{id}', [ArticlesController::class, 'deleteArticle']);
});
