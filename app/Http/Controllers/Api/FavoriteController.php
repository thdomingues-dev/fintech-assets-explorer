<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Favorite;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class FavoriteController extends Controller
{
    public function index()
    {
        $favorites = Favorite::all();
        
        return response()->json($favorites);
    }

    public function store(Request $request)
    {
        $request->validate([
            'assetId' => 'required|string',
        ]);

        try {
            $favorite = Favorite::firstOrCreate([
                'asset_id' => $request->assetId,
            ]);

            return response()->json($favorite, 201);
        } catch (\Illuminate\Database\QueryException $e) {
            return response()->json([
                'error' => 'Unable to add favorite',
            ], 422);
        }
    }

    public function destroy($id)
    {
        $favorite = Favorite::find($id);
        
        if (!$favorite) {
            return response()->json(['error' => 'Favorite not found'], 404);
        }

        $favorite->delete();

        return response()->json(['message' => 'Favorite removed successfully']);
    }
}
