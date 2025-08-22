<?php

use App\Http\Controllers\Api\AssetController;
use App\Http\Controllers\Api\FavoriteController;
use Illuminate\Support\Facades\Route;

Route::get('/assets', [AssetController::class, 'index']);
Route::get('/assets/{id}', [AssetController::class, 'show']);
Route::get('/assets/{id}/market_chart', [AssetController::class, 'marketChart']);

Route::get('/favorites', [FavoriteController::class, 'index']);
Route::post('/favorites', [FavoriteController::class, 'store']);
Route::delete('/favorites/{id}', [FavoriteController::class, 'destroy']);
