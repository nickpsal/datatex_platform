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
            true,            // Secure (true μόνο για HTTPS)
            true,            // HttpOnly
            false,           // Raw
            'Lax'            // SameSite: 'Lax' ή 'Strict'
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
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $user->assignRole('user'); // Assign default role

        return response()->json([
            'status' => 'success',
            'user'   => $user,
        ], 201);
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
}
