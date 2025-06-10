<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    // Register new user
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|string|unique:users,email',
            'password' => 'required|string|min:4|confirmed', // expects password_confirmation
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        // Optionally login the user immediately after registration
        Auth::login($user);

        return response()->json([
            'message' => 'User registered successfully',
            'user' => $user,
        ], 201);
    }

    // Login user (cookie session-based)
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email|string',
            'password' => 'required|string',
        ]);

        if (!Auth::attempt($credentials)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Regenerate session to prevent fixation
        $request->session()->regenerate();

        return response()->json([
            'message' => 'Login successful',
            'user' => Auth::user(),
        ]);
    }

    // Logout user
    public function logout(Request $request)
    {
        // 1. Revoke the current access token (if any).
        // This is important if you ever issue API tokens, even if your SPA primarily uses session.
        if ($request->user()) { // Check if a user is authenticated
            $request->user()->currentAccessToken()->delete();
        }

        // 2. Explicitly log out from the 'web' guard (for session authentication).
        // This is crucial for Sanctum SPAs using sessions.
        Auth::guard('web')->logout();

        // 3. Invalidate and regenerate the session.
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'message' => 'Logged out successfully',
        ], 200); // Return a 200 OK or 204 No Content
    }
    // Get authenticated user
    public function user(Request $request)
    {
        return response()->json($request->user());
    }
}
