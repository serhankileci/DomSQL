import DomSQL from "../build/index.js";
import { expect, test, beforeEach, afterEach, describe } from "vitest";

describe("Testing DomSQL query methods.", () => {
	beforeEach(() => {
		document.body.innerHTML = `
			<div class="item" data-value="1">Item 1</div>
			<div class="item" data-value="2">Item 2</div>
			<div class="item" data-value="3">Item 3</div>
    	`;
	});

	afterEach(() => {
		document.body.innerHTML = "";
	});

	test("'Select' method that selects elements based on a CSS selector.", () => {
		const dom = DomSQL();

		const selectedElements = dom.select(".item").elements();
		expect(selectedElements.length).toBe(3);
	});

	test("'Where' method that filters elements.", () => {
		const dom = DomSQL();
		const selectedElements = dom
			.select(".item")
			.where(element => element.dataset.value === "2")
			.elements();

		expect(selectedElements.length).toBe(1);
		expect(selectedElements[0].textContent).toBe("Item 2");
	});

	test("'Update' method to update elements.", () => {
		const dom = DomSQL();
		dom.select(".item").update(element => {
			element.textContent = "Updated Item";
		});
		const updatedElements = document.querySelectorAll(".item");
		expect(updatedElements[0].textContent).toBe("Updated Item");
		expect(updatedElements[1].textContent).toBe("Updated Item");
		expect(updatedElements[2].textContent).toBe("Updated Item");
	});

	test("'Remove' method to remove elements.", () => {
		const dom = DomSQL();
		dom.select(".item").remove();
		const remainingElements = document.querySelectorAll(".item");
		expect(remainingElements.length).toBe(0);
	});

	test("'Clear' method to clear matched HTML elements list.", () => {
		const dom = DomSQL();
		dom.select(".item").clear();
		const selectedElements = dom.elements();
		expect(selectedElements.length).toBe(0);
	});

	test("'Order' method to order elements.", () => {
		const dom = DomSQL();
		const orderedElements = dom
			.select(".item")
			.order((a, b) => {
				return a.dataset.value!.localeCompare(b.dataset.value!);
			})
			.elements();
		expect(orderedElements[0].dataset.value).toBe("1");
		expect(orderedElements[1].dataset.value).toBe("2");
		expect(orderedElements[2].dataset.value).toBe("3");
	});

	test("'Limit' method to limit the number of matched elements.", () => {
		const dom = DomSQL();
		const selectedElements = dom.select(".item").limit(2).elements();
		expect(selectedElements.length).toBe(2);
	});

	test("'Offset' method to skip by specified amount in the matched elements list.", () => {
		const dom = DomSQL();
		const selectedElements = dom.select(".item").offset(1).elements();
		expect(selectedElements.length).toBe(2);
		expect(selectedElements[0].dataset.value).toBe("2");
		expect(selectedElements[1].dataset.value).toBe("3");
	});
});
