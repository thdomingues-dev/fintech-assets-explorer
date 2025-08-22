import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/vue";
import AssetDetails from "../../../resources/js/Pages/AssetDetails.vue";

const mockFetch = vi.fn();
global.fetch = mockFetch;

Object.defineProperty(window, "history", {
    value: {
        back: vi.fn(),
    },
    writable: true,
});

describe("AssetDetails Component", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockFetch.mockClear();
    });

    it("shows loading state initially", async () => {
        mockFetch.mockImplementation(
            () =>
                new Promise((resolve) =>
                    setTimeout(
                        () =>
                            resolve({
                                ok: true,
                                json: () => Promise.resolve({}),
                            }),
                        100
                    )
                )
        );

        render(AssetDetails, {
            props: {
                assetId: "bitcoin",
            },
            global: {
                components: {},
            },
        });

        await waitFor(() => {
            expect(
                screen.getByText("Loading asset details...")
            ).toBeInTheDocument();
        });
    });

    it("displays asset details after successful API call", async () => {
        const mockAsset = {
            id: "bitcoin",
            name: "Bitcoin",
            symbol: "BTC",
            image: "https://example.com/bitcoin.png",
            current_price: 50000,
            price_change_24h: 1000,
            price_change_percentage_24h: 2.5,
            market_cap: 1000000000,
            description:
                "Bitcoin is a cryptocurrency and worldwide payment system.",
        };

        mockFetch
            .mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockAsset),
            })
            .mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve([]),
            });

        render(AssetDetails, {
            props: {
                assetId: "bitcoin",
            },
            global: {
                components: {},
            },
        });

        await waitFor(() => {
            expect(screen.getByText("Bitcoin")).toBeInTheDocument();
        });

        expect(screen.getByText("BTC")).toBeInTheDocument();
        expect(screen.getByText("$50,000")).toBeInTheDocument();
        expect(screen.getByText("+2.50%")).toBeInTheDocument();
        expect(screen.getByText("About Bitcoin")).toBeInTheDocument();
    });

    it("displays error message on API failure", async () => {
        mockFetch.mockRejectedValueOnce(new Error("Network error"));

        render(AssetDetails, {
            props: {
                assetId: "bitcoin",
            },
            global: {
                components: {},
            },
        });

        await waitFor(() => {
            expect(
                screen.getByText(
                    "Failed to load asset details. Please try again."
                )
            ).toBeInTheDocument();
        });
    });

    it("shows 404 error for non-existent asset", async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false,
            status: 404,
        });

        render(AssetDetails, {
            props: {
                assetId: "invalid-asset",
            },
            global: {
                components: {},
            },
        });

        await waitFor(() => {
            expect(screen.getByText("Asset not found.")).toBeInTheDocument();
        });
    });

    it("handles favorite button correctly", async () => {
        const mockAsset = {
            id: "bitcoin",
            name: "Bitcoin",
            symbol: "BTC",
            image: "https://example.com/bitcoin.png",
            current_price: 50000,
            price_change_24h: 1000,
            price_change_percentage_24h: 2.5,
            market_cap: 1000000000,
            description: "Bitcoin is a cryptocurrency.",
        };

        mockFetch
            .mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockAsset),
            })
            .mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve([]),
            });

        render(AssetDetails, {
            props: {
                assetId: "bitcoin",
            },
            global: {
                components: {},
            },
        });

        await waitFor(() => {
            expect(screen.getByText("Add to Favorites")).toBeInTheDocument();
        });
    });

    it("handles back button click", async () => {
        const mockAsset = {
            id: "bitcoin",
            name: "Bitcoin",
            symbol: "BTC",
            image: "https://example.com/bitcoin.png",
            current_price: 50000,
            price_change_24h: 1000,
            price_change_percentage_24h: 2.5,
            market_cap: 1000000000,
        };

        mockFetch
            .mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockAsset),
            })
            .mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve([]),
            });

        const { container } = render(AssetDetails, {
            props: {
                assetId: "bitcoin",
            },
            global: {
                components: {},
            },
        });

        await waitFor(() => {
            expect(screen.getByText("← Back")).toBeInTheDocument();
        });

        const backButton = screen.getByText("← Back");
        await backButton.click();

        expect(window.history.back).toHaveBeenCalled();
    });

    it("sanitizes description HTML content", async () => {
        const mockAsset = {
            id: "bitcoin",
            name: "Bitcoin",
            symbol: "BTC",
            image: "https://example.com/bitcoin.png",
            current_price: 50000,
            price_change_24h: 1000,
            price_change_percentage_24h: 2.5,
            market_cap: 1000000000,
            description:
                'Bitcoin is <script>alert("hack")</script> a cryptocurrency.',
        };

        mockFetch
            .mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockAsset),
            })
            .mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve([]),
            });

        render(AssetDetails, {
            props: {
                assetId: "bitcoin",
            },
            global: {
                components: {},
            },
        });

        await waitFor(() => {
            expect(screen.getByText("Bitcoin")).toBeInTheDocument();
        });

        expect(screen.queryByText('alert("hack")')).not.toBeInTheDocument();
        expect(
            screen.getByText(/Bitcoin is.*a cryptocurrency/)
        ).toBeInTheDocument();
    });

    it("displays positive price change correctly", async () => {
        const mockAssetPositive = {
            id: "bitcoin",
            name: "Bitcoin",
            symbol: "BTC",
            image: "https://example.com/bitcoin.png",
            current_price: 50000,
            price_change_24h: 1000,
            price_change_percentage_24h: 2.5,
            market_cap: 1000000000,
        };

        mockFetch
            .mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockAssetPositive),
            })
            .mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve([]),
            });

        render(AssetDetails, {
            props: {
                assetId: "bitcoin",
            },
            global: {
                components: {},
            },
        });

        await waitFor(() => {
            expect(screen.getByText("+2.50%")).toBeInTheDocument();
        });
    });

    it("displays negative price change correctly", async () => {
        const mockAssetNegative = {
            id: "ethereum",
            name: "Ethereum",
            symbol: "ETH",
            image: "https://example.com/ethereum.png",
            current_price: 3000,
            price_change_24h: -100,
            price_change_percentage_24h: -2.5,
            market_cap: 500000000,
        };

        mockFetch
            .mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockAssetNegative),
            })
            .mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve([]),
            });

        render(AssetDetails, {
            props: {
                assetId: "ethereum",
            },
            global: {
                components: {},
            },
        });

        await waitFor(() => {
            expect(screen.getByText("-2.50%")).toBeInTheDocument();
        });
    });
});
