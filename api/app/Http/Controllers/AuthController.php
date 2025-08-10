<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    // 🔐 Login
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (! $token = JWTAuth::attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $cookie = cookie(
            'token',         // Όνομα cookie
            $token,          // JWT token
            60,              // Διάρκεια σε λεπτά
            '/',             // Path
            null,            // Domain (ή '.datatex.gr' σε deployment)
            true,           // Secure (true μόνο για HTTPS)
            true,            // HttpOnly
            false,           // Raw
            'Strict'         // SameSite: 'Lax' ή 'Strict'
        );

        return response()->json(['status' => 'success'])->cookie($cookie);
    }

    public function isAdmin(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        if ($user && $user->hasRole('admin')) {
            return response()->json(['isAdmin' => true]);
        }
        return response()->json(['isAdmin' => false]);
    }

    // 📝 Register
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user = User::create([
            'name'          => $request->name,
            'email'         => $request->email,
            'password'      => Hash::make($request->password),
            'avatar_url'    => isset($request->avatar_url) ? $request->avatar_url : config('app.url') .  '/assets/images/demo-avatar.png', // Default avatar
        ]);

        $user->assignRole('user'); // Assign default role

        return response()->json([
            'status' => 'success',
            'user'   => $user,
        ], 201);
    }

    public function updateUser(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $targetUser = $user; // default: the authenticated user

        if ($user->hasRole('admin') && $request->input('id')) {
            $targetUser = User::find($request->input('id'));
            if (!$targetUser) {
                return response()->json(['error' => 'User not found.'], 404);
            }
        } elseif ($request->filled('id')) {
            // Non-admins shouldn't be allowed to update other users
            return response()->json(['error' => 'Unauthorized to update another user.'], 403);
        }

        $validator = Validator::make($request->all(), [
            'name'     => 'sometimes|required|string|max:255',
            'email'    => 'sometimes|required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'sometimes|nullable|string|min:6|confirmed',
            'avatar_url' => 'sometimes|nullable|url',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $targetUser->update($request->only('name', 'email', 'password', 'avatar_url'));

        return response()->json(['status' => 'success', 'user' => $targetUser]);
    }

    public function deleteUser(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $targetUser = $user; // default: the authenticated user

        if ($user->hasRole('admin') && $request->filled('id')) {
            $targetUser = User::find($request->input('id'));
            if (!$targetUser) {
                return response()->json(['error' => 'User not found.'], 404);
            }
        } elseif ($request->filled('id')) {
            // Non-admins shouldn't be allowed to update other users
            return response()->json(['error' => 'Unauthorized to update another user.'], 403);
        }

        $targetUser->delete();
        return response()->json(['status' => 'success', 'message' => 'User deleted successfully']);

        return response()->json(['status' => 'error', 'message' => 'User not found'], 404);
    }

    public function isActive(Request $request)
    {
        $userID = $request->input('id');
        $user = User::find($userID);
        if ($user) {
            return response()->json(['isActive' => $user->isActive === 1 ? true : false]);
        }
        return response()->json(['error' => 'User not found'], 404);
    }

    // 👤 Επιστροφή χρήστη
    public function me()
    {
        return response()->json(JWTAuth::parseToken()->authenticate());
    }

    // 🚪 Logout (invalidate token)
    public function logout()
    {
        JWTAuth::invalidate(JWTAuth::getToken());

        return response()->json(['message' => 'Successfully logged out']);
    }

    // 🔁 Refresh token
    public function refresh()
    {
        return $this->respondWithToken(JWTAuth::refresh(JWTAuth::getToken()));
    }

    // 🔧 Format token response
    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type'   => 'bearer',
            'expires_in'   => JWTAuth::factory()->getTTL() * 30
        ]);
    }

    public function getUsersDropdown(Request $request)
    {
        $users_dropdown = [];
        $users = User::all();
        foreach ($users as $user) {
            $users_dropdown[] = ['id' => $user->id, 'name' => $user->name];
        }
        return response()->json($users_dropdown);
    }
}
