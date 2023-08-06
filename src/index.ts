interface DomSQL {
	readonly elements: () => Readonly<HTMLElement[]>;
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
	const privateState: {
		elements: HTMLElement[];
		limitCount: number;
		offsetCount: number;
		rehydrateElements: () => void;
	} = {
		elements: [],
		limitCount: Infinity,
		offsetCount: 0,
		rehydrateElements: () => {
			if (privateState.limitCount || privateState.offsetCount) {
				const { limitCount, offsetCount } = privateState;

				privateState.elements = privateState.elements.slice(
					offsetCount,
					offsetCount + limitCount
				);
			}
		},
	};

	const state: DomSQL = {
		elements: function () {
			privateState.rehydrateElements();
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
			privateState.limitCount = count;
			return this;
		},
		offset: function (count) {
			privateState.offsetCount = count;
			return this;
		},
	};

	return Object.assign({}, state);
}

export default DomSQL;
