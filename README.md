# jsutilslib common utilities
This is a set of javascript helper classes and functions for javascript applications.

_jsutilslib_ can be used by themselves in your web applications, but they are also part of [`jsutilslib`](https://github.com/jsutilslib/jsutilslib), which is a library that consists of a set of curated components, utility functions, clases, etc. that are flexible enough to be re-used in different javascript applications.

> Some parts of the library are intended to be used in conjunction with jQuery, and so it is advisable to include jQuery in your project prior to including jsutilslib.

## Common utilities
The library consists of the next utilities:

- tag: enables to create html elements using a notation similar to pug or jade.
- processprops: processes the properties of an object by applying a function to each of them; it is also able to clone the object.
- clone: is a shorthand for processprops that forces cloning the object.
- merge: merges two objects into a single one, but only those properties that are part of the first one.
- Array._trim: appends a function to the Array prototype that removes the empty elements from an array.
- Element._append: is a proxy to Element.append() function that returns the element thus enabling to chain multiple actions on the object.

## Using

There are a set of _javascript_ files that contain a part of the library, each one (in folder `js`). These files can be used individually or combined into a single one, by concatenating them (or by using `uglify-js`).

A `Makefile` is provided to create the single all-in-one `js` files for the library.

```console
# npm install -g uglify-js
...
# git clone https://github.com/jsutilslib/common
# cd common
# make
uglifyjs js/*.js  -b | cat notice - > common.js
uglifyjs js/*.js  | cat notice.min - > common.min.js
```

Now you can use files `common.min.js`:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
<script src="common.min.js"></script>
```

### From a CDN

It is possible to use `common` directly from a CDN:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/jsutilslib/common@1.0.0-beta/common.min.js"></script>
```

## Documentation

### Tag

This is a helper function, used to create html objects from pug-like object description.

```javascript
jsutilslib.tag('p#id1.class1.class2');
```

will create a tag like 

```html
<p id="id1" class="class1 class2"></p>
```

The prototype of `tag` function is

```javascript
jsutilslib.tag(htmldescription, text)
jsutilslib.tag(htmldescription, properties, text)
```

The parameter description is the next:
- _htmldescription_: is the description of the object, using the notation `[tag name][#id][.class1][.class2]...[.classN]`. If ommited, the tag name will be considered as `div`; if ommited the other parts, they will not be included in the html tag.
- _text_: is the text content for the object.
- _properties_: is a dictionary of attributes that will appear in the html tag.

**Examples**

- `jsutilslib.tag("p.small", "New tag")` creates `<p class="small">New tag</p>`
- `jsutilslib.tag(".selectable", {style: "width: 100%"})` creates `<div class="selectable" style="width: 100%;"></div>`
- `jsutilslib.tag("#selection.selectable")` creates `<div id="selection" class="selectable"></div>`


### processprops

`processprops` is a function that processes the properties of an object, by applying a function to each of them.

The prototype of `processprops` of the function is the next:

```javascript
function processprops(target, objectfnc = v => v, clone = false)
```

Where
- _target_: is the object whose properties are to be processed.
- _objectfnc_: is the function to apply to each property. The prototype is `function(value, name_of_propery, object)`.
- _clone_: if true, a new object will be 

Let's explain it by an example:

```javascript
let obj = { a:1, b:2, c:3 };
let obj1 = jsutilslib.processprops(obj, (x) => (x + 1));
```

In this example, the function `(x) => (x + 1)` is applied to each property, and the result is the next:

```javascript
{a: 2, b: 3, c: 4}
```

As we did not clone the object (parameter clone set to `false` by default), both obj and obj1 objects are the same. Then if we change a property in obj1, it will be reflected in obj:

```javascript
$ obj1.a = 10
10
$ obj
{a: 10, b: 3, c: 4}
```

If we wanted each object to be different, we could clone the object:

```javascript
$ obj = { a:1, b:2, c:3 };
$ let obj2 = jsutilslib.processprops(obj, (x) => (x + 1), true)
{a: 2, b: 3, c: 4}
```

And if we modify obj2, we'll see that obj keeps its state:

```javascript
$ obj2.a = 20
20
$ obj
{a: 1, b: 2, c: 3}
$ obj2
{a: 20, b: 3, c: 4}
```

The function also works with arbitrary object and arbitrary processing functions.

```javascript
$ class TestClass {
    constructor (a) {
        this.a = a;
    }
}
$ a1 = new TestClass("simpleA")
TestClass {a: 'simpleA'}
    a: "simpleA"
    [[Prototype]]: Object
$ a2 = jsutilslib.processprops(a1, (x) => new TestClass(x))
TestClass {a: TestClass}
    a: TestClassa: "simpleA"
        [[Prototype]]: Object
    [[Prototype]]: Object
```

Even it works when cloning the object

```javascript
$ a3 = new TestClass("simpleA")
TestClass {a: 'simpleA'}
    a: "simpleA"
    [[Prototype]]: Object
$ a4 = jsutilslib.processprops(a3, (x) => new TestClass(`independent ${x}`), true)
TestClass {a: TestClass}
    a: TestClass
        a: "independent simpleA"
            [[Prototype]]: Object
        [[Prototype]]: Object
```

### clone

Function `clone` is a shorthand for `processprops` which clones the object and its properties. The prototype is the next

```javascript
function clone(target, objectfnc = x => clone(x))
```

### merge

This function walks over the properties of one object and sets the properties to the values of the properties with the same name in other project. The function returns a different object. This is useful for e.g. creating settings from default values and user provided ones.

```javascript
$ defaults = {
    classdragging: 'grabbing',
    callbackstart: function() {},
    callbackend: function() {},
    callbackmove: function(dx, dy) {}
}
$ settings = jsutilslib.merge(defaults, { classdragging: "dragging" });
```

### Array._trim

Function `_trim` is appended to the prototype of class Array. This function removes the _empty elements_ from the array (those that evaluate to a string equal to "").

```javascript
$ a = ['a', 'b', '', 'd' ]
$ a._trim()
['a', 'b', 'd']
```

### Element._append

Function `_append` is appended to the prototype of class Element. This function simply calls function `Element.append`, but also returns the object in order to enable function chaining.

```javascript
$ document.querySelector('body')._append(jsutilslib.tag("p", "content"))._append(jsutilslib.tag("p", "more content"))
```

