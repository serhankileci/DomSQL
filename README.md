# DomSQL
Manipulate the DOM with SQL-like syntax. Work in progress.

## To-do
- Transactions, or at the very least, a *revert* method for operations.
- The *update* method needs an overhaul. Two arguments could be needed separately for callable and non-callable HTMLElement properties; that way, function calls could be done in the first callback argument and configurations could be set in the second object argument. One roadblock I noticed is we we would need to find a way to partially accept HTMLElement properties without breaking functionality, which is what would happen if we use a recursive partial type.

## Example
```js
import DomSQL from "domsql";

const divsWithFooClass = DomSQL()
    .select("div")
    .where(el => el.classList.contains("foo"))
    .limit(5)
    .offset(10)
    .update(el => el.classList.add("bar"));

// get list of elements that matched the query
const matchedElems = divsWithFooClass.elements;

// remove elements from the DOM that matched the divsWithFooClass query
divsWithFooClass.remove();

// empty the divsWithFooClass query's elements list
divsWithFooClass.clear();

const textElems = DomSQL()
    .select("p")
    .where(el => {
        if (!el.textContent) return false;
        return el.textContent.length > 0;
    })
    .order((a, b) => {
        if (!a.textContent || !b.textContent) return 0;
        return a.textContent.localeCompare(b.textContent);
    })
    .limit(5)
    .offset(10)
    .update(el => {
        el.textContent = "foobar";
        el.style.color = "red";
    });
```
