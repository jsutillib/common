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
    if (exports.jsutilslib === undefined) {
        exports.jsutilslib = {};
    }
    Array.prototype._trim = function() {
        return this.filter(function(e) {
            return `${e}`.trim() !== "";
        });
    };
    Element.prototype._append = function(...args) {
        this.append(...args);
        return this;
    };
    function tag(tag, props = {}, text = null) {
        let parts_id = tag.split("#");
        let id = null;
        if (parts_id.length == 1) {
            tag = parts_id[0];
        } else {
            parts_id[1] = parts_id[1].split(".");
            id = parts_id[1][0];
            tag = [ parts_id[0], ...parts_id[1].slice(1) ].join(".");
        }
        let parts = tag.split(".");
        tag = parts[0];
        if (tag === "") {
            tag = "div";
        }
        if (typeof props === "string") {
            text = props;
            props = {};
        }
        if (text !== null) {
            props.textContent = text;
        }
        if (id !== null) {
            props.id = id;
        }
        props.className = [ props.className, ...parts.slice(1) ]._trim().join(" ").trim();
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
    function processprops(target, objectfnc = v => v, clone = false) {
        if (typeof target === "object") {
            let result = target;
            if (clone) {
                result = {};
            }
            for (let prop in target) {
                if (target.hasOwnProperty(prop)) {
                    result[prop] = objectfnc(target[prop], prop, target);
                }
            }
            if (clone) {
                result.__proto__ = target.__proto__;
            }
            return result;
        } else {
            return target;
        }
    }
    function clone(target, objectfnc = x => clone(x)) {
        return processprops(target, objectfnc, true);
    }
    exports.jsutilslib.tag = tag;
    exports.jsutilslib.merge = merge;
    exports.jsutilslib.clone = clone;
    exports.jsutilslib.processprops = processprops;
})(window, document);
