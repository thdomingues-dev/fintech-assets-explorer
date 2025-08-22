<template>
    <div ref="reactContainer" class="react-sparkline-container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue";
import React from "react";
import { createRoot, Root } from "react-dom/client";
import PriceSparkline from "./PriceSparkline";

interface PriceData {
    timestamp: number;
    price: number;
}

interface Props {
    data?: PriceData[];
    currentPrice?: number;
    priceChange24h?: number;
    color?: string;
    height?: number;
}

const props = withDefaults(defineProps<Props>(), {
    data: () => [],
    color: "#10b981",
    height: 60,
});

const reactContainer = ref<HTMLDivElement>();
let root: Root | null = null;

const renderReactComponent = () => {
    if (reactContainer.value && !root) {
        root = createRoot(reactContainer.value);
    }

    if (root) {
        root.render(
            React.createElement(PriceSparkline, {
                data: props.data,
                currentPrice: props.currentPrice,
                priceChange24h: props.priceChange24h,
                color: props.color,
                height: props.height,
            })
        );
    } else {
    }
};

onMounted(() => {
    renderReactComponent();
});

onUnmounted(() => {
    if (root) {
        root.unmount();
        root = null;
    }
});

watch(
    () => [
        props.data,
        props.currentPrice,
        props.priceChange24h,
        props.color,
        props.height,
    ],
    () => {
        renderReactComponent();
    },
    { deep: true }
);
</script>

<style scoped>
.react-sparkline-container {
    width: 100%;
}
</style>
