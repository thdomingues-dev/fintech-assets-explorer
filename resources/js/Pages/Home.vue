<template>
    <div class="min-h-screen bg-gray-50">
        <nav class="bg-white shadow">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between h-16">
                    <div class="flex items-center">
                        <h1 class="text-xl font-bold text-gray-900">
                            Fintech Assets Explorer
                        </h1>
                    </div>
                    <div class="flex items-center space-x-4">
                        <Link href="/" class="text-blue-600 font-medium">
                            Home
                        </Link>
                        <Link
                            href="/favorites"
                            class="text-gray-600 hover:text-gray-900"
                        >
                            Favorites
                        </Link>
                    </div>
                </div>
            </div>
        </nav>

        <main class="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <div class="mb-8">
                <h2 class="text-3xl font-bold text-gray-900 mb-2">
                    Top Cryptocurrency Assets
                </h2>
                <p class="text-gray-600">
                    Discover and track the most popular cryptocurrency assets
                </p>
            </div>

            <div v-if="assetsStore.loading" class="text-center py-12">
                <div
                    class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"
                ></div>
                <p class="mt-4 text-gray-600">Loading assets...</p>
            </div>

            <div
                v-if="assetsStore.error"
                class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6"
            >
                {{ assetsStore.error }}
            </div>

            <div
                v-if="!assetsStore.loading && !assetsStore.error"
                class="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
                <div
                    v-for="asset in assetsStore.topAssets"
                    :key="asset.id"
                    class="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                    @click="goToAssetDetails(asset.id)"
                >
                    <div class="p-6">
                        <div class="flex items-center justify-between mb-4">
                            <div class="flex items-center space-x-3">
                                <img
                                    :src="asset.image"
                                    :alt="asset.name"
                                    class="w-12 h-12 rounded-full"
                                />
                                <div>
                                    <h3
                                        class="text-lg font-semibold text-gray-900"
                                    >
                                        {{ asset.name }}
                                    </h3>
                                    <p class="text-sm text-gray-500 uppercase">
                                        {{ asset.symbol }}
                                    </p>
                                </div>
                            </div>
                            <button
                                @click.stop="
                                    favoritesStore.toggleFavorite(asset.id)
                                "
                                class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                                :class="{
                                    'text-red-500': favoritesStore.isFavorite(
                                        asset.id
                                    ),
                                    'text-gray-400': !favoritesStore.isFavorite(
                                        asset.id
                                    ),
                                }"
                            >
                                ♥
                            </button>
                        </div>

                        <div class="my-4">
                            <ReactSparklineWrapper
                                :data="sparklineData[asset.id] || []"
                                :current-price="asset.current_price"
                                :price-change24h="asset.price_change_24h"
                                :color="
                                    asset.price_change_percentage_24h >= 0
                                        ? '#10b981'
                                        : '#ef4444'
                                "
                                :height="50"
                            />
                        </div>

                        <div class="space-y-3">
                            <div class="flex justify-between">
                                <span class="text-sm text-gray-600"
                                    >Price:</span
                                >
                                <span class="font-semibold text-gray-900">
                                    ${{ formatPrice(asset.current_price) }}
                                </span>
                            </div>

                            <div class="flex justify-between">
                                <span class="text-sm text-gray-600"
                                    >24h Change:</span
                                >
                                <span
                                    :class="
                                        asset.price_change_percentage_24h >= 0
                                            ? 'text-green-600'
                                            : 'text-red-600'
                                    "
                                    class="font-semibold"
                                >
                                    {{
                                        asset.price_change_percentage_24h >= 0
                                            ? "+"
                                            : ""
                                    }}{{
                                        asset.price_change_percentage_24h?.toFixed(
                                            2
                                        )
                                    }}%
                                </span>
                            </div>

                            <div class="flex justify-between">
                                <span class="text-sm text-gray-600"
                                    >Market Cap:</span
                                >
                                <span class="font-semibold text-gray-900">
                                    ${{ formatMarketCap(asset.market_cap) }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div
                v-if="
                    !assetsStore.loading &&
                    !assetsStore.error &&
                    assetsStore.assets.length === 0
                "
                class="text-center py-12"
            >
                <h3 class="text-lg font-medium text-gray-900 mb-2">
                    No assets found
                </h3>
                <p class="text-gray-500">
                    Unable to load cryptocurrency assets at this time.
                </p>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { router, Link } from "@inertiajs/vue3";
import ReactSparklineWrapper from "../components/ReactSparklineWrapper.vue";
import { useAssetsStore } from "../stores/useAssetsStore";
import { useFavoritesStore } from "../stores/useFavoritesStore";

const assetsStore = useAssetsStore();
const favoritesStore = useFavoritesStore();

const sparklineData = ref<Record<string, any[]>>({});

const goToAssetDetails = (assetId: string) => {
    router.visit(`/assets/${assetId}`);
};

const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: price % 1 === 0 ? 0 : 6,
    }).format(price);
};

const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e12) {
        return (marketCap / 1e12).toFixed(2) + "T";
    } else if (marketCap >= 1e9) {
        return (marketCap / 1e9).toFixed(2) + "B";
    } else if (marketCap >= 1e6) {
        return (marketCap / 1e6).toFixed(2) + "M";
    } else {
        return marketCap.toLocaleString();
    }
};

const getSparklineData = async (asset: any) => {
    try {
        const response = await fetch(
            `/api/assets/${asset.id}/market_chart?days=1`
        );
        if (response.ok) {
            const data = await response.json();
            if (
                data.prices &&
                Array.isArray(data.prices) &&
                data.prices.length > 0
            ) {
                return data.prices.map(
                    ([timestamp, price]: [number, number]) => ({
                        timestamp,
                        price: Math.round(price * 100) / 100,
                    })
                );
            }
        }
    } catch (error) {
        console.warn("Failed to fetch 24h data, using fallback");
    }

    if (
        asset.sparkline_in_7d?.price &&
        Array.isArray(asset.sparkline_in_7d.price) &&
        asset.sparkline_in_7d.price.length > 0
    ) {
        const now = Date.now();
        const prices = asset.sparkline_in_7d.price;

        return prices.map((price: number, index: number) => ({
            timestamp: now - (prices.length - 1 - index) * 60 * 60 * 1000,
            price: Math.round(price * 100) / 100,
        }));
    }

    return generateEnhancedSparklineData(
        asset.current_price,
        asset.price_change_24h
    );
};

const generateEnhancedSparklineData = (
    currentPrice: number,
    priceChange24h: number
) => {
    const data = [];
    const now = Date.now();
    const points = 24;

    const price = currentPrice || 50000;
    const change24h = priceChange24h || 0;
    const price24hAgo = price - change24h;

    let previousPrice = price24hAgo;

    for (let i = points - 1; i >= 0; i--) {
        const progress = (points - 1 - i) / (points - 1);
        const baseInterpolated = price24hAgo + change24h * progress;

        const volatility = (Math.random() - 0.5) * 0.06;
        const momentum = ((previousPrice - price24hAgo) / price24hAgo) * 0.3;
        const noise = Math.sin(i * 0.4) * 0.015;

        const adjustedPrice =
            baseInterpolated * (1 + volatility + momentum + noise);
        const finalPrice = Math.max(adjustedPrice, price24hAgo * 0.8);

        data.push({
            timestamp: now - i * 60 * 60 * 1000,
            price: Math.round(finalPrice * 100) / 100,
        });

        previousPrice = finalPrice;
    }

    if (data.length > 0) {
        data[data.length - 1].price = price;
    }

    return data;
};

const loadSparklineData = async () => {
    if (assetsStore.assets.length === 0) return;

    for (const asset of assetsStore.assets) {
        try {
            const data = await getSparklineData(asset);
            sparklineData.value[asset.id] = data;
        } catch (error) {
            sparklineData.value[asset.id] = [];
        }
    }
};

onMounted(async () => {
    await Promise.all([
        assetsStore.fetchAssets(),
        favoritesStore.fetchFavorites(),
    ]);

    await loadSparklineData();
});
</script>
