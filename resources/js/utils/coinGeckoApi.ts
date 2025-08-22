interface MarketChartData {
    prices: [number, number][];
    market_caps: [number, number][];
    total_volumes: [number, number][];
}

export async function fetchSparklineData(assetId: string, days: number = 1) {
    try {
        const response = await fetch(
            `/api/assets/${assetId}/market_chart?days=${days}`
        );

        if (!response.ok) {
            throw new Error("Failed to fetch historical data");
        }

        const data: MarketChartData = await response.json();

        return data.prices.map(([timestamp, price]) => ({
            timestamp,
            price: Math.round(price * 100) / 100,
        }));
    } catch (error) {
        console.error("Error fetching sparkline data:", error);
        return [];
    }
}
