<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\EventController;
// use App\Http\Controllers\AuthController; // AuthController is no longer needed here if auth routes are moved

// No more Route::middleware('web') here for auth routes.

// Authenticated API routes (these will be protected by Sanctum's token/session guard)
Route::middleware('auth:sanctum')->group(function () {
    // If you moved '/user' and '/logout' to web.php, remove them from here.
    // Route::get('/user', function (Request $request) { /* ... */ });
    // Route::post('/logout', [AuthController::class, 'logout']);

    // Protected event routes
    Route::post('/events', [EventController::class, 'store']);
    Route::put('/events/{id}', [EventController::class, 'update']);
    Route::delete('/events/{id}', [EventController::class, 'destroy']);
});

// Public event list route (no auth required)
Route::get('/events', [EventController::class, 'index']);

// Simple test route
Route::get('/test', function () {
    return response()->json(['message' => 'API is working']);
});
