<?php

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

beforeEach(function () {
    // Clear cache before each test
    Cache::flush();
});

describe('Asset API Endpoints', function () {
    it('can fetch list of assets from API', function () {
        // Mock CoinGecko API response
        Http::fake([
            'api.coingecko.com/api/v3/coins/markets*' => Http::response([
                [
                    'id' => 'bitcoin',
                    'symbol' => 'btc',
                    'name' => 'Bitcoin',
                    'image' => 'https://example.com/bitcoin.png',
                    'current_price' => 50000,
                    'price_change_percentage_24h' => 2.5,
                    'market_cap' => 1000000000
                ],
                [
                    'id' => 'ethereum',
                    'symbol' => 'eth',
                    'name' => 'Ethereum',
                    'image' => 'https://example.com/ethereum.png',
                    'current_price' => 3000,
                    'price_change_percentage_24h' => -1.2,
                    'market_cap' => 500000000
                ]
            ], 200)
        ]);

        $response = $this->get('/api/assets');

        $response->assertStatus(200)
                ->assertJsonCount(2)
                ->assertJsonStructure([
                    '*' => [
                        'id',
                        'symbol',
                        'name',
                        'image',
                        'current_price',
                        'price_change_percentage_24h',
                        'market_cap'
                    ]
                ]);


        Http::assertSent(function ($request) {
            return str_contains($request->url(), 'api.coingecko.com/api/v3/coins/markets');
        });
    });

    it('caches asset list for 60 seconds', function () {
        // Mock successful API response
        Http::fake([
            'api.coingecko.com/api/v3/coins/markets*' => Http::response([
                ['id' => 'bitcoin', 'name' => 'Bitcoin', 'current_price' => 50000]
            ], 200)
        ]);


        $this->get('/api/assets');
        Http::assertSentCount(1);


        $this->get('/api/assets');
        Http::assertSentCount(1); // Still only 1 request


        expect(Cache::has('crypto_assets'))->toBeTrue();
        
        $cachedData = Cache::get('crypto_assets');
        expect($cachedData)->toBeArray()
                          ->and($cachedData[0]['id'])->toBe('bitcoin');
    });

    it('can fetch individual asset details', function () {
        Http::fake([
            'api.coingecko.com/api/v3/coins/bitcoin' => Http::response([
                'id' => 'bitcoin',
                'name' => 'Bitcoin',
                'symbol' => 'btc',
                'image' => [
                    'large' => 'https://example.com/bitcoin-large.png'
                ],
                'market_data' => [
                    'current_price' => ['usd' => 50000],
                    'price_change_24h' => 1000,
                    'price_change_percentage_24h' => 2.5,
                    'market_cap' => ['usd' => 1000000000]
                ],
                'description' => [
                    'en' => 'Bitcoin is a cryptocurrency...'
                ]
            ], 200)
        ]);

        $response = $this->get('/api/assets/bitcoin');

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'id',
                    'name',
                    'symbol',
                    'image',
                    'current_price',
                    'price_change_24h',
                    'price_change_percentage_24h',
                    'market_cap',
                    'description'
                ])
                ->assertJson([
                    'id' => 'bitcoin',
                    'name' => 'Bitcoin',
                    'symbol' => 'btc',
                    'current_price' => 50000,
                    'price_change_percentage_24h' => 2.5
                ]);
    });

    it('caches individual asset details for 60 seconds', function () {
        Http::fake([
            'api.coingecko.com/api/v3/coins/bitcoin' => Http::response([
                'id' => 'bitcoin',
                'name' => 'Bitcoin',
                'symbol' => 'btc',
                'image' => [
                    'large' => 'https://example.com/bitcoin-large.png'
                ],
                'market_data' => [
                    'current_price' => ['usd' => 50000],
                    'price_change_24h' => 1000,
                    'price_change_percentage_24h' => 2.5,
                    'market_cap' => ['usd' => 1000000000]
                ],
                'description' => [
                    'en' => 'Bitcoin is a cryptocurrency...'
                ]
            ], 200)
        ]);

        // First request
        $this->get('/api/assets/bitcoin');
        Http::assertSentCount(1);


        $this->get('/api/assets/bitcoin');
        Http::assertSentCount(1);


        expect(Cache::has('crypto_asset_bitcoin'))->toBeTrue();
    });

    it('returns 404 for non-existent asset', function () {
        Http::fake([
            'api.coingecko.com/api/v3/coins/invalid-coin' => Http::response([], 404)
        ]);

        $response = $this->get('/api/assets/invalid-coin');

        $response->assertStatus(404)
                ->assertJson(['error' => 'Asset not found']);
    });

    it('handles API failures gracefully', function () {
        Http::fake([
            'api.coingecko.com/api/v3/coins/markets*' => Http::response([], 500)
        ]);

        $response = $this->get('/api/assets');

        $response->assertStatus(200)
                ->assertJson([]);
    });
});
