import "@testing-library/jest-dom";
import { afterEach, beforeEach, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";


setActivePinia(createPinia());


global.fetch = vi.fn(() =>
    Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve([]),
    })
) as any;


Object.defineProperty(window, "history", {
    value: {
        back: vi.fn(),
        pushState: vi.fn(),
        replaceState: vi.fn(),
    },
    writable: true,
});


global.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}));


global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}));


vi.mock("@inertiajs/vue3", () => ({
    router: {
        visit: vi.fn(),
        get: vi.fn(),
        post: vi.fn(),
    },
    Link: {
        template: "<a><slot /></a>",
    },
}));


beforeEach(() => {
    setActivePinia(createPinia());
});


afterEach(() => {
    vi.clearAllMocks();
});
