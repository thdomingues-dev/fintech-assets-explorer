import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { render, screen, waitFor } from "@testing-library/vue";
import Home from "../../../resources/js/Pages/Home.vue";
import { router } from "@inertiajs/vue3";


const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("Home Component", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockFetch.mockClear();
    });

    it("renders the page title correctly", () => {
        render(Home, {
            global: {
                components: {
                    ReactSparklineWrapper: {
                        template: '<div class="mock-sparkline"></div>',
                    },
                },
            },
        });

        expect(
            screen.getByText("Top Cryptocurrency Assets")
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                "Discover and track the most popular cryptocurrency assets"
            )
        ).toBeInTheDocument();
    });

    it("shows loading state initially", async () => {

        mockFetch.mockImplementation(
            () =>
                new Promise((resolve) =>
                    setTimeout(
                        () =>
                            resolve({
                                ok: true,
                                json: () => Promise.resolve([]),
                            }),
                        100
                    )
                )
        );

        render(Home, {
            global: {
                components: {
                    ReactSparklineWrapper: {
                        template: '<div class="mock-sparkline"></div>',
                    },
                },
            },
        });


        await waitFor(() => {
            expect(screen.getByText("Loading assets...")).toBeInTheDocument();
        });
    });

    it("displays assets after successful API call", async () => {

        mockFetch
            .mockResolvedValueOnce({
                ok: true,
                json: () =>
                    Promise.resolve([
                        {
                            id: "bitcoin",
                            name: "Bitcoin",
                            symbol: "BTC",
                            image: "https://example.com/bitcoin.png",
                            current_price: 50000,
                            price_change_percentage_24h: 2.5,
                            market_cap: 1000000000,
                        },
                        {
                            id: "ethereum",
                            name: "Ethereum",
                            symbol: "ETH",
                            image: "https://example.com/ethereum.png",
                            current_price: 3000,
                            price_change_percentage_24h: -1.2,
                            market_cap: 500000000,
                        },
                    ]),
            })
            .mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve([]),
            });

        render(Home, {
            global: {
                components: {
                    ReactSparklineWrapper: {
                        template: '<div class="mock-sparkline"></div>',
                    },
                },
            },
        });


        await waitFor(() => {
            expect(screen.getByText("Bitcoin")).toBeInTheDocument();
        });

        expect(screen.getByText("Ethereum")).toBeInTheDocument();
        expect(screen.getByText("BTC")).toBeInTheDocument();
        expect(screen.getByText("ETH")).toBeInTheDocument();
    });

    it("displays error message on API failure", async () => {
        mockFetch.mockRejectedValueOnce(new Error("Network error"));

        render(Home, {
            global: {
                components: {
                    ReactSparklineWrapper: {
                        template: '<div class="mock-sparkline"></div>',
                    },
                },
            },
        });

        await waitFor(() => {
            expect(
                screen.getByText("Failed to load assets. Please try again.")
            ).toBeInTheDocument();
        });
    });

    it("formats prices correctly", async () => {
        mockFetch
            .mockResolvedValueOnce({
                ok: true,
                json: () =>
                    Promise.resolve([
                        {
                            id: "bitcoin",
                            name: "Bitcoin",
                            symbol: "BTC",
                            image: "https://example.com/bitcoin.png",
                            current_price: 50000.123456,
                            price_change_percentage_24h: 2.5,
                            market_cap: 1000000000,
                        },
                    ]),
            })
            .mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve([]),
            });

        render(Home, {
            global: {
                components: {
                    ReactSparklineWrapper: {
                        template: '<div class="mock-sparkline"></div>',
                    },
                },
            },
        });

        await waitFor(() => {
            expect(screen.getByText("$50,000.123456")).toBeInTheDocument();
        });
    });

    it("formats market cap with proper abbreviations", async () => {
        mockFetch
            .mockResolvedValueOnce({
                ok: true,
                json: () =>
                    Promise.resolve([
                        {
                            id: "bitcoin",
                            name: "Bitcoin",
                            symbol: "BTC",
                            image: "https://example.com/bitcoin.png",
                            current_price: 50000,
                            price_change_percentage_24h: 2.5,
                            market_cap: 1000000000000,
                        },
                    ]),
            })
            .mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve([]),
            });

        render(Home, {
            global: {
                components: {
                    ReactSparklineWrapper: {
                        template: '<div class="mock-sparkline"></div>',
                    },
                },
            },
        });

        await waitFor(() => {
            expect(screen.getByText("$1.00T")).toBeInTheDocument();
        });
    });

    it("handles favorite toggling", async () => {
        mockFetch
            .mockResolvedValueOnce({
                ok: true,
                json: () =>
                    Promise.resolve([
                        {
                            id: "bitcoin",
                            name: "Bitcoin",
                            symbol: "BTC",
                            image: "https://example.com/bitcoin.png",
                            current_price: 50000,
                            price_change_percentage_24h: 2.5,
                            market_cap: 1000000000,
                        },
                    ]),
            })
            .mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve([]),
            })
            .mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({ id: 1, asset_id: "bitcoin" }),
            });

        const wrapper = mount(Home, {
            global: {
                components: {
                    ReactSparklineWrapper: {
                        template: '<div class="mock-sparkline"></div>',
                    },
                },
            },
        });


        await waitFor(() => {
            expect(wrapper.text()).toContain("Bitcoin");
        });


        const favoriteButton = wrapper.find('button[class*="text-gray-400"]');
        await favoriteButton.trigger("click");

        expect(mockFetch).toHaveBeenCalledWith(
            "/api/favorites",
            expect.objectContaining({
                method: "POST",
                headers: expect.objectContaining({
                    "Content-Type": "application/json",
                }),
                body: JSON.stringify({ assetId: "bitcoin" }),
            })
        );
    });

    it("navigates to asset details on card click", async () => {
        mockFetch
            .mockResolvedValueOnce({
                ok: true,
                json: () =>
                    Promise.resolve([
                        {
                            id: "bitcoin",
                            name: "Bitcoin",
                            symbol: "BTC",
                            image: "https://example.com/bitcoin.png",
                            current_price: 50000,
                            price_change_percentage_24h: 2.5,
                            market_cap: 1000000000,
                        },
                    ]),
            })
            .mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve([]),
            });

        const wrapper = mount(Home, {
            global: {
                components: {
                    ReactSparklineWrapper: {
                        template: '<div class="mock-sparkline"></div>',
                    },
                },
            },
        });


        await waitFor(() => {
            expect(wrapper.text()).toContain("Bitcoin");
        });


        const assetCard = wrapper.find(".cursor-pointer");
        await assetCard.trigger("click");

        expect(router.visit).toHaveBeenCalledWith("/assets/bitcoin");
    });
});
