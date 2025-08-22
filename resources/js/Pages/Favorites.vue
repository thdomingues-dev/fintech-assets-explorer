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
                        <Link
                            href="/"
                            class="text-gray-600 hover:text-gray-900"
                        >
                            Home
                        </Link>
                        <Link
                            href="/favorites"
                            class="text-blue-600 font-medium"
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
                    Your Favorite Assets
                </h2>
                <p class="text-gray-600">
                    Assets you've saved for quick access
                </p>
            </div>

            <div v-if="favoritesStore.loading" class="text-center py-12">
                <div
                    class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"
                ></div>
                <p class="mt-4 text-gray-600">Loading favorites...</p>
            </div>

            <div
                v-if="favoritesStore.error"
                class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6"
            >
                {{ favoritesStore.error }}
            </div>

            <div
                v-if="
                    !favoritesStore.loading &&
                    favoritesStore.favorites.length === 0
                "
                class="text-center py-16"
            >
                <div
                    class="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4"
                >
                    <span class="text-2xl text-gray-400">♥</span>
                </div>
                <h3 class="text-lg font-medium text-gray-900 mb-2">
                    No favorites yet
                </h3>
                <p class="text-gray-500 mb-6 max-w-md mx-auto">
                    Start by adding some assets to your favorites from the home
                    page. Your favorite assets will appear here for quick
                    access.
                </p>
                <Link
                    href="/"
                    class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                    Browse Assets
                </Link>
            </div>

            <div
                v-if="
                    !favoritesStore.loading &&
                    favoritesStore.favorites.length > 0
                "
                class="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
                <div
                    v-for="favorite in favoritesStore.favoritesWithDetails"
                    :key="favorite.id"
                    class="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                >
                    <div class="p-6">
                        <div class="flex items-start justify-between mb-4">
                            <div class="flex items-center space-x-3 flex-1">
                                <div class="flex-shrink-0">
                                    <img
                                        v-if="favorite.details?.image"
                                        :src="favorite.details.image"
                                        :alt="favorite.details.name"
                                        class="w-12 h-12 rounded-full"
                                    />
                                    <div
                                        v-else
                                        class="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center"
                                    >
                                        <span
                                            class="text-gray-600 text-sm font-bold"
                                        >
                                            {{
                                                favorite.asset_id
                                                    .charAt(0)
                                                    .toUpperCase()
                                            }}
                                        </span>
                                    </div>
                                </div>
                                <div class="min-w-0 flex-1">
                                    <h3
                                        class="text-lg font-semibold text-gray-900"
                                    >
                                        {{
                                            favorite.details?.name ||
                                            favorite.asset_id
                                        }}
                                    </h3>
                                    <p class="text-sm text-gray-500 uppercase">
                                        {{
                                            favorite.details?.symbol ||
                                            favorite.asset_id
                                        }}
                                    </p>
                                </div>
                            </div>
                            <button
                                @click="
                                    favoritesStore.removeFavorite(favorite.id)
                                "
                                class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50 transition-colors text-red-500"
                                title="Remove from favorites"
                            >
                                ×
                            </button>
                        </div>

                        <div v-if="favorite.details" class="space-y-3 mb-4">
                            <div class="flex justify-between">
                                <span class="text-sm text-gray-600"
                                    >Price:</span
                                >
                                <span class="font-semibold text-gray-900">
                                    ${{
                                        formatPrice(
                                            favorite.details.current_price
                                        )
                                    }}
                                </span>
                            </div>

                            <div class="flex justify-between">
                                <span class="text-sm text-gray-600"
                                    >24h Change:</span
                                >
                                <span
                                    :class="
                                        favorite.details
                                            .price_change_percentage_24h >= 0
                                            ? 'text-green-600'
                                            : 'text-red-600'
                                    "
                                    class="font-semibold"
                                >
                                    {{
                                        favorite.details
                                            .price_change_percentage_24h >= 0
                                            ? "+"
                                            : ""
                                    }}{{
                                        favorite.details.price_change_percentage_24h?.toFixed(
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
                                    ${{
                                        formatMarketCap(
                                            favorite.details.market_cap
                                        )
                                    }}
                                </span>
                            </div>
                        </div>

                        <div class="pt-3 border-t border-gray-100">
                            <button
                                @click="goToAssetDetails(favorite.asset_id)"
                                class="w-full px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                            >
                                View Details
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { router, Link } from "@inertiajs/vue3";
import { useFavoritesStore } from "../stores/useFavoritesStore";

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

onMounted(() => {
    favoritesStore.fetchFavorites();
});
</script>
