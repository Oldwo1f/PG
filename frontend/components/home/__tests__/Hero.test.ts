import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Hero from "../Hero.vue";

describe("Hero", () => {
	it("renders properly", () => {
		const wrapper = mount(Hero);
		expect(wrapper.find("h1").exists()).toBe(true);
		expect(wrapper.find("p").exists()).toBe(true);
		expect(wrapper.findAll("button")).toHaveLength(2);
	});

	it("emits start event when first button is clicked", async () => {
		const wrapper = mount(Hero);
		await wrapper.findAll("button")[0].trigger("click");
		expect(wrapper.emitted("start")).toBeTruthy();
	});

	it("emits demo event when second button is clicked", async () => {
		const wrapper = mount(Hero);
		await wrapper.findAll("button")[1].trigger("click");
		expect(wrapper.emitted("demo")).toBeTruthy();
	});
});
