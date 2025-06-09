<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController; // Import your AuthController
use Illuminate\Http\Request;




// Route that serves your React app (usually for all frontend routes)
Route::get('/', function () {
    return view('welcome');
})->name('home');

// --- AUTHENTICATION ROUTES (MUST be in web.php for Sanctum SPA) ---
// These routes automatically use the 'web' middleware group, which includes
// session management, CSRF protection, and Sanctum's EnsureFrontendRequestsAreStateful.

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Logout needs 'auth:sanctum' middleware because you need to be logged in to logout
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

// Route to get the authenticated user (also good to have in web.php for SPA)
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
// --- END AUTHENTICATION ROUTES ---

// IMPORTANT: Catch-all route for React Router (must be the LAST route in web.php)
// This ensures that any path not defined by Laravel (like /dashboard, /profile)
// is handled by your React app, by returning the 'welcome' view.
Route::get('/{any}', function () {
    return view('welcome');
})->where('any', '.*'); // The 'web' middleware is automatically applied here.