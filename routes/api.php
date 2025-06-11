<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\EventController;

Route::middleware('auth:sanctum')->group(function () {

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
