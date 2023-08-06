interface DomSQL {
	select: (selector: string) => DomSQL;
	where: (condition: (element: HTMLElement) => boolean) => DomSQL;
	update: (cb: (element: HTMLElement) => void) => DomSQL;
	remove: () => DomSQL;
	clear: () => DomSQL;
	order: (compare: (a: HTMLElement, b: HTMLElement) => number) => DomSQL;
	limit: (count: number) => DomSQL;
	offset: (count: number) => DomSQL;
	readonly elements: () => Readonly<HTMLElement[]>;
}

function DomSQL(): DomSQL {
	const privateState: {
		elements: HTMLElement[];
		limitCount: number;
		offsetCount: number;
		rehydrateElements: () => void;
		wasRehydratedToggle: boolean;
	} = {
		elements: [],
		limitCount: Infinity,
		offsetCount: 0,
		wasRehydratedToggle: false,
		rehydrateElements: () => {
			if (
				!privateState.wasRehydratedToggle &&
				(privateState.limitCount || privateState.offsetCount)
			) {
				const { limitCount, offsetCount } = privateState;

				privateState.elements = privateState.elements.slice(
					offsetCount,
					offsetCount + limitCount
				);

				privateState.wasRehydratedToggle = true;
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
			privateState.wasRehydratedToggle = false;
			return this;
		},
		where: function (condition) {
			privateState.elements = privateState.elements.filter(element => condition(element));
			privateState.wasRehydratedToggle = false;
			return this;
		},
		update: function (cb) {
			privateState.elements.forEach(element => cb(element));
			privateState.wasRehydratedToggle = false;
			return this;
		},
		remove: function () {
			privateState.elements.forEach(element => element.parentNode?.removeChild(element));
			privateState.wasRehydratedToggle = false;
			return this;
		},
		clear: function () {
			privateState.elements = [];
			privateState.wasRehydratedToggle = false;
			return this;
		},
		order: function (compare) {
			privateState.elements.sort(compare);
			privateState.wasRehydratedToggle = false;
			return this;
		},
		limit: function (count) {
			privateState.limitCount = count;
			privateState.wasRehydratedToggle = false;
			return this;
		},
		offset: function (count) {
			privateState.offsetCount = count;
			privateState.wasRehydratedToggle = false;
			return this;
		},
	};

	return Object.assign({}, state);
}

export default DomSQL;
