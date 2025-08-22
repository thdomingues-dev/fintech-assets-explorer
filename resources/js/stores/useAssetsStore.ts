import { defineStore } from "pinia";
import { ref, computed } from "vue";

interface Asset {
    id: string;
    name: string;
    symbol: string;
    image: string;
    current_price: number;
    price_change_24h: number;
    price_change_percentage_24h: number;
    market_cap: number;
    description?: string;
}

export const useAssetsStore = defineStore("assets", () => {
    const assets = ref<Asset[]>([]);
    const currentAsset = ref<Asset | null>(null);
    const loading = ref(false);
    const error = ref("");

    const topAssets = computed(() =>
        Array.isArray(assets.value) ? assets.value.slice(0, 10) : []
    );

    const assetById = computed(
        () => (id: string) => assets.value.find((asset) => asset.id === id)
    );

    const fetchAssets = async () => {
        try {
            loading.value = true;
            error.value = "";

            const response = await fetch("/api/assets");
            if (!response.ok) throw new Error("Failed to fetch assets");

            assets.value = await response.json();
        } catch (err) {
            error.value = "Failed to load assets. Please try again.";
            console.error("Error fetching assets:", err);
        } finally {
            loading.value = false;
        }
    };

    const fetchAssetDetails = async (assetId: string) => {
        try {
            loading.value = true;
            error.value = "";

            const response = await fetch(`/api/assets/${assetId}`);
            if (!response.ok) {
                if (response.status === 404) {
                    error.value = "Asset not found.";
                    return;
                }
                throw new Error("Failed to fetch asset details");
            }

            currentAsset.value = await response.json();
        } catch (err) {
            error.value = "Failed to load asset details. Please try again.";
        } finally {
            loading.value = false;
        }
    };

    const clearCurrentAsset = () => {
        currentAsset.value = null;
    };

    return {
        assets,
        currentAsset,
        loading,
        error,
        topAssets,
        assetById,
        fetchAssets,
        fetchAssetDetails,
        clearCurrentAsset,
    };
});
