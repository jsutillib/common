/**
   Copyright 2021 Carlos A. (https://github.com/dealfonso)

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

(function(exports, document) {
    "use strict";
    if (exports.jsutillib === undefined) {
        exports.jsutillib = {};
    }

    /**
     * Removes those values in the array that are empty (i.e. its string value is "")
     * @returns the array with the values that are empty removed
     */
    Array.prototype._trim = function() {
        return this.filter(function(e) {
            return `${e}`.trim() !== "";
        });
    }

    /**
     * This function is a proxy to Element.append, but it returns the object, to enable to chain actions
     * @param  {...any} args The objects to append to the element
     * @returns the element
     */
    Element.prototype._append = function(...args) {
        this.append(...args);
        return this;
    }

    /**
     * This function creates a tag object using a notation like the one used for query selectors (e.g. div#myid.myclass.myclass2)
     *   if ommited the tag name, it will be considered as a div (e.g. #myid.myclass1.myclass2 or .myclass1.myclass2)
     * @param {*} tag tag to create in the form '<tag>#<id>.<class1>.<class2>'
     * @param {*} props other properties to set to the element (e.g. attributes) ** if is a text, it will be interpreted as the text param
     * @param {*} text text to set to the element (if prop is set to a string, this param will be ignored)
     * @returns the objet
     */
    function tag(tag, props = {}, text = null) {
        let parts_id = tag.split('#');

        let id = null;
        if (parts_id.length == 1) {
            tag = parts_id[0];
        } else {
            parts_id[1] = parts_id[1].split('.')
            id = parts_id[1][0];
            tag = [ parts_id[0], ...parts_id[1].slice(1) ].join('.');
        }

        let parts = tag.split('.');
        tag = parts[0];
        if (tag === "") {
            tag = "div";
        }

        if (typeof(props) === "string") {
            text = props;
            props = {};
        }

        if (text !== null) {
            props.textContent = text;
        }

        if (id !== null) {
            props.id = id;
        }

        props.className = [ props.className, ...parts.slice(1)]._trim().join(" ").trim();

        let el = document.createElement(tag);
        for (let prop in props) {
            if (el[prop] !== undefined) {
                el[prop] = props[prop];
            } else {
                el.setAttribute(prop, props[prop]);
            }
        }
        return el;
    }

    function merge(o1, o2) {
        let result = {};
        for (let key in o1) {
            result[key] = o1[key];
            if (o2[key] !== undefined) {
                result[key] = o2[key];
            }
        }
        return result;
    }

    /**
     * This function processes the properies of an object and applies a function to each of them. Moreover, it is possible to
     *   obtain a new object different from the original one (by passing flag clone=true); in that case, the original object
     *   will not be modified
     * @param {*} obj object to be processed
     * @param {*} func function to apply to each property of the object; the function interface is func(value, name_of_property, obj). Default (x) => x
     * @param {*} clone if true, a new object will be created, and the original object will not be modified; if false, each of the properties will be modified 
     *            by applying the function
     * @returns the processed object
     */
    function processprops(target, objectfnc = (v) => v, clone = false) {
        if (typeof (target) === "object") {
            let result = target;
            if (clone) {
                result = {}
            }
            for (let prop in target) {
                if (target.hasOwnProperty(prop)) {
                    result[prop] = objectfnc(target[prop], prop, target);
                }
            }
            if (clone) {
                // Keep the class in the new object
                result.__proto__ = target.__proto__;
            }
            return result;
        } else {
            return target;
        }        
    }

    function clone(target, objectfnc = (x) => clone(x)) {
        return processprops(target, objectfnc, true);
    }

    exports.jsutillib.tag = tag;
    exports.jsutillib.merge = merge;
    exports.jsutillib.clone = clone;
    exports.jsutillib.processprops = processprops;
})(window, document);

