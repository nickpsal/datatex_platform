<?php

namespace App\Http\Controllers\Blog;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Database\QueryException;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;

class CategoriesController extends Controller
{
    public function getAllCategories(Request $request)
    {
        $offset = (int) $request->get('offset', 0);
        $limit = (int) $request->get('limit', 5);

        $query = Category::query();

        $totalRecords = $query->count();

        $categories = $query->orderBy('id', 'desc')
            ->skip($offset)
            ->take($limit)
            ->get();

        return response()->json([
            'data' => $categories,
            'offset' => $offset,
            'limit' => $limit,
            'total' => $totalRecords,
        ], 200, ['Content-Type' => 'application/json']);
    }

    public function postCategory(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string|max:1000',
            ]);

            $user = JWTAuth::parseToken()->authenticate();

            if (!$user->can('add categories')) {
                return response()->json(['status' => 'error', 'message' => 'Unauthorized'], 403, ['Content-Type' => 'application/json']);
            }

            $category = new Category();
            $category->name = $request->name;
            $category->slug = Str::slug($request->name);
            $category->description = $request->description ?? null;

            $category->save();

            return response()->json(['success' => true, 'message' => 'Category created successfully'], 201, ['Content-Type' => 'application/json']);
        } catch (QueryException $e) {
            if ($e->getCode() === '23000') {
                return response()->json([
                    'success' => 'error',
                    'message' => 'Duplicated Category',
                ], 200, ['Content-Type' => 'application/json']);
            }
            return response()->json([
                'success' => 'error',
                'message' => 'Database Error',
                'error' => $e->getMessage()
            ], 500, ['Content-Type' => 'application/json']);
        }
    }

    public function updateCategory(Request $request, $id)
    {
        try {
            $category = Category::find($id);

            if (!$category) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Category not found'
                ], 404, ['Content-Type' => 'application/json']);
            }

            $user = JWTAuth::parseToken()->authenticate();

            if (!$user->can('edit categories')) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized'
                ], 403, ['Content-Type' => 'application/json']);
            }

            $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string|max:1000',
            ]);

            $category->name = $request->name;
            $category->slug = Str::slug($request->name);
            $category->description = $request->description ?? null;
            $category->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Category updated successfully'
            ], 200, ['Content-Type' => 'application/json']);
        } catch (QueryException $e) {
            if ($e->getCode() === '23000') {
                return response()->json([
                    'success' => 'error',
                    'message' => 'Duplicated Category',
                ], 200, ['Content-Type' => 'application/json']);
            }
            return response()->json([
                'success' => 'error',
                'message' => 'Database Error',
                'error' => $e->getMessage()
            ], 500, ['Content-Type' => 'application/json']);
        }
    }

    public function deleteCategory($id)
    {
        $category = Category::find($id);

        if (!$category) {
            return response()->json(['status' => 'error', 'message' => 'Category not found'], 404, ['Content-Type' => 'application/json']);
        }

        $user = JWTAuth::parseToken()->authenticate();

        if (!$user->can('delete categories')) {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized'], 403, ['Content-Type' => 'application/json']);
        }

        $category->delete();

        return response()->json(['status' => 'success', 'message' => 'Category deleted successfully'], 200, ['Content-Type' => 'application/json']);
    }
}
