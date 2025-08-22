<?php

use App\Models\Favorite;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

describe('Favorites API Endpoints', function () {
    it('can retrieve empty favorites list', function () {
        $response = $this->get('/api/favorites');

        $response->assertStatus(200)
                ->assertJson([]);
    });

    it('can add asset to favorites', function () {
        $response = $this->post('/api/favorites', [
            'assetId' => 'bitcoin'
        ]);

        $response->assertStatus(201)
                ->assertJsonStructure([
                    'id',
                    'asset_id',
                    'created_at',
                    'updated_at'
                ])
                ->assertJson([
                    'asset_id' => 'bitcoin'
                ]);


        $this->assertDatabaseHas('favorites', [
            'asset_id' => 'bitcoin'
        ]);
    });

    it('prevents duplicate favorites', function () {
        // Create initial favorite
        Favorite::create(['asset_id' => 'bitcoin']);

        $response = $this->post('/api/favorites', [
            'assetId' => 'bitcoin'
        ]);

        $response->assertStatus(201); // firstOrCreate returns existing record
        

        expect(Favorite::where('asset_id', 'bitcoin')->count())->toBe(1);
    });

    it('validates required assetId field', function () {
        $response = $this->postJson('/api/favorites', []);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['assetId']);
    });

    it('can retrieve favorites list', function () {
        // Create test favorites
        Favorite::create(['asset_id' => 'bitcoin']);
        Favorite::create(['asset_id' => 'ethereum']);

        $response = $this->get('/api/favorites');

        $response->assertStatus(200)
                ->assertJsonCount(2)
                ->assertJsonStructure([
                    '*' => [
                        'id',
                        'asset_id',
                        'created_at',
                        'updated_at'
                    ]
                ]);


        $favorites = $response->json();
        $assetIds = array_column($favorites, 'asset_id');
        expect($assetIds)->toContain('bitcoin')
                        ->and($assetIds)->toContain('ethereum');
    });

    it('can remove favorite by id', function () {
        $favorite = Favorite::create(['asset_id' => 'bitcoin']);

        $response = $this->delete("/api/favorites/{$favorite->id}");

        $response->assertStatus(200)
                ->assertJson([
                    'message' => 'Favorite removed successfully'
                ]);


        $this->assertDatabaseMissing('favorites', [
            'id' => $favorite->id
        ]);
    });

    it('returns 404 when trying to delete non-existent favorite', function () {
        $response = $this->delete('/api/favorites/999');

        $response->assertStatus(404)
                ->assertJson([
                    'error' => 'Favorite not found'
                ]);
    });

    it('maintains data integrity with multiple operations', function () {
        // Add multiple favorites
        $this->post('/api/favorites', ['assetId' => 'bitcoin']);
        $this->post('/api/favorites', ['assetId' => 'ethereum']);
        $this->post('/api/favorites', ['assetId' => 'cardano']);


        expect(Favorite::count())->toBe(3);

        // Remove one
        $ethereum = Favorite::where('asset_id', 'ethereum')->first();
        $this->delete("/api/favorites/{$ethereum->id}");


        expect(Favorite::count())->toBe(2);
        $this->assertDatabaseHas('favorites', ['asset_id' => 'bitcoin']);
        $this->assertDatabaseHas('favorites', ['asset_id' => 'cardano']);
        $this->assertDatabaseMissing('favorites', ['asset_id' => 'ethereum']);
    });

    it('handles concurrent favorite operations', function () {
        // Simulate concurrent requests
        $responses = [];
        
        for ($i = 0; $i < 3; $i++) {
            $responses[] = $this->post('/api/favorites', ['assetId' => 'bitcoin']);
        }


        foreach ($responses as $response) {
            $response->assertStatus(201);
        }


        expect(Favorite::where('asset_id', 'bitcoin')->count())->toBe(1);
    });
});
