<?php

namespace App\Http\Controllers\Blog;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Str;
use Illuminate\Database\QueryException;

class ArticlesController extends Controller
{
    public function getAllArticles(Request $request)
    {
        $offset = (int) $request->get('offset', 0);
        $limit = (int) $request->get('limit', 5);
        $sort_by = $request->get('sort_by', 'id');
        $sort_order = $request->get('sort_order', 'desc');

        $query = Article::query();

        $totalRecords = $query->count();

        $articles = $query->where('status', 'published')
            ->with('category')
            ->orderBy($sort_by, $sort_order)
            ->skip($offset)
            ->take($limit)
            ->get();

        $data = $articles->map(function ($article) {
            return [
                'id' => $article->id,
                'title' => $article->title,
                'excerpt' => $article->excerpt,
                'featured_image' => $article->featured_image,
                'slug' => $article->slug,
                'category_id' => $article->category_id,
                'category' => $article->category ? $article->category->name : null,
                'author' => $article->user ? $article->user->name : null,
                'created_at' => $article->created_at->format('Y-m-d'),
                'updated_at' =>  $article->updated_at !== null ? $article->updated_at->format('Y-m-d') : null,
            ];
        });


        return response()->json([
            'data' => $data,
            'offset' => $offset,
            'limit' => $limit,
            'total' => $totalRecords,
        ], 200, ['Content-Type' => 'application/json']);
    }

    public function getAllArticlesByCategory(Request $request)
    {
        $offset = (int) $request->get('offset', 0);
        $limit = (int) $request->get('limit', 5);
        $sort_by = $request->get('sort_by', 'id');
        $sort_order = $request->get('sort_order', 'desc'); 
        $categoryId = (int) $request->get('category_id');

        if (!$categoryId) {
            return response()->json(['status' => 'error', 'message' => 'Category ID is required'], 400, ['Content-Type' => 'application/json']);
        }

        $query = Article::where('category_id', $categoryId);
        $totalRecords = $query->count();

        $articles = $query->orderBy('id', 'desc')
            ->skip($offset)
            ->take($limit)
            ->orderBy($sort_by, $sort_order)
            ->get();

        return response()->json([
            'data' => $articles,
            'offset' => $offset,
            'limit' => $limit,
            'total' => $totalRecords,
        ], 200, ['Content-Type' => 'application/json']);
    }

    public function getArticleBySlug($slug)
    {
        $article = Article::with(['category', 'user'])
            ->where('slug', $slug)
            ->first();

        if (!$article) {
            return response()->json(['error' => 'Article not found'], 404, ['Content-Type' => 'application/json']);
        }

        $data = [
            'id' => $article->id,
            'title' => $article->title,
            'excerpt' => $article->excerpt,
            'full_content' => $article->full_content,
            'featured_image' => $article->featured_image,
            'slug' => $article->slug,
            'category_id' => $article->category_id,
            'category' => $article->category?->name,
            'author' => $article->user?->name,
            'created_at' => $article->created_at->format('Y-m-d H:i:s'),
        ];

        return response()->json($data, 200, ['Content-Type' => 'application/json']);
    }

    public function postArticle(Request $request)
    {
        try {
            $request->validate([
                'title' => 'required|string|max:255',
                'excerpt' => 'required|string|max:255',
                'full_content' => 'required|string|max:10000',
                'featured_image' => 'required|string|max:255',
                'category_id' => 'required|integer|exists:categories,id',
                'status' => 'sometimes|required|string|in:draft,published'
            ]);

            $user = JWTAuth::parseToken()->authenticate();

            if (!$user->can('add articles')) {
                return response()->json(['status' => 'error', 'message' => 'Unauthorized'], 403, ['Content-Type' => 'application/json']);
            }

            $article = new Article();
            $article->title = $request->title;
            $article->slug = Str::slug($request->title);
            $article->excerpt = $request->excerpt;
            $article->full_content = $request->full_content;
            $article->featured_image = '';
            $article->category_id = $request->category_id;
            $article->user_id = $user->id;
            $article->status = 'draft';

            $article->save();

            return response()->json(['success' => true, 'message' => 'Article created successfully'], 201, ['Content-Type' => 'application/json']);
        } catch (QueryException $e) {
            if ($e->getCode() === '23000') {
                return response()->json([
                    'success' => 'error',
                    'message' => 'Duplicated Article or Invalid Category',
                ], 200, ['Content-Type' => 'application/json']);
            }
            return response()->json([
                'success' => 'error',
                'message' => 'Database Error',
                'error' => $e->getMessage()
            ], 500, ['Content-Type' => 'application/json']);
        }
    }

    public function updateArticle(Request $request, $id)
    {
        $article = Article::find($id);
        if (!$article) {
            return response()->json(['status' => 'error', 'message' => 'Article not found'], 404, ['Content-Type' => 'application/json']);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'excerpt' => 'required|string|max:255',
            'full_content' => 'required|string|max:10000',
            'featured_image' => 'required|string|max:255',
            'category_id' => 'required|integer|exists:categories,id',
            'status' => 'sometimes|required|string|in:draft,published'
        ]);

        $user = JWTAuth::parseToken()->authenticate();

        if (!$user->can('edit own articles')) {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized'], 403, ['Content-Type' => 'application/json']);
        }

        if ($request->has('title')) {
            $article->title = $request->title;
        }
        if ($request->has('excerpt')) {
            $article->excerpt = $request->excerpt;
        }
        if ($request->has('full_content')) {
            $article->full_content = $request->full_content;
        }
        if ($request->has('featured_image')) {
            $article->featured_image = $request->featured_image;
        }
        if ($request->has('category_id')) {
            $article->category_id = $request->category_id;
        }
        if ($request->has('status')) {
            $article->status = $request->status;
        }

        if ($article->save()) {
            return response()->json(['status' => 'success', 'message' => 'Article updated successfully', 'article' => $article], 200, ['Content-Type' => 'application/json']);
        }

        return response()->json(['status' => 'error', 'message' => 'Failed to update article'], 500, ['Content-Type' => 'application/json']);
    }

    public function deleteArticle($id)
    {
        $article = Article::find($id);

        if (!$article) {
            return response()->json(['status' => 'error', 'message' => 'Article not found'], 404, ['Content-Type' => 'application/json']);
        }

        $user = JWTAuth::parseToken()->authenticate();

        if (!$user->can('delete own articles')) {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized'], 403, ['Content-Type' => 'application/json']);
        }

        if ($article->delete()) {
            return response()->json(['status' => 'success', 'message' => 'Article deleted successfully'], 200, ['Content-Type' => 'application/json']);
        }

        return response()->json(['status' => 'error', 'message' => 'Failed to delete article'], 500, ['Content-Type' => 'application/json']);
    }

    public function uploadFeaturedImage(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'path' => 'required|string'
        ]);

        $user = JWTAuth::parseToken()->authenticate();

        if (!$user->can('add articles') || !$user->can('edit articles')) {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized'], 403, ['Content-Type' => 'application/json']);
        }

        $image = $request->file('image');
        $customPath = trim($request->path, '/'); // Καθαρισμός slashes
        $destinationPath = public_path("assets/images/{$customPath}");

        // Δημιουργία φακέλου αν δεν υπάρχει
        if (!file_exists($destinationPath)) {
            mkdir($destinationPath, 0755, true);
        }

        $fileName = uniqid() . '.' . $image->getClientOriginalExtension();
        $image->move($destinationPath, $fileName);

        $relativePath = "assets/images/{$customPath}/{$fileName}";

        return response()->json([
            'status' => 'success',
            'message' => 'Image uploaded successfully',
            'path' => $relativePath,
            'url' => url($relativePath),
        ], 200, ['Content-Type' => 'application/json']);
    }
}
