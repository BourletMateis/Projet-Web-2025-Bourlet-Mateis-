<?php

use App\Http\Controllers\RetroController;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/retros', [RetroController::class, 'index']); 
    Route::post('/retros', [RetroController::class, 'store']); 
    Route::get('/retros/{retro}', [RetroController::class, 'show']);

    Route::post('/retros/{retro}/columns/{column}/cards', [RetroController::class, 'addCard']); 
    Route::put('/retros/cards/{card}/move', [RetroController::class, 'moveCard']);
});
