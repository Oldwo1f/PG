import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import SolutionSection from "../SolutionSection.vue";

describe("SolutionSection", () => {
	it("renders properly", () => {
		const wrapper = mount(SolutionSection);
		expect(wrapper.find("h2").exists()).toBe(true);
		expect(wrapper.find("p").exists()).toBe(true);
		expect(wrapper.findAll(".text-green-500")).toHaveLength(3);
	});

	it("displays all three solution points", () => {
		const wrapper = mount(SolutionSection);
		const solutions = wrapper.findAll(".text-xl.font-semibold");

		expect(solutions[0].text()).toBe("Textes Parfaits");
		expect(solutions[1].text()).toBe("Design Cohérent");
		expect(solutions[2].text()).toBe("Gain de Temps");
	});

	it("has correct checkmarks for each solution", () => {
		const wrapper = mount(SolutionSection);
		const checkmarks = wrapper.findAll(".text-green-500");

		expect(checkmarks).toHaveLength(3);
		checkmarks.forEach((checkmark) => {
			expect(checkmark.text()).toBe("✓");
		});
	});

	it("displays the demo image placeholder", () => {
		const wrapper = mount(SolutionSection);
		const placeholder = wrapper.find(".text-gray-400");
		expect(placeholder.exists()).toBe(true);
		expect(placeholder.text()).toBe("Image de démonstration");
	});
});
