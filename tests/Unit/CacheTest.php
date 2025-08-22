<?php

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use App\Http\Controllers\Api\AssetController;

describe('Cache Functionality', function () {
    beforeEach(function () {
        Cache::flush();
    });

    it('caches assets list properly', function () {
        Http::fake([
            'api.coingecko.com/api/v3/coins/markets*' => Http::response([
                ['id' => 'bitcoin', 'name' => 'Bitcoin']
            ], 200)
        ]);


        $this->get('/api/assets');
        

        expect(Cache::has('crypto_assets'))->toBeTrue();
        

        $cachedData = Cache::get('crypto_assets');
        expect($cachedData[0]['id'])->toBe('bitcoin');
    });

    it('caches individual asset properly', function () {
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


        $this->get('/api/assets/bitcoin');
        

        expect(Cache::has('crypto_asset_bitcoin'))->toBeTrue();
        

        $cachedData = Cache::get('crypto_asset_bitcoin');
        expect($cachedData['id'])->toBe('bitcoin');
    });

    it('serves cached data when available', function () {
        // Pre-populate cache with test data
        $testData = [
            ['id' => 'cached-bitcoin', 'name' => 'Cached Bitcoin', 'price' => 99999]
        ];
        Cache::put('crypto_assets', $testData, 60);

        Http::fake(); // No HTTP responses needed

        $response = $this->get('/api/assets');
        
        $response->assertStatus(200)
                ->assertJson($testData);
        

        Http::assertNothingSent();
    });

    it('refreshes cache after expiration', function () {
        // Set cache with very short TTL
        Cache::put('crypto_assets', ['old_data'], 1);
        
        // Wait for cache to expire
        sleep(2);
        
        Http::fake([
            'api.coingecko.com/api/v3/coins/markets*' => Http::response([
                ['id' => 'new-bitcoin', 'name' => 'New Bitcoin']
            ], 200)
        ]);

        $response = $this->get('/api/assets');
        
        $response->assertStatus(200)
                ->assertJsonFragment(['id' => 'new-bitcoin']);
        

        Http::assertSentCount(1);
    });

    it('uses separate cache keys for different assets', function () {
        Http::fake([
            'api.coingecko.com/api/v3/coins/bitcoin' => Http::response([
                'id' => 'bitcoin', 
                'name' => 'Bitcoin',
                'symbol' => 'btc',
                'image' => ['large' => 'https://example.com/bitcoin.png'],
                'market_data' => [
                    'current_price' => ['usd' => 50000],
                    'price_change_24h' => 1000,
                    'price_change_percentage_24h' => 2.5,
                    'market_cap' => ['usd' => 1000000000]
                ],
                'description' => ['en' => 'Bitcoin is a cryptocurrency...']
            ], 200),
            'api.coingecko.com/api/v3/coins/ethereum' => Http::response([
                'id' => 'ethereum', 
                'name' => 'Ethereum',
                'symbol' => 'eth',
                'image' => ['large' => 'https://example.com/ethereum.png'],
                'market_data' => [
                    'current_price' => ['usd' => 3000],
                    'price_change_24h' => -100,
                    'price_change_percentage_24h' => -1.2,
                    'market_cap' => ['usd' => 500000000]
                ],
                'description' => ['en' => 'Ethereum is a cryptocurrency...']
            ], 200)
        ]);

        // Fetch different assets
        $this->get('/api/assets/bitcoin');
        $this->get('/api/assets/ethereum');


        expect(Cache::has('crypto_asset_bitcoin'))->toBeTrue();
        expect(Cache::has('crypto_asset_ethereum'))->toBeTrue();
        

        $bitcoinCache = Cache::get('crypto_asset_bitcoin');
        $ethereumCache = Cache::get('crypto_asset_ethereum');
        
        expect($bitcoinCache['id'])->toBe('bitcoin');
        expect($ethereumCache['id'])->toBe('ethereum');
    });

    it('handles cache misses gracefully', function () {

        Cache::forget('crypto_assets');
        
        Http::fake([
            'api.coingecko.com/api/v3/coins/markets*' => Http::response([
                ['id' => 'bitcoin', 'name' => 'Bitcoin']
            ], 200)
        ]);

        $response = $this->get('/api/assets');
        
        $response->assertStatus(200);
        

        expect(Cache::has('crypto_assets'))->toBeTrue();
        Http::assertSentCount(1);
    });

    it('maintains cache consistency under load', function () {
        Http::fake([
            'api.coingecko.com/api/v3/coins/markets*' => Http::response([
                ['id' => 'bitcoin', 'name' => 'Bitcoin', 'timestamp' => time()]
            ], 200)
        ]);

        // Make multiple concurrent requests
        $responses = [];
        for ($i = 0; $i < 5; $i++) {
            $responses[] = $this->get('/api/assets');
        }


        foreach ($responses as $response) {
            $response->assertStatus(200);
        }


        Http::assertSentCount(1);
        

        $firstResponse = $responses[0]->json();
        foreach ($responses as $response) {
            expect($response->json())->toBe($firstResponse);
        }
    });
});
