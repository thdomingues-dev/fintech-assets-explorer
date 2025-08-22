import { defineStore } from "pinia";
import { ref, computed } from "vue";

interface Favorite {
    id: number;
    asset_id: string;
}

interface Asset {
    id: string;
    name: string;
    symbol: string;
    image: string;
    current_price: number;
    price_change_percentage_24h: number;
    market_cap: number;
}

export const useFavoritesStore = defineStore("favorites", () => {
    const favorites = ref<Favorite[]>([]);
    const assetsDetails = ref<{ [key: string]: Asset }>({});
    const loading = ref(false);
    const error = ref("");

    const favoriteIds = computed(() => favorites.value.map((f) => f.asset_id));

    const isFavorite = computed(
        () => (assetId: string) =>
            favorites.value.some((f) => f.asset_id === assetId)
    );

    const favoritesWithDetails = computed(() =>
        favorites.value.map((favorite) => ({
            ...favorite,
            details: assetsDetails.value[favorite.asset_id],
        }))
    );

    const favoriteCount = computed(() => favorites.value.length);

    const getCsrfToken = () => {
        return (
            document
                .querySelector('meta[name="csrf-token"]')
                ?.getAttribute("content") || ""
        );
    };

    const fetchFavorites = async () => {
        try {
            loading.value = true;
            error.value = "";

            const response = await fetch("/api/favorites");
            if (!response.ok) throw new Error("Failed to fetch favorites");

            const favoritesData = await response.json();
            favorites.value = favoritesData;

            for (const favorite of favoritesData) {
                await fetchAssetDetails(favorite.asset_id);
            }
        } catch (err) {
            error.value = "Failed to load favorites. Please try again.";
            console.error("Error fetching favorites:", err);
        } finally {
            loading.value = false;
        }
    };

    const fetchAssetDetails = async (assetId: string) => {
        try {
            const response = await fetch(`/api/assets/${assetId}`);
            if (response.ok) {
                const assetData = await response.json();
                assetsDetails.value[assetId] = assetData;
            }
        } catch (err) {
            console.error(`Error fetching details for asset ${assetId}:`, err);
        }
    };

    const addFavorite = async (assetId: string) => {
        try {
            const response = await fetch("/api/favorites", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": getCsrfToken(),
                },
                body: JSON.stringify({ assetId }),
            });

            if (response.ok) {
                const newFavorite = await response.json();
                favorites.value.push(newFavorite);

                if (!assetsDetails.value[assetId]) {
                    await fetchAssetDetails(assetId);
                }

                return newFavorite;
            }
        } catch (err) {
            throw err;
        }
    };

    const removeFavorite = async (favoriteId: number) => {
        try {
            const response = await fetch(`/api/favorites/${favoriteId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": getCsrfToken(),
                },
            });

            if (response.ok) {
                favorites.value = favorites.value.filter(
                    (f) => f.id !== favoriteId
                );
                return true;
            }
        } catch (err) {
            throw err;
        }
    };

    const removeFavoriteByAssetId = async (assetId: string) => {
        const favorite = favorites.value.find((f) => f.asset_id === assetId);
        if (favorite) {
            await removeFavorite(favorite.id);
        }
    };

    const toggleFavorite = async (assetId: string) => {
        const favorite = favorites.value.find((f) => f.asset_id === assetId);

        if (favorite) {
            await removeFavorite(favorite.id);
        } else {
            await addFavorite(assetId);
        }
    };

    const clearFavorites = () => {
        favorites.value = [];
        assetsDetails.value = {};
    };

    return {
        favorites,
        assetsDetails,
        loading,
        error,
        favoriteIds,
        isFavorite,
        favoritesWithDetails,
        favoriteCount,
        fetchFavorites,
        fetchAssetDetails,
        addFavorite,
        removeFavorite,
        removeFavoriteByAssetId,
        toggleFavorite,
        clearFavorites,
    };
});
