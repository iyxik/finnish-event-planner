<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EventController;

// Get events
Route::get('/events', [EventController::class, 'index']);

// Create
Route::post('/events', [EventController::class, 'store']);

// Update
Route::put('/events/{id}', [EventController::class, 'update']);

// Delete 
Route::delete('/events/{id}', [EventController::class, 'destroy']);


Route::get('/test', function () {
    return response()->json(['message' => 'API is working']);
});
