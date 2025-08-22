<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home');
})->name('home');

Route::get('/favorites', function () {
    return Inertia::render('Favorites');
})->name('favorites');

Route::get('/assets/{id}', function ($id) {
    return Inertia::render('AssetDetails', ['assetId' => $id]);
})->name('asset.details');
