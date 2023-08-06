![](https://img.shields.io/npm/v/domsql?style=for-the-badge)
![](https://img.shields.io/npm/dt/domsql?style=for-the-badge)
![](https://img.shields.io/github/last-commit/serhankileci/domsql?style=for-the-badge)
![](https://img.shields.io/github/license/serhankileci/domsql?style=for-the-badge)

# DomSQL
Manipulate the DOM with SQL-like syntax. Work in progress, subject to breaking changes.

## To-do
- Transactions, or at least a *revert* method for operations.
- *Insert* method (?)
- *Group by* method (?)
- The *update* method needs an overhaul. Two arguments could be needed separately for callable and non-callable HTMLElement properties; that way, function calls could be done in the first callback argument and configurations could be set in the second object argument. One roadblock I noticed is we we would need to find a way to partially accept HTMLElement properties without breaking functionality, which is what would happen if we use a recursive partial type.

## Example
```js
import DomSQL from "domsql";

const paragraphElem = DomSQL()
    .select("p")
    .where(el => el.classList.contains("foo") && el.textContent!.length > 3)
    .order((a, b) => a.textContent!.localeCompare(b.textContent!))
    .limit(2)
    .offset(2)
    .update(el => el.classList.add("bar"));

// list of elements that matched the query
const matchedElems = paragraphElem.elements();

// empty the paragraphElem query's matched elements list
paragraphElem.clear();

// remove elements from the DOM that matched the paragraphElem query
paragraphElem.remove();
```
