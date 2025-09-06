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
                            class="text-gray-600 hover:text-gray-900"
                        >
                            Favorites
                        </Link>
                    </div>
                </div>
            </div>
        </nav>

        <main class="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <div class="mb-6">
                <button
                    @click="goBack"
                    class="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                    ← Back
                </button>
            </div>

            <div v-if="assetsStore.loading" class="text-center py-16">
                <div
                    class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"
                ></div>
                <p class="mt-4 text-gray-600">Loading asset details...</p>
            </div>

            <div
                v-if="assetsStore.error"
                class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6"
            >
                {{ assetsStore.error }}
            </div>

            <div
                v-if="!assetsStore.loading && assetsStore.currentAsset"
                class="bg-white rounded-lg border border-gray-200 shadow-sm"
            >
                <div class="p-8">
                    <div class="flex items-start justify-between mb-8">
                        <div class="flex items-center space-x-4">
                            <img
                                :src="assetsStore.currentAsset.image"
                                :alt="assetsStore.currentAsset.name"
                                class="w-16 h-16 rounded-full"
                            />
                            <div>
                                <h1 class="text-3xl font-bold text-gray-900">
                                    {{ assetsStore.currentAsset.name }}
                                </h1>
                                <p class="text-lg text-gray-500 uppercase">
                                    {{ assetsStore.currentAsset.symbol }}
                                </p>
                            </div>
                        </div>
                        <button
                            @click="
                                favoritesStore.toggleFavorite(props.assetId)
                            "
                            class="w-12 h-12 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                            :class="{
                                'text-red-500': favoritesStore.isFavorite(
                                    props.assetId
                                ),
                                'text-gray-400': !favoritesStore.isFavorite(
                                    props.assetId
                                ),
                            }"
                        >
                            ♥
                        </button>
                    </div>

                    <div
                        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                    >
                        <div class="bg-gray-50 rounded-lg p-6">
                            <h3
                                class="text-sm font-medium text-gray-500 uppercase tracking-wide"
                            >
                                Current Price
                            </h3>
                            <p class="mt-2 text-3xl font-bold text-gray-900">
                                ${{
                                    formatPrice(
                                        assetsStore.currentAsset.current_price
                                    )
                                }}
                            </p>
                        </div>

                        <div class="bg-gray-50 rounded-lg p-6">
                            <h3
                                class="text-sm font-medium text-gray-500 uppercase tracking-wide"
                            >
                                24h Change
                            </h3>
                            <p
                                class="mt-2 text-3xl font-bold"
                                :class="
                                    assetsStore.currentAsset
                                        .price_change_percentage_24h >= 0
                                        ? 'text-green-600'
                                        : 'text-red-600'
                                "
                            >
                                {{
                                    assetsStore.currentAsset
                                        .price_change_percentage_24h >= 0
                                        ? "+"
                                        : ""
                                }}{{
                                    assetsStore.currentAsset.price_change_percentage_24h?.toFixed(
                                        2
                                    )
                                }}%
                            </p>
                            <p
                                class="text-sm font-medium"
                                :class="
                                    assetsStore.currentAsset.price_change_24h >=
                                    0
                                        ? 'text-green-600'
                                        : 'text-red-600'
                                "
                            >
                                {{
                                    assetsStore.currentAsset.price_change_24h >=
                                    0
                                        ? "+"
                                        : ""
                                }}${{
                                    formatPrice(
                                        Math.abs(
                                            assetsStore.currentAsset
                                                .price_change_24h
                                        )
                                    )
                                }}
                            </p>
                        </div>

                        <div class="bg-gray-50 rounded-lg p-6">
                            <h3
                                class="text-sm font-medium text-gray-500 uppercase tracking-wide"
                            >
                                Market Cap
                            </h3>
                            <p class="mt-2 text-3xl font-bold text-gray-900">
                                ${{
                                    formatMarketCap(
                                        assetsStore.currentAsset.market_cap
                                    )
                                }}
                            </p>
                        </div>

                        <div class="bg-gray-50 rounded-lg p-6">
                            <h3
                                class="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4"
                            >
                                24h Price Movement
                            </h3>
                            <div
                                v-if="sparklineLoading"
                                class="flex items-center justify-center h-16"
                            >
                                <div
                                    class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"
                                ></div>
                                <span class="ml-2 text-sm text-gray-500"
                                    >Loading chart...</span
                                >
                            </div>
                            <ReactSparklineWrapper
                                v-else
                                :data="sparklineData"
                                :current-price="
                                    assetsStore.currentAsset.current_price
                                "
                                :price-change24h="
                                    assetsStore.currentAsset.price_change_24h
                                "
                                :color="
                                    assetsStore.currentAsset
                                        .price_change_percentage_24h >= 0
                                        ? '#10b981'
                                        : '#ef4444'
                                "
                                :height="70"
                            />
                        </div>
                    </div>

                    <div
                        v-if="assetsStore.currentAsset.description"
                        class="mb-8"
                    >
                        <h3 class="text-lg font-medium text-gray-900 mb-4">
                            About {{ assetsStore.currentAsset.name }}
                        </h3>
                        <div
                            class="prose max-w-none text-gray-700"
                            v-html="sanitizedDescription"
                        ></div>
                    </div>

                    <div class="flex flex-col sm:flex-row gap-4">
                        <button
                            @click="
                                favoritesStore.toggleFavorite(props.assetId)
                            "
                            :class="
                                favoritesStore.isFavorite(props.assetId)
                                    ? 'bg-red-600 hover:bg-red-700 text-white'
                                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                            "
                            class="px-6 py-3 rounded-md font-medium transition-colors"
                        >
                            {{
                                favoritesStore.isFavorite(props.assetId)
                                    ? "Remove from Favorites"
                                    : "Add to Favorites"
                            }}
                        </button>
                        <button
                            @click="goToHomePage"
                            class="px-6 py-3 border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Browse More Assets
                        </button>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { router, Link } from "@inertiajs/vue3";
import ReactSparklineWrapper from "../components/ReactSparklineWrapper.vue";
import { fetchSparklineData } from "../utils/coinGeckoApi";
import { useAssetsStore } from "../stores/useAssetsStore";
import { useFavoritesStore } from "../stores/useFavoritesStore";

interface Props {
    assetId: string;
}

const props = defineProps<Props>();

interface PriceData {
    timestamp: number;
    price: number;
}

const assetsStore = useAssetsStore();
const favoritesStore = useFavoritesStore();

const sparklineData = ref<PriceData[]>([]);
const sparklineLoading = ref(false);

const sanitizedDescription = computed(() => {
    if (!assetsStore.currentAsset?.description) return "";

    return assetsStore.currentAsset.description
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
        .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
        .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "")
        .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, "");
});

const fetchSparklineChart = async () => {
    try {
        sparklineLoading.value = true;
        const data = await fetchSparklineData(props.assetId, 1);
        sparklineData.value = data;
    } catch (err) {
        console.error("Error fetching sparkline data:", err);
    } finally {
        sparklineLoading.value = false;
    }
};

const goBack = () => {
    window.history.back();
};

const goToHomePage = () => {
    router.visit("/");
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
    assetsStore.clearCurrentAsset();
    await Promise.all([
        assetsStore.fetchAssetDetails(props.assetId),
        favoritesStore.fetchFavorites(),
        fetchSparklineChart(),
    ]);
});
</script>
