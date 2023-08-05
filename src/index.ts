interface DomSQL {
	readonly elements: Readonly<HTMLElement[]>;
	select: (selector: string) => DomSQL;
	where: (condition: (element: HTMLElement) => boolean) => DomSQL;
	update: (cb: (element: HTMLElement) => void) => DomSQL;
	remove: () => DomSQL;
	clear: () => DomSQL;
	order: (compare: (a: HTMLElement, b: HTMLElement) => number) => DomSQL;
	limit: (count: number) => DomSQL;
	offset: (count: number) => DomSQL;
}

function DomSQL(): DomSQL {
	const privateState: { elements: HTMLElement[] } = { elements: [] };

	const state: DomSQL = {
		get elements() {
			return privateState.elements;
		},
		select: function (selector) {
			privateState.elements = Array.from(document.querySelectorAll(selector));

			return this;
		},
		where: function (condition) {
			privateState.elements = privateState.elements.filter(element => condition(element));

			return this;
		},
		update: function (cb) {
			privateState.elements.forEach(element => cb(element));

			return this;
		},
		remove: function () {
			privateState.elements.forEach(element => element.parentNode?.removeChild(element));

			return this;
		},
		clear: function () {
			privateState.elements = [];

			return this;
		},
		order: function (compare) {
			privateState.elements.sort(compare);

			return this;
		},
		limit: function (count) {
			privateState.elements = privateState.elements.slice(0, count + 1);

			return this;
		},
		offset: function (count) {
			privateState.elements = privateState.elements.slice(count);

			return this;
		},
	};

	return Object.assign({}, state);
}

export default DomSQL;
