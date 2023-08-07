type Except<T, K extends keyof T> = K extends keyof T ? Omit<T, K> : never;
type ExceptSelect = Except<DomSQL, "select">;
type ExceptWhere = Except<DomSQL, "select" | "where">;
type ExceptOrder = Except<DomSQL, "select" | "where" | "order">;
type ExceptLimit = Except<DomSQL, "select" | "where" | "order" | "limit">;
type ExceptOffset = Except<DomSQL, "select" | "where" | "order" | "limit" | "offset">;
type ExceptUpdate = Except<DomSQL, "select" | "where" | "order" | "limit" | "offset" | "update">;
type ExceptClear = Except<DomSQL, "clear">;
type ExceptRemove = Except<DomSQL, "remove">;

interface DomSQL {
	select: (selector: string) => ExceptSelect;
	where: (condition: (element: HTMLElement) => boolean) => ExceptWhere;
	order: (compare: (a: HTMLElement, b: HTMLElement) => number) => ExceptOrder;
	limit: (count: number) => ExceptLimit;
	offset: (count: number) => ExceptOffset;
	update: (cb: (element: HTMLElement) => void) => ExceptUpdate;
	clear: () => ExceptClear;
	remove: () => ExceptRemove;
	readonly elements: () => Readonly<HTMLElement[]>;
}

function DomSQL(): { select: DomSQL["select"] } {
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
