import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import ProblemSection from "../ProblemSection.vue";

describe("ProblemSection", () => {
	it("renders properly", () => {
		const wrapper = mount(ProblemSection);
		expect(wrapper.find("h2").exists()).toBe(true);
		expect(wrapper.findAll(".bg-white")).toHaveLength(3);
	});

	it("displays all three problem cards", () => {
		const wrapper = mount(ProblemSection);
		const cards = wrapper.findAll(".bg-white");

		expect(cards[0].text()).toContain("Textes Mal Écrits");
		expect(cards[1].text()).toContain("Designs Bizarres");
		expect(cards[2].text()).toContain("Temps Perdu");
	});

	it("has correct icons for each problem", () => {
		const wrapper = mount(ProblemSection);
		const icons = wrapper.findAll(".text-red-500");

		expect(icons[0].text()).toBe("❌");
		expect(icons[1].text()).toBe("🤔");
		expect(icons[2].text()).toBe("⏱️");
	});
});
