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
		limitCount?: number;
		offsetCount?: number;
		isReloaded: boolean;
		shouldReload: () => boolean;
		reload: () => void;
	} = {
		elements: [],
		limitCount: undefined,
		offsetCount: undefined,
		isReloaded: false,
		shouldReload: function () {
			return (
				!privateState.isReloaded &&
				(Boolean(privateState.limitCount) || Boolean(privateState.offsetCount))
			);
		},
		reload: function () {
			const { limitCount = 0, offsetCount = 0 } = privateState;
			let sliceArgs;

			if (limitCount && offsetCount) {
				sliceArgs = [offsetCount, offsetCount + limitCount];
			} else if (limitCount && !offsetCount) {
				sliceArgs = [0, limitCount];
			} else if (!limitCount && offsetCount) {
				sliceArgs = offsetCount;
			}

			privateState.elements = privateState.elements.slice(
				...(Array.isArray(sliceArgs) ? sliceArgs : [sliceArgs])
			);

			privateState.limitCount = 0;
			privateState.offsetCount = 0;
			privateState.isReloaded = true;
		},
	};

	const state: DomSQL = {
		elements: function () {
			if (privateState.shouldReload()) {
				privateState.reload();
			}

			return privateState.elements;
		},
		order: function (compare) {
			privateState.elements.sort(compare);
			privateState.isReloaded = false;
			return this;
		},
		select: function (selector) {
			privateState.elements = Array.from(document.querySelectorAll(selector));
			privateState.isReloaded = false;
			return this;
		},
		where: function (condition) {
			privateState.elements = privateState.elements.filter(element => condition(element));
			privateState.isReloaded = false;
			return this;
		},
		update: function (cb) {
			if (privateState.shouldReload()) {
				privateState.reload();
			}

			privateState.elements.forEach(element => cb(element));
			privateState.isReloaded = false;
			return this;
		},
		remove: function () {
			privateState.elements.forEach(element => element.parentNode?.removeChild(element));
			privateState.isReloaded = false;
			return this;
		},
		clear: function () {
			privateState.elements = [];
			privateState.isReloaded = false;
			return this;
		},
		limit: function (count) {
			privateState.limitCount = count;
			privateState.isReloaded = false;
			return this;
		},
		offset: function (count) {
			privateState.offsetCount = count;
			privateState.isReloaded = false;
			return this;
		},
	};

	return Object.assign({}, state);
}

export default DomSQL;
