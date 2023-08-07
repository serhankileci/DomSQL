![](https://img.shields.io/npm/v/domsql?style=for-the-badge)
![](https://img.shields.io/npm/dt/domsql?style=for-the-badge)
![](https://img.shields.io/github/last-commit/serhankileci/domsql?style=for-the-badge)
![](https://img.shields.io/github/license/serhankileci/domsql?style=for-the-badge)

# DomSQL
Manipulate the DOM with SQL-like syntax in JavaScript.

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

/*
    list of elements that matched the query
    IMPORTANT: limit and offset are only applied when this is called
*/
const matchedElems = paragraphElem.elements();

// empty the paragraphElem query's matched elements list
paragraphElem.clear();

// remove elements from the DOM that matched the paragraphElem query
paragraphElem.remove();
```
