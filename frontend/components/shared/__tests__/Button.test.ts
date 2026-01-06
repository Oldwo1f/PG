import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Button from "../Button.vue";

describe("Button", () => {
	it("renders properly", () => {
		const wrapper = mount(Button, {
			slots: {
				default: "Click me",
			},
		});
		expect(wrapper.text()).toBe("Click me");
	});

	it("emits click event when clicked", async () => {
		const wrapper = mount(Button);
		await wrapper.trigger("click");
		expect(wrapper.emitted("click")).toBeTruthy();
	});

	it("applies primary variant styles", () => {
		const wrapper = mount(Button, {
			props: {
				variant: "primary",
			},
		});
		expect(wrapper.classes()).toContain("bg-blue-500");
	});

	it("applies secondary variant styles", () => {
		const wrapper = mount(Button, {
			props: {
				variant: "secondary",
			},
		});
		expect(wrapper.classes()).toContain("bg-gray-200");
	});

	it("disables button when disabled prop is true", () => {
		const wrapper = mount(Button, {
			props: {
				disabled: true,
			},
		});
		expect(wrapper.attributes("disabled")).toBeDefined();
	});
});
