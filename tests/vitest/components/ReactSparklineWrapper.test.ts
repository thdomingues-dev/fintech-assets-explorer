import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import ReactSparklineWrapper from "../../../resources/js/components/ReactSparklineWrapper.vue";

// Mock React and ReactDOM
vi.mock("react", () => ({
    default: {
        createElement: vi.fn((component, props) => ({
            type: component.name || "MockComponent",
            props,
        })),
    },
}));

vi.mock("react-dom/client", () => ({
    createRoot: vi.fn(() => ({
        render: vi.fn(),
        unmount: vi.fn(),
    })),
}));

vi.mock("@/components/PriceSparkline", () => ({
    default: {
        name: "PriceSparkline",
    },
}));

describe("ReactSparklineWrapper", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders without errors", () => {
        const wrapper = mount(ReactSparklineWrapper);

        expect(wrapper.find(".react-sparkline-container")).toBeTruthy();
    });

    it("accepts data prop", () => {
        const testData = [
            { timestamp: 1640995200000, price: 50000 },
            { timestamp: 1641081600000, price: 51000 },
        ];

        const wrapper = mount(ReactSparklineWrapper, {
            props: {
                data: testData,
            },
        });

        expect(wrapper.props("data")).toEqual(testData);
    });

    it("accepts color prop", () => {
        const wrapper = mount(ReactSparklineWrapper, {
            props: {
                color: "#ff0000",
            },
        });

        expect(wrapper.props("color")).toBe("#ff0000");
    });

    it("accepts height prop", () => {
        const wrapper = mount(ReactSparklineWrapper, {
            props: {
                height: 100,
            },
        });

        expect(wrapper.props("height")).toBe(100);
    });

    it("uses default props when not provided", () => {
        const wrapper = mount(ReactSparklineWrapper);

        expect(wrapper.props("data")).toEqual([]);
        expect(wrapper.props("color")).toBe("#10b981");
        expect(wrapper.props("height")).toBe(60);
    });

    it("updates when props change", async () => {
        const wrapper = mount(ReactSparklineWrapper, {
            props: {
                color: "#10b981",
            },
        });

        await wrapper.setProps({ color: "#ef4444" });

        expect(wrapper.props("color")).toBe("#ef4444");
    });

    it("handles component lifecycle correctly", () => {
        // Test that component mounts and unmounts without throwing errors
        const wrapper = mount(ReactSparklineWrapper);

        expect(wrapper.exists()).toBe(true);

        expect(() => wrapper.unmount()).not.toThrow();
    });
});
