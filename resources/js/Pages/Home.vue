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
import { onMounted } from "vue";
import { router, Link } from "@inertiajs/vue3";
import { useAssetsStore } from "../stores/useAssetsStore";
import { useFavoritesStore } from "../stores/useFavoritesStore";

const assetsStore = useAssetsStore();
const favoritesStore = useFavoritesStore();

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

onMounted(async () => {
    await Promise.all([
        assetsStore.fetchAssets(),
        favoritesStore.fetchFavorites(),
    ]);
});
</script>
