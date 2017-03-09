(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vizdip = require("./../src/vizdip");
window.vizdip = vizdip;

},{"./../src/vizdip":224}],2:[function(require,module,exports){
(function (process){
'use strict';

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @typechecks
 */

var emptyFunction = require('./emptyFunction');

/**
 * Upstream version of event listener. Does not take into account specific
 * nature of platform.
 */
var EventListener = {
  /**
   * Listen to DOM events during the bubble phase.
   *
   * @param {DOMEventTarget} target DOM element to register listener on.
   * @param {string} eventType Event type, e.g. 'click' or 'mouseover'.
   * @param {function} callback Callback function.
   * @return {object} Object with a `remove` method.
   */
  listen: function listen(target, eventType, callback) {
    if (target.addEventListener) {
      target.addEventListener(eventType, callback, false);
      return {
        remove: function remove() {
          target.removeEventListener(eventType, callback, false);
        }
      };
    } else if (target.attachEvent) {
      target.attachEvent('on' + eventType, callback);
      return {
        remove: function remove() {
          target.detachEvent('on' + eventType, callback);
        }
      };
    }
  },

  /**
   * Listen to DOM events during the capture phase.
   *
   * @param {DOMEventTarget} target DOM element to register listener on.
   * @param {string} eventType Event type, e.g. 'click' or 'mouseover'.
   * @param {function} callback Callback function.
   * @return {object} Object with a `remove` method.
   */
  capture: function capture(target, eventType, callback) {
    if (target.addEventListener) {
      target.addEventListener(eventType, callback, true);
      return {
        remove: function remove() {
          target.removeEventListener(eventType, callback, true);
        }
      };
    } else {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Attempted to listen to events during the capture phase on a ' + 'browser that does not support the capture phase. Your application ' + 'will not receive some events.');
      }
      return {
        remove: emptyFunction
      };
    }
  },

  registerDefault: function registerDefault() {}
};

module.exports = EventListener;
}).call(this,require('_process'))
},{"./emptyFunction":9,"_process":58}],3:[function(require,module,exports){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);

/**
 * Simple, lightweight module assisting with the detection and context of
 * Worker. Helps avoid circular dependencies and allows code to reason about
 * whether or not they are in a Worker, even if they never include the main
 * `ReactWorker` dependency.
 */
var ExecutionEnvironment = {

  canUseDOM: canUseDOM,

  canUseWorkers: typeof Worker !== 'undefined',

  canUseEventListeners: canUseDOM && !!(window.addEventListener || window.attachEvent),

  canUseViewport: canUseDOM && !!window.screen,

  isInWorker: !canUseDOM // For now, this is true - might change in the future.

};

module.exports = ExecutionEnvironment;
},{}],4:[function(require,module,exports){
"use strict";

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @typechecks
 */

var _hyphenPattern = /-(.)/g;

/**
 * Camelcases a hyphenated string, for example:
 *
 *   > camelize('background-color')
 *   < "backgroundColor"
 *
 * @param {string} string
 * @return {string}
 */
function camelize(string) {
  return string.replace(_hyphenPattern, function (_, character) {
    return character.toUpperCase();
  });
}

module.exports = camelize;
},{}],5:[function(require,module,exports){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @typechecks
 */

'use strict';

var camelize = require('./camelize');

var msPattern = /^-ms-/;

/**
 * Camelcases a hyphenated CSS property name, for example:
 *
 *   > camelizeStyleName('background-color')
 *   < "backgroundColor"
 *   > camelizeStyleName('-moz-transition')
 *   < "MozTransition"
 *   > camelizeStyleName('-ms-transition')
 *   < "msTransition"
 *
 * As Andi Smith suggests
 * (http://www.andismith.com/blog/2012/02/modernizr-prefixed/), an `-ms` prefix
 * is converted to lowercase `ms`.
 *
 * @param {string} string
 * @return {string}
 */
function camelizeStyleName(string) {
  return camelize(string.replace(msPattern, 'ms-'));
}

module.exports = camelizeStyleName;
},{"./camelize":4}],6:[function(require,module,exports){
'use strict';

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

var isTextNode = require('./isTextNode');

/*eslint-disable no-bitwise */

/**
 * Checks if a given DOM node contains or is another DOM node.
 */
function containsNode(outerNode, innerNode) {
  if (!outerNode || !innerNode) {
    return false;
  } else if (outerNode === innerNode) {
    return true;
  } else if (isTextNode(outerNode)) {
    return false;
  } else if (isTextNode(innerNode)) {
    return containsNode(outerNode, innerNode.parentNode);
  } else if ('contains' in outerNode) {
    return outerNode.contains(innerNode);
  } else if (outerNode.compareDocumentPosition) {
    return !!(outerNode.compareDocumentPosition(innerNode) & 16);
  } else {
    return false;
  }
}

module.exports = containsNode;
},{"./isTextNode":19}],7:[function(require,module,exports){
(function (process){
'use strict';

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @typechecks
 */

var invariant = require('./invariant');

/**
 * Convert array-like objects to arrays.
 *
 * This API assumes the caller knows the contents of the data type. For less
 * well defined inputs use createArrayFromMixed.
 *
 * @param {object|function|filelist} obj
 * @return {array}
 */
function toArray(obj) {
  var length = obj.length;

  // Some browsers builtin objects can report typeof 'function' (e.g. NodeList
  // in old versions of Safari).
  !(!Array.isArray(obj) && (typeof obj === 'object' || typeof obj === 'function')) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'toArray: Array-like object expected') : invariant(false) : void 0;

  !(typeof length === 'number') ? process.env.NODE_ENV !== 'production' ? invariant(false, 'toArray: Object needs a length property') : invariant(false) : void 0;

  !(length === 0 || length - 1 in obj) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'toArray: Object should have keys for indices') : invariant(false) : void 0;

  !(typeof obj.callee !== 'function') ? process.env.NODE_ENV !== 'production' ? invariant(false, 'toArray: Object can\'t be `arguments`. Use rest params ' + '(function(...args) {}) or Array.from() instead.') : invariant(false) : void 0;

  // Old IE doesn't give collections access to hasOwnProperty. Assume inputs
  // without method will throw during the slice call and skip straight to the
  // fallback.
  if (obj.hasOwnProperty) {
    try {
      return Array.prototype.slice.call(obj);
    } catch (e) {
      // IE < 9 does not support Array#slice on collections objects
    }
  }

  // Fall back to copying key by key. This assumes all keys have a value,
  // so will not preserve sparsely populated inputs.
  var ret = Array(length);
  for (var ii = 0; ii < length; ii++) {
    ret[ii] = obj[ii];
  }
  return ret;
}

/**
 * Perform a heuristic test to determine if an object is "array-like".
 *
 *   A monk asked Joshu, a Zen master, "Has a dog Buddha nature?"
 *   Joshu replied: "Mu."
 *
 * This function determines if its argument has "array nature": it returns
 * true if the argument is an actual array, an `arguments' object, or an
 * HTMLCollection (e.g. node.childNodes or node.getElementsByTagName()).
 *
 * It will return false for other array-like objects like Filelist.
 *
 * @param {*} obj
 * @return {boolean}
 */
function hasArrayNature(obj) {
  return (
    // not null/false
    !!obj && (
    // arrays are objects, NodeLists are functions in Safari
    typeof obj == 'object' || typeof obj == 'function') &&
    // quacks like an array
    'length' in obj &&
    // not window
    !('setInterval' in obj) &&
    // no DOM node should be considered an array-like
    // a 'select' element has 'length' and 'item' properties on IE8
    typeof obj.nodeType != 'number' && (
    // a real array
    Array.isArray(obj) ||
    // arguments
    'callee' in obj ||
    // HTMLCollection/NodeList
    'item' in obj)
  );
}

/**
 * Ensure that the argument is an array by wrapping it in an array if it is not.
 * Creates a copy of the argument if it is already an array.
 *
 * This is mostly useful idiomatically:
 *
 *   var createArrayFromMixed = require('createArrayFromMixed');
 *
 *   function takesOneOrMoreThings(things) {
 *     things = createArrayFromMixed(things);
 *     ...
 *   }
 *
 * This allows you to treat `things' as an array, but accept scalars in the API.
 *
 * If you need to convert an array-like object, like `arguments`, into an array
 * use toArray instead.
 *
 * @param {*} obj
 * @return {array}
 */
function createArrayFromMixed(obj) {
  if (!hasArrayNature(obj)) {
    return [obj];
  } else if (Array.isArray(obj)) {
    return obj.slice();
  } else {
    return toArray(obj);
  }
}

module.exports = createArrayFromMixed;
}).call(this,require('_process'))
},{"./invariant":17,"_process":58}],8:[function(require,module,exports){
(function (process){
'use strict';

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @typechecks
 */

/*eslint-disable fb-www/unsafe-html*/

var ExecutionEnvironment = require('./ExecutionEnvironment');

var createArrayFromMixed = require('./createArrayFromMixed');
var getMarkupWrap = require('./getMarkupWrap');
var invariant = require('./invariant');

/**
 * Dummy container used to render all markup.
 */
var dummyNode = ExecutionEnvironment.canUseDOM ? document.createElement('div') : null;

/**
 * Pattern used by `getNodeName`.
 */
var nodeNamePattern = /^\s*<(\w+)/;

/**
 * Extracts the `nodeName` of the first element in a string of markup.
 *
 * @param {string} markup String of markup.
 * @return {?string} Node name of the supplied markup.
 */
function getNodeName(markup) {
  var nodeNameMatch = markup.match(nodeNamePattern);
  return nodeNameMatch && nodeNameMatch[1].toLowerCase();
}

/**
 * Creates an array containing the nodes rendered from the supplied markup. The
 * optionally supplied `handleScript` function will be invoked once for each
 * <script> element that is rendered. If no `handleScript` function is supplied,
 * an exception is thrown if any <script> elements are rendered.
 *
 * @param {string} markup A string of valid HTML markup.
 * @param {?function} handleScript Invoked once for each rendered <script>.
 * @return {array<DOMElement|DOMTextNode>} An array of rendered nodes.
 */
function createNodesFromMarkup(markup, handleScript) {
  var node = dummyNode;
  !!!dummyNode ? process.env.NODE_ENV !== 'production' ? invariant(false, 'createNodesFromMarkup dummy not initialized') : invariant(false) : void 0;
  var nodeName = getNodeName(markup);

  var wrap = nodeName && getMarkupWrap(nodeName);
  if (wrap) {
    node.innerHTML = wrap[1] + markup + wrap[2];

    var wrapDepth = wrap[0];
    while (wrapDepth--) {
      node = node.lastChild;
    }
  } else {
    node.innerHTML = markup;
  }

  var scripts = node.getElementsByTagName('script');
  if (scripts.length) {
    !handleScript ? process.env.NODE_ENV !== 'production' ? invariant(false, 'createNodesFromMarkup(...): Unexpected <script> element rendered.') : invariant(false) : void 0;
    createArrayFromMixed(scripts).forEach(handleScript);
  }

  var nodes = Array.from(node.childNodes);
  while (node.lastChild) {
    node.removeChild(node.lastChild);
  }
  return nodes;
}

module.exports = createNodesFromMarkup;
}).call(this,require('_process'))
},{"./ExecutionEnvironment":3,"./createArrayFromMixed":7,"./getMarkupWrap":13,"./invariant":17,"_process":58}],9:[function(require,module,exports){
"use strict";

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

function makeEmptyFunction(arg) {
  return function () {
    return arg;
  };
}

/**
 * This function accepts and discards inputs; it has no side effects. This is
 * primarily useful idiomatically for overridable function endpoints which
 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
 */
var emptyFunction = function emptyFunction() {};

emptyFunction.thatReturns = makeEmptyFunction;
emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
emptyFunction.thatReturnsNull = makeEmptyFunction(null);
emptyFunction.thatReturnsThis = function () {
  return this;
};
emptyFunction.thatReturnsArgument = function (arg) {
  return arg;
};

module.exports = emptyFunction;
},{}],10:[function(require,module,exports){
(function (process){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var emptyObject = {};

if (process.env.NODE_ENV !== 'production') {
  Object.freeze(emptyObject);
}

module.exports = emptyObject;
}).call(this,require('_process'))
},{"_process":58}],11:[function(require,module,exports){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

/**
 * @param {DOMElement} node input/textarea to focus
 */

function focusNode(node) {
  // IE8 can throw "Can't move focus to the control because it is invisible,
  // not enabled, or of a type that does not accept the focus." for all kinds of
  // reasons that are too expensive and fragile to test.
  try {
    node.focus();
  } catch (e) {}
}

module.exports = focusNode;
},{}],12:[function(require,module,exports){
'use strict';

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @typechecks
 */

/* eslint-disable fb-www/typeof-undefined */

/**
 * Same as document.activeElement but wraps in a try-catch block. In IE it is
 * not safe to call document.activeElement if there is nothing focused.
 *
 * The activeElement will be null only if the document or document body is not
 * yet defined.
 */
function getActiveElement() /*?DOMElement*/{
  if (typeof document === 'undefined') {
    return null;
  }
  try {
    return document.activeElement || document.body;
  } catch (e) {
    return document.body;
  }
}

module.exports = getActiveElement;
},{}],13:[function(require,module,exports){
(function (process){
'use strict';

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

/*eslint-disable fb-www/unsafe-html */

var ExecutionEnvironment = require('./ExecutionEnvironment');

var invariant = require('./invariant');

/**
 * Dummy container used to detect which wraps are necessary.
 */
var dummyNode = ExecutionEnvironment.canUseDOM ? document.createElement('div') : null;

/**
 * Some browsers cannot use `innerHTML` to render certain elements standalone,
 * so we wrap them, render the wrapped nodes, then extract the desired node.
 *
 * In IE8, certain elements cannot render alone, so wrap all elements ('*').
 */

var shouldWrap = {};

var selectWrap = [1, '<select multiple="true">', '</select>'];
var tableWrap = [1, '<table>', '</table>'];
var trWrap = [3, '<table><tbody><tr>', '</tr></tbody></table>'];

var svgWrap = [1, '<svg xmlns="http://www.w3.org/2000/svg">', '</svg>'];

var markupWrap = {
  '*': [1, '?<div>', '</div>'],

  'area': [1, '<map>', '</map>'],
  'col': [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
  'legend': [1, '<fieldset>', '</fieldset>'],
  'param': [1, '<object>', '</object>'],
  'tr': [2, '<table><tbody>', '</tbody></table>'],

  'optgroup': selectWrap,
  'option': selectWrap,

  'caption': tableWrap,
  'colgroup': tableWrap,
  'tbody': tableWrap,
  'tfoot': tableWrap,
  'thead': tableWrap,

  'td': trWrap,
  'th': trWrap
};

// Initialize the SVG elements since we know they'll always need to be wrapped
// consistently. If they are created inside a <div> they will be initialized in
// the wrong namespace (and will not display).
var svgElements = ['circle', 'clipPath', 'defs', 'ellipse', 'g', 'image', 'line', 'linearGradient', 'mask', 'path', 'pattern', 'polygon', 'polyline', 'radialGradient', 'rect', 'stop', 'text', 'tspan'];
svgElements.forEach(function (nodeName) {
  markupWrap[nodeName] = svgWrap;
  shouldWrap[nodeName] = true;
});

/**
 * Gets the markup wrap configuration for the supplied `nodeName`.
 *
 * NOTE: This lazily detects which wraps are necessary for the current browser.
 *
 * @param {string} nodeName Lowercase `nodeName`.
 * @return {?array} Markup wrap configuration, if applicable.
 */
function getMarkupWrap(nodeName) {
  !!!dummyNode ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Markup wrapping node not initialized') : invariant(false) : void 0;
  if (!markupWrap.hasOwnProperty(nodeName)) {
    nodeName = '*';
  }
  if (!shouldWrap.hasOwnProperty(nodeName)) {
    if (nodeName === '*') {
      dummyNode.innerHTML = '<link />';
    } else {
      dummyNode.innerHTML = '<' + nodeName + '></' + nodeName + '>';
    }
    shouldWrap[nodeName] = !dummyNode.firstChild;
  }
  return shouldWrap[nodeName] ? markupWrap[nodeName] : null;
}

module.exports = getMarkupWrap;
}).call(this,require('_process'))
},{"./ExecutionEnvironment":3,"./invariant":17,"_process":58}],14:[function(require,module,exports){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @typechecks
 */

'use strict';

/**
 * Gets the scroll position of the supplied element or window.
 *
 * The return values are unbounded, unlike `getScrollPosition`. This means they
 * may be negative or exceed the element boundaries (which is possible using
 * inertial scrolling).
 *
 * @param {DOMWindow|DOMElement} scrollable
 * @return {object} Map with `x` and `y` keys.
 */

function getUnboundedScrollPosition(scrollable) {
  if (scrollable === window) {
    return {
      x: window.pageXOffset || document.documentElement.scrollLeft,
      y: window.pageYOffset || document.documentElement.scrollTop
    };
  }
  return {
    x: scrollable.scrollLeft,
    y: scrollable.scrollTop
  };
}

module.exports = getUnboundedScrollPosition;
},{}],15:[function(require,module,exports){
'use strict';

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @typechecks
 */

var _uppercasePattern = /([A-Z])/g;

/**
 * Hyphenates a camelcased string, for example:
 *
 *   > hyphenate('backgroundColor')
 *   < "background-color"
 *
 * For CSS style names, use `hyphenateStyleName` instead which works properly
 * with all vendor prefixes, including `ms`.
 *
 * @param {string} string
 * @return {string}
 */
function hyphenate(string) {
  return string.replace(_uppercasePattern, '-$1').toLowerCase();
}

module.exports = hyphenate;
},{}],16:[function(require,module,exports){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @typechecks
 */

'use strict';

var hyphenate = require('./hyphenate');

var msPattern = /^ms-/;

/**
 * Hyphenates a camelcased CSS property name, for example:
 *
 *   > hyphenateStyleName('backgroundColor')
 *   < "background-color"
 *   > hyphenateStyleName('MozTransition')
 *   < "-moz-transition"
 *   > hyphenateStyleName('msTransition')
 *   < "-ms-transition"
 *
 * As Modernizr suggests (http://modernizr.com/docs/#prefixed), an `ms` prefix
 * is converted to `-ms-`.
 *
 * @param {string} string
 * @return {string}
 */
function hyphenateStyleName(string) {
  return hyphenate(string).replace(msPattern, '-ms-');
}

module.exports = hyphenateStyleName;
},{"./hyphenate":15}],17:[function(require,module,exports){
(function (process){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var validateFormat = function validateFormat(format) {};

if (process.env.NODE_ENV !== 'production') {
  validateFormat = function validateFormat(format) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  };
}

function invariant(condition, format, a, b, c, d, e, f) {
  validateFormat(format);

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(format.replace(/%s/g, function () {
        return args[argIndex++];
      }));
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
}

module.exports = invariant;
}).call(this,require('_process'))
},{"_process":58}],18:[function(require,module,exports){
'use strict';

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @typechecks
 */

/**
 * @param {*} object The object to check.
 * @return {boolean} Whether or not the object is a DOM node.
 */
function isNode(object) {
  return !!(object && (typeof Node === 'function' ? object instanceof Node : typeof object === 'object' && typeof object.nodeType === 'number' && typeof object.nodeName === 'string'));
}

module.exports = isNode;
},{}],19:[function(require,module,exports){
'use strict';

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @typechecks
 */

var isNode = require('./isNode');

/**
 * @param {*} object The object to check.
 * @return {boolean} Whether or not the object is a DOM text node.
 */
function isTextNode(object) {
  return isNode(object) && object.nodeType == 3;
}

module.exports = isTextNode;
},{"./isNode":18}],20:[function(require,module,exports){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 * @typechecks static-only
 */

'use strict';

/**
 * Memoizes the return value of a function that accepts one string argument.
 */

function memoizeStringOnly(callback) {
  var cache = {};
  return function (string) {
    if (!cache.hasOwnProperty(string)) {
      cache[string] = callback.call(this, string);
    }
    return cache[string];
  };
}

module.exports = memoizeStringOnly;
},{}],21:[function(require,module,exports){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @typechecks
 */

'use strict';

var ExecutionEnvironment = require('./ExecutionEnvironment');

var performance;

if (ExecutionEnvironment.canUseDOM) {
  performance = window.performance || window.msPerformance || window.webkitPerformance;
}

module.exports = performance || {};
},{"./ExecutionEnvironment":3}],22:[function(require,module,exports){
'use strict';

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @typechecks
 */

var performance = require('./performance');

var performanceNow;

/**
 * Detect if we can use `window.performance.now()` and gracefully fallback to
 * `Date.now()` if it doesn't exist. We need to support Firefox < 15 for now
 * because of Facebook's testing infrastructure.
 */
if (performance.now) {
  performanceNow = function performanceNow() {
    return performance.now();
  };
} else {
  performanceNow = function performanceNow() {
    return Date.now();
  };
}

module.exports = performanceNow;
},{"./performance":21}],23:[function(require,module,exports){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @typechecks
 * 
 */

/*eslint-disable no-self-compare */

'use strict';

var hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * inlined Object.is polyfill to avoid requiring consumers ship their own
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
 */
function is(x, y) {
  // SameValue algorithm
  if (x === y) {
    // Steps 1-5, 7-10
    // Steps 6.b-6.e: +0 != -0
    // Added the nonzero y check to make Flow happy, but it is redundant
    return x !== 0 || y !== 0 || 1 / x === 1 / y;
  } else {
    // Step 6.a: NaN == NaN
    return x !== x && y !== y;
  }
}

/**
 * Performs equality by iterating through keys on an object and returning false
 * when any key has values which are not strictly equal between the arguments.
 * Returns true when the values of all keys are strictly equal.
 */
function shallowEqual(objA, objB) {
  if (is(objA, objB)) {
    return true;
  }

  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
    return false;
  }

  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  // Test for A's keys different from B.
  for (var i = 0; i < keysA.length; i++) {
    if (!hasOwnProperty.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
      return false;
    }
  }

  return true;
}

module.exports = shallowEqual;
},{}],24:[function(require,module,exports){
(function (process){
/**
 * Copyright 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var emptyFunction = require('./emptyFunction');

/**
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

var warning = emptyFunction;

if (process.env.NODE_ENV !== 'production') {
  (function () {
    var printWarning = function printWarning(format) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      var argIndex = 0;
      var message = 'Warning: ' + format.replace(/%s/g, function () {
        return args[argIndex++];
      });
      if (typeof console !== 'undefined') {
        console.error(message);
      }
      try {
        // --- Welcome to debugging React ---
        // This error was thrown as a convenience so that you can use this stack
        // to find the callsite that caused this warning to fire.
        throw new Error(message);
      } catch (x) {}
    };

    warning = function warning(condition, format) {
      if (format === undefined) {
        throw new Error('`warning(condition, format, ...args)` requires a warning ' + 'message argument');
      }

      if (format.indexOf('Failed Composite propType: ') === 0) {
        return; // Ignore CompositeComponent proptype check.
      }

      if (!condition) {
        for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
          args[_key2 - 2] = arguments[_key2];
        }

        printWarning.apply(undefined, [format].concat(args));
      }
    };
  })();
}

module.exports = warning;
}).call(this,require('_process'))
},{"./emptyFunction":9,"_process":58}],25:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graph_1 = require("./graph");
const { LabeledEdge, LabeledUndirectedGraph } = graph_1.graph;
var board;
(function (board) {
    /**
     * Name of atomic components (e.g., provinces)
     */
    class Name {
        /**
         * @param name The name
         * @param abbreviatedName The abbreviated name. name is used if this param is not specified.
         */
        constructor(name, abbreviatedName) {
            this.name = name;
            this.abbreviatedName = abbreviatedName || name;
        }
        toString() {
            return this.abbreviatedName;
        }
    }
    board.Name = Name;
    /**
     * Province in Diplomacy map
     */
    class Province {
        /**
         * @param name The name of this province
         * @param homeOf
         *   The power that has this province as a home country.
         *   This is a neutral province if null is set.
         * @param isSupplyCenter The flag whether this is a supply center or not.
         */
        constructor(name, homeOf, isSupplyCenter) {
            this.name = name;
            this.homeOf = homeOf;
            this.isSupplyCenter = isSupplyCenter || false;
        }
        toString() {
            if (this.isSupplyCenter) {
                return `${this.name}*`;
            }
            else {
                return this.name.toString();
            }
        }
    }
    board.Province = Province;
    /**
     * Location in Diplomacy map. Each province is expected to have 1 location at least.
     */
    class Location {
        /**
         * @param name The name of this location. It is usually same as the name of the province
         * @param province The province that this location is in.
         * @param militaryBranches The set of military branches that can enter this location.
         */
        constructor(name, province, militaryBranches) {
            this.name = name;
            this.province = province;
            this.militaryBranches = new Set([...militaryBranches]);
        }
        toString() {
            return `${this.name}`;
        }
    }
    board.Location = Location;
    /**
     * Unit of Diplomacy
     */
    class Unit {
        /**
         * @param militaryBranch The military branch of this unit.
         * @param location The location where this unit is in.
         * @param power The power that has this unit.
         */
        constructor(militaryBranch, location, power) {
            this.militaryBranch = militaryBranch;
            this.location = location;
            this.power = power;
            console.assert(this.location.militaryBranches.has(militaryBranch));
        }
        toString() {
            return `${this.militaryBranch} ${this.location}`;
        }
    }
    board.Unit = Unit;
    /**
     * Relation between board.Location
     */
    class MapEdge extends graph_1.graph.LabeledEdge {
        /**
         * @param n1 The end point 1.
         * @param n2 The end point 2.
         * @param label The set of military branches.
         */
        constructor(n1, n2, militaryBranches) {
            super(n1, n2, new Set([...militaryBranches]));
        }
    }
    board.MapEdge = MapEdge;
    /**
     * Map of Diplomacy
     */
    class DiplomacyMap {
        /**
         * @param map The labeled graph that represents the map.
         */
        constructor(map) {
            this.map = map;
            this.locations = new Set();
            this.map.edges.forEach(elem => {
                this.locations.add(elem.n0);
                this.locations.add(elem.n1);
            });
            this.provinces = new Set();
            this.provinceToLocation = new Map();
            this.locations.forEach(elem => {
                this.provinces.add(elem.province);
                if (!this.provinceToLocation.has(elem.province)) {
                    this.provinceToLocation.set(elem.province, new Set());
                }
                const locs = this.provinceToLocation.get(elem.province);
                if (locs) {
                    locs.add(elem);
                }
            });
            this.powers = new Set();
            this.provinces.forEach(province => {
                if (province.homeOf) {
                    this.powers.add(province.homeOf);
                }
            });
        }
        /**
         * @param province The province
         * @return The set of locations that the province has.
         */
        locationsOf(province) {
            return this.provinceToLocation.get(province) || new Set();
        }
        /**
         * @param province The province
         * @param militaryBranch The military branch
         * @return The set of provinces that the military branch in the province can move.
         */
        movableProvincesOf(province, militaryBranch) {
            const retval = new Set();
            const locations = this.locationsOf(province);
            this.locationsOf(province).forEach(location => {
                this.movableLocationsOf(location, militaryBranch).forEach(location => {
                    retval.add(location.province);
                });
            });
            return retval;
        }
        /**
         * @param {!board.Location} location - The location
         * @param {!(string|Object)} militaryBranch - The military branch
         * @return {!Set.<board.Location>} -
         *   The set of locations that the military branch in the location can move.
         */
        movableLocationsOf(location, militaryBranch) {
            return new Set([...this.map.neighborsOf(location)]
                .filter(elem => elem[1].has(militaryBranch)).map(elem => elem[0]));
        }
    }
    board.DiplomacyMap = DiplomacyMap;
    class Board {
        /**
         * @param map
         * @param state
         * @param units The units that are in this board
         * @param unitStatuses The state of each unit (e.g., the unit was dislodged)
         * @param provinceStatuses
         *   The state of each province (e.g., standoff was occurred, this province is occupied by X)
         */
        constructor(map, state, units, unitStatuses, provinceStatuses) {
            this.map = map;
            this.state = state;
            this.units = new Set([...units]);
            this.unitStatuses = new Map([...unitStatuses]);
            this.provinceStatuses = new Map([...provinceStatuses]);
        }
    }
    board.Board = Board;
})(board = exports.board || (exports.board = {}));



},{"./graph":26}],26:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var graph;
(function (graph) {
    /**
     * Implementation of IEdge
     */
    class Edge {
        constructor(n0, n1) {
            this.n0 = n0;
            this.n1 = n1;
        }
    }
    graph.Edge = Edge;
    /**
     * Implementation of ILabeledEdge
     */
    class LabeledEdge extends Edge {
        constructor(n0, n1, label) {
            super(n0, n1);
            this.label = label;
        }
    }
    graph.LabeledEdge = LabeledEdge;
    /**
     * Undirected graph with labeled edges
     */
    class LabeledUndirectedGraph {
        /**
         * @param edges The set of edges.
         * @param nodes The set of nodles.
         */
        constructor(edges, nodes) {
            this.edges = new Set([...edges]);
            if (!nodes) {
                this.nodes = new Set();
                this.edges.forEach(edge => {
                    this.nodes.add(edge.n0);
                    this.nodes.add(edge.n1);
                });
            }
            else {
                this.nodes = new Set([...nodes]);
            }
        }
        /**
         * @param node - The target node
         * @return he set of nodes that are neighbors of the node.
         */
        neighborsOf(node) {
            const ns = new Set();
            this.edges.forEach(edge => {
                if (edge.n0 === node) {
                    ns.add([edge.n1, edge.label]);
                }
                else if (edge.n1 === node) {
                    ns.add([edge.n0, edge.label]);
                }
            });
            return ns;
        }
    }
    graph.LabeledUndirectedGraph = LabeledUndirectedGraph;
    /**
     * Directed graph
     */
    class DirectedGraph {
        /**
         * @param nodes The set of nodes.
         * @param edges The set of edges.
         */
        constructor(edges, nodes) {
            this.edges = new Set([...edges]);
            if (!nodes) {
                this.nodes = new Set();
                this.edges.forEach(edge => {
                    this.nodes.add(edge.n0);
                    this.nodes.add(edge.n1);
                });
            }
            else {
                this.nodes = new Set([...nodes]);
            }
        }
        /**
         * @return The cycle that is contained this graph. If there are no cycles, returns null.
         */
        getCycle() {
            const visit = (node, path, state) => {
                state.set(node, true);
                let cycle = null;
                for (let edge of [...this.edges].filter(edge => edge.n0 === node)) {
                    const v = edge.n1;
                    if (!state.get(v)) {
                        const p = [...path];
                        p.push(v);
                        const c = visit(v, p, state);
                        if (c) {
                            cycle = c;
                            break;
                        }
                    }
                    else {
                        cycle = path.slice(path.indexOf(v));
                        break;
                    }
                }
                return cycle;
            };
            let cycle = null;
            for (let node of [...this.nodes]) {
                const state = new Map([...this.nodes].map(node => [node, false]));
                if (!state.get(node)) {
                    const c = visit(node, [node], state);
                    if (c) {
                        cycle = c;
                        break;
                    }
                }
            }
            return cycle;
        }
        /**
         * Deletes a node.
         * @param node The node to be deleted.
         * @return The directed graph that deletes the node.
         */
        deleteNode(node) {
            const nodes = new Set([...this.nodes].filter(n => n !== node));
            const edges = [...this.edges].filter(edge => edge.n0 !== node && edge.n1 !== node);
            return new DirectedGraph(edges, nodes);
        }
        /**
         * Merges nodes into one node.
         * @param nodes The nodes to be merged.
         * @return The directed graph that merges the nodes into one node.
         */
        mergeNodes(target) {
            const nodes = new Set([...this.nodes]);
            let mergedValue = [];
            target.forEach(node => {
                if (!this.nodes.has(node))
                    return;
                mergedValue = mergedValue.concat([...node]);
                nodes.delete(node);
            });
            const mergedNode = new Set(mergedValue);
            nodes.add(mergedNode);
            const edges = new Set();
            this.edges.forEach(edge => {
                const { n0, n1 } = edge;
                if (target.has(n0) && target.has(n1)) {
                    return;
                }
                else if (target.has(n0)) {
                    edges.add(new Edge(mergedNode, n1));
                    return;
                }
                else if (target.has(n1)) {
                    edges.add(new Edge(n0, mergedNode));
                }
                else {
                    edges.add(edge);
                }
            });
            return new DirectedGraph(edges, nodes);
        }
    }
    graph.DirectedGraph = DirectedGraph;
})(graph = exports.graph || (exports.graph = {}));



},{}],27:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./board"));
__export(require("./rule"));
__export(require("./graph"));
__export(require("./util"));
__export(require("./standard"));
__export(require("./standardMap"));
__export(require("./standardBoard"));
__export(require("./standardRule"));



},{"./board":25,"./graph":26,"./rule":28,"./standard":29,"./standardBoard":30,"./standardMap":31,"./standardRule":35,"./util":55}],28:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("./util");
var rule;
(function (rule) {
    /**
     * Result of an order execution.
     */
    class Executed {
        /**
         * @param target The target order.
         * @param result The result of the target.
         */
        constructor(target, result) {
            this.target = target;
            this.result = result;
        }
    }
    rule.Executed = Executed;
    /**
     * Result of an order execution. It is used when the original order is replaced.
     */
    class Replaced {
        /**
         * @param target The target order.
         * @param result The result of the target.
         * @param invalidReason The reason why the target is replaced
         * @param replacedBy The order that replaces the target.
         */
        constructor(target, invalidReason, replacedBy, result) {
            this.target = target;
            this.invalidReason = invalidReason;
            this.replacedBy = replacedBy;
            this.result = result;
        }
    }
    rule.Replaced = Replaced;
    class ResolvedResult {
        /**
         * @param board
         * @param results The set of order results
         * @param isFinished The flag whether this game is finished or not.
         */
        constructor(board, results, isFinished) {
            this.board = board;
            this.isFinished = isFinished;
            this.results = new Set([...results]);
        }
    }
    rule.ResolvedResult = ResolvedResult;
    /**
     * Rule of Diplomacy
     */
    class Rule {
        /**
         * Resolves orders and creates a result.
         * @param board
         * @param orders The set of orders to be resolved.
         * @return The result of the orders
         */
        resolve(board, orders) {
            const os = new Set([...orders]);
            // Add a default orders if an unit requiring an order has no order
            for (let unit of [...this.unitsRequiringOrder(board)]) {
                if ([...orders].every(o => o.unit !== unit)) {
                    const order = this.defaultOrderOf(board, unit);
                    if (order) {
                        os.add(order);
                    }
                    else {
                        throw `${unit}: no order`;
                    }
                }
            }
            // Replace from invalid orders to default orders
            const replaced = new Map();
            os.forEach(order => {
                const msg = this.errorOfOrder(board, order);
                if (msg) {
                    const replacedOrder = this.defaultOrderOf(board, order.unit);
                    os.delete(order);
                    if (replacedOrder) {
                        os.add(replacedOrder);
                        replaced.set(replacedOrder, [order, msg]);
                    }
                    else {
                        throw `${order.unit}: no order`;
                    }
                }
            });
            // TODO rename errorOfOrders
            const msg = this.errorOfOrders(board, os);
            if (msg) {
                // Reject if the set of the orders is invalid
                return new util_1.util.Failure(msg);
            }
            const result = this.resolveProcedure(board, os);
            if (result instanceof util_1.util.Success) {
                const newResults = result.result.results;
                replaced.forEach((value, replacedOrder) => {
                    const [order, message] = value;
                    const result = [...newResults].find(r => r.target === replacedOrder);
                    if (result) {
                        newResults.delete(result);
                        newResults.add(new Replaced(order, message, result.target, result.result));
                    }
                });
                return new util_1.util.Success(new ResolvedResult(result.result.board, newResults, result.result.isFinished));
            }
            return new util_1.util.Failure(result.err);
        }
    }
    rule.Rule = Rule;
})(rule = exports.rule || (exports.rule = {}));



},{"./util":55}],29:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const variant_1 = require("./variant");
const standardRule_1 = require("./standardRule");
const data_1 = require("./standardRule/data");
const standardMap_1 = require("./standardMap");
const standardBoard_1 = require("./standardBoard");
const power_1 = require("./standardMap/power");
const { map, locations: $ } = standardMap_1.standardMap;
const { Turn, Season } = standardBoard_1.standardBoard;
const { Army, Fleet } = standardRule_1.standardRule.MilitaryBranch;
const { Unit, Board, Rule, Phase } = standardRule_1.standardRule;
const initialBoard = new Board(map, new data_1.State(new Turn(1901, Season.Spring), Phase.Movement), [
    new Unit(Army, $.Vie, power_1.Power.Austria), new Unit(Army, $.Bud, power_1.Power.Austria),
    new Unit(Fleet, $.Tri, power_1.Power.Austria),
    new Unit(Fleet, $.Edi, power_1.Power.England), new Unit(Fleet, $.Lon, power_1.Power.England),
    new Unit(Army, $.Lvp, power_1.Power.England),
    new Unit(Fleet, $.Bre, power_1.Power.France), new Unit(Army, $.Mar, power_1.Power.France),
    new Unit(Army, $.Par, power_1.Power.France),
    new Unit(Fleet, $.Kie, power_1.Power.Germany), new Unit(Army, $.Ber, power_1.Power.Germany),
    new Unit(Army, $.Mun, power_1.Power.Germany),
    new Unit(Army, $.Ven, power_1.Power.Italy), new Unit(Army, $.Rom, power_1.Power.Italy),
    new Unit(Fleet, $.Nap, power_1.Power.Italy),
    new Unit(Fleet, $.Sev, power_1.Power.Russia), new Unit(Army, $.Mos, power_1.Power.Russia),
    new Unit(Army, $.War, power_1.Power.Russia), new Unit(Fleet, $.StP_SC, power_1.Power.Russia),
    new Unit(Army, $.Smy, power_1.Power.Turkey), new Unit(Army, $.Con, power_1.Power.Turkey),
    new Unit(Fleet, $.Ank, power_1.Power.Turkey)
], [], ([...map.provinces].map(p => {
    if (p.homeOf !== null) {
        return [p, new data_1.ProvinceStatus(p.homeOf, false)];
    }
    else {
        return null;
    }
}).filter(x => x)));
const rule = new Rule();
var standard;
(function (standard) {
    standard.variant = new variant_1.variant.Variant(rule, initialBoard);
})(standard = exports.standard || (exports.standard = {}));



},{"./standardBoard":30,"./standardMap":31,"./standardMap/power":34,"./standardRule":35,"./standardRule/data":39,"./variant":56}],30:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var standardBoard;
(function (standardBoard) {
    var Season;
    (function (Season) {
        Season[Season["Spring"] = 1] = "Spring";
        Season[Season["Autumn"] = 2] = "Autumn";
    })(Season = standardBoard.Season || (standardBoard.Season = {}));
    /**
     * The turn of standard Diplomacy rule
     */
    class Turn {
        constructor(year, season) {
            this.year = year;
            this.season = season;
            this.isBuildable = season === Season.Autumn;
            this.isOccupationUpdateable = season === Season.Autumn;
        }
        nextTurn() {
            if (this.season === Season.Autumn) {
                return new Turn(this.year + 1, Season.Spring);
            }
            else {
                return new Turn(this.year, Season.Autumn);
            }
        }
    }
    standardBoard.Turn = Turn;
})(standardBoard = exports.standardBoard || (exports.standardBoard = {}));



},{}],31:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PowerModule = require("./standardMap/power");
const location_1 = require("./standardMap/location");
const map_1 = require("./standardMap/map");
var standardMap;
(function (standardMap) {
    standardMap.Power = PowerModule.Power;
    standardMap.locations = location_1.locations;
    standardMap.map = map_1.map;
})(standardMap = exports.standardMap || (exports.standardMap = {}));



},{"./standardMap/location":32,"./standardMap/map":33,"./standardMap/power":34}],32:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const board_1 = require("./../board");
const standardRule_1 = require("./../standardRule");
const power_1 = require("./power");
const { Name, Province } = board_1.board;
const { Army, Fleet } = standardRule_1.standardRule.MilitaryBranch;
const { Austria, England, France, Germany, Italy, Russia, Turkey } = power_1.Power;
const NC = new Name('North Coast', 'NC');
const EC = new Name('East Coast', 'EC');
const SC = new Name('South Coast', 'SC');
const provinces = {};
function mkLocation(province, militaryBranches) {
    return new standardRule_1.standardRule.Location(province.name, province, militaryBranches);
}
function mkLocationWithCoast(province, coast) {
    return new standardRule_1.standardRule.Location(new Name(`${province.name.name} (${coast.name})`, `${province.name}_${coast}`), province, [Fleet]);
}
const spa = new Province(new Name('Spain', 'Spa'), null, true);
const bul = new Province(new Name('Bulgaria', 'Bul'), null, true);
const stp = new Province(new Name('St. Petersburg', 'StP'), Russia, true);
exports.locations = {
    Boh: mkLocation(new Province(new Name('Bohemia', 'Boh'), Austria), [Army]),
    Bud: mkLocation(new Province(new Name('Budapest', 'Bud'), Austria, true), [Army]),
    Gal: mkLocation(new Province(new Name('Galicia', 'Gal'), Austria), [Army]),
    Tri: mkLocation(new Province(new Name('Trieste', 'Tri'), Austria, true), [Army, Fleet]),
    Tyr: mkLocation(new Province(new Name('Tyrolia', 'Tyr'), Austria), [Army]),
    Vie: mkLocation(new Province(new Name('Vienna', 'Vie'), Austria, true), [Army]),
    Cly: mkLocation(new Province(new Name('Clyde', 'Cly'), England), [Army, Fleet]),
    Edi: mkLocation(new Province(new Name('Edinburgh', 'Edi'), England, true), [Army, Fleet]),
    Lvp: mkLocation(new Province(new Name('Liverpool', 'Lvp'), England, true), [Army, Fleet]),
    Lon: mkLocation(new Province(new Name('London', 'Lon'), England, true), [Army, Fleet]),
    Wal: mkLocation(new Province(new Name('Wales', 'Wal'), England), [Army, Fleet]),
    Yor: mkLocation(new Province(new Name('Yorkshire', 'Yor'), England), [Army, Fleet]),
    Bre: mkLocation(new Province(new Name('Brest', 'Bre'), France, true), [Army, Fleet]),
    Bur: mkLocation(new Province(new Name('Burgundy', 'Bur'), France), [Army]),
    Gas: mkLocation(new Province(new Name('Gascony', 'Gas'), France), [Army, Fleet]),
    Mar: mkLocation(new Province(new Name('Marseilles', 'Mar'), France, true), [Army, Fleet]),
    Par: mkLocation(new Province(new Name('Paris', 'Par'), France, true), [Army]),
    Pic: mkLocation(new Province(new Name('Picardy', 'Pic'), France), [Army, Fleet]),
    Ber: mkLocation(new Province(new Name('Berlin', 'Ber'), Germany, true), [Army, Fleet]),
    Kie: mkLocation(new Province(new Name('Kiel', 'Kie'), Germany, true), [Army, Fleet]),
    Mun: mkLocation(new Province(new Name('Munich', 'Mun'), Germany, true), [Army]),
    Pru: mkLocation(new Province(new Name('Prussia', 'Pru'), Germany), [Army, Fleet]),
    Ruh: mkLocation(new Province(new Name('Ruhr', 'Ruh'), Germany), [Army]),
    Sil: mkLocation(new Province(new Name('Silesia', 'Sil'), Germany), [Army]),
    Apu: mkLocation(new Province(new Name('Apulia', 'Apu'), Italy), [Army, Fleet]),
    Nap: mkLocation(new Province(new Name('Naples', 'Nap'), Italy, true), [Army, Fleet]),
    Pie: mkLocation(new Province(new Name('Piedmont', 'Pie'), Italy), [Army, Fleet]),
    Rom: mkLocation(new Province(new Name('Rome', 'Rom'), Italy, true), [Army, Fleet]),
    Tus: mkLocation(new Province(new Name('Tuscany', 'Tus'), Italy), [Army, Fleet]),
    Ven: mkLocation(new Province(new Name('Venice', 'Ven'), Italy, true), [Army, Fleet]),
    Fin: mkLocation(new Province(new Name('Finland', 'Fin'), Russia), [Army, Fleet]),
    Lvn: mkLocation(new Province(new Name('Livonia', 'Lvn'), Russia), [Army, Fleet]),
    Mos: mkLocation(new Province(new Name('Moscow', 'Mos'), Russia, true), [Army]),
    Sev: mkLocation(new Province(new Name('Sevastopol', 'Sev'), Russia, true), [Army, Fleet]),
    StP: mkLocation(stp, [Army]),
    StP_NC: mkLocationWithCoast(stp, NC),
    StP_SC: mkLocationWithCoast(stp, SC),
    Ukr: mkLocation(new Province(new Name('Ukraine', 'Ukr'), Russia), [Army]),
    War: mkLocation(new Province(new Name('Warsaw', 'War'), Russia, true), [Army]),
    Ank: mkLocation(new Province(new Name('Ankara', 'Ank'), Turkey, true), [Army, Fleet]),
    Arm: mkLocation(new Province(new Name('Armenia', 'Arm'), Turkey), [Army, Fleet]),
    Con: mkLocation(new Province(new Name('Constantinople', 'Con'), Turkey, true), [Army, Fleet]),
    Smy: mkLocation(new Province(new Name('Smyrna', 'Smy'), Turkey, true), [Army, Fleet]),
    Syr: mkLocation(new Province(new Name('Syria', 'Syr'), Turkey), [Army, Fleet]),
    Alb: mkLocation(new Province(new Name('Albania', 'Alb'), null), [Army, Fleet]),
    Bel: mkLocation(new Province(new Name('Belgium', 'Bel'), null, true), [Army, Fleet]),
    Bul: mkLocation(bul, [Army]),
    Bul_EC: mkLocationWithCoast(bul, EC),
    Bul_SC: mkLocationWithCoast(bul, SC),
    Den: mkLocation(new Province(new Name('Denmark', 'Den'), null, true), [Army, Fleet]),
    Gre: mkLocation(new Province(new Name('Greece', 'Gre'), null, true), [Army, Fleet]),
    Hol: mkLocation(new Province(new Name('Holland', 'Hol'), null, true), [Army, Fleet]),
    Nwy: mkLocation(new Province(new Name('Norway', 'Nwy'), null, true), [Army, Fleet]),
    Por: mkLocation(new Province(new Name('Portugal', 'Por'), null, true), [Army, Fleet]),
    Rum: mkLocation(new Province(new Name('Rumania', 'Rum'), null, true), [Army, Fleet]),
    Ser: mkLocation(new Province(new Name('Serbia', 'Ser'), null, true), [Army]),
    Spa: mkLocation(spa, [Army]),
    Spa_SC: mkLocationWithCoast(spa, SC),
    Spa_NC: mkLocationWithCoast(spa, NC),
    Swe: mkLocation(new Province(new Name('Sweden', 'Swe'), null, true), [Army, Fleet]),
    Tun: mkLocation(new Province(new Name('Tunis', 'Tun'), null, true), [Army, Fleet]),
    NAf: mkLocation(new Province(new Name('North Africa', 'NAf'), null), [Army, Fleet]),
    Adr: mkLocation(new Province(new Name('Adriatic Sea', 'Adr'), null), [Fleet]),
    Aeg: mkLocation(new Province(new Name('Aegean Sea', 'Aeg'), null), [Fleet]),
    Bal: mkLocation(new Province(new Name('Baltic Sea', 'Bal'), null), [Fleet]),
    Bar: mkLocation(new Province(new Name('Barents Sea', 'Bar'), null), [Fleet]),
    Bla: mkLocation(new Province(new Name('Black Sea', 'Bla'), null), [Fleet]),
    Eas: mkLocation(new Province(new Name('Eastern Mediterranean', 'Eas'), null), [Fleet]),
    Eng: mkLocation(new Province(new Name('English Channel', 'Eng'), null), [Fleet]),
    Bot: mkLocation(new Province(new Name('Gulf of Bothnia', 'Bot'), null), [Fleet]),
    GoL: mkLocation(new Province(new Name('Gulf of Lyon', 'GoL'), null), [Fleet]),
    Hel: mkLocation(new Province(new Name('Helgoland Bight', 'Hel'), null), [Fleet]),
    Ion: mkLocation(new Province(new Name('Ionian Sea', 'Ion'), null), [Fleet]),
    Iri: mkLocation(new Province(new Name('Irish Sea', 'Iri'), null), [Fleet]),
    Mid: mkLocation(new Province(new Name('Mid-Atlantic Ocean', 'Mid'), null), [Fleet]),
    NAt: mkLocation(new Province(new Name('North Atlantic Ocean', 'NAt'), null), [Fleet]),
    Nth: mkLocation(new Province(new Name('North Sea', 'Nth'), null), [Fleet]),
    Nrg: mkLocation(new Province(new Name('Norwegian Sea', 'Nrg'), null), [Fleet]),
    Ska: mkLocation(new Province(new Name('Skagerrak', 'Ska'), null), [Fleet]),
    Tyn: mkLocation(new Province(new Name('Tyrrhenian Sea', 'Tyn'), null), [Fleet]),
    Wes: mkLocation(new Province(new Name('Western Mediterranean', 'Wes'), null), [Fleet])
};



},{"./../board":25,"./../standardRule":35,"./power":34}],33:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const location_1 = require("./location");
const board_1 = require("./../board");
const graph_1 = require("./../graph");
const standardRule_1 = require("./../standardRule");
const { DiplomacyMap, MapEdge } = board_1.board;
const { LabeledUndirectedGraph } = graph_1.graph;
const { Army, Fleet } = standardRule_1.standardRule.MilitaryBranch;
exports.map = new DiplomacyMap(new LabeledUndirectedGraph([
    // Boh
    new MapEdge(location_1.locations.Boh, location_1.locations.Mun, [Army]),
    new MapEdge(location_1.locations.Boh, location_1.locations.Sil, [Army]),
    new MapEdge(location_1.locations.Boh, location_1.locations.Gal, [Army]),
    new MapEdge(location_1.locations.Boh, location_1.locations.Vie, [Army]),
    new MapEdge(location_1.locations.Boh, location_1.locations.Tyr, [Army]),
    // Bud
    new MapEdge(location_1.locations.Bud, location_1.locations.Vie, [Army]),
    new MapEdge(location_1.locations.Bud, location_1.locations.Gal, [Army]),
    new MapEdge(location_1.locations.Bud, location_1.locations.Rum, [Army]),
    new MapEdge(location_1.locations.Bud, location_1.locations.Ser, [Army]),
    new MapEdge(location_1.locations.Bud, location_1.locations.Tri, [Army]),
    // Gal
    new MapEdge(location_1.locations.Gal, location_1.locations.War, [Army]),
    new MapEdge(location_1.locations.Gal, location_1.locations.Ukr, [Army]),
    new MapEdge(location_1.locations.Gal, location_1.locations.Rum, [Army]),
    new MapEdge(location_1.locations.Gal, location_1.locations.Vie, [Army]),
    // Tri
    new MapEdge(location_1.locations.Tri, location_1.locations.Tyr, [Army]),
    new MapEdge(location_1.locations.Tri, location_1.locations.Vie, [Army]),
    new MapEdge(location_1.locations.Tri, location_1.locations.Ser, [Army]),
    new MapEdge(location_1.locations.Tri, location_1.locations.Alb, [Army, Fleet]),
    new MapEdge(location_1.locations.Tri, location_1.locations.Adr, [Fleet]),
    new MapEdge(location_1.locations.Tri, location_1.locations.Ven, [Army, Fleet]),
    // Tyr
    new MapEdge(location_1.locations.Tyr, location_1.locations.Mun, [Army]),
    new MapEdge(location_1.locations.Tyr, location_1.locations.Vie, [Army]),
    new MapEdge(location_1.locations.Tyr, location_1.locations.Ven, [Army]),
    new MapEdge(location_1.locations.Tyr, location_1.locations.Pie, [Army]),
    // Vie
    // Cly
    new MapEdge(location_1.locations.Cly, location_1.locations.NAt, [Fleet]),
    new MapEdge(location_1.locations.Cly, location_1.locations.Nrg, [Fleet]),
    new MapEdge(location_1.locations.Cly, location_1.locations.Edi, [Army, Fleet]),
    new MapEdge(location_1.locations.Cly, location_1.locations.Lvp, [Army, Fleet]),
    // Edi
    new MapEdge(location_1.locations.Edi, location_1.locations.Nrg, [Fleet]),
    new MapEdge(location_1.locations.Edi, location_1.locations.Nth, [Fleet]),
    new MapEdge(location_1.locations.Edi, location_1.locations.Yor, [Army, Fleet]),
    new MapEdge(location_1.locations.Edi, location_1.locations.Lvp, [Army]),
    // Lvp
    new MapEdge(location_1.locations.Lvp, location_1.locations.Iri, [Fleet]),
    new MapEdge(location_1.locations.Lvp, location_1.locations.Yor, [Army]),
    new MapEdge(location_1.locations.Lvp, location_1.locations.Wal, [Army, Fleet]),
    new MapEdge(location_1.locations.Lvp, location_1.locations.NAt, [Fleet]),
    // Lon
    new MapEdge(location_1.locations.Lon, location_1.locations.Wal, [Army, Fleet]),
    new MapEdge(location_1.locations.Lon, location_1.locations.Yor, [Army, Fleet]),
    new MapEdge(location_1.locations.Lon, location_1.locations.Nth, [Fleet]),
    new MapEdge(location_1.locations.Lon, location_1.locations.Eng, [Fleet]),
    // Wal
    new MapEdge(location_1.locations.Wal, location_1.locations.Iri, [Fleet]),
    new MapEdge(location_1.locations.Wal, location_1.locations.Yor, [Army]),
    new MapEdge(location_1.locations.Wal, location_1.locations.Eng, [Fleet]),
    // Yor
    new MapEdge(location_1.locations.Yor, location_1.locations.Nth, [Fleet]),
    // Bre
    new MapEdge(location_1.locations.Bre, location_1.locations.Eng, [Fleet]),
    new MapEdge(location_1.locations.Bre, location_1.locations.Pic, [Army, Fleet]),
    new MapEdge(location_1.locations.Bre, location_1.locations.Par, [Army]),
    new MapEdge(location_1.locations.Bre, location_1.locations.Gas, [Army, Fleet]),
    new MapEdge(location_1.locations.Bre, location_1.locations.Mid, [Fleet]),
    // Bur
    new MapEdge(location_1.locations.Bur, location_1.locations.Par, [Army]),
    new MapEdge(location_1.locations.Bur, location_1.locations.Pic, [Army]),
    new MapEdge(location_1.locations.Bur, location_1.locations.Bel, [Army]),
    new MapEdge(location_1.locations.Bur, location_1.locations.Ruh, [Army]),
    new MapEdge(location_1.locations.Bur, location_1.locations.Mun, [Army]),
    new MapEdge(location_1.locations.Bur, location_1.locations.Mar, [Army]),
    new MapEdge(location_1.locations.Bur, location_1.locations.Gas, [Army]),
    // Gas
    new MapEdge(location_1.locations.Gas, location_1.locations.Mid, [Fleet]),
    new MapEdge(location_1.locations.Gas, location_1.locations.Par, [Army]),
    new MapEdge(location_1.locations.Gas, location_1.locations.Mar, [Army]),
    new MapEdge(location_1.locations.Gas, location_1.locations.Spa, [Army]),
    new MapEdge(location_1.locations.Gas, location_1.locations.Spa_NC, [Fleet]),
    // Mar
    new MapEdge(location_1.locations.Mar, location_1.locations.Spa, [Army]),
    new MapEdge(location_1.locations.Mar, location_1.locations.Spa_SC, [Fleet]),
    new MapEdge(location_1.locations.Mar, location_1.locations.GoL, [Fleet]),
    new MapEdge(location_1.locations.Mar, location_1.locations.Pie, [Army, Fleet]),
    // Par
    new MapEdge(location_1.locations.Par, location_1.locations.Pic, [Army]),
    // Pic
    new MapEdge(location_1.locations.Pic, location_1.locations.Eng, [Fleet]),
    new MapEdge(location_1.locations.Pic, location_1.locations.Bel, [Army, Fleet]),
    // Ber
    new MapEdge(location_1.locations.Ber, location_1.locations.Kie, [Army, Fleet]),
    new MapEdge(location_1.locations.Ber, location_1.locations.Bal, [Fleet]),
    new MapEdge(location_1.locations.Ber, location_1.locations.Pru, [Army, Fleet]),
    new MapEdge(location_1.locations.Ber, location_1.locations.Sil, [Army]),
    new MapEdge(location_1.locations.Ber, location_1.locations.Mun, [Army]),
    // Kie
    new MapEdge(location_1.locations.Kie, location_1.locations.Hel, [Fleet]),
    new MapEdge(location_1.locations.Kie, location_1.locations.Den, [Army, Fleet]),
    new MapEdge(location_1.locations.Kie, location_1.locations.Mun, [Army]),
    new MapEdge(location_1.locations.Kie, location_1.locations.Ruh, [Army]),
    new MapEdge(location_1.locations.Kie, location_1.locations.Hol, [Army, Fleet]),
    // Mun
    new MapEdge(location_1.locations.Mun, location_1.locations.Ruh, [Army]),
    new MapEdge(location_1.locations.Mun, location_1.locations.Sil, [Army]),
    // Pru
    new MapEdge(location_1.locations.Pru, location_1.locations.Bal, [Fleet]),
    new MapEdge(location_1.locations.Pru, location_1.locations.Lvn, [Army, Fleet]),
    new MapEdge(location_1.locations.Pru, location_1.locations.War, [Army]),
    new MapEdge(location_1.locations.Pru, location_1.locations.Sil, [Army]),
    // Ruh
    new MapEdge(location_1.locations.Ruh, location_1.locations.Bel, [Army]),
    new MapEdge(location_1.locations.Ruh, location_1.locations.Hol, [Army]),
    // Sil
    new MapEdge(location_1.locations.Sil, location_1.locations.War, [Army]),
    // Apu
    new MapEdge(location_1.locations.Apu, location_1.locations.Ven, [Army, Fleet]),
    new MapEdge(location_1.locations.Apu, location_1.locations.Adr, [Fleet]),
    new MapEdge(location_1.locations.Apu, location_1.locations.Ion, [Fleet]),
    new MapEdge(location_1.locations.Apu, location_1.locations.Nap, [Army, Fleet]),
    new MapEdge(location_1.locations.Apu, location_1.locations.Rom, [Army]),
    // Nap
    new MapEdge(location_1.locations.Nap, location_1.locations.Rom, [Army, Fleet]),
    new MapEdge(location_1.locations.Nap, location_1.locations.Ion, [Fleet]),
    new MapEdge(location_1.locations.Nap, location_1.locations.Tyn, [Fleet]),
    // Pie
    new MapEdge(location_1.locations.Pie, location_1.locations.Ven, [Army]),
    new MapEdge(location_1.locations.Pie, location_1.locations.Tus, [Army, Fleet]),
    new MapEdge(location_1.locations.Pie, location_1.locations.GoL, [Fleet]),
    // Rom
    new MapEdge(location_1.locations.Rom, location_1.locations.Tus, [Army, Fleet]),
    new MapEdge(location_1.locations.Rom, location_1.locations.Ven, [Army]),
    new MapEdge(location_1.locations.Rom, location_1.locations.Tyn, [Fleet]),
    // Tus
    new MapEdge(location_1.locations.Tus, location_1.locations.GoL, [Fleet]),
    new MapEdge(location_1.locations.Tus, location_1.locations.Ven, [Army]),
    new MapEdge(location_1.locations.Tus, location_1.locations.Tyn, [Fleet]),
    // Ven
    new MapEdge(location_1.locations.Ven, location_1.locations.Adr, [Fleet]),
    // Fin
    new MapEdge(location_1.locations.Fin, location_1.locations.Nwy, [Army]),
    new MapEdge(location_1.locations.Fin, location_1.locations.Swe, [Army, Fleet]),
    new MapEdge(location_1.locations.Fin, location_1.locations.Bot, [Fleet]),
    new MapEdge(location_1.locations.Fin, location_1.locations.StP, [Army]),
    new MapEdge(location_1.locations.Fin, location_1.locations.StP_SC, [Fleet]),
    // Lvn
    new MapEdge(location_1.locations.Lvn, location_1.locations.Bot, [Fleet]),
    new MapEdge(location_1.locations.Lvn, location_1.locations.StP, [Army]),
    new MapEdge(location_1.locations.Lvn, location_1.locations.StP_SC, [Fleet]),
    new MapEdge(location_1.locations.Lvn, location_1.locations.Mos, [Army]),
    new MapEdge(location_1.locations.Lvn, location_1.locations.War, [Army]),
    new MapEdge(location_1.locations.Lvn, location_1.locations.Bal, [Fleet]),
    // Mos
    new MapEdge(location_1.locations.Mos, location_1.locations.StP, [Army]),
    new MapEdge(location_1.locations.Mos, location_1.locations.Sev, [Army]),
    new MapEdge(location_1.locations.Mos, location_1.locations.Ukr, [Army]),
    new MapEdge(location_1.locations.Mos, location_1.locations.War, [Army]),
    // Sev
    new MapEdge(location_1.locations.Sev, location_1.locations.Ukr, [Army]),
    new MapEdge(location_1.locations.Sev, location_1.locations.Arm, [Army, Fleet]),
    new MapEdge(location_1.locations.Sev, location_1.locations.Bla, [Fleet]),
    new MapEdge(location_1.locations.Sev, location_1.locations.Rum, [Army, Fleet]),
    // StP
    new MapEdge(location_1.locations.StP, location_1.locations.Nwy, [Army]),
    // StP/NC
    new MapEdge(location_1.locations.StP_NC, location_1.locations.Nwy, [Fleet]),
    new MapEdge(location_1.locations.StP_NC, location_1.locations.Bar, [Fleet]),
    // StP/SC
    new MapEdge(location_1.locations.StP_SC, location_1.locations.Bot, [Fleet]),
    // Ukr
    new MapEdge(location_1.locations.Ukr, location_1.locations.War, [Army]),
    new MapEdge(location_1.locations.Ukr, location_1.locations.Rum, [Army]),
    // War
    // Ank
    new MapEdge(location_1.locations.Ank, location_1.locations.Bla, [Fleet]),
    new MapEdge(location_1.locations.Ank, location_1.locations.Arm, [Army, Fleet]),
    new MapEdge(location_1.locations.Ank, location_1.locations.Smy, [Army]),
    new MapEdge(location_1.locations.Ank, location_1.locations.Con, [Army, Fleet]),
    // Arm
    new MapEdge(location_1.locations.Arm, location_1.locations.Bla, [Fleet]),
    new MapEdge(location_1.locations.Arm, location_1.locations.Syr, [Army]),
    new MapEdge(location_1.locations.Arm, location_1.locations.Smy, [Army]),
    // Con
    new MapEdge(location_1.locations.Con, location_1.locations.Bul, [Army]),
    new MapEdge(location_1.locations.Con, location_1.locations.Bul_EC, [Fleet]),
    new MapEdge(location_1.locations.Con, location_1.locations.Bul_SC, [Fleet]),
    new MapEdge(location_1.locations.Con, location_1.locations.Bla, [Fleet]),
    new MapEdge(location_1.locations.Con, location_1.locations.Smy, [Army, Fleet]),
    new MapEdge(location_1.locations.Con, location_1.locations.Aeg, [Fleet]),
    // Smy
    new MapEdge(location_1.locations.Smy, location_1.locations.Syr, [Army, Fleet]),
    new MapEdge(location_1.locations.Smy, location_1.locations.Eas, [Fleet]),
    new MapEdge(location_1.locations.Smy, location_1.locations.Aeg, [Fleet]),
    // Syr
    new MapEdge(location_1.locations.Syr, location_1.locations.Eas, [Fleet]),
    // Alb
    new MapEdge(location_1.locations.Alb, location_1.locations.Ser, [Army]),
    new MapEdge(location_1.locations.Alb, location_1.locations.Gre, [Army, Fleet]),
    new MapEdge(location_1.locations.Alb, location_1.locations.Ion, [Fleet]),
    // Bel
    new MapEdge(location_1.locations.Bel, location_1.locations.Eng, [Fleet]),
    new MapEdge(location_1.locations.Bel, location_1.locations.Nth, [Fleet]),
    new MapEdge(location_1.locations.Bel, location_1.locations.Hol, [Army, Fleet]),
    // Bul
    new MapEdge(location_1.locations.Bul, location_1.locations.Ser, [Army]),
    new MapEdge(location_1.locations.Bul, location_1.locations.Rum, [Army]),
    new MapEdge(location_1.locations.Bul, location_1.locations.Gre, [Army]),
    // Bul/EC
    new MapEdge(location_1.locations.Bul_EC, location_1.locations.Rum, [Fleet]),
    new MapEdge(location_1.locations.Bul_EC, location_1.locations.Bla, [Fleet]),
    // Bul/SC
    new MapEdge(location_1.locations.Bul_SC, location_1.locations.Gre, [Fleet]),
    new MapEdge(location_1.locations.Bul_SC, location_1.locations.Aeg, [Fleet]),
    // Den
    new MapEdge(location_1.locations.Den, location_1.locations.Nth, [Fleet]),
    new MapEdge(location_1.locations.Den, location_1.locations.Ska, [Fleet]),
    new MapEdge(location_1.locations.Den, location_1.locations.Bal, [Fleet]),
    new MapEdge(location_1.locations.Den, location_1.locations.Hel, [Fleet]),
    // Gre
    new MapEdge(location_1.locations.Gre, location_1.locations.Ser, [Army]),
    new MapEdge(location_1.locations.Gre, location_1.locations.Aeg, [Fleet]),
    new MapEdge(location_1.locations.Gre, location_1.locations.Ion, [Fleet]),
    // Hol
    new MapEdge(location_1.locations.Hol, location_1.locations.Nth, [Fleet]),
    new MapEdge(location_1.locations.Hol, location_1.locations.Hel, [Fleet]),
    // Nwy
    new MapEdge(location_1.locations.Nwy, location_1.locations.Nrg, [Fleet]),
    new MapEdge(location_1.locations.Nwy, location_1.locations.Bar, [Fleet]),
    new MapEdge(location_1.locations.Nwy, location_1.locations.Swe, [Army, Fleet]),
    new MapEdge(location_1.locations.Nwy, location_1.locations.Ska, [Fleet]),
    new MapEdge(location_1.locations.Nwy, location_1.locations.Nth, [Fleet]),
    // Por
    new MapEdge(location_1.locations.Por, location_1.locations.Mid, [Fleet]),
    new MapEdge(location_1.locations.Por, location_1.locations.Spa, [Army]),
    new MapEdge(location_1.locations.Por, location_1.locations.Spa_NC, [Fleet]),
    new MapEdge(location_1.locations.Por, location_1.locations.Spa_SC, [Fleet]),
    // Rum
    new MapEdge(location_1.locations.Rum, location_1.locations.Ser, [Army]),
    new MapEdge(location_1.locations.Rum, location_1.locations.Bla, [Fleet]),
    // Ser
    // Spa
    // Spa/NC
    new MapEdge(location_1.locations.Spa_NC, location_1.locations.Mid, [Fleet]),
    // Spa/SC
    new MapEdge(location_1.locations.Spa_SC, location_1.locations.Mid, [Fleet]),
    new MapEdge(location_1.locations.Spa_SC, location_1.locations.GoL, [Fleet]),
    new MapEdge(location_1.locations.Spa_SC, location_1.locations.Wes, [Fleet]),
    // Swe
    new MapEdge(location_1.locations.Swe, location_1.locations.Ska, [Fleet]),
    new MapEdge(location_1.locations.Swe, location_1.locations.Bal, [Fleet]),
    new MapEdge(location_1.locations.Swe, location_1.locations.Bot, [Fleet]),
    new MapEdge(location_1.locations.Swe, location_1.locations.Den, [Army, Fleet]),
    // Tun
    new MapEdge(location_1.locations.Tun, location_1.locations.Wes, [Fleet]),
    new MapEdge(location_1.locations.Tun, location_1.locations.Tyn, [Fleet]),
    new MapEdge(location_1.locations.Tun, location_1.locations.Ion, [Fleet]),
    new MapEdge(location_1.locations.Tun, location_1.locations.NAf, [Army, Fleet]),
    // NAf
    new MapEdge(location_1.locations.NAf, location_1.locations.Wes, [Fleet]),
    new MapEdge(location_1.locations.NAf, location_1.locations.Mid, [Fleet]),
    // Adr
    new MapEdge(location_1.locations.Adr, location_1.locations.Ion, [Fleet]),
    // Aeg
    new MapEdge(location_1.locations.Aeg, location_1.locations.Eas, [Fleet]),
    new MapEdge(location_1.locations.Aeg, location_1.locations.Ion, [Fleet]),
    // Bal
    new MapEdge(location_1.locations.Bal, location_1.locations.Bot, [Fleet]),
    // Bar
    new MapEdge(location_1.locations.Bar, location_1.locations.Nrg, [Fleet]),
    // Bla
    // Eas
    new MapEdge(location_1.locations.Eas, location_1.locations.Ion, [Fleet]),
    // Eng
    new MapEdge(location_1.locations.Eng, location_1.locations.Iri, [Fleet]),
    new MapEdge(location_1.locations.Eng, location_1.locations.Nth, [Fleet]),
    new MapEdge(location_1.locations.Eng, location_1.locations.Mid, [Fleet]),
    // Bot
    // GoL
    new MapEdge(location_1.locations.GoL, location_1.locations.Tyn, [Fleet]),
    new MapEdge(location_1.locations.GoL, location_1.locations.Wes, [Fleet]),
    // Hel
    new MapEdge(location_1.locations.Hel, location_1.locations.Nth, [Fleet]),
    // Ion
    new MapEdge(location_1.locations.Ion, location_1.locations.Tyn, [Fleet]),
    // Iri
    new MapEdge(location_1.locations.Iri, location_1.locations.NAt, [Fleet]),
    new MapEdge(location_1.locations.Iri, location_1.locations.Mid, [Fleet]),
    // Mid
    new MapEdge(location_1.locations.Mid, location_1.locations.NAf, [Fleet]),
    new MapEdge(location_1.locations.Mid, location_1.locations.Wes, [Fleet]),
    new MapEdge(location_1.locations.Mid, location_1.locations.NAt, [Fleet]),
    // NAt
    new MapEdge(location_1.locations.NAt, location_1.locations.Nrg, [Fleet]),
    // Nth
    new MapEdge(location_1.locations.Nth, location_1.locations.Nrg, [Fleet]),
    // Nrg
    // Ska
    // Tyn
    new MapEdge(location_1.locations.Tyn, location_1.locations.Wes, [Fleet])
    // Wes
]));



},{"./../board":25,"./../graph":26,"./../standardRule":35,"./location":32}],34:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Power;
(function (Power) {
    Power[Power["Austria"] = 1] = "Austria";
    Power[Power["England"] = 2] = "England";
    Power[Power["France"] = 3] = "France";
    Power[Power["Germany"] = 4] = "Germany";
    Power[Power["Italy"] = 5] = "Italy";
    Power[Power["Russia"] = 6] = "Russia";
    Power[Power["Turkey"] = 7] = "Turkey";
})(Power = exports.Power || (exports.Power = {}));



},{}],35:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Data = require("./standardRule/data");
const OrderModule = require("./standardRule/order");
const ErrorModule = require("./standardRule/error");
const Types = require("./standardRule/types");
const UtilsModule = require("./standardRule/utils");
const HelperModule = require("./standardRule/helper");
const RuleModule = require("./standardRule/rule");
var standardRule;
(function (standardRule) {
    standardRule.Location = Types.Location;
    standardRule.Unit = Types.Unit;
    standardRule.DiplomacyMap = Types.DiplomacyMap;
    standardRule.Board = Types.Board;
    standardRule.MilitaryBranch = Data.MilitaryBranch;
    standardRule.Phase = Data.Phase;
    standardRule.State = Data.State;
    standardRule.Dislodged = Data.Dislodged;
    standardRule.ProvinceStatus = Data.ProvinceStatus;
    standardRule.Result = Data.Result;
    var Order;
    (function (Order_1) {
        Order_1.OrderType = OrderModule.OrderType;
        Order_1.Order = OrderModule.Order;
        Order_1.Hold = OrderModule.Hold;
        Order_1.Move = OrderModule.Move;
        Order_1.Support = OrderModule.Support;
        Order_1.Convoy = OrderModule.Convoy;
        Order_1.Retreat = OrderModule.Retreat;
        Order_1.Disband = OrderModule.Disband;
        Order_1.Build = OrderModule.Build;
    })(Order = standardRule.Order || (standardRule.Order = {}));
    var Error;
    (function (Error_1) {
        Error_1.Error = ErrorModule.Error;
        Error_1.PowerWithProblem = ErrorModule.PowerWithProblem;
        Error_1.UnmovableLocation = ErrorModule.UnmovableLocation;
        Error_1.UnsupportableLocation = ErrorModule.UnsupportableLocation;
        Error_1.UnconvoyableLocation = ErrorModule.UnconvoyableLocation;
        Error_1.UnbuildableLocation = ErrorModule.UnbuildableLocation;
        Error_1.UnitNotExisted = ErrorModule.UnitNotExisted;
        Error_1.CannotBeOrdered = ErrorModule.CannotBeOrdered;
        Error_1.InvalidPhase = ErrorModule.InvalidPhase;
        Error_1.SeveralOrders = ErrorModule.SeveralOrders;
        Error_1.OrderNotExisted = ErrorModule.OrderNotExisted;
    })(Error = standardRule.Error || (standardRule.Error = {}));
    standardRule.Utils = UtilsModule.Utils;
    standardRule.Helper = HelperModule.Helper;
    standardRule.Rule = RuleModule.Rule;
})(standardRule = exports.standardRule || (exports.standardRule = {}));



},{"./standardRule/data":39,"./standardRule/error":40,"./standardRule/helper":41,"./standardRule/order":48,"./standardRule/rule":52,"./standardRule/types":53,"./standardRule/utils":54}],36:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const order_1 = require("./order");
class BuildOrderGenerator {
    ordersToSkipPhase(board) {
        const numberOfSupplyCenters = utils_1.Utils.numberOfSupplyCenters(board);
        const canSkip = [...board.map.powers].every(power => {
            const numOfUnits = ([...board.units].filter(unit => unit.power === power)).length;
            const numOfSupply = numberOfSupplyCenters.get(power) || 0;
            return (numOfUnits === numOfSupply) || (numOfSupply === 0);
        });
        if (canSkip) {
            const orders = new Set();
            board.map.powers.forEach(power => {
                const units = [...board.units].filter(unit => unit.power === power);
                const numOfSupply = numberOfSupplyCenters.get(power) || 0;
                if (numOfSupply === 0) {
                    units.map(unit => new order_1.Disband(unit)).forEach(o => orders.add(o));
                }
            });
            return orders;
        }
        else {
            return null;
        }
    }
    defaultOrderOf(board, unit) {
        return null;
    }
}
exports.BuildOrderGenerator = BuildOrderGenerator;



},{"./order":48,"./utils":54}],37:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_1 = require("./data");
const types_1 = require("./types");
const order_1 = require("./order");
const board_1 = require("./../board");
const rule_1 = require("./../rule");
const util_1 = require("./../util");
const { Province } = board_1.board;
const { Executed } = rule_1.rule;
const { Success } = util_1.util;
const Movement = data_1.Phase.Movement;
class BuildResolver {
    resolve(board, orders) {
        const disbands = [...orders].filter(order => order.tpe === order_1.OrderType.Disband);
        const builds = [...orders].filter(order => order.tpe === order_1.OrderType.Build);
        const newUnits = new Set([...board.units]);
        disbands.forEach(d => newUnits.delete(d.unit));
        builds.forEach(b => newUnits.add(b.unit));
        const newState = new data_1.State(board.state.turn.nextTurn(), Movement);
        const occupationStatuses = [...board.provinceStatuses]
            .filter(elem => elem[1].occupied)
            .map(elem => {
            if (elem[1].standoff) {
                return [elem[0], new data_1.ProvinceStatus(elem[1].occupied, false)];
            }
            else {
                return elem;
            }
        });
        const newBoard = new types_1.Board(board.map, newState, newUnits, [], occupationStatuses);
        const orderResults = [...orders].map(order => new Executed(order, data_1.Result.Success));
        return new Success(new types_1.ResolvedResult(newBoard, orderResults, false));
    }
}
exports.BuildResolver = BuildResolver;



},{"./../board":25,"./../rule":28,"./../util":55,"./data":39,"./order":48,"./types":53}],38:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const order_1 = require("./order");
const Error = require("./error");
class BuildValidator {
    /**
     * @param stringify Stringify instances of Power
     */
    constructor() { }
    unitsRequiringOrder(board) {
        return new Set();
    }
    errorOfOrder(board, order) {
        const numberOfSupplyCenters = utils_1.Utils.numberOfSupplyCenters(board);
        switch (order.tpe) {
            case order_1.OrderType.Build:
                if ([...board.units].some(unit => unit.location.province === order.unit.location.province)) {
                    return new Error.UnbuildableLocation(order.unit);
                }
                else if (order.unit.location.province.homeOf !== order.unit.power) {
                    return new Error.UnbuildableLocation(order.unit);
                }
                else if (!order.unit.location.province.isSupplyCenter) {
                    return new Error.UnbuildableLocation(order.unit);
                }
                else {
                    const status = board.provinceStatuses.get(order.unit.location.province);
                    if (!status || status.occupied !== order.unit.power) {
                        return new Error.UnbuildableLocation(order.unit);
                    }
                }
                break;
            case order_1.OrderType.Disband:
                if (!board.units.has(order.unit)) {
                    return new Error.UnitNotExisted(order.unit);
                }
                const numOfUnits = ([...board.units].filter(unit => unit.power === order.unit.power)).length;
                const numOfSupply = numberOfSupplyCenters.get(order.unit.power) || 0;
                if (numOfUnits <= numOfSupply) {
                    return new Error.PowerWithProblem(order.unit.power);
                }
                break;
            default:
                return new Error.InvalidPhase(order);
        }
        return null;
    }
    errorOfOrders(board, orders) {
        const numberOfSupplyCenters = utils_1.Utils.numberOfSupplyCenters(board);
        const power = [...board.map.powers].find(power => {
            const numOfUnits = ([...board.units].filter(unit => unit.power === power)).length;
            const numOfSupply = numberOfSupplyCenters.get(power) || 0;
            const diffs = [...orders].map(order => {
                if (order.tpe === order_1.OrderType.Build && order.unit.power === power) {
                    return 1;
                }
                else if (order.tpe === order_1.OrderType.Disband && order.unit.power === power) {
                    return -1;
                }
                else {
                    return 0;
                }
            });
            const diff = diffs.reduce((prev, curr) => prev + curr, 0);
            return (numOfUnits + diff) > numOfSupply;
        });
        if (power) {
            return new Error.PowerWithProblem(power);
        }
        return null;
    }
}
exports.BuildValidator = BuildValidator;



},{"./error":40,"./order":48,"./utils":54}],39:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MilitaryBranch;
(function (MilitaryBranch) {
    MilitaryBranch[MilitaryBranch["Army"] = 1] = "Army";
    MilitaryBranch[MilitaryBranch["Fleet"] = 2] = "Fleet";
})(MilitaryBranch = exports.MilitaryBranch || (exports.MilitaryBranch = {}));
var Phase;
(function (Phase) {
    Phase[Phase["Movement"] = 1] = "Movement";
    Phase[Phase["Retreat"] = 2] = "Retreat";
    Phase[Phase["Build"] = 3] = "Build";
})(Phase = exports.Phase || (exports.Phase = {}));
class State {
    constructor(turn, phase) {
        this.turn = turn;
        this.phase = phase;
    }
}
exports.State = State;
/**
 * Status that an unit is dislodged
 */
class Dislodged {
    /**
     * @param attackedFrom - The province that the unit is attacked from
     */
    constructor(attackedFrom) {
        this.attackedFrom = attackedFrom;
    }
}
exports.Dislodged = Dislodged;
/**
 * Status of the province
 */
class ProvinceStatus {
    /**
     * @param occupied
     *    The power that occupies the province. The province is neutral if this property is null
     * @param standoff The flag whether standoff is occurred or not
     */
    constructor(occupied, standoff) {
        this.occupied = occupied;
        this.standoff = standoff;
    }
}
exports.ProvinceStatus = ProvinceStatus;
var Result;
(function (Result) {
    Result[Result["Success"] = 1] = "Success";
    Result[Result["Failed"] = 2] = "Failed";
    Result[Result["Dislodged"] = 3] = "Dislodged";
    Result[Result["Bounced"] = 4] = "Bounced";
    Result[Result["Cut"] = 5] = "Cut";
    Result[Result["Standoff"] = 6] = "Standoff";
    Result[Result["NoCorrespondingOrder"] = 7] = "NoCorrespondingOrder";
})(Result = exports.Result || (exports.Result = {}));



},{}],40:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Errors while resolving orders
  * @typeparam Detail The detail of the error
 */
class Error {
}
exports.Error = Error;
/**
 * Error that a power does not satisify conditions.
 * (e.g., A power does not have enough number of supply centers.)
 */
class PowerWithProblem extends Error {
    constructor(power) {
        super();
        this.power = power;
    }
}
exports.PowerWithProblem = PowerWithProblem;
/**
 * Error that a unit tries to move an unmovable location.
 */
class UnmovableLocation extends Error {
    constructor(unit, destination) {
        super();
        this.unit = unit;
        this.destination = destination;
    }
}
exports.UnmovableLocation = UnmovableLocation;
/**
 * Error that a unit tries to suppor an unsupportable order.
 */
class UnsupportableLocation extends Error {
    constructor(unit, destination) {
        super();
        this.unit = unit;
        this.destination = destination;
    }
}
exports.UnsupportableLocation = UnsupportableLocation;
/**
 * Error that a unit tries to convoy an invalid order.
 */
class UnconvoyableLocation extends Error {
    constructor(unit, destination) {
        super();
        this.unit = unit;
        this.destination = destination;
    }
}
exports.UnconvoyableLocation = UnconvoyableLocation;
/**
 * Error that a power tries to build an unbuildable location.
 */
class UnbuildableLocation extends Error {
    constructor(unit) {
        super();
        this.unit = unit;
    }
}
exports.UnbuildableLocation = UnbuildableLocation;
/**
 * Error that a unit does not existed.
 */
class UnitNotExisted extends Error {
    constructor(unit) {
        super();
        this.unit = unit;
    }
}
exports.UnitNotExisted = UnitNotExisted;
/**
 * Error that a player writes an invalid order.
 */
class CannotBeOrdered extends Error {
    constructor(order) {
        super();
        this.order = order;
    }
}
exports.CannotBeOrdered = CannotBeOrdered;
/**
 * Error that a player writes an invalid order.
 */
class InvalidPhase extends Error {
    constructor(order) {
        super();
        this.order = order;
    }
}
exports.InvalidPhase = InvalidPhase;
class SeveralOrders extends Error {
    constructor(units) {
        super();
        this.units = new Set([...units]);
    }
}
exports.SeveralOrders = SeveralOrders;
class OrderNotExisted extends Error {
    constructor(unit) {
        super();
        this.unit = unit;
    }
}
exports.OrderNotExisted = OrderNotExisted;



},{}],41:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const board_1 = require("./../board");
const types_1 = require("./types");
const data_1 = require("./data");
const Order = require("./order");
const { Province } = board_1.board;
class UnitForStandardRule {
    constructor(unit) {
        this.unit = unit;
    }
    hold() {
        return new Order.Hold(this.unit);
    }
    move(destination) {
        return new Order.Move(this.unit, destination);
    }
    moveViaConvoy(destination) {
        return new Order.Move(this.unit, destination, true);
    }
    support(target) {
        return new Order.Support(this.unit, target);
    }
    convoy(target) {
        return new Order.Convoy(this.unit, target);
    }
    retreat(destination) {
        return new Order.Retreat(this.unit, destination);
    }
    disband() {
        return new Order.Disband(this.unit);
    }
    build() {
        return new Order.Build(this.unit);
    }
}
exports.UnitForStandardRule = UnitForStandardRule;
/**
 * Helper for creating orders of the standard rule
 * ```
 * const $$ = new Helper(board)
 * const $ = // The dictionary of the locations
 * $$.U($.Lon).move($.Nth)
 *
 * $$.U($.Mar).support($$.A($.Par).move($.Bur))
 *
 * $$.F($.Lon).build()
 *
 * $$.U($.Nrg).disband()
 * ```
 */
class Helper {
    constructor(board) {
        this.board = board;
    }
    getUnit(militaryBranch, location) {
        function checkMilitaryBranch(tgt) {
            if (militaryBranch !== null) {
                return tgt === militaryBranch;
            }
            else {
                return true;
            }
        }
        if (this.board.state.phase === data_1.Phase.Movement) {
            const u = [...this.board.units].find(unit => {
                return (unit.location === location) && checkMilitaryBranch(unit.militaryBranch);
            });
            if (u) {
                return u;
            }
            else {
                throw `Cannot find unit: ${location}`;
            }
        }
        else if (this.board.state.phase === data_1.Phase.Retreat) {
            const u = [...this.board.units].find(unit => {
                return (unit.location === location) && checkMilitaryBranch(unit.militaryBranch) && this.board.unitStatuses.has(unit);
            });
            if (u) {
                return u;
            }
            else {
                throw `Cannot find unit: ${location}`;
            }
        }
        else {
            const unit = [...this.board.units].find(unit => {
                return (unit.location === location) && checkMilitaryBranch(unit.militaryBranch);
            });
            if (!unit) {
                if ((militaryBranch !== null) && location.province.homeOf) {
                    return new types_1.Unit(militaryBranch, location, location.province.homeOf);
                }
                else {
                    throw `Cannot find unit: ${location}`;
                }
            }
            else {
                return unit;
            }
        }
    }
    A(location) {
        return new UnitForStandardRule(this.getUnit(data_1.MilitaryBranch.Army, location));
    }
    F(location) {
        return new UnitForStandardRule(this.getUnit(data_1.MilitaryBranch.Fleet, location));
    }
    U(location) {
        return new UnitForStandardRule(this.getUnit(null, location));
    }
}
exports.Helper = Helper;



},{"./../board":25,"./data":39,"./order":48,"./types":53}],42:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const order_1 = require("./order");
class MovementOrderGenerator {
    defaultOrderOf(board, unit) {
        return new order_1.Hold(unit);
    }
    ordersToSkipPhase(board) {
        if (board.units.size === 0) {
            return new Set();
        }
        else {
            return null;
        }
    }
}
exports.MovementOrderGenerator = MovementOrderGenerator;



},{"./order":48}],43:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_1 = require("./data");
const utils_1 = require("./utils");
const order_1 = require("./order");
const { Fleet } = data_1.MilitaryBranch;
class MovementOrderGroup {
    constructor(target, relatedOrders) {
        this.target = target;
        this.relatedOrders = new Set([...relatedOrders]);
    }
    validSupports() {
        return new Set([...this.relatedOrders].filter(order => {
            return (order.order.tpe === order_1.OrderType.Support) &&
                (order.getResult() !== data_1.Result.Dislodged) && (order.getResult() !== data_1.Result.Cut) &&
                (order.getResult() !== data_1.Result.NoCorrespondingOrder);
        }).map(order => order.order));
    }
    power() {
        return 1 + this.validSupports().size;
    }
    route(map) {
        if (this.target.order instanceof order_1.Move) {
            const units = [...this.relatedOrders].filter(order => {
                return (order.order.tpe === order_1.OrderType.Convoy) &&
                    ((order.getResult() === data_1.Result.Failed) || (order.getResult() === data_1.Result.Success));
            }).map(order => order.order.unit);
            if (utils_1.Utils.isMovableViaSea(map, this.target.order.unit.location.province, this.target.order.destination.province, new Set(units))) {
                return { viaConvoy: true };
            }
            else if (map.movableLocationsOf(this.target.order.unit.location, this.target.order.unit.militaryBranch).has(this.target.order.destination)) {
                return { viaConvoy: false };
            }
            else {
                return null;
            }
        }
        else {
            return null;
        }
    }
}
exports.MovementOrderGroup = MovementOrderGroup;



},{"./data":39,"./order":48,"./utils":54}],44:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_1 = require("./data");
const order_1 = require("./order");
class MovementOrderWithResult {
    constructor(order) {
        this.order = order;
        this.result = null;
    }
    getResult() {
        return this.result;
    }
    setResult(result) {
        if (this.order instanceof order_1.Hold) {
            if (result === data_1.Result.Dislodged || result === data_1.Result.Success) {
                this.result = result;
            }
        }
        else if (this.order instanceof order_1.Move) {
            if (result === data_1.Result.Dislodged || result === data_1.Result.Success) {
                if (this.result !== data_1.Result.Success) {
                    this.result = result;
                }
            }
            else if (result === data_1.Result.Failed || result === data_1.Result.Bounced) {
                if (this.result !== data_1.Result.Dislodged) {
                    this.result = result;
                }
            }
        }
        else if (this.order instanceof order_1.Support) {
            if (result === data_1.Result.Dislodged) {
                this.result = result;
            }
            else if (result === data_1.Result.Failed || result === data_1.Result.Success) {
                if ((this.result !== data_1.Result.Dislodged) &&
                    (this.result !== data_1.Result.Cut) &&
                    (this.result !== data_1.Result.NoCorrespondingOrder)) {
                    this.result = result;
                }
            }
            else if (result === data_1.Result.Cut) {
                if (this.result !== data_1.Result.Dislodged) {
                    this.result = result;
                }
            }
            else if (result === data_1.Result.NoCorrespondingOrder) {
                this.result = result;
            }
        }
        else if (this.order instanceof order_1.Convoy) {
            if (result === data_1.Result.Dislodged) {
                this.result = result;
            }
            else if (result === data_1.Result.Failed || result === data_1.Result.Success) {
                if (this.result !== data_1.Result.Dislodged && this.result !== data_1.Result.NoCorrespondingOrder) {
                    this.result = result;
                }
            }
            else if (result === data_1.Result.NoCorrespondingOrder) {
                this.result = result;
            }
        }
        else {
            throw { err: `Invalid order: ${this.order}` };
        }
    }
}
exports.MovementOrderWithResult = MovementOrderWithResult;



},{"./data":39,"./order":48}],45:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_1 = require("./data");
const order_1 = require("./order");
const types_1 = require("./types");
const movement_order_with_result_1 = require("./movement-order-with-result");
const movement_order_group_1 = require("./movement-order-group");
const order_dependency_1 = require("./order-dependency");
const board_1 = require("./../board");
const rule_1 = require("./../rule");
const util_1 = require("./../util");
const { Province } = board_1.board;
const { Executed } = rule_1.rule;
const { Success } = util_1.util;
const { Retreat } = data_1.Phase;
class TmpMovementOrderGroup {
    constructor(target, relatedOrders) {
        this.target = target;
        this.relatedOrders = relatedOrders;
    }
}
class MovementResolver {
    resolve(board, orders) {
        const ordersWithResult = [...orders].map(order => new movement_order_with_result_1.MovementOrderWithResult(order));
        const movesViaConvoy = new Set();
        const dislodgedFrom = new Map();
        function canBounce(order1, order2) {
            const o1 = order1.order;
            const o2 = order2.order;
            if (o1 instanceof order_1.Move && o2 instanceof order_1.Move) {
                if (o1.destination.province === o2.destination.province) {
                    return true;
                }
                else if ((o1.destination.province === o2.unit.location.province) &&
                    (o2.destination.province === o1.unit.location.province)) {
                    if (movesViaConvoy.has(order1.order) || movesViaConvoy.has(order2.order)) {
                        return order1.getResult() === data_1.Result.Bounced || order2.getResult() === data_1.Result.Bounced;
                    }
                    else {
                        return true;
                    }
                }
                else if (o1.destination.province === o2.unit.location.province) {
                    return order2.getResult() === data_1.Result.Bounced;
                }
                else if (o2.destination.province === o1.unit.location.province) {
                    return order1.getResult() === data_1.Result.Bounced;
                }
                else {
                    return false;
                }
            }
            else if (o1 instanceof order_1.Move) {
                return o1.destination.province === order2.order.unit.location.province;
            }
            else if (o2 instanceof order_1.Move) {
                return o2.destination.province === order1.order.unit.location.province;
            }
            else {
                return false;
            }
        }
        // 1. Divide orders into groups
        const province2TmpOrderGroup = new Map();
        function getOrderGroup(province, location) {
            const groups = province2TmpOrderGroup.get(province) || new Map();
            const group = groups.get(location) || new TmpMovementOrderGroup(null, new Set());
            groups.set(location, group);
            province2TmpOrderGroup.set(province, groups);
            return group;
        }
        ordersWithResult.forEach(order => {
            const group = getOrderGroup(order.order.unit.location.province, order.order.unit.location);
            group.target = order;
            const o = order.order;
            if (o instanceof order_1.Hold) {
            }
            else if (o instanceof order_1.Move) {
                const o2 = o;
                const group2 = getOrderGroup(o2.destination.province, o2.unit.location);
                group2.target = order;
            }
            else if (o instanceof order_1.Support) {
                const o2 = o;
                const group2 = getOrderGroup(o2.destination.province, o2.target.unit.location);
                group2.relatedOrders.add(order);
            }
            else if (o instanceof order_1.Convoy) {
                const o2 = o;
                const group2 = getOrderGroup(o2.target.destination.province, o2.target.unit.location);
                group2.relatedOrders.add(order);
            }
        });
        // 2. Exclude support or convoy orders that have no corresponding orders
        for (let elem of [...province2TmpOrderGroup]) {
            for (let elem2 of [...elem[1]]) {
                if (elem2[1].target === null) {
                    elem2[1].relatedOrders.forEach((order) => {
                        order.setResult(data_1.Result.NoCorrespondingOrder);
                    });
                    elem[1].delete(elem2[0]);
                }
                else {
                    elem2[1].relatedOrders.forEach((order) => {
                        if (order.order instanceof order_1.Support || order.order instanceof order_1.Convoy) {
                            const targetType1 = order.order.target.tpe;
                            const targetType2 = elem2[1].target.order.tpe;
                            switch (targetType2) {
                                case order_1.OrderType.Move:
                                    if (targetType1 !== order_1.OrderType.Move) {
                                        order.setResult(data_1.Result.NoCorrespondingOrder);
                                    }
                                    break;
                                default:
                                    if (targetType1 !== order_1.OrderType.Hold) {
                                        order.setResult(data_1.Result.NoCorrespondingOrder);
                                    }
                                    break;
                            }
                        }
                    });
                }
            }
        }
        const province2OrderGroups = new Map();
        province2TmpOrderGroup.forEach((groups, province) => {
            const newGroups = [...groups.values()].map(x => {
                return new movement_order_group_1.MovementOrderGroup(x.target, x.relatedOrders);
            });
            province2OrderGroups.set(province, new Set([...newGroups]));
        });
        // 3. Generate the dependency graph
        let graph = new order_dependency_1.OrderDependency(ordersWithResult).graph;
        // 4. Resolve orders following dependency
        while (graph.nodes.size > 0) {
            const target = [...graph.nodes].find(node => {
                return [...graph.edges].every(elem => elem.n1 !== node);
            });
            if (!target) {
                throw "Internal Error";
            }
            graph = graph.deleteNode(target);
            const provinces = target;
            // Get all related order groups
            const relatedGroups = new Map([...provinces].map((province) => {
                const groups = province2OrderGroups.get(province) || new Set();
                return ([province, new Set([...groups])]);
            }));
            // Resolve each province
            while (relatedGroups.size !== 0) {
                // 1. Resolve cutting support
                relatedGroups.forEach(groups => {
                    groups.forEach(group => {
                        const o = group.target.order;
                        if (o instanceof order_1.Support) {
                            const destination = o.destination;
                            const isCut = [...groups].some(group => {
                                const o2 = group.target.order;
                                if (o2 instanceof order_1.Move) {
                                    return ((group.target.order.unit.location.province !== destination.province) &&
                                        (group.route(board.map)) &&
                                        (o.unit.power !== group.target.order.unit.power)) || false;
                                }
                                return false;
                            });
                            if (isCut) {
                                group.target.setResult(data_1.Result.Cut);
                            }
                        }
                    });
                });
                // 2. Sort provinces by related units
                const sortedGroups = [...relatedGroups].sort((a, b) => {
                    const hasG1Convoy = [...a[1]].some(group => {
                        return group.target.order.tpe === order_1.OrderType.Convoy;
                    });
                    const hasG2Convoy = [...b[1]].some(group => {
                        return group.target.order.tpe === order_1.OrderType.Convoy;
                    });
                    if (hasG1Convoy) {
                        return -1;
                    }
                    else if (hasG2Convoy) {
                        return 1;
                    }
                    else {
                        const pow1 = Math.max(...[...a[1]].map(group => group.power()));
                        const pow2 = Math.max(...[...b[1]].map(group => group.power()));
                        return (pow1 > pow2) ? -1 : 1;
                    }
                });
                // 3. Check whether move orders can be conducted or not
                const failedMoves = new Set();
                sortedGroups.forEach(elem => {
                    const [province, groups] = elem;
                    groups.forEach(group => {
                        const o = group.target.order;
                        if ((o instanceof order_1.Move) &&
                            (province === o.destination.province)) {
                            const route = group.route(board.map);
                            if (route) {
                                if (route.viaConvoy) {
                                    movesViaConvoy.add(group.target.order);
                                }
                            }
                            else {
                                failedMoves.add(group);
                            }
                        }
                    });
                });
                if (sortedGroups.length === 0) {
                    continue;
                }
                // 4. Resolve the province, and delete it from the buffer
                const [province, groups] = sortedGroups[0];
                relatedGroups.delete(province);
                // 5. Resolve and exclude failed move orders
                groups.forEach(group => {
                    if (failedMoves.has(group)) {
                        group.target.setResult(data_1.Result.Failed);
                        group.relatedOrders.forEach(o => { o.setResult(data_1.Result.Failed); });
                        groups.delete(group);
                    }
                });
                const defenceOpt = [...groups].find(group => {
                    return group.target.order.unit.location.province === province;
                });
                const offence = new Set([...groups]);
                if (defenceOpt)
                    offence.delete(defenceOpt);
                // 6. Resolve and exclude dislodged moves if #provinces <= 2
                if ([...provinces].length <= 2) {
                    if (defenceOpt) {
                        offence.forEach(group => {
                            if (group.target.order.tpe === order_1.OrderType.Move) {
                                const isDislodged = (!group.target.getResult()) ? false : group.target.getResult() === data_1.Result.Dislodged;
                                if (isDislodged && canBounce(group.target, defenceOpt.target)) {
                                    groups.delete(group);
                                    offence.delete(group);
                                    group.relatedOrders.forEach(o => { o.setResult(data_1.Result.Failed); });
                                }
                            }
                        });
                    }
                }
                if (groups.size === 0)
                    continue;
                // 7. Find orders that have the highest power
                const maxPower = Math.max(...[...groups].map(group => group.power()));
                const maxOrders = new Set([...groups].filter(g => g.power() >= maxPower).map(g => g.target));
                // 8. Resolve the defence order
                if (defenceOpt) {
                    if (maxOrders.has(defenceOpt.target)) {
                        const o = defenceOpt.target.order;
                        if (o instanceof order_1.Move) {
                        }
                        else if (o instanceof order_1.Hold) {
                            defenceOpt.target.setResult(data_1.Result.Success);
                            defenceOpt.relatedOrders.forEach(o => { o.setResult(data_1.Result.Success); });
                        }
                        else if (o instanceof order_1.Convoy) {
                            if (defenceOpt.target.getResult() !== data_1.Result.NoCorrespondingOrder) {
                                defenceOpt.target.setResult(data_1.Result.Failed); // This convoy order is available.
                            }
                            defenceOpt.relatedOrders.forEach(o => { o.setResult(data_1.Result.Success); });
                        }
                        else {
                            defenceOpt.relatedOrders.forEach(o => { o.setResult(data_1.Result.Success); });
                        }
                    }
                    else {
                        let isDislodged = false;
                        const offenceGroup = [...offence].find(group => maxOrders.has(group.target));
                        if (maxOrders.size === 1) {
                            if (offenceGroup) {
                                let offensivePower = 0;
                                if (offenceGroup.target.order.unit.power !== defenceOpt.target.order.unit.power) {
                                    offensivePower += 1;
                                }
                                const validSupports = [...offenceGroup.validSupports()].filter(s => {
                                    return s.unit.power !== defenceOpt.target.order.unit.power;
                                });
                                offensivePower += validSupports.length;
                                isDislodged = defenceOpt.power() < offensivePower;
                            }
                            if (isDislodged) {
                                if (offenceGroup) {
                                    defenceOpt.target.setResult(data_1.Result.Dislodged);
                                    dislodgedFrom.set(defenceOpt.target.order.unit, offenceGroup.target.order.unit.location.province);
                                    defenceOpt.relatedOrders.forEach(order => { order.setResult(data_1.Result.Failed); });
                                }
                            }
                            else {
                                if (defenceOpt.target.order.tpe === order_1.OrderType.Hold) {
                                    defenceOpt.target.setResult(data_1.Result.Success);
                                    defenceOpt.relatedOrders.forEach(o => { o.setResult(data_1.Result.Success); });
                                }
                            }
                        }
                    }
                }
                // 9. Resolve the offence orders
                offence.forEach(group => {
                    let isBounced = true;
                    if (maxOrders.has(group.target)) {
                        if (maxOrders.size === 1) {
                            if (defenceOpt) {
                                if (defenceOpt.target.order.tpe === order_1.OrderType.Move) {
                                    isBounced = (defenceOpt.target.getResult() !== data_1.Result.Success) &&
                                        (defenceOpt.target.getResult() !== data_1.Result.Dislodged);
                                }
                                else {
                                    isBounced = defenceOpt.target.getResult() !== data_1.Result.Dislodged;
                                }
                            }
                            else {
                                isBounced = false;
                            }
                        }
                        else if (maxOrders.size === 2) {
                            const order2 = ([...maxOrders].find(o => o !== group.target));
                            isBounced = canBounce(group.target, order2);
                        }
                    }
                    if (isBounced) {
                        group.target.setResult(data_1.Result.Bounced);
                        group.relatedOrders.forEach(o => { o.setResult(data_1.Result.Failed); });
                    }
                    else {
                        group.target.setResult(data_1.Result.Success);
                        group.relatedOrders.forEach(o => { o.setResult(data_1.Result.Success); });
                    }
                });
            }
        }
        // Generate a new board
        const unit2Result = new Map(ordersWithResult.map(order => {
            return [order.order.unit, [order.order, order.getResult()]];
        }));
        const newUnits = new Set();
        board.units.forEach(unit => {
            const r = unit2Result.get(unit);
            if (r) {
                const [order, result] = r;
                if (order instanceof order_1.Move && result === data_1.Result.Success) {
                    newUnits.add(new types_1.Unit(unit.militaryBranch, order.destination, unit.power));
                }
                else {
                    newUnits.add(unit);
                }
            }
            else {
                newUnits.add(unit);
            }
        });
        const newUnitStatuses = new Map();
        ordersWithResult.forEach(order => {
            if (order.getResult() === data_1.Result.Dislodged) {
                const x = dislodgedFrom.get(order.order.unit);
                newUnitStatuses.set(order.order.unit, new data_1.Dislodged(x));
            }
        });
        const provincesContainingUnit = new Set([...newUnits].map(u => u.location.province));
        const occupationStatuses = [...board.provinceStatuses]
            .filter(elem => elem[1].occupied)
            .map(elem => {
            if (elem[1].standoff) {
                return [elem[0], new data_1.ProvinceStatus(elem[1].occupied, false)];
            }
            else {
                return elem;
            }
        });
        const newProvinceStatuses = new Map([...occupationStatuses]);
        province2OrderGroups.forEach((groups, province) => {
            const wasBounced = [...groups].some(group => group.target.getResult() === data_1.Result.Bounced);
            const standoff = wasBounced && !(provincesContainingUnit.has(province));
            if (standoff) {
                const current = newProvinceStatuses.get(province) || new data_1.ProvinceStatus(null, true);
                const x = new data_1.ProvinceStatus(current.occupied, true);
                newProvinceStatuses.set(province, x);
            }
        });
        const newState = new data_1.State(board.state.turn, Retreat);
        const newBoard = new types_1.Board(board.map, newState, newUnits, newUnitStatuses, newProvinceStatuses);
        const orderResults = [...ordersWithResult].map(order => {
            const r = order.getResult();
            if (r !== null) {
                return new Executed(order.order, r);
            }
            else {
                throw `Internal error: ${order.order} was not resolved`;
            }
        });
        return new Success(new types_1.ResolvedResult(newBoard, orderResults, false));
    }
}
exports.MovementResolver = MovementResolver;



},{"./../board":25,"./../rule":28,"./../util":55,"./data":39,"./movement-order-group":43,"./movement-order-with-result":44,"./order":48,"./order-dependency":47,"./types":53}],46:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const order_1 = require("./order");
const data_1 = require("./data");
const Error = require("./error");
const { Army, Fleet } = data_1.MilitaryBranch;
class MovementValidator {
    unitsRequiringOrder(board) {
        return board.units;
    }
    errorOfOrder(board, o) {
        // The order is invalid if order.unit is not in board.
        if (!board.units.has(o.unit)) {
            return new Error.UnitNotExisted(o.unit);
        }
        if (o instanceof order_1.Hold) {
            return null;
        }
        else if (o instanceof order_1.Move) {
            // TODO the type of `o` is inferred as `never`
            const order = o;
            /*
            Move is valid if
            1. the unit can move to the destination or
            2. the unit is army, the location is coast, and the fleet can move to destination from the location.
            */
            if (utils_1.Utils.movableLocationsOf(board, order.unit).has(order.destination)) {
                return null;
            }
            else {
                return new Error.UnmovableLocation(order.unit, order.destination);
            }
        }
        else if (o instanceof order_1.Support) {
            const order = o;
            // Support is valid if the destination can be moved.
            const msgForTarget = this.errorOfOrder(board, order.target);
            if (msgForTarget) {
                return msgForTarget;
            }
            else {
                if (utils_1.Utils.supportableLocationsOf(board.map, order.unit).has(order.destination)) {
                    return null;
                }
                else {
                    return new Error.UnsupportableLocation(order.unit, order.destination);
                }
            }
        }
        else if (o instanceof order_1.Convoy) {
            const order = o;
            /*
            Convoy is valid if
            1. the unit is fleet,
            2. the target is move order,
            3. the target is army,
            4. the location is sea, and
            5. the destination can be moved from the unit's location
            */
            const msg = this.errorOfOrder(board, order.target);
            if (msg) {
                return msg;
            }
            else {
                if (order.unit.militaryBranch !== Fleet) {
                    return new Error.CannotBeOrdered(order);
                }
                else if (order.target.unit.militaryBranch !== Army) {
                    return new Error.CannotBeOrdered(order);
                }
                else {
                    if (!utils_1.Utils.isSea(board.map, order.unit.location.province)) {
                        return new Error.CannotBeOrdered(order);
                    }
                    else if (!utils_1.Utils.isMovableViaSea(board.map, order.target.unit.location.province, order.target.destination.province, board.units)) {
                        return new Error.UnmovableLocation(order.target.unit, order.target.destination);
                    }
                    else if (!(board.map.movableProvincesOf(order.unit.location.province, Fleet).has(order.target.destination.province) ||
                        utils_1.Utils.isMovableViaSea(board.map, order.unit.location.province, order.target.destination.province, board.units))) {
                        return new Error.UnconvoyableLocation(order.unit, order.target.destination);
                    }
                    else {
                        return null;
                    }
                }
            }
        }
        return new Error.InvalidPhase(o);
    }
    errorOfOrders(board, orders) {
        return null;
    }
}
exports.MovementValidator = MovementValidator;



},{"./data":39,"./error":40,"./order":48,"./utils":54}],47:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const order_1 = require("./order");
const data_1 = require("./data");
const graph_1 = require("./../graph");
const board_1 = require("./../board");
const { DirectedGraph, Edge } = graph_1.graph;
const { Province } = board_1.board;
class OrderDependency {
    constructor(ordersWithResult) {
        const nodeMap = new Map();
        const nodes = new Set();
        const edges = new Set();
        function addNode(p1) {
            if (nodeMap.has(p1)) {
                return;
            }
            const n1 = new Set([p1]);
            nodeMap.set(p1, n1);
            nodes.add(n1);
        }
        function addEdge(p1, p2) {
            const n1 = nodeMap.get(p1);
            const n2 = nodeMap.get(p2);
            if (n1 && n2) {
                edges.add(new Edge(n1, n2));
            }
        }
        const os = [...ordersWithResult];
        os.forEach(orderWithResult => {
            const order = orderWithResult.order;
            addNode(order.unit.location.province);
            if (order instanceof order_1.Hold) {
            }
            else if (order instanceof order_1.Move) {
                const o = order;
                addNode(o.destination.province);
                addEdge(o.destination.province, o.unit.location.province);
            }
            else if (order instanceof order_1.Support) {
                const o = order;
                if (orderWithResult.getResult() !== data_1.Result.NoCorrespondingOrder) {
                    addNode(o.destination.province);
                    addEdge(o.unit.location.province, o.destination.province);
                }
            }
            else if (order instanceof order_1.Convoy) {
                const o = order;
                if (orderWithResult.getResult() !== data_1.Result.NoCorrespondingOrder) {
                    addNode(o.target.destination.province);
                    addEdge(o.unit.location.province, o.target.destination.province);
                }
            }
        });
        let graph = new DirectedGraph(edges, nodes);
        while (true) {
            const c = graph.getCycle();
            if (c && c.length > 1) {
                graph = graph.mergeNodes(new Set([...c]));
            }
            else {
                break;
            }
        }
        this.graph = graph;
    }
}
exports.OrderDependency = OrderDependency;



},{"./../board":25,"./../graph":26,"./data":39,"./order":48}],48:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var OrderType;
(function (OrderType) {
    OrderType[OrderType["Hold"] = 1] = "Hold";
    OrderType[OrderType["Move"] = 2] = "Move";
    OrderType[OrderType["Support"] = 3] = "Support";
    OrderType[OrderType["Convoy"] = 4] = "Convoy";
    OrderType[OrderType["Retreat"] = 5] = "Retreat";
    OrderType[OrderType["Disband"] = 6] = "Disband";
    OrderType[OrderType["Build"] = 7] = "Build";
})(OrderType = exports.OrderType || (exports.OrderType = {}));
/**
 * Order of the standard rule
 */
class Order {
    /**
     * @param unit The unit that corresponds to this order.
     * @param tpe The type of the order
     */
    constructor(unit, tpe) {
        this.unit = unit;
        this.tpe = tpe;
    }
}
exports.Order = Order;
/**
 * Hold order
 */
class Hold extends Order {
    /**
     * @param unit The unit that corresponds to this order.
     */
    constructor(unit) {
        super(unit, OrderType.Hold);
    }
    toString() {
        return `${this.unit} H`;
    }
}
exports.Hold = Hold;
/**
 * Move order
 */
class Move extends Order {
    /**
     * @param unit The unit that corresponds to this order.
     * @param destination The destination of this move order.
     * @param useConvoy The flag whether this move order uses convoy or not.
     */
    constructor(unit, destination, useConvoy) {
        super(unit, OrderType.Move);
        this.destination = destination;
        this.useConvoy = useConvoy || false;
    }
    toString() {
        if (this.useConvoy) {
            return `${this.unit}-${this.destination} via Convoy`;
        }
        else {
            return `${this.unit}-${this.destination}`;
        }
    }
}
exports.Move = Move;
/**
 * Support order
 */
class Support extends Order {
    /**
     * @param unit The unit that corresponds to this order.
     * @param target The target order of this support.
     */
    constructor(unit, target) {
        super(unit, OrderType.Support);
        this.target = target;
        console.assert(target.tpe === OrderType.Move || target.tpe === OrderType.Hold);
        if (target instanceof Move) {
            this.destination = target.destination;
        }
        else {
            this.destination = target.unit.location;
        }
    }
    toString() {
        return `${this.unit} S ${this.target}`;
    }
}
exports.Support = Support;
/**
 * Convoy order
 */
class Convoy extends Order {
    /**
     * @param unit The unit that corresponds to this order.
     * @param target The target order of this convoy.
     */
    constructor(unit, target) {
        super(unit, OrderType.Convoy);
        this.target = target;
        console.assert(target.tpe === OrderType.Move);
    }
    toString() {
        return `${this.unit} C ${this.target}`;
    }
}
exports.Convoy = Convoy;
/**
 * Retreat order
 */
class Retreat extends Order {
    /**
     * @param unit The unit that corresponds to this order.
     * @param destination The destination of this retreat.
     */
    constructor(unit, destination) {
        super(unit, OrderType.Retreat);
        this.destination = destination;
    }
    toString() {
        return `${this.unit} R ${this.destination}`;
    }
}
exports.Retreat = Retreat;
/**
 * Disband order
 */
class Disband extends Order {
    /**
     * @param unit The unit that corresponds to this order.
     */
    constructor(unit) {
        super(unit, OrderType.Disband);
    }
    toString() {
        return `Disband ${this.unit}`;
    }
}
exports.Disband = Disband;
/**
 * Build order
 */
class Build extends Order {
    /**
     * @param unit The unit that corresponds to this order.
     */
    constructor(unit) {
        super(unit, OrderType.Build);
    }
    toString() {
        return `Build ${this.unit}`;
    }
}
exports.Build = Build;



},{}],49:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const order_1 = require("./order");
class RetreatOrderGenerator {
    ordersToSkipPhase(board) {
        if (board.unitStatuses.size === 0) {
            return new Set();
        }
        if ([...board.unitStatuses].every(elem => {
            const [unit, status] = elem;
            const locations = utils_1.Utils.locationsToRetreat(board, unit, status.attackedFrom);
            return locations.size === 0;
        })) {
            // Disband all dislodged units
            const retval = new Set();
            board.unitStatuses.forEach((status, unit) => {
                retval.add(new order_1.Disband(unit));
            });
            return retval;
        }
        return null;
    }
    defaultOrderOf(board, unit) {
        return new order_1.Disband(unit);
    }
}
exports.RetreatOrderGenerator = RetreatOrderGenerator;



},{"./order":48,"./utils":54}],50:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_1 = require("./data");
const order_1 = require("./order");
const utils_1 = require("./utils");
const types_1 = require("./types");
const board_1 = require("./../board");
const rule_1 = require("./../rule");
const util_1 = require("./../util");
const { Province } = board_1.board;
const { Executed } = rule_1.rule;
const { Success } = util_1.util;
const { Movement, Build } = data_1.Phase;
class RetreatResolver {
    resolve(board, orders) {
        const disbands = [...orders].filter(order => order.tpe === order_1.OrderType.Disband);
        const retreats = ([...orders].filter(order => order.tpe === order_1.OrderType.Retreat));
        const retval = new Map();
        disbands.forEach(order => retval.set(order, data_1.Result.Success));
        // Create a map from province to retreat order
        const province2RetreatUnits = new Map();
        retreats.forEach(order => {
            const elem = province2RetreatUnits.get(order.destination.province) || [];
            elem.push(order);
            province2RetreatUnits.set(order.destination.province, elem);
        });
        // Resolve retreat orders
        province2RetreatUnits.forEach((orders, province) => {
            if (orders.length === 1) {
                orders.forEach(order => retval.set(order, data_1.Result.Success));
            }
            else {
                orders.forEach(order => retval.set(order, data_1.Result.Failed));
            }
        });
        // Generate a new board
        const unit2Result = new Map([...retval].map(elem => {
            return [elem[0].unit, [elem[0], elem[1]]];
        }));
        const newUnits = new Set();
        board.units.forEach(unit => {
            const result = unit2Result.get(unit);
            if (result) {
                const [order, r] = result;
                if (order instanceof order_1.Retreat && r === data_1.Result.Success) {
                    newUnits.add(new types_1.Unit(unit.militaryBranch, order.destination, unit.power));
                }
            }
            else {
                newUnits.add(unit);
            }
        });
        const newState = (board.state.turn.isBuildable)
            ? new data_1.State(board.state.turn, Build)
            : new data_1.State(board.state.turn.nextTurn(), Movement);
        // Update occupation if needed
        const occupationStatuses = [...board.provinceStatuses]
            .filter(elem => elem[1].occupied)
            .map(elem => {
            if (elem[1].standoff) {
                return [elem[0], new data_1.ProvinceStatus(elem[1].occupied, false)];
            }
            else {
                return elem;
            }
        });
        const newProvinceStatuses = new Map([...occupationStatuses]);
        if (board.state.turn.isOccupationUpdateable) {
            newUnits.forEach(unit => {
                newProvinceStatuses.set(unit.location.province, new data_1.ProvinceStatus(unit.power, false));
            });
        }
        const newBoard = new types_1.Board(board.map, newState, newUnits, [], newProvinceStatuses);
        const orderResults = [...retval].map(elem => {
            const [order, result] = elem;
            return new Executed(order, result);
        });
        const numOfCenters = ([...board.map.provinces].filter(p => p.isSupplyCenter)).length;
        const numberOfSupplyCenters = utils_1.Utils.numberOfSupplyCenters(newBoard);
        const isFinished = [...newBoard.map.powers].some(power => {
            return (numberOfSupplyCenters.get(power) || 0) > (numOfCenters / 2);
        });
        return new Success(new types_1.ResolvedResult(newBoard, orderResults, isFinished));
    }
}
exports.RetreatResolver = RetreatResolver;



},{"./../board":25,"./../rule":28,"./../util":55,"./data":39,"./order":48,"./types":53,"./utils":54}],51:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const order_1 = require("./order");
const Error = require("./error");
class RetreatValidator {
    unitsRequiringOrder(board) {
        return new Set([...board.unitStatuses].map(elem => elem[0]));
    }
    errorOfOrder(board, order) {
        // The order is invalid if order.unit is not dislodged
        const dislodged = board.unitStatuses.get(order.unit);
        if (!dislodged) {
            return new Error.CannotBeOrdered(order);
        }
        if (order instanceof order_1.Retreat) {
            const ls = utils_1.Utils.locationsToRetreat(board, order.unit, dislodged.attackedFrom);
            if (!ls.has(order.destination)) {
                return new Error.UnmovableLocation(order.unit, order.destination);
            }
        }
        else if (!(order instanceof order_1.Disband)) {
            return new Error.InvalidPhase(order);
        }
        return null;
    }
    errorOfOrders(board, orders) {
        for (let elem of [...board.unitStatuses]) {
            const [unit, status] = elem;
            const hasOrder = [...orders].some(order => order.unit === unit);
            if (!hasOrder) {
                return new Error.OrderNotExisted(unit);
            }
        }
        return null;
    }
}
exports.RetreatValidator = RetreatValidator;



},{"./error":40,"./order":48,"./utils":54}],52:[function(require,module,exports){
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
const data_1 = require("./data");
const movement_resolver_1 = require("./movement-resolver");
const movement_validator_1 = require("./movement-validator");
const movement_order_generator_1 = require("./movement-order-generator");
const retreat_resolver_1 = require("./retreat-resolver");
const retreat_validator_1 = require("./retreat-validator");
const retreat_order_generator_1 = require("./retreat-order-generator");
const build_resolver_1 = require("./build-resolver");
const build_validator_1 = require("./build-validator");
const build_order_generator_1 = require("./build-order-generator");
const error_1 = require("./error");
const rule_1 = require("./../rule");
const util_1 = require("./../util");
const { Success, Failure } = util_1.util;
const { Movement, Retreat, Build } = data_1.Phase;
class PhaseRule {
    constructor(resolver, validator, orderGenerator) {
        this.resolver = resolver;
        this.validator = validator;
        this.orderGenerator = orderGenerator;
    }
}
/**
 * Standard rule of Diplomacy
 */
class Rule extends rule_1.rule.Rule {
    /**
     * @param stringify Stringify instances of Power
     */
    constructor() {
        super();
        this.phaseRules = new Map([
            [
                Movement,
                new PhaseRule(new movement_resolver_1.MovementResolver(), new movement_validator_1.MovementValidator(), new movement_order_generator_1.MovementOrderGenerator())
            ],
            [
                Retreat,
                new PhaseRule(new retreat_resolver_1.RetreatResolver(), new retreat_validator_1.RetreatValidator(), new retreat_order_generator_1.RetreatOrderGenerator())
            ],
            [
                Build,
                new PhaseRule(new build_resolver_1.BuildResolver(), new build_validator_1.BuildValidator(), new build_order_generator_1.BuildOrderGenerator())
            ]
        ]);
    }
    resolveProcedure(board, orders) {
        const unitsHaveSeveralOrders = new Set([...orders].filter(order => {
            return [...orders].some(order2 => order !== order2 && order.unit === order2.unit);
        }).map(order => order.unit));
        if (unitsHaveSeveralOrders.size !== 0) {
            return new Failure(new error_1.SeveralOrders(unitsHaveSeveralOrders));
        }
        const ruleOpt = this.phaseRules.get(board.state.phase);
        if (!ruleOpt) {
            throw `invalid phase: ${board.state.phase}`;
        }
        const { resolver } = ruleOpt;
        const r1 = resolver.resolve(board, orders);
        if (!r1.result) {
            return r1;
        }
        const result = r1.result;
        const ruleOpt2 = this.phaseRules.get(result.board.state.phase);
        if (!ruleOpt2) {
            throw `Invalid phase: ${result.board.state.phase}`;
        }
        const orders2 = ruleOpt2.orderGenerator.ordersToSkipPhase(result.board);
        if (!orders2) {
            return r1;
        }
        const r2 = this.resolve(result.board, orders2);
        if (!r2.result) {
            return r2;
        }
        const result2 = r2.result;
        const orderResults = new Set([...result.results]);
        result2.results.forEach(r => orderResults.add(r));
        return new Success(new types_1.ResolvedResult(result2.board, orderResults, result.isFinished || result2.isFinished));
    }
    unitsRequiringOrder(board) {
        const ruleOpt = this.phaseRules.get(board.state.phase);
        if (!ruleOpt) {
            throw `invalid phase: ${board.state.phase}`;
        }
        return ruleOpt.validator.unitsRequiringOrder(board);
    }
    errorOfOrder(board, order) {
        const ruleOpt = this.phaseRules.get(board.state.phase);
        if (!ruleOpt) {
            throw `invalid phase: ${board.state.phase}`;
        }
        return ruleOpt.validator.errorOfOrder(board, order);
    }
    errorOfOrders(board, orders) {
        const ruleOpt = this.phaseRules.get(board.state.phase);
        if (!ruleOpt) {
            throw `invalid phase: ${board.state.phase}`;
        }
        return ruleOpt.validator.errorOfOrders(board, orders);
    }
    defaultOrderOf(board, unit) {
        const ruleOpt = this.phaseRules.get(board.state.phase);
        if (!ruleOpt) {
            throw `invalid phase: ${board.state.phase}`;
        }
        return ruleOpt.orderGenerator.defaultOrderOf(board, unit);
    }
}
exports.Rule = Rule;



},{"./../rule":28,"./../util":55,"./build-order-generator":36,"./build-resolver":37,"./build-validator":38,"./data":39,"./error":40,"./movement-order-generator":42,"./movement-resolver":45,"./movement-validator":46,"./retreat-order-generator":49,"./retreat-resolver":50,"./retreat-validator":51,"./types":53}],53:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const board_1 = require("./../board");
const rule_1 = require("./../rule");
const data_1 = require("./data");
class Location extends board_1.board.Location {
}
exports.Location = Location;
class Unit extends board_1.board.Unit {
    toString() {
        switch (this.militaryBranch) {
            case data_1.MilitaryBranch.Army:
                return `A ${this.location}`;
            case data_1.MilitaryBranch.Fleet:
                return `F ${this.location}`;
        }
    }
}
exports.Unit = Unit;
class DiplomacyMap extends board_1.board.DiplomacyMap {
}
exports.DiplomacyMap = DiplomacyMap;
class Board extends board_1.board.Board {
}
exports.Board = Board;
class ResolvedResult extends rule_1.rule.ResolvedResult {
}
exports.ResolvedResult = ResolvedResult;



},{"./../board":25,"./../rule":28,"./data":39}],54:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const board_1 = require("./../board");
const data_1 = require("./data");
const { Province } = board_1.board;
/*
/**
 * Utility of the standard rule
 */
class Utils {
    /**
     * @param board -
     * @returns The map between powers and the number of supply centers
     */
    static numberOfSupplyCenters(board) {
        const retval = new Map();
        board.provinceStatuses.forEach((status, province) => {
            if (!status.occupied) {
                return;
            }
            const power = status.occupied;
            if (power) {
                const numOfSupply = retval.get(power) || 0;
                retval.set(power, numOfSupply + ((province.isSupplyCenter) ? 1 : 0));
            }
        });
        return retval;
    }
    /**
     * @returns True if the province is sea. Sea is a province that only Fleet can enter.
     */
    static isSea(map, province) {
        return [...map.locationsOf(province)].every(l => {
            return l.militaryBranches.size === 1 && l.militaryBranches.has(data_1.MilitaryBranch.Fleet);
        });
    }
    /**
     * @return True if the unit can be ordered "convoy" order.
     */
    static canConvoy(map, unit) {
        return Utils.isSea(map, unit.location.province);
    }
    /**
     * @returns The locations that the unit can retreat to.
     */
    static locationsToRetreat(board, unit, attackedFrom) {
        return new Set([...board.map.movableLocationsOf(unit.location, unit.militaryBranch)].filter(location => {
            const existsUnit = [...board.units].some(unit => unit.location.province === location.province);
            const status = board.provinceStatuses.get(location.province);
            if (status && status.standoff) {
                return false;
            }
            else if (location.province === attackedFrom) {
                return false;
            }
            else if (existsUnit) {
                return false;
            }
            else {
                return true;
            }
        }));
    }
    /**
     * @param units The set of units that is used for convoy
     */
    static isMovableViaSea(map, source, destination, units) {
        const provinces = new Set([...units]
            .filter(u => u.militaryBranch === data_1.MilitaryBranch.Fleet)
            .map(x => x.location.province));
        const visited = new Set();
        // TODO duplicated code
        function dfs(province) {
            const nextProvinces = [...map.movableProvincesOf(province, data_1.MilitaryBranch.Fleet)]
                .filter(p => Utils.isSea(map, p) && provinces.has(p));
            return nextProvinces.some(p => {
                if (map.movableProvincesOf(p, data_1.MilitaryBranch.Fleet).has(destination)) {
                    return true;
                }
                else if (!visited.has(p)) {
                    visited.add(p);
                    return dfs(p);
                }
                else {
                    return false;
                }
            });
        }
        return dfs(source);
    }
    /**
     * @returns The location that the unit can move via convoy
     */
    static movableViaConvoyLocationsOf(board, unit) {
        if (unit.militaryBranch === data_1.MilitaryBranch.Fleet) {
            return new Set();
        }
        const provinces = new Set([...board.units].map(x => x.location.province));
        const visited = new Set();
        // TODO duplicated code
        function dfs(province) {
            const nextProvinces = [...board.map.movableProvincesOf(province, data_1.MilitaryBranch.Fleet)]
                .filter(p => Utils.isSea(board.map, p) && provinces.has(p));
            nextProvinces.forEach(p => {
                if (!visited.has(p)) {
                    visited.add(p);
                    dfs(p);
                }
            });
        }
        dfs(unit.location.province);
        // The provinces that can use for convoy
        const sea = visited;
        let retval = [];
        sea.forEach(s => {
            [...board.map.movableProvincesOf(s, data_1.MilitaryBranch.Fleet)]
                .filter(p => !Utils.isSea(board.map, p))
                .forEach(p => {
                board.map.locationsOf(p).forEach(l => {
                    if (l.militaryBranches.has(data_1.MilitaryBranch.Army)) {
                        retval.push(l);
                    }
                });
            });
        });
        return new Set(retval.filter(x => x.province !== unit.location.province));
    }
    /**
     * @returns The locations that the unit can move to (including via convoy).
     */
    static movableLocationsOf(board, unit) {
        const locations = Array.from(board.map.movableLocationsOf(unit.location, unit.militaryBranch));
        const movableViaSea = Utils.movableViaConvoyLocationsOf(board, unit);
        return new Set(Array.from(movableViaSea).concat(locations));
    }
    /**
     * @return The set of locations that can be supported by the unit
     */
    static supportableLocationsOf(map, unit) {
        const provinces = new Set(Array.from(map.movableLocationsOf(unit.location, unit.militaryBranch)).map(l => l.province));
        const retval = new Set();
        provinces.forEach(p => {
            map.locationsOf(p).forEach(l => retval.add(l));
        });
        return retval;
    }
    /**
     * @return
     *   The Map between powers and number of buildable units.
     *   If a power should disband some units, this contains negative number
     *   (e.g., It contains -1 if a power has to disband 1 unit).
     */
    static numberOfBuildableUnits(board) {
        const numberOfSupplyCenters = Utils.numberOfSupplyCenters(board);
        const retval = new Map();
        board.map.powers.forEach(power => {
            const numOfSupply = numberOfSupplyCenters.get(power) || 0;
            const numOfUnits = ([...board.units].filter(x => x.power === power)).length;
            retval.set(power, numOfSupply - numOfUnits);
        });
        return retval;
    }
}
exports.Utils = Utils;



},{"./../board":25,"./data":39}],55:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util;
(function (util) {
    class Success {
        constructor(result) {
            this.result = result;
        }
    }
    util.Success = Success;
    class Failure {
        constructor(err) {
            this.err = err;
        }
    }
    util.Failure = Failure;
})(util = exports.util || (exports.util = {}));



},{}],56:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var variant;
(function (variant) {
    /**
     * Variant of Diplomacy
     */
    class Variant {
        /**
         * @param rule The rule used in this variant.
         * @param initialBoard The initial state of the board used in this variant.
         */
        constructor(rule, initialBoard) {
            this.rule = rule;
            this.initialBoard = initialBoard;
        }
    }
    variant.Variant = Variant;
})(variant = exports.variant || (exports.variant = {}));



},{}],57:[function(require,module,exports){
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

'use strict';
/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

},{}],58:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],59:[function(require,module,exports){
'use strict';

module.exports = require('./lib/ReactDOM');

},{"./lib/ReactDOM":89}],60:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var ARIADOMPropertyConfig = {
  Properties: {
    // Global States and Properties
    'aria-current': 0, // state
    'aria-details': 0,
    'aria-disabled': 0, // state
    'aria-hidden': 0, // state
    'aria-invalid': 0, // state
    'aria-keyshortcuts': 0,
    'aria-label': 0,
    'aria-roledescription': 0,
    // Widget Attributes
    'aria-autocomplete': 0,
    'aria-checked': 0,
    'aria-expanded': 0,
    'aria-haspopup': 0,
    'aria-level': 0,
    'aria-modal': 0,
    'aria-multiline': 0,
    'aria-multiselectable': 0,
    'aria-orientation': 0,
    'aria-placeholder': 0,
    'aria-pressed': 0,
    'aria-readonly': 0,
    'aria-required': 0,
    'aria-selected': 0,
    'aria-sort': 0,
    'aria-valuemax': 0,
    'aria-valuemin': 0,
    'aria-valuenow': 0,
    'aria-valuetext': 0,
    // Live Region Attributes
    'aria-atomic': 0,
    'aria-busy': 0,
    'aria-live': 0,
    'aria-relevant': 0,
    // Drag-and-Drop Attributes
    'aria-dropeffect': 0,
    'aria-grabbed': 0,
    // Relationship Attributes
    'aria-activedescendant': 0,
    'aria-colcount': 0,
    'aria-colindex': 0,
    'aria-colspan': 0,
    'aria-controls': 0,
    'aria-describedby': 0,
    'aria-errormessage': 0,
    'aria-flowto': 0,
    'aria-labelledby': 0,
    'aria-owns': 0,
    'aria-posinset': 0,
    'aria-rowcount': 0,
    'aria-rowindex': 0,
    'aria-rowspan': 0,
    'aria-setsize': 0
  },
  DOMAttributeNames: {},
  DOMPropertyNames: {}
};

module.exports = ARIADOMPropertyConfig;
},{}],61:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var ReactDOMComponentTree = require('./ReactDOMComponentTree');

var focusNode = require('fbjs/lib/focusNode');

var AutoFocusUtils = {
  focusDOMComponent: function () {
    focusNode(ReactDOMComponentTree.getNodeFromInstance(this));
  }
};

module.exports = AutoFocusUtils;
},{"./ReactDOMComponentTree":92,"fbjs/lib/focusNode":11}],62:[function(require,module,exports){
/**
 * Copyright 2013-present Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var EventPropagators = require('./EventPropagators');
var ExecutionEnvironment = require('fbjs/lib/ExecutionEnvironment');
var FallbackCompositionState = require('./FallbackCompositionState');
var SyntheticCompositionEvent = require('./SyntheticCompositionEvent');
var SyntheticInputEvent = require('./SyntheticInputEvent');

var END_KEYCODES = [9, 13, 27, 32]; // Tab, Return, Esc, Space
var START_KEYCODE = 229;

var canUseCompositionEvent = ExecutionEnvironment.canUseDOM && 'CompositionEvent' in window;

var documentMode = null;
if (ExecutionEnvironment.canUseDOM && 'documentMode' in document) {
  documentMode = document.documentMode;
}

// Webkit offers a very useful `textInput` event that can be used to
// directly represent `beforeInput`. The IE `textinput` event is not as
// useful, so we don't use it.
var canUseTextInputEvent = ExecutionEnvironment.canUseDOM && 'TextEvent' in window && !documentMode && !isPresto();

// In IE9+, we have access to composition events, but the data supplied
// by the native compositionend event may be incorrect. Japanese ideographic
// spaces, for instance (\u3000) are not recorded correctly.
var useFallbackCompositionData = ExecutionEnvironment.canUseDOM && (!canUseCompositionEvent || documentMode && documentMode > 8 && documentMode <= 11);

/**
 * Opera <= 12 includes TextEvent in window, but does not fire
 * text input events. Rely on keypress instead.
 */
function isPresto() {
  var opera = window.opera;
  return typeof opera === 'object' && typeof opera.version === 'function' && parseInt(opera.version(), 10) <= 12;
}

var SPACEBAR_CODE = 32;
var SPACEBAR_CHAR = String.fromCharCode(SPACEBAR_CODE);

// Events and their corresponding property names.
var eventTypes = {
  beforeInput: {
    phasedRegistrationNames: {
      bubbled: 'onBeforeInput',
      captured: 'onBeforeInputCapture'
    },
    dependencies: ['topCompositionEnd', 'topKeyPress', 'topTextInput', 'topPaste']
  },
  compositionEnd: {
    phasedRegistrationNames: {
      bubbled: 'onCompositionEnd',
      captured: 'onCompositionEndCapture'
    },
    dependencies: ['topBlur', 'topCompositionEnd', 'topKeyDown', 'topKeyPress', 'topKeyUp', 'topMouseDown']
  },
  compositionStart: {
    phasedRegistrationNames: {
      bubbled: 'onCompositionStart',
      captured: 'onCompositionStartCapture'
    },
    dependencies: ['topBlur', 'topCompositionStart', 'topKeyDown', 'topKeyPress', 'topKeyUp', 'topMouseDown']
  },
  compositionUpdate: {
    phasedRegistrationNames: {
      bubbled: 'onCompositionUpdate',
      captured: 'onCompositionUpdateCapture'
    },
    dependencies: ['topBlur', 'topCompositionUpdate', 'topKeyDown', 'topKeyPress', 'topKeyUp', 'topMouseDown']
  }
};

// Track whether we've ever handled a keypress on the space key.
var hasSpaceKeypress = false;

/**
 * Return whether a native keypress event is assumed to be a command.
 * This is required because Firefox fires `keypress` events for key commands
 * (cut, copy, select-all, etc.) even though no character is inserted.
 */
function isKeypressCommand(nativeEvent) {
  return (nativeEvent.ctrlKey || nativeEvent.altKey || nativeEvent.metaKey) &&
  // ctrlKey && altKey is equivalent to AltGr, and is not a command.
  !(nativeEvent.ctrlKey && nativeEvent.altKey);
}

/**
 * Translate native top level events into event types.
 *
 * @param {string} topLevelType
 * @return {object}
 */
function getCompositionEventType(topLevelType) {
  switch (topLevelType) {
    case 'topCompositionStart':
      return eventTypes.compositionStart;
    case 'topCompositionEnd':
      return eventTypes.compositionEnd;
    case 'topCompositionUpdate':
      return eventTypes.compositionUpdate;
  }
}

/**
 * Does our fallback best-guess model think this event signifies that
 * composition has begun?
 *
 * @param {string} topLevelType
 * @param {object} nativeEvent
 * @return {boolean}
 */
function isFallbackCompositionStart(topLevelType, nativeEvent) {
  return topLevelType === 'topKeyDown' && nativeEvent.keyCode === START_KEYCODE;
}

/**
 * Does our fallback mode think that this event is the end of composition?
 *
 * @param {string} topLevelType
 * @param {object} nativeEvent
 * @return {boolean}
 */
function isFallbackCompositionEnd(topLevelType, nativeEvent) {
  switch (topLevelType) {
    case 'topKeyUp':
      // Command keys insert or clear IME input.
      return END_KEYCODES.indexOf(nativeEvent.keyCode) !== -1;
    case 'topKeyDown':
      // Expect IME keyCode on each keydown. If we get any other
      // code we must have exited earlier.
      return nativeEvent.keyCode !== START_KEYCODE;
    case 'topKeyPress':
    case 'topMouseDown':
    case 'topBlur':
      // Events are not possible without cancelling IME.
      return true;
    default:
      return false;
  }
}

/**
 * Google Input Tools provides composition data via a CustomEvent,
 * with the `data` property populated in the `detail` object. If this
 * is available on the event object, use it. If not, this is a plain
 * composition event and we have nothing special to extract.
 *
 * @param {object} nativeEvent
 * @return {?string}
 */
function getDataFromCustomEvent(nativeEvent) {
  var detail = nativeEvent.detail;
  if (typeof detail === 'object' && 'data' in detail) {
    return detail.data;
  }
  return null;
}

// Track the current IME composition fallback object, if any.
var currentComposition = null;

/**
 * @return {?object} A SyntheticCompositionEvent.
 */
function extractCompositionEvent(topLevelType, targetInst, nativeEvent, nativeEventTarget) {
  var eventType;
  var fallbackData;

  if (canUseCompositionEvent) {
    eventType = getCompositionEventType(topLevelType);
  } else if (!currentComposition) {
    if (isFallbackCompositionStart(topLevelType, nativeEvent)) {
      eventType = eventTypes.compositionStart;
    }
  } else if (isFallbackCompositionEnd(topLevelType, nativeEvent)) {
    eventType = eventTypes.compositionEnd;
  }

  if (!eventType) {
    return null;
  }

  if (useFallbackCompositionData) {
    // The current composition is stored statically and must not be
    // overwritten while composition continues.
    if (!currentComposition && eventType === eventTypes.compositionStart) {
      currentComposition = FallbackCompositionState.getPooled(nativeEventTarget);
    } else if (eventType === eventTypes.compositionEnd) {
      if (currentComposition) {
        fallbackData = currentComposition.getData();
      }
    }
  }

  var event = SyntheticCompositionEvent.getPooled(eventType, targetInst, nativeEvent, nativeEventTarget);

  if (fallbackData) {
    // Inject data generated from fallback path into the synthetic event.
    // This matches the property of native CompositionEventInterface.
    event.data = fallbackData;
  } else {
    var customData = getDataFromCustomEvent(nativeEvent);
    if (customData !== null) {
      event.data = customData;
    }
  }

  EventPropagators.accumulateTwoPhaseDispatches(event);
  return event;
}

/**
 * @param {string} topLevelType Record from `EventConstants`.
 * @param {object} nativeEvent Native browser event.
 * @return {?string} The string corresponding to this `beforeInput` event.
 */
function getNativeBeforeInputChars(topLevelType, nativeEvent) {
  switch (topLevelType) {
    case 'topCompositionEnd':
      return getDataFromCustomEvent(nativeEvent);
    case 'topKeyPress':
      /**
       * If native `textInput` events are available, our goal is to make
       * use of them. However, there is a special case: the spacebar key.
       * In Webkit, preventing default on a spacebar `textInput` event
       * cancels character insertion, but it *also* causes the browser
       * to fall back to its default spacebar behavior of scrolling the
       * page.
       *
       * Tracking at:
       * https://code.google.com/p/chromium/issues/detail?id=355103
       *
       * To avoid this issue, use the keypress event as if no `textInput`
       * event is available.
       */
      var which = nativeEvent.which;
      if (which !== SPACEBAR_CODE) {
        return null;
      }

      hasSpaceKeypress = true;
      return SPACEBAR_CHAR;

    case 'topTextInput':
      // Record the characters to be added to the DOM.
      var chars = nativeEvent.data;

      // If it's a spacebar character, assume that we have already handled
      // it at the keypress level and bail immediately. Android Chrome
      // doesn't give us keycodes, so we need to blacklist it.
      if (chars === SPACEBAR_CHAR && hasSpaceKeypress) {
        return null;
      }

      return chars;

    default:
      // For other native event types, do nothing.
      return null;
  }
}

/**
 * For browsers that do not provide the `textInput` event, extract the
 * appropriate string to use for SyntheticInputEvent.
 *
 * @param {string} topLevelType Record from `EventConstants`.
 * @param {object} nativeEvent Native browser event.
 * @return {?string} The fallback string for this `beforeInput` event.
 */
function getFallbackBeforeInputChars(topLevelType, nativeEvent) {
  // If we are currently composing (IME) and using a fallback to do so,
  // try to extract the composed characters from the fallback object.
  // If composition event is available, we extract a string only at
  // compositionevent, otherwise extract it at fallback events.
  if (currentComposition) {
    if (topLevelType === 'topCompositionEnd' || !canUseCompositionEvent && isFallbackCompositionEnd(topLevelType, nativeEvent)) {
      var chars = currentComposition.getData();
      FallbackCompositionState.release(currentComposition);
      currentComposition = null;
      return chars;
    }
    return null;
  }

  switch (topLevelType) {
    case 'topPaste':
      // If a paste event occurs after a keypress, throw out the input
      // chars. Paste events should not lead to BeforeInput events.
      return null;
    case 'topKeyPress':
      /**
       * As of v27, Firefox may fire keypress events even when no character
       * will be inserted. A few possibilities:
       *
       * - `which` is `0`. Arrow keys, Esc key, etc.
       *
       * - `which` is the pressed key code, but no char is available.
       *   Ex: 'AltGr + d` in Polish. There is no modified character for
       *   this key combination and no character is inserted into the
       *   document, but FF fires the keypress for char code `100` anyway.
       *   No `input` event will occur.
       *
       * - `which` is the pressed key code, but a command combination is
       *   being used. Ex: `Cmd+C`. No character is inserted, and no
       *   `input` event will occur.
       */
      if (nativeEvent.which && !isKeypressCommand(nativeEvent)) {
        return String.fromCharCode(nativeEvent.which);
      }
      return null;
    case 'topCompositionEnd':
      return useFallbackCompositionData ? null : nativeEvent.data;
    default:
      return null;
  }
}

/**
 * Extract a SyntheticInputEvent for `beforeInput`, based on either native
 * `textInput` or fallback behavior.
 *
 * @return {?object} A SyntheticInputEvent.
 */
function extractBeforeInputEvent(topLevelType, targetInst, nativeEvent, nativeEventTarget) {
  var chars;

  if (canUseTextInputEvent) {
    chars = getNativeBeforeInputChars(topLevelType, nativeEvent);
  } else {
    chars = getFallbackBeforeInputChars(topLevelType, nativeEvent);
  }

  // If no characters are being inserted, no BeforeInput event should
  // be fired.
  if (!chars) {
    return null;
  }

  var event = SyntheticInputEvent.getPooled(eventTypes.beforeInput, targetInst, nativeEvent, nativeEventTarget);

  event.data = chars;
  EventPropagators.accumulateTwoPhaseDispatches(event);
  return event;
}

/**
 * Create an `onBeforeInput` event to match
 * http://www.w3.org/TR/2013/WD-DOM-Level-3-Events-20131105/#events-inputevents.
 *
 * This event plugin is based on the native `textInput` event
 * available in Chrome, Safari, Opera, and IE. This event fires after
 * `onKeyPress` and `onCompositionEnd`, but before `onInput`.
 *
 * `beforeInput` is spec'd but not implemented in any browsers, and
 * the `input` event does not provide any useful information about what has
 * actually been added, contrary to the spec. Thus, `textInput` is the best
 * available event to identify the characters that have actually been inserted
 * into the target node.
 *
 * This plugin is also responsible for emitting `composition` events, thus
 * allowing us to share composition fallback code for both `beforeInput` and
 * `composition` event types.
 */
var BeforeInputEventPlugin = {

  eventTypes: eventTypes,

  extractEvents: function (topLevelType, targetInst, nativeEvent, nativeEventTarget) {
    return [extractCompositionEvent(topLevelType, targetInst, nativeEvent, nativeEventTarget), extractBeforeInputEvent(topLevelType, targetInst, nativeEvent, nativeEventTarget)];
  }
};

module.exports = BeforeInputEventPlugin;
},{"./EventPropagators":78,"./FallbackCompositionState":79,"./SyntheticCompositionEvent":143,"./SyntheticInputEvent":147,"fbjs/lib/ExecutionEnvironment":3}],63:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

/**
 * CSS properties which accept numbers but are not in units of "px".
 */

var isUnitlessNumber = {
  animationIterationCount: true,
  borderImageOutset: true,
  borderImageSlice: true,
  borderImageWidth: true,
  boxFlex: true,
  boxFlexGroup: true,
  boxOrdinalGroup: true,
  columnCount: true,
  flex: true,
  flexGrow: true,
  flexPositive: true,
  flexShrink: true,
  flexNegative: true,
  flexOrder: true,
  gridRow: true,
  gridColumn: true,
  fontWeight: true,
  lineClamp: true,
  lineHeight: true,
  opacity: true,
  order: true,
  orphans: true,
  tabSize: true,
  widows: true,
  zIndex: true,
  zoom: true,

  // SVG-related properties
  fillOpacity: true,
  floodOpacity: true,
  stopOpacity: true,
  strokeDasharray: true,
  strokeDashoffset: true,
  strokeMiterlimit: true,
  strokeOpacity: true,
  strokeWidth: true
};

/**
 * @param {string} prefix vendor-specific prefix, eg: Webkit
 * @param {string} key style name, eg: transitionDuration
 * @return {string} style name prefixed with `prefix`, properly camelCased, eg:
 * WebkitTransitionDuration
 */
function prefixKey(prefix, key) {
  return prefix + key.charAt(0).toUpperCase() + key.substring(1);
}

/**
 * Support style names that may come passed in prefixed by adding permutations
 * of vendor prefixes.
 */
var prefixes = ['Webkit', 'ms', 'Moz', 'O'];

// Using Object.keys here, or else the vanilla for-in loop makes IE8 go into an
// infinite loop, because it iterates over the newly added props too.
Object.keys(isUnitlessNumber).forEach(function (prop) {
  prefixes.forEach(function (prefix) {
    isUnitlessNumber[prefixKey(prefix, prop)] = isUnitlessNumber[prop];
  });
});

/**
 * Most style properties can be unset by doing .style[prop] = '' but IE8
 * doesn't like doing that with shorthand properties so for the properties that
 * IE8 breaks on, which are listed here, we instead unset each of the
 * individual properties. See http://bugs.jquery.com/ticket/12385.
 * The 4-value 'clock' properties like margin, padding, border-width seem to
 * behave without any problems. Curiously, list-style works too without any
 * special prodding.
 */
var shorthandPropertyExpansions = {
  background: {
    backgroundAttachment: true,
    backgroundColor: true,
    backgroundImage: true,
    backgroundPositionX: true,
    backgroundPositionY: true,
    backgroundRepeat: true
  },
  backgroundPosition: {
    backgroundPositionX: true,
    backgroundPositionY: true
  },
  border: {
    borderWidth: true,
    borderStyle: true,
    borderColor: true
  },
  borderBottom: {
    borderBottomWidth: true,
    borderBottomStyle: true,
    borderBottomColor: true
  },
  borderLeft: {
    borderLeftWidth: true,
    borderLeftStyle: true,
    borderLeftColor: true
  },
  borderRight: {
    borderRightWidth: true,
    borderRightStyle: true,
    borderRightColor: true
  },
  borderTop: {
    borderTopWidth: true,
    borderTopStyle: true,
    borderTopColor: true
  },
  font: {
    fontStyle: true,
    fontVariant: true,
    fontWeight: true,
    fontSize: true,
    lineHeight: true,
    fontFamily: true
  },
  outline: {
    outlineWidth: true,
    outlineStyle: true,
    outlineColor: true
  }
};

var CSSProperty = {
  isUnitlessNumber: isUnitlessNumber,
  shorthandPropertyExpansions: shorthandPropertyExpansions
};

module.exports = CSSProperty;
},{}],64:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var CSSProperty = require('./CSSProperty');
var ExecutionEnvironment = require('fbjs/lib/ExecutionEnvironment');
var ReactInstrumentation = require('./ReactInstrumentation');

var camelizeStyleName = require('fbjs/lib/camelizeStyleName');
var dangerousStyleValue = require('./dangerousStyleValue');
var hyphenateStyleName = require('fbjs/lib/hyphenateStyleName');
var memoizeStringOnly = require('fbjs/lib/memoizeStringOnly');
var warning = require('fbjs/lib/warning');

var processStyleName = memoizeStringOnly(function (styleName) {
  return hyphenateStyleName(styleName);
});

var hasShorthandPropertyBug = false;
var styleFloatAccessor = 'cssFloat';
if (ExecutionEnvironment.canUseDOM) {
  var tempStyle = document.createElement('div').style;
  try {
    // IE8 throws "Invalid argument." if resetting shorthand style properties.
    tempStyle.font = '';
  } catch (e) {
    hasShorthandPropertyBug = true;
  }
  // IE8 only supports accessing cssFloat (standard) as styleFloat
  if (document.documentElement.style.cssFloat === undefined) {
    styleFloatAccessor = 'styleFloat';
  }
}

if (process.env.NODE_ENV !== 'production') {
  // 'msTransform' is correct, but the other prefixes should be capitalized
  var badVendoredStyleNamePattern = /^(?:webkit|moz|o)[A-Z]/;

  // style values shouldn't contain a semicolon
  var badStyleValueWithSemicolonPattern = /;\s*$/;

  var warnedStyleNames = {};
  var warnedStyleValues = {};
  var warnedForNaNValue = false;

  var warnHyphenatedStyleName = function (name, owner) {
    if (warnedStyleNames.hasOwnProperty(name) && warnedStyleNames[name]) {
      return;
    }

    warnedStyleNames[name] = true;
    process.env.NODE_ENV !== 'production' ? warning(false, 'Unsupported style property %s. Did you mean %s?%s', name, camelizeStyleName(name), checkRenderMessage(owner)) : void 0;
  };

  var warnBadVendoredStyleName = function (name, owner) {
    if (warnedStyleNames.hasOwnProperty(name) && warnedStyleNames[name]) {
      return;
    }

    warnedStyleNames[name] = true;
    process.env.NODE_ENV !== 'production' ? warning(false, 'Unsupported vendor-prefixed style property %s. Did you mean %s?%s', name, name.charAt(0).toUpperCase() + name.slice(1), checkRenderMessage(owner)) : void 0;
  };

  var warnStyleValueWithSemicolon = function (name, value, owner) {
    if (warnedStyleValues.hasOwnProperty(value) && warnedStyleValues[value]) {
      return;
    }

    warnedStyleValues[value] = true;
    process.env.NODE_ENV !== 'production' ? warning(false, 'Style property values shouldn\'t contain a semicolon.%s ' + 'Try "%s: %s" instead.', checkRenderMessage(owner), name, value.replace(badStyleValueWithSemicolonPattern, '')) : void 0;
  };

  var warnStyleValueIsNaN = function (name, value, owner) {
    if (warnedForNaNValue) {
      return;
    }

    warnedForNaNValue = true;
    process.env.NODE_ENV !== 'production' ? warning(false, '`NaN` is an invalid value for the `%s` css style property.%s', name, checkRenderMessage(owner)) : void 0;
  };

  var checkRenderMessage = function (owner) {
    if (owner) {
      var name = owner.getName();
      if (name) {
        return ' Check the render method of `' + name + '`.';
      }
    }
    return '';
  };

  /**
   * @param {string} name
   * @param {*} value
   * @param {ReactDOMComponent} component
   */
  var warnValidStyle = function (name, value, component) {
    var owner;
    if (component) {
      owner = component._currentElement._owner;
    }
    if (name.indexOf('-') > -1) {
      warnHyphenatedStyleName(name, owner);
    } else if (badVendoredStyleNamePattern.test(name)) {
      warnBadVendoredStyleName(name, owner);
    } else if (badStyleValueWithSemicolonPattern.test(value)) {
      warnStyleValueWithSemicolon(name, value, owner);
    }

    if (typeof value === 'number' && isNaN(value)) {
      warnStyleValueIsNaN(name, value, owner);
    }
  };
}

/**
 * Operations for dealing with CSS properties.
 */
var CSSPropertyOperations = {

  /**
   * Serializes a mapping of style properties for use as inline styles:
   *
   *   > createMarkupForStyles({width: '200px', height: 0})
   *   "width:200px;height:0;"
   *
   * Undefined values are ignored so that declarative programming is easier.
   * The result should be HTML-escaped before insertion into the DOM.
   *
   * @param {object} styles
   * @param {ReactDOMComponent} component
   * @return {?string}
   */
  createMarkupForStyles: function (styles, component) {
    var serialized = '';
    for (var styleName in styles) {
      if (!styles.hasOwnProperty(styleName)) {
        continue;
      }
      var styleValue = styles[styleName];
      if (process.env.NODE_ENV !== 'production') {
        warnValidStyle(styleName, styleValue, component);
      }
      if (styleValue != null) {
        serialized += processStyleName(styleName) + ':';
        serialized += dangerousStyleValue(styleName, styleValue, component) + ';';
      }
    }
    return serialized || null;
  },

  /**
   * Sets the value for multiple styles on a node.  If a value is specified as
   * '' (empty string), the corresponding style property will be unset.
   *
   * @param {DOMElement} node
   * @param {object} styles
   * @param {ReactDOMComponent} component
   */
  setValueForStyles: function (node, styles, component) {
    if (process.env.NODE_ENV !== 'production') {
      ReactInstrumentation.debugTool.onHostOperation({
        instanceID: component._debugID,
        type: 'update styles',
        payload: styles
      });
    }

    var style = node.style;
    for (var styleName in styles) {
      if (!styles.hasOwnProperty(styleName)) {
        continue;
      }
      if (process.env.NODE_ENV !== 'production') {
        warnValidStyle(styleName, styles[styleName], component);
      }
      var styleValue = dangerousStyleValue(styleName, styles[styleName], component);
      if (styleName === 'float' || styleName === 'cssFloat') {
        styleName = styleFloatAccessor;
      }
      if (styleValue) {
        style[styleName] = styleValue;
      } else {
        var expansion = hasShorthandPropertyBug && CSSProperty.shorthandPropertyExpansions[styleName];
        if (expansion) {
          // Shorthand property that IE8 won't like unsetting, so unset each
          // component to placate it
          for (var individualStyleName in expansion) {
            style[individualStyleName] = '';
          }
        } else {
          style[styleName] = '';
        }
      }
    }
  }

};

module.exports = CSSPropertyOperations;
}).call(this,require('_process'))
},{"./CSSProperty":63,"./ReactInstrumentation":121,"./dangerousStyleValue":160,"_process":58,"fbjs/lib/ExecutionEnvironment":3,"fbjs/lib/camelizeStyleName":5,"fbjs/lib/hyphenateStyleName":16,"fbjs/lib/memoizeStringOnly":20,"fbjs/lib/warning":24}],65:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

'use strict';

var _prodInvariant = require('./reactProdInvariant');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PooledClass = require('./PooledClass');

var invariant = require('fbjs/lib/invariant');

/**
 * A specialized pseudo-event module to help keep track of components waiting to
 * be notified when their DOM representations are available for use.
 *
 * This implements `PooledClass`, so you should never need to instantiate this.
 * Instead, use `CallbackQueue.getPooled()`.
 *
 * @class ReactMountReady
 * @implements PooledClass
 * @internal
 */

var CallbackQueue = function () {
  function CallbackQueue(arg) {
    _classCallCheck(this, CallbackQueue);

    this._callbacks = null;
    this._contexts = null;
    this._arg = arg;
  }

  /**
   * Enqueues a callback to be invoked when `notifyAll` is invoked.
   *
   * @param {function} callback Invoked when `notifyAll` is invoked.
   * @param {?object} context Context to call `callback` with.
   * @internal
   */


  CallbackQueue.prototype.enqueue = function enqueue(callback, context) {
    this._callbacks = this._callbacks || [];
    this._callbacks.push(callback);
    this._contexts = this._contexts || [];
    this._contexts.push(context);
  };

  /**
   * Invokes all enqueued callbacks and clears the queue. This is invoked after
   * the DOM representation of a component has been created or updated.
   *
   * @internal
   */


  CallbackQueue.prototype.notifyAll = function notifyAll() {
    var callbacks = this._callbacks;
    var contexts = this._contexts;
    var arg = this._arg;
    if (callbacks && contexts) {
      !(callbacks.length === contexts.length) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Mismatched list of contexts in callback queue') : _prodInvariant('24') : void 0;
      this._callbacks = null;
      this._contexts = null;
      for (var i = 0; i < callbacks.length; i++) {
        callbacks[i].call(contexts[i], arg);
      }
      callbacks.length = 0;
      contexts.length = 0;
    }
  };

  CallbackQueue.prototype.checkpoint = function checkpoint() {
    return this._callbacks ? this._callbacks.length : 0;
  };

  CallbackQueue.prototype.rollback = function rollback(len) {
    if (this._callbacks && this._contexts) {
      this._callbacks.length = len;
      this._contexts.length = len;
    }
  };

  /**
   * Resets the internal queue.
   *
   * @internal
   */


  CallbackQueue.prototype.reset = function reset() {
    this._callbacks = null;
    this._contexts = null;
  };

  /**
   * `PooledClass` looks for this.
   */


  CallbackQueue.prototype.destructor = function destructor() {
    this.reset();
  };

  return CallbackQueue;
}();

module.exports = PooledClass.addPoolingTo(CallbackQueue);
}).call(this,require('_process'))
},{"./PooledClass":83,"./reactProdInvariant":179,"_process":58,"fbjs/lib/invariant":17}],66:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var EventPluginHub = require('./EventPluginHub');
var EventPropagators = require('./EventPropagators');
var ExecutionEnvironment = require('fbjs/lib/ExecutionEnvironment');
var ReactDOMComponentTree = require('./ReactDOMComponentTree');
var ReactUpdates = require('./ReactUpdates');
var SyntheticEvent = require('./SyntheticEvent');

var getEventTarget = require('./getEventTarget');
var isEventSupported = require('./isEventSupported');
var isTextInputElement = require('./isTextInputElement');

var eventTypes = {
  change: {
    phasedRegistrationNames: {
      bubbled: 'onChange',
      captured: 'onChangeCapture'
    },
    dependencies: ['topBlur', 'topChange', 'topClick', 'topFocus', 'topInput', 'topKeyDown', 'topKeyUp', 'topSelectionChange']
  }
};

/**
 * For IE shims
 */
var activeElement = null;
var activeElementInst = null;
var activeElementValue = null;
var activeElementValueProp = null;

/**
 * SECTION: handle `change` event
 */
function shouldUseChangeEvent(elem) {
  var nodeName = elem.nodeName && elem.nodeName.toLowerCase();
  return nodeName === 'select' || nodeName === 'input' && elem.type === 'file';
}

var doesChangeEventBubble = false;
if (ExecutionEnvironment.canUseDOM) {
  // See `handleChange` comment below
  doesChangeEventBubble = isEventSupported('change') && (!document.documentMode || document.documentMode > 8);
}

function manualDispatchChangeEvent(nativeEvent) {
  var event = SyntheticEvent.getPooled(eventTypes.change, activeElementInst, nativeEvent, getEventTarget(nativeEvent));
  EventPropagators.accumulateTwoPhaseDispatches(event);

  // If change and propertychange bubbled, we'd just bind to it like all the
  // other events and have it go through ReactBrowserEventEmitter. Since it
  // doesn't, we manually listen for the events and so we have to enqueue and
  // process the abstract event manually.
  //
  // Batching is necessary here in order to ensure that all event handlers run
  // before the next rerender (including event handlers attached to ancestor
  // elements instead of directly on the input). Without this, controlled
  // components don't work properly in conjunction with event bubbling because
  // the component is rerendered and the value reverted before all the event
  // handlers can run. See https://github.com/facebook/react/issues/708.
  ReactUpdates.batchedUpdates(runEventInBatch, event);
}

function runEventInBatch(event) {
  EventPluginHub.enqueueEvents(event);
  EventPluginHub.processEventQueue(false);
}

function startWatchingForChangeEventIE8(target, targetInst) {
  activeElement = target;
  activeElementInst = targetInst;
  activeElement.attachEvent('onchange', manualDispatchChangeEvent);
}

function stopWatchingForChangeEventIE8() {
  if (!activeElement) {
    return;
  }
  activeElement.detachEvent('onchange', manualDispatchChangeEvent);
  activeElement = null;
  activeElementInst = null;
}

function getTargetInstForChangeEvent(topLevelType, targetInst) {
  if (topLevelType === 'topChange') {
    return targetInst;
  }
}
function handleEventsForChangeEventIE8(topLevelType, target, targetInst) {
  if (topLevelType === 'topFocus') {
    // stopWatching() should be a noop here but we call it just in case we
    // missed a blur event somehow.
    stopWatchingForChangeEventIE8();
    startWatchingForChangeEventIE8(target, targetInst);
  } else if (topLevelType === 'topBlur') {
    stopWatchingForChangeEventIE8();
  }
}

/**
 * SECTION: handle `input` event
 */
var isInputEventSupported = false;
if (ExecutionEnvironment.canUseDOM) {
  // IE9 claims to support the input event but fails to trigger it when
  // deleting text, so we ignore its input events.
  // IE10+ fire input events to often, such when a placeholder
  // changes or when an input with a placeholder is focused.
  isInputEventSupported = isEventSupported('input') && (!document.documentMode || document.documentMode > 11);
}

/**
 * (For IE <=11) Replacement getter/setter for the `value` property that gets
 * set on the active element.
 */
var newValueProp = {
  get: function () {
    return activeElementValueProp.get.call(this);
  },
  set: function (val) {
    // Cast to a string so we can do equality checks.
    activeElementValue = '' + val;
    activeElementValueProp.set.call(this, val);
  }
};

/**
 * (For IE <=11) Starts tracking propertychange events on the passed-in element
 * and override the value property so that we can distinguish user events from
 * value changes in JS.
 */
function startWatchingForValueChange(target, targetInst) {
  activeElement = target;
  activeElementInst = targetInst;
  activeElementValue = target.value;
  activeElementValueProp = Object.getOwnPropertyDescriptor(target.constructor.prototype, 'value');

  // Not guarded in a canDefineProperty check: IE8 supports defineProperty only
  // on DOM elements
  Object.defineProperty(activeElement, 'value', newValueProp);
  if (activeElement.attachEvent) {
    activeElement.attachEvent('onpropertychange', handlePropertyChange);
  } else {
    activeElement.addEventListener('propertychange', handlePropertyChange, false);
  }
}

/**
 * (For IE <=11) Removes the event listeners from the currently-tracked element,
 * if any exists.
 */
function stopWatchingForValueChange() {
  if (!activeElement) {
    return;
  }

  // delete restores the original property definition
  delete activeElement.value;

  if (activeElement.detachEvent) {
    activeElement.detachEvent('onpropertychange', handlePropertyChange);
  } else {
    activeElement.removeEventListener('propertychange', handlePropertyChange, false);
  }

  activeElement = null;
  activeElementInst = null;
  activeElementValue = null;
  activeElementValueProp = null;
}

/**
 * (For IE <=11) Handles a propertychange event, sending a `change` event if
 * the value of the active element has changed.
 */
function handlePropertyChange(nativeEvent) {
  if (nativeEvent.propertyName !== 'value') {
    return;
  }
  var value = nativeEvent.srcElement.value;
  if (value === activeElementValue) {
    return;
  }
  activeElementValue = value;

  manualDispatchChangeEvent(nativeEvent);
}

/**
 * If a `change` event should be fired, returns the target's ID.
 */
function getTargetInstForInputEvent(topLevelType, targetInst) {
  if (topLevelType === 'topInput') {
    // In modern browsers (i.e., not IE8 or IE9), the input event is exactly
    // what we want so fall through here and trigger an abstract event
    return targetInst;
  }
}

function handleEventsForInputEventIE(topLevelType, target, targetInst) {
  if (topLevelType === 'topFocus') {
    // In IE8, we can capture almost all .value changes by adding a
    // propertychange handler and looking for events with propertyName
    // equal to 'value'
    // In IE9-11, propertychange fires for most input events but is buggy and
    // doesn't fire when text is deleted, but conveniently, selectionchange
    // appears to fire in all of the remaining cases so we catch those and
    // forward the event if the value has changed
    // In either case, we don't want to call the event handler if the value
    // is changed from JS so we redefine a setter for `.value` that updates
    // our activeElementValue variable, allowing us to ignore those changes
    //
    // stopWatching() should be a noop here but we call it just in case we
    // missed a blur event somehow.
    stopWatchingForValueChange();
    startWatchingForValueChange(target, targetInst);
  } else if (topLevelType === 'topBlur') {
    stopWatchingForValueChange();
  }
}

// For IE8 and IE9.
function getTargetInstForInputEventIE(topLevelType, targetInst) {
  if (topLevelType === 'topSelectionChange' || topLevelType === 'topKeyUp' || topLevelType === 'topKeyDown') {
    // On the selectionchange event, the target is just document which isn't
    // helpful for us so just check activeElement instead.
    //
    // 99% of the time, keydown and keyup aren't necessary. IE8 fails to fire
    // propertychange on the first input event after setting `value` from a
    // script and fires only keydown, keypress, keyup. Catching keyup usually
    // gets it and catching keydown lets us fire an event for the first
    // keystroke if user does a key repeat (it'll be a little delayed: right
    // before the second keystroke). Other input methods (e.g., paste) seem to
    // fire selectionchange normally.
    if (activeElement && activeElement.value !== activeElementValue) {
      activeElementValue = activeElement.value;
      return activeElementInst;
    }
  }
}

/**
 * SECTION: handle `click` event
 */
function shouldUseClickEvent(elem) {
  // Use the `click` event to detect changes to checkbox and radio inputs.
  // This approach works across all browsers, whereas `change` does not fire
  // until `blur` in IE8.
  return elem.nodeName && elem.nodeName.toLowerCase() === 'input' && (elem.type === 'checkbox' || elem.type === 'radio');
}

function getTargetInstForClickEvent(topLevelType, targetInst) {
  if (topLevelType === 'topClick') {
    return targetInst;
  }
}

/**
 * This plugin creates an `onChange` event that normalizes change events
 * across form elements. This event fires at a time when it's possible to
 * change the element's value without seeing a flicker.
 *
 * Supported elements are:
 * - input (see `isTextInputElement`)
 * - textarea
 * - select
 */
var ChangeEventPlugin = {

  eventTypes: eventTypes,

  extractEvents: function (topLevelType, targetInst, nativeEvent, nativeEventTarget) {
    var targetNode = targetInst ? ReactDOMComponentTree.getNodeFromInstance(targetInst) : window;

    var getTargetInstFunc, handleEventFunc;
    if (shouldUseChangeEvent(targetNode)) {
      if (doesChangeEventBubble) {
        getTargetInstFunc = getTargetInstForChangeEvent;
      } else {
        handleEventFunc = handleEventsForChangeEventIE8;
      }
    } else if (isTextInputElement(targetNode)) {
      if (isInputEventSupported) {
        getTargetInstFunc = getTargetInstForInputEvent;
      } else {
        getTargetInstFunc = getTargetInstForInputEventIE;
        handleEventFunc = handleEventsForInputEventIE;
      }
    } else if (shouldUseClickEvent(targetNode)) {
      getTargetInstFunc = getTargetInstForClickEvent;
    }

    if (getTargetInstFunc) {
      var inst = getTargetInstFunc(topLevelType, targetInst);
      if (inst) {
        var event = SyntheticEvent.getPooled(eventTypes.change, inst, nativeEvent, nativeEventTarget);
        event.type = 'change';
        EventPropagators.accumulateTwoPhaseDispatches(event);
        return event;
      }
    }

    if (handleEventFunc) {
      handleEventFunc(topLevelType, targetNode, targetInst);
    }
  }

};

module.exports = ChangeEventPlugin;
},{"./EventPluginHub":75,"./EventPropagators":78,"./ReactDOMComponentTree":92,"./ReactUpdates":136,"./SyntheticEvent":145,"./getEventTarget":168,"./isEventSupported":176,"./isTextInputElement":177,"fbjs/lib/ExecutionEnvironment":3}],67:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var DOMLazyTree = require('./DOMLazyTree');
var Danger = require('./Danger');
var ReactDOMComponentTree = require('./ReactDOMComponentTree');
var ReactInstrumentation = require('./ReactInstrumentation');

var createMicrosoftUnsafeLocalFunction = require('./createMicrosoftUnsafeLocalFunction');
var setInnerHTML = require('./setInnerHTML');
var setTextContent = require('./setTextContent');

function getNodeAfter(parentNode, node) {
  // Special case for text components, which return [open, close] comments
  // from getHostNode.
  if (Array.isArray(node)) {
    node = node[1];
  }
  return node ? node.nextSibling : parentNode.firstChild;
}

/**
 * Inserts `childNode` as a child of `parentNode` at the `index`.
 *
 * @param {DOMElement} parentNode Parent node in which to insert.
 * @param {DOMElement} childNode Child node to insert.
 * @param {number} index Index at which to insert the child.
 * @internal
 */
var insertChildAt = createMicrosoftUnsafeLocalFunction(function (parentNode, childNode, referenceNode) {
  // We rely exclusively on `insertBefore(node, null)` instead of also using
  // `appendChild(node)`. (Using `undefined` is not allowed by all browsers so
  // we are careful to use `null`.)
  parentNode.insertBefore(childNode, referenceNode);
});

function insertLazyTreeChildAt(parentNode, childTree, referenceNode) {
  DOMLazyTree.insertTreeBefore(parentNode, childTree, referenceNode);
}

function moveChild(parentNode, childNode, referenceNode) {
  if (Array.isArray(childNode)) {
    moveDelimitedText(parentNode, childNode[0], childNode[1], referenceNode);
  } else {
    insertChildAt(parentNode, childNode, referenceNode);
  }
}

function removeChild(parentNode, childNode) {
  if (Array.isArray(childNode)) {
    var closingComment = childNode[1];
    childNode = childNode[0];
    removeDelimitedText(parentNode, childNode, closingComment);
    parentNode.removeChild(closingComment);
  }
  parentNode.removeChild(childNode);
}

function moveDelimitedText(parentNode, openingComment, closingComment, referenceNode) {
  var node = openingComment;
  while (true) {
    var nextNode = node.nextSibling;
    insertChildAt(parentNode, node, referenceNode);
    if (node === closingComment) {
      break;
    }
    node = nextNode;
  }
}

function removeDelimitedText(parentNode, startNode, closingComment) {
  while (true) {
    var node = startNode.nextSibling;
    if (node === closingComment) {
      // The closing comment is removed by ReactMultiChild.
      break;
    } else {
      parentNode.removeChild(node);
    }
  }
}

function replaceDelimitedText(openingComment, closingComment, stringText) {
  var parentNode = openingComment.parentNode;
  var nodeAfterComment = openingComment.nextSibling;
  if (nodeAfterComment === closingComment) {
    // There are no text nodes between the opening and closing comments; insert
    // a new one if stringText isn't empty.
    if (stringText) {
      insertChildAt(parentNode, document.createTextNode(stringText), nodeAfterComment);
    }
  } else {
    if (stringText) {
      // Set the text content of the first node after the opening comment, and
      // remove all following nodes up until the closing comment.
      setTextContent(nodeAfterComment, stringText);
      removeDelimitedText(parentNode, nodeAfterComment, closingComment);
    } else {
      removeDelimitedText(parentNode, openingComment, closingComment);
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    ReactInstrumentation.debugTool.onHostOperation({
      instanceID: ReactDOMComponentTree.getInstanceFromNode(openingComment)._debugID,
      type: 'replace text',
      payload: stringText
    });
  }
}

var dangerouslyReplaceNodeWithMarkup = Danger.dangerouslyReplaceNodeWithMarkup;
if (process.env.NODE_ENV !== 'production') {
  dangerouslyReplaceNodeWithMarkup = function (oldChild, markup, prevInstance) {
    Danger.dangerouslyReplaceNodeWithMarkup(oldChild, markup);
    if (prevInstance._debugID !== 0) {
      ReactInstrumentation.debugTool.onHostOperation({
        instanceID: prevInstance._debugID,
        type: 'replace with',
        payload: markup.toString()
      });
    } else {
      var nextInstance = ReactDOMComponentTree.getInstanceFromNode(markup.node);
      if (nextInstance._debugID !== 0) {
        ReactInstrumentation.debugTool.onHostOperation({
          instanceID: nextInstance._debugID,
          type: 'mount',
          payload: markup.toString()
        });
      }
    }
  };
}

/**
 * Operations for updating with DOM children.
 */
var DOMChildrenOperations = {

  dangerouslyReplaceNodeWithMarkup: dangerouslyReplaceNodeWithMarkup,

  replaceDelimitedText: replaceDelimitedText,

  /**
   * Updates a component's children by processing a series of updates. The
   * update configurations are each expected to have a `parentNode` property.
   *
   * @param {array<object>} updates List of update configurations.
   * @internal
   */
  processUpdates: function (parentNode, updates) {
    if (process.env.NODE_ENV !== 'production') {
      var parentNodeDebugID = ReactDOMComponentTree.getInstanceFromNode(parentNode)._debugID;
    }

    for (var k = 0; k < updates.length; k++) {
      var update = updates[k];
      switch (update.type) {
        case 'INSERT_MARKUP':
          insertLazyTreeChildAt(parentNode, update.content, getNodeAfter(parentNode, update.afterNode));
          if (process.env.NODE_ENV !== 'production') {
            ReactInstrumentation.debugTool.onHostOperation({
              instanceID: parentNodeDebugID,
              type: 'insert child',
              payload: { toIndex: update.toIndex, content: update.content.toString() }
            });
          }
          break;
        case 'MOVE_EXISTING':
          moveChild(parentNode, update.fromNode, getNodeAfter(parentNode, update.afterNode));
          if (process.env.NODE_ENV !== 'production') {
            ReactInstrumentation.debugTool.onHostOperation({
              instanceID: parentNodeDebugID,
              type: 'move child',
              payload: { fromIndex: update.fromIndex, toIndex: update.toIndex }
            });
          }
          break;
        case 'SET_MARKUP':
          setInnerHTML(parentNode, update.content);
          if (process.env.NODE_ENV !== 'production') {
            ReactInstrumentation.debugTool.onHostOperation({
              instanceID: parentNodeDebugID,
              type: 'replace children',
              payload: update.content.toString()
            });
          }
          break;
        case 'TEXT_CONTENT':
          setTextContent(parentNode, update.content);
          if (process.env.NODE_ENV !== 'production') {
            ReactInstrumentation.debugTool.onHostOperation({
              instanceID: parentNodeDebugID,
              type: 'replace text',
              payload: update.content.toString()
            });
          }
          break;
        case 'REMOVE_NODE':
          removeChild(parentNode, update.fromNode);
          if (process.env.NODE_ENV !== 'production') {
            ReactInstrumentation.debugTool.onHostOperation({
              instanceID: parentNodeDebugID,
              type: 'remove child',
              payload: { fromIndex: update.fromIndex }
            });
          }
          break;
      }
    }
  }

};

module.exports = DOMChildrenOperations;
}).call(this,require('_process'))
},{"./DOMLazyTree":68,"./Danger":72,"./ReactDOMComponentTree":92,"./ReactInstrumentation":121,"./createMicrosoftUnsafeLocalFunction":159,"./setInnerHTML":181,"./setTextContent":182,"_process":58}],68:[function(require,module,exports){
/**
 * Copyright 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var DOMNamespaces = require('./DOMNamespaces');
var setInnerHTML = require('./setInnerHTML');

var createMicrosoftUnsafeLocalFunction = require('./createMicrosoftUnsafeLocalFunction');
var setTextContent = require('./setTextContent');

var ELEMENT_NODE_TYPE = 1;
var DOCUMENT_FRAGMENT_NODE_TYPE = 11;

/**
 * In IE (8-11) and Edge, appending nodes with no children is dramatically
 * faster than appending a full subtree, so we essentially queue up the
 * .appendChild calls here and apply them so each node is added to its parent
 * before any children are added.
 *
 * In other browsers, doing so is slower or neutral compared to the other order
 * (in Firefox, twice as slow) so we only do this inversion in IE.
 *
 * See https://github.com/spicyj/innerhtml-vs-createelement-vs-clonenode.
 */
var enableLazy = typeof document !== 'undefined' && typeof document.documentMode === 'number' || typeof navigator !== 'undefined' && typeof navigator.userAgent === 'string' && /\bEdge\/\d/.test(navigator.userAgent);

function insertTreeChildren(tree) {
  if (!enableLazy) {
    return;
  }
  var node = tree.node;
  var children = tree.children;
  if (children.length) {
    for (var i = 0; i < children.length; i++) {
      insertTreeBefore(node, children[i], null);
    }
  } else if (tree.html != null) {
    setInnerHTML(node, tree.html);
  } else if (tree.text != null) {
    setTextContent(node, tree.text);
  }
}

var insertTreeBefore = createMicrosoftUnsafeLocalFunction(function (parentNode, tree, referenceNode) {
  // DocumentFragments aren't actually part of the DOM after insertion so
  // appending children won't update the DOM. We need to ensure the fragment
  // is properly populated first, breaking out of our lazy approach for just
  // this level. Also, some <object> plugins (like Flash Player) will read
  // <param> nodes immediately upon insertion into the DOM, so <object>
  // must also be populated prior to insertion into the DOM.
  if (tree.node.nodeType === DOCUMENT_FRAGMENT_NODE_TYPE || tree.node.nodeType === ELEMENT_NODE_TYPE && tree.node.nodeName.toLowerCase() === 'object' && (tree.node.namespaceURI == null || tree.node.namespaceURI === DOMNamespaces.html)) {
    insertTreeChildren(tree);
    parentNode.insertBefore(tree.node, referenceNode);
  } else {
    parentNode.insertBefore(tree.node, referenceNode);
    insertTreeChildren(tree);
  }
});

function replaceChildWithTree(oldNode, newTree) {
  oldNode.parentNode.replaceChild(newTree.node, oldNode);
  insertTreeChildren(newTree);
}

function queueChild(parentTree, childTree) {
  if (enableLazy) {
    parentTree.children.push(childTree);
  } else {
    parentTree.node.appendChild(childTree.node);
  }
}

function queueHTML(tree, html) {
  if (enableLazy) {
    tree.html = html;
  } else {
    setInnerHTML(tree.node, html);
  }
}

function queueText(tree, text) {
  if (enableLazy) {
    tree.text = text;
  } else {
    setTextContent(tree.node, text);
  }
}

function toString() {
  return this.node.nodeName;
}

function DOMLazyTree(node) {
  return {
    node: node,
    children: [],
    html: null,
    text: null,
    toString: toString
  };
}

DOMLazyTree.insertTreeBefore = insertTreeBefore;
DOMLazyTree.replaceChildWithTree = replaceChildWithTree;
DOMLazyTree.queueChild = queueChild;
DOMLazyTree.queueHTML = queueHTML;
DOMLazyTree.queueText = queueText;

module.exports = DOMLazyTree;
},{"./DOMNamespaces":69,"./createMicrosoftUnsafeLocalFunction":159,"./setInnerHTML":181,"./setTextContent":182}],69:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var DOMNamespaces = {
  html: 'http://www.w3.org/1999/xhtml',
  mathml: 'http://www.w3.org/1998/Math/MathML',
  svg: 'http://www.w3.org/2000/svg'
};

module.exports = DOMNamespaces;
},{}],70:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var _prodInvariant = require('./reactProdInvariant');

var invariant = require('fbjs/lib/invariant');

function checkMask(value, bitmask) {
  return (value & bitmask) === bitmask;
}

var DOMPropertyInjection = {
  /**
   * Mapping from normalized, camelcased property names to a configuration that
   * specifies how the associated DOM property should be accessed or rendered.
   */
  MUST_USE_PROPERTY: 0x1,
  HAS_BOOLEAN_VALUE: 0x4,
  HAS_NUMERIC_VALUE: 0x8,
  HAS_POSITIVE_NUMERIC_VALUE: 0x10 | 0x8,
  HAS_OVERLOADED_BOOLEAN_VALUE: 0x20,

  /**
   * Inject some specialized knowledge about the DOM. This takes a config object
   * with the following properties:
   *
   * isCustomAttribute: function that given an attribute name will return true
   * if it can be inserted into the DOM verbatim. Useful for data-* or aria-*
   * attributes where it's impossible to enumerate all of the possible
   * attribute names,
   *
   * Properties: object mapping DOM property name to one of the
   * DOMPropertyInjection constants or null. If your attribute isn't in here,
   * it won't get written to the DOM.
   *
   * DOMAttributeNames: object mapping React attribute name to the DOM
   * attribute name. Attribute names not specified use the **lowercase**
   * normalized name.
   *
   * DOMAttributeNamespaces: object mapping React attribute name to the DOM
   * attribute namespace URL. (Attribute names not specified use no namespace.)
   *
   * DOMPropertyNames: similar to DOMAttributeNames but for DOM properties.
   * Property names not specified use the normalized name.
   *
   * DOMMutationMethods: Properties that require special mutation methods. If
   * `value` is undefined, the mutation method should unset the property.
   *
   * @param {object} domPropertyConfig the config as described above.
   */
  injectDOMPropertyConfig: function (domPropertyConfig) {
    var Injection = DOMPropertyInjection;
    var Properties = domPropertyConfig.Properties || {};
    var DOMAttributeNamespaces = domPropertyConfig.DOMAttributeNamespaces || {};
    var DOMAttributeNames = domPropertyConfig.DOMAttributeNames || {};
    var DOMPropertyNames = domPropertyConfig.DOMPropertyNames || {};
    var DOMMutationMethods = domPropertyConfig.DOMMutationMethods || {};

    if (domPropertyConfig.isCustomAttribute) {
      DOMProperty._isCustomAttributeFunctions.push(domPropertyConfig.isCustomAttribute);
    }

    for (var propName in Properties) {
      !!DOMProperty.properties.hasOwnProperty(propName) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'injectDOMPropertyConfig(...): You\'re trying to inject DOM property \'%s\' which has already been injected. You may be accidentally injecting the same DOM property config twice, or you may be injecting two configs that have conflicting property names.', propName) : _prodInvariant('48', propName) : void 0;

      var lowerCased = propName.toLowerCase();
      var propConfig = Properties[propName];

      var propertyInfo = {
        attributeName: lowerCased,
        attributeNamespace: null,
        propertyName: propName,
        mutationMethod: null,

        mustUseProperty: checkMask(propConfig, Injection.MUST_USE_PROPERTY),
        hasBooleanValue: checkMask(propConfig, Injection.HAS_BOOLEAN_VALUE),
        hasNumericValue: checkMask(propConfig, Injection.HAS_NUMERIC_VALUE),
        hasPositiveNumericValue: checkMask(propConfig, Injection.HAS_POSITIVE_NUMERIC_VALUE),
        hasOverloadedBooleanValue: checkMask(propConfig, Injection.HAS_OVERLOADED_BOOLEAN_VALUE)
      };
      !(propertyInfo.hasBooleanValue + propertyInfo.hasNumericValue + propertyInfo.hasOverloadedBooleanValue <= 1) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'DOMProperty: Value can be one of boolean, overloaded boolean, or numeric value, but not a combination: %s', propName) : _prodInvariant('50', propName) : void 0;

      if (process.env.NODE_ENV !== 'production') {
        DOMProperty.getPossibleStandardName[lowerCased] = propName;
      }

      if (DOMAttributeNames.hasOwnProperty(propName)) {
        var attributeName = DOMAttributeNames[propName];
        propertyInfo.attributeName = attributeName;
        if (process.env.NODE_ENV !== 'production') {
          DOMProperty.getPossibleStandardName[attributeName] = propName;
        }
      }

      if (DOMAttributeNamespaces.hasOwnProperty(propName)) {
        propertyInfo.attributeNamespace = DOMAttributeNamespaces[propName];
      }

      if (DOMPropertyNames.hasOwnProperty(propName)) {
        propertyInfo.propertyName = DOMPropertyNames[propName];
      }

      if (DOMMutationMethods.hasOwnProperty(propName)) {
        propertyInfo.mutationMethod = DOMMutationMethods[propName];
      }

      DOMProperty.properties[propName] = propertyInfo;
    }
  }
};

/* eslint-disable max-len */
var ATTRIBUTE_NAME_START_CHAR = ':A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD';
/* eslint-enable max-len */

/**
 * DOMProperty exports lookup objects that can be used like functions:
 *
 *   > DOMProperty.isValid['id']
 *   true
 *   > DOMProperty.isValid['foobar']
 *   undefined
 *
 * Although this may be confusing, it performs better in general.
 *
 * @see http://jsperf.com/key-exists
 * @see http://jsperf.com/key-missing
 */
var DOMProperty = {

  ID_ATTRIBUTE_NAME: 'data-reactid',
  ROOT_ATTRIBUTE_NAME: 'data-reactroot',

  ATTRIBUTE_NAME_START_CHAR: ATTRIBUTE_NAME_START_CHAR,
  ATTRIBUTE_NAME_CHAR: ATTRIBUTE_NAME_START_CHAR + '\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040',

  /**
   * Map from property "standard name" to an object with info about how to set
   * the property in the DOM. Each object contains:
   *
   * attributeName:
   *   Used when rendering markup or with `*Attribute()`.
   * attributeNamespace
   * propertyName:
   *   Used on DOM node instances. (This includes properties that mutate due to
   *   external factors.)
   * mutationMethod:
   *   If non-null, used instead of the property or `setAttribute()` after
   *   initial render.
   * mustUseProperty:
   *   Whether the property must be accessed and mutated as an object property.
   * hasBooleanValue:
   *   Whether the property should be removed when set to a falsey value.
   * hasNumericValue:
   *   Whether the property must be numeric or parse as a numeric and should be
   *   removed when set to a falsey value.
   * hasPositiveNumericValue:
   *   Whether the property must be positive numeric or parse as a positive
   *   numeric and should be removed when set to a falsey value.
   * hasOverloadedBooleanValue:
   *   Whether the property can be used as a flag as well as with a value.
   *   Removed when strictly equal to false; present without a value when
   *   strictly equal to true; present with a value otherwise.
   */
  properties: {},

  /**
   * Mapping from lowercase property names to the properly cased version, used
   * to warn in the case of missing properties. Available only in __DEV__.
   *
   * autofocus is predefined, because adding it to the property whitelist
   * causes unintended side effects.
   *
   * @type {Object}
   */
  getPossibleStandardName: process.env.NODE_ENV !== 'production' ? { autofocus: 'autoFocus' } : null,

  /**
   * All of the isCustomAttribute() functions that have been injected.
   */
  _isCustomAttributeFunctions: [],

  /**
   * Checks whether a property name is a custom attribute.
   * @method
   */
  isCustomAttribute: function (attributeName) {
    for (var i = 0; i < DOMProperty._isCustomAttributeFunctions.length; i++) {
      var isCustomAttributeFn = DOMProperty._isCustomAttributeFunctions[i];
      if (isCustomAttributeFn(attributeName)) {
        return true;
      }
    }
    return false;
  },

  injection: DOMPropertyInjection
};

module.exports = DOMProperty;
}).call(this,require('_process'))
},{"./reactProdInvariant":179,"_process":58,"fbjs/lib/invariant":17}],71:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var DOMProperty = require('./DOMProperty');
var ReactDOMComponentTree = require('./ReactDOMComponentTree');
var ReactInstrumentation = require('./ReactInstrumentation');

var quoteAttributeValueForBrowser = require('./quoteAttributeValueForBrowser');
var warning = require('fbjs/lib/warning');

var VALID_ATTRIBUTE_NAME_REGEX = new RegExp('^[' + DOMProperty.ATTRIBUTE_NAME_START_CHAR + '][' + DOMProperty.ATTRIBUTE_NAME_CHAR + ']*$');
var illegalAttributeNameCache = {};
var validatedAttributeNameCache = {};

function isAttributeNameSafe(attributeName) {
  if (validatedAttributeNameCache.hasOwnProperty(attributeName)) {
    return true;
  }
  if (illegalAttributeNameCache.hasOwnProperty(attributeName)) {
    return false;
  }
  if (VALID_ATTRIBUTE_NAME_REGEX.test(attributeName)) {
    validatedAttributeNameCache[attributeName] = true;
    return true;
  }
  illegalAttributeNameCache[attributeName] = true;
  process.env.NODE_ENV !== 'production' ? warning(false, 'Invalid attribute name: `%s`', attributeName) : void 0;
  return false;
}

function shouldIgnoreValue(propertyInfo, value) {
  return value == null || propertyInfo.hasBooleanValue && !value || propertyInfo.hasNumericValue && isNaN(value) || propertyInfo.hasPositiveNumericValue && value < 1 || propertyInfo.hasOverloadedBooleanValue && value === false;
}

/**
 * Operations for dealing with DOM properties.
 */
var DOMPropertyOperations = {

  /**
   * Creates markup for the ID property.
   *
   * @param {string} id Unescaped ID.
   * @return {string} Markup string.
   */
  createMarkupForID: function (id) {
    return DOMProperty.ID_ATTRIBUTE_NAME + '=' + quoteAttributeValueForBrowser(id);
  },

  setAttributeForID: function (node, id) {
    node.setAttribute(DOMProperty.ID_ATTRIBUTE_NAME, id);
  },

  createMarkupForRoot: function () {
    return DOMProperty.ROOT_ATTRIBUTE_NAME + '=""';
  },

  setAttributeForRoot: function (node) {
    node.setAttribute(DOMProperty.ROOT_ATTRIBUTE_NAME, '');
  },

  /**
   * Creates markup for a property.
   *
   * @param {string} name
   * @param {*} value
   * @return {?string} Markup string, or null if the property was invalid.
   */
  createMarkupForProperty: function (name, value) {
    var propertyInfo = DOMProperty.properties.hasOwnProperty(name) ? DOMProperty.properties[name] : null;
    if (propertyInfo) {
      if (shouldIgnoreValue(propertyInfo, value)) {
        return '';
      }
      var attributeName = propertyInfo.attributeName;
      if (propertyInfo.hasBooleanValue || propertyInfo.hasOverloadedBooleanValue && value === true) {
        return attributeName + '=""';
      }
      return attributeName + '=' + quoteAttributeValueForBrowser(value);
    } else if (DOMProperty.isCustomAttribute(name)) {
      if (value == null) {
        return '';
      }
      return name + '=' + quoteAttributeValueForBrowser(value);
    }
    return null;
  },

  /**
   * Creates markup for a custom property.
   *
   * @param {string} name
   * @param {*} value
   * @return {string} Markup string, or empty string if the property was invalid.
   */
  createMarkupForCustomAttribute: function (name, value) {
    if (!isAttributeNameSafe(name) || value == null) {
      return '';
    }
    return name + '=' + quoteAttributeValueForBrowser(value);
  },

  /**
   * Sets the value for a property on a node.
   *
   * @param {DOMElement} node
   * @param {string} name
   * @param {*} value
   */
  setValueForProperty: function (node, name, value) {
    var propertyInfo = DOMProperty.properties.hasOwnProperty(name) ? DOMProperty.properties[name] : null;
    if (propertyInfo) {
      var mutationMethod = propertyInfo.mutationMethod;
      if (mutationMethod) {
        mutationMethod(node, value);
      } else if (shouldIgnoreValue(propertyInfo, value)) {
        this.deleteValueForProperty(node, name);
        return;
      } else if (propertyInfo.mustUseProperty) {
        // Contrary to `setAttribute`, object properties are properly
        // `toString`ed by IE8/9.
        node[propertyInfo.propertyName] = value;
      } else {
        var attributeName = propertyInfo.attributeName;
        var namespace = propertyInfo.attributeNamespace;
        // `setAttribute` with objects becomes only `[object]` in IE8/9,
        // ('' + value) makes it output the correct toString()-value.
        if (namespace) {
          node.setAttributeNS(namespace, attributeName, '' + value);
        } else if (propertyInfo.hasBooleanValue || propertyInfo.hasOverloadedBooleanValue && value === true) {
          node.setAttribute(attributeName, '');
        } else {
          node.setAttribute(attributeName, '' + value);
        }
      }
    } else if (DOMProperty.isCustomAttribute(name)) {
      DOMPropertyOperations.setValueForAttribute(node, name, value);
      return;
    }

    if (process.env.NODE_ENV !== 'production') {
      var payload = {};
      payload[name] = value;
      ReactInstrumentation.debugTool.onHostOperation({
        instanceID: ReactDOMComponentTree.getInstanceFromNode(node)._debugID,
        type: 'update attribute',
        payload: payload
      });
    }
  },

  setValueForAttribute: function (node, name, value) {
    if (!isAttributeNameSafe(name)) {
      return;
    }
    if (value == null) {
      node.removeAttribute(name);
    } else {
      node.setAttribute(name, '' + value);
    }

    if (process.env.NODE_ENV !== 'production') {
      var payload = {};
      payload[name] = value;
      ReactInstrumentation.debugTool.onHostOperation({
        instanceID: ReactDOMComponentTree.getInstanceFromNode(node)._debugID,
        type: 'update attribute',
        payload: payload
      });
    }
  },

  /**
   * Deletes an attributes from a node.
   *
   * @param {DOMElement} node
   * @param {string} name
   */
  deleteValueForAttribute: function (node, name) {
    node.removeAttribute(name);
    if (process.env.NODE_ENV !== 'production') {
      ReactInstrumentation.debugTool.onHostOperation({
        instanceID: ReactDOMComponentTree.getInstanceFromNode(node)._debugID,
        type: 'remove attribute',
        payload: name
      });
    }
  },

  /**
   * Deletes the value for a property on a node.
   *
   * @param {DOMElement} node
   * @param {string} name
   */
  deleteValueForProperty: function (node, name) {
    var propertyInfo = DOMProperty.properties.hasOwnProperty(name) ? DOMProperty.properties[name] : null;
    if (propertyInfo) {
      var mutationMethod = propertyInfo.mutationMethod;
      if (mutationMethod) {
        mutationMethod(node, undefined);
      } else if (propertyInfo.mustUseProperty) {
        var propName = propertyInfo.propertyName;
        if (propertyInfo.hasBooleanValue) {
          node[propName] = false;
        } else {
          node[propName] = '';
        }
      } else {
        node.removeAttribute(propertyInfo.attributeName);
      }
    } else if (DOMProperty.isCustomAttribute(name)) {
      node.removeAttribute(name);
    }

    if (process.env.NODE_ENV !== 'production') {
      ReactInstrumentation.debugTool.onHostOperation({
        instanceID: ReactDOMComponentTree.getInstanceFromNode(node)._debugID,
        type: 'remove attribute',
        payload: name
      });
    }
  }

};

module.exports = DOMPropertyOperations;
}).call(this,require('_process'))
},{"./DOMProperty":70,"./ReactDOMComponentTree":92,"./ReactInstrumentation":121,"./quoteAttributeValueForBrowser":178,"_process":58,"fbjs/lib/warning":24}],72:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var _prodInvariant = require('./reactProdInvariant');

var DOMLazyTree = require('./DOMLazyTree');
var ExecutionEnvironment = require('fbjs/lib/ExecutionEnvironment');

var createNodesFromMarkup = require('fbjs/lib/createNodesFromMarkup');
var emptyFunction = require('fbjs/lib/emptyFunction');
var invariant = require('fbjs/lib/invariant');

var Danger = {

  /**
   * Replaces a node with a string of markup at its current position within its
   * parent. The markup must render into a single root node.
   *
   * @param {DOMElement} oldChild Child node to replace.
   * @param {string} markup Markup to render in place of the child node.
   * @internal
   */
  dangerouslyReplaceNodeWithMarkup: function (oldChild, markup) {
    !ExecutionEnvironment.canUseDOM ? process.env.NODE_ENV !== 'production' ? invariant(false, 'dangerouslyReplaceNodeWithMarkup(...): Cannot render markup in a worker thread. Make sure `window` and `document` are available globally before requiring React when unit testing or use ReactDOMServer.renderToString() for server rendering.') : _prodInvariant('56') : void 0;
    !markup ? process.env.NODE_ENV !== 'production' ? invariant(false, 'dangerouslyReplaceNodeWithMarkup(...): Missing markup.') : _prodInvariant('57') : void 0;
    !(oldChild.nodeName !== 'HTML') ? process.env.NODE_ENV !== 'production' ? invariant(false, 'dangerouslyReplaceNodeWithMarkup(...): Cannot replace markup of the <html> node. This is because browser quirks make this unreliable and/or slow. If you want to render to the root you must use server rendering. See ReactDOMServer.renderToString().') : _prodInvariant('58') : void 0;

    if (typeof markup === 'string') {
      var newChild = createNodesFromMarkup(markup, emptyFunction)[0];
      oldChild.parentNode.replaceChild(newChild, oldChild);
    } else {
      DOMLazyTree.replaceChildWithTree(oldChild, markup);
    }
  }

};

module.exports = Danger;
}).call(this,require('_process'))
},{"./DOMLazyTree":68,"./reactProdInvariant":179,"_process":58,"fbjs/lib/ExecutionEnvironment":3,"fbjs/lib/createNodesFromMarkup":8,"fbjs/lib/emptyFunction":9,"fbjs/lib/invariant":17}],73:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

/**
 * Module that is injectable into `EventPluginHub`, that specifies a
 * deterministic ordering of `EventPlugin`s. A convenient way to reason about
 * plugins, without having to package every one of them. This is better than
 * having plugins be ordered in the same order that they are injected because
 * that ordering would be influenced by the packaging order.
 * `ResponderEventPlugin` must occur before `SimpleEventPlugin` so that
 * preventing default on events is convenient in `SimpleEventPlugin` handlers.
 */

var DefaultEventPluginOrder = ['ResponderEventPlugin', 'SimpleEventPlugin', 'TapEventPlugin', 'EnterLeaveEventPlugin', 'ChangeEventPlugin', 'SelectEventPlugin', 'BeforeInputEventPlugin'];

module.exports = DefaultEventPluginOrder;
},{}],74:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var EventPropagators = require('./EventPropagators');
var ReactDOMComponentTree = require('./ReactDOMComponentTree');
var SyntheticMouseEvent = require('./SyntheticMouseEvent');

var eventTypes = {
  mouseEnter: {
    registrationName: 'onMouseEnter',
    dependencies: ['topMouseOut', 'topMouseOver']
  },
  mouseLeave: {
    registrationName: 'onMouseLeave',
    dependencies: ['topMouseOut', 'topMouseOver']
  }
};

var EnterLeaveEventPlugin = {

  eventTypes: eventTypes,

  /**
   * For almost every interaction we care about, there will be both a top-level
   * `mouseover` and `mouseout` event that occurs. Only use `mouseout` so that
   * we do not extract duplicate events. However, moving the mouse into the
   * browser from outside will not fire a `mouseout` event. In this case, we use
   * the `mouseover` top-level event.
   */
  extractEvents: function (topLevelType, targetInst, nativeEvent, nativeEventTarget) {
    if (topLevelType === 'topMouseOver' && (nativeEvent.relatedTarget || nativeEvent.fromElement)) {
      return null;
    }
    if (topLevelType !== 'topMouseOut' && topLevelType !== 'topMouseOver') {
      // Must not be a mouse in or mouse out - ignoring.
      return null;
    }

    var win;
    if (nativeEventTarget.window === nativeEventTarget) {
      // `nativeEventTarget` is probably a window object.
      win = nativeEventTarget;
    } else {
      // TODO: Figure out why `ownerDocument` is sometimes undefined in IE8.
      var doc = nativeEventTarget.ownerDocument;
      if (doc) {
        win = doc.defaultView || doc.parentWindow;
      } else {
        win = window;
      }
    }

    var from;
    var to;
    if (topLevelType === 'topMouseOut') {
      from = targetInst;
      var related = nativeEvent.relatedTarget || nativeEvent.toElement;
      to = related ? ReactDOMComponentTree.getClosestInstanceFromNode(related) : null;
    } else {
      // Moving to a node from outside the window.
      from = null;
      to = targetInst;
    }

    if (from === to) {
      // Nothing pertains to our managed components.
      return null;
    }

    var fromNode = from == null ? win : ReactDOMComponentTree.getNodeFromInstance(from);
    var toNode = to == null ? win : ReactDOMComponentTree.getNodeFromInstance(to);

    var leave = SyntheticMouseEvent.getPooled(eventTypes.mouseLeave, from, nativeEvent, nativeEventTarget);
    leave.type = 'mouseleave';
    leave.target = fromNode;
    leave.relatedTarget = toNode;

    var enter = SyntheticMouseEvent.getPooled(eventTypes.mouseEnter, to, nativeEvent, nativeEventTarget);
    enter.type = 'mouseenter';
    enter.target = toNode;
    enter.relatedTarget = fromNode;

    EventPropagators.accumulateEnterLeaveDispatches(leave, enter, from, to);

    return [leave, enter];
  }

};

module.exports = EnterLeaveEventPlugin;
},{"./EventPropagators":78,"./ReactDOMComponentTree":92,"./SyntheticMouseEvent":149}],75:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var _prodInvariant = require('./reactProdInvariant');

var EventPluginRegistry = require('./EventPluginRegistry');
var EventPluginUtils = require('./EventPluginUtils');
var ReactErrorUtils = require('./ReactErrorUtils');

var accumulateInto = require('./accumulateInto');
var forEachAccumulated = require('./forEachAccumulated');
var invariant = require('fbjs/lib/invariant');

/**
 * Internal store for event listeners
 */
var listenerBank = {};

/**
 * Internal queue of events that have accumulated their dispatches and are
 * waiting to have their dispatches executed.
 */
var eventQueue = null;

/**
 * Dispatches an event and releases it back into the pool, unless persistent.
 *
 * @param {?object} event Synthetic event to be dispatched.
 * @param {boolean} simulated If the event is simulated (changes exn behavior)
 * @private
 */
var executeDispatchesAndRelease = function (event, simulated) {
  if (event) {
    EventPluginUtils.executeDispatchesInOrder(event, simulated);

    if (!event.isPersistent()) {
      event.constructor.release(event);
    }
  }
};
var executeDispatchesAndReleaseSimulated = function (e) {
  return executeDispatchesAndRelease(e, true);
};
var executeDispatchesAndReleaseTopLevel = function (e) {
  return executeDispatchesAndRelease(e, false);
};

var getDictionaryKey = function (inst) {
  // Prevents V8 performance issue:
  // https://github.com/facebook/react/pull/7232
  return '.' + inst._rootNodeID;
};

function isInteractive(tag) {
  return tag === 'button' || tag === 'input' || tag === 'select' || tag === 'textarea';
}

function shouldPreventMouseEvent(name, type, props) {
  switch (name) {
    case 'onClick':
    case 'onClickCapture':
    case 'onDoubleClick':
    case 'onDoubleClickCapture':
    case 'onMouseDown':
    case 'onMouseDownCapture':
    case 'onMouseMove':
    case 'onMouseMoveCapture':
    case 'onMouseUp':
    case 'onMouseUpCapture':
      return !!(props.disabled && isInteractive(type));
    default:
      return false;
  }
}

/**
 * This is a unified interface for event plugins to be installed and configured.
 *
 * Event plugins can implement the following properties:
 *
 *   `extractEvents` {function(string, DOMEventTarget, string, object): *}
 *     Required. When a top-level event is fired, this method is expected to
 *     extract synthetic events that will in turn be queued and dispatched.
 *
 *   `eventTypes` {object}
 *     Optional, plugins that fire events must publish a mapping of registration
 *     names that are used to register listeners. Values of this mapping must
 *     be objects that contain `registrationName` or `phasedRegistrationNames`.
 *
 *   `executeDispatch` {function(object, function, string)}
 *     Optional, allows plugins to override how an event gets dispatched. By
 *     default, the listener is simply invoked.
 *
 * Each plugin that is injected into `EventsPluginHub` is immediately operable.
 *
 * @public
 */
var EventPluginHub = {

  /**
   * Methods for injecting dependencies.
   */
  injection: {

    /**
     * @param {array} InjectedEventPluginOrder
     * @public
     */
    injectEventPluginOrder: EventPluginRegistry.injectEventPluginOrder,

    /**
     * @param {object} injectedNamesToPlugins Map from names to plugin modules.
     */
    injectEventPluginsByName: EventPluginRegistry.injectEventPluginsByName

  },

  /**
   * Stores `listener` at `listenerBank[registrationName][key]`. Is idempotent.
   *
   * @param {object} inst The instance, which is the source of events.
   * @param {string} registrationName Name of listener (e.g. `onClick`).
   * @param {function} listener The callback to store.
   */
  putListener: function (inst, registrationName, listener) {
    !(typeof listener === 'function') ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Expected %s listener to be a function, instead got type %s', registrationName, typeof listener) : _prodInvariant('94', registrationName, typeof listener) : void 0;

    var key = getDictionaryKey(inst);
    var bankForRegistrationName = listenerBank[registrationName] || (listenerBank[registrationName] = {});
    bankForRegistrationName[key] = listener;

    var PluginModule = EventPluginRegistry.registrationNameModules[registrationName];
    if (PluginModule && PluginModule.didPutListener) {
      PluginModule.didPutListener(inst, registrationName, listener);
    }
  },

  /**
   * @param {object} inst The instance, which is the source of events.
   * @param {string} registrationName Name of listener (e.g. `onClick`).
   * @return {?function} The stored callback.
   */
  getListener: function (inst, registrationName) {
    // TODO: shouldPreventMouseEvent is DOM-specific and definitely should not
    // live here; needs to be moved to a better place soon
    var bankForRegistrationName = listenerBank[registrationName];
    if (shouldPreventMouseEvent(registrationName, inst._currentElement.type, inst._currentElement.props)) {
      return null;
    }
    var key = getDictionaryKey(inst);
    return bankForRegistrationName && bankForRegistrationName[key];
  },

  /**
   * Deletes a listener from the registration bank.
   *
   * @param {object} inst The instance, which is the source of events.
   * @param {string} registrationName Name of listener (e.g. `onClick`).
   */
  deleteListener: function (inst, registrationName) {
    var PluginModule = EventPluginRegistry.registrationNameModules[registrationName];
    if (PluginModule && PluginModule.willDeleteListener) {
      PluginModule.willDeleteListener(inst, registrationName);
    }

    var bankForRegistrationName = listenerBank[registrationName];
    // TODO: This should never be null -- when is it?
    if (bankForRegistrationName) {
      var key = getDictionaryKey(inst);
      delete bankForRegistrationName[key];
    }
  },

  /**
   * Deletes all listeners for the DOM element with the supplied ID.
   *
   * @param {object} inst The instance, which is the source of events.
   */
  deleteAllListeners: function (inst) {
    var key = getDictionaryKey(inst);
    for (var registrationName in listenerBank) {
      if (!listenerBank.hasOwnProperty(registrationName)) {
        continue;
      }

      if (!listenerBank[registrationName][key]) {
        continue;
      }

      var PluginModule = EventPluginRegistry.registrationNameModules[registrationName];
      if (PluginModule && PluginModule.willDeleteListener) {
        PluginModule.willDeleteListener(inst, registrationName);
      }

      delete listenerBank[registrationName][key];
    }
  },

  /**
   * Allows registered plugins an opportunity to extract events from top-level
   * native browser events.
   *
   * @return {*} An accumulation of synthetic events.
   * @internal
   */
  extractEvents: function (topLevelType, targetInst, nativeEvent, nativeEventTarget) {
    var events;
    var plugins = EventPluginRegistry.plugins;
    for (var i = 0; i < plugins.length; i++) {
      // Not every plugin in the ordering may be loaded at runtime.
      var possiblePlugin = plugins[i];
      if (possiblePlugin) {
        var extractedEvents = possiblePlugin.extractEvents(topLevelType, targetInst, nativeEvent, nativeEventTarget);
        if (extractedEvents) {
          events = accumulateInto(events, extractedEvents);
        }
      }
    }
    return events;
  },

  /**
   * Enqueues a synthetic event that should be dispatched when
   * `processEventQueue` is invoked.
   *
   * @param {*} events An accumulation of synthetic events.
   * @internal
   */
  enqueueEvents: function (events) {
    if (events) {
      eventQueue = accumulateInto(eventQueue, events);
    }
  },

  /**
   * Dispatches all synthetic events on the event queue.
   *
   * @internal
   */
  processEventQueue: function (simulated) {
    // Set `eventQueue` to null before processing it so that we can tell if more
    // events get enqueued while processing.
    var processingEventQueue = eventQueue;
    eventQueue = null;
    if (simulated) {
      forEachAccumulated(processingEventQueue, executeDispatchesAndReleaseSimulated);
    } else {
      forEachAccumulated(processingEventQueue, executeDispatchesAndReleaseTopLevel);
    }
    !!eventQueue ? process.env.NODE_ENV !== 'production' ? invariant(false, 'processEventQueue(): Additional events were enqueued while processing an event queue. Support for this has not yet been implemented.') : _prodInvariant('95') : void 0;
    // This would be a good time to rethrow if any of the event handlers threw.
    ReactErrorUtils.rethrowCaughtError();
  },

  /**
   * These are needed for tests only. Do not use!
   */
  __purge: function () {
    listenerBank = {};
  },

  __getListenerBank: function () {
    return listenerBank;
  }

};

module.exports = EventPluginHub;
}).call(this,require('_process'))
},{"./EventPluginRegistry":76,"./EventPluginUtils":77,"./ReactErrorUtils":112,"./accumulateInto":156,"./forEachAccumulated":164,"./reactProdInvariant":179,"_process":58,"fbjs/lib/invariant":17}],76:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

'use strict';

var _prodInvariant = require('./reactProdInvariant');

var invariant = require('fbjs/lib/invariant');

/**
 * Injectable ordering of event plugins.
 */
var eventPluginOrder = null;

/**
 * Injectable mapping from names to event plugin modules.
 */
var namesToPlugins = {};

/**
 * Recomputes the plugin list using the injected plugins and plugin ordering.
 *
 * @private
 */
function recomputePluginOrdering() {
  if (!eventPluginOrder) {
    // Wait until an `eventPluginOrder` is injected.
    return;
  }
  for (var pluginName in namesToPlugins) {
    var pluginModule = namesToPlugins[pluginName];
    var pluginIndex = eventPluginOrder.indexOf(pluginName);
    !(pluginIndex > -1) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'EventPluginRegistry: Cannot inject event plugins that do not exist in the plugin ordering, `%s`.', pluginName) : _prodInvariant('96', pluginName) : void 0;
    if (EventPluginRegistry.plugins[pluginIndex]) {
      continue;
    }
    !pluginModule.extractEvents ? process.env.NODE_ENV !== 'production' ? invariant(false, 'EventPluginRegistry: Event plugins must implement an `extractEvents` method, but `%s` does not.', pluginName) : _prodInvariant('97', pluginName) : void 0;
    EventPluginRegistry.plugins[pluginIndex] = pluginModule;
    var publishedEvents = pluginModule.eventTypes;
    for (var eventName in publishedEvents) {
      !publishEventForPlugin(publishedEvents[eventName], pluginModule, eventName) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'EventPluginRegistry: Failed to publish event `%s` for plugin `%s`.', eventName, pluginName) : _prodInvariant('98', eventName, pluginName) : void 0;
    }
  }
}

/**
 * Publishes an event so that it can be dispatched by the supplied plugin.
 *
 * @param {object} dispatchConfig Dispatch configuration for the event.
 * @param {object} PluginModule Plugin publishing the event.
 * @return {boolean} True if the event was successfully published.
 * @private
 */
function publishEventForPlugin(dispatchConfig, pluginModule, eventName) {
  !!EventPluginRegistry.eventNameDispatchConfigs.hasOwnProperty(eventName) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'EventPluginHub: More than one plugin attempted to publish the same event name, `%s`.', eventName) : _prodInvariant('99', eventName) : void 0;
  EventPluginRegistry.eventNameDispatchConfigs[eventName] = dispatchConfig;

  var phasedRegistrationNames = dispatchConfig.phasedRegistrationNames;
  if (phasedRegistrationNames) {
    for (var phaseName in phasedRegistrationNames) {
      if (phasedRegistrationNames.hasOwnProperty(phaseName)) {
        var phasedRegistrationName = phasedRegistrationNames[phaseName];
        publishRegistrationName(phasedRegistrationName, pluginModule, eventName);
      }
    }
    return true;
  } else if (dispatchConfig.registrationName) {
    publishRegistrationName(dispatchConfig.registrationName, pluginModule, eventName);
    return true;
  }
  return false;
}

/**
 * Publishes a registration name that is used to identify dispatched events and
 * can be used with `EventPluginHub.putListener` to register listeners.
 *
 * @param {string} registrationName Registration name to add.
 * @param {object} PluginModule Plugin publishing the event.
 * @private
 */
function publishRegistrationName(registrationName, pluginModule, eventName) {
  !!EventPluginRegistry.registrationNameModules[registrationName] ? process.env.NODE_ENV !== 'production' ? invariant(false, 'EventPluginHub: More than one plugin attempted to publish the same registration name, `%s`.', registrationName) : _prodInvariant('100', registrationName) : void 0;
  EventPluginRegistry.registrationNameModules[registrationName] = pluginModule;
  EventPluginRegistry.registrationNameDependencies[registrationName] = pluginModule.eventTypes[eventName].dependencies;

  if (process.env.NODE_ENV !== 'production') {
    var lowerCasedName = registrationName.toLowerCase();
    EventPluginRegistry.possibleRegistrationNames[lowerCasedName] = registrationName;

    if (registrationName === 'onDoubleClick') {
      EventPluginRegistry.possibleRegistrationNames.ondblclick = registrationName;
    }
  }
}

/**
 * Registers plugins so that they can extract and dispatch events.
 *
 * @see {EventPluginHub}
 */
var EventPluginRegistry = {

  /**
   * Ordered list of injected plugins.
   */
  plugins: [],

  /**
   * Mapping from event name to dispatch config
   */
  eventNameDispatchConfigs: {},

  /**
   * Mapping from registration name to plugin module
   */
  registrationNameModules: {},

  /**
   * Mapping from registration name to event name
   */
  registrationNameDependencies: {},

  /**
   * Mapping from lowercase registration names to the properly cased version,
   * used to warn in the case of missing event handlers. Available
   * only in __DEV__.
   * @type {Object}
   */
  possibleRegistrationNames: process.env.NODE_ENV !== 'production' ? {} : null,
  // Trust the developer to only use possibleRegistrationNames in __DEV__

  /**
   * Injects an ordering of plugins (by plugin name). This allows the ordering
   * to be decoupled from injection of the actual plugins so that ordering is
   * always deterministic regardless of packaging, on-the-fly injection, etc.
   *
   * @param {array} InjectedEventPluginOrder
   * @internal
   * @see {EventPluginHub.injection.injectEventPluginOrder}
   */
  injectEventPluginOrder: function (injectedEventPluginOrder) {
    !!eventPluginOrder ? process.env.NODE_ENV !== 'production' ? invariant(false, 'EventPluginRegistry: Cannot inject event plugin ordering more than once. You are likely trying to load more than one copy of React.') : _prodInvariant('101') : void 0;
    // Clone the ordering so it cannot be dynamically mutated.
    eventPluginOrder = Array.prototype.slice.call(injectedEventPluginOrder);
    recomputePluginOrdering();
  },

  /**
   * Injects plugins to be used by `EventPluginHub`. The plugin names must be
   * in the ordering injected by `injectEventPluginOrder`.
   *
   * Plugins can be injected as part of page initialization or on-the-fly.
   *
   * @param {object} injectedNamesToPlugins Map from names to plugin modules.
   * @internal
   * @see {EventPluginHub.injection.injectEventPluginsByName}
   */
  injectEventPluginsByName: function (injectedNamesToPlugins) {
    var isOrderingDirty = false;
    for (var pluginName in injectedNamesToPlugins) {
      if (!injectedNamesToPlugins.hasOwnProperty(pluginName)) {
        continue;
      }
      var pluginModule = injectedNamesToPlugins[pluginName];
      if (!namesToPlugins.hasOwnProperty(pluginName) || namesToPlugins[pluginName] !== pluginModule) {
        !!namesToPlugins[pluginName] ? process.env.NODE_ENV !== 'production' ? invariant(false, 'EventPluginRegistry: Cannot inject two different event plugins using the same name, `%s`.', pluginName) : _prodInvariant('102', pluginName) : void 0;
        namesToPlugins[pluginName] = pluginModule;
        isOrderingDirty = true;
      }
    }
    if (isOrderingDirty) {
      recomputePluginOrdering();
    }
  },

  /**
   * Looks up the plugin for the supplied event.
   *
   * @param {object} event A synthetic event.
   * @return {?object} The plugin that created the supplied event.
   * @internal
   */
  getPluginModuleForEvent: function (event) {
    var dispatchConfig = event.dispatchConfig;
    if (dispatchConfig.registrationName) {
      return EventPluginRegistry.registrationNameModules[dispatchConfig.registrationName] || null;
    }
    if (dispatchConfig.phasedRegistrationNames !== undefined) {
      // pulling phasedRegistrationNames out of dispatchConfig helps Flow see
      // that it is not undefined.
      var phasedRegistrationNames = dispatchConfig.phasedRegistrationNames;

      for (var phase in phasedRegistrationNames) {
        if (!phasedRegistrationNames.hasOwnProperty(phase)) {
          continue;
        }
        var pluginModule = EventPluginRegistry.registrationNameModules[phasedRegistrationNames[phase]];
        if (pluginModule) {
          return pluginModule;
        }
      }
    }
    return null;
  },

  /**
   * Exposed for unit testing.
   * @private
   */
  _resetEventPlugins: function () {
    eventPluginOrder = null;
    for (var pluginName in namesToPlugins) {
      if (namesToPlugins.hasOwnProperty(pluginName)) {
        delete namesToPlugins[pluginName];
      }
    }
    EventPluginRegistry.plugins.length = 0;

    var eventNameDispatchConfigs = EventPluginRegistry.eventNameDispatchConfigs;
    for (var eventName in eventNameDispatchConfigs) {
      if (eventNameDispatchConfigs.hasOwnProperty(eventName)) {
        delete eventNameDispatchConfigs[eventName];
      }
    }

    var registrationNameModules = EventPluginRegistry.registrationNameModules;
    for (var registrationName in registrationNameModules) {
      if (registrationNameModules.hasOwnProperty(registrationName)) {
        delete registrationNameModules[registrationName];
      }
    }

    if (process.env.NODE_ENV !== 'production') {
      var possibleRegistrationNames = EventPluginRegistry.possibleRegistrationNames;
      for (var lowerCasedName in possibleRegistrationNames) {
        if (possibleRegistrationNames.hasOwnProperty(lowerCasedName)) {
          delete possibleRegistrationNames[lowerCasedName];
        }
      }
    }
  }

};

module.exports = EventPluginRegistry;
}).call(this,require('_process'))
},{"./reactProdInvariant":179,"_process":58,"fbjs/lib/invariant":17}],77:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var _prodInvariant = require('./reactProdInvariant');

var ReactErrorUtils = require('./ReactErrorUtils');

var invariant = require('fbjs/lib/invariant');
var warning = require('fbjs/lib/warning');

/**
 * Injected dependencies:
 */

/**
 * - `ComponentTree`: [required] Module that can convert between React instances
 *   and actual node references.
 */
var ComponentTree;
var TreeTraversal;
var injection = {
  injectComponentTree: function (Injected) {
    ComponentTree = Injected;
    if (process.env.NODE_ENV !== 'production') {
      process.env.NODE_ENV !== 'production' ? warning(Injected && Injected.getNodeFromInstance && Injected.getInstanceFromNode, 'EventPluginUtils.injection.injectComponentTree(...): Injected ' + 'module is missing getNodeFromInstance or getInstanceFromNode.') : void 0;
    }
  },
  injectTreeTraversal: function (Injected) {
    TreeTraversal = Injected;
    if (process.env.NODE_ENV !== 'production') {
      process.env.NODE_ENV !== 'production' ? warning(Injected && Injected.isAncestor && Injected.getLowestCommonAncestor, 'EventPluginUtils.injection.injectTreeTraversal(...): Injected ' + 'module is missing isAncestor or getLowestCommonAncestor.') : void 0;
    }
  }
};

function isEndish(topLevelType) {
  return topLevelType === 'topMouseUp' || topLevelType === 'topTouchEnd' || topLevelType === 'topTouchCancel';
}

function isMoveish(topLevelType) {
  return topLevelType === 'topMouseMove' || topLevelType === 'topTouchMove';
}
function isStartish(topLevelType) {
  return topLevelType === 'topMouseDown' || topLevelType === 'topTouchStart';
}

var validateEventDispatches;
if (process.env.NODE_ENV !== 'production') {
  validateEventDispatches = function (event) {
    var dispatchListeners = event._dispatchListeners;
    var dispatchInstances = event._dispatchInstances;

    var listenersIsArr = Array.isArray(dispatchListeners);
    var listenersLen = listenersIsArr ? dispatchListeners.length : dispatchListeners ? 1 : 0;

    var instancesIsArr = Array.isArray(dispatchInstances);
    var instancesLen = instancesIsArr ? dispatchInstances.length : dispatchInstances ? 1 : 0;

    process.env.NODE_ENV !== 'production' ? warning(instancesIsArr === listenersIsArr && instancesLen === listenersLen, 'EventPluginUtils: Invalid `event`.') : void 0;
  };
}

/**
 * Dispatch the event to the listener.
 * @param {SyntheticEvent} event SyntheticEvent to handle
 * @param {boolean} simulated If the event is simulated (changes exn behavior)
 * @param {function} listener Application-level callback
 * @param {*} inst Internal component instance
 */
function executeDispatch(event, simulated, listener, inst) {
  var type = event.type || 'unknown-event';
  event.currentTarget = EventPluginUtils.getNodeFromInstance(inst);
  if (simulated) {
    ReactErrorUtils.invokeGuardedCallbackWithCatch(type, listener, event);
  } else {
    ReactErrorUtils.invokeGuardedCallback(type, listener, event);
  }
  event.currentTarget = null;
}

/**
 * Standard/simple iteration through an event's collected dispatches.
 */
function executeDispatchesInOrder(event, simulated) {
  var dispatchListeners = event._dispatchListeners;
  var dispatchInstances = event._dispatchInstances;
  if (process.env.NODE_ENV !== 'production') {
    validateEventDispatches(event);
  }
  if (Array.isArray(dispatchListeners)) {
    for (var i = 0; i < dispatchListeners.length; i++) {
      if (event.isPropagationStopped()) {
        break;
      }
      // Listeners and Instances are two parallel arrays that are always in sync.
      executeDispatch(event, simulated, dispatchListeners[i], dispatchInstances[i]);
    }
  } else if (dispatchListeners) {
    executeDispatch(event, simulated, dispatchListeners, dispatchInstances);
  }
  event._dispatchListeners = null;
  event._dispatchInstances = null;
}

/**
 * Standard/simple iteration through an event's collected dispatches, but stops
 * at the first dispatch execution returning true, and returns that id.
 *
 * @return {?string} id of the first dispatch execution who's listener returns
 * true, or null if no listener returned true.
 */
function executeDispatchesInOrderStopAtTrueImpl(event) {
  var dispatchListeners = event._dispatchListeners;
  var dispatchInstances = event._dispatchInstances;
  if (process.env.NODE_ENV !== 'production') {
    validateEventDispatches(event);
  }
  if (Array.isArray(dispatchListeners)) {
    for (var i = 0; i < dispatchListeners.length; i++) {
      if (event.isPropagationStopped()) {
        break;
      }
      // Listeners and Instances are two parallel arrays that are always in sync.
      if (dispatchListeners[i](event, dispatchInstances[i])) {
        return dispatchInstances[i];
      }
    }
  } else if (dispatchListeners) {
    if (dispatchListeners(event, dispatchInstances)) {
      return dispatchInstances;
    }
  }
  return null;
}

/**
 * @see executeDispatchesInOrderStopAtTrueImpl
 */
function executeDispatchesInOrderStopAtTrue(event) {
  var ret = executeDispatchesInOrderStopAtTrueImpl(event);
  event._dispatchInstances = null;
  event._dispatchListeners = null;
  return ret;
}

/**
 * Execution of a "direct" dispatch - there must be at most one dispatch
 * accumulated on the event or it is considered an error. It doesn't really make
 * sense for an event with multiple dispatches (bubbled) to keep track of the
 * return values at each dispatch execution, but it does tend to make sense when
 * dealing with "direct" dispatches.
 *
 * @return {*} The return value of executing the single dispatch.
 */
function executeDirectDispatch(event) {
  if (process.env.NODE_ENV !== 'production') {
    validateEventDispatches(event);
  }
  var dispatchListener = event._dispatchListeners;
  var dispatchInstance = event._dispatchInstances;
  !!Array.isArray(dispatchListener) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'executeDirectDispatch(...): Invalid `event`.') : _prodInvariant('103') : void 0;
  event.currentTarget = dispatchListener ? EventPluginUtils.getNodeFromInstance(dispatchInstance) : null;
  var res = dispatchListener ? dispatchListener(event) : null;
  event.currentTarget = null;
  event._dispatchListeners = null;
  event._dispatchInstances = null;
  return res;
}

/**
 * @param {SyntheticEvent} event
 * @return {boolean} True iff number of dispatches accumulated is greater than 0.
 */
function hasDispatches(event) {
  return !!event._dispatchListeners;
}

/**
 * General utilities that are useful in creating custom Event Plugins.
 */
var EventPluginUtils = {
  isEndish: isEndish,
  isMoveish: isMoveish,
  isStartish: isStartish,

  executeDirectDispatch: executeDirectDispatch,
  executeDispatchesInOrder: executeDispatchesInOrder,
  executeDispatchesInOrderStopAtTrue: executeDispatchesInOrderStopAtTrue,
  hasDispatches: hasDispatches,

  getInstanceFromNode: function (node) {
    return ComponentTree.getInstanceFromNode(node);
  },
  getNodeFromInstance: function (node) {
    return ComponentTree.getNodeFromInstance(node);
  },
  isAncestor: function (a, b) {
    return TreeTraversal.isAncestor(a, b);
  },
  getLowestCommonAncestor: function (a, b) {
    return TreeTraversal.getLowestCommonAncestor(a, b);
  },
  getParentInstance: function (inst) {
    return TreeTraversal.getParentInstance(inst);
  },
  traverseTwoPhase: function (target, fn, arg) {
    return TreeTraversal.traverseTwoPhase(target, fn, arg);
  },
  traverseEnterLeave: function (from, to, fn, argFrom, argTo) {
    return TreeTraversal.traverseEnterLeave(from, to, fn, argFrom, argTo);
  },

  injection: injection
};

module.exports = EventPluginUtils;
}).call(this,require('_process'))
},{"./ReactErrorUtils":112,"./reactProdInvariant":179,"_process":58,"fbjs/lib/invariant":17,"fbjs/lib/warning":24}],78:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var EventPluginHub = require('./EventPluginHub');
var EventPluginUtils = require('./EventPluginUtils');

var accumulateInto = require('./accumulateInto');
var forEachAccumulated = require('./forEachAccumulated');
var warning = require('fbjs/lib/warning');

var getListener = EventPluginHub.getListener;

/**
 * Some event types have a notion of different registration names for different
 * "phases" of propagation. This finds listeners by a given phase.
 */
function listenerAtPhase(inst, event, propagationPhase) {
  var registrationName = event.dispatchConfig.phasedRegistrationNames[propagationPhase];
  return getListener(inst, registrationName);
}

/**
 * Tags a `SyntheticEvent` with dispatched listeners. Creating this function
 * here, allows us to not have to bind or create functions for each event.
 * Mutating the event's members allows us to not have to create a wrapping
 * "dispatch" object that pairs the event with the listener.
 */
function accumulateDirectionalDispatches(inst, phase, event) {
  if (process.env.NODE_ENV !== 'production') {
    process.env.NODE_ENV !== 'production' ? warning(inst, 'Dispatching inst must not be null') : void 0;
  }
  var listener = listenerAtPhase(inst, event, phase);
  if (listener) {
    event._dispatchListeners = accumulateInto(event._dispatchListeners, listener);
    event._dispatchInstances = accumulateInto(event._dispatchInstances, inst);
  }
}

/**
 * Collect dispatches (must be entirely collected before dispatching - see unit
 * tests). Lazily allocate the array to conserve memory.  We must loop through
 * each event and perform the traversal for each one. We cannot perform a
 * single traversal for the entire collection of events because each event may
 * have a different target.
 */
function accumulateTwoPhaseDispatchesSingle(event) {
  if (event && event.dispatchConfig.phasedRegistrationNames) {
    EventPluginUtils.traverseTwoPhase(event._targetInst, accumulateDirectionalDispatches, event);
  }
}

/**
 * Same as `accumulateTwoPhaseDispatchesSingle`, but skips over the targetID.
 */
function accumulateTwoPhaseDispatchesSingleSkipTarget(event) {
  if (event && event.dispatchConfig.phasedRegistrationNames) {
    var targetInst = event._targetInst;
    var parentInst = targetInst ? EventPluginUtils.getParentInstance(targetInst) : null;
    EventPluginUtils.traverseTwoPhase(parentInst, accumulateDirectionalDispatches, event);
  }
}

/**
 * Accumulates without regard to direction, does not look for phased
 * registration names. Same as `accumulateDirectDispatchesSingle` but without
 * requiring that the `dispatchMarker` be the same as the dispatched ID.
 */
function accumulateDispatches(inst, ignoredDirection, event) {
  if (event && event.dispatchConfig.registrationName) {
    var registrationName = event.dispatchConfig.registrationName;
    var listener = getListener(inst, registrationName);
    if (listener) {
      event._dispatchListeners = accumulateInto(event._dispatchListeners, listener);
      event._dispatchInstances = accumulateInto(event._dispatchInstances, inst);
    }
  }
}

/**
 * Accumulates dispatches on an `SyntheticEvent`, but only for the
 * `dispatchMarker`.
 * @param {SyntheticEvent} event
 */
function accumulateDirectDispatchesSingle(event) {
  if (event && event.dispatchConfig.registrationName) {
    accumulateDispatches(event._targetInst, null, event);
  }
}

function accumulateTwoPhaseDispatches(events) {
  forEachAccumulated(events, accumulateTwoPhaseDispatchesSingle);
}

function accumulateTwoPhaseDispatchesSkipTarget(events) {
  forEachAccumulated(events, accumulateTwoPhaseDispatchesSingleSkipTarget);
}

function accumulateEnterLeaveDispatches(leave, enter, from, to) {
  EventPluginUtils.traverseEnterLeave(from, to, accumulateDispatches, leave, enter);
}

function accumulateDirectDispatches(events) {
  forEachAccumulated(events, accumulateDirectDispatchesSingle);
}

/**
 * A small set of propagation patterns, each of which will accept a small amount
 * of information, and generate a set of "dispatch ready event objects" - which
 * are sets of events that have already been annotated with a set of dispatched
 * listener functions/ids. The API is designed this way to discourage these
 * propagation strategies from actually executing the dispatches, since we
 * always want to collect the entire set of dispatches before executing event a
 * single one.
 *
 * @constructor EventPropagators
 */
var EventPropagators = {
  accumulateTwoPhaseDispatches: accumulateTwoPhaseDispatches,
  accumulateTwoPhaseDispatchesSkipTarget: accumulateTwoPhaseDispatchesSkipTarget,
  accumulateDirectDispatches: accumulateDirectDispatches,
  accumulateEnterLeaveDispatches: accumulateEnterLeaveDispatches
};

module.exports = EventPropagators;
}).call(this,require('_process'))
},{"./EventPluginHub":75,"./EventPluginUtils":77,"./accumulateInto":156,"./forEachAccumulated":164,"_process":58,"fbjs/lib/warning":24}],79:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var _assign = require('object-assign');

var PooledClass = require('./PooledClass');

var getTextContentAccessor = require('./getTextContentAccessor');

/**
 * This helper class stores information about text content of a target node,
 * allowing comparison of content before and after a given event.
 *
 * Identify the node where selection currently begins, then observe
 * both its text content and its current position in the DOM. Since the
 * browser may natively replace the target node during composition, we can
 * use its position to find its replacement.
 *
 * @param {DOMEventTarget} root
 */
function FallbackCompositionState(root) {
  this._root = root;
  this._startText = this.getText();
  this._fallbackText = null;
}

_assign(FallbackCompositionState.prototype, {
  destructor: function () {
    this._root = null;
    this._startText = null;
    this._fallbackText = null;
  },

  /**
   * Get current text of input.
   *
   * @return {string}
   */
  getText: function () {
    if ('value' in this._root) {
      return this._root.value;
    }
    return this._root[getTextContentAccessor()];
  },

  /**
   * Determine the differing substring between the initially stored
   * text content and the current content.
   *
   * @return {string}
   */
  getData: function () {
    if (this._fallbackText) {
      return this._fallbackText;
    }

    var start;
    var startValue = this._startText;
    var startLength = startValue.length;
    var end;
    var endValue = this.getText();
    var endLength = endValue.length;

    for (start = 0; start < startLength; start++) {
      if (startValue[start] !== endValue[start]) {
        break;
      }
    }

    var minEnd = startLength - start;
    for (end = 1; end <= minEnd; end++) {
      if (startValue[startLength - end] !== endValue[endLength - end]) {
        break;
      }
    }

    var sliceTail = end > 1 ? 1 - end : undefined;
    this._fallbackText = endValue.slice(start, sliceTail);
    return this._fallbackText;
  }
});

PooledClass.addPoolingTo(FallbackCompositionState);

module.exports = FallbackCompositionState;
},{"./PooledClass":83,"./getTextContentAccessor":173,"object-assign":57}],80:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var DOMProperty = require('./DOMProperty');

var MUST_USE_PROPERTY = DOMProperty.injection.MUST_USE_PROPERTY;
var HAS_BOOLEAN_VALUE = DOMProperty.injection.HAS_BOOLEAN_VALUE;
var HAS_NUMERIC_VALUE = DOMProperty.injection.HAS_NUMERIC_VALUE;
var HAS_POSITIVE_NUMERIC_VALUE = DOMProperty.injection.HAS_POSITIVE_NUMERIC_VALUE;
var HAS_OVERLOADED_BOOLEAN_VALUE = DOMProperty.injection.HAS_OVERLOADED_BOOLEAN_VALUE;

var HTMLDOMPropertyConfig = {
  isCustomAttribute: RegExp.prototype.test.bind(new RegExp('^(data|aria)-[' + DOMProperty.ATTRIBUTE_NAME_CHAR + ']*$')),
  Properties: {
    /**
     * Standard Properties
     */
    accept: 0,
    acceptCharset: 0,
    accessKey: 0,
    action: 0,
    allowFullScreen: HAS_BOOLEAN_VALUE,
    allowTransparency: 0,
    alt: 0,
    // specifies target context for links with `preload` type
    as: 0,
    async: HAS_BOOLEAN_VALUE,
    autoComplete: 0,
    // autoFocus is polyfilled/normalized by AutoFocusUtils
    // autoFocus: HAS_BOOLEAN_VALUE,
    autoPlay: HAS_BOOLEAN_VALUE,
    capture: HAS_BOOLEAN_VALUE,
    cellPadding: 0,
    cellSpacing: 0,
    charSet: 0,
    challenge: 0,
    checked: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
    cite: 0,
    classID: 0,
    className: 0,
    cols: HAS_POSITIVE_NUMERIC_VALUE,
    colSpan: 0,
    content: 0,
    contentEditable: 0,
    contextMenu: 0,
    controls: HAS_BOOLEAN_VALUE,
    coords: 0,
    crossOrigin: 0,
    data: 0, // For `<object />` acts as `src`.
    dateTime: 0,
    'default': HAS_BOOLEAN_VALUE,
    defer: HAS_BOOLEAN_VALUE,
    dir: 0,
    disabled: HAS_BOOLEAN_VALUE,
    download: HAS_OVERLOADED_BOOLEAN_VALUE,
    draggable: 0,
    encType: 0,
    form: 0,
    formAction: 0,
    formEncType: 0,
    formMethod: 0,
    formNoValidate: HAS_BOOLEAN_VALUE,
    formTarget: 0,
    frameBorder: 0,
    headers: 0,
    height: 0,
    hidden: HAS_BOOLEAN_VALUE,
    high: 0,
    href: 0,
    hrefLang: 0,
    htmlFor: 0,
    httpEquiv: 0,
    icon: 0,
    id: 0,
    inputMode: 0,
    integrity: 0,
    is: 0,
    keyParams: 0,
    keyType: 0,
    kind: 0,
    label: 0,
    lang: 0,
    list: 0,
    loop: HAS_BOOLEAN_VALUE,
    low: 0,
    manifest: 0,
    marginHeight: 0,
    marginWidth: 0,
    max: 0,
    maxLength: 0,
    media: 0,
    mediaGroup: 0,
    method: 0,
    min: 0,
    minLength: 0,
    // Caution; `option.selected` is not updated if `select.multiple` is
    // disabled with `removeAttribute`.
    multiple: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
    muted: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
    name: 0,
    nonce: 0,
    noValidate: HAS_BOOLEAN_VALUE,
    open: HAS_BOOLEAN_VALUE,
    optimum: 0,
    pattern: 0,
    placeholder: 0,
    playsInline: HAS_BOOLEAN_VALUE,
    poster: 0,
    preload: 0,
    profile: 0,
    radioGroup: 0,
    readOnly: HAS_BOOLEAN_VALUE,
    referrerPolicy: 0,
    rel: 0,
    required: HAS_BOOLEAN_VALUE,
    reversed: HAS_BOOLEAN_VALUE,
    role: 0,
    rows: HAS_POSITIVE_NUMERIC_VALUE,
    rowSpan: HAS_NUMERIC_VALUE,
    sandbox: 0,
    scope: 0,
    scoped: HAS_BOOLEAN_VALUE,
    scrolling: 0,
    seamless: HAS_BOOLEAN_VALUE,
    selected: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
    shape: 0,
    size: HAS_POSITIVE_NUMERIC_VALUE,
    sizes: 0,
    span: HAS_POSITIVE_NUMERIC_VALUE,
    spellCheck: 0,
    src: 0,
    srcDoc: 0,
    srcLang: 0,
    srcSet: 0,
    start: HAS_NUMERIC_VALUE,
    step: 0,
    style: 0,
    summary: 0,
    tabIndex: 0,
    target: 0,
    title: 0,
    // Setting .type throws on non-<input> tags
    type: 0,
    useMap: 0,
    value: 0,
    width: 0,
    wmode: 0,
    wrap: 0,

    /**
     * RDFa Properties
     */
    about: 0,
    datatype: 0,
    inlist: 0,
    prefix: 0,
    // property is also supported for OpenGraph in meta tags.
    property: 0,
    resource: 0,
    'typeof': 0,
    vocab: 0,

    /**
     * Non-standard Properties
     */
    // autoCapitalize and autoCorrect are supported in Mobile Safari for
    // keyboard hints.
    autoCapitalize: 0,
    autoCorrect: 0,
    // autoSave allows WebKit/Blink to persist values of input fields on page reloads
    autoSave: 0,
    // color is for Safari mask-icon link
    color: 0,
    // itemProp, itemScope, itemType are for
    // Microdata support. See http://schema.org/docs/gs.html
    itemProp: 0,
    itemScope: HAS_BOOLEAN_VALUE,
    itemType: 0,
    // itemID and itemRef are for Microdata support as well but
    // only specified in the WHATWG spec document. See
    // https://html.spec.whatwg.org/multipage/microdata.html#microdata-dom-api
    itemID: 0,
    itemRef: 0,
    // results show looking glass icon and recent searches on input
    // search fields in WebKit/Blink
    results: 0,
    // IE-only attribute that specifies security restrictions on an iframe
    // as an alternative to the sandbox attribute on IE<10
    security: 0,
    // IE-only attribute that controls focus behavior
    unselectable: 0
  },
  DOMAttributeNames: {
    acceptCharset: 'accept-charset',
    className: 'class',
    htmlFor: 'for',
    httpEquiv: 'http-equiv'
  },
  DOMPropertyNames: {}
};

module.exports = HTMLDOMPropertyConfig;
},{"./DOMProperty":70}],81:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

'use strict';

/**
 * Escape and wrap key so it is safe to use as a reactid
 *
 * @param {string} key to be escaped.
 * @return {string} the escaped key.
 */

function escape(key) {
  var escapeRegex = /[=:]/g;
  var escaperLookup = {
    '=': '=0',
    ':': '=2'
  };
  var escapedString = ('' + key).replace(escapeRegex, function (match) {
    return escaperLookup[match];
  });

  return '$' + escapedString;
}

/**
 * Unescape and unwrap key for human-readable display
 *
 * @param {string} key to unescape.
 * @return {string} the unescaped key.
 */
function unescape(key) {
  var unescapeRegex = /(=0|=2)/g;
  var unescaperLookup = {
    '=0': '=',
    '=2': ':'
  };
  var keySubstring = key[0] === '.' && key[1] === '$' ? key.substring(2) : key.substring(1);

  return ('' + keySubstring).replace(unescapeRegex, function (match) {
    return unescaperLookup[match];
  });
}

var KeyEscapeUtils = {
  escape: escape,
  unescape: unescape
};

module.exports = KeyEscapeUtils;
},{}],82:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var _prodInvariant = require('./reactProdInvariant');

var React = require('react/lib/React');
var ReactPropTypesSecret = require('./ReactPropTypesSecret');

var invariant = require('fbjs/lib/invariant');
var warning = require('fbjs/lib/warning');

var hasReadOnlyValue = {
  'button': true,
  'checkbox': true,
  'image': true,
  'hidden': true,
  'radio': true,
  'reset': true,
  'submit': true
};

function _assertSingleLink(inputProps) {
  !(inputProps.checkedLink == null || inputProps.valueLink == null) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Cannot provide a checkedLink and a valueLink. If you want to use checkedLink, you probably don\'t want to use valueLink and vice versa.') : _prodInvariant('87') : void 0;
}
function _assertValueLink(inputProps) {
  _assertSingleLink(inputProps);
  !(inputProps.value == null && inputProps.onChange == null) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Cannot provide a valueLink and a value or onChange event. If you want to use value or onChange, you probably don\'t want to use valueLink.') : _prodInvariant('88') : void 0;
}

function _assertCheckedLink(inputProps) {
  _assertSingleLink(inputProps);
  !(inputProps.checked == null && inputProps.onChange == null) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Cannot provide a checkedLink and a checked property or onChange event. If you want to use checked or onChange, you probably don\'t want to use checkedLink') : _prodInvariant('89') : void 0;
}

var propTypes = {
  value: function (props, propName, componentName) {
    if (!props[propName] || hasReadOnlyValue[props.type] || props.onChange || props.readOnly || props.disabled) {
      return null;
    }
    return new Error('You provided a `value` prop to a form field without an ' + '`onChange` handler. This will render a read-only field. If ' + 'the field should be mutable use `defaultValue`. Otherwise, ' + 'set either `onChange` or `readOnly`.');
  },
  checked: function (props, propName, componentName) {
    if (!props[propName] || props.onChange || props.readOnly || props.disabled) {
      return null;
    }
    return new Error('You provided a `checked` prop to a form field without an ' + '`onChange` handler. This will render a read-only field. If ' + 'the field should be mutable use `defaultChecked`. Otherwise, ' + 'set either `onChange` or `readOnly`.');
  },
  onChange: React.PropTypes.func
};

var loggedTypeFailures = {};
function getDeclarationErrorAddendum(owner) {
  if (owner) {
    var name = owner.getName();
    if (name) {
      return ' Check the render method of `' + name + '`.';
    }
  }
  return '';
}

/**
 * Provide a linked `value` attribute for controlled forms. You should not use
 * this outside of the ReactDOM controlled form components.
 */
var LinkedValueUtils = {
  checkPropTypes: function (tagName, props, owner) {
    for (var propName in propTypes) {
      if (propTypes.hasOwnProperty(propName)) {
        var error = propTypes[propName](props, propName, tagName, 'prop', null, ReactPropTypesSecret);
      }
      if (error instanceof Error && !(error.message in loggedTypeFailures)) {
        // Only monitor this failure once because there tends to be a lot of the
        // same error.
        loggedTypeFailures[error.message] = true;

        var addendum = getDeclarationErrorAddendum(owner);
        process.env.NODE_ENV !== 'production' ? warning(false, 'Failed form propType: %s%s', error.message, addendum) : void 0;
      }
    }
  },

  /**
   * @param {object} inputProps Props for form component
   * @return {*} current value of the input either from value prop or link.
   */
  getValue: function (inputProps) {
    if (inputProps.valueLink) {
      _assertValueLink(inputProps);
      return inputProps.valueLink.value;
    }
    return inputProps.value;
  },

  /**
   * @param {object} inputProps Props for form component
   * @return {*} current checked status of the input either from checked prop
   *             or link.
   */
  getChecked: function (inputProps) {
    if (inputProps.checkedLink) {
      _assertCheckedLink(inputProps);
      return inputProps.checkedLink.value;
    }
    return inputProps.checked;
  },

  /**
   * @param {object} inputProps Props for form component
   * @param {SyntheticEvent} event change event to handle
   */
  executeOnChange: function (inputProps, event) {
    if (inputProps.valueLink) {
      _assertValueLink(inputProps);
      return inputProps.valueLink.requestChange(event.target.value);
    } else if (inputProps.checkedLink) {
      _assertCheckedLink(inputProps);
      return inputProps.checkedLink.requestChange(event.target.checked);
    } else if (inputProps.onChange) {
      return inputProps.onChange.call(undefined, event);
    }
  }
};

module.exports = LinkedValueUtils;
}).call(this,require('_process'))
},{"./ReactPropTypesSecret":129,"./reactProdInvariant":179,"_process":58,"fbjs/lib/invariant":17,"fbjs/lib/warning":24,"react/lib/React":188}],83:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

'use strict';

var _prodInvariant = require('./reactProdInvariant');

var invariant = require('fbjs/lib/invariant');

/**
 * Static poolers. Several custom versions for each potential number of
 * arguments. A completely generic pooler is easy to implement, but would
 * require accessing the `arguments` object. In each of these, `this` refers to
 * the Class itself, not an instance. If any others are needed, simply add them
 * here, or in their own files.
 */
var oneArgumentPooler = function (copyFieldsFrom) {
  var Klass = this;
  if (Klass.instancePool.length) {
    var instance = Klass.instancePool.pop();
    Klass.call(instance, copyFieldsFrom);
    return instance;
  } else {
    return new Klass(copyFieldsFrom);
  }
};

var twoArgumentPooler = function (a1, a2) {
  var Klass = this;
  if (Klass.instancePool.length) {
    var instance = Klass.instancePool.pop();
    Klass.call(instance, a1, a2);
    return instance;
  } else {
    return new Klass(a1, a2);
  }
};

var threeArgumentPooler = function (a1, a2, a3) {
  var Klass = this;
  if (Klass.instancePool.length) {
    var instance = Klass.instancePool.pop();
    Klass.call(instance, a1, a2, a3);
    return instance;
  } else {
    return new Klass(a1, a2, a3);
  }
};

var fourArgumentPooler = function (a1, a2, a3, a4) {
  var Klass = this;
  if (Klass.instancePool.length) {
    var instance = Klass.instancePool.pop();
    Klass.call(instance, a1, a2, a3, a4);
    return instance;
  } else {
    return new Klass(a1, a2, a3, a4);
  }
};

var standardReleaser = function (instance) {
  var Klass = this;
  !(instance instanceof Klass) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Trying to release an instance into a pool of a different type.') : _prodInvariant('25') : void 0;
  instance.destructor();
  if (Klass.instancePool.length < Klass.poolSize) {
    Klass.instancePool.push(instance);
  }
};

var DEFAULT_POOL_SIZE = 10;
var DEFAULT_POOLER = oneArgumentPooler;

/**
 * Augments `CopyConstructor` to be a poolable class, augmenting only the class
 * itself (statically) not adding any prototypical fields. Any CopyConstructor
 * you give this may have a `poolSize` property, and will look for a
 * prototypical `destructor` on instances.
 *
 * @param {Function} CopyConstructor Constructor that can be used to reset.
 * @param {Function} pooler Customizable pooler.
 */
var addPoolingTo = function (CopyConstructor, pooler) {
  // Casting as any so that flow ignores the actual implementation and trusts
  // it to match the type we declared
  var NewKlass = CopyConstructor;
  NewKlass.instancePool = [];
  NewKlass.getPooled = pooler || DEFAULT_POOLER;
  if (!NewKlass.poolSize) {
    NewKlass.poolSize = DEFAULT_POOL_SIZE;
  }
  NewKlass.release = standardReleaser;
  return NewKlass;
};

var PooledClass = {
  addPoolingTo: addPoolingTo,
  oneArgumentPooler: oneArgumentPooler,
  twoArgumentPooler: twoArgumentPooler,
  threeArgumentPooler: threeArgumentPooler,
  fourArgumentPooler: fourArgumentPooler
};

module.exports = PooledClass;
}).call(this,require('_process'))
},{"./reactProdInvariant":179,"_process":58,"fbjs/lib/invariant":17}],84:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var _assign = require('object-assign');

var EventPluginRegistry = require('./EventPluginRegistry');
var ReactEventEmitterMixin = require('./ReactEventEmitterMixin');
var ViewportMetrics = require('./ViewportMetrics');

var getVendorPrefixedEventName = require('./getVendorPrefixedEventName');
var isEventSupported = require('./isEventSupported');

/**
 * Summary of `ReactBrowserEventEmitter` event handling:
 *
 *  - Top-level delegation is used to trap most native browser events. This
 *    may only occur in the main thread and is the responsibility of
 *    ReactEventListener, which is injected and can therefore support pluggable
 *    event sources. This is the only work that occurs in the main thread.
 *
 *  - We normalize and de-duplicate events to account for browser quirks. This
 *    may be done in the worker thread.
 *
 *  - Forward these native events (with the associated top-level type used to
 *    trap it) to `EventPluginHub`, which in turn will ask plugins if they want
 *    to extract any synthetic events.
 *
 *  - The `EventPluginHub` will then process each event by annotating them with
 *    "dispatches", a sequence of listeners and IDs that care about that event.
 *
 *  - The `EventPluginHub` then dispatches the events.
 *
 * Overview of React and the event system:
 *
 * +------------+    .
 * |    DOM     |    .
 * +------------+    .
 *       |           .
 *       v           .
 * +------------+    .
 * | ReactEvent |    .
 * |  Listener  |    .
 * +------------+    .                         +-----------+
 *       |           .               +--------+|SimpleEvent|
 *       |           .               |         |Plugin     |
 * +-----|------+    .               v         +-----------+
 * |     |      |    .    +--------------+                    +------------+
 * |     +-----------.--->|EventPluginHub|                    |    Event   |
 * |            |    .    |              |     +-----------+  | Propagators|
 * | ReactEvent |    .    |              |     |TapEvent   |  |------------|
 * |  Emitter   |    .    |              |<---+|Plugin     |  |other plugin|
 * |            |    .    |              |     +-----------+  |  utilities |
 * |     +-----------.--->|              |                    +------------+
 * |     |      |    .    +--------------+
 * +-----|------+    .                ^        +-----------+
 *       |           .                |        |Enter/Leave|
 *       +           .                +-------+|Plugin     |
 * +-------------+   .                         +-----------+
 * | application |   .
 * |-------------|   .
 * |             |   .
 * |             |   .
 * +-------------+   .
 *                   .
 *    React Core     .  General Purpose Event Plugin System
 */

var hasEventPageXY;
var alreadyListeningTo = {};
var isMonitoringScrollValue = false;
var reactTopListenersCounter = 0;

// For events like 'submit' which don't consistently bubble (which we trap at a
// lower node than `document`), binding at `document` would cause duplicate
// events so we don't include them here
var topEventMapping = {
  topAbort: 'abort',
  topAnimationEnd: getVendorPrefixedEventName('animationend') || 'animationend',
  topAnimationIteration: getVendorPrefixedEventName('animationiteration') || 'animationiteration',
  topAnimationStart: getVendorPrefixedEventName('animationstart') || 'animationstart',
  topBlur: 'blur',
  topCanPlay: 'canplay',
  topCanPlayThrough: 'canplaythrough',
  topChange: 'change',
  topClick: 'click',
  topCompositionEnd: 'compositionend',
  topCompositionStart: 'compositionstart',
  topCompositionUpdate: 'compositionupdate',
  topContextMenu: 'contextmenu',
  topCopy: 'copy',
  topCut: 'cut',
  topDoubleClick: 'dblclick',
  topDrag: 'drag',
  topDragEnd: 'dragend',
  topDragEnter: 'dragenter',
  topDragExit: 'dragexit',
  topDragLeave: 'dragleave',
  topDragOver: 'dragover',
  topDragStart: 'dragstart',
  topDrop: 'drop',
  topDurationChange: 'durationchange',
  topEmptied: 'emptied',
  topEncrypted: 'encrypted',
  topEnded: 'ended',
  topError: 'error',
  topFocus: 'focus',
  topInput: 'input',
  topKeyDown: 'keydown',
  topKeyPress: 'keypress',
  topKeyUp: 'keyup',
  topLoadedData: 'loadeddata',
  topLoadedMetadata: 'loadedmetadata',
  topLoadStart: 'loadstart',
  topMouseDown: 'mousedown',
  topMouseMove: 'mousemove',
  topMouseOut: 'mouseout',
  topMouseOver: 'mouseover',
  topMouseUp: 'mouseup',
  topPaste: 'paste',
  topPause: 'pause',
  topPlay: 'play',
  topPlaying: 'playing',
  topProgress: 'progress',
  topRateChange: 'ratechange',
  topScroll: 'scroll',
  topSeeked: 'seeked',
  topSeeking: 'seeking',
  topSelectionChange: 'selectionchange',
  topStalled: 'stalled',
  topSuspend: 'suspend',
  topTextInput: 'textInput',
  topTimeUpdate: 'timeupdate',
  topTouchCancel: 'touchcancel',
  topTouchEnd: 'touchend',
  topTouchMove: 'touchmove',
  topTouchStart: 'touchstart',
  topTransitionEnd: getVendorPrefixedEventName('transitionend') || 'transitionend',
  topVolumeChange: 'volumechange',
  topWaiting: 'waiting',
  topWheel: 'wheel'
};

/**
 * To ensure no conflicts with other potential React instances on the page
 */
var topListenersIDKey = '_reactListenersID' + String(Math.random()).slice(2);

function getListeningForDocument(mountAt) {
  // In IE8, `mountAt` is a host object and doesn't have `hasOwnProperty`
  // directly.
  if (!Object.prototype.hasOwnProperty.call(mountAt, topListenersIDKey)) {
    mountAt[topListenersIDKey] = reactTopListenersCounter++;
    alreadyListeningTo[mountAt[topListenersIDKey]] = {};
  }
  return alreadyListeningTo[mountAt[topListenersIDKey]];
}

/**
 * `ReactBrowserEventEmitter` is used to attach top-level event listeners. For
 * example:
 *
 *   EventPluginHub.putListener('myID', 'onClick', myFunction);
 *
 * This would allocate a "registration" of `('onClick', myFunction)` on 'myID'.
 *
 * @internal
 */
var ReactBrowserEventEmitter = _assign({}, ReactEventEmitterMixin, {

  /**
   * Injectable event backend
   */
  ReactEventListener: null,

  injection: {
    /**
     * @param {object} ReactEventListener
     */
    injectReactEventListener: function (ReactEventListener) {
      ReactEventListener.setHandleTopLevel(ReactBrowserEventEmitter.handleTopLevel);
      ReactBrowserEventEmitter.ReactEventListener = ReactEventListener;
    }
  },

  /**
   * Sets whether or not any created callbacks should be enabled.
   *
   * @param {boolean} enabled True if callbacks should be enabled.
   */
  setEnabled: function (enabled) {
    if (ReactBrowserEventEmitter.ReactEventListener) {
      ReactBrowserEventEmitter.ReactEventListener.setEnabled(enabled);
    }
  },

  /**
   * @return {boolean} True if callbacks are enabled.
   */
  isEnabled: function () {
    return !!(ReactBrowserEventEmitter.ReactEventListener && ReactBrowserEventEmitter.ReactEventListener.isEnabled());
  },

  /**
   * We listen for bubbled touch events on the document object.
   *
   * Firefox v8.01 (and possibly others) exhibited strange behavior when
   * mounting `onmousemove` events at some node that was not the document
   * element. The symptoms were that if your mouse is not moving over something
   * contained within that mount point (for example on the background) the
   * top-level listeners for `onmousemove` won't be called. However, if you
   * register the `mousemove` on the document object, then it will of course
   * catch all `mousemove`s. This along with iOS quirks, justifies restricting
   * top-level listeners to the document object only, at least for these
   * movement types of events and possibly all events.
   *
   * @see http://www.quirksmode.org/blog/archives/2010/09/click_event_del.html
   *
   * Also, `keyup`/`keypress`/`keydown` do not bubble to the window on IE, but
   * they bubble to document.
   *
   * @param {string} registrationName Name of listener (e.g. `onClick`).
   * @param {object} contentDocumentHandle Document which owns the container
   */
  listenTo: function (registrationName, contentDocumentHandle) {
    var mountAt = contentDocumentHandle;
    var isListening = getListeningForDocument(mountAt);
    var dependencies = EventPluginRegistry.registrationNameDependencies[registrationName];

    for (var i = 0; i < dependencies.length; i++) {
      var dependency = dependencies[i];
      if (!(isListening.hasOwnProperty(dependency) && isListening[dependency])) {
        if (dependency === 'topWheel') {
          if (isEventSupported('wheel')) {
            ReactBrowserEventEmitter.ReactEventListener.trapBubbledEvent('topWheel', 'wheel', mountAt);
          } else if (isEventSupported('mousewheel')) {
            ReactBrowserEventEmitter.ReactEventListener.trapBubbledEvent('topWheel', 'mousewheel', mountAt);
          } else {
            // Firefox needs to capture a different mouse scroll event.
            // @see http://www.quirksmode.org/dom/events/tests/scroll.html
            ReactBrowserEventEmitter.ReactEventListener.trapBubbledEvent('topWheel', 'DOMMouseScroll', mountAt);
          }
        } else if (dependency === 'topScroll') {

          if (isEventSupported('scroll', true)) {
            ReactBrowserEventEmitter.ReactEventListener.trapCapturedEvent('topScroll', 'scroll', mountAt);
          } else {
            ReactBrowserEventEmitter.ReactEventListener.trapBubbledEvent('topScroll', 'scroll', ReactBrowserEventEmitter.ReactEventListener.WINDOW_HANDLE);
          }
        } else if (dependency === 'topFocus' || dependency === 'topBlur') {

          if (isEventSupported('focus', true)) {
            ReactBrowserEventEmitter.ReactEventListener.trapCapturedEvent('topFocus', 'focus', mountAt);
            ReactBrowserEventEmitter.ReactEventListener.trapCapturedEvent('topBlur', 'blur', mountAt);
          } else if (isEventSupported('focusin')) {
            // IE has `focusin` and `focusout` events which bubble.
            // @see http://www.quirksmode.org/blog/archives/2008/04/delegating_the.html
            ReactBrowserEventEmitter.ReactEventListener.trapBubbledEvent('topFocus', 'focusin', mountAt);
            ReactBrowserEventEmitter.ReactEventListener.trapBubbledEvent('topBlur', 'focusout', mountAt);
          }

          // to make sure blur and focus event listeners are only attached once
          isListening.topBlur = true;
          isListening.topFocus = true;
        } else if (topEventMapping.hasOwnProperty(dependency)) {
          ReactBrowserEventEmitter.ReactEventListener.trapBubbledEvent(dependency, topEventMapping[dependency], mountAt);
        }

        isListening[dependency] = true;
      }
    }
  },

  trapBubbledEvent: function (topLevelType, handlerBaseName, handle) {
    return ReactBrowserEventEmitter.ReactEventListener.trapBubbledEvent(topLevelType, handlerBaseName, handle);
  },

  trapCapturedEvent: function (topLevelType, handlerBaseName, handle) {
    return ReactBrowserEventEmitter.ReactEventListener.trapCapturedEvent(topLevelType, handlerBaseName, handle);
  },

  /**
   * Protect against document.createEvent() returning null
   * Some popup blocker extensions appear to do this:
   * https://github.com/facebook/react/issues/6887
   */
  supportsEventPageXY: function () {
    if (!document.createEvent) {
      return false;
    }
    var ev = document.createEvent('MouseEvent');
    return ev != null && 'pageX' in ev;
  },

  /**
   * Listens to window scroll and resize events. We cache scroll values so that
   * application code can access them without triggering reflows.
   *
   * ViewportMetrics is only used by SyntheticMouse/TouchEvent and only when
   * pageX/pageY isn't supported (legacy browsers).
   *
   * NOTE: Scroll events do not bubble.
   *
   * @see http://www.quirksmode.org/dom/events/scroll.html
   */
  ensureScrollValueMonitoring: function () {
    if (hasEventPageXY === undefined) {
      hasEventPageXY = ReactBrowserEventEmitter.supportsEventPageXY();
    }
    if (!hasEventPageXY && !isMonitoringScrollValue) {
      var refresh = ViewportMetrics.refreshScrollValues;
      ReactBrowserEventEmitter.ReactEventListener.monitorScrollValue(refresh);
      isMonitoringScrollValue = true;
    }
  }

});

module.exports = ReactBrowserEventEmitter;
},{"./EventPluginRegistry":76,"./ReactEventEmitterMixin":113,"./ViewportMetrics":155,"./getVendorPrefixedEventName":174,"./isEventSupported":176,"object-assign":57}],85:[function(require,module,exports){
(function (process){
/**
 * Copyright 2014-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var ReactReconciler = require('./ReactReconciler');

var instantiateReactComponent = require('./instantiateReactComponent');
var KeyEscapeUtils = require('./KeyEscapeUtils');
var shouldUpdateReactComponent = require('./shouldUpdateReactComponent');
var traverseAllChildren = require('./traverseAllChildren');
var warning = require('fbjs/lib/warning');

var ReactComponentTreeHook;

if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'test') {
  // Temporary hack.
  // Inline requires don't work well with Jest:
  // https://github.com/facebook/react/issues/7240
  // Remove the inline requires when we don't need them anymore:
  // https://github.com/facebook/react/pull/7178
  ReactComponentTreeHook = require('react/lib/ReactComponentTreeHook');
}

function instantiateChild(childInstances, child, name, selfDebugID) {
  // We found a component instance.
  var keyUnique = childInstances[name] === undefined;
  if (process.env.NODE_ENV !== 'production') {
    if (!ReactComponentTreeHook) {
      ReactComponentTreeHook = require('react/lib/ReactComponentTreeHook');
    }
    if (!keyUnique) {
      process.env.NODE_ENV !== 'production' ? warning(false, 'flattenChildren(...): Encountered two children with the same key, ' + '`%s`. Child keys must be unique; when two children share a key, only ' + 'the first child will be used.%s', KeyEscapeUtils.unescape(name), ReactComponentTreeHook.getStackAddendumByID(selfDebugID)) : void 0;
    }
  }
  if (child != null && keyUnique) {
    childInstances[name] = instantiateReactComponent(child, true);
  }
}

/**
 * ReactChildReconciler provides helpers for initializing or updating a set of
 * children. Its output is suitable for passing it onto ReactMultiChild which
 * does diffed reordering and insertion.
 */
var ReactChildReconciler = {
  /**
   * Generates a "mount image" for each of the supplied children. In the case
   * of `ReactDOMComponent`, a mount image is a string of markup.
   *
   * @param {?object} nestedChildNodes Nested child maps.
   * @return {?object} A set of child instances.
   * @internal
   */
  instantiateChildren: function (nestedChildNodes, transaction, context, selfDebugID // 0 in production and for roots
  ) {
    if (nestedChildNodes == null) {
      return null;
    }
    var childInstances = {};

    if (process.env.NODE_ENV !== 'production') {
      traverseAllChildren(nestedChildNodes, function (childInsts, child, name) {
        return instantiateChild(childInsts, child, name, selfDebugID);
      }, childInstances);
    } else {
      traverseAllChildren(nestedChildNodes, instantiateChild, childInstances);
    }
    return childInstances;
  },

  /**
   * Updates the rendered children and returns a new set of children.
   *
   * @param {?object} prevChildren Previously initialized set of children.
   * @param {?object} nextChildren Flat child element maps.
   * @param {ReactReconcileTransaction} transaction
   * @param {object} context
   * @return {?object} A new set of child instances.
   * @internal
   */
  updateChildren: function (prevChildren, nextChildren, mountImages, removedNodes, transaction, hostParent, hostContainerInfo, context, selfDebugID // 0 in production and for roots
  ) {
    // We currently don't have a way to track moves here but if we use iterators
    // instead of for..in we can zip the iterators and check if an item has
    // moved.
    // TODO: If nothing has changed, return the prevChildren object so that we
    // can quickly bailout if nothing has changed.
    if (!nextChildren && !prevChildren) {
      return;
    }
    var name;
    var prevChild;
    for (name in nextChildren) {
      if (!nextChildren.hasOwnProperty(name)) {
        continue;
      }
      prevChild = prevChildren && prevChildren[name];
      var prevElement = prevChild && prevChild._currentElement;
      var nextElement = nextChildren[name];
      if (prevChild != null && shouldUpdateReactComponent(prevElement, nextElement)) {
        ReactReconciler.receiveComponent(prevChild, nextElement, transaction, context);
        nextChildren[name] = prevChild;
      } else {
        if (prevChild) {
          removedNodes[name] = ReactReconciler.getHostNode(prevChild);
          ReactReconciler.unmountComponent(prevChild, false);
        }
        // The child must be instantiated before it's mounted.
        var nextChildInstance = instantiateReactComponent(nextElement, true);
        nextChildren[name] = nextChildInstance;
        // Creating mount image now ensures refs are resolved in right order
        // (see https://github.com/facebook/react/pull/7101 for explanation).
        var nextChildMountImage = ReactReconciler.mountComponent(nextChildInstance, transaction, hostParent, hostContainerInfo, context, selfDebugID);
        mountImages.push(nextChildMountImage);
      }
    }
    // Unmount children that are no longer present.
    for (name in prevChildren) {
      if (prevChildren.hasOwnProperty(name) && !(nextChildren && nextChildren.hasOwnProperty(name))) {
        prevChild = prevChildren[name];
        removedNodes[name] = ReactReconciler.getHostNode(prevChild);
        ReactReconciler.unmountComponent(prevChild, false);
      }
    }
  },

  /**
   * Unmounts all rendered children. This should be used to clean up children
   * when this component is unmounted.
   *
   * @param {?object} renderedChildren Previously initialized set of children.
   * @internal
   */
  unmountChildren: function (renderedChildren, safely) {
    for (var name in renderedChildren) {
      if (renderedChildren.hasOwnProperty(name)) {
        var renderedChild = renderedChildren[name];
        ReactReconciler.unmountComponent(renderedChild, safely);
      }
    }
  }

};

module.exports = ReactChildReconciler;
}).call(this,require('_process'))
},{"./KeyEscapeUtils":81,"./ReactReconciler":131,"./instantiateReactComponent":175,"./shouldUpdateReactComponent":183,"./traverseAllChildren":184,"_process":58,"fbjs/lib/warning":24,"react/lib/ReactComponentTreeHook":192}],86:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var DOMChildrenOperations = require('./DOMChildrenOperations');
var ReactDOMIDOperations = require('./ReactDOMIDOperations');

/**
 * Abstracts away all functionality of the reconciler that requires knowledge of
 * the browser context. TODO: These callers should be refactored to avoid the
 * need for this injection.
 */
var ReactComponentBrowserEnvironment = {

  processChildrenUpdates: ReactDOMIDOperations.dangerouslyProcessChildrenUpdates,

  replaceNodeWithMarkup: DOMChildrenOperations.dangerouslyReplaceNodeWithMarkup

};

module.exports = ReactComponentBrowserEnvironment;
},{"./DOMChildrenOperations":67,"./ReactDOMIDOperations":96}],87:[function(require,module,exports){
(function (process){
/**
 * Copyright 2014-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

'use strict';

var _prodInvariant = require('./reactProdInvariant');

var invariant = require('fbjs/lib/invariant');

var injected = false;

var ReactComponentEnvironment = {

  /**
   * Optionally injectable hook for swapping out mount images in the middle of
   * the tree.
   */
  replaceNodeWithMarkup: null,

  /**
   * Optionally injectable hook for processing a queue of child updates. Will
   * later move into MultiChildComponents.
   */
  processChildrenUpdates: null,

  injection: {
    injectEnvironment: function (environment) {
      !!injected ? process.env.NODE_ENV !== 'production' ? invariant(false, 'ReactCompositeComponent: injectEnvironment() can only be called once.') : _prodInvariant('104') : void 0;
      ReactComponentEnvironment.replaceNodeWithMarkup = environment.replaceNodeWithMarkup;
      ReactComponentEnvironment.processChildrenUpdates = environment.processChildrenUpdates;
      injected = true;
    }
  }

};

module.exports = ReactComponentEnvironment;
}).call(this,require('_process'))
},{"./reactProdInvariant":179,"_process":58,"fbjs/lib/invariant":17}],88:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var _prodInvariant = require('./reactProdInvariant'),
    _assign = require('object-assign');

var React = require('react/lib/React');
var ReactComponentEnvironment = require('./ReactComponentEnvironment');
var ReactCurrentOwner = require('react/lib/ReactCurrentOwner');
var ReactErrorUtils = require('./ReactErrorUtils');
var ReactInstanceMap = require('./ReactInstanceMap');
var ReactInstrumentation = require('./ReactInstrumentation');
var ReactNodeTypes = require('./ReactNodeTypes');
var ReactReconciler = require('./ReactReconciler');

if (process.env.NODE_ENV !== 'production') {
  var checkReactTypeSpec = require('./checkReactTypeSpec');
}

var emptyObject = require('fbjs/lib/emptyObject');
var invariant = require('fbjs/lib/invariant');
var shallowEqual = require('fbjs/lib/shallowEqual');
var shouldUpdateReactComponent = require('./shouldUpdateReactComponent');
var warning = require('fbjs/lib/warning');

var CompositeTypes = {
  ImpureClass: 0,
  PureClass: 1,
  StatelessFunctional: 2
};

function StatelessComponent(Component) {}
StatelessComponent.prototype.render = function () {
  var Component = ReactInstanceMap.get(this)._currentElement.type;
  var element = Component(this.props, this.context, this.updater);
  warnIfInvalidElement(Component, element);
  return element;
};

function warnIfInvalidElement(Component, element) {
  if (process.env.NODE_ENV !== 'production') {
    process.env.NODE_ENV !== 'production' ? warning(element === null || element === false || React.isValidElement(element), '%s(...): A valid React element (or null) must be returned. You may have ' + 'returned undefined, an array or some other invalid object.', Component.displayName || Component.name || 'Component') : void 0;
    process.env.NODE_ENV !== 'production' ? warning(!Component.childContextTypes, '%s(...): childContextTypes cannot be defined on a functional component.', Component.displayName || Component.name || 'Component') : void 0;
  }
}

function shouldConstruct(Component) {
  return !!(Component.prototype && Component.prototype.isReactComponent);
}

function isPureComponent(Component) {
  return !!(Component.prototype && Component.prototype.isPureReactComponent);
}

// Separated into a function to contain deoptimizations caused by try/finally.
function measureLifeCyclePerf(fn, debugID, timerType) {
  if (debugID === 0) {
    // Top-level wrappers (see ReactMount) and empty components (see
    // ReactDOMEmptyComponent) are invisible to hooks and devtools.
    // Both are implementation details that should go away in the future.
    return fn();
  }

  ReactInstrumentation.debugTool.onBeginLifeCycleTimer(debugID, timerType);
  try {
    return fn();
  } finally {
    ReactInstrumentation.debugTool.onEndLifeCycleTimer(debugID, timerType);
  }
}

/**
 * ------------------ The Life-Cycle of a Composite Component ------------------
 *
 * - constructor: Initialization of state. The instance is now retained.
 *   - componentWillMount
 *   - render
 *   - [children's constructors]
 *     - [children's componentWillMount and render]
 *     - [children's componentDidMount]
 *     - componentDidMount
 *
 *       Update Phases:
 *       - componentWillReceiveProps (only called if parent updated)
 *       - shouldComponentUpdate
 *         - componentWillUpdate
 *           - render
 *           - [children's constructors or receive props phases]
 *         - componentDidUpdate
 *
 *     - componentWillUnmount
 *     - [children's componentWillUnmount]
 *   - [children destroyed]
 * - (destroyed): The instance is now blank, released by React and ready for GC.
 *
 * -----------------------------------------------------------------------------
 */

/**
 * An incrementing ID assigned to each component when it is mounted. This is
 * used to enforce the order in which `ReactUpdates` updates dirty components.
 *
 * @private
 */
var nextMountID = 1;

/**
 * @lends {ReactCompositeComponent.prototype}
 */
var ReactCompositeComponent = {

  /**
   * Base constructor for all composite component.
   *
   * @param {ReactElement} element
   * @final
   * @internal
   */
  construct: function (element) {
    this._currentElement = element;
    this._rootNodeID = 0;
    this._compositeType = null;
    this._instance = null;
    this._hostParent = null;
    this._hostContainerInfo = null;

    // See ReactUpdateQueue
    this._updateBatchNumber = null;
    this._pendingElement = null;
    this._pendingStateQueue = null;
    this._pendingReplaceState = false;
    this._pendingForceUpdate = false;

    this._renderedNodeType = null;
    this._renderedComponent = null;
    this._context = null;
    this._mountOrder = 0;
    this._topLevelWrapper = null;

    // See ReactUpdates and ReactUpdateQueue.
    this._pendingCallbacks = null;

    // ComponentWillUnmount shall only be called once
    this._calledComponentWillUnmount = false;

    if (process.env.NODE_ENV !== 'production') {
      this._warnedAboutRefsInRender = false;
    }
  },

  /**
   * Initializes the component, renders markup, and registers event listeners.
   *
   * @param {ReactReconcileTransaction|ReactServerRenderingTransaction} transaction
   * @param {?object} hostParent
   * @param {?object} hostContainerInfo
   * @param {?object} context
   * @return {?string} Rendered markup to be inserted into the DOM.
   * @final
   * @internal
   */
  mountComponent: function (transaction, hostParent, hostContainerInfo, context) {
    var _this = this;

    this._context = context;
    this._mountOrder = nextMountID++;
    this._hostParent = hostParent;
    this._hostContainerInfo = hostContainerInfo;

    var publicProps = this._currentElement.props;
    var publicContext = this._processContext(context);

    var Component = this._currentElement.type;

    var updateQueue = transaction.getUpdateQueue();

    // Initialize the public class
    var doConstruct = shouldConstruct(Component);
    var inst = this._constructComponent(doConstruct, publicProps, publicContext, updateQueue);
    var renderedElement;

    // Support functional components
    if (!doConstruct && (inst == null || inst.render == null)) {
      renderedElement = inst;
      warnIfInvalidElement(Component, renderedElement);
      !(inst === null || inst === false || React.isValidElement(inst)) ? process.env.NODE_ENV !== 'production' ? invariant(false, '%s(...): A valid React element (or null) must be returned. You may have returned undefined, an array or some other invalid object.', Component.displayName || Component.name || 'Component') : _prodInvariant('105', Component.displayName || Component.name || 'Component') : void 0;
      inst = new StatelessComponent(Component);
      this._compositeType = CompositeTypes.StatelessFunctional;
    } else {
      if (isPureComponent(Component)) {
        this._compositeType = CompositeTypes.PureClass;
      } else {
        this._compositeType = CompositeTypes.ImpureClass;
      }
    }

    if (process.env.NODE_ENV !== 'production') {
      // This will throw later in _renderValidatedComponent, but add an early
      // warning now to help debugging
      if (inst.render == null) {
        process.env.NODE_ENV !== 'production' ? warning(false, '%s(...): No `render` method found on the returned component ' + 'instance: you may have forgotten to define `render`.', Component.displayName || Component.name || 'Component') : void 0;
      }

      var propsMutated = inst.props !== publicProps;
      var componentName = Component.displayName || Component.name || 'Component';

      process.env.NODE_ENV !== 'production' ? warning(inst.props === undefined || !propsMutated, '%s(...): When calling super() in `%s`, make sure to pass ' + 'up the same props that your component\'s constructor was passed.', componentName, componentName) : void 0;
    }

    // These should be set up in the constructor, but as a convenience for
    // simpler class abstractions, we set them up after the fact.
    inst.props = publicProps;
    inst.context = publicContext;
    inst.refs = emptyObject;
    inst.updater = updateQueue;

    this._instance = inst;

    // Store a reference from the instance back to the internal representation
    ReactInstanceMap.set(inst, this);

    if (process.env.NODE_ENV !== 'production') {
      // Since plain JS classes are defined without any special initialization
      // logic, we can not catch common errors early. Therefore, we have to
      // catch them here, at initialization time, instead.
      process.env.NODE_ENV !== 'production' ? warning(!inst.getInitialState || inst.getInitialState.isReactClassApproved || inst.state, 'getInitialState was defined on %s, a plain JavaScript class. ' + 'This is only supported for classes created using React.createClass. ' + 'Did you mean to define a state property instead?', this.getName() || 'a component') : void 0;
      process.env.NODE_ENV !== 'production' ? warning(!inst.getDefaultProps || inst.getDefaultProps.isReactClassApproved, 'getDefaultProps was defined on %s, a plain JavaScript class. ' + 'This is only supported for classes created using React.createClass. ' + 'Use a static property to define defaultProps instead.', this.getName() || 'a component') : void 0;
      process.env.NODE_ENV !== 'production' ? warning(!inst.propTypes, 'propTypes was defined as an instance property on %s. Use a static ' + 'property to define propTypes instead.', this.getName() || 'a component') : void 0;
      process.env.NODE_ENV !== 'production' ? warning(!inst.contextTypes, 'contextTypes was defined as an instance property on %s. Use a ' + 'static property to define contextTypes instead.', this.getName() || 'a component') : void 0;
      process.env.NODE_ENV !== 'production' ? warning(typeof inst.componentShouldUpdate !== 'function', '%s has a method called ' + 'componentShouldUpdate(). Did you mean shouldComponentUpdate()? ' + 'The name is phrased as a question because the function is ' + 'expected to return a value.', this.getName() || 'A component') : void 0;
      process.env.NODE_ENV !== 'production' ? warning(typeof inst.componentDidUnmount !== 'function', '%s has a method called ' + 'componentDidUnmount(). But there is no such lifecycle method. ' + 'Did you mean componentWillUnmount()?', this.getName() || 'A component') : void 0;
      process.env.NODE_ENV !== 'production' ? warning(typeof inst.componentWillRecieveProps !== 'function', '%s has a method called ' + 'componentWillRecieveProps(). Did you mean componentWillReceiveProps()?', this.getName() || 'A component') : void 0;
    }

    var initialState = inst.state;
    if (initialState === undefined) {
      inst.state = initialState = null;
    }
    !(typeof initialState === 'object' && !Array.isArray(initialState)) ? process.env.NODE_ENV !== 'production' ? invariant(false, '%s.state: must be set to an object or null', this.getName() || 'ReactCompositeComponent') : _prodInvariant('106', this.getName() || 'ReactCompositeComponent') : void 0;

    this._pendingStateQueue = null;
    this._pendingReplaceState = false;
    this._pendingForceUpdate = false;

    var markup;
    if (inst.unstable_handleError) {
      markup = this.performInitialMountWithErrorHandling(renderedElement, hostParent, hostContainerInfo, transaction, context);
    } else {
      markup = this.performInitialMount(renderedElement, hostParent, hostContainerInfo, transaction, context);
    }

    if (inst.componentDidMount) {
      if (process.env.NODE_ENV !== 'production') {
        transaction.getReactMountReady().enqueue(function () {
          measureLifeCyclePerf(function () {
            return inst.componentDidMount();
          }, _this._debugID, 'componentDidMount');
        });
      } else {
        transaction.getReactMountReady().enqueue(inst.componentDidMount, inst);
      }
    }

    return markup;
  },

  _constructComponent: function (doConstruct, publicProps, publicContext, updateQueue) {
    if (process.env.NODE_ENV !== 'production') {
      ReactCurrentOwner.current = this;
      try {
        return this._constructComponentWithoutOwner(doConstruct, publicProps, publicContext, updateQueue);
      } finally {
        ReactCurrentOwner.current = null;
      }
    } else {
      return this._constructComponentWithoutOwner(doConstruct, publicProps, publicContext, updateQueue);
    }
  },

  _constructComponentWithoutOwner: function (doConstruct, publicProps, publicContext, updateQueue) {
    var Component = this._currentElement.type;

    if (doConstruct) {
      if (process.env.NODE_ENV !== 'production') {
        return measureLifeCyclePerf(function () {
          return new Component(publicProps, publicContext, updateQueue);
        }, this._debugID, 'ctor');
      } else {
        return new Component(publicProps, publicContext, updateQueue);
      }
    }

    // This can still be an instance in case of factory components
    // but we'll count this as time spent rendering as the more common case.
    if (process.env.NODE_ENV !== 'production') {
      return measureLifeCyclePerf(function () {
        return Component(publicProps, publicContext, updateQueue);
      }, this._debugID, 'render');
    } else {
      return Component(publicProps, publicContext, updateQueue);
    }
  },

  performInitialMountWithErrorHandling: function (renderedElement, hostParent, hostContainerInfo, transaction, context) {
    var markup;
    var checkpoint = transaction.checkpoint();
    try {
      markup = this.performInitialMount(renderedElement, hostParent, hostContainerInfo, transaction, context);
    } catch (e) {
      // Roll back to checkpoint, handle error (which may add items to the transaction), and take a new checkpoint
      transaction.rollback(checkpoint);
      this._instance.unstable_handleError(e);
      if (this._pendingStateQueue) {
        this._instance.state = this._processPendingState(this._instance.props, this._instance.context);
      }
      checkpoint = transaction.checkpoint();

      this._renderedComponent.unmountComponent(true);
      transaction.rollback(checkpoint);

      // Try again - we've informed the component about the error, so they can render an error message this time.
      // If this throws again, the error will bubble up (and can be caught by a higher error boundary).
      markup = this.performInitialMount(renderedElement, hostParent, hostContainerInfo, transaction, context);
    }
    return markup;
  },

  performInitialMount: function (renderedElement, hostParent, hostContainerInfo, transaction, context) {
    var inst = this._instance;

    var debugID = 0;
    if (process.env.NODE_ENV !== 'production') {
      debugID = this._debugID;
    }

    if (inst.componentWillMount) {
      if (process.env.NODE_ENV !== 'production') {
        measureLifeCyclePerf(function () {
          return inst.componentWillMount();
        }, debugID, 'componentWillMount');
      } else {
        inst.componentWillMount();
      }
      // When mounting, calls to `setState` by `componentWillMount` will set
      // `this._pendingStateQueue` without triggering a re-render.
      if (this._pendingStateQueue) {
        inst.state = this._processPendingState(inst.props, inst.context);
      }
    }

    // If not a stateless component, we now render
    if (renderedElement === undefined) {
      renderedElement = this._renderValidatedComponent();
    }

    var nodeType = ReactNodeTypes.getType(renderedElement);
    this._renderedNodeType = nodeType;
    var child = this._instantiateReactComponent(renderedElement, nodeType !== ReactNodeTypes.EMPTY /* shouldHaveDebugID */
    );
    this._renderedComponent = child;

    var markup = ReactReconciler.mountComponent(child, transaction, hostParent, hostContainerInfo, this._processChildContext(context), debugID);

    if (process.env.NODE_ENV !== 'production') {
      if (debugID !== 0) {
        var childDebugIDs = child._debugID !== 0 ? [child._debugID] : [];
        ReactInstrumentation.debugTool.onSetChildren(debugID, childDebugIDs);
      }
    }

    return markup;
  },

  getHostNode: function () {
    return ReactReconciler.getHostNode(this._renderedComponent);
  },

  /**
   * Releases any resources allocated by `mountComponent`.
   *
   * @final
   * @internal
   */
  unmountComponent: function (safely) {
    if (!this._renderedComponent) {
      return;
    }

    var inst = this._instance;

    if (inst.componentWillUnmount && !inst._calledComponentWillUnmount) {
      inst._calledComponentWillUnmount = true;

      if (safely) {
        var name = this.getName() + '.componentWillUnmount()';
        ReactErrorUtils.invokeGuardedCallback(name, inst.componentWillUnmount.bind(inst));
      } else {
        if (process.env.NODE_ENV !== 'production') {
          measureLifeCyclePerf(function () {
            return inst.componentWillUnmount();
          }, this._debugID, 'componentWillUnmount');
        } else {
          inst.componentWillUnmount();
        }
      }
    }

    if (this._renderedComponent) {
      ReactReconciler.unmountComponent(this._renderedComponent, safely);
      this._renderedNodeType = null;
      this._renderedComponent = null;
      this._instance = null;
    }

    // Reset pending fields
    // Even if this component is scheduled for another update in ReactUpdates,
    // it would still be ignored because these fields are reset.
    this._pendingStateQueue = null;
    this._pendingReplaceState = false;
    this._pendingForceUpdate = false;
    this._pendingCallbacks = null;
    this._pendingElement = null;

    // These fields do not really need to be reset since this object is no
    // longer accessible.
    this._context = null;
    this._rootNodeID = 0;
    this._topLevelWrapper = null;

    // Delete the reference from the instance to this internal representation
    // which allow the internals to be properly cleaned up even if the user
    // leaks a reference to the public instance.
    ReactInstanceMap.remove(inst);

    // Some existing components rely on inst.props even after they've been
    // destroyed (in event handlers).
    // TODO: inst.props = null;
    // TODO: inst.state = null;
    // TODO: inst.context = null;
  },

  /**
   * Filters the context object to only contain keys specified in
   * `contextTypes`
   *
   * @param {object} context
   * @return {?object}
   * @private
   */
  _maskContext: function (context) {
    var Component = this._currentElement.type;
    var contextTypes = Component.contextTypes;
    if (!contextTypes) {
      return emptyObject;
    }
    var maskedContext = {};
    for (var contextName in contextTypes) {
      maskedContext[contextName] = context[contextName];
    }
    return maskedContext;
  },

  /**
   * Filters the context object to only contain keys specified in
   * `contextTypes`, and asserts that they are valid.
   *
   * @param {object} context
   * @return {?object}
   * @private
   */
  _processContext: function (context) {
    var maskedContext = this._maskContext(context);
    if (process.env.NODE_ENV !== 'production') {
      var Component = this._currentElement.type;
      if (Component.contextTypes) {
        this._checkContextTypes(Component.contextTypes, maskedContext, 'context');
      }
    }
    return maskedContext;
  },

  /**
   * @param {object} currentContext
   * @return {object}
   * @private
   */
  _processChildContext: function (currentContext) {
    var Component = this._currentElement.type;
    var inst = this._instance;
    var childContext;

    if (inst.getChildContext) {
      if (process.env.NODE_ENV !== 'production') {
        ReactInstrumentation.debugTool.onBeginProcessingChildContext();
        try {
          childContext = inst.getChildContext();
        } finally {
          ReactInstrumentation.debugTool.onEndProcessingChildContext();
        }
      } else {
        childContext = inst.getChildContext();
      }
    }

    if (childContext) {
      !(typeof Component.childContextTypes === 'object') ? process.env.NODE_ENV !== 'production' ? invariant(false, '%s.getChildContext(): childContextTypes must be defined in order to use getChildContext().', this.getName() || 'ReactCompositeComponent') : _prodInvariant('107', this.getName() || 'ReactCompositeComponent') : void 0;
      if (process.env.NODE_ENV !== 'production') {
        this._checkContextTypes(Component.childContextTypes, childContext, 'childContext');
      }
      for (var name in childContext) {
        !(name in Component.childContextTypes) ? process.env.NODE_ENV !== 'production' ? invariant(false, '%s.getChildContext(): key "%s" is not defined in childContextTypes.', this.getName() || 'ReactCompositeComponent', name) : _prodInvariant('108', this.getName() || 'ReactCompositeComponent', name) : void 0;
      }
      return _assign({}, currentContext, childContext);
    }
    return currentContext;
  },

  /**
   * Assert that the context types are valid
   *
   * @param {object} typeSpecs Map of context field to a ReactPropType
   * @param {object} values Runtime values that need to be type-checked
   * @param {string} location e.g. "prop", "context", "child context"
   * @private
   */
  _checkContextTypes: function (typeSpecs, values, location) {
    if (process.env.NODE_ENV !== 'production') {
      checkReactTypeSpec(typeSpecs, values, location, this.getName(), null, this._debugID);
    }
  },

  receiveComponent: function (nextElement, transaction, nextContext) {
    var prevElement = this._currentElement;
    var prevContext = this._context;

    this._pendingElement = null;

    this.updateComponent(transaction, prevElement, nextElement, prevContext, nextContext);
  },

  /**
   * If any of `_pendingElement`, `_pendingStateQueue`, or `_pendingForceUpdate`
   * is set, update the component.
   *
   * @param {ReactReconcileTransaction} transaction
   * @internal
   */
  performUpdateIfNecessary: function (transaction) {
    if (this._pendingElement != null) {
      ReactReconciler.receiveComponent(this, this._pendingElement, transaction, this._context);
    } else if (this._pendingStateQueue !== null || this._pendingForceUpdate) {
      this.updateComponent(transaction, this._currentElement, this._currentElement, this._context, this._context);
    } else {
      this._updateBatchNumber = null;
    }
  },

  /**
   * Perform an update to a mounted component. The componentWillReceiveProps and
   * shouldComponentUpdate methods are called, then (assuming the update isn't
   * skipped) the remaining update lifecycle methods are called and the DOM
   * representation is updated.
   *
   * By default, this implements React's rendering and reconciliation algorithm.
   * Sophisticated clients may wish to override this.
   *
   * @param {ReactReconcileTransaction} transaction
   * @param {ReactElement} prevParentElement
   * @param {ReactElement} nextParentElement
   * @internal
   * @overridable
   */
  updateComponent: function (transaction, prevParentElement, nextParentElement, prevUnmaskedContext, nextUnmaskedContext) {
    var inst = this._instance;
    !(inst != null) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Attempted to update component `%s` that has already been unmounted (or failed to mount).', this.getName() || 'ReactCompositeComponent') : _prodInvariant('136', this.getName() || 'ReactCompositeComponent') : void 0;

    var willReceive = false;
    var nextContext;

    // Determine if the context has changed or not
    if (this._context === nextUnmaskedContext) {
      nextContext = inst.context;
    } else {
      nextContext = this._processContext(nextUnmaskedContext);
      willReceive = true;
    }

    var prevProps = prevParentElement.props;
    var nextProps = nextParentElement.props;

    // Not a simple state update but a props update
    if (prevParentElement !== nextParentElement) {
      willReceive = true;
    }

    // An update here will schedule an update but immediately set
    // _pendingStateQueue which will ensure that any state updates gets
    // immediately reconciled instead of waiting for the next batch.
    if (willReceive && inst.componentWillReceiveProps) {
      if (process.env.NODE_ENV !== 'production') {
        measureLifeCyclePerf(function () {
          return inst.componentWillReceiveProps(nextProps, nextContext);
        }, this._debugID, 'componentWillReceiveProps');
      } else {
        inst.componentWillReceiveProps(nextProps, nextContext);
      }
    }

    var nextState = this._processPendingState(nextProps, nextContext);
    var shouldUpdate = true;

    if (!this._pendingForceUpdate) {
      if (inst.shouldComponentUpdate) {
        if (process.env.NODE_ENV !== 'production') {
          shouldUpdate = measureLifeCyclePerf(function () {
            return inst.shouldComponentUpdate(nextProps, nextState, nextContext);
          }, this._debugID, 'shouldComponentUpdate');
        } else {
          shouldUpdate = inst.shouldComponentUpdate(nextProps, nextState, nextContext);
        }
      } else {
        if (this._compositeType === CompositeTypes.PureClass) {
          shouldUpdate = !shallowEqual(prevProps, nextProps) || !shallowEqual(inst.state, nextState);
        }
      }
    }

    if (process.env.NODE_ENV !== 'production') {
      process.env.NODE_ENV !== 'production' ? warning(shouldUpdate !== undefined, '%s.shouldComponentUpdate(): Returned undefined instead of a ' + 'boolean value. Make sure to return true or false.', this.getName() || 'ReactCompositeComponent') : void 0;
    }

    this._updateBatchNumber = null;
    if (shouldUpdate) {
      this._pendingForceUpdate = false;
      // Will set `this.props`, `this.state` and `this.context`.
      this._performComponentUpdate(nextParentElement, nextProps, nextState, nextContext, transaction, nextUnmaskedContext);
    } else {
      // If it's determined that a component should not update, we still want
      // to set props and state but we shortcut the rest of the update.
      this._currentElement = nextParentElement;
      this._context = nextUnmaskedContext;
      inst.props = nextProps;
      inst.state = nextState;
      inst.context = nextContext;
    }
  },

  _processPendingState: function (props, context) {
    var inst = this._instance;
    var queue = this._pendingStateQueue;
    var replace = this._pendingReplaceState;
    this._pendingReplaceState = false;
    this._pendingStateQueue = null;

    if (!queue) {
      return inst.state;
    }

    if (replace && queue.length === 1) {
      return queue[0];
    }

    var nextState = _assign({}, replace ? queue[0] : inst.state);
    for (var i = replace ? 1 : 0; i < queue.length; i++) {
      var partial = queue[i];
      _assign(nextState, typeof partial === 'function' ? partial.call(inst, nextState, props, context) : partial);
    }

    return nextState;
  },

  /**
   * Merges new props and state, notifies delegate methods of update and
   * performs update.
   *
   * @param {ReactElement} nextElement Next element
   * @param {object} nextProps Next public object to set as properties.
   * @param {?object} nextState Next object to set as state.
   * @param {?object} nextContext Next public object to set as context.
   * @param {ReactReconcileTransaction} transaction
   * @param {?object} unmaskedContext
   * @private
   */
  _performComponentUpdate: function (nextElement, nextProps, nextState, nextContext, transaction, unmaskedContext) {
    var _this2 = this;

    var inst = this._instance;

    var hasComponentDidUpdate = Boolean(inst.componentDidUpdate);
    var prevProps;
    var prevState;
    var prevContext;
    if (hasComponentDidUpdate) {
      prevProps = inst.props;
      prevState = inst.state;
      prevContext = inst.context;
    }

    if (inst.componentWillUpdate) {
      if (process.env.NODE_ENV !== 'production') {
        measureLifeCyclePerf(function () {
          return inst.componentWillUpdate(nextProps, nextState, nextContext);
        }, this._debugID, 'componentWillUpdate');
      } else {
        inst.componentWillUpdate(nextProps, nextState, nextContext);
      }
    }

    this._currentElement = nextElement;
    this._context = unmaskedContext;
    inst.props = nextProps;
    inst.state = nextState;
    inst.context = nextContext;

    this._updateRenderedComponent(transaction, unmaskedContext);

    if (hasComponentDidUpdate) {
      if (process.env.NODE_ENV !== 'production') {
        transaction.getReactMountReady().enqueue(function () {
          measureLifeCyclePerf(inst.componentDidUpdate.bind(inst, prevProps, prevState, prevContext), _this2._debugID, 'componentDidUpdate');
        });
      } else {
        transaction.getReactMountReady().enqueue(inst.componentDidUpdate.bind(inst, prevProps, prevState, prevContext), inst);
      }
    }
  },

  /**
   * Call the component's `render` method and update the DOM accordingly.
   *
   * @param {ReactReconcileTransaction} transaction
   * @internal
   */
  _updateRenderedComponent: function (transaction, context) {
    var prevComponentInstance = this._renderedComponent;
    var prevRenderedElement = prevComponentInstance._currentElement;
    var nextRenderedElement = this._renderValidatedComponent();

    var debugID = 0;
    if (process.env.NODE_ENV !== 'production') {
      debugID = this._debugID;
    }

    if (shouldUpdateReactComponent(prevRenderedElement, nextRenderedElement)) {
      ReactReconciler.receiveComponent(prevComponentInstance, nextRenderedElement, transaction, this._processChildContext(context));
    } else {
      var oldHostNode = ReactReconciler.getHostNode(prevComponentInstance);
      ReactReconciler.unmountComponent(prevComponentInstance, false);

      var nodeType = ReactNodeTypes.getType(nextRenderedElement);
      this._renderedNodeType = nodeType;
      var child = this._instantiateReactComponent(nextRenderedElement, nodeType !== ReactNodeTypes.EMPTY /* shouldHaveDebugID */
      );
      this._renderedComponent = child;

      var nextMarkup = ReactReconciler.mountComponent(child, transaction, this._hostParent, this._hostContainerInfo, this._processChildContext(context), debugID);

      if (process.env.NODE_ENV !== 'production') {
        if (debugID !== 0) {
          var childDebugIDs = child._debugID !== 0 ? [child._debugID] : [];
          ReactInstrumentation.debugTool.onSetChildren(debugID, childDebugIDs);
        }
      }

      this._replaceNodeWithMarkup(oldHostNode, nextMarkup, prevComponentInstance);
    }
  },

  /**
   * Overridden in shallow rendering.
   *
   * @protected
   */
  _replaceNodeWithMarkup: function (oldHostNode, nextMarkup, prevInstance) {
    ReactComponentEnvironment.replaceNodeWithMarkup(oldHostNode, nextMarkup, prevInstance);
  },

  /**
   * @protected
   */
  _renderValidatedComponentWithoutOwnerOrContext: function () {
    var inst = this._instance;
    var renderedElement;

    if (process.env.NODE_ENV !== 'production') {
      renderedElement = measureLifeCyclePerf(function () {
        return inst.render();
      }, this._debugID, 'render');
    } else {
      renderedElement = inst.render();
    }

    if (process.env.NODE_ENV !== 'production') {
      // We allow auto-mocks to proceed as if they're returning null.
      if (renderedElement === undefined && inst.render._isMockFunction) {
        // This is probably bad practice. Consider warning here and
        // deprecating this convenience.
        renderedElement = null;
      }
    }

    return renderedElement;
  },

  /**
   * @private
   */
  _renderValidatedComponent: function () {
    var renderedElement;
    if (process.env.NODE_ENV !== 'production' || this._compositeType !== CompositeTypes.StatelessFunctional) {
      ReactCurrentOwner.current = this;
      try {
        renderedElement = this._renderValidatedComponentWithoutOwnerOrContext();
      } finally {
        ReactCurrentOwner.current = null;
      }
    } else {
      renderedElement = this._renderValidatedComponentWithoutOwnerOrContext();
    }
    !(
    // TODO: An `isValidNode` function would probably be more appropriate
    renderedElement === null || renderedElement === false || React.isValidElement(renderedElement)) ? process.env.NODE_ENV !== 'production' ? invariant(false, '%s.render(): A valid React element (or null) must be returned. You may have returned undefined, an array or some other invalid object.', this.getName() || 'ReactCompositeComponent') : _prodInvariant('109', this.getName() || 'ReactCompositeComponent') : void 0;

    return renderedElement;
  },

  /**
   * Lazily allocates the refs object and stores `component` as `ref`.
   *
   * @param {string} ref Reference name.
   * @param {component} component Component to store as `ref`.
   * @final
   * @private
   */
  attachRef: function (ref, component) {
    var inst = this.getPublicInstance();
    !(inst != null) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Stateless function components cannot have refs.') : _prodInvariant('110') : void 0;
    var publicComponentInstance = component.getPublicInstance();
    if (process.env.NODE_ENV !== 'production') {
      var componentName = component && component.getName ? component.getName() : 'a component';
      process.env.NODE_ENV !== 'production' ? warning(publicComponentInstance != null || component._compositeType !== CompositeTypes.StatelessFunctional, 'Stateless function components cannot be given refs ' + '(See ref "%s" in %s created by %s). ' + 'Attempts to access this ref will fail.', ref, componentName, this.getName()) : void 0;
    }
    var refs = inst.refs === emptyObject ? inst.refs = {} : inst.refs;
    refs[ref] = publicComponentInstance;
  },

  /**
   * Detaches a reference name.
   *
   * @param {string} ref Name to dereference.
   * @final
   * @private
   */
  detachRef: function (ref) {
    var refs = this.getPublicInstance().refs;
    delete refs[ref];
  },

  /**
   * Get a text description of the component that can be used to identify it
   * in error messages.
   * @return {string} The name or null.
   * @internal
   */
  getName: function () {
    var type = this._currentElement.type;
    var constructor = this._instance && this._instance.constructor;
    return type.displayName || constructor && constructor.displayName || type.name || constructor && constructor.name || null;
  },

  /**
   * Get the publicly accessible representation of this component - i.e. what
   * is exposed by refs and returned by render. Can be null for stateless
   * components.
   *
   * @return {ReactComponent} the public component instance.
   * @internal
   */
  getPublicInstance: function () {
    var inst = this._instance;
    if (this._compositeType === CompositeTypes.StatelessFunctional) {
      return null;
    }
    return inst;
  },

  // Stub
  _instantiateReactComponent: null

};

module.exports = ReactCompositeComponent;
}).call(this,require('_process'))
},{"./ReactComponentEnvironment":87,"./ReactErrorUtils":112,"./ReactInstanceMap":120,"./ReactInstrumentation":121,"./ReactNodeTypes":126,"./ReactReconciler":131,"./checkReactTypeSpec":158,"./reactProdInvariant":179,"./shouldUpdateReactComponent":183,"_process":58,"fbjs/lib/emptyObject":10,"fbjs/lib/invariant":17,"fbjs/lib/shallowEqual":23,"fbjs/lib/warning":24,"object-assign":57,"react/lib/React":188,"react/lib/ReactCurrentOwner":193}],89:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

/* globals __REACT_DEVTOOLS_GLOBAL_HOOK__*/

'use strict';

var ReactDOMComponentTree = require('./ReactDOMComponentTree');
var ReactDefaultInjection = require('./ReactDefaultInjection');
var ReactMount = require('./ReactMount');
var ReactReconciler = require('./ReactReconciler');
var ReactUpdates = require('./ReactUpdates');
var ReactVersion = require('./ReactVersion');

var findDOMNode = require('./findDOMNode');
var getHostComponentFromComposite = require('./getHostComponentFromComposite');
var renderSubtreeIntoContainer = require('./renderSubtreeIntoContainer');
var warning = require('fbjs/lib/warning');

ReactDefaultInjection.inject();

var ReactDOM = {
  findDOMNode: findDOMNode,
  render: ReactMount.render,
  unmountComponentAtNode: ReactMount.unmountComponentAtNode,
  version: ReactVersion,

  /* eslint-disable camelcase */
  unstable_batchedUpdates: ReactUpdates.batchedUpdates,
  unstable_renderSubtreeIntoContainer: renderSubtreeIntoContainer
};

// Inject the runtime into a devtools global hook regardless of browser.
// Allows for debugging when the hook is injected on the page.
if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== 'undefined' && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.inject === 'function') {
  __REACT_DEVTOOLS_GLOBAL_HOOK__.inject({
    ComponentTree: {
      getClosestInstanceFromNode: ReactDOMComponentTree.getClosestInstanceFromNode,
      getNodeFromInstance: function (inst) {
        // inst is an internal instance (but could be a composite)
        if (inst._renderedComponent) {
          inst = getHostComponentFromComposite(inst);
        }
        if (inst) {
          return ReactDOMComponentTree.getNodeFromInstance(inst);
        } else {
          return null;
        }
      }
    },
    Mount: ReactMount,
    Reconciler: ReactReconciler
  });
}

if (process.env.NODE_ENV !== 'production') {
  var ExecutionEnvironment = require('fbjs/lib/ExecutionEnvironment');
  if (ExecutionEnvironment.canUseDOM && window.top === window.self) {

    // First check if devtools is not installed
    if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === 'undefined') {
      // If we're in Chrome or Firefox, provide a download link if not installed.
      if (navigator.userAgent.indexOf('Chrome') > -1 && navigator.userAgent.indexOf('Edge') === -1 || navigator.userAgent.indexOf('Firefox') > -1) {
        // Firefox does not have the issue with devtools loaded over file://
        var showFileUrlMessage = window.location.protocol.indexOf('http') === -1 && navigator.userAgent.indexOf('Firefox') === -1;
        console.debug('Download the React DevTools ' + (showFileUrlMessage ? 'and use an HTTP server (instead of a file: URL) ' : '') + 'for a better development experience: ' + 'https://fb.me/react-devtools');
      }
    }

    var testFunc = function testFn() {};
    process.env.NODE_ENV !== 'production' ? warning((testFunc.name || testFunc.toString()).indexOf('testFn') !== -1, 'It looks like you\'re using a minified copy of the development build ' + 'of React. When deploying React apps to production, make sure to use ' + 'the production build which skips development warnings and is faster. ' + 'See https://fb.me/react-minification for more details.') : void 0;

    // If we're in IE8, check to see if we are in compatibility mode and provide
    // information on preventing compatibility mode
    var ieCompatibilityMode = document.documentMode && document.documentMode < 8;

    process.env.NODE_ENV !== 'production' ? warning(!ieCompatibilityMode, 'Internet Explorer is running in compatibility mode; please add the ' + 'following tag to your HTML to prevent this from happening: ' + '<meta http-equiv="X-UA-Compatible" content="IE=edge" />') : void 0;

    var expectedFeatures = [
    // shims
    Array.isArray, Array.prototype.every, Array.prototype.forEach, Array.prototype.indexOf, Array.prototype.map, Date.now, Function.prototype.bind, Object.keys, String.prototype.trim];

    for (var i = 0; i < expectedFeatures.length; i++) {
      if (!expectedFeatures[i]) {
        process.env.NODE_ENV !== 'production' ? warning(false, 'One or more ES5 shims expected by React are not available: ' + 'https://fb.me/react-warning-polyfills') : void 0;
        break;
      }
    }
  }
}

if (process.env.NODE_ENV !== 'production') {
  var ReactInstrumentation = require('./ReactInstrumentation');
  var ReactDOMUnknownPropertyHook = require('./ReactDOMUnknownPropertyHook');
  var ReactDOMNullInputValuePropHook = require('./ReactDOMNullInputValuePropHook');
  var ReactDOMInvalidARIAHook = require('./ReactDOMInvalidARIAHook');

  ReactInstrumentation.debugTool.addHook(ReactDOMUnknownPropertyHook);
  ReactInstrumentation.debugTool.addHook(ReactDOMNullInputValuePropHook);
  ReactInstrumentation.debugTool.addHook(ReactDOMInvalidARIAHook);
}

module.exports = ReactDOM;
}).call(this,require('_process'))
},{"./ReactDOMComponentTree":92,"./ReactDOMInvalidARIAHook":98,"./ReactDOMNullInputValuePropHook":99,"./ReactDOMUnknownPropertyHook":106,"./ReactDefaultInjection":109,"./ReactInstrumentation":121,"./ReactMount":124,"./ReactReconciler":131,"./ReactUpdates":136,"./ReactVersion":137,"./findDOMNode":162,"./getHostComponentFromComposite":169,"./renderSubtreeIntoContainer":180,"_process":58,"fbjs/lib/ExecutionEnvironment":3,"fbjs/lib/warning":24}],90:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

/* global hasOwnProperty:true */

'use strict';

var _prodInvariant = require('./reactProdInvariant'),
    _assign = require('object-assign');

var AutoFocusUtils = require('./AutoFocusUtils');
var CSSPropertyOperations = require('./CSSPropertyOperations');
var DOMLazyTree = require('./DOMLazyTree');
var DOMNamespaces = require('./DOMNamespaces');
var DOMProperty = require('./DOMProperty');
var DOMPropertyOperations = require('./DOMPropertyOperations');
var EventPluginHub = require('./EventPluginHub');
var EventPluginRegistry = require('./EventPluginRegistry');
var ReactBrowserEventEmitter = require('./ReactBrowserEventEmitter');
var ReactDOMComponentFlags = require('./ReactDOMComponentFlags');
var ReactDOMComponentTree = require('./ReactDOMComponentTree');
var ReactDOMInput = require('./ReactDOMInput');
var ReactDOMOption = require('./ReactDOMOption');
var ReactDOMSelect = require('./ReactDOMSelect');
var ReactDOMTextarea = require('./ReactDOMTextarea');
var ReactInstrumentation = require('./ReactInstrumentation');
var ReactMultiChild = require('./ReactMultiChild');
var ReactServerRenderingTransaction = require('./ReactServerRenderingTransaction');

var emptyFunction = require('fbjs/lib/emptyFunction');
var escapeTextContentForBrowser = require('./escapeTextContentForBrowser');
var invariant = require('fbjs/lib/invariant');
var isEventSupported = require('./isEventSupported');
var shallowEqual = require('fbjs/lib/shallowEqual');
var validateDOMNesting = require('./validateDOMNesting');
var warning = require('fbjs/lib/warning');

var Flags = ReactDOMComponentFlags;
var deleteListener = EventPluginHub.deleteListener;
var getNode = ReactDOMComponentTree.getNodeFromInstance;
var listenTo = ReactBrowserEventEmitter.listenTo;
var registrationNameModules = EventPluginRegistry.registrationNameModules;

// For quickly matching children type, to test if can be treated as content.
var CONTENT_TYPES = { 'string': true, 'number': true };

var STYLE = 'style';
var HTML = '__html';
var RESERVED_PROPS = {
  children: null,
  dangerouslySetInnerHTML: null,
  suppressContentEditableWarning: null
};

// Node type for document fragments (Node.DOCUMENT_FRAGMENT_NODE).
var DOC_FRAGMENT_TYPE = 11;

function getDeclarationErrorAddendum(internalInstance) {
  if (internalInstance) {
    var owner = internalInstance._currentElement._owner || null;
    if (owner) {
      var name = owner.getName();
      if (name) {
        return ' This DOM node was rendered by `' + name + '`.';
      }
    }
  }
  return '';
}

function friendlyStringify(obj) {
  if (typeof obj === 'object') {
    if (Array.isArray(obj)) {
      return '[' + obj.map(friendlyStringify).join(', ') + ']';
    } else {
      var pairs = [];
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          var keyEscaped = /^[a-z$_][\w$_]*$/i.test(key) ? key : JSON.stringify(key);
          pairs.push(keyEscaped + ': ' + friendlyStringify(obj[key]));
        }
      }
      return '{' + pairs.join(', ') + '}';
    }
  } else if (typeof obj === 'string') {
    return JSON.stringify(obj);
  } else if (typeof obj === 'function') {
    return '[function object]';
  }
  // Differs from JSON.stringify in that undefined because undefined and that
  // inf and nan don't become null
  return String(obj);
}

var styleMutationWarning = {};

function checkAndWarnForMutatedStyle(style1, style2, component) {
  if (style1 == null || style2 == null) {
    return;
  }
  if (shallowEqual(style1, style2)) {
    return;
  }

  var componentName = component._tag;
  var owner = component._currentElement._owner;
  var ownerName;
  if (owner) {
    ownerName = owner.getName();
  }

  var hash = ownerName + '|' + componentName;

  if (styleMutationWarning.hasOwnProperty(hash)) {
    return;
  }

  styleMutationWarning[hash] = true;

  process.env.NODE_ENV !== 'production' ? warning(false, '`%s` was passed a style object that has previously been mutated. ' + 'Mutating `style` is deprecated. Consider cloning it beforehand. Check ' + 'the `render` %s. Previous style: %s. Mutated style: %s.', componentName, owner ? 'of `' + ownerName + '`' : 'using <' + componentName + '>', friendlyStringify(style1), friendlyStringify(style2)) : void 0;
}

/**
 * @param {object} component
 * @param {?object} props
 */
function assertValidProps(component, props) {
  if (!props) {
    return;
  }
  // Note the use of `==` which checks for null or undefined.
  if (voidElementTags[component._tag]) {
    !(props.children == null && props.dangerouslySetInnerHTML == null) ? process.env.NODE_ENV !== 'production' ? invariant(false, '%s is a void element tag and must neither have `children` nor use `dangerouslySetInnerHTML`.%s', component._tag, component._currentElement._owner ? ' Check the render method of ' + component._currentElement._owner.getName() + '.' : '') : _prodInvariant('137', component._tag, component._currentElement._owner ? ' Check the render method of ' + component._currentElement._owner.getName() + '.' : '') : void 0;
  }
  if (props.dangerouslySetInnerHTML != null) {
    !(props.children == null) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Can only set one of `children` or `props.dangerouslySetInnerHTML`.') : _prodInvariant('60') : void 0;
    !(typeof props.dangerouslySetInnerHTML === 'object' && HTML in props.dangerouslySetInnerHTML) ? process.env.NODE_ENV !== 'production' ? invariant(false, '`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. Please visit https://fb.me/react-invariant-dangerously-set-inner-html for more information.') : _prodInvariant('61') : void 0;
  }
  if (process.env.NODE_ENV !== 'production') {
    process.env.NODE_ENV !== 'production' ? warning(props.innerHTML == null, 'Directly setting property `innerHTML` is not permitted. ' + 'For more information, lookup documentation on `dangerouslySetInnerHTML`.') : void 0;
    process.env.NODE_ENV !== 'production' ? warning(props.suppressContentEditableWarning || !props.contentEditable || props.children == null, 'A component is `contentEditable` and contains `children` managed by ' + 'React. It is now your responsibility to guarantee that none of ' + 'those nodes are unexpectedly modified or duplicated. This is ' + 'probably not intentional.') : void 0;
    process.env.NODE_ENV !== 'production' ? warning(props.onFocusIn == null && props.onFocusOut == null, 'React uses onFocus and onBlur instead of onFocusIn and onFocusOut. ' + 'All React events are normalized to bubble, so onFocusIn and onFocusOut ' + 'are not needed/supported by React.') : void 0;
  }
  !(props.style == null || typeof props.style === 'object') ? process.env.NODE_ENV !== 'production' ? invariant(false, 'The `style` prop expects a mapping from style properties to values, not a string. For example, style={{marginRight: spacing + \'em\'}} when using JSX.%s', getDeclarationErrorAddendum(component)) : _prodInvariant('62', getDeclarationErrorAddendum(component)) : void 0;
}

function enqueuePutListener(inst, registrationName, listener, transaction) {
  if (transaction instanceof ReactServerRenderingTransaction) {
    return;
  }
  if (process.env.NODE_ENV !== 'production') {
    // IE8 has no API for event capturing and the `onScroll` event doesn't
    // bubble.
    process.env.NODE_ENV !== 'production' ? warning(registrationName !== 'onScroll' || isEventSupported('scroll', true), 'This browser doesn\'t support the `onScroll` event') : void 0;
  }
  var containerInfo = inst._hostContainerInfo;
  var isDocumentFragment = containerInfo._node && containerInfo._node.nodeType === DOC_FRAGMENT_TYPE;
  var doc = isDocumentFragment ? containerInfo._node : containerInfo._ownerDocument;
  listenTo(registrationName, doc);
  transaction.getReactMountReady().enqueue(putListener, {
    inst: inst,
    registrationName: registrationName,
    listener: listener
  });
}

function putListener() {
  var listenerToPut = this;
  EventPluginHub.putListener(listenerToPut.inst, listenerToPut.registrationName, listenerToPut.listener);
}

function inputPostMount() {
  var inst = this;
  ReactDOMInput.postMountWrapper(inst);
}

function textareaPostMount() {
  var inst = this;
  ReactDOMTextarea.postMountWrapper(inst);
}

function optionPostMount() {
  var inst = this;
  ReactDOMOption.postMountWrapper(inst);
}

var setAndValidateContentChildDev = emptyFunction;
if (process.env.NODE_ENV !== 'production') {
  setAndValidateContentChildDev = function (content) {
    var hasExistingContent = this._contentDebugID != null;
    var debugID = this._debugID;
    // This ID represents the inlined child that has no backing instance:
    var contentDebugID = -debugID;

    if (content == null) {
      if (hasExistingContent) {
        ReactInstrumentation.debugTool.onUnmountComponent(this._contentDebugID);
      }
      this._contentDebugID = null;
      return;
    }

    validateDOMNesting(null, String(content), this, this._ancestorInfo);
    this._contentDebugID = contentDebugID;
    if (hasExistingContent) {
      ReactInstrumentation.debugTool.onBeforeUpdateComponent(contentDebugID, content);
      ReactInstrumentation.debugTool.onUpdateComponent(contentDebugID);
    } else {
      ReactInstrumentation.debugTool.onBeforeMountComponent(contentDebugID, content, debugID);
      ReactInstrumentation.debugTool.onMountComponent(contentDebugID);
      ReactInstrumentation.debugTool.onSetChildren(debugID, [contentDebugID]);
    }
  };
}

// There are so many media events, it makes sense to just
// maintain a list rather than create a `trapBubbledEvent` for each
var mediaEvents = {
  topAbort: 'abort',
  topCanPlay: 'canplay',
  topCanPlayThrough: 'canplaythrough',
  topDurationChange: 'durationchange',
  topEmptied: 'emptied',
  topEncrypted: 'encrypted',
  topEnded: 'ended',
  topError: 'error',
  topLoadedData: 'loadeddata',
  topLoadedMetadata: 'loadedmetadata',
  topLoadStart: 'loadstart',
  topPause: 'pause',
  topPlay: 'play',
  topPlaying: 'playing',
  topProgress: 'progress',
  topRateChange: 'ratechange',
  topSeeked: 'seeked',
  topSeeking: 'seeking',
  topStalled: 'stalled',
  topSuspend: 'suspend',
  topTimeUpdate: 'timeupdate',
  topVolumeChange: 'volumechange',
  topWaiting: 'waiting'
};

function trapBubbledEventsLocal() {
  var inst = this;
  // If a component renders to null or if another component fatals and causes
  // the state of the tree to be corrupted, `node` here can be null.
  !inst._rootNodeID ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Must be mounted to trap events') : _prodInvariant('63') : void 0;
  var node = getNode(inst);
  !node ? process.env.NODE_ENV !== 'production' ? invariant(false, 'trapBubbledEvent(...): Requires node to be rendered.') : _prodInvariant('64') : void 0;

  switch (inst._tag) {
    case 'iframe':
    case 'object':
      inst._wrapperState.listeners = [ReactBrowserEventEmitter.trapBubbledEvent('topLoad', 'load', node)];
      break;
    case 'video':
    case 'audio':

      inst._wrapperState.listeners = [];
      // Create listener for each media event
      for (var event in mediaEvents) {
        if (mediaEvents.hasOwnProperty(event)) {
          inst._wrapperState.listeners.push(ReactBrowserEventEmitter.trapBubbledEvent(event, mediaEvents[event], node));
        }
      }
      break;
    case 'source':
      inst._wrapperState.listeners = [ReactBrowserEventEmitter.trapBubbledEvent('topError', 'error', node)];
      break;
    case 'img':
      inst._wrapperState.listeners = [ReactBrowserEventEmitter.trapBubbledEvent('topError', 'error', node), ReactBrowserEventEmitter.trapBubbledEvent('topLoad', 'load', node)];
      break;
    case 'form':
      inst._wrapperState.listeners = [ReactBrowserEventEmitter.trapBubbledEvent('topReset', 'reset', node), ReactBrowserEventEmitter.trapBubbledEvent('topSubmit', 'submit', node)];
      break;
    case 'input':
    case 'select':
    case 'textarea':
      inst._wrapperState.listeners = [ReactBrowserEventEmitter.trapBubbledEvent('topInvalid', 'invalid', node)];
      break;
  }
}

function postUpdateSelectWrapper() {
  ReactDOMSelect.postUpdateWrapper(this);
}

// For HTML, certain tags should omit their close tag. We keep a whitelist for
// those special-case tags.

var omittedCloseTags = {
  'area': true,
  'base': true,
  'br': true,
  'col': true,
  'embed': true,
  'hr': true,
  'img': true,
  'input': true,
  'keygen': true,
  'link': true,
  'meta': true,
  'param': true,
  'source': true,
  'track': true,
  'wbr': true
};

var newlineEatingTags = {
  'listing': true,
  'pre': true,
  'textarea': true
};

// For HTML, certain tags cannot have children. This has the same purpose as
// `omittedCloseTags` except that `menuitem` should still have its closing tag.

var voidElementTags = _assign({
  'menuitem': true
}, omittedCloseTags);

// We accept any tag to be rendered but since this gets injected into arbitrary
// HTML, we want to make sure that it's a safe tag.
// http://www.w3.org/TR/REC-xml/#NT-Name

var VALID_TAG_REGEX = /^[a-zA-Z][a-zA-Z:_\.\-\d]*$/; // Simplified subset
var validatedTagCache = {};
var hasOwnProperty = {}.hasOwnProperty;

function validateDangerousTag(tag) {
  if (!hasOwnProperty.call(validatedTagCache, tag)) {
    !VALID_TAG_REGEX.test(tag) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Invalid tag: %s', tag) : _prodInvariant('65', tag) : void 0;
    validatedTagCache[tag] = true;
  }
}

function isCustomComponent(tagName, props) {
  return tagName.indexOf('-') >= 0 || props.is != null;
}

var globalIdCounter = 1;

/**
 * Creates a new React class that is idempotent and capable of containing other
 * React components. It accepts event listeners and DOM properties that are
 * valid according to `DOMProperty`.
 *
 *  - Event listeners: `onClick`, `onMouseDown`, etc.
 *  - DOM properties: `className`, `name`, `title`, etc.
 *
 * The `style` property functions differently from the DOM API. It accepts an
 * object mapping of style properties to values.
 *
 * @constructor ReactDOMComponent
 * @extends ReactMultiChild
 */
function ReactDOMComponent(element) {
  var tag = element.type;
  validateDangerousTag(tag);
  this._currentElement = element;
  this._tag = tag.toLowerCase();
  this._namespaceURI = null;
  this._renderedChildren = null;
  this._previousStyle = null;
  this._previousStyleCopy = null;
  this._hostNode = null;
  this._hostParent = null;
  this._rootNodeID = 0;
  this._domID = 0;
  this._hostContainerInfo = null;
  this._wrapperState = null;
  this._topLevelWrapper = null;
  this._flags = 0;
  if (process.env.NODE_ENV !== 'production') {
    this._ancestorInfo = null;
    setAndValidateContentChildDev.call(this, null);
  }
}

ReactDOMComponent.displayName = 'ReactDOMComponent';

ReactDOMComponent.Mixin = {

  /**
   * Generates root tag markup then recurses. This method has side effects and
   * is not idempotent.
   *
   * @internal
   * @param {ReactReconcileTransaction|ReactServerRenderingTransaction} transaction
   * @param {?ReactDOMComponent} the parent component instance
   * @param {?object} info about the host container
   * @param {object} context
   * @return {string} The computed markup.
   */
  mountComponent: function (transaction, hostParent, hostContainerInfo, context) {
    this._rootNodeID = globalIdCounter++;
    this._domID = hostContainerInfo._idCounter++;
    this._hostParent = hostParent;
    this._hostContainerInfo = hostContainerInfo;

    var props = this._currentElement.props;

    switch (this._tag) {
      case 'audio':
      case 'form':
      case 'iframe':
      case 'img':
      case 'link':
      case 'object':
      case 'source':
      case 'video':
        this._wrapperState = {
          listeners: null
        };
        transaction.getReactMountReady().enqueue(trapBubbledEventsLocal, this);
        break;
      case 'input':
        ReactDOMInput.mountWrapper(this, props, hostParent);
        props = ReactDOMInput.getHostProps(this, props);
        transaction.getReactMountReady().enqueue(trapBubbledEventsLocal, this);
        break;
      case 'option':
        ReactDOMOption.mountWrapper(this, props, hostParent);
        props = ReactDOMOption.getHostProps(this, props);
        break;
      case 'select':
        ReactDOMSelect.mountWrapper(this, props, hostParent);
        props = ReactDOMSelect.getHostProps(this, props);
        transaction.getReactMountReady().enqueue(trapBubbledEventsLocal, this);
        break;
      case 'textarea':
        ReactDOMTextarea.mountWrapper(this, props, hostParent);
        props = ReactDOMTextarea.getHostProps(this, props);
        transaction.getReactMountReady().enqueue(trapBubbledEventsLocal, this);
        break;
    }

    assertValidProps(this, props);

    // We create tags in the namespace of their parent container, except HTML
    // tags get no namespace.
    var namespaceURI;
    var parentTag;
    if (hostParent != null) {
      namespaceURI = hostParent._namespaceURI;
      parentTag = hostParent._tag;
    } else if (hostContainerInfo._tag) {
      namespaceURI = hostContainerInfo._namespaceURI;
      parentTag = hostContainerInfo._tag;
    }
    if (namespaceURI == null || namespaceURI === DOMNamespaces.svg && parentTag === 'foreignobject') {
      namespaceURI = DOMNamespaces.html;
    }
    if (namespaceURI === DOMNamespaces.html) {
      if (this._tag === 'svg') {
        namespaceURI = DOMNamespaces.svg;
      } else if (this._tag === 'math') {
        namespaceURI = DOMNamespaces.mathml;
      }
    }
    this._namespaceURI = namespaceURI;

    if (process.env.NODE_ENV !== 'production') {
      var parentInfo;
      if (hostParent != null) {
        parentInfo = hostParent._ancestorInfo;
      } else if (hostContainerInfo._tag) {
        parentInfo = hostContainerInfo._ancestorInfo;
      }
      if (parentInfo) {
        // parentInfo should always be present except for the top-level
        // component when server rendering
        validateDOMNesting(this._tag, null, this, parentInfo);
      }
      this._ancestorInfo = validateDOMNesting.updatedAncestorInfo(parentInfo, this._tag, this);
    }

    var mountImage;
    if (transaction.useCreateElement) {
      var ownerDocument = hostContainerInfo._ownerDocument;
      var el;
      if (namespaceURI === DOMNamespaces.html) {
        if (this._tag === 'script') {
          // Create the script via .innerHTML so its "parser-inserted" flag is
          // set to true and it does not execute
          var div = ownerDocument.createElement('div');
          var type = this._currentElement.type;
          div.innerHTML = '<' + type + '></' + type + '>';
          el = div.removeChild(div.firstChild);
        } else if (props.is) {
          el = ownerDocument.createElement(this._currentElement.type, props.is);
        } else {
          // Separate else branch instead of using `props.is || undefined` above becuase of a Firefox bug.
          // See discussion in https://github.com/facebook/react/pull/6896
          // and discussion in https://bugzilla.mozilla.org/show_bug.cgi?id=1276240
          el = ownerDocument.createElement(this._currentElement.type);
        }
      } else {
        el = ownerDocument.createElementNS(namespaceURI, this._currentElement.type);
      }
      ReactDOMComponentTree.precacheNode(this, el);
      this._flags |= Flags.hasCachedChildNodes;
      if (!this._hostParent) {
        DOMPropertyOperations.setAttributeForRoot(el);
      }
      this._updateDOMProperties(null, props, transaction);
      var lazyTree = DOMLazyTree(el);
      this._createInitialChildren(transaction, props, context, lazyTree);
      mountImage = lazyTree;
    } else {
      var tagOpen = this._createOpenTagMarkupAndPutListeners(transaction, props);
      var tagContent = this._createContentMarkup(transaction, props, context);
      if (!tagContent && omittedCloseTags[this._tag]) {
        mountImage = tagOpen + '/>';
      } else {
        mountImage = tagOpen + '>' + tagContent + '</' + this._currentElement.type + '>';
      }
    }

    switch (this._tag) {
      case 'input':
        transaction.getReactMountReady().enqueue(inputPostMount, this);
        if (props.autoFocus) {
          transaction.getReactMountReady().enqueue(AutoFocusUtils.focusDOMComponent, this);
        }
        break;
      case 'textarea':
        transaction.getReactMountReady().enqueue(textareaPostMount, this);
        if (props.autoFocus) {
          transaction.getReactMountReady().enqueue(AutoFocusUtils.focusDOMComponent, this);
        }
        break;
      case 'select':
        if (props.autoFocus) {
          transaction.getReactMountReady().enqueue(AutoFocusUtils.focusDOMComponent, this);
        }
        break;
      case 'button':
        if (props.autoFocus) {
          transaction.getReactMountReady().enqueue(AutoFocusUtils.focusDOMComponent, this);
        }
        break;
      case 'option':
        transaction.getReactMountReady().enqueue(optionPostMount, this);
        break;
    }

    return mountImage;
  },

  /**
   * Creates markup for the open tag and all attributes.
   *
   * This method has side effects because events get registered.
   *
   * Iterating over object properties is faster than iterating over arrays.
   * @see http://jsperf.com/obj-vs-arr-iteration
   *
   * @private
   * @param {ReactReconcileTransaction|ReactServerRenderingTransaction} transaction
   * @param {object} props
   * @return {string} Markup of opening tag.
   */
  _createOpenTagMarkupAndPutListeners: function (transaction, props) {
    var ret = '<' + this._currentElement.type;

    for (var propKey in props) {
      if (!props.hasOwnProperty(propKey)) {
        continue;
      }
      var propValue = props[propKey];
      if (propValue == null) {
        continue;
      }
      if (registrationNameModules.hasOwnProperty(propKey)) {
        if (propValue) {
          enqueuePutListener(this, propKey, propValue, transaction);
        }
      } else {
        if (propKey === STYLE) {
          if (propValue) {
            if (process.env.NODE_ENV !== 'production') {
              // See `_updateDOMProperties`. style block
              this._previousStyle = propValue;
            }
            propValue = this._previousStyleCopy = _assign({}, props.style);
          }
          propValue = CSSPropertyOperations.createMarkupForStyles(propValue, this);
        }
        var markup = null;
        if (this._tag != null && isCustomComponent(this._tag, props)) {
          if (!RESERVED_PROPS.hasOwnProperty(propKey)) {
            markup = DOMPropertyOperations.createMarkupForCustomAttribute(propKey, propValue);
          }
        } else {
          markup = DOMPropertyOperations.createMarkupForProperty(propKey, propValue);
        }
        if (markup) {
          ret += ' ' + markup;
        }
      }
    }

    // For static pages, no need to put React ID and checksum. Saves lots of
    // bytes.
    if (transaction.renderToStaticMarkup) {
      return ret;
    }

    if (!this._hostParent) {
      ret += ' ' + DOMPropertyOperations.createMarkupForRoot();
    }
    ret += ' ' + DOMPropertyOperations.createMarkupForID(this._domID);
    return ret;
  },

  /**
   * Creates markup for the content between the tags.
   *
   * @private
   * @param {ReactReconcileTransaction|ReactServerRenderingTransaction} transaction
   * @param {object} props
   * @param {object} context
   * @return {string} Content markup.
   */
  _createContentMarkup: function (transaction, props, context) {
    var ret = '';

    // Intentional use of != to avoid catching zero/false.
    var innerHTML = props.dangerouslySetInnerHTML;
    if (innerHTML != null) {
      if (innerHTML.__html != null) {
        ret = innerHTML.__html;
      }
    } else {
      var contentToUse = CONTENT_TYPES[typeof props.children] ? props.children : null;
      var childrenToUse = contentToUse != null ? null : props.children;
      if (contentToUse != null) {
        // TODO: Validate that text is allowed as a child of this node
        ret = escapeTextContentForBrowser(contentToUse);
        if (process.env.NODE_ENV !== 'production') {
          setAndValidateContentChildDev.call(this, contentToUse);
        }
      } else if (childrenToUse != null) {
        var mountImages = this.mountChildren(childrenToUse, transaction, context);
        ret = mountImages.join('');
      }
    }
    if (newlineEatingTags[this._tag] && ret.charAt(0) === '\n') {
      // text/html ignores the first character in these tags if it's a newline
      // Prefer to break application/xml over text/html (for now) by adding
      // a newline specifically to get eaten by the parser. (Alternately for
      // textareas, replacing "^\n" with "\r\n" doesn't get eaten, and the first
      // \r is normalized out by HTMLTextAreaElement#value.)
      // See: <http://www.w3.org/TR/html-polyglot/#newlines-in-textarea-and-pre>
      // See: <http://www.w3.org/TR/html5/syntax.html#element-restrictions>
      // See: <http://www.w3.org/TR/html5/syntax.html#newlines>
      // See: Parsing of "textarea" "listing" and "pre" elements
      //  from <http://www.w3.org/TR/html5/syntax.html#parsing-main-inbody>
      return '\n' + ret;
    } else {
      return ret;
    }
  },

  _createInitialChildren: function (transaction, props, context, lazyTree) {
    // Intentional use of != to avoid catching zero/false.
    var innerHTML = props.dangerouslySetInnerHTML;
    if (innerHTML != null) {
      if (innerHTML.__html != null) {
        DOMLazyTree.queueHTML(lazyTree, innerHTML.__html);
      }
    } else {
      var contentToUse = CONTENT_TYPES[typeof props.children] ? props.children : null;
      var childrenToUse = contentToUse != null ? null : props.children;
      // TODO: Validate that text is allowed as a child of this node
      if (contentToUse != null) {
        // Avoid setting textContent when the text is empty. In IE11 setting
        // textContent on a text area will cause the placeholder to not
        // show within the textarea until it has been focused and blurred again.
        // https://github.com/facebook/react/issues/6731#issuecomment-254874553
        if (contentToUse !== '') {
          if (process.env.NODE_ENV !== 'production') {
            setAndValidateContentChildDev.call(this, contentToUse);
          }
          DOMLazyTree.queueText(lazyTree, contentToUse);
        }
      } else if (childrenToUse != null) {
        var mountImages = this.mountChildren(childrenToUse, transaction, context);
        for (var i = 0; i < mountImages.length; i++) {
          DOMLazyTree.queueChild(lazyTree, mountImages[i]);
        }
      }
    }
  },

  /**
   * Receives a next element and updates the component.
   *
   * @internal
   * @param {ReactElement} nextElement
   * @param {ReactReconcileTransaction|ReactServerRenderingTransaction} transaction
   * @param {object} context
   */
  receiveComponent: function (nextElement, transaction, context) {
    var prevElement = this._currentElement;
    this._currentElement = nextElement;
    this.updateComponent(transaction, prevElement, nextElement, context);
  },

  /**
   * Updates a DOM component after it has already been allocated and
   * attached to the DOM. Reconciles the root DOM node, then recurses.
   *
   * @param {ReactReconcileTransaction} transaction
   * @param {ReactElement} prevElement
   * @param {ReactElement} nextElement
   * @internal
   * @overridable
   */
  updateComponent: function (transaction, prevElement, nextElement, context) {
    var lastProps = prevElement.props;
    var nextProps = this._currentElement.props;

    switch (this._tag) {
      case 'input':
        lastProps = ReactDOMInput.getHostProps(this, lastProps);
        nextProps = ReactDOMInput.getHostProps(this, nextProps);
        break;
      case 'option':
        lastProps = ReactDOMOption.getHostProps(this, lastProps);
        nextProps = ReactDOMOption.getHostProps(this, nextProps);
        break;
      case 'select':
        lastProps = ReactDOMSelect.getHostProps(this, lastProps);
        nextProps = ReactDOMSelect.getHostProps(this, nextProps);
        break;
      case 'textarea':
        lastProps = ReactDOMTextarea.getHostProps(this, lastProps);
        nextProps = ReactDOMTextarea.getHostProps(this, nextProps);
        break;
    }

    assertValidProps(this, nextProps);
    this._updateDOMProperties(lastProps, nextProps, transaction);
    this._updateDOMChildren(lastProps, nextProps, transaction, context);

    switch (this._tag) {
      case 'input':
        // Update the wrapper around inputs *after* updating props. This has to
        // happen after `_updateDOMProperties`. Otherwise HTML5 input validations
        // raise warnings and prevent the new value from being assigned.
        ReactDOMInput.updateWrapper(this);
        break;
      case 'textarea':
        ReactDOMTextarea.updateWrapper(this);
        break;
      case 'select':
        // <select> value update needs to occur after <option> children
        // reconciliation
        transaction.getReactMountReady().enqueue(postUpdateSelectWrapper, this);
        break;
    }
  },

  /**
   * Reconciles the properties by detecting differences in property values and
   * updating the DOM as necessary. This function is probably the single most
   * critical path for performance optimization.
   *
   * TODO: Benchmark whether checking for changed values in memory actually
   *       improves performance (especially statically positioned elements).
   * TODO: Benchmark the effects of putting this at the top since 99% of props
   *       do not change for a given reconciliation.
   * TODO: Benchmark areas that can be improved with caching.
   *
   * @private
   * @param {object} lastProps
   * @param {object} nextProps
   * @param {?DOMElement} node
   */
  _updateDOMProperties: function (lastProps, nextProps, transaction) {
    var propKey;
    var styleName;
    var styleUpdates;
    for (propKey in lastProps) {
      if (nextProps.hasOwnProperty(propKey) || !lastProps.hasOwnProperty(propKey) || lastProps[propKey] == null) {
        continue;
      }
      if (propKey === STYLE) {
        var lastStyle = this._previousStyleCopy;
        for (styleName in lastStyle) {
          if (lastStyle.hasOwnProperty(styleName)) {
            styleUpdates = styleUpdates || {};
            styleUpdates[styleName] = '';
          }
        }
        this._previousStyleCopy = null;
      } else if (registrationNameModules.hasOwnProperty(propKey)) {
        if (lastProps[propKey]) {
          // Only call deleteListener if there was a listener previously or
          // else willDeleteListener gets called when there wasn't actually a
          // listener (e.g., onClick={null})
          deleteListener(this, propKey);
        }
      } else if (isCustomComponent(this._tag, lastProps)) {
        if (!RESERVED_PROPS.hasOwnProperty(propKey)) {
          DOMPropertyOperations.deleteValueForAttribute(getNode(this), propKey);
        }
      } else if (DOMProperty.properties[propKey] || DOMProperty.isCustomAttribute(propKey)) {
        DOMPropertyOperations.deleteValueForProperty(getNode(this), propKey);
      }
    }
    for (propKey in nextProps) {
      var nextProp = nextProps[propKey];
      var lastProp = propKey === STYLE ? this._previousStyleCopy : lastProps != null ? lastProps[propKey] : undefined;
      if (!nextProps.hasOwnProperty(propKey) || nextProp === lastProp || nextProp == null && lastProp == null) {
        continue;
      }
      if (propKey === STYLE) {
        if (nextProp) {
          if (process.env.NODE_ENV !== 'production') {
            checkAndWarnForMutatedStyle(this._previousStyleCopy, this._previousStyle, this);
            this._previousStyle = nextProp;
          }
          nextProp = this._previousStyleCopy = _assign({}, nextProp);
        } else {
          this._previousStyleCopy = null;
        }
        if (lastProp) {
          // Unset styles on `lastProp` but not on `nextProp`.
          for (styleName in lastProp) {
            if (lastProp.hasOwnProperty(styleName) && (!nextProp || !nextProp.hasOwnProperty(styleName))) {
              styleUpdates = styleUpdates || {};
              styleUpdates[styleName] = '';
            }
          }
          // Update styles that changed since `lastProp`.
          for (styleName in nextProp) {
            if (nextProp.hasOwnProperty(styleName) && lastProp[styleName] !== nextProp[styleName]) {
              styleUpdates = styleUpdates || {};
              styleUpdates[styleName] = nextProp[styleName];
            }
          }
        } else {
          // Relies on `updateStylesByID` not mutating `styleUpdates`.
          styleUpdates = nextProp;
        }
      } else if (registrationNameModules.hasOwnProperty(propKey)) {
        if (nextProp) {
          enqueuePutListener(this, propKey, nextProp, transaction);
        } else if (lastProp) {
          deleteListener(this, propKey);
        }
      } else if (isCustomComponent(this._tag, nextProps)) {
        if (!RESERVED_PROPS.hasOwnProperty(propKey)) {
          DOMPropertyOperations.setValueForAttribute(getNode(this), propKey, nextProp);
        }
      } else if (DOMProperty.properties[propKey] || DOMProperty.isCustomAttribute(propKey)) {
        var node = getNode(this);
        // If we're updating to null or undefined, we should remove the property
        // from the DOM node instead of inadvertently setting to a string. This
        // brings us in line with the same behavior we have on initial render.
        if (nextProp != null) {
          DOMPropertyOperations.setValueForProperty(node, propKey, nextProp);
        } else {
          DOMPropertyOperations.deleteValueForProperty(node, propKey);
        }
      }
    }
    if (styleUpdates) {
      CSSPropertyOperations.setValueForStyles(getNode(this), styleUpdates, this);
    }
  },

  /**
   * Reconciles the children with the various properties that affect the
   * children content.
   *
   * @param {object} lastProps
   * @param {object} nextProps
   * @param {ReactReconcileTransaction} transaction
   * @param {object} context
   */
  _updateDOMChildren: function (lastProps, nextProps, transaction, context) {
    var lastContent = CONTENT_TYPES[typeof lastProps.children] ? lastProps.children : null;
    var nextContent = CONTENT_TYPES[typeof nextProps.children] ? nextProps.children : null;

    var lastHtml = lastProps.dangerouslySetInnerHTML && lastProps.dangerouslySetInnerHTML.__html;
    var nextHtml = nextProps.dangerouslySetInnerHTML && nextProps.dangerouslySetInnerHTML.__html;

    // Note the use of `!=` which checks for null or undefined.
    var lastChildren = lastContent != null ? null : lastProps.children;
    var nextChildren = nextContent != null ? null : nextProps.children;

    // If we're switching from children to content/html or vice versa, remove
    // the old content
    var lastHasContentOrHtml = lastContent != null || lastHtml != null;
    var nextHasContentOrHtml = nextContent != null || nextHtml != null;
    if (lastChildren != null && nextChildren == null) {
      this.updateChildren(null, transaction, context);
    } else if (lastHasContentOrHtml && !nextHasContentOrHtml) {
      this.updateTextContent('');
      if (process.env.NODE_ENV !== 'production') {
        ReactInstrumentation.debugTool.onSetChildren(this._debugID, []);
      }
    }

    if (nextContent != null) {
      if (lastContent !== nextContent) {
        this.updateTextContent('' + nextContent);
        if (process.env.NODE_ENV !== 'production') {
          setAndValidateContentChildDev.call(this, nextContent);
        }
      }
    } else if (nextHtml != null) {
      if (lastHtml !== nextHtml) {
        this.updateMarkup('' + nextHtml);
      }
      if (process.env.NODE_ENV !== 'production') {
        ReactInstrumentation.debugTool.onSetChildren(this._debugID, []);
      }
    } else if (nextChildren != null) {
      if (process.env.NODE_ENV !== 'production') {
        setAndValidateContentChildDev.call(this, null);
      }

      this.updateChildren(nextChildren, transaction, context);
    }
  },

  getHostNode: function () {
    return getNode(this);
  },

  /**
   * Destroys all event registrations for this instance. Does not remove from
   * the DOM. That must be done by the parent.
   *
   * @internal
   */
  unmountComponent: function (safely) {
    switch (this._tag) {
      case 'audio':
      case 'form':
      case 'iframe':
      case 'img':
      case 'link':
      case 'object':
      case 'source':
      case 'video':
        var listeners = this._wrapperState.listeners;
        if (listeners) {
          for (var i = 0; i < listeners.length; i++) {
            listeners[i].remove();
          }
        }
        break;
      case 'html':
      case 'head':
      case 'body':
        /**
         * Components like <html> <head> and <body> can't be removed or added
         * easily in a cross-browser way, however it's valuable to be able to
         * take advantage of React's reconciliation for styling and <title>
         * management. So we just document it and throw in dangerous cases.
         */
        !false ? process.env.NODE_ENV !== 'production' ? invariant(false, '<%s> tried to unmount. Because of cross-browser quirks it is impossible to unmount some top-level components (eg <html>, <head>, and <body>) reliably and efficiently. To fix this, have a single top-level component that never unmounts render these elements.', this._tag) : _prodInvariant('66', this._tag) : void 0;
        break;
    }

    this.unmountChildren(safely);
    ReactDOMComponentTree.uncacheNode(this);
    EventPluginHub.deleteAllListeners(this);
    this._rootNodeID = 0;
    this._domID = 0;
    this._wrapperState = null;

    if (process.env.NODE_ENV !== 'production') {
      setAndValidateContentChildDev.call(this, null);
    }
  },

  getPublicInstance: function () {
    return getNode(this);
  }

};

_assign(ReactDOMComponent.prototype, ReactDOMComponent.Mixin, ReactMultiChild.Mixin);

module.exports = ReactDOMComponent;
}).call(this,require('_process'))
},{"./AutoFocusUtils":61,"./CSSPropertyOperations":64,"./DOMLazyTree":68,"./DOMNamespaces":69,"./DOMProperty":70,"./DOMPropertyOperations":71,"./EventPluginHub":75,"./EventPluginRegistry":76,"./ReactBrowserEventEmitter":84,"./ReactDOMComponentFlags":91,"./ReactDOMComponentTree":92,"./ReactDOMInput":97,"./ReactDOMOption":100,"./ReactDOMSelect":101,"./ReactDOMTextarea":104,"./ReactInstrumentation":121,"./ReactMultiChild":125,"./ReactServerRenderingTransaction":133,"./escapeTextContentForBrowser":161,"./isEventSupported":176,"./reactProdInvariant":179,"./validateDOMNesting":185,"_process":58,"fbjs/lib/emptyFunction":9,"fbjs/lib/invariant":17,"fbjs/lib/shallowEqual":23,"fbjs/lib/warning":24,"object-assign":57}],91:[function(require,module,exports){
/**
 * Copyright 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var ReactDOMComponentFlags = {
  hasCachedChildNodes: 1 << 0
};

module.exports = ReactDOMComponentFlags;
},{}],92:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var _prodInvariant = require('./reactProdInvariant');

var DOMProperty = require('./DOMProperty');
var ReactDOMComponentFlags = require('./ReactDOMComponentFlags');

var invariant = require('fbjs/lib/invariant');

var ATTR_NAME = DOMProperty.ID_ATTRIBUTE_NAME;
var Flags = ReactDOMComponentFlags;

var internalInstanceKey = '__reactInternalInstance$' + Math.random().toString(36).slice(2);

/**
 * Check if a given node should be cached.
 */
function shouldPrecacheNode(node, nodeID) {
  return node.nodeType === 1 && node.getAttribute(ATTR_NAME) === String(nodeID) || node.nodeType === 8 && node.nodeValue === ' react-text: ' + nodeID + ' ' || node.nodeType === 8 && node.nodeValue === ' react-empty: ' + nodeID + ' ';
}

/**
 * Drill down (through composites and empty components) until we get a host or
 * host text component.
 *
 * This is pretty polymorphic but unavoidable with the current structure we have
 * for `_renderedChildren`.
 */
function getRenderedHostOrTextFromComponent(component) {
  var rendered;
  while (rendered = component._renderedComponent) {
    component = rendered;
  }
  return component;
}

/**
 * Populate `_hostNode` on the rendered host/text component with the given
 * DOM node. The passed `inst` can be a composite.
 */
function precacheNode(inst, node) {
  var hostInst = getRenderedHostOrTextFromComponent(inst);
  hostInst._hostNode = node;
  node[internalInstanceKey] = hostInst;
}

function uncacheNode(inst) {
  var node = inst._hostNode;
  if (node) {
    delete node[internalInstanceKey];
    inst._hostNode = null;
  }
}

/**
 * Populate `_hostNode` on each child of `inst`, assuming that the children
 * match up with the DOM (element) children of `node`.
 *
 * We cache entire levels at once to avoid an n^2 problem where we access the
 * children of a node sequentially and have to walk from the start to our target
 * node every time.
 *
 * Since we update `_renderedChildren` and the actual DOM at (slightly)
 * different times, we could race here and see a newer `_renderedChildren` than
 * the DOM nodes we see. To avoid this, ReactMultiChild calls
 * `prepareToManageChildren` before we change `_renderedChildren`, at which
 * time the container's child nodes are always cached (until it unmounts).
 */
function precacheChildNodes(inst, node) {
  if (inst._flags & Flags.hasCachedChildNodes) {
    return;
  }
  var children = inst._renderedChildren;
  var childNode = node.firstChild;
  outer: for (var name in children) {
    if (!children.hasOwnProperty(name)) {
      continue;
    }
    var childInst = children[name];
    var childID = getRenderedHostOrTextFromComponent(childInst)._domID;
    if (childID === 0) {
      // We're currently unmounting this child in ReactMultiChild; skip it.
      continue;
    }
    // We assume the child nodes are in the same order as the child instances.
    for (; childNode !== null; childNode = childNode.nextSibling) {
      if (shouldPrecacheNode(childNode, childID)) {
        precacheNode(childInst, childNode);
        continue outer;
      }
    }
    // We reached the end of the DOM children without finding an ID match.
    !false ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Unable to find element with ID %s.', childID) : _prodInvariant('32', childID) : void 0;
  }
  inst._flags |= Flags.hasCachedChildNodes;
}

/**
 * Given a DOM node, return the closest ReactDOMComponent or
 * ReactDOMTextComponent instance ancestor.
 */
function getClosestInstanceFromNode(node) {
  if (node[internalInstanceKey]) {
    return node[internalInstanceKey];
  }

  // Walk up the tree until we find an ancestor whose instance we have cached.
  var parents = [];
  while (!node[internalInstanceKey]) {
    parents.push(node);
    if (node.parentNode) {
      node = node.parentNode;
    } else {
      // Top of the tree. This node must not be part of a React tree (or is
      // unmounted, potentially).
      return null;
    }
  }

  var closest;
  var inst;
  for (; node && (inst = node[internalInstanceKey]); node = parents.pop()) {
    closest = inst;
    if (parents.length) {
      precacheChildNodes(inst, node);
    }
  }

  return closest;
}

/**
 * Given a DOM node, return the ReactDOMComponent or ReactDOMTextComponent
 * instance, or null if the node was not rendered by this React.
 */
function getInstanceFromNode(node) {
  var inst = getClosestInstanceFromNode(node);
  if (inst != null && inst._hostNode === node) {
    return inst;
  } else {
    return null;
  }
}

/**
 * Given a ReactDOMComponent or ReactDOMTextComponent, return the corresponding
 * DOM node.
 */
function getNodeFromInstance(inst) {
  // Without this first invariant, passing a non-DOM-component triggers the next
  // invariant for a missing parent, which is super confusing.
  !(inst._hostNode !== undefined) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'getNodeFromInstance: Invalid argument.') : _prodInvariant('33') : void 0;

  if (inst._hostNode) {
    return inst._hostNode;
  }

  // Walk up the tree until we find an ancestor whose DOM node we have cached.
  var parents = [];
  while (!inst._hostNode) {
    parents.push(inst);
    !inst._hostParent ? process.env.NODE_ENV !== 'production' ? invariant(false, 'React DOM tree root should always have a node reference.') : _prodInvariant('34') : void 0;
    inst = inst._hostParent;
  }

  // Now parents contains each ancestor that does *not* have a cached native
  // node, and `inst` is the deepest ancestor that does.
  for (; parents.length; inst = parents.pop()) {
    precacheChildNodes(inst, inst._hostNode);
  }

  return inst._hostNode;
}

var ReactDOMComponentTree = {
  getClosestInstanceFromNode: getClosestInstanceFromNode,
  getInstanceFromNode: getInstanceFromNode,
  getNodeFromInstance: getNodeFromInstance,
  precacheChildNodes: precacheChildNodes,
  precacheNode: precacheNode,
  uncacheNode: uncacheNode
};

module.exports = ReactDOMComponentTree;
}).call(this,require('_process'))
},{"./DOMProperty":70,"./ReactDOMComponentFlags":91,"./reactProdInvariant":179,"_process":58,"fbjs/lib/invariant":17}],93:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var validateDOMNesting = require('./validateDOMNesting');

var DOC_NODE_TYPE = 9;

function ReactDOMContainerInfo(topLevelWrapper, node) {
  var info = {
    _topLevelWrapper: topLevelWrapper,
    _idCounter: 1,
    _ownerDocument: node ? node.nodeType === DOC_NODE_TYPE ? node : node.ownerDocument : null,
    _node: node,
    _tag: node ? node.nodeName.toLowerCase() : null,
    _namespaceURI: node ? node.namespaceURI : null
  };
  if (process.env.NODE_ENV !== 'production') {
    info._ancestorInfo = node ? validateDOMNesting.updatedAncestorInfo(null, info._tag, null) : null;
  }
  return info;
}

module.exports = ReactDOMContainerInfo;
}).call(this,require('_process'))
},{"./validateDOMNesting":185,"_process":58}],94:[function(require,module,exports){
/**
 * Copyright 2014-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var _assign = require('object-assign');

var DOMLazyTree = require('./DOMLazyTree');
var ReactDOMComponentTree = require('./ReactDOMComponentTree');

var ReactDOMEmptyComponent = function (instantiate) {
  // ReactCompositeComponent uses this:
  this._currentElement = null;
  // ReactDOMComponentTree uses these:
  this._hostNode = null;
  this._hostParent = null;
  this._hostContainerInfo = null;
  this._domID = 0;
};
_assign(ReactDOMEmptyComponent.prototype, {
  mountComponent: function (transaction, hostParent, hostContainerInfo, context) {
    var domID = hostContainerInfo._idCounter++;
    this._domID = domID;
    this._hostParent = hostParent;
    this._hostContainerInfo = hostContainerInfo;

    var nodeValue = ' react-empty: ' + this._domID + ' ';
    if (transaction.useCreateElement) {
      var ownerDocument = hostContainerInfo._ownerDocument;
      var node = ownerDocument.createComment(nodeValue);
      ReactDOMComponentTree.precacheNode(this, node);
      return DOMLazyTree(node);
    } else {
      if (transaction.renderToStaticMarkup) {
        // Normally we'd insert a comment node, but since this is a situation
        // where React won't take over (static pages), we can simply return
        // nothing.
        return '';
      }
      return '<!--' + nodeValue + '-->';
    }
  },
  receiveComponent: function () {},
  getHostNode: function () {
    return ReactDOMComponentTree.getNodeFromInstance(this);
  },
  unmountComponent: function () {
    ReactDOMComponentTree.uncacheNode(this);
  }
});

module.exports = ReactDOMEmptyComponent;
},{"./DOMLazyTree":68,"./ReactDOMComponentTree":92,"object-assign":57}],95:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var ReactDOMFeatureFlags = {
  useCreateElement: true,
  useFiber: false
};

module.exports = ReactDOMFeatureFlags;
},{}],96:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var DOMChildrenOperations = require('./DOMChildrenOperations');
var ReactDOMComponentTree = require('./ReactDOMComponentTree');

/**
 * Operations used to process updates to DOM nodes.
 */
var ReactDOMIDOperations = {

  /**
   * Updates a component's children by processing a series of updates.
   *
   * @param {array<object>} updates List of update configurations.
   * @internal
   */
  dangerouslyProcessChildrenUpdates: function (parentInst, updates) {
    var node = ReactDOMComponentTree.getNodeFromInstance(parentInst);
    DOMChildrenOperations.processUpdates(node, updates);
  }
};

module.exports = ReactDOMIDOperations;
},{"./DOMChildrenOperations":67,"./ReactDOMComponentTree":92}],97:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var _prodInvariant = require('./reactProdInvariant'),
    _assign = require('object-assign');

var DOMPropertyOperations = require('./DOMPropertyOperations');
var LinkedValueUtils = require('./LinkedValueUtils');
var ReactDOMComponentTree = require('./ReactDOMComponentTree');
var ReactUpdates = require('./ReactUpdates');

var invariant = require('fbjs/lib/invariant');
var warning = require('fbjs/lib/warning');

var didWarnValueLink = false;
var didWarnCheckedLink = false;
var didWarnValueDefaultValue = false;
var didWarnCheckedDefaultChecked = false;
var didWarnControlledToUncontrolled = false;
var didWarnUncontrolledToControlled = false;

function forceUpdateIfMounted() {
  if (this._rootNodeID) {
    // DOM component is still mounted; update
    ReactDOMInput.updateWrapper(this);
  }
}

function isControlled(props) {
  var usesChecked = props.type === 'checkbox' || props.type === 'radio';
  return usesChecked ? props.checked != null : props.value != null;
}

/**
 * Implements an <input> host component that allows setting these optional
 * props: `checked`, `value`, `defaultChecked`, and `defaultValue`.
 *
 * If `checked` or `value` are not supplied (or null/undefined), user actions
 * that affect the checked state or value will trigger updates to the element.
 *
 * If they are supplied (and not null/undefined), the rendered element will not
 * trigger updates to the element. Instead, the props must change in order for
 * the rendered element to be updated.
 *
 * The rendered element will be initialized as unchecked (or `defaultChecked`)
 * with an empty value (or `defaultValue`).
 *
 * @see http://www.w3.org/TR/2012/WD-html5-20121025/the-input-element.html
 */
var ReactDOMInput = {
  getHostProps: function (inst, props) {
    var value = LinkedValueUtils.getValue(props);
    var checked = LinkedValueUtils.getChecked(props);

    var hostProps = _assign({
      // Make sure we set .type before any other properties (setting .value
      // before .type means .value is lost in IE11 and below)
      type: undefined,
      // Make sure we set .step before .value (setting .value before .step
      // means .value is rounded on mount, based upon step precision)
      step: undefined,
      // Make sure we set .min & .max before .value (to ensure proper order
      // in corner cases such as min or max deriving from value, e.g. Issue #7170)
      min: undefined,
      max: undefined
    }, props, {
      defaultChecked: undefined,
      defaultValue: undefined,
      value: value != null ? value : inst._wrapperState.initialValue,
      checked: checked != null ? checked : inst._wrapperState.initialChecked,
      onChange: inst._wrapperState.onChange
    });

    return hostProps;
  },

  mountWrapper: function (inst, props) {
    if (process.env.NODE_ENV !== 'production') {
      LinkedValueUtils.checkPropTypes('input', props, inst._currentElement._owner);

      var owner = inst._currentElement._owner;

      if (props.valueLink !== undefined && !didWarnValueLink) {
        process.env.NODE_ENV !== 'production' ? warning(false, '`valueLink` prop on `input` is deprecated; set `value` and `onChange` instead.') : void 0;
        didWarnValueLink = true;
      }
      if (props.checkedLink !== undefined && !didWarnCheckedLink) {
        process.env.NODE_ENV !== 'production' ? warning(false, '`checkedLink` prop on `input` is deprecated; set `value` and `onChange` instead.') : void 0;
        didWarnCheckedLink = true;
      }
      if (props.checked !== undefined && props.defaultChecked !== undefined && !didWarnCheckedDefaultChecked) {
        process.env.NODE_ENV !== 'production' ? warning(false, '%s contains an input of type %s with both checked and defaultChecked props. ' + 'Input elements must be either controlled or uncontrolled ' + '(specify either the checked prop, or the defaultChecked prop, but not ' + 'both). Decide between using a controlled or uncontrolled input ' + 'element and remove one of these props. More info: ' + 'https://fb.me/react-controlled-components', owner && owner.getName() || 'A component', props.type) : void 0;
        didWarnCheckedDefaultChecked = true;
      }
      if (props.value !== undefined && props.defaultValue !== undefined && !didWarnValueDefaultValue) {
        process.env.NODE_ENV !== 'production' ? warning(false, '%s contains an input of type %s with both value and defaultValue props. ' + 'Input elements must be either controlled or uncontrolled ' + '(specify either the value prop, or the defaultValue prop, but not ' + 'both). Decide between using a controlled or uncontrolled input ' + 'element and remove one of these props. More info: ' + 'https://fb.me/react-controlled-components', owner && owner.getName() || 'A component', props.type) : void 0;
        didWarnValueDefaultValue = true;
      }
    }

    var defaultValue = props.defaultValue;
    inst._wrapperState = {
      initialChecked: props.checked != null ? props.checked : props.defaultChecked,
      initialValue: props.value != null ? props.value : defaultValue,
      listeners: null,
      onChange: _handleChange.bind(inst)
    };

    if (process.env.NODE_ENV !== 'production') {
      inst._wrapperState.controlled = isControlled(props);
    }
  },

  updateWrapper: function (inst) {
    var props = inst._currentElement.props;

    if (process.env.NODE_ENV !== 'production') {
      var controlled = isControlled(props);
      var owner = inst._currentElement._owner;

      if (!inst._wrapperState.controlled && controlled && !didWarnUncontrolledToControlled) {
        process.env.NODE_ENV !== 'production' ? warning(false, '%s is changing an uncontrolled input of type %s to be controlled. ' + 'Input elements should not switch from uncontrolled to controlled (or vice versa). ' + 'Decide between using a controlled or uncontrolled input ' + 'element for the lifetime of the component. More info: https://fb.me/react-controlled-components', owner && owner.getName() || 'A component', props.type) : void 0;
        didWarnUncontrolledToControlled = true;
      }
      if (inst._wrapperState.controlled && !controlled && !didWarnControlledToUncontrolled) {
        process.env.NODE_ENV !== 'production' ? warning(false, '%s is changing a controlled input of type %s to be uncontrolled. ' + 'Input elements should not switch from controlled to uncontrolled (or vice versa). ' + 'Decide between using a controlled or uncontrolled input ' + 'element for the lifetime of the component. More info: https://fb.me/react-controlled-components', owner && owner.getName() || 'A component', props.type) : void 0;
        didWarnControlledToUncontrolled = true;
      }
    }

    // TODO: Shouldn't this be getChecked(props)?
    var checked = props.checked;
    if (checked != null) {
      DOMPropertyOperations.setValueForProperty(ReactDOMComponentTree.getNodeFromInstance(inst), 'checked', checked || false);
    }

    var node = ReactDOMComponentTree.getNodeFromInstance(inst);
    var value = LinkedValueUtils.getValue(props);
    if (value != null) {

      // Cast `value` to a string to ensure the value is set correctly. While
      // browsers typically do this as necessary, jsdom doesn't.
      var newValue = '' + value;

      // To avoid side effects (such as losing text selection), only set value if changed
      if (newValue !== node.value) {
        node.value = newValue;
      }
    } else {
      if (props.value == null && props.defaultValue != null) {
        // In Chrome, assigning defaultValue to certain input types triggers input validation.
        // For number inputs, the display value loses trailing decimal points. For email inputs,
        // Chrome raises "The specified value <x> is not a valid email address".
        //
        // Here we check to see if the defaultValue has actually changed, avoiding these problems
        // when the user is inputting text
        //
        // https://github.com/facebook/react/issues/7253
        if (node.defaultValue !== '' + props.defaultValue) {
          node.defaultValue = '' + props.defaultValue;
        }
      }
      if (props.checked == null && props.defaultChecked != null) {
        node.defaultChecked = !!props.defaultChecked;
      }
    }
  },

  postMountWrapper: function (inst) {
    var props = inst._currentElement.props;

    // This is in postMount because we need access to the DOM node, which is not
    // available until after the component has mounted.
    var node = ReactDOMComponentTree.getNodeFromInstance(inst);

    // Detach value from defaultValue. We won't do anything if we're working on
    // submit or reset inputs as those values & defaultValues are linked. They
    // are not resetable nodes so this operation doesn't matter and actually
    // removes browser-default values (eg "Submit Query") when no value is
    // provided.

    switch (props.type) {
      case 'submit':
      case 'reset':
        break;
      case 'color':
      case 'date':
      case 'datetime':
      case 'datetime-local':
      case 'month':
      case 'time':
      case 'week':
        // This fixes the no-show issue on iOS Safari and Android Chrome:
        // https://github.com/facebook/react/issues/7233
        node.value = '';
        node.value = node.defaultValue;
        break;
      default:
        node.value = node.value;
        break;
    }

    // Normally, we'd just do `node.checked = node.checked` upon initial mount, less this bug
    // this is needed to work around a chrome bug where setting defaultChecked
    // will sometimes influence the value of checked (even after detachment).
    // Reference: https://bugs.chromium.org/p/chromium/issues/detail?id=608416
    // We need to temporarily unset name to avoid disrupting radio button groups.
    var name = node.name;
    if (name !== '') {
      node.name = '';
    }
    node.defaultChecked = !node.defaultChecked;
    node.defaultChecked = !node.defaultChecked;
    if (name !== '') {
      node.name = name;
    }
  }
};

function _handleChange(event) {
  var props = this._currentElement.props;

  var returnValue = LinkedValueUtils.executeOnChange(props, event);

  // Here we use asap to wait until all updates have propagated, which
  // is important when using controlled components within layers:
  // https://github.com/facebook/react/issues/1698
  ReactUpdates.asap(forceUpdateIfMounted, this);

  var name = props.name;
  if (props.type === 'radio' && name != null) {
    var rootNode = ReactDOMComponentTree.getNodeFromInstance(this);
    var queryRoot = rootNode;

    while (queryRoot.parentNode) {
      queryRoot = queryRoot.parentNode;
    }

    // If `rootNode.form` was non-null, then we could try `form.elements`,
    // but that sometimes behaves strangely in IE8. We could also try using
    // `form.getElementsByName`, but that will only return direct children
    // and won't include inputs that use the HTML5 `form=` attribute. Since
    // the input might not even be in a form, let's just use the global
    // `querySelectorAll` to ensure we don't miss anything.
    var group = queryRoot.querySelectorAll('input[name=' + JSON.stringify('' + name) + '][type="radio"]');

    for (var i = 0; i < group.length; i++) {
      var otherNode = group[i];
      if (otherNode === rootNode || otherNode.form !== rootNode.form) {
        continue;
      }
      // This will throw if radio buttons rendered by different copies of React
      // and the same name are rendered into the same form (same as #1939).
      // That's probably okay; we don't support it just as we don't support
      // mixing React radio buttons with non-React ones.
      var otherInstance = ReactDOMComponentTree.getInstanceFromNode(otherNode);
      !otherInstance ? process.env.NODE_ENV !== 'production' ? invariant(false, 'ReactDOMInput: Mixing React and non-React radio inputs with the same `name` is not supported.') : _prodInvariant('90') : void 0;
      // If this is a controlled radio button group, forcing the input that
      // was previously checked to update will cause it to be come re-checked
      // as appropriate.
      ReactUpdates.asap(forceUpdateIfMounted, otherInstance);
    }
  }

  return returnValue;
}

module.exports = ReactDOMInput;
}).call(this,require('_process'))
},{"./DOMPropertyOperations":71,"./LinkedValueUtils":82,"./ReactDOMComponentTree":92,"./ReactUpdates":136,"./reactProdInvariant":179,"_process":58,"fbjs/lib/invariant":17,"fbjs/lib/warning":24,"object-assign":57}],98:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var DOMProperty = require('./DOMProperty');
var ReactComponentTreeHook = require('react/lib/ReactComponentTreeHook');

var warning = require('fbjs/lib/warning');

var warnedProperties = {};
var rARIA = new RegExp('^(aria)-[' + DOMProperty.ATTRIBUTE_NAME_CHAR + ']*$');

function validateProperty(tagName, name, debugID) {
  if (warnedProperties.hasOwnProperty(name) && warnedProperties[name]) {
    return true;
  }

  if (rARIA.test(name)) {
    var lowerCasedName = name.toLowerCase();
    var standardName = DOMProperty.getPossibleStandardName.hasOwnProperty(lowerCasedName) ? DOMProperty.getPossibleStandardName[lowerCasedName] : null;

    // If this is an aria-* attribute, but is not listed in the known DOM
    // DOM properties, then it is an invalid aria-* attribute.
    if (standardName == null) {
      warnedProperties[name] = true;
      return false;
    }
    // aria-* attributes should be lowercase; suggest the lowercase version.
    if (name !== standardName) {
      process.env.NODE_ENV !== 'production' ? warning(false, 'Unknown ARIA attribute %s. Did you mean %s?%s', name, standardName, ReactComponentTreeHook.getStackAddendumByID(debugID)) : void 0;
      warnedProperties[name] = true;
      return true;
    }
  }

  return true;
}

function warnInvalidARIAProps(debugID, element) {
  var invalidProps = [];

  for (var key in element.props) {
    var isValid = validateProperty(element.type, key, debugID);
    if (!isValid) {
      invalidProps.push(key);
    }
  }

  var unknownPropString = invalidProps.map(function (prop) {
    return '`' + prop + '`';
  }).join(', ');

  if (invalidProps.length === 1) {
    process.env.NODE_ENV !== 'production' ? warning(false, 'Invalid aria prop %s on <%s> tag. ' + 'For details, see https://fb.me/invalid-aria-prop%s', unknownPropString, element.type, ReactComponentTreeHook.getStackAddendumByID(debugID)) : void 0;
  } else if (invalidProps.length > 1) {
    process.env.NODE_ENV !== 'production' ? warning(false, 'Invalid aria props %s on <%s> tag. ' + 'For details, see https://fb.me/invalid-aria-prop%s', unknownPropString, element.type, ReactComponentTreeHook.getStackAddendumByID(debugID)) : void 0;
  }
}

function handleElement(debugID, element) {
  if (element == null || typeof element.type !== 'string') {
    return;
  }
  if (element.type.indexOf('-') >= 0 || element.props.is) {
    return;
  }

  warnInvalidARIAProps(debugID, element);
}

var ReactDOMInvalidARIAHook = {
  onBeforeMountComponent: function (debugID, element) {
    if (process.env.NODE_ENV !== 'production') {
      handleElement(debugID, element);
    }
  },
  onBeforeUpdateComponent: function (debugID, element) {
    if (process.env.NODE_ENV !== 'production') {
      handleElement(debugID, element);
    }
  }
};

module.exports = ReactDOMInvalidARIAHook;
}).call(this,require('_process'))
},{"./DOMProperty":70,"_process":58,"fbjs/lib/warning":24,"react/lib/ReactComponentTreeHook":192}],99:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var ReactComponentTreeHook = require('react/lib/ReactComponentTreeHook');

var warning = require('fbjs/lib/warning');

var didWarnValueNull = false;

function handleElement(debugID, element) {
  if (element == null) {
    return;
  }
  if (element.type !== 'input' && element.type !== 'textarea' && element.type !== 'select') {
    return;
  }
  if (element.props != null && element.props.value === null && !didWarnValueNull) {
    process.env.NODE_ENV !== 'production' ? warning(false, '`value` prop on `%s` should not be null. ' + 'Consider using the empty string to clear the component or `undefined` ' + 'for uncontrolled components.%s', element.type, ReactComponentTreeHook.getStackAddendumByID(debugID)) : void 0;

    didWarnValueNull = true;
  }
}

var ReactDOMNullInputValuePropHook = {
  onBeforeMountComponent: function (debugID, element) {
    handleElement(debugID, element);
  },
  onBeforeUpdateComponent: function (debugID, element) {
    handleElement(debugID, element);
  }
};

module.exports = ReactDOMNullInputValuePropHook;
}).call(this,require('_process'))
},{"_process":58,"fbjs/lib/warning":24,"react/lib/ReactComponentTreeHook":192}],100:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var _assign = require('object-assign');

var React = require('react/lib/React');
var ReactDOMComponentTree = require('./ReactDOMComponentTree');
var ReactDOMSelect = require('./ReactDOMSelect');

var warning = require('fbjs/lib/warning');
var didWarnInvalidOptionChildren = false;

function flattenChildren(children) {
  var content = '';

  // Flatten children and warn if they aren't strings or numbers;
  // invalid types are ignored.
  React.Children.forEach(children, function (child) {
    if (child == null) {
      return;
    }
    if (typeof child === 'string' || typeof child === 'number') {
      content += child;
    } else if (!didWarnInvalidOptionChildren) {
      didWarnInvalidOptionChildren = true;
      process.env.NODE_ENV !== 'production' ? warning(false, 'Only strings and numbers are supported as <option> children.') : void 0;
    }
  });

  return content;
}

/**
 * Implements an <option> host component that warns when `selected` is set.
 */
var ReactDOMOption = {
  mountWrapper: function (inst, props, hostParent) {
    // TODO (yungsters): Remove support for `selected` in <option>.
    if (process.env.NODE_ENV !== 'production') {
      process.env.NODE_ENV !== 'production' ? warning(props.selected == null, 'Use the `defaultValue` or `value` props on <select> instead of ' + 'setting `selected` on <option>.') : void 0;
    }

    // Look up whether this option is 'selected'
    var selectValue = null;
    if (hostParent != null) {
      var selectParent = hostParent;

      if (selectParent._tag === 'optgroup') {
        selectParent = selectParent._hostParent;
      }

      if (selectParent != null && selectParent._tag === 'select') {
        selectValue = ReactDOMSelect.getSelectValueContext(selectParent);
      }
    }

    // If the value is null (e.g., no specified value or after initial mount)
    // or missing (e.g., for <datalist>), we don't change props.selected
    var selected = null;
    if (selectValue != null) {
      var value;
      if (props.value != null) {
        value = props.value + '';
      } else {
        value = flattenChildren(props.children);
      }
      selected = false;
      if (Array.isArray(selectValue)) {
        // multiple
        for (var i = 0; i < selectValue.length; i++) {
          if ('' + selectValue[i] === value) {
            selected = true;
            break;
          }
        }
      } else {
        selected = '' + selectValue === value;
      }
    }

    inst._wrapperState = { selected: selected };
  },

  postMountWrapper: function (inst) {
    // value="" should make a value attribute (#6219)
    var props = inst._currentElement.props;
    if (props.value != null) {
      var node = ReactDOMComponentTree.getNodeFromInstance(inst);
      node.setAttribute('value', props.value);
    }
  },

  getHostProps: function (inst, props) {
    var hostProps = _assign({ selected: undefined, children: undefined }, props);

    // Read state only from initial mount because <select> updates value
    // manually; we need the initial state only for server rendering
    if (inst._wrapperState.selected != null) {
      hostProps.selected = inst._wrapperState.selected;
    }

    var content = flattenChildren(props.children);

    if (content) {
      hostProps.children = content;
    }

    return hostProps;
  }

};

module.exports = ReactDOMOption;
}).call(this,require('_process'))
},{"./ReactDOMComponentTree":92,"./ReactDOMSelect":101,"_process":58,"fbjs/lib/warning":24,"object-assign":57,"react/lib/React":188}],101:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var _assign = require('object-assign');

var LinkedValueUtils = require('./LinkedValueUtils');
var ReactDOMComponentTree = require('./ReactDOMComponentTree');
var ReactUpdates = require('./ReactUpdates');

var warning = require('fbjs/lib/warning');

var didWarnValueLink = false;
var didWarnValueDefaultValue = false;

function updateOptionsIfPendingUpdateAndMounted() {
  if (this._rootNodeID && this._wrapperState.pendingUpdate) {
    this._wrapperState.pendingUpdate = false;

    var props = this._currentElement.props;
    var value = LinkedValueUtils.getValue(props);

    if (value != null) {
      updateOptions(this, Boolean(props.multiple), value);
    }
  }
}

function getDeclarationErrorAddendum(owner) {
  if (owner) {
    var name = owner.getName();
    if (name) {
      return ' Check the render method of `' + name + '`.';
    }
  }
  return '';
}

var valuePropNames = ['value', 'defaultValue'];

/**
 * Validation function for `value` and `defaultValue`.
 * @private
 */
function checkSelectPropTypes(inst, props) {
  var owner = inst._currentElement._owner;
  LinkedValueUtils.checkPropTypes('select', props, owner);

  if (props.valueLink !== undefined && !didWarnValueLink) {
    process.env.NODE_ENV !== 'production' ? warning(false, '`valueLink` prop on `select` is deprecated; set `value` and `onChange` instead.') : void 0;
    didWarnValueLink = true;
  }

  for (var i = 0; i < valuePropNames.length; i++) {
    var propName = valuePropNames[i];
    if (props[propName] == null) {
      continue;
    }
    var isArray = Array.isArray(props[propName]);
    if (props.multiple && !isArray) {
      process.env.NODE_ENV !== 'production' ? warning(false, 'The `%s` prop supplied to <select> must be an array if ' + '`multiple` is true.%s', propName, getDeclarationErrorAddendum(owner)) : void 0;
    } else if (!props.multiple && isArray) {
      process.env.NODE_ENV !== 'production' ? warning(false, 'The `%s` prop supplied to <select> must be a scalar ' + 'value if `multiple` is false.%s', propName, getDeclarationErrorAddendum(owner)) : void 0;
    }
  }
}

/**
 * @param {ReactDOMComponent} inst
 * @param {boolean} multiple
 * @param {*} propValue A stringable (with `multiple`, a list of stringables).
 * @private
 */
function updateOptions(inst, multiple, propValue) {
  var selectedValue, i;
  var options = ReactDOMComponentTree.getNodeFromInstance(inst).options;

  if (multiple) {
    selectedValue = {};
    for (i = 0; i < propValue.length; i++) {
      selectedValue['' + propValue[i]] = true;
    }
    for (i = 0; i < options.length; i++) {
      var selected = selectedValue.hasOwnProperty(options[i].value);
      if (options[i].selected !== selected) {
        options[i].selected = selected;
      }
    }
  } else {
    // Do not set `select.value` as exact behavior isn't consistent across all
    // browsers for all cases.
    selectedValue = '' + propValue;
    for (i = 0; i < options.length; i++) {
      if (options[i].value === selectedValue) {
        options[i].selected = true;
        return;
      }
    }
    if (options.length) {
      options[0].selected = true;
    }
  }
}

/**
 * Implements a <select> host component that allows optionally setting the
 * props `value` and `defaultValue`. If `multiple` is false, the prop must be a
 * stringable. If `multiple` is true, the prop must be an array of stringables.
 *
 * If `value` is not supplied (or null/undefined), user actions that change the
 * selected option will trigger updates to the rendered options.
 *
 * If it is supplied (and not null/undefined), the rendered options will not
 * update in response to user actions. Instead, the `value` prop must change in
 * order for the rendered options to update.
 *
 * If `defaultValue` is provided, any options with the supplied values will be
 * selected.
 */
var ReactDOMSelect = {
  getHostProps: function (inst, props) {
    return _assign({}, props, {
      onChange: inst._wrapperState.onChange,
      value: undefined
    });
  },

  mountWrapper: function (inst, props) {
    if (process.env.NODE_ENV !== 'production') {
      checkSelectPropTypes(inst, props);
    }

    var value = LinkedValueUtils.getValue(props);
    inst._wrapperState = {
      pendingUpdate: false,
      initialValue: value != null ? value : props.defaultValue,
      listeners: null,
      onChange: _handleChange.bind(inst),
      wasMultiple: Boolean(props.multiple)
    };

    if (props.value !== undefined && props.defaultValue !== undefined && !didWarnValueDefaultValue) {
      process.env.NODE_ENV !== 'production' ? warning(false, 'Select elements must be either controlled or uncontrolled ' + '(specify either the value prop, or the defaultValue prop, but not ' + 'both). Decide between using a controlled or uncontrolled select ' + 'element and remove one of these props. More info: ' + 'https://fb.me/react-controlled-components') : void 0;
      didWarnValueDefaultValue = true;
    }
  },

  getSelectValueContext: function (inst) {
    // ReactDOMOption looks at this initial value so the initial generated
    // markup has correct `selected` attributes
    return inst._wrapperState.initialValue;
  },

  postUpdateWrapper: function (inst) {
    var props = inst._currentElement.props;

    // After the initial mount, we control selected-ness manually so don't pass
    // this value down
    inst._wrapperState.initialValue = undefined;

    var wasMultiple = inst._wrapperState.wasMultiple;
    inst._wrapperState.wasMultiple = Boolean(props.multiple);

    var value = LinkedValueUtils.getValue(props);
    if (value != null) {
      inst._wrapperState.pendingUpdate = false;
      updateOptions(inst, Boolean(props.multiple), value);
    } else if (wasMultiple !== Boolean(props.multiple)) {
      // For simplicity, reapply `defaultValue` if `multiple` is toggled.
      if (props.defaultValue != null) {
        updateOptions(inst, Boolean(props.multiple), props.defaultValue);
      } else {
        // Revert the select back to its default unselected state.
        updateOptions(inst, Boolean(props.multiple), props.multiple ? [] : '');
      }
    }
  }
};

function _handleChange(event) {
  var props = this._currentElement.props;
  var returnValue = LinkedValueUtils.executeOnChange(props, event);

  if (this._rootNodeID) {
    this._wrapperState.pendingUpdate = true;
  }
  ReactUpdates.asap(updateOptionsIfPendingUpdateAndMounted, this);
  return returnValue;
}

module.exports = ReactDOMSelect;
}).call(this,require('_process'))
},{"./LinkedValueUtils":82,"./ReactDOMComponentTree":92,"./ReactUpdates":136,"_process":58,"fbjs/lib/warning":24,"object-assign":57}],102:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var ExecutionEnvironment = require('fbjs/lib/ExecutionEnvironment');

var getNodeForCharacterOffset = require('./getNodeForCharacterOffset');
var getTextContentAccessor = require('./getTextContentAccessor');

/**
 * While `isCollapsed` is available on the Selection object and `collapsed`
 * is available on the Range object, IE11 sometimes gets them wrong.
 * If the anchor/focus nodes and offsets are the same, the range is collapsed.
 */
function isCollapsed(anchorNode, anchorOffset, focusNode, focusOffset) {
  return anchorNode === focusNode && anchorOffset === focusOffset;
}

/**
 * Get the appropriate anchor and focus node/offset pairs for IE.
 *
 * The catch here is that IE's selection API doesn't provide information
 * about whether the selection is forward or backward, so we have to
 * behave as though it's always forward.
 *
 * IE text differs from modern selection in that it behaves as though
 * block elements end with a new line. This means character offsets will
 * differ between the two APIs.
 *
 * @param {DOMElement} node
 * @return {object}
 */
function getIEOffsets(node) {
  var selection = document.selection;
  var selectedRange = selection.createRange();
  var selectedLength = selectedRange.text.length;

  // Duplicate selection so we can move range without breaking user selection.
  var fromStart = selectedRange.duplicate();
  fromStart.moveToElementText(node);
  fromStart.setEndPoint('EndToStart', selectedRange);

  var startOffset = fromStart.text.length;
  var endOffset = startOffset + selectedLength;

  return {
    start: startOffset,
    end: endOffset
  };
}

/**
 * @param {DOMElement} node
 * @return {?object}
 */
function getModernOffsets(node) {
  var selection = window.getSelection && window.getSelection();

  if (!selection || selection.rangeCount === 0) {
    return null;
  }

  var anchorNode = selection.anchorNode;
  var anchorOffset = selection.anchorOffset;
  var focusNode = selection.focusNode;
  var focusOffset = selection.focusOffset;

  var currentRange = selection.getRangeAt(0);

  // In Firefox, range.startContainer and range.endContainer can be "anonymous
  // divs", e.g. the up/down buttons on an <input type="number">. Anonymous
  // divs do not seem to expose properties, triggering a "Permission denied
  // error" if any of its properties are accessed. The only seemingly possible
  // way to avoid erroring is to access a property that typically works for
  // non-anonymous divs and catch any error that may otherwise arise. See
  // https://bugzilla.mozilla.org/show_bug.cgi?id=208427
  try {
    /* eslint-disable no-unused-expressions */
    currentRange.startContainer.nodeType;
    currentRange.endContainer.nodeType;
    /* eslint-enable no-unused-expressions */
  } catch (e) {
    return null;
  }

  // If the node and offset values are the same, the selection is collapsed.
  // `Selection.isCollapsed` is available natively, but IE sometimes gets
  // this value wrong.
  var isSelectionCollapsed = isCollapsed(selection.anchorNode, selection.anchorOffset, selection.focusNode, selection.focusOffset);

  var rangeLength = isSelectionCollapsed ? 0 : currentRange.toString().length;

  var tempRange = currentRange.cloneRange();
  tempRange.selectNodeContents(node);
  tempRange.setEnd(currentRange.startContainer, currentRange.startOffset);

  var isTempRangeCollapsed = isCollapsed(tempRange.startContainer, tempRange.startOffset, tempRange.endContainer, tempRange.endOffset);

  var start = isTempRangeCollapsed ? 0 : tempRange.toString().length;
  var end = start + rangeLength;

  // Detect whether the selection is backward.
  var detectionRange = document.createRange();
  detectionRange.setStart(anchorNode, anchorOffset);
  detectionRange.setEnd(focusNode, focusOffset);
  var isBackward = detectionRange.collapsed;

  return {
    start: isBackward ? end : start,
    end: isBackward ? start : end
  };
}

/**
 * @param {DOMElement|DOMTextNode} node
 * @param {object} offsets
 */
function setIEOffsets(node, offsets) {
  var range = document.selection.createRange().duplicate();
  var start, end;

  if (offsets.end === undefined) {
    start = offsets.start;
    end = start;
  } else if (offsets.start > offsets.end) {
    start = offsets.end;
    end = offsets.start;
  } else {
    start = offsets.start;
    end = offsets.end;
  }

  range.moveToElementText(node);
  range.moveStart('character', start);
  range.setEndPoint('EndToStart', range);
  range.moveEnd('character', end - start);
  range.select();
}

/**
 * In modern non-IE browsers, we can support both forward and backward
 * selections.
 *
 * Note: IE10+ supports the Selection object, but it does not support
 * the `extend` method, which means that even in modern IE, it's not possible
 * to programmatically create a backward selection. Thus, for all IE
 * versions, we use the old IE API to create our selections.
 *
 * @param {DOMElement|DOMTextNode} node
 * @param {object} offsets
 */
function setModernOffsets(node, offsets) {
  if (!window.getSelection) {
    return;
  }

  var selection = window.getSelection();
  var length = node[getTextContentAccessor()].length;
  var start = Math.min(offsets.start, length);
  var end = offsets.end === undefined ? start : Math.min(offsets.end, length);

  // IE 11 uses modern selection, but doesn't support the extend method.
  // Flip backward selections, so we can set with a single range.
  if (!selection.extend && start > end) {
    var temp = end;
    end = start;
    start = temp;
  }

  var startMarker = getNodeForCharacterOffset(node, start);
  var endMarker = getNodeForCharacterOffset(node, end);

  if (startMarker && endMarker) {
    var range = document.createRange();
    range.setStart(startMarker.node, startMarker.offset);
    selection.removeAllRanges();

    if (start > end) {
      selection.addRange(range);
      selection.extend(endMarker.node, endMarker.offset);
    } else {
      range.setEnd(endMarker.node, endMarker.offset);
      selection.addRange(range);
    }
  }
}

var useIEOffsets = ExecutionEnvironment.canUseDOM && 'selection' in document && !('getSelection' in window);

var ReactDOMSelection = {
  /**
   * @param {DOMElement} node
   */
  getOffsets: useIEOffsets ? getIEOffsets : getModernOffsets,

  /**
   * @param {DOMElement|DOMTextNode} node
   * @param {object} offsets
   */
  setOffsets: useIEOffsets ? setIEOffsets : setModernOffsets
};

module.exports = ReactDOMSelection;
},{"./getNodeForCharacterOffset":172,"./getTextContentAccessor":173,"fbjs/lib/ExecutionEnvironment":3}],103:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var _prodInvariant = require('./reactProdInvariant'),
    _assign = require('object-assign');

var DOMChildrenOperations = require('./DOMChildrenOperations');
var DOMLazyTree = require('./DOMLazyTree');
var ReactDOMComponentTree = require('./ReactDOMComponentTree');

var escapeTextContentForBrowser = require('./escapeTextContentForBrowser');
var invariant = require('fbjs/lib/invariant');
var validateDOMNesting = require('./validateDOMNesting');

/**
 * Text nodes violate a couple assumptions that React makes about components:
 *
 *  - When mounting text into the DOM, adjacent text nodes are merged.
 *  - Text nodes cannot be assigned a React root ID.
 *
 * This component is used to wrap strings between comment nodes so that they
 * can undergo the same reconciliation that is applied to elements.
 *
 * TODO: Investigate representing React components in the DOM with text nodes.
 *
 * @class ReactDOMTextComponent
 * @extends ReactComponent
 * @internal
 */
var ReactDOMTextComponent = function (text) {
  // TODO: This is really a ReactText (ReactNode), not a ReactElement
  this._currentElement = text;
  this._stringText = '' + text;
  // ReactDOMComponentTree uses these:
  this._hostNode = null;
  this._hostParent = null;

  // Properties
  this._domID = 0;
  this._mountIndex = 0;
  this._closingComment = null;
  this._commentNodes = null;
};

_assign(ReactDOMTextComponent.prototype, {

  /**
   * Creates the markup for this text node. This node is not intended to have
   * any features besides containing text content.
   *
   * @param {ReactReconcileTransaction|ReactServerRenderingTransaction} transaction
   * @return {string} Markup for this text node.
   * @internal
   */
  mountComponent: function (transaction, hostParent, hostContainerInfo, context) {
    if (process.env.NODE_ENV !== 'production') {
      var parentInfo;
      if (hostParent != null) {
        parentInfo = hostParent._ancestorInfo;
      } else if (hostContainerInfo != null) {
        parentInfo = hostContainerInfo._ancestorInfo;
      }
      if (parentInfo) {
        // parentInfo should always be present except for the top-level
        // component when server rendering
        validateDOMNesting(null, this._stringText, this, parentInfo);
      }
    }

    var domID = hostContainerInfo._idCounter++;
    var openingValue = ' react-text: ' + domID + ' ';
    var closingValue = ' /react-text ';
    this._domID = domID;
    this._hostParent = hostParent;
    if (transaction.useCreateElement) {
      var ownerDocument = hostContainerInfo._ownerDocument;
      var openingComment = ownerDocument.createComment(openingValue);
      var closingComment = ownerDocument.createComment(closingValue);
      var lazyTree = DOMLazyTree(ownerDocument.createDocumentFragment());
      DOMLazyTree.queueChild(lazyTree, DOMLazyTree(openingComment));
      if (this._stringText) {
        DOMLazyTree.queueChild(lazyTree, DOMLazyTree(ownerDocument.createTextNode(this._stringText)));
      }
      DOMLazyTree.queueChild(lazyTree, DOMLazyTree(closingComment));
      ReactDOMComponentTree.precacheNode(this, openingComment);
      this._closingComment = closingComment;
      return lazyTree;
    } else {
      var escapedText = escapeTextContentForBrowser(this._stringText);

      if (transaction.renderToStaticMarkup) {
        // Normally we'd wrap this between comment nodes for the reasons stated
        // above, but since this is a situation where React won't take over
        // (static pages), we can simply return the text as it is.
        return escapedText;
      }

      return '<!--' + openingValue + '-->' + escapedText + '<!--' + closingValue + '-->';
    }
  },

  /**
   * Updates this component by updating the text content.
   *
   * @param {ReactText} nextText The next text content
   * @param {ReactReconcileTransaction} transaction
   * @internal
   */
  receiveComponent: function (nextText, transaction) {
    if (nextText !== this._currentElement) {
      this._currentElement = nextText;
      var nextStringText = '' + nextText;
      if (nextStringText !== this._stringText) {
        // TODO: Save this as pending props and use performUpdateIfNecessary
        // and/or updateComponent to do the actual update for consistency with
        // other component types?
        this._stringText = nextStringText;
        var commentNodes = this.getHostNode();
        DOMChildrenOperations.replaceDelimitedText(commentNodes[0], commentNodes[1], nextStringText);
      }
    }
  },

  getHostNode: function () {
    var hostNode = this._commentNodes;
    if (hostNode) {
      return hostNode;
    }
    if (!this._closingComment) {
      var openingComment = ReactDOMComponentTree.getNodeFromInstance(this);
      var node = openingComment.nextSibling;
      while (true) {
        !(node != null) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Missing closing comment for text component %s', this._domID) : _prodInvariant('67', this._domID) : void 0;
        if (node.nodeType === 8 && node.nodeValue === ' /react-text ') {
          this._closingComment = node;
          break;
        }
        node = node.nextSibling;
      }
    }
    hostNode = [this._hostNode, this._closingComment];
    this._commentNodes = hostNode;
    return hostNode;
  },

  unmountComponent: function () {
    this._closingComment = null;
    this._commentNodes = null;
    ReactDOMComponentTree.uncacheNode(this);
  }

});

module.exports = ReactDOMTextComponent;
}).call(this,require('_process'))
},{"./DOMChildrenOperations":67,"./DOMLazyTree":68,"./ReactDOMComponentTree":92,"./escapeTextContentForBrowser":161,"./reactProdInvariant":179,"./validateDOMNesting":185,"_process":58,"fbjs/lib/invariant":17,"object-assign":57}],104:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var _prodInvariant = require('./reactProdInvariant'),
    _assign = require('object-assign');

var LinkedValueUtils = require('./LinkedValueUtils');
var ReactDOMComponentTree = require('./ReactDOMComponentTree');
var ReactUpdates = require('./ReactUpdates');

var invariant = require('fbjs/lib/invariant');
var warning = require('fbjs/lib/warning');

var didWarnValueLink = false;
var didWarnValDefaultVal = false;

function forceUpdateIfMounted() {
  if (this._rootNodeID) {
    // DOM component is still mounted; update
    ReactDOMTextarea.updateWrapper(this);
  }
}

/**
 * Implements a <textarea> host component that allows setting `value`, and
 * `defaultValue`. This differs from the traditional DOM API because value is
 * usually set as PCDATA children.
 *
 * If `value` is not supplied (or null/undefined), user actions that affect the
 * value will trigger updates to the element.
 *
 * If `value` is supplied (and not null/undefined), the rendered element will
 * not trigger updates to the element. Instead, the `value` prop must change in
 * order for the rendered element to be updated.
 *
 * The rendered element will be initialized with an empty value, the prop
 * `defaultValue` if specified, or the children content (deprecated).
 */
var ReactDOMTextarea = {
  getHostProps: function (inst, props) {
    !(props.dangerouslySetInnerHTML == null) ? process.env.NODE_ENV !== 'production' ? invariant(false, '`dangerouslySetInnerHTML` does not make sense on <textarea>.') : _prodInvariant('91') : void 0;

    // Always set children to the same thing. In IE9, the selection range will
    // get reset if `textContent` is mutated.  We could add a check in setTextContent
    // to only set the value if/when the value differs from the node value (which would
    // completely solve this IE9 bug), but Sebastian+Ben seemed to like this solution.
    // The value can be a boolean or object so that's why it's forced to be a string.
    var hostProps = _assign({}, props, {
      value: undefined,
      defaultValue: undefined,
      children: '' + inst._wrapperState.initialValue,
      onChange: inst._wrapperState.onChange
    });

    return hostProps;
  },

  mountWrapper: function (inst, props) {
    if (process.env.NODE_ENV !== 'production') {
      LinkedValueUtils.checkPropTypes('textarea', props, inst._currentElement._owner);
      if (props.valueLink !== undefined && !didWarnValueLink) {
        process.env.NODE_ENV !== 'production' ? warning(false, '`valueLink` prop on `textarea` is deprecated; set `value` and `onChange` instead.') : void 0;
        didWarnValueLink = true;
      }
      if (props.value !== undefined && props.defaultValue !== undefined && !didWarnValDefaultVal) {
        process.env.NODE_ENV !== 'production' ? warning(false, 'Textarea elements must be either controlled or uncontrolled ' + '(specify either the value prop, or the defaultValue prop, but not ' + 'both). Decide between using a controlled or uncontrolled textarea ' + 'and remove one of these props. More info: ' + 'https://fb.me/react-controlled-components') : void 0;
        didWarnValDefaultVal = true;
      }
    }

    var value = LinkedValueUtils.getValue(props);
    var initialValue = value;

    // Only bother fetching default value if we're going to use it
    if (value == null) {
      var defaultValue = props.defaultValue;
      // TODO (yungsters): Remove support for children content in <textarea>.
      var children = props.children;
      if (children != null) {
        if (process.env.NODE_ENV !== 'production') {
          process.env.NODE_ENV !== 'production' ? warning(false, 'Use the `defaultValue` or `value` props instead of setting ' + 'children on <textarea>.') : void 0;
        }
        !(defaultValue == null) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'If you supply `defaultValue` on a <textarea>, do not pass children.') : _prodInvariant('92') : void 0;
        if (Array.isArray(children)) {
          !(children.length <= 1) ? process.env.NODE_ENV !== 'production' ? invariant(false, '<textarea> can only have at most one child.') : _prodInvariant('93') : void 0;
          children = children[0];
        }

        defaultValue = '' + children;
      }
      if (defaultValue == null) {
        defaultValue = '';
      }
      initialValue = defaultValue;
    }

    inst._wrapperState = {
      initialValue: '' + initialValue,
      listeners: null,
      onChange: _handleChange.bind(inst)
    };
  },

  updateWrapper: function (inst) {
    var props = inst._currentElement.props;

    var node = ReactDOMComponentTree.getNodeFromInstance(inst);
    var value = LinkedValueUtils.getValue(props);
    if (value != null) {
      // Cast `value` to a string to ensure the value is set correctly. While
      // browsers typically do this as necessary, jsdom doesn't.
      var newValue = '' + value;

      // To avoid side effects (such as losing text selection), only set value if changed
      if (newValue !== node.value) {
        node.value = newValue;
      }
      if (props.defaultValue == null) {
        node.defaultValue = newValue;
      }
    }
    if (props.defaultValue != null) {
      node.defaultValue = props.defaultValue;
    }
  },

  postMountWrapper: function (inst) {
    // This is in postMount because we need access to the DOM node, which is not
    // available until after the component has mounted.
    var node = ReactDOMComponentTree.getNodeFromInstance(inst);
    var textContent = node.textContent;

    // Only set node.value if textContent is equal to the expected
    // initial value. In IE10/IE11 there is a bug where the placeholder attribute
    // will populate textContent as well.
    // https://developer.microsoft.com/microsoft-edge/platform/issues/101525/
    if (textContent === inst._wrapperState.initialValue) {
      node.value = textContent;
    }
  }
};

function _handleChange(event) {
  var props = this._currentElement.props;
  var returnValue = LinkedValueUtils.executeOnChange(props, event);
  ReactUpdates.asap(forceUpdateIfMounted, this);
  return returnValue;
}

module.exports = ReactDOMTextarea;
}).call(this,require('_process'))
},{"./LinkedValueUtils":82,"./ReactDOMComponentTree":92,"./ReactUpdates":136,"./reactProdInvariant":179,"_process":58,"fbjs/lib/invariant":17,"fbjs/lib/warning":24,"object-assign":57}],105:[function(require,module,exports){
(function (process){
/**
 * Copyright 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var _prodInvariant = require('./reactProdInvariant');

var invariant = require('fbjs/lib/invariant');

/**
 * Return the lowest common ancestor of A and B, or null if they are in
 * different trees.
 */
function getLowestCommonAncestor(instA, instB) {
  !('_hostNode' in instA) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'getNodeFromInstance: Invalid argument.') : _prodInvariant('33') : void 0;
  !('_hostNode' in instB) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'getNodeFromInstance: Invalid argument.') : _prodInvariant('33') : void 0;

  var depthA = 0;
  for (var tempA = instA; tempA; tempA = tempA._hostParent) {
    depthA++;
  }
  var depthB = 0;
  for (var tempB = instB; tempB; tempB = tempB._hostParent) {
    depthB++;
  }

  // If A is deeper, crawl up.
  while (depthA - depthB > 0) {
    instA = instA._hostParent;
    depthA--;
  }

  // If B is deeper, crawl up.
  while (depthB - depthA > 0) {
    instB = instB._hostParent;
    depthB--;
  }

  // Walk in lockstep until we find a match.
  var depth = depthA;
  while (depth--) {
    if (instA === instB) {
      return instA;
    }
    instA = instA._hostParent;
    instB = instB._hostParent;
  }
  return null;
}

/**
 * Return if A is an ancestor of B.
 */
function isAncestor(instA, instB) {
  !('_hostNode' in instA) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'isAncestor: Invalid argument.') : _prodInvariant('35') : void 0;
  !('_hostNode' in instB) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'isAncestor: Invalid argument.') : _prodInvariant('35') : void 0;

  while (instB) {
    if (instB === instA) {
      return true;
    }
    instB = instB._hostParent;
  }
  return false;
}

/**
 * Return the parent instance of the passed-in instance.
 */
function getParentInstance(inst) {
  !('_hostNode' in inst) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'getParentInstance: Invalid argument.') : _prodInvariant('36') : void 0;

  return inst._hostParent;
}

/**
 * Simulates the traversal of a two-phase, capture/bubble event dispatch.
 */
function traverseTwoPhase(inst, fn, arg) {
  var path = [];
  while (inst) {
    path.push(inst);
    inst = inst._hostParent;
  }
  var i;
  for (i = path.length; i-- > 0;) {
    fn(path[i], 'captured', arg);
  }
  for (i = 0; i < path.length; i++) {
    fn(path[i], 'bubbled', arg);
  }
}

/**
 * Traverses the ID hierarchy and invokes the supplied `cb` on any IDs that
 * should would receive a `mouseEnter` or `mouseLeave` event.
 *
 * Does not invoke the callback on the nearest common ancestor because nothing
 * "entered" or "left" that element.
 */
function traverseEnterLeave(from, to, fn, argFrom, argTo) {
  var common = from && to ? getLowestCommonAncestor(from, to) : null;
  var pathFrom = [];
  while (from && from !== common) {
    pathFrom.push(from);
    from = from._hostParent;
  }
  var pathTo = [];
  while (to && to !== common) {
    pathTo.push(to);
    to = to._hostParent;
  }
  var i;
  for (i = 0; i < pathFrom.length; i++) {
    fn(pathFrom[i], 'bubbled', argFrom);
  }
  for (i = pathTo.length; i-- > 0;) {
    fn(pathTo[i], 'captured', argTo);
  }
}

module.exports = {
  isAncestor: isAncestor,
  getLowestCommonAncestor: getLowestCommonAncestor,
  getParentInstance: getParentInstance,
  traverseTwoPhase: traverseTwoPhase,
  traverseEnterLeave: traverseEnterLeave
};
}).call(this,require('_process'))
},{"./reactProdInvariant":179,"_process":58,"fbjs/lib/invariant":17}],106:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var DOMProperty = require('./DOMProperty');
var EventPluginRegistry = require('./EventPluginRegistry');
var ReactComponentTreeHook = require('react/lib/ReactComponentTreeHook');

var warning = require('fbjs/lib/warning');

if (process.env.NODE_ENV !== 'production') {
  var reactProps = {
    children: true,
    dangerouslySetInnerHTML: true,
    key: true,
    ref: true,

    autoFocus: true,
    defaultValue: true,
    valueLink: true,
    defaultChecked: true,
    checkedLink: true,
    innerHTML: true,
    suppressContentEditableWarning: true,
    onFocusIn: true,
    onFocusOut: true
  };
  var warnedProperties = {};

  var validateProperty = function (tagName, name, debugID) {
    if (DOMProperty.properties.hasOwnProperty(name) || DOMProperty.isCustomAttribute(name)) {
      return true;
    }
    if (reactProps.hasOwnProperty(name) && reactProps[name] || warnedProperties.hasOwnProperty(name) && warnedProperties[name]) {
      return true;
    }
    if (EventPluginRegistry.registrationNameModules.hasOwnProperty(name)) {
      return true;
    }
    warnedProperties[name] = true;
    var lowerCasedName = name.toLowerCase();

    // data-* attributes should be lowercase; suggest the lowercase version
    var standardName = DOMProperty.isCustomAttribute(lowerCasedName) ? lowerCasedName : DOMProperty.getPossibleStandardName.hasOwnProperty(lowerCasedName) ? DOMProperty.getPossibleStandardName[lowerCasedName] : null;

    var registrationName = EventPluginRegistry.possibleRegistrationNames.hasOwnProperty(lowerCasedName) ? EventPluginRegistry.possibleRegistrationNames[lowerCasedName] : null;

    if (standardName != null) {
      process.env.NODE_ENV !== 'production' ? warning(false, 'Unknown DOM property %s. Did you mean %s?%s', name, standardName, ReactComponentTreeHook.getStackAddendumByID(debugID)) : void 0;
      return true;
    } else if (registrationName != null) {
      process.env.NODE_ENV !== 'production' ? warning(false, 'Unknown event handler property %s. Did you mean `%s`?%s', name, registrationName, ReactComponentTreeHook.getStackAddendumByID(debugID)) : void 0;
      return true;
    } else {
      // We were unable to guess which prop the user intended.
      // It is likely that the user was just blindly spreading/forwarding props
      // Components should be careful to only render valid props/attributes.
      // Warning will be invoked in warnUnknownProperties to allow grouping.
      return false;
    }
  };
}

var warnUnknownProperties = function (debugID, element) {
  var unknownProps = [];
  for (var key in element.props) {
    var isValid = validateProperty(element.type, key, debugID);
    if (!isValid) {
      unknownProps.push(key);
    }
  }

  var unknownPropString = unknownProps.map(function (prop) {
    return '`' + prop + '`';
  }).join(', ');

  if (unknownProps.length === 1) {
    process.env.NODE_ENV !== 'production' ? warning(false, 'Unknown prop %s on <%s> tag. Remove this prop from the element. ' + 'For details, see https://fb.me/react-unknown-prop%s', unknownPropString, element.type, ReactComponentTreeHook.getStackAddendumByID(debugID)) : void 0;
  } else if (unknownProps.length > 1) {
    process.env.NODE_ENV !== 'production' ? warning(false, 'Unknown props %s on <%s> tag. Remove these props from the element. ' + 'For details, see https://fb.me/react-unknown-prop%s', unknownPropString, element.type, ReactComponentTreeHook.getStackAddendumByID(debugID)) : void 0;
  }
};

function handleElement(debugID, element) {
  if (element == null || typeof element.type !== 'string') {
    return;
  }
  if (element.type.indexOf('-') >= 0 || element.props.is) {
    return;
  }
  warnUnknownProperties(debugID, element);
}

var ReactDOMUnknownPropertyHook = {
  onBeforeMountComponent: function (debugID, element) {
    handleElement(debugID, element);
  },
  onBeforeUpdateComponent: function (debugID, element) {
    handleElement(debugID, element);
  }
};

module.exports = ReactDOMUnknownPropertyHook;
}).call(this,require('_process'))
},{"./DOMProperty":70,"./EventPluginRegistry":76,"_process":58,"fbjs/lib/warning":24,"react/lib/ReactComponentTreeHook":192}],107:[function(require,module,exports){
(function (process){
/**
 * Copyright 2016-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

'use strict';

var ReactInvalidSetStateWarningHook = require('./ReactInvalidSetStateWarningHook');
var ReactHostOperationHistoryHook = require('./ReactHostOperationHistoryHook');
var ReactComponentTreeHook = require('react/lib/ReactComponentTreeHook');
var ExecutionEnvironment = require('fbjs/lib/ExecutionEnvironment');

var performanceNow = require('fbjs/lib/performanceNow');
var warning = require('fbjs/lib/warning');

var hooks = [];
var didHookThrowForEvent = {};

function callHook(event, fn, context, arg1, arg2, arg3, arg4, arg5) {
  try {
    fn.call(context, arg1, arg2, arg3, arg4, arg5);
  } catch (e) {
    process.env.NODE_ENV !== 'production' ? warning(didHookThrowForEvent[event], 'Exception thrown by hook while handling %s: %s', event, e + '\n' + e.stack) : void 0;
    didHookThrowForEvent[event] = true;
  }
}

function emitEvent(event, arg1, arg2, arg3, arg4, arg5) {
  for (var i = 0; i < hooks.length; i++) {
    var hook = hooks[i];
    var fn = hook[event];
    if (fn) {
      callHook(event, fn, hook, arg1, arg2, arg3, arg4, arg5);
    }
  }
}

var isProfiling = false;
var flushHistory = [];
var lifeCycleTimerStack = [];
var currentFlushNesting = 0;
var currentFlushMeasurements = [];
var currentFlushStartTime = 0;
var currentTimerDebugID = null;
var currentTimerStartTime = 0;
var currentTimerNestedFlushDuration = 0;
var currentTimerType = null;

var lifeCycleTimerHasWarned = false;

function clearHistory() {
  ReactComponentTreeHook.purgeUnmountedComponents();
  ReactHostOperationHistoryHook.clearHistory();
}

function getTreeSnapshot(registeredIDs) {
  return registeredIDs.reduce(function (tree, id) {
    var ownerID = ReactComponentTreeHook.getOwnerID(id);
    var parentID = ReactComponentTreeHook.getParentID(id);
    tree[id] = {
      displayName: ReactComponentTreeHook.getDisplayName(id),
      text: ReactComponentTreeHook.getText(id),
      updateCount: ReactComponentTreeHook.getUpdateCount(id),
      childIDs: ReactComponentTreeHook.getChildIDs(id),
      // Text nodes don't have owners but this is close enough.
      ownerID: ownerID || parentID && ReactComponentTreeHook.getOwnerID(parentID) || 0,
      parentID: parentID
    };
    return tree;
  }, {});
}

function resetMeasurements() {
  var previousStartTime = currentFlushStartTime;
  var previousMeasurements = currentFlushMeasurements;
  var previousOperations = ReactHostOperationHistoryHook.getHistory();

  if (currentFlushNesting === 0) {
    currentFlushStartTime = 0;
    currentFlushMeasurements = [];
    clearHistory();
    return;
  }

  if (previousMeasurements.length || previousOperations.length) {
    var registeredIDs = ReactComponentTreeHook.getRegisteredIDs();
    flushHistory.push({
      duration: performanceNow() - previousStartTime,
      measurements: previousMeasurements || [],
      operations: previousOperations || [],
      treeSnapshot: getTreeSnapshot(registeredIDs)
    });
  }

  clearHistory();
  currentFlushStartTime = performanceNow();
  currentFlushMeasurements = [];
}

function checkDebugID(debugID) {
  var allowRoot = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  if (allowRoot && debugID === 0) {
    return;
  }
  if (!debugID) {
    process.env.NODE_ENV !== 'production' ? warning(false, 'ReactDebugTool: debugID may not be empty.') : void 0;
  }
}

function beginLifeCycleTimer(debugID, timerType) {
  if (currentFlushNesting === 0) {
    return;
  }
  if (currentTimerType && !lifeCycleTimerHasWarned) {
    process.env.NODE_ENV !== 'production' ? warning(false, 'There is an internal error in the React performance measurement code. ' + 'Did not expect %s timer to start while %s timer is still in ' + 'progress for %s instance.', timerType, currentTimerType || 'no', debugID === currentTimerDebugID ? 'the same' : 'another') : void 0;
    lifeCycleTimerHasWarned = true;
  }
  currentTimerStartTime = performanceNow();
  currentTimerNestedFlushDuration = 0;
  currentTimerDebugID = debugID;
  currentTimerType = timerType;
}

function endLifeCycleTimer(debugID, timerType) {
  if (currentFlushNesting === 0) {
    return;
  }
  if (currentTimerType !== timerType && !lifeCycleTimerHasWarned) {
    process.env.NODE_ENV !== 'production' ? warning(false, 'There is an internal error in the React performance measurement code. ' + 'We did not expect %s timer to stop while %s timer is still in ' + 'progress for %s instance. Please report this as a bug in React.', timerType, currentTimerType || 'no', debugID === currentTimerDebugID ? 'the same' : 'another') : void 0;
    lifeCycleTimerHasWarned = true;
  }
  if (isProfiling) {
    currentFlushMeasurements.push({
      timerType: timerType,
      instanceID: debugID,
      duration: performanceNow() - currentTimerStartTime - currentTimerNestedFlushDuration
    });
  }
  currentTimerStartTime = 0;
  currentTimerNestedFlushDuration = 0;
  currentTimerDebugID = null;
  currentTimerType = null;
}

function pauseCurrentLifeCycleTimer() {
  var currentTimer = {
    startTime: currentTimerStartTime,
    nestedFlushStartTime: performanceNow(),
    debugID: currentTimerDebugID,
    timerType: currentTimerType
  };
  lifeCycleTimerStack.push(currentTimer);
  currentTimerStartTime = 0;
  currentTimerNestedFlushDuration = 0;
  currentTimerDebugID = null;
  currentTimerType = null;
}

function resumeCurrentLifeCycleTimer() {
  var _lifeCycleTimerStack$ = lifeCycleTimerStack.pop(),
      startTime = _lifeCycleTimerStack$.startTime,
      nestedFlushStartTime = _lifeCycleTimerStack$.nestedFlushStartTime,
      debugID = _lifeCycleTimerStack$.debugID,
      timerType = _lifeCycleTimerStack$.timerType;

  var nestedFlushDuration = performanceNow() - nestedFlushStartTime;
  currentTimerStartTime = startTime;
  currentTimerNestedFlushDuration += nestedFlushDuration;
  currentTimerDebugID = debugID;
  currentTimerType = timerType;
}

var lastMarkTimeStamp = 0;
var canUsePerformanceMeasure =
// $FlowFixMe https://github.com/facebook/flow/issues/2345
typeof performance !== 'undefined' && typeof performance.mark === 'function' && typeof performance.clearMarks === 'function' && typeof performance.measure === 'function' && typeof performance.clearMeasures === 'function';

function shouldMark(debugID) {
  if (!isProfiling || !canUsePerformanceMeasure) {
    return false;
  }
  var element = ReactComponentTreeHook.getElement(debugID);
  if (element == null || typeof element !== 'object') {
    return false;
  }
  var isHostElement = typeof element.type === 'string';
  if (isHostElement) {
    return false;
  }
  return true;
}

function markBegin(debugID, markType) {
  if (!shouldMark(debugID)) {
    return;
  }

  var markName = debugID + '::' + markType;
  lastMarkTimeStamp = performanceNow();
  performance.mark(markName);
}

function markEnd(debugID, markType) {
  if (!shouldMark(debugID)) {
    return;
  }

  var markName = debugID + '::' + markType;
  var displayName = ReactComponentTreeHook.getDisplayName(debugID) || 'Unknown';

  // Chrome has an issue of dropping markers recorded too fast:
  // https://bugs.chromium.org/p/chromium/issues/detail?id=640652
  // To work around this, we will not report very small measurements.
  // I determined the magic number by tweaking it back and forth.
  // 0.05ms was enough to prevent the issue, but I set it to 0.1ms to be safe.
  // When the bug is fixed, we can `measure()` unconditionally if we want to.
  var timeStamp = performanceNow();
  if (timeStamp - lastMarkTimeStamp > 0.1) {
    var measurementName = displayName + ' [' + markType + ']';
    performance.measure(measurementName, markName);
  }

  performance.clearMarks(markName);
  performance.clearMeasures(measurementName);
}

var ReactDebugTool = {
  addHook: function (hook) {
    hooks.push(hook);
  },
  removeHook: function (hook) {
    for (var i = 0; i < hooks.length; i++) {
      if (hooks[i] === hook) {
        hooks.splice(i, 1);
        i--;
      }
    }
  },
  isProfiling: function () {
    return isProfiling;
  },
  beginProfiling: function () {
    if (isProfiling) {
      return;
    }

    isProfiling = true;
    flushHistory.length = 0;
    resetMeasurements();
    ReactDebugTool.addHook(ReactHostOperationHistoryHook);
  },
  endProfiling: function () {
    if (!isProfiling) {
      return;
    }

    isProfiling = false;
    resetMeasurements();
    ReactDebugTool.removeHook(ReactHostOperationHistoryHook);
  },
  getFlushHistory: function () {
    return flushHistory;
  },
  onBeginFlush: function () {
    currentFlushNesting++;
    resetMeasurements();
    pauseCurrentLifeCycleTimer();
    emitEvent('onBeginFlush');
  },
  onEndFlush: function () {
    resetMeasurements();
    currentFlushNesting--;
    resumeCurrentLifeCycleTimer();
    emitEvent('onEndFlush');
  },
  onBeginLifeCycleTimer: function (debugID, timerType) {
    checkDebugID(debugID);
    emitEvent('onBeginLifeCycleTimer', debugID, timerType);
    markBegin(debugID, timerType);
    beginLifeCycleTimer(debugID, timerType);
  },
  onEndLifeCycleTimer: function (debugID, timerType) {
    checkDebugID(debugID);
    endLifeCycleTimer(debugID, timerType);
    markEnd(debugID, timerType);
    emitEvent('onEndLifeCycleTimer', debugID, timerType);
  },
  onBeginProcessingChildContext: function () {
    emitEvent('onBeginProcessingChildContext');
  },
  onEndProcessingChildContext: function () {
    emitEvent('onEndProcessingChildContext');
  },
  onHostOperation: function (operation) {
    checkDebugID(operation.instanceID);
    emitEvent('onHostOperation', operation);
  },
  onSetState: function () {
    emitEvent('onSetState');
  },
  onSetChildren: function (debugID, childDebugIDs) {
    checkDebugID(debugID);
    childDebugIDs.forEach(checkDebugID);
    emitEvent('onSetChildren', debugID, childDebugIDs);
  },
  onBeforeMountComponent: function (debugID, element, parentDebugID) {
    checkDebugID(debugID);
    checkDebugID(parentDebugID, true);
    emitEvent('onBeforeMountComponent', debugID, element, parentDebugID);
    markBegin(debugID, 'mount');
  },
  onMountComponent: function (debugID) {
    checkDebugID(debugID);
    markEnd(debugID, 'mount');
    emitEvent('onMountComponent', debugID);
  },
  onBeforeUpdateComponent: function (debugID, element) {
    checkDebugID(debugID);
    emitEvent('onBeforeUpdateComponent', debugID, element);
    markBegin(debugID, 'update');
  },
  onUpdateComponent: function (debugID) {
    checkDebugID(debugID);
    markEnd(debugID, 'update');
    emitEvent('onUpdateComponent', debugID);
  },
  onBeforeUnmountComponent: function (debugID) {
    checkDebugID(debugID);
    emitEvent('onBeforeUnmountComponent', debugID);
    markBegin(debugID, 'unmount');
  },
  onUnmountComponent: function (debugID) {
    checkDebugID(debugID);
    markEnd(debugID, 'unmount');
    emitEvent('onUnmountComponent', debugID);
  },
  onTestEvent: function () {
    emitEvent('onTestEvent');
  }
};

// TODO remove these when RN/www gets updated
ReactDebugTool.addDevtool = ReactDebugTool.addHook;
ReactDebugTool.removeDevtool = ReactDebugTool.removeHook;

ReactDebugTool.addHook(ReactInvalidSetStateWarningHook);
ReactDebugTool.addHook(ReactComponentTreeHook);
var url = ExecutionEnvironment.canUseDOM && window.location.href || '';
if (/[?&]react_perf\b/.test(url)) {
  ReactDebugTool.beginProfiling();
}

module.exports = ReactDebugTool;
}).call(this,require('_process'))
},{"./ReactHostOperationHistoryHook":117,"./ReactInvalidSetStateWarningHook":122,"_process":58,"fbjs/lib/ExecutionEnvironment":3,"fbjs/lib/performanceNow":22,"fbjs/lib/warning":24,"react/lib/ReactComponentTreeHook":192}],108:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var _assign = require('object-assign');

var ReactUpdates = require('./ReactUpdates');
var Transaction = require('./Transaction');

var emptyFunction = require('fbjs/lib/emptyFunction');

var RESET_BATCHED_UPDATES = {
  initialize: emptyFunction,
  close: function () {
    ReactDefaultBatchingStrategy.isBatchingUpdates = false;
  }
};

var FLUSH_BATCHED_UPDATES = {
  initialize: emptyFunction,
  close: ReactUpdates.flushBatchedUpdates.bind(ReactUpdates)
};

var TRANSACTION_WRAPPERS = [FLUSH_BATCHED_UPDATES, RESET_BATCHED_UPDATES];

function ReactDefaultBatchingStrategyTransaction() {
  this.reinitializeTransaction();
}

_assign(ReactDefaultBatchingStrategyTransaction.prototype, Transaction, {
  getTransactionWrappers: function () {
    return TRANSACTION_WRAPPERS;
  }
});

var transaction = new ReactDefaultBatchingStrategyTransaction();

var ReactDefaultBatchingStrategy = {
  isBatchingUpdates: false,

  /**
   * Call the provided function in a context within which calls to `setState`
   * and friends are batched such that components aren't updated unnecessarily.
   */
  batchedUpdates: function (callback, a, b, c, d, e) {
    var alreadyBatchingUpdates = ReactDefaultBatchingStrategy.isBatchingUpdates;

    ReactDefaultBatchingStrategy.isBatchingUpdates = true;

    // The code is written this way to avoid extra allocations
    if (alreadyBatchingUpdates) {
      return callback(a, b, c, d, e);
    } else {
      return transaction.perform(callback, null, a, b, c, d, e);
    }
  }
};

module.exports = ReactDefaultBatchingStrategy;
},{"./ReactUpdates":136,"./Transaction":154,"fbjs/lib/emptyFunction":9,"object-assign":57}],109:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var ARIADOMPropertyConfig = require('./ARIADOMPropertyConfig');
var BeforeInputEventPlugin = require('./BeforeInputEventPlugin');
var ChangeEventPlugin = require('./ChangeEventPlugin');
var DefaultEventPluginOrder = require('./DefaultEventPluginOrder');
var EnterLeaveEventPlugin = require('./EnterLeaveEventPlugin');
var HTMLDOMPropertyConfig = require('./HTMLDOMPropertyConfig');
var ReactComponentBrowserEnvironment = require('./ReactComponentBrowserEnvironment');
var ReactDOMComponent = require('./ReactDOMComponent');
var ReactDOMComponentTree = require('./ReactDOMComponentTree');
var ReactDOMEmptyComponent = require('./ReactDOMEmptyComponent');
var ReactDOMTreeTraversal = require('./ReactDOMTreeTraversal');
var ReactDOMTextComponent = require('./ReactDOMTextComponent');
var ReactDefaultBatchingStrategy = require('./ReactDefaultBatchingStrategy');
var ReactEventListener = require('./ReactEventListener');
var ReactInjection = require('./ReactInjection');
var ReactReconcileTransaction = require('./ReactReconcileTransaction');
var SVGDOMPropertyConfig = require('./SVGDOMPropertyConfig');
var SelectEventPlugin = require('./SelectEventPlugin');
var SimpleEventPlugin = require('./SimpleEventPlugin');

var alreadyInjected = false;

function inject() {
  if (alreadyInjected) {
    // TODO: This is currently true because these injections are shared between
    // the client and the server package. They should be built independently
    // and not share any injection state. Then this problem will be solved.
    return;
  }
  alreadyInjected = true;

  ReactInjection.EventEmitter.injectReactEventListener(ReactEventListener);

  /**
   * Inject modules for resolving DOM hierarchy and plugin ordering.
   */
  ReactInjection.EventPluginHub.injectEventPluginOrder(DefaultEventPluginOrder);
  ReactInjection.EventPluginUtils.injectComponentTree(ReactDOMComponentTree);
  ReactInjection.EventPluginUtils.injectTreeTraversal(ReactDOMTreeTraversal);

  /**
   * Some important event plugins included by default (without having to require
   * them).
   */
  ReactInjection.EventPluginHub.injectEventPluginsByName({
    SimpleEventPlugin: SimpleEventPlugin,
    EnterLeaveEventPlugin: EnterLeaveEventPlugin,
    ChangeEventPlugin: ChangeEventPlugin,
    SelectEventPlugin: SelectEventPlugin,
    BeforeInputEventPlugin: BeforeInputEventPlugin
  });

  ReactInjection.HostComponent.injectGenericComponentClass(ReactDOMComponent);

  ReactInjection.HostComponent.injectTextComponentClass(ReactDOMTextComponent);

  ReactInjection.DOMProperty.injectDOMPropertyConfig(ARIADOMPropertyConfig);
  ReactInjection.DOMProperty.injectDOMPropertyConfig(HTMLDOMPropertyConfig);
  ReactInjection.DOMProperty.injectDOMPropertyConfig(SVGDOMPropertyConfig);

  ReactInjection.EmptyComponent.injectEmptyComponentFactory(function (instantiate) {
    return new ReactDOMEmptyComponent(instantiate);
  });

  ReactInjection.Updates.injectReconcileTransaction(ReactReconcileTransaction);
  ReactInjection.Updates.injectBatchingStrategy(ReactDefaultBatchingStrategy);

  ReactInjection.Component.injectEnvironment(ReactComponentBrowserEnvironment);
}

module.exports = {
  inject: inject
};
},{"./ARIADOMPropertyConfig":60,"./BeforeInputEventPlugin":62,"./ChangeEventPlugin":66,"./DefaultEventPluginOrder":73,"./EnterLeaveEventPlugin":74,"./HTMLDOMPropertyConfig":80,"./ReactComponentBrowserEnvironment":86,"./ReactDOMComponent":90,"./ReactDOMComponentTree":92,"./ReactDOMEmptyComponent":94,"./ReactDOMTextComponent":103,"./ReactDOMTreeTraversal":105,"./ReactDefaultBatchingStrategy":108,"./ReactEventListener":114,"./ReactInjection":118,"./ReactReconcileTransaction":130,"./SVGDOMPropertyConfig":138,"./SelectEventPlugin":139,"./SimpleEventPlugin":140}],110:[function(require,module,exports){
/**
 * Copyright 2014-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

'use strict';

// The Symbol used to tag the ReactElement type. If there is no native Symbol
// nor polyfill, then a plain number is used for performance.

var REACT_ELEMENT_TYPE = typeof Symbol === 'function' && Symbol['for'] && Symbol['for']('react.element') || 0xeac7;

module.exports = REACT_ELEMENT_TYPE;
},{}],111:[function(require,module,exports){
/**
 * Copyright 2014-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var emptyComponentFactory;

var ReactEmptyComponentInjection = {
  injectEmptyComponentFactory: function (factory) {
    emptyComponentFactory = factory;
  }
};

var ReactEmptyComponent = {
  create: function (instantiate) {
    return emptyComponentFactory(instantiate);
  }
};

ReactEmptyComponent.injection = ReactEmptyComponentInjection;

module.exports = ReactEmptyComponent;
},{}],112:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

'use strict';

var caughtError = null;

/**
 * Call a function while guarding against errors that happens within it.
 *
 * @param {String} name of the guard to use for logging or debugging
 * @param {Function} func The function to invoke
 * @param {*} a First argument
 * @param {*} b Second argument
 */
function invokeGuardedCallback(name, func, a) {
  try {
    func(a);
  } catch (x) {
    if (caughtError === null) {
      caughtError = x;
    }
  }
}

var ReactErrorUtils = {
  invokeGuardedCallback: invokeGuardedCallback,

  /**
   * Invoked by ReactTestUtils.Simulate so that any errors thrown by the event
   * handler are sure to be rethrown by rethrowCaughtError.
   */
  invokeGuardedCallbackWithCatch: invokeGuardedCallback,

  /**
   * During execution of guarded functions we will capture the first error which
   * we will rethrow to be handled by the top level error handler.
   */
  rethrowCaughtError: function () {
    if (caughtError) {
      var error = caughtError;
      caughtError = null;
      throw error;
    }
  }
};

if (process.env.NODE_ENV !== 'production') {
  /**
   * To help development we can get better devtools integration by simulating a
   * real browser event.
   */
  if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function' && typeof document !== 'undefined' && typeof document.createEvent === 'function') {
    var fakeNode = document.createElement('react');
    ReactErrorUtils.invokeGuardedCallback = function (name, func, a) {
      var boundFunc = func.bind(null, a);
      var evtType = 'react-' + name;
      fakeNode.addEventListener(evtType, boundFunc, false);
      var evt = document.createEvent('Event');
      // $FlowFixMe https://github.com/facebook/flow/issues/2336
      evt.initEvent(evtType, false, false);
      fakeNode.dispatchEvent(evt);
      fakeNode.removeEventListener(evtType, boundFunc, false);
    };
  }
}

module.exports = ReactErrorUtils;
}).call(this,require('_process'))
},{"_process":58}],113:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var EventPluginHub = require('./EventPluginHub');

function runEventQueueInBatch(events) {
  EventPluginHub.enqueueEvents(events);
  EventPluginHub.processEventQueue(false);
}

var ReactEventEmitterMixin = {

  /**
   * Streams a fired top-level event to `EventPluginHub` where plugins have the
   * opportunity to create `ReactEvent`s to be dispatched.
   */
  handleTopLevel: function (topLevelType, targetInst, nativeEvent, nativeEventTarget) {
    var events = EventPluginHub.extractEvents(topLevelType, targetInst, nativeEvent, nativeEventTarget);
    runEventQueueInBatch(events);
  }
};

module.exports = ReactEventEmitterMixin;
},{"./EventPluginHub":75}],114:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var _assign = require('object-assign');

var EventListener = require('fbjs/lib/EventListener');
var ExecutionEnvironment = require('fbjs/lib/ExecutionEnvironment');
var PooledClass = require('./PooledClass');
var ReactDOMComponentTree = require('./ReactDOMComponentTree');
var ReactUpdates = require('./ReactUpdates');

var getEventTarget = require('./getEventTarget');
var getUnboundedScrollPosition = require('fbjs/lib/getUnboundedScrollPosition');

/**
 * Find the deepest React component completely containing the root of the
 * passed-in instance (for use when entire React trees are nested within each
 * other). If React trees are not nested, returns null.
 */
function findParent(inst) {
  // TODO: It may be a good idea to cache this to prevent unnecessary DOM
  // traversal, but caching is difficult to do correctly without using a
  // mutation observer to listen for all DOM changes.
  while (inst._hostParent) {
    inst = inst._hostParent;
  }
  var rootNode = ReactDOMComponentTree.getNodeFromInstance(inst);
  var container = rootNode.parentNode;
  return ReactDOMComponentTree.getClosestInstanceFromNode(container);
}

// Used to store ancestor hierarchy in top level callback
function TopLevelCallbackBookKeeping(topLevelType, nativeEvent) {
  this.topLevelType = topLevelType;
  this.nativeEvent = nativeEvent;
  this.ancestors = [];
}
_assign(TopLevelCallbackBookKeeping.prototype, {
  destructor: function () {
    this.topLevelType = null;
    this.nativeEvent = null;
    this.ancestors.length = 0;
  }
});
PooledClass.addPoolingTo(TopLevelCallbackBookKeeping, PooledClass.twoArgumentPooler);

function handleTopLevelImpl(bookKeeping) {
  var nativeEventTarget = getEventTarget(bookKeeping.nativeEvent);
  var targetInst = ReactDOMComponentTree.getClosestInstanceFromNode(nativeEventTarget);

  // Loop through the hierarchy, in case there's any nested components.
  // It's important that we build the array of ancestors before calling any
  // event handlers, because event handlers can modify the DOM, leading to
  // inconsistencies with ReactMount's node cache. See #1105.
  var ancestor = targetInst;
  do {
    bookKeeping.ancestors.push(ancestor);
    ancestor = ancestor && findParent(ancestor);
  } while (ancestor);

  for (var i = 0; i < bookKeeping.ancestors.length; i++) {
    targetInst = bookKeeping.ancestors[i];
    ReactEventListener._handleTopLevel(bookKeeping.topLevelType, targetInst, bookKeeping.nativeEvent, getEventTarget(bookKeeping.nativeEvent));
  }
}

function scrollValueMonitor(cb) {
  var scrollPosition = getUnboundedScrollPosition(window);
  cb(scrollPosition);
}

var ReactEventListener = {
  _enabled: true,
  _handleTopLevel: null,

  WINDOW_HANDLE: ExecutionEnvironment.canUseDOM ? window : null,

  setHandleTopLevel: function (handleTopLevel) {
    ReactEventListener._handleTopLevel = handleTopLevel;
  },

  setEnabled: function (enabled) {
    ReactEventListener._enabled = !!enabled;
  },

  isEnabled: function () {
    return ReactEventListener._enabled;
  },

  /**
   * Traps top-level events by using event bubbling.
   *
   * @param {string} topLevelType Record from `EventConstants`.
   * @param {string} handlerBaseName Event name (e.g. "click").
   * @param {object} element Element on which to attach listener.
   * @return {?object} An object with a remove function which will forcefully
   *                  remove the listener.
   * @internal
   */
  trapBubbledEvent: function (topLevelType, handlerBaseName, element) {
    if (!element) {
      return null;
    }
    return EventListener.listen(element, handlerBaseName, ReactEventListener.dispatchEvent.bind(null, topLevelType));
  },

  /**
   * Traps a top-level event by using event capturing.
   *
   * @param {string} topLevelType Record from `EventConstants`.
   * @param {string} handlerBaseName Event name (e.g. "click").
   * @param {object} element Element on which to attach listener.
   * @return {?object} An object with a remove function which will forcefully
   *                  remove the listener.
   * @internal
   */
  trapCapturedEvent: function (topLevelType, handlerBaseName, element) {
    if (!element) {
      return null;
    }
    return EventListener.capture(element, handlerBaseName, ReactEventListener.dispatchEvent.bind(null, topLevelType));
  },

  monitorScrollValue: function (refresh) {
    var callback = scrollValueMonitor.bind(null, refresh);
    EventListener.listen(window, 'scroll', callback);
  },

  dispatchEvent: function (topLevelType, nativeEvent) {
    if (!ReactEventListener._enabled) {
      return;
    }

    var bookKeeping = TopLevelCallbackBookKeeping.getPooled(topLevelType, nativeEvent);
    try {
      // Event queue being processed in the same cycle allows
      // `preventDefault`.
      ReactUpdates.batchedUpdates(handleTopLevelImpl, bookKeeping);
    } finally {
      TopLevelCallbackBookKeeping.release(bookKeeping);
    }
  }
};

module.exports = ReactEventListener;
},{"./PooledClass":83,"./ReactDOMComponentTree":92,"./ReactUpdates":136,"./getEventTarget":168,"fbjs/lib/EventListener":2,"fbjs/lib/ExecutionEnvironment":3,"fbjs/lib/getUnboundedScrollPosition":14,"object-assign":57}],115:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

'use strict';

var ReactFeatureFlags = {
  // When true, call console.time() before and .timeEnd() after each top-level
  // render (both initial renders and updates). Useful when looking at prod-mode
  // timeline profiles in Chrome, for example.
  logTopLevelRenders: false
};

module.exports = ReactFeatureFlags;
},{}],116:[function(require,module,exports){
(function (process){
/**
 * Copyright 2014-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var _prodInvariant = require('./reactProdInvariant');

var invariant = require('fbjs/lib/invariant');

var genericComponentClass = null;
var textComponentClass = null;

var ReactHostComponentInjection = {
  // This accepts a class that receives the tag string. This is a catch all
  // that can render any kind of tag.
  injectGenericComponentClass: function (componentClass) {
    genericComponentClass = componentClass;
  },
  // This accepts a text component class that takes the text string to be
  // rendered as props.
  injectTextComponentClass: function (componentClass) {
    textComponentClass = componentClass;
  }
};

/**
 * Get a host internal component class for a specific tag.
 *
 * @param {ReactElement} element The element to create.
 * @return {function} The internal class constructor function.
 */
function createInternalComponent(element) {
  !genericComponentClass ? process.env.NODE_ENV !== 'production' ? invariant(false, 'There is no registered component for the tag %s', element.type) : _prodInvariant('111', element.type) : void 0;
  return new genericComponentClass(element);
}

/**
 * @param {ReactText} text
 * @return {ReactComponent}
 */
function createInstanceForText(text) {
  return new textComponentClass(text);
}

/**
 * @param {ReactComponent} component
 * @return {boolean}
 */
function isTextComponent(component) {
  return component instanceof textComponentClass;
}

var ReactHostComponent = {
  createInternalComponent: createInternalComponent,
  createInstanceForText: createInstanceForText,
  isTextComponent: isTextComponent,
  injection: ReactHostComponentInjection
};

module.exports = ReactHostComponent;
}).call(this,require('_process'))
},{"./reactProdInvariant":179,"_process":58,"fbjs/lib/invariant":17}],117:[function(require,module,exports){
/**
 * Copyright 2016-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

'use strict';

var history = [];

var ReactHostOperationHistoryHook = {
  onHostOperation: function (operation) {
    history.push(operation);
  },
  clearHistory: function () {
    if (ReactHostOperationHistoryHook._preventClearing) {
      // Should only be used for tests.
      return;
    }

    history = [];
  },
  getHistory: function () {
    return history;
  }
};

module.exports = ReactHostOperationHistoryHook;
},{}],118:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var DOMProperty = require('./DOMProperty');
var EventPluginHub = require('./EventPluginHub');
var EventPluginUtils = require('./EventPluginUtils');
var ReactComponentEnvironment = require('./ReactComponentEnvironment');
var ReactEmptyComponent = require('./ReactEmptyComponent');
var ReactBrowserEventEmitter = require('./ReactBrowserEventEmitter');
var ReactHostComponent = require('./ReactHostComponent');
var ReactUpdates = require('./ReactUpdates');

var ReactInjection = {
  Component: ReactComponentEnvironment.injection,
  DOMProperty: DOMProperty.injection,
  EmptyComponent: ReactEmptyComponent.injection,
  EventPluginHub: EventPluginHub.injection,
  EventPluginUtils: EventPluginUtils.injection,
  EventEmitter: ReactBrowserEventEmitter.injection,
  HostComponent: ReactHostComponent.injection,
  Updates: ReactUpdates.injection
};

module.exports = ReactInjection;
},{"./DOMProperty":70,"./EventPluginHub":75,"./EventPluginUtils":77,"./ReactBrowserEventEmitter":84,"./ReactComponentEnvironment":87,"./ReactEmptyComponent":111,"./ReactHostComponent":116,"./ReactUpdates":136}],119:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var ReactDOMSelection = require('./ReactDOMSelection');

var containsNode = require('fbjs/lib/containsNode');
var focusNode = require('fbjs/lib/focusNode');
var getActiveElement = require('fbjs/lib/getActiveElement');

function isInDocument(node) {
  return containsNode(document.documentElement, node);
}

/**
 * @ReactInputSelection: React input selection module. Based on Selection.js,
 * but modified to be suitable for react and has a couple of bug fixes (doesn't
 * assume buttons have range selections allowed).
 * Input selection module for React.
 */
var ReactInputSelection = {

  hasSelectionCapabilities: function (elem) {
    var nodeName = elem && elem.nodeName && elem.nodeName.toLowerCase();
    return nodeName && (nodeName === 'input' && elem.type === 'text' || nodeName === 'textarea' || elem.contentEditable === 'true');
  },

  getSelectionInformation: function () {
    var focusedElem = getActiveElement();
    return {
      focusedElem: focusedElem,
      selectionRange: ReactInputSelection.hasSelectionCapabilities(focusedElem) ? ReactInputSelection.getSelection(focusedElem) : null
    };
  },

  /**
   * @restoreSelection: If any selection information was potentially lost,
   * restore it. This is useful when performing operations that could remove dom
   * nodes and place them back in, resulting in focus being lost.
   */
  restoreSelection: function (priorSelectionInformation) {
    var curFocusedElem = getActiveElement();
    var priorFocusedElem = priorSelectionInformation.focusedElem;
    var priorSelectionRange = priorSelectionInformation.selectionRange;
    if (curFocusedElem !== priorFocusedElem && isInDocument(priorFocusedElem)) {
      if (ReactInputSelection.hasSelectionCapabilities(priorFocusedElem)) {
        ReactInputSelection.setSelection(priorFocusedElem, priorSelectionRange);
      }
      focusNode(priorFocusedElem);
    }
  },

  /**
   * @getSelection: Gets the selection bounds of a focused textarea, input or
   * contentEditable node.
   * -@input: Look up selection bounds of this input
   * -@return {start: selectionStart, end: selectionEnd}
   */
  getSelection: function (input) {
    var selection;

    if ('selectionStart' in input) {
      // Modern browser with input or textarea.
      selection = {
        start: input.selectionStart,
        end: input.selectionEnd
      };
    } else if (document.selection && input.nodeName && input.nodeName.toLowerCase() === 'input') {
      // IE8 input.
      var range = document.selection.createRange();
      // There can only be one selection per document in IE, so it must
      // be in our element.
      if (range.parentElement() === input) {
        selection = {
          start: -range.moveStart('character', -input.value.length),
          end: -range.moveEnd('character', -input.value.length)
        };
      }
    } else {
      // Content editable or old IE textarea.
      selection = ReactDOMSelection.getOffsets(input);
    }

    return selection || { start: 0, end: 0 };
  },

  /**
   * @setSelection: Sets the selection bounds of a textarea or input and focuses
   * the input.
   * -@input     Set selection bounds of this input or textarea
   * -@offsets   Object of same form that is returned from get*
   */
  setSelection: function (input, offsets) {
    var start = offsets.start;
    var end = offsets.end;
    if (end === undefined) {
      end = start;
    }

    if ('selectionStart' in input) {
      input.selectionStart = start;
      input.selectionEnd = Math.min(end, input.value.length);
    } else if (document.selection && input.nodeName && input.nodeName.toLowerCase() === 'input') {
      var range = input.createTextRange();
      range.collapse(true);
      range.moveStart('character', start);
      range.moveEnd('character', end - start);
      range.select();
    } else {
      ReactDOMSelection.setOffsets(input, offsets);
    }
  }
};

module.exports = ReactInputSelection;
},{"./ReactDOMSelection":102,"fbjs/lib/containsNode":6,"fbjs/lib/focusNode":11,"fbjs/lib/getActiveElement":12}],120:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

/**
 * `ReactInstanceMap` maintains a mapping from a public facing stateful
 * instance (key) and the internal representation (value). This allows public
 * methods to accept the user facing instance as an argument and map them back
 * to internal methods.
 */

// TODO: Replace this with ES6: var ReactInstanceMap = new Map();

var ReactInstanceMap = {

  /**
   * This API should be called `delete` but we'd have to make sure to always
   * transform these to strings for IE support. When this transform is fully
   * supported we can rename it.
   */
  remove: function (key) {
    key._reactInternalInstance = undefined;
  },

  get: function (key) {
    return key._reactInternalInstance;
  },

  has: function (key) {
    return key._reactInternalInstance !== undefined;
  },

  set: function (key, value) {
    key._reactInternalInstance = value;
  }

};

module.exports = ReactInstanceMap;
},{}],121:[function(require,module,exports){
(function (process){
/**
 * Copyright 2016-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

'use strict';

// Trust the developer to only use ReactInstrumentation with a __DEV__ check

var debugTool = null;

if (process.env.NODE_ENV !== 'production') {
  var ReactDebugTool = require('./ReactDebugTool');
  debugTool = ReactDebugTool;
}

module.exports = { debugTool: debugTool };
}).call(this,require('_process'))
},{"./ReactDebugTool":107,"_process":58}],122:[function(require,module,exports){
(function (process){
/**
 * Copyright 2016-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

'use strict';

var warning = require('fbjs/lib/warning');

if (process.env.NODE_ENV !== 'production') {
  var processingChildContext = false;

  var warnInvalidSetState = function () {
    process.env.NODE_ENV !== 'production' ? warning(!processingChildContext, 'setState(...): Cannot call setState() inside getChildContext()') : void 0;
  };
}

var ReactInvalidSetStateWarningHook = {
  onBeginProcessingChildContext: function () {
    processingChildContext = true;
  },
  onEndProcessingChildContext: function () {
    processingChildContext = false;
  },
  onSetState: function () {
    warnInvalidSetState();
  }
};

module.exports = ReactInvalidSetStateWarningHook;
}).call(this,require('_process'))
},{"_process":58,"fbjs/lib/warning":24}],123:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var adler32 = require('./adler32');

var TAG_END = /\/?>/;
var COMMENT_START = /^<\!\-\-/;

var ReactMarkupChecksum = {
  CHECKSUM_ATTR_NAME: 'data-react-checksum',

  /**
   * @param {string} markup Markup string
   * @return {string} Markup string with checksum attribute attached
   */
  addChecksumToMarkup: function (markup) {
    var checksum = adler32(markup);

    // Add checksum (handle both parent tags, comments and self-closing tags)
    if (COMMENT_START.test(markup)) {
      return markup;
    } else {
      return markup.replace(TAG_END, ' ' + ReactMarkupChecksum.CHECKSUM_ATTR_NAME + '="' + checksum + '"$&');
    }
  },

  /**
   * @param {string} markup to use
   * @param {DOMElement} element root React element
   * @returns {boolean} whether or not the markup is the same
   */
  canReuseMarkup: function (markup, element) {
    var existingChecksum = element.getAttribute(ReactMarkupChecksum.CHECKSUM_ATTR_NAME);
    existingChecksum = existingChecksum && parseInt(existingChecksum, 10);
    var markupChecksum = adler32(markup);
    return markupChecksum === existingChecksum;
  }
};

module.exports = ReactMarkupChecksum;
},{"./adler32":157}],124:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var _prodInvariant = require('./reactProdInvariant');

var DOMLazyTree = require('./DOMLazyTree');
var DOMProperty = require('./DOMProperty');
var React = require('react/lib/React');
var ReactBrowserEventEmitter = require('./ReactBrowserEventEmitter');
var ReactCurrentOwner = require('react/lib/ReactCurrentOwner');
var ReactDOMComponentTree = require('./ReactDOMComponentTree');
var ReactDOMContainerInfo = require('./ReactDOMContainerInfo');
var ReactDOMFeatureFlags = require('./ReactDOMFeatureFlags');
var ReactFeatureFlags = require('./ReactFeatureFlags');
var ReactInstanceMap = require('./ReactInstanceMap');
var ReactInstrumentation = require('./ReactInstrumentation');
var ReactMarkupChecksum = require('./ReactMarkupChecksum');
var ReactReconciler = require('./ReactReconciler');
var ReactUpdateQueue = require('./ReactUpdateQueue');
var ReactUpdates = require('./ReactUpdates');

var emptyObject = require('fbjs/lib/emptyObject');
var instantiateReactComponent = require('./instantiateReactComponent');
var invariant = require('fbjs/lib/invariant');
var setInnerHTML = require('./setInnerHTML');
var shouldUpdateReactComponent = require('./shouldUpdateReactComponent');
var warning = require('fbjs/lib/warning');

var ATTR_NAME = DOMProperty.ID_ATTRIBUTE_NAME;
var ROOT_ATTR_NAME = DOMProperty.ROOT_ATTRIBUTE_NAME;

var ELEMENT_NODE_TYPE = 1;
var DOC_NODE_TYPE = 9;
var DOCUMENT_FRAGMENT_NODE_TYPE = 11;

var instancesByReactRootID = {};

/**
 * Finds the index of the first character
 * that's not common between the two given strings.
 *
 * @return {number} the index of the character where the strings diverge
 */
function firstDifferenceIndex(string1, string2) {
  var minLen = Math.min(string1.length, string2.length);
  for (var i = 0; i < minLen; i++) {
    if (string1.charAt(i) !== string2.charAt(i)) {
      return i;
    }
  }
  return string1.length === string2.length ? -1 : minLen;
}

/**
 * @param {DOMElement|DOMDocument} container DOM element that may contain
 * a React component
 * @return {?*} DOM element that may have the reactRoot ID, or null.
 */
function getReactRootElementInContainer(container) {
  if (!container) {
    return null;
  }

  if (container.nodeType === DOC_NODE_TYPE) {
    return container.documentElement;
  } else {
    return container.firstChild;
  }
}

function internalGetID(node) {
  // If node is something like a window, document, or text node, none of
  // which support attributes or a .getAttribute method, gracefully return
  // the empty string, as if the attribute were missing.
  return node.getAttribute && node.getAttribute(ATTR_NAME) || '';
}

/**
 * Mounts this component and inserts it into the DOM.
 *
 * @param {ReactComponent} componentInstance The instance to mount.
 * @param {DOMElement} container DOM element to mount into.
 * @param {ReactReconcileTransaction} transaction
 * @param {boolean} shouldReuseMarkup If true, do not insert markup
 */
function mountComponentIntoNode(wrapperInstance, container, transaction, shouldReuseMarkup, context) {
  var markerName;
  if (ReactFeatureFlags.logTopLevelRenders) {
    var wrappedElement = wrapperInstance._currentElement.props.child;
    var type = wrappedElement.type;
    markerName = 'React mount: ' + (typeof type === 'string' ? type : type.displayName || type.name);
    console.time(markerName);
  }

  var markup = ReactReconciler.mountComponent(wrapperInstance, transaction, null, ReactDOMContainerInfo(wrapperInstance, container), context, 0 /* parentDebugID */
  );

  if (markerName) {
    console.timeEnd(markerName);
  }

  wrapperInstance._renderedComponent._topLevelWrapper = wrapperInstance;
  ReactMount._mountImageIntoNode(markup, container, wrapperInstance, shouldReuseMarkup, transaction);
}

/**
 * Batched mount.
 *
 * @param {ReactComponent} componentInstance The instance to mount.
 * @param {DOMElement} container DOM element to mount into.
 * @param {boolean} shouldReuseMarkup If true, do not insert markup
 */
function batchedMountComponentIntoNode(componentInstance, container, shouldReuseMarkup, context) {
  var transaction = ReactUpdates.ReactReconcileTransaction.getPooled(
  /* useCreateElement */
  !shouldReuseMarkup && ReactDOMFeatureFlags.useCreateElement);
  transaction.perform(mountComponentIntoNode, null, componentInstance, container, transaction, shouldReuseMarkup, context);
  ReactUpdates.ReactReconcileTransaction.release(transaction);
}

/**
 * Unmounts a component and removes it from the DOM.
 *
 * @param {ReactComponent} instance React component instance.
 * @param {DOMElement} container DOM element to unmount from.
 * @final
 * @internal
 * @see {ReactMount.unmountComponentAtNode}
 */
function unmountComponentFromNode(instance, container, safely) {
  if (process.env.NODE_ENV !== 'production') {
    ReactInstrumentation.debugTool.onBeginFlush();
  }
  ReactReconciler.unmountComponent(instance, safely);
  if (process.env.NODE_ENV !== 'production') {
    ReactInstrumentation.debugTool.onEndFlush();
  }

  if (container.nodeType === DOC_NODE_TYPE) {
    container = container.documentElement;
  }

  // http://jsperf.com/emptying-a-node
  while (container.lastChild) {
    container.removeChild(container.lastChild);
  }
}

/**
 * True if the supplied DOM node has a direct React-rendered child that is
 * not a React root element. Useful for warning in `render`,
 * `unmountComponentAtNode`, etc.
 *
 * @param {?DOMElement} node The candidate DOM node.
 * @return {boolean} True if the DOM element contains a direct child that was
 * rendered by React but is not a root element.
 * @internal
 */
function hasNonRootReactChild(container) {
  var rootEl = getReactRootElementInContainer(container);
  if (rootEl) {
    var inst = ReactDOMComponentTree.getInstanceFromNode(rootEl);
    return !!(inst && inst._hostParent);
  }
}

/**
 * True if the supplied DOM node is a React DOM element and
 * it has been rendered by another copy of React.
 *
 * @param {?DOMElement} node The candidate DOM node.
 * @return {boolean} True if the DOM has been rendered by another copy of React
 * @internal
 */
function nodeIsRenderedByOtherInstance(container) {
  var rootEl = getReactRootElementInContainer(container);
  return !!(rootEl && isReactNode(rootEl) && !ReactDOMComponentTree.getInstanceFromNode(rootEl));
}

/**
 * True if the supplied DOM node is a valid node element.
 *
 * @param {?DOMElement} node The candidate DOM node.
 * @return {boolean} True if the DOM is a valid DOM node.
 * @internal
 */
function isValidContainer(node) {
  return !!(node && (node.nodeType === ELEMENT_NODE_TYPE || node.nodeType === DOC_NODE_TYPE || node.nodeType === DOCUMENT_FRAGMENT_NODE_TYPE));
}

/**
 * True if the supplied DOM node is a valid React node element.
 *
 * @param {?DOMElement} node The candidate DOM node.
 * @return {boolean} True if the DOM is a valid React DOM node.
 * @internal
 */
function isReactNode(node) {
  return isValidContainer(node) && (node.hasAttribute(ROOT_ATTR_NAME) || node.hasAttribute(ATTR_NAME));
}

function getHostRootInstanceInContainer(container) {
  var rootEl = getReactRootElementInContainer(container);
  var prevHostInstance = rootEl && ReactDOMComponentTree.getInstanceFromNode(rootEl);
  return prevHostInstance && !prevHostInstance._hostParent ? prevHostInstance : null;
}

function getTopLevelWrapperInContainer(container) {
  var root = getHostRootInstanceInContainer(container);
  return root ? root._hostContainerInfo._topLevelWrapper : null;
}

/**
 * Temporary (?) hack so that we can store all top-level pending updates on
 * composites instead of having to worry about different types of components
 * here.
 */
var topLevelRootCounter = 1;
var TopLevelWrapper = function () {
  this.rootID = topLevelRootCounter++;
};
TopLevelWrapper.prototype.isReactComponent = {};
if (process.env.NODE_ENV !== 'production') {
  TopLevelWrapper.displayName = 'TopLevelWrapper';
}
TopLevelWrapper.prototype.render = function () {
  return this.props.child;
};
TopLevelWrapper.isReactTopLevelWrapper = true;

/**
 * Mounting is the process of initializing a React component by creating its
 * representative DOM elements and inserting them into a supplied `container`.
 * Any prior content inside `container` is destroyed in the process.
 *
 *   ReactMount.render(
 *     component,
 *     document.getElementById('container')
 *   );
 *
 *   <div id="container">                   <-- Supplied `container`.
 *     <div data-reactid=".3">              <-- Rendered reactRoot of React
 *       // ...                                 component.
 *     </div>
 *   </div>
 *
 * Inside of `container`, the first element rendered is the "reactRoot".
 */
var ReactMount = {

  TopLevelWrapper: TopLevelWrapper,

  /**
   * Used by devtools. The keys are not important.
   */
  _instancesByReactRootID: instancesByReactRootID,

  /**
   * This is a hook provided to support rendering React components while
   * ensuring that the apparent scroll position of its `container` does not
   * change.
   *
   * @param {DOMElement} container The `container` being rendered into.
   * @param {function} renderCallback This must be called once to do the render.
   */
  scrollMonitor: function (container, renderCallback) {
    renderCallback();
  },

  /**
   * Take a component that's already mounted into the DOM and replace its props
   * @param {ReactComponent} prevComponent component instance already in the DOM
   * @param {ReactElement} nextElement component instance to render
   * @param {DOMElement} container container to render into
   * @param {?function} callback function triggered on completion
   */
  _updateRootComponent: function (prevComponent, nextElement, nextContext, container, callback) {
    ReactMount.scrollMonitor(container, function () {
      ReactUpdateQueue.enqueueElementInternal(prevComponent, nextElement, nextContext);
      if (callback) {
        ReactUpdateQueue.enqueueCallbackInternal(prevComponent, callback);
      }
    });

    return prevComponent;
  },

  /**
   * Render a new component into the DOM. Hooked by hooks!
   *
   * @param {ReactElement} nextElement element to render
   * @param {DOMElement} container container to render into
   * @param {boolean} shouldReuseMarkup if we should skip the markup insertion
   * @return {ReactComponent} nextComponent
   */
  _renderNewRootComponent: function (nextElement, container, shouldReuseMarkup, context) {
    // Various parts of our code (such as ReactCompositeComponent's
    // _renderValidatedComponent) assume that calls to render aren't nested;
    // verify that that's the case.
    process.env.NODE_ENV !== 'production' ? warning(ReactCurrentOwner.current == null, '_renderNewRootComponent(): Render methods should be a pure function ' + 'of props and state; triggering nested component updates from ' + 'render is not allowed. If necessary, trigger nested updates in ' + 'componentDidUpdate. Check the render method of %s.', ReactCurrentOwner.current && ReactCurrentOwner.current.getName() || 'ReactCompositeComponent') : void 0;

    !isValidContainer(container) ? process.env.NODE_ENV !== 'production' ? invariant(false, '_registerComponent(...): Target container is not a DOM element.') : _prodInvariant('37') : void 0;

    ReactBrowserEventEmitter.ensureScrollValueMonitoring();
    var componentInstance = instantiateReactComponent(nextElement, false);

    // The initial render is synchronous but any updates that happen during
    // rendering, in componentWillMount or componentDidMount, will be batched
    // according to the current batching strategy.

    ReactUpdates.batchedUpdates(batchedMountComponentIntoNode, componentInstance, container, shouldReuseMarkup, context);

    var wrapperID = componentInstance._instance.rootID;
    instancesByReactRootID[wrapperID] = componentInstance;

    return componentInstance;
  },

  /**
   * Renders a React component into the DOM in the supplied `container`.
   *
   * If the React component was previously rendered into `container`, this will
   * perform an update on it and only mutate the DOM as necessary to reflect the
   * latest React component.
   *
   * @param {ReactComponent} parentComponent The conceptual parent of this render tree.
   * @param {ReactElement} nextElement Component element to render.
   * @param {DOMElement} container DOM element to render into.
   * @param {?function} callback function triggered on completion
   * @return {ReactComponent} Component instance rendered in `container`.
   */
  renderSubtreeIntoContainer: function (parentComponent, nextElement, container, callback) {
    !(parentComponent != null && ReactInstanceMap.has(parentComponent)) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'parentComponent must be a valid React Component') : _prodInvariant('38') : void 0;
    return ReactMount._renderSubtreeIntoContainer(parentComponent, nextElement, container, callback);
  },

  _renderSubtreeIntoContainer: function (parentComponent, nextElement, container, callback) {
    ReactUpdateQueue.validateCallback(callback, 'ReactDOM.render');
    !React.isValidElement(nextElement) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'ReactDOM.render(): Invalid component element.%s', typeof nextElement === 'string' ? ' Instead of passing a string like \'div\', pass ' + 'React.createElement(\'div\') or <div />.' : typeof nextElement === 'function' ? ' Instead of passing a class like Foo, pass ' + 'React.createElement(Foo) or <Foo />.' :
    // Check if it quacks like an element
    nextElement != null && nextElement.props !== undefined ? ' This may be caused by unintentionally loading two independent ' + 'copies of React.' : '') : _prodInvariant('39', typeof nextElement === 'string' ? ' Instead of passing a string like \'div\', pass ' + 'React.createElement(\'div\') or <div />.' : typeof nextElement === 'function' ? ' Instead of passing a class like Foo, pass ' + 'React.createElement(Foo) or <Foo />.' : nextElement != null && nextElement.props !== undefined ? ' This may be caused by unintentionally loading two independent ' + 'copies of React.' : '') : void 0;

    process.env.NODE_ENV !== 'production' ? warning(!container || !container.tagName || container.tagName.toUpperCase() !== 'BODY', 'render(): Rendering components directly into document.body is ' + 'discouraged, since its children are often manipulated by third-party ' + 'scripts and browser extensions. This may lead to subtle ' + 'reconciliation issues. Try rendering into a container element created ' + 'for your app.') : void 0;

    var nextWrappedElement = React.createElement(TopLevelWrapper, { child: nextElement });

    var nextContext;
    if (parentComponent) {
      var parentInst = ReactInstanceMap.get(parentComponent);
      nextContext = parentInst._processChildContext(parentInst._context);
    } else {
      nextContext = emptyObject;
    }

    var prevComponent = getTopLevelWrapperInContainer(container);

    if (prevComponent) {
      var prevWrappedElement = prevComponent._currentElement;
      var prevElement = prevWrappedElement.props.child;
      if (shouldUpdateReactComponent(prevElement, nextElement)) {
        var publicInst = prevComponent._renderedComponent.getPublicInstance();
        var updatedCallback = callback && function () {
          callback.call(publicInst);
        };
        ReactMount._updateRootComponent(prevComponent, nextWrappedElement, nextContext, container, updatedCallback);
        return publicInst;
      } else {
        ReactMount.unmountComponentAtNode(container);
      }
    }

    var reactRootElement = getReactRootElementInContainer(container);
    var containerHasReactMarkup = reactRootElement && !!internalGetID(reactRootElement);
    var containerHasNonRootReactChild = hasNonRootReactChild(container);

    if (process.env.NODE_ENV !== 'production') {
      process.env.NODE_ENV !== 'production' ? warning(!containerHasNonRootReactChild, 'render(...): Replacing React-rendered children with a new root ' + 'component. If you intended to update the children of this node, ' + 'you should instead have the existing children update their state ' + 'and render the new components instead of calling ReactDOM.render.') : void 0;

      if (!containerHasReactMarkup || reactRootElement.nextSibling) {
        var rootElementSibling = reactRootElement;
        while (rootElementSibling) {
          if (internalGetID(rootElementSibling)) {
            process.env.NODE_ENV !== 'production' ? warning(false, 'render(): Target node has markup rendered by React, but there ' + 'are unrelated nodes as well. This is most commonly caused by ' + 'white-space inserted around server-rendered markup.') : void 0;
            break;
          }
          rootElementSibling = rootElementSibling.nextSibling;
        }
      }
    }

    var shouldReuseMarkup = containerHasReactMarkup && !prevComponent && !containerHasNonRootReactChild;
    var component = ReactMount._renderNewRootComponent(nextWrappedElement, container, shouldReuseMarkup, nextContext)._renderedComponent.getPublicInstance();
    if (callback) {
      callback.call(component);
    }
    return component;
  },

  /**
   * Renders a React component into the DOM in the supplied `container`.
   * See https://facebook.github.io/react/docs/top-level-api.html#reactdom.render
   *
   * If the React component was previously rendered into `container`, this will
   * perform an update on it and only mutate the DOM as necessary to reflect the
   * latest React component.
   *
   * @param {ReactElement} nextElement Component element to render.
   * @param {DOMElement} container DOM element to render into.
   * @param {?function} callback function triggered on completion
   * @return {ReactComponent} Component instance rendered in `container`.
   */
  render: function (nextElement, container, callback) {
    return ReactMount._renderSubtreeIntoContainer(null, nextElement, container, callback);
  },

  /**
   * Unmounts and destroys the React component rendered in the `container`.
   * See https://facebook.github.io/react/docs/top-level-api.html#reactdom.unmountcomponentatnode
   *
   * @param {DOMElement} container DOM element containing a React component.
   * @return {boolean} True if a component was found in and unmounted from
   *                   `container`
   */
  unmountComponentAtNode: function (container) {
    // Various parts of our code (such as ReactCompositeComponent's
    // _renderValidatedComponent) assume that calls to render aren't nested;
    // verify that that's the case. (Strictly speaking, unmounting won't cause a
    // render but we still don't expect to be in a render call here.)
    process.env.NODE_ENV !== 'production' ? warning(ReactCurrentOwner.current == null, 'unmountComponentAtNode(): Render methods should be a pure function ' + 'of props and state; triggering nested component updates from render ' + 'is not allowed. If necessary, trigger nested updates in ' + 'componentDidUpdate. Check the render method of %s.', ReactCurrentOwner.current && ReactCurrentOwner.current.getName() || 'ReactCompositeComponent') : void 0;

    !isValidContainer(container) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'unmountComponentAtNode(...): Target container is not a DOM element.') : _prodInvariant('40') : void 0;

    if (process.env.NODE_ENV !== 'production') {
      process.env.NODE_ENV !== 'production' ? warning(!nodeIsRenderedByOtherInstance(container), 'unmountComponentAtNode(): The node you\'re attempting to unmount ' + 'was rendered by another copy of React.') : void 0;
    }

    var prevComponent = getTopLevelWrapperInContainer(container);
    if (!prevComponent) {
      // Check if the node being unmounted was rendered by React, but isn't a
      // root node.
      var containerHasNonRootReactChild = hasNonRootReactChild(container);

      // Check if the container itself is a React root node.
      var isContainerReactRoot = container.nodeType === 1 && container.hasAttribute(ROOT_ATTR_NAME);

      if (process.env.NODE_ENV !== 'production') {
        process.env.NODE_ENV !== 'production' ? warning(!containerHasNonRootReactChild, 'unmountComponentAtNode(): The node you\'re attempting to unmount ' + 'was rendered by React and is not a top-level container. %s', isContainerReactRoot ? 'You may have accidentally passed in a React root node instead ' + 'of its container.' : 'Instead, have the parent component update its state and ' + 'rerender in order to remove this component.') : void 0;
      }

      return false;
    }
    delete instancesByReactRootID[prevComponent._instance.rootID];
    ReactUpdates.batchedUpdates(unmountComponentFromNode, prevComponent, container, false);
    return true;
  },

  _mountImageIntoNode: function (markup, container, instance, shouldReuseMarkup, transaction) {
    !isValidContainer(container) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'mountComponentIntoNode(...): Target container is not valid.') : _prodInvariant('41') : void 0;

    if (shouldReuseMarkup) {
      var rootElement = getReactRootElementInContainer(container);
      if (ReactMarkupChecksum.canReuseMarkup(markup, rootElement)) {
        ReactDOMComponentTree.precacheNode(instance, rootElement);
        return;
      } else {
        var checksum = rootElement.getAttribute(ReactMarkupChecksum.CHECKSUM_ATTR_NAME);
        rootElement.removeAttribute(ReactMarkupChecksum.CHECKSUM_ATTR_NAME);

        var rootMarkup = rootElement.outerHTML;
        rootElement.setAttribute(ReactMarkupChecksum.CHECKSUM_ATTR_NAME, checksum);

        var normalizedMarkup = markup;
        if (process.env.NODE_ENV !== 'production') {
          // because rootMarkup is retrieved from the DOM, various normalizations
          // will have occurred which will not be present in `markup`. Here,
          // insert markup into a <div> or <iframe> depending on the container
          // type to perform the same normalizations before comparing.
          var normalizer;
          if (container.nodeType === ELEMENT_NODE_TYPE) {
            normalizer = document.createElement('div');
            normalizer.innerHTML = markup;
            normalizedMarkup = normalizer.innerHTML;
          } else {
            normalizer = document.createElement('iframe');
            document.body.appendChild(normalizer);
            normalizer.contentDocument.write(markup);
            normalizedMarkup = normalizer.contentDocument.documentElement.outerHTML;
            document.body.removeChild(normalizer);
          }
        }

        var diffIndex = firstDifferenceIndex(normalizedMarkup, rootMarkup);
        var difference = ' (client) ' + normalizedMarkup.substring(diffIndex - 20, diffIndex + 20) + '\n (server) ' + rootMarkup.substring(diffIndex - 20, diffIndex + 20);

        !(container.nodeType !== DOC_NODE_TYPE) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'You\'re trying to render a component to the document using server rendering but the checksum was invalid. This usually means you rendered a different component type or props on the client from the one on the server, or your render() methods are impure. React cannot handle this case due to cross-browser quirks by rendering at the document root. You should look for environment dependent code in your components and ensure the props are the same client and server side:\n%s', difference) : _prodInvariant('42', difference) : void 0;

        if (process.env.NODE_ENV !== 'production') {
          process.env.NODE_ENV !== 'production' ? warning(false, 'React attempted to reuse markup in a container but the ' + 'checksum was invalid. This generally means that you are ' + 'using server rendering and the markup generated on the ' + 'server was not what the client was expecting. React injected ' + 'new markup to compensate which works but you have lost many ' + 'of the benefits of server rendering. Instead, figure out ' + 'why the markup being generated is different on the client ' + 'or server:\n%s', difference) : void 0;
        }
      }
    }

    !(container.nodeType !== DOC_NODE_TYPE) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'You\'re trying to render a component to the document but you didn\'t use server rendering. We can\'t do this without using server rendering due to cross-browser quirks. See ReactDOMServer.renderToString() for server rendering.') : _prodInvariant('43') : void 0;

    if (transaction.useCreateElement) {
      while (container.lastChild) {
        container.removeChild(container.lastChild);
      }
      DOMLazyTree.insertTreeBefore(container, markup, null);
    } else {
      setInnerHTML(container, markup);
      ReactDOMComponentTree.precacheNode(instance, container.firstChild);
    }

    if (process.env.NODE_ENV !== 'production') {
      var hostNode = ReactDOMComponentTree.getInstanceFromNode(container.firstChild);
      if (hostNode._debugID !== 0) {
        ReactInstrumentation.debugTool.onHostOperation({
          instanceID: hostNode._debugID,
          type: 'mount',
          payload: markup.toString()
        });
      }
    }
  }
};

module.exports = ReactMount;
}).call(this,require('_process'))
},{"./DOMLazyTree":68,"./DOMProperty":70,"./ReactBrowserEventEmitter":84,"./ReactDOMComponentTree":92,"./ReactDOMContainerInfo":93,"./ReactDOMFeatureFlags":95,"./ReactFeatureFlags":115,"./ReactInstanceMap":120,"./ReactInstrumentation":121,"./ReactMarkupChecksum":123,"./ReactReconciler":131,"./ReactUpdateQueue":135,"./ReactUpdates":136,"./instantiateReactComponent":175,"./reactProdInvariant":179,"./setInnerHTML":181,"./shouldUpdateReactComponent":183,"_process":58,"fbjs/lib/emptyObject":10,"fbjs/lib/invariant":17,"fbjs/lib/warning":24,"react/lib/React":188,"react/lib/ReactCurrentOwner":193}],125:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var _prodInvariant = require('./reactProdInvariant');

var ReactComponentEnvironment = require('./ReactComponentEnvironment');
var ReactInstanceMap = require('./ReactInstanceMap');
var ReactInstrumentation = require('./ReactInstrumentation');

var ReactCurrentOwner = require('react/lib/ReactCurrentOwner');
var ReactReconciler = require('./ReactReconciler');
var ReactChildReconciler = require('./ReactChildReconciler');

var emptyFunction = require('fbjs/lib/emptyFunction');
var flattenChildren = require('./flattenChildren');
var invariant = require('fbjs/lib/invariant');

/**
 * Make an update for markup to be rendered and inserted at a supplied index.
 *
 * @param {string} markup Markup that renders into an element.
 * @param {number} toIndex Destination index.
 * @private
 */
function makeInsertMarkup(markup, afterNode, toIndex) {
  // NOTE: Null values reduce hidden classes.
  return {
    type: 'INSERT_MARKUP',
    content: markup,
    fromIndex: null,
    fromNode: null,
    toIndex: toIndex,
    afterNode: afterNode
  };
}

/**
 * Make an update for moving an existing element to another index.
 *
 * @param {number} fromIndex Source index of the existing element.
 * @param {number} toIndex Destination index of the element.
 * @private
 */
function makeMove(child, afterNode, toIndex) {
  // NOTE: Null values reduce hidden classes.
  return {
    type: 'MOVE_EXISTING',
    content: null,
    fromIndex: child._mountIndex,
    fromNode: ReactReconciler.getHostNode(child),
    toIndex: toIndex,
    afterNode: afterNode
  };
}

/**
 * Make an update for removing an element at an index.
 *
 * @param {number} fromIndex Index of the element to remove.
 * @private
 */
function makeRemove(child, node) {
  // NOTE: Null values reduce hidden classes.
  return {
    type: 'REMOVE_NODE',
    content: null,
    fromIndex: child._mountIndex,
    fromNode: node,
    toIndex: null,
    afterNode: null
  };
}

/**
 * Make an update for setting the markup of a node.
 *
 * @param {string} markup Markup that renders into an element.
 * @private
 */
function makeSetMarkup(markup) {
  // NOTE: Null values reduce hidden classes.
  return {
    type: 'SET_MARKUP',
    content: markup,
    fromIndex: null,
    fromNode: null,
    toIndex: null,
    afterNode: null
  };
}

/**
 * Make an update for setting the text content.
 *
 * @param {string} textContent Text content to set.
 * @private
 */
function makeTextContent(textContent) {
  // NOTE: Null values reduce hidden classes.
  return {
    type: 'TEXT_CONTENT',
    content: textContent,
    fromIndex: null,
    fromNode: null,
    toIndex: null,
    afterNode: null
  };
}

/**
 * Push an update, if any, onto the queue. Creates a new queue if none is
 * passed and always returns the queue. Mutative.
 */
function enqueue(queue, update) {
  if (update) {
    queue = queue || [];
    queue.push(update);
  }
  return queue;
}

/**
 * Processes any enqueued updates.
 *
 * @private
 */
function processQueue(inst, updateQueue) {
  ReactComponentEnvironment.processChildrenUpdates(inst, updateQueue);
}

var setChildrenForInstrumentation = emptyFunction;
if (process.env.NODE_ENV !== 'production') {
  var getDebugID = function (inst) {
    if (!inst._debugID) {
      // Check for ART-like instances. TODO: This is silly/gross.
      var internal;
      if (internal = ReactInstanceMap.get(inst)) {
        inst = internal;
      }
    }
    return inst._debugID;
  };
  setChildrenForInstrumentation = function (children) {
    var debugID = getDebugID(this);
    // TODO: React Native empty components are also multichild.
    // This means they still get into this method but don't have _debugID.
    if (debugID !== 0) {
      ReactInstrumentation.debugTool.onSetChildren(debugID, children ? Object.keys(children).map(function (key) {
        return children[key]._debugID;
      }) : []);
    }
  };
}

/**
 * ReactMultiChild are capable of reconciling multiple children.
 *
 * @class ReactMultiChild
 * @internal
 */
var ReactMultiChild = {

  /**
   * Provides common functionality for components that must reconcile multiple
   * children. This is used by `ReactDOMComponent` to mount, update, and
   * unmount child components.
   *
   * @lends {ReactMultiChild.prototype}
   */
  Mixin: {

    _reconcilerInstantiateChildren: function (nestedChildren, transaction, context) {
      if (process.env.NODE_ENV !== 'production') {
        var selfDebugID = getDebugID(this);
        if (this._currentElement) {
          try {
            ReactCurrentOwner.current = this._currentElement._owner;
            return ReactChildReconciler.instantiateChildren(nestedChildren, transaction, context, selfDebugID);
          } finally {
            ReactCurrentOwner.current = null;
          }
        }
      }
      return ReactChildReconciler.instantiateChildren(nestedChildren, transaction, context);
    },

    _reconcilerUpdateChildren: function (prevChildren, nextNestedChildrenElements, mountImages, removedNodes, transaction, context) {
      var nextChildren;
      var selfDebugID = 0;
      if (process.env.NODE_ENV !== 'production') {
        selfDebugID = getDebugID(this);
        if (this._currentElement) {
          try {
            ReactCurrentOwner.current = this._currentElement._owner;
            nextChildren = flattenChildren(nextNestedChildrenElements, selfDebugID);
          } finally {
            ReactCurrentOwner.current = null;
          }
          ReactChildReconciler.updateChildren(prevChildren, nextChildren, mountImages, removedNodes, transaction, this, this._hostContainerInfo, context, selfDebugID);
          return nextChildren;
        }
      }
      nextChildren = flattenChildren(nextNestedChildrenElements, selfDebugID);
      ReactChildReconciler.updateChildren(prevChildren, nextChildren, mountImages, removedNodes, transaction, this, this._hostContainerInfo, context, selfDebugID);
      return nextChildren;
    },

    /**
     * Generates a "mount image" for each of the supplied children. In the case
     * of `ReactDOMComponent`, a mount image is a string of markup.
     *
     * @param {?object} nestedChildren Nested child maps.
     * @return {array} An array of mounted representations.
     * @internal
     */
    mountChildren: function (nestedChildren, transaction, context) {
      var children = this._reconcilerInstantiateChildren(nestedChildren, transaction, context);
      this._renderedChildren = children;

      var mountImages = [];
      var index = 0;
      for (var name in children) {
        if (children.hasOwnProperty(name)) {
          var child = children[name];
          var selfDebugID = 0;
          if (process.env.NODE_ENV !== 'production') {
            selfDebugID = getDebugID(this);
          }
          var mountImage = ReactReconciler.mountComponent(child, transaction, this, this._hostContainerInfo, context, selfDebugID);
          child._mountIndex = index++;
          mountImages.push(mountImage);
        }
      }

      if (process.env.NODE_ENV !== 'production') {
        setChildrenForInstrumentation.call(this, children);
      }

      return mountImages;
    },

    /**
     * Replaces any rendered children with a text content string.
     *
     * @param {string} nextContent String of content.
     * @internal
     */
    updateTextContent: function (nextContent) {
      var prevChildren = this._renderedChildren;
      // Remove any rendered children.
      ReactChildReconciler.unmountChildren(prevChildren, false);
      for (var name in prevChildren) {
        if (prevChildren.hasOwnProperty(name)) {
          !false ? process.env.NODE_ENV !== 'production' ? invariant(false, 'updateTextContent called on non-empty component.') : _prodInvariant('118') : void 0;
        }
      }
      // Set new text content.
      var updates = [makeTextContent(nextContent)];
      processQueue(this, updates);
    },

    /**
     * Replaces any rendered children with a markup string.
     *
     * @param {string} nextMarkup String of markup.
     * @internal
     */
    updateMarkup: function (nextMarkup) {
      var prevChildren = this._renderedChildren;
      // Remove any rendered children.
      ReactChildReconciler.unmountChildren(prevChildren, false);
      for (var name in prevChildren) {
        if (prevChildren.hasOwnProperty(name)) {
          !false ? process.env.NODE_ENV !== 'production' ? invariant(false, 'updateTextContent called on non-empty component.') : _prodInvariant('118') : void 0;
        }
      }
      var updates = [makeSetMarkup(nextMarkup)];
      processQueue(this, updates);
    },

    /**
     * Updates the rendered children with new children.
     *
     * @param {?object} nextNestedChildrenElements Nested child element maps.
     * @param {ReactReconcileTransaction} transaction
     * @internal
     */
    updateChildren: function (nextNestedChildrenElements, transaction, context) {
      // Hook used by React ART
      this._updateChildren(nextNestedChildrenElements, transaction, context);
    },

    /**
     * @param {?object} nextNestedChildrenElements Nested child element maps.
     * @param {ReactReconcileTransaction} transaction
     * @final
     * @protected
     */
    _updateChildren: function (nextNestedChildrenElements, transaction, context) {
      var prevChildren = this._renderedChildren;
      var removedNodes = {};
      var mountImages = [];
      var nextChildren = this._reconcilerUpdateChildren(prevChildren, nextNestedChildrenElements, mountImages, removedNodes, transaction, context);
      if (!nextChildren && !prevChildren) {
        return;
      }
      var updates = null;
      var name;
      // `nextIndex` will increment for each child in `nextChildren`, but
      // `lastIndex` will be the last index visited in `prevChildren`.
      var nextIndex = 0;
      var lastIndex = 0;
      // `nextMountIndex` will increment for each newly mounted child.
      var nextMountIndex = 0;
      var lastPlacedNode = null;
      for (name in nextChildren) {
        if (!nextChildren.hasOwnProperty(name)) {
          continue;
        }
        var prevChild = prevChildren && prevChildren[name];
        var nextChild = nextChildren[name];
        if (prevChild === nextChild) {
          updates = enqueue(updates, this.moveChild(prevChild, lastPlacedNode, nextIndex, lastIndex));
          lastIndex = Math.max(prevChild._mountIndex, lastIndex);
          prevChild._mountIndex = nextIndex;
        } else {
          if (prevChild) {
            // Update `lastIndex` before `_mountIndex` gets unset by unmounting.
            lastIndex = Math.max(prevChild._mountIndex, lastIndex);
            // The `removedNodes` loop below will actually remove the child.
          }
          // The child must be instantiated before it's mounted.
          updates = enqueue(updates, this._mountChildAtIndex(nextChild, mountImages[nextMountIndex], lastPlacedNode, nextIndex, transaction, context));
          nextMountIndex++;
        }
        nextIndex++;
        lastPlacedNode = ReactReconciler.getHostNode(nextChild);
      }
      // Remove children that are no longer present.
      for (name in removedNodes) {
        if (removedNodes.hasOwnProperty(name)) {
          updates = enqueue(updates, this._unmountChild(prevChildren[name], removedNodes[name]));
        }
      }
      if (updates) {
        processQueue(this, updates);
      }
      this._renderedChildren = nextChildren;

      if (process.env.NODE_ENV !== 'production') {
        setChildrenForInstrumentation.call(this, nextChildren);
      }
    },

    /**
     * Unmounts all rendered children. This should be used to clean up children
     * when this component is unmounted. It does not actually perform any
     * backend operations.
     *
     * @internal
     */
    unmountChildren: function (safely) {
      var renderedChildren = this._renderedChildren;
      ReactChildReconciler.unmountChildren(renderedChildren, safely);
      this._renderedChildren = null;
    },

    /**
     * Moves a child component to the supplied index.
     *
     * @param {ReactComponent} child Component to move.
     * @param {number} toIndex Destination index of the element.
     * @param {number} lastIndex Last index visited of the siblings of `child`.
     * @protected
     */
    moveChild: function (child, afterNode, toIndex, lastIndex) {
      // If the index of `child` is less than `lastIndex`, then it needs to
      // be moved. Otherwise, we do not need to move it because a child will be
      // inserted or moved before `child`.
      if (child._mountIndex < lastIndex) {
        return makeMove(child, afterNode, toIndex);
      }
    },

    /**
     * Creates a child component.
     *
     * @param {ReactComponent} child Component to create.
     * @param {string} mountImage Markup to insert.
     * @protected
     */
    createChild: function (child, afterNode, mountImage) {
      return makeInsertMarkup(mountImage, afterNode, child._mountIndex);
    },

    /**
     * Removes a child component.
     *
     * @param {ReactComponent} child Child to remove.
     * @protected
     */
    removeChild: function (child, node) {
      return makeRemove(child, node);
    },

    /**
     * Mounts a child with the supplied name.
     *
     * NOTE: This is part of `updateChildren` and is here for readability.
     *
     * @param {ReactComponent} child Component to mount.
     * @param {string} name Name of the child.
     * @param {number} index Index at which to insert the child.
     * @param {ReactReconcileTransaction} transaction
     * @private
     */
    _mountChildAtIndex: function (child, mountImage, afterNode, index, transaction, context) {
      child._mountIndex = index;
      return this.createChild(child, afterNode, mountImage);
    },

    /**
     * Unmounts a rendered child.
     *
     * NOTE: This is part of `updateChildren` and is here for readability.
     *
     * @param {ReactComponent} child Component to unmount.
     * @private
     */
    _unmountChild: function (child, node) {
      var update = this.removeChild(child, node);
      child._mountIndex = null;
      return update;
    }

  }

};

module.exports = ReactMultiChild;
}).call(this,require('_process'))
},{"./ReactChildReconciler":85,"./ReactComponentEnvironment":87,"./ReactInstanceMap":120,"./ReactInstrumentation":121,"./ReactReconciler":131,"./flattenChildren":163,"./reactProdInvariant":179,"_process":58,"fbjs/lib/emptyFunction":9,"fbjs/lib/invariant":17,"react/lib/ReactCurrentOwner":193}],126:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

'use strict';

var _prodInvariant = require('./reactProdInvariant');

var React = require('react/lib/React');

var invariant = require('fbjs/lib/invariant');

var ReactNodeTypes = {
  HOST: 0,
  COMPOSITE: 1,
  EMPTY: 2,

  getType: function (node) {
    if (node === null || node === false) {
      return ReactNodeTypes.EMPTY;
    } else if (React.isValidElement(node)) {
      if (typeof node.type === 'function') {
        return ReactNodeTypes.COMPOSITE;
      } else {
        return ReactNodeTypes.HOST;
      }
    }
    !false ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Unexpected node: %s', node) : _prodInvariant('26', node) : void 0;
  }
};

module.exports = ReactNodeTypes;
}).call(this,require('_process'))
},{"./reactProdInvariant":179,"_process":58,"fbjs/lib/invariant":17,"react/lib/React":188}],127:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

'use strict';

var _prodInvariant = require('./reactProdInvariant');

var invariant = require('fbjs/lib/invariant');

/**
 * @param {?object} object
 * @return {boolean} True if `object` is a valid owner.
 * @final
 */
function isValidOwner(object) {
  return !!(object && typeof object.attachRef === 'function' && typeof object.detachRef === 'function');
}

/**
 * ReactOwners are capable of storing references to owned components.
 *
 * All components are capable of //being// referenced by owner components, but
 * only ReactOwner components are capable of //referencing// owned components.
 * The named reference is known as a "ref".
 *
 * Refs are available when mounted and updated during reconciliation.
 *
 *   var MyComponent = React.createClass({
 *     render: function() {
 *       return (
 *         <div onClick={this.handleClick}>
 *           <CustomComponent ref="custom" />
 *         </div>
 *       );
 *     },
 *     handleClick: function() {
 *       this.refs.custom.handleClick();
 *     },
 *     componentDidMount: function() {
 *       this.refs.custom.initialize();
 *     }
 *   });
 *
 * Refs should rarely be used. When refs are used, they should only be done to
 * control data that is not handled by React's data flow.
 *
 * @class ReactOwner
 */
var ReactOwner = {
  /**
   * Adds a component by ref to an owner component.
   *
   * @param {ReactComponent} component Component to reference.
   * @param {string} ref Name by which to refer to the component.
   * @param {ReactOwner} owner Component on which to record the ref.
   * @final
   * @internal
   */
  addComponentAsRefTo: function (component, ref, owner) {
    !isValidOwner(owner) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'addComponentAsRefTo(...): Only a ReactOwner can have refs. You might be adding a ref to a component that was not created inside a component\'s `render` method, or you have multiple copies of React loaded (details: https://fb.me/react-refs-must-have-owner).') : _prodInvariant('119') : void 0;
    owner.attachRef(ref, component);
  },

  /**
   * Removes a component by ref from an owner component.
   *
   * @param {ReactComponent} component Component to dereference.
   * @param {string} ref Name of the ref to remove.
   * @param {ReactOwner} owner Component on which the ref is recorded.
   * @final
   * @internal
   */
  removeComponentAsRefFrom: function (component, ref, owner) {
    !isValidOwner(owner) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'removeComponentAsRefFrom(...): Only a ReactOwner can have refs. You might be removing a ref to a component that was not created inside a component\'s `render` method, or you have multiple copies of React loaded (details: https://fb.me/react-refs-must-have-owner).') : _prodInvariant('120') : void 0;
    var ownerPublicInstance = owner.getPublicInstance();
    // Check that `component`'s owner is still alive and that `component` is still the current ref
    // because we do not want to detach the ref if another component stole it.
    if (ownerPublicInstance && ownerPublicInstance.refs[ref] === component.getPublicInstance()) {
      owner.detachRef(ref);
    }
  }

};

module.exports = ReactOwner;
}).call(this,require('_process'))
},{"./reactProdInvariant":179,"_process":58,"fbjs/lib/invariant":17}],128:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

'use strict';

var ReactPropTypeLocationNames = {};

if (process.env.NODE_ENV !== 'production') {
  ReactPropTypeLocationNames = {
    prop: 'prop',
    context: 'context',
    childContext: 'child context'
  };
}

module.exports = ReactPropTypeLocationNames;
}).call(this,require('_process'))
},{"_process":58}],129:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

'use strict';

var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

module.exports = ReactPropTypesSecret;
},{}],130:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var _assign = require('object-assign');

var CallbackQueue = require('./CallbackQueue');
var PooledClass = require('./PooledClass');
var ReactBrowserEventEmitter = require('./ReactBrowserEventEmitter');
var ReactInputSelection = require('./ReactInputSelection');
var ReactInstrumentation = require('./ReactInstrumentation');
var Transaction = require('./Transaction');
var ReactUpdateQueue = require('./ReactUpdateQueue');

/**
 * Ensures that, when possible, the selection range (currently selected text
 * input) is not disturbed by performing the transaction.
 */
var SELECTION_RESTORATION = {
  /**
   * @return {Selection} Selection information.
   */
  initialize: ReactInputSelection.getSelectionInformation,
  /**
   * @param {Selection} sel Selection information returned from `initialize`.
   */
  close: ReactInputSelection.restoreSelection
};

/**
 * Suppresses events (blur/focus) that could be inadvertently dispatched due to
 * high level DOM manipulations (like temporarily removing a text input from the
 * DOM).
 */
var EVENT_SUPPRESSION = {
  /**
   * @return {boolean} The enabled status of `ReactBrowserEventEmitter` before
   * the reconciliation.
   */
  initialize: function () {
    var currentlyEnabled = ReactBrowserEventEmitter.isEnabled();
    ReactBrowserEventEmitter.setEnabled(false);
    return currentlyEnabled;
  },

  /**
   * @param {boolean} previouslyEnabled Enabled status of
   *   `ReactBrowserEventEmitter` before the reconciliation occurred. `close`
   *   restores the previous value.
   */
  close: function (previouslyEnabled) {
    ReactBrowserEventEmitter.setEnabled(previouslyEnabled);
  }
};

/**
 * Provides a queue for collecting `componentDidMount` and
 * `componentDidUpdate` callbacks during the transaction.
 */
var ON_DOM_READY_QUEUEING = {
  /**
   * Initializes the internal `onDOMReady` queue.
   */
  initialize: function () {
    this.reactMountReady.reset();
  },

  /**
   * After DOM is flushed, invoke all registered `onDOMReady` callbacks.
   */
  close: function () {
    this.reactMountReady.notifyAll();
  }
};

/**
 * Executed within the scope of the `Transaction` instance. Consider these as
 * being member methods, but with an implied ordering while being isolated from
 * each other.
 */
var TRANSACTION_WRAPPERS = [SELECTION_RESTORATION, EVENT_SUPPRESSION, ON_DOM_READY_QUEUEING];

if (process.env.NODE_ENV !== 'production') {
  TRANSACTION_WRAPPERS.push({
    initialize: ReactInstrumentation.debugTool.onBeginFlush,
    close: ReactInstrumentation.debugTool.onEndFlush
  });
}

/**
 * Currently:
 * - The order that these are listed in the transaction is critical:
 * - Suppresses events.
 * - Restores selection range.
 *
 * Future:
 * - Restore document/overflow scroll positions that were unintentionally
 *   modified via DOM insertions above the top viewport boundary.
 * - Implement/integrate with customized constraint based layout system and keep
 *   track of which dimensions must be remeasured.
 *
 * @class ReactReconcileTransaction
 */
function ReactReconcileTransaction(useCreateElement) {
  this.reinitializeTransaction();
  // Only server-side rendering really needs this option (see
  // `ReactServerRendering`), but server-side uses
  // `ReactServerRenderingTransaction` instead. This option is here so that it's
  // accessible and defaults to false when `ReactDOMComponent` and
  // `ReactDOMTextComponent` checks it in `mountComponent`.`
  this.renderToStaticMarkup = false;
  this.reactMountReady = CallbackQueue.getPooled(null);
  this.useCreateElement = useCreateElement;
}

var Mixin = {
  /**
   * @see Transaction
   * @abstract
   * @final
   * @return {array<object>} List of operation wrap procedures.
   *   TODO: convert to array<TransactionWrapper>
   */
  getTransactionWrappers: function () {
    return TRANSACTION_WRAPPERS;
  },

  /**
   * @return {object} The queue to collect `onDOMReady` callbacks with.
   */
  getReactMountReady: function () {
    return this.reactMountReady;
  },

  /**
   * @return {object} The queue to collect React async events.
   */
  getUpdateQueue: function () {
    return ReactUpdateQueue;
  },

  /**
   * Save current transaction state -- if the return value from this method is
   * passed to `rollback`, the transaction will be reset to that state.
   */
  checkpoint: function () {
    // reactMountReady is the our only stateful wrapper
    return this.reactMountReady.checkpoint();
  },

  rollback: function (checkpoint) {
    this.reactMountReady.rollback(checkpoint);
  },

  /**
   * `PooledClass` looks for this, and will invoke this before allowing this
   * instance to be reused.
   */
  destructor: function () {
    CallbackQueue.release(this.reactMountReady);
    this.reactMountReady = null;
  }
};

_assign(ReactReconcileTransaction.prototype, Transaction, Mixin);

PooledClass.addPoolingTo(ReactReconcileTransaction);

module.exports = ReactReconcileTransaction;
}).call(this,require('_process'))
},{"./CallbackQueue":65,"./PooledClass":83,"./ReactBrowserEventEmitter":84,"./ReactInputSelection":119,"./ReactInstrumentation":121,"./ReactUpdateQueue":135,"./Transaction":154,"_process":58,"object-assign":57}],131:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var ReactRef = require('./ReactRef');
var ReactInstrumentation = require('./ReactInstrumentation');

var warning = require('fbjs/lib/warning');

/**
 * Helper to call ReactRef.attachRefs with this composite component, split out
 * to avoid allocations in the transaction mount-ready queue.
 */
function attachRefs() {
  ReactRef.attachRefs(this, this._currentElement);
}

var ReactReconciler = {

  /**
   * Initializes the component, renders markup, and registers event listeners.
   *
   * @param {ReactComponent} internalInstance
   * @param {ReactReconcileTransaction|ReactServerRenderingTransaction} transaction
   * @param {?object} the containing host component instance
   * @param {?object} info about the host container
   * @return {?string} Rendered markup to be inserted into the DOM.
   * @final
   * @internal
   */
  mountComponent: function (internalInstance, transaction, hostParent, hostContainerInfo, context, parentDebugID // 0 in production and for roots
  ) {
    if (process.env.NODE_ENV !== 'production') {
      if (internalInstance._debugID !== 0) {
        ReactInstrumentation.debugTool.onBeforeMountComponent(internalInstance._debugID, internalInstance._currentElement, parentDebugID);
      }
    }
    var markup = internalInstance.mountComponent(transaction, hostParent, hostContainerInfo, context, parentDebugID);
    if (internalInstance._currentElement && internalInstance._currentElement.ref != null) {
      transaction.getReactMountReady().enqueue(attachRefs, internalInstance);
    }
    if (process.env.NODE_ENV !== 'production') {
      if (internalInstance._debugID !== 0) {
        ReactInstrumentation.debugTool.onMountComponent(internalInstance._debugID);
      }
    }
    return markup;
  },

  /**
   * Returns a value that can be passed to
   * ReactComponentEnvironment.replaceNodeWithMarkup.
   */
  getHostNode: function (internalInstance) {
    return internalInstance.getHostNode();
  },

  /**
   * Releases any resources allocated by `mountComponent`.
   *
   * @final
   * @internal
   */
  unmountComponent: function (internalInstance, safely) {
    if (process.env.NODE_ENV !== 'production') {
      if (internalInstance._debugID !== 0) {
        ReactInstrumentation.debugTool.onBeforeUnmountComponent(internalInstance._debugID);
      }
    }
    ReactRef.detachRefs(internalInstance, internalInstance._currentElement);
    internalInstance.unmountComponent(safely);
    if (process.env.NODE_ENV !== 'production') {
      if (internalInstance._debugID !== 0) {
        ReactInstrumentation.debugTool.onUnmountComponent(internalInstance._debugID);
      }
    }
  },

  /**
   * Update a component using a new element.
   *
   * @param {ReactComponent} internalInstance
   * @param {ReactElement} nextElement
   * @param {ReactReconcileTransaction} transaction
   * @param {object} context
   * @internal
   */
  receiveComponent: function (internalInstance, nextElement, transaction, context) {
    var prevElement = internalInstance._currentElement;

    if (nextElement === prevElement && context === internalInstance._context) {
      // Since elements are immutable after the owner is rendered,
      // we can do a cheap identity compare here to determine if this is a
      // superfluous reconcile. It's possible for state to be mutable but such
      // change should trigger an update of the owner which would recreate
      // the element. We explicitly check for the existence of an owner since
      // it's possible for an element created outside a composite to be
      // deeply mutated and reused.

      // TODO: Bailing out early is just a perf optimization right?
      // TODO: Removing the return statement should affect correctness?
      return;
    }

    if (process.env.NODE_ENV !== 'production') {
      if (internalInstance._debugID !== 0) {
        ReactInstrumentation.debugTool.onBeforeUpdateComponent(internalInstance._debugID, nextElement);
      }
    }

    var refsChanged = ReactRef.shouldUpdateRefs(prevElement, nextElement);

    if (refsChanged) {
      ReactRef.detachRefs(internalInstance, prevElement);
    }

    internalInstance.receiveComponent(nextElement, transaction, context);

    if (refsChanged && internalInstance._currentElement && internalInstance._currentElement.ref != null) {
      transaction.getReactMountReady().enqueue(attachRefs, internalInstance);
    }

    if (process.env.NODE_ENV !== 'production') {
      if (internalInstance._debugID !== 0) {
        ReactInstrumentation.debugTool.onUpdateComponent(internalInstance._debugID);
      }
    }
  },

  /**
   * Flush any dirty changes in a component.
   *
   * @param {ReactComponent} internalInstance
   * @param {ReactReconcileTransaction} transaction
   * @internal
   */
  performUpdateIfNecessary: function (internalInstance, transaction, updateBatchNumber) {
    if (internalInstance._updateBatchNumber !== updateBatchNumber) {
      // The component's enqueued batch number should always be the current
      // batch or the following one.
      process.env.NODE_ENV !== 'production' ? warning(internalInstance._updateBatchNumber == null || internalInstance._updateBatchNumber === updateBatchNumber + 1, 'performUpdateIfNecessary: Unexpected batch number (current %s, ' + 'pending %s)', updateBatchNumber, internalInstance._updateBatchNumber) : void 0;
      return;
    }
    if (process.env.NODE_ENV !== 'production') {
      if (internalInstance._debugID !== 0) {
        ReactInstrumentation.debugTool.onBeforeUpdateComponent(internalInstance._debugID, internalInstance._currentElement);
      }
    }
    internalInstance.performUpdateIfNecessary(transaction);
    if (process.env.NODE_ENV !== 'production') {
      if (internalInstance._debugID !== 0) {
        ReactInstrumentation.debugTool.onUpdateComponent(internalInstance._debugID);
      }
    }
  }

};

module.exports = ReactReconciler;
}).call(this,require('_process'))
},{"./ReactInstrumentation":121,"./ReactRef":132,"_process":58,"fbjs/lib/warning":24}],132:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

'use strict';

var ReactOwner = require('./ReactOwner');

var ReactRef = {};

function attachRef(ref, component, owner) {
  if (typeof ref === 'function') {
    ref(component.getPublicInstance());
  } else {
    // Legacy ref
    ReactOwner.addComponentAsRefTo(component, ref, owner);
  }
}

function detachRef(ref, component, owner) {
  if (typeof ref === 'function') {
    ref(null);
  } else {
    // Legacy ref
    ReactOwner.removeComponentAsRefFrom(component, ref, owner);
  }
}

ReactRef.attachRefs = function (instance, element) {
  if (element === null || typeof element !== 'object') {
    return;
  }
  var ref = element.ref;
  if (ref != null) {
    attachRef(ref, instance, element._owner);
  }
};

ReactRef.shouldUpdateRefs = function (prevElement, nextElement) {
  // If either the owner or a `ref` has changed, make sure the newest owner
  // has stored a reference to `this`, and the previous owner (if different)
  // has forgotten the reference to `this`. We use the element instead
  // of the public this.props because the post processing cannot determine
  // a ref. The ref conceptually lives on the element.

  // TODO: Should this even be possible? The owner cannot change because
  // it's forbidden by shouldUpdateReactComponent. The ref can change
  // if you swap the keys of but not the refs. Reconsider where this check
  // is made. It probably belongs where the key checking and
  // instantiateReactComponent is done.

  var prevRef = null;
  var prevOwner = null;
  if (prevElement !== null && typeof prevElement === 'object') {
    prevRef = prevElement.ref;
    prevOwner = prevElement._owner;
  }

  var nextRef = null;
  var nextOwner = null;
  if (nextElement !== null && typeof nextElement === 'object') {
    nextRef = nextElement.ref;
    nextOwner = nextElement._owner;
  }

  return prevRef !== nextRef ||
  // If owner changes but we have an unchanged function ref, don't update refs
  typeof nextRef === 'string' && nextOwner !== prevOwner;
};

ReactRef.detachRefs = function (instance, element) {
  if (element === null || typeof element !== 'object') {
    return;
  }
  var ref = element.ref;
  if (ref != null) {
    detachRef(ref, instance, element._owner);
  }
};

module.exports = ReactRef;
},{"./ReactOwner":127}],133:[function(require,module,exports){
(function (process){
/**
 * Copyright 2014-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var _assign = require('object-assign');

var PooledClass = require('./PooledClass');
var Transaction = require('./Transaction');
var ReactInstrumentation = require('./ReactInstrumentation');
var ReactServerUpdateQueue = require('./ReactServerUpdateQueue');

/**
 * Executed within the scope of the `Transaction` instance. Consider these as
 * being member methods, but with an implied ordering while being isolated from
 * each other.
 */
var TRANSACTION_WRAPPERS = [];

if (process.env.NODE_ENV !== 'production') {
  TRANSACTION_WRAPPERS.push({
    initialize: ReactInstrumentation.debugTool.onBeginFlush,
    close: ReactInstrumentation.debugTool.onEndFlush
  });
}

var noopCallbackQueue = {
  enqueue: function () {}
};

/**
 * @class ReactServerRenderingTransaction
 * @param {boolean} renderToStaticMarkup
 */
function ReactServerRenderingTransaction(renderToStaticMarkup) {
  this.reinitializeTransaction();
  this.renderToStaticMarkup = renderToStaticMarkup;
  this.useCreateElement = false;
  this.updateQueue = new ReactServerUpdateQueue(this);
}

var Mixin = {
  /**
   * @see Transaction
   * @abstract
   * @final
   * @return {array} Empty list of operation wrap procedures.
   */
  getTransactionWrappers: function () {
    return TRANSACTION_WRAPPERS;
  },

  /**
   * @return {object} The queue to collect `onDOMReady` callbacks with.
   */
  getReactMountReady: function () {
    return noopCallbackQueue;
  },

  /**
   * @return {object} The queue to collect React async events.
   */
  getUpdateQueue: function () {
    return this.updateQueue;
  },

  /**
   * `PooledClass` looks for this, and will invoke this before allowing this
   * instance to be reused.
   */
  destructor: function () {},

  checkpoint: function () {},

  rollback: function () {}
};

_assign(ReactServerRenderingTransaction.prototype, Transaction, Mixin);

PooledClass.addPoolingTo(ReactServerRenderingTransaction);

module.exports = ReactServerRenderingTransaction;
}).call(this,require('_process'))
},{"./PooledClass":83,"./ReactInstrumentation":121,"./ReactServerUpdateQueue":134,"./Transaction":154,"_process":58,"object-assign":57}],134:[function(require,module,exports){
(function (process){
/**
 * Copyright 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ReactUpdateQueue = require('./ReactUpdateQueue');

var warning = require('fbjs/lib/warning');

function warnNoop(publicInstance, callerName) {
  if (process.env.NODE_ENV !== 'production') {
    var constructor = publicInstance.constructor;
    process.env.NODE_ENV !== 'production' ? warning(false, '%s(...): Can only update a mounting component. ' + 'This usually means you called %s() outside componentWillMount() on the server. ' + 'This is a no-op. Please check the code for the %s component.', callerName, callerName, constructor && (constructor.displayName || constructor.name) || 'ReactClass') : void 0;
  }
}

/**
 * This is the update queue used for server rendering.
 * It delegates to ReactUpdateQueue while server rendering is in progress and
 * switches to ReactNoopUpdateQueue after the transaction has completed.
 * @class ReactServerUpdateQueue
 * @param {Transaction} transaction
 */

var ReactServerUpdateQueue = function () {
  function ReactServerUpdateQueue(transaction) {
    _classCallCheck(this, ReactServerUpdateQueue);

    this.transaction = transaction;
  }

  /**
   * Checks whether or not this composite component is mounted.
   * @param {ReactClass} publicInstance The instance we want to test.
   * @return {boolean} True if mounted, false otherwise.
   * @protected
   * @final
   */


  ReactServerUpdateQueue.prototype.isMounted = function isMounted(publicInstance) {
    return false;
  };

  /**
   * Enqueue a callback that will be executed after all the pending updates
   * have processed.
   *
   * @param {ReactClass} publicInstance The instance to use as `this` context.
   * @param {?function} callback Called after state is updated.
   * @internal
   */


  ReactServerUpdateQueue.prototype.enqueueCallback = function enqueueCallback(publicInstance, callback, callerName) {
    if (this.transaction.isInTransaction()) {
      ReactUpdateQueue.enqueueCallback(publicInstance, callback, callerName);
    }
  };

  /**
   * Forces an update. This should only be invoked when it is known with
   * certainty that we are **not** in a DOM transaction.
   *
   * You may want to call this when you know that some deeper aspect of the
   * component's state has changed but `setState` was not called.
   *
   * This will not invoke `shouldComponentUpdate`, but it will invoke
   * `componentWillUpdate` and `componentDidUpdate`.
   *
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @internal
   */


  ReactServerUpdateQueue.prototype.enqueueForceUpdate = function enqueueForceUpdate(publicInstance) {
    if (this.transaction.isInTransaction()) {
      ReactUpdateQueue.enqueueForceUpdate(publicInstance);
    } else {
      warnNoop(publicInstance, 'forceUpdate');
    }
  };

  /**
   * Replaces all of the state. Always use this or `setState` to mutate state.
   * You should treat `this.state` as immutable.
   *
   * There is no guarantee that `this.state` will be immediately updated, so
   * accessing `this.state` after calling this method may return the old value.
   *
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @param {object|function} completeState Next state.
   * @internal
   */


  ReactServerUpdateQueue.prototype.enqueueReplaceState = function enqueueReplaceState(publicInstance, completeState) {
    if (this.transaction.isInTransaction()) {
      ReactUpdateQueue.enqueueReplaceState(publicInstance, completeState);
    } else {
      warnNoop(publicInstance, 'replaceState');
    }
  };

  /**
   * Sets a subset of the state. This only exists because _pendingState is
   * internal. This provides a merging strategy that is not available to deep
   * properties which is confusing. TODO: Expose pendingState or don't use it
   * during the merge.
   *
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @param {object|function} partialState Next partial state to be merged with state.
   * @internal
   */


  ReactServerUpdateQueue.prototype.enqueueSetState = function enqueueSetState(publicInstance, partialState) {
    if (this.transaction.isInTransaction()) {
      ReactUpdateQueue.enqueueSetState(publicInstance, partialState);
    } else {
      warnNoop(publicInstance, 'setState');
    }
  };

  return ReactServerUpdateQueue;
}();

module.exports = ReactServerUpdateQueue;
}).call(this,require('_process'))
},{"./ReactUpdateQueue":135,"_process":58,"fbjs/lib/warning":24}],135:[function(require,module,exports){
(function (process){
/**
 * Copyright 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var _prodInvariant = require('./reactProdInvariant');

var ReactCurrentOwner = require('react/lib/ReactCurrentOwner');
var ReactInstanceMap = require('./ReactInstanceMap');
var ReactInstrumentation = require('./ReactInstrumentation');
var ReactUpdates = require('./ReactUpdates');

var invariant = require('fbjs/lib/invariant');
var warning = require('fbjs/lib/warning');

function enqueueUpdate(internalInstance) {
  ReactUpdates.enqueueUpdate(internalInstance);
}

function formatUnexpectedArgument(arg) {
  var type = typeof arg;
  if (type !== 'object') {
    return type;
  }
  var displayName = arg.constructor && arg.constructor.name || type;
  var keys = Object.keys(arg);
  if (keys.length > 0 && keys.length < 20) {
    return displayName + ' (keys: ' + keys.join(', ') + ')';
  }
  return displayName;
}

function getInternalInstanceReadyForUpdate(publicInstance, callerName) {
  var internalInstance = ReactInstanceMap.get(publicInstance);
  if (!internalInstance) {
    if (process.env.NODE_ENV !== 'production') {
      var ctor = publicInstance.constructor;
      // Only warn when we have a callerName. Otherwise we should be silent.
      // We're probably calling from enqueueCallback. We don't want to warn
      // there because we already warned for the corresponding lifecycle method.
      process.env.NODE_ENV !== 'production' ? warning(!callerName, '%s(...): Can only update a mounted or mounting component. ' + 'This usually means you called %s() on an unmounted component. ' + 'This is a no-op. Please check the code for the %s component.', callerName, callerName, ctor && (ctor.displayName || ctor.name) || 'ReactClass') : void 0;
    }
    return null;
  }

  if (process.env.NODE_ENV !== 'production') {
    process.env.NODE_ENV !== 'production' ? warning(ReactCurrentOwner.current == null, '%s(...): Cannot update during an existing state transition (such as ' + 'within `render` or another component\'s constructor). Render methods ' + 'should be a pure function of props and state; constructor ' + 'side-effects are an anti-pattern, but can be moved to ' + '`componentWillMount`.', callerName) : void 0;
  }

  return internalInstance;
}

/**
 * ReactUpdateQueue allows for state updates to be scheduled into a later
 * reconciliation step.
 */
var ReactUpdateQueue = {

  /**
   * Checks whether or not this composite component is mounted.
   * @param {ReactClass} publicInstance The instance we want to test.
   * @return {boolean} True if mounted, false otherwise.
   * @protected
   * @final
   */
  isMounted: function (publicInstance) {
    if (process.env.NODE_ENV !== 'production') {
      var owner = ReactCurrentOwner.current;
      if (owner !== null) {
        process.env.NODE_ENV !== 'production' ? warning(owner._warnedAboutRefsInRender, '%s is accessing isMounted inside its render() function. ' + 'render() should be a pure function of props and state. It should ' + 'never access something that requires stale data from the previous ' + 'render, such as refs. Move this logic to componentDidMount and ' + 'componentDidUpdate instead.', owner.getName() || 'A component') : void 0;
        owner._warnedAboutRefsInRender = true;
      }
    }
    var internalInstance = ReactInstanceMap.get(publicInstance);
    if (internalInstance) {
      // During componentWillMount and render this will still be null but after
      // that will always render to something. At least for now. So we can use
      // this hack.
      return !!internalInstance._renderedComponent;
    } else {
      return false;
    }
  },

  /**
   * Enqueue a callback that will be executed after all the pending updates
   * have processed.
   *
   * @param {ReactClass} publicInstance The instance to use as `this` context.
   * @param {?function} callback Called after state is updated.
   * @param {string} callerName Name of the calling function in the public API.
   * @internal
   */
  enqueueCallback: function (publicInstance, callback, callerName) {
    ReactUpdateQueue.validateCallback(callback, callerName);
    var internalInstance = getInternalInstanceReadyForUpdate(publicInstance);

    // Previously we would throw an error if we didn't have an internal
    // instance. Since we want to make it a no-op instead, we mirror the same
    // behavior we have in other enqueue* methods.
    // We also need to ignore callbacks in componentWillMount. See
    // enqueueUpdates.
    if (!internalInstance) {
      return null;
    }

    if (internalInstance._pendingCallbacks) {
      internalInstance._pendingCallbacks.push(callback);
    } else {
      internalInstance._pendingCallbacks = [callback];
    }
    // TODO: The callback here is ignored when setState is called from
    // componentWillMount. Either fix it or disallow doing so completely in
    // favor of getInitialState. Alternatively, we can disallow
    // componentWillMount during server-side rendering.
    enqueueUpdate(internalInstance);
  },

  enqueueCallbackInternal: function (internalInstance, callback) {
    if (internalInstance._pendingCallbacks) {
      internalInstance._pendingCallbacks.push(callback);
    } else {
      internalInstance._pendingCallbacks = [callback];
    }
    enqueueUpdate(internalInstance);
  },

  /**
   * Forces an update. This should only be invoked when it is known with
   * certainty that we are **not** in a DOM transaction.
   *
   * You may want to call this when you know that some deeper aspect of the
   * component's state has changed but `setState` was not called.
   *
   * This will not invoke `shouldComponentUpdate`, but it will invoke
   * `componentWillUpdate` and `componentDidUpdate`.
   *
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @internal
   */
  enqueueForceUpdate: function (publicInstance) {
    var internalInstance = getInternalInstanceReadyForUpdate(publicInstance, 'forceUpdate');

    if (!internalInstance) {
      return;
    }

    internalInstance._pendingForceUpdate = true;

    enqueueUpdate(internalInstance);
  },

  /**
   * Replaces all of the state. Always use this or `setState` to mutate state.
   * You should treat `this.state` as immutable.
   *
   * There is no guarantee that `this.state` will be immediately updated, so
   * accessing `this.state` after calling this method may return the old value.
   *
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @param {object} completeState Next state.
   * @internal
   */
  enqueueReplaceState: function (publicInstance, completeState) {
    var internalInstance = getInternalInstanceReadyForUpdate(publicInstance, 'replaceState');

    if (!internalInstance) {
      return;
    }

    internalInstance._pendingStateQueue = [completeState];
    internalInstance._pendingReplaceState = true;

    enqueueUpdate(internalInstance);
  },

  /**
   * Sets a subset of the state. This only exists because _pendingState is
   * internal. This provides a merging strategy that is not available to deep
   * properties which is confusing. TODO: Expose pendingState or don't use it
   * during the merge.
   *
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @param {object} partialState Next partial state to be merged with state.
   * @internal
   */
  enqueueSetState: function (publicInstance, partialState) {
    if (process.env.NODE_ENV !== 'production') {
      ReactInstrumentation.debugTool.onSetState();
      process.env.NODE_ENV !== 'production' ? warning(partialState != null, 'setState(...): You passed an undefined or null state object; ' + 'instead, use forceUpdate().') : void 0;
    }

    var internalInstance = getInternalInstanceReadyForUpdate(publicInstance, 'setState');

    if (!internalInstance) {
      return;
    }

    var queue = internalInstance._pendingStateQueue || (internalInstance._pendingStateQueue = []);
    queue.push(partialState);

    enqueueUpdate(internalInstance);
  },

  enqueueElementInternal: function (internalInstance, nextElement, nextContext) {
    internalInstance._pendingElement = nextElement;
    // TODO: introduce _pendingContext instead of setting it directly.
    internalInstance._context = nextContext;
    enqueueUpdate(internalInstance);
  },

  validateCallback: function (callback, callerName) {
    !(!callback || typeof callback === 'function') ? process.env.NODE_ENV !== 'production' ? invariant(false, '%s(...): Expected the last optional `callback` argument to be a function. Instead received: %s.', callerName, formatUnexpectedArgument(callback)) : _prodInvariant('122', callerName, formatUnexpectedArgument(callback)) : void 0;
  }

};

module.exports = ReactUpdateQueue;
}).call(this,require('_process'))
},{"./ReactInstanceMap":120,"./ReactInstrumentation":121,"./ReactUpdates":136,"./reactProdInvariant":179,"_process":58,"fbjs/lib/invariant":17,"fbjs/lib/warning":24,"react/lib/ReactCurrentOwner":193}],136:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var _prodInvariant = require('./reactProdInvariant'),
    _assign = require('object-assign');

var CallbackQueue = require('./CallbackQueue');
var PooledClass = require('./PooledClass');
var ReactFeatureFlags = require('./ReactFeatureFlags');
var ReactReconciler = require('./ReactReconciler');
var Transaction = require('./Transaction');

var invariant = require('fbjs/lib/invariant');

var dirtyComponents = [];
var updateBatchNumber = 0;
var asapCallbackQueue = CallbackQueue.getPooled();
var asapEnqueued = false;

var batchingStrategy = null;

function ensureInjected() {
  !(ReactUpdates.ReactReconcileTransaction && batchingStrategy) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'ReactUpdates: must inject a reconcile transaction class and batching strategy') : _prodInvariant('123') : void 0;
}

var NESTED_UPDATES = {
  initialize: function () {
    this.dirtyComponentsLength = dirtyComponents.length;
  },
  close: function () {
    if (this.dirtyComponentsLength !== dirtyComponents.length) {
      // Additional updates were enqueued by componentDidUpdate handlers or
      // similar; before our own UPDATE_QUEUEING wrapper closes, we want to run
      // these new updates so that if A's componentDidUpdate calls setState on
      // B, B will update before the callback A's updater provided when calling
      // setState.
      dirtyComponents.splice(0, this.dirtyComponentsLength);
      flushBatchedUpdates();
    } else {
      dirtyComponents.length = 0;
    }
  }
};

var UPDATE_QUEUEING = {
  initialize: function () {
    this.callbackQueue.reset();
  },
  close: function () {
    this.callbackQueue.notifyAll();
  }
};

var TRANSACTION_WRAPPERS = [NESTED_UPDATES, UPDATE_QUEUEING];

function ReactUpdatesFlushTransaction() {
  this.reinitializeTransaction();
  this.dirtyComponentsLength = null;
  this.callbackQueue = CallbackQueue.getPooled();
  this.reconcileTransaction = ReactUpdates.ReactReconcileTransaction.getPooled(
  /* useCreateElement */true);
}

_assign(ReactUpdatesFlushTransaction.prototype, Transaction, {
  getTransactionWrappers: function () {
    return TRANSACTION_WRAPPERS;
  },

  destructor: function () {
    this.dirtyComponentsLength = null;
    CallbackQueue.release(this.callbackQueue);
    this.callbackQueue = null;
    ReactUpdates.ReactReconcileTransaction.release(this.reconcileTransaction);
    this.reconcileTransaction = null;
  },

  perform: function (method, scope, a) {
    // Essentially calls `this.reconcileTransaction.perform(method, scope, a)`
    // with this transaction's wrappers around it.
    return Transaction.perform.call(this, this.reconcileTransaction.perform, this.reconcileTransaction, method, scope, a);
  }
});

PooledClass.addPoolingTo(ReactUpdatesFlushTransaction);

function batchedUpdates(callback, a, b, c, d, e) {
  ensureInjected();
  return batchingStrategy.batchedUpdates(callback, a, b, c, d, e);
}

/**
 * Array comparator for ReactComponents by mount ordering.
 *
 * @param {ReactComponent} c1 first component you're comparing
 * @param {ReactComponent} c2 second component you're comparing
 * @return {number} Return value usable by Array.prototype.sort().
 */
function mountOrderComparator(c1, c2) {
  return c1._mountOrder - c2._mountOrder;
}

function runBatchedUpdates(transaction) {
  var len = transaction.dirtyComponentsLength;
  !(len === dirtyComponents.length) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Expected flush transaction\'s stored dirty-components length (%s) to match dirty-components array length (%s).', len, dirtyComponents.length) : _prodInvariant('124', len, dirtyComponents.length) : void 0;

  // Since reconciling a component higher in the owner hierarchy usually (not
  // always -- see shouldComponentUpdate()) will reconcile children, reconcile
  // them before their children by sorting the array.
  dirtyComponents.sort(mountOrderComparator);

  // Any updates enqueued while reconciling must be performed after this entire
  // batch. Otherwise, if dirtyComponents is [A, B] where A has children B and
  // C, B could update twice in a single batch if C's render enqueues an update
  // to B (since B would have already updated, we should skip it, and the only
  // way we can know to do so is by checking the batch counter).
  updateBatchNumber++;

  for (var i = 0; i < len; i++) {
    // If a component is unmounted before pending changes apply, it will still
    // be here, but we assume that it has cleared its _pendingCallbacks and
    // that performUpdateIfNecessary is a noop.
    var component = dirtyComponents[i];

    // If performUpdateIfNecessary happens to enqueue any new updates, we
    // shouldn't execute the callbacks until the next render happens, so
    // stash the callbacks first
    var callbacks = component._pendingCallbacks;
    component._pendingCallbacks = null;

    var markerName;
    if (ReactFeatureFlags.logTopLevelRenders) {
      var namedComponent = component;
      // Duck type TopLevelWrapper. This is probably always true.
      if (component._currentElement.type.isReactTopLevelWrapper) {
        namedComponent = component._renderedComponent;
      }
      markerName = 'React update: ' + namedComponent.getName();
      console.time(markerName);
    }

    ReactReconciler.performUpdateIfNecessary(component, transaction.reconcileTransaction, updateBatchNumber);

    if (markerName) {
      console.timeEnd(markerName);
    }

    if (callbacks) {
      for (var j = 0; j < callbacks.length; j++) {
        transaction.callbackQueue.enqueue(callbacks[j], component.getPublicInstance());
      }
    }
  }
}

var flushBatchedUpdates = function () {
  // ReactUpdatesFlushTransaction's wrappers will clear the dirtyComponents
  // array and perform any updates enqueued by mount-ready handlers (i.e.,
  // componentDidUpdate) but we need to check here too in order to catch
  // updates enqueued by setState callbacks and asap calls.
  while (dirtyComponents.length || asapEnqueued) {
    if (dirtyComponents.length) {
      var transaction = ReactUpdatesFlushTransaction.getPooled();
      transaction.perform(runBatchedUpdates, null, transaction);
      ReactUpdatesFlushTransaction.release(transaction);
    }

    if (asapEnqueued) {
      asapEnqueued = false;
      var queue = asapCallbackQueue;
      asapCallbackQueue = CallbackQueue.getPooled();
      queue.notifyAll();
      CallbackQueue.release(queue);
    }
  }
};

/**
 * Mark a component as needing a rerender, adding an optional callback to a
 * list of functions which will be executed once the rerender occurs.
 */
function enqueueUpdate(component) {
  ensureInjected();

  // Various parts of our code (such as ReactCompositeComponent's
  // _renderValidatedComponent) assume that calls to render aren't nested;
  // verify that that's the case. (This is called by each top-level update
  // function, like setState, forceUpdate, etc.; creation and
  // destruction of top-level components is guarded in ReactMount.)

  if (!batchingStrategy.isBatchingUpdates) {
    batchingStrategy.batchedUpdates(enqueueUpdate, component);
    return;
  }

  dirtyComponents.push(component);
  if (component._updateBatchNumber == null) {
    component._updateBatchNumber = updateBatchNumber + 1;
  }
}

/**
 * Enqueue a callback to be run at the end of the current batching cycle. Throws
 * if no updates are currently being performed.
 */
function asap(callback, context) {
  !batchingStrategy.isBatchingUpdates ? process.env.NODE_ENV !== 'production' ? invariant(false, 'ReactUpdates.asap: Can\'t enqueue an asap callback in a context whereupdates are not being batched.') : _prodInvariant('125') : void 0;
  asapCallbackQueue.enqueue(callback, context);
  asapEnqueued = true;
}

var ReactUpdatesInjection = {
  injectReconcileTransaction: function (ReconcileTransaction) {
    !ReconcileTransaction ? process.env.NODE_ENV !== 'production' ? invariant(false, 'ReactUpdates: must provide a reconcile transaction class') : _prodInvariant('126') : void 0;
    ReactUpdates.ReactReconcileTransaction = ReconcileTransaction;
  },

  injectBatchingStrategy: function (_batchingStrategy) {
    !_batchingStrategy ? process.env.NODE_ENV !== 'production' ? invariant(false, 'ReactUpdates: must provide a batching strategy') : _prodInvariant('127') : void 0;
    !(typeof _batchingStrategy.batchedUpdates === 'function') ? process.env.NODE_ENV !== 'production' ? invariant(false, 'ReactUpdates: must provide a batchedUpdates() function') : _prodInvariant('128') : void 0;
    !(typeof _batchingStrategy.isBatchingUpdates === 'boolean') ? process.env.NODE_ENV !== 'production' ? invariant(false, 'ReactUpdates: must provide an isBatchingUpdates boolean attribute') : _prodInvariant('129') : void 0;
    batchingStrategy = _batchingStrategy;
  }
};

var ReactUpdates = {
  /**
   * React references `ReactReconcileTransaction` using this property in order
   * to allow dependency injection.
   *
   * @internal
   */
  ReactReconcileTransaction: null,

  batchedUpdates: batchedUpdates,
  enqueueUpdate: enqueueUpdate,
  flushBatchedUpdates: flushBatchedUpdates,
  injection: ReactUpdatesInjection,
  asap: asap
};

module.exports = ReactUpdates;
}).call(this,require('_process'))
},{"./CallbackQueue":65,"./PooledClass":83,"./ReactFeatureFlags":115,"./ReactReconciler":131,"./Transaction":154,"./reactProdInvariant":179,"_process":58,"fbjs/lib/invariant":17,"object-assign":57}],137:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

module.exports = '15.4.2';
},{}],138:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var NS = {
  xlink: 'http://www.w3.org/1999/xlink',
  xml: 'http://www.w3.org/XML/1998/namespace'
};

// We use attributes for everything SVG so let's avoid some duplication and run
// code instead.
// The following are all specified in the HTML config already so we exclude here.
// - class (as className)
// - color
// - height
// - id
// - lang
// - max
// - media
// - method
// - min
// - name
// - style
// - target
// - type
// - width
var ATTRS = {
  accentHeight: 'accent-height',
  accumulate: 0,
  additive: 0,
  alignmentBaseline: 'alignment-baseline',
  allowReorder: 'allowReorder',
  alphabetic: 0,
  amplitude: 0,
  arabicForm: 'arabic-form',
  ascent: 0,
  attributeName: 'attributeName',
  attributeType: 'attributeType',
  autoReverse: 'autoReverse',
  azimuth: 0,
  baseFrequency: 'baseFrequency',
  baseProfile: 'baseProfile',
  baselineShift: 'baseline-shift',
  bbox: 0,
  begin: 0,
  bias: 0,
  by: 0,
  calcMode: 'calcMode',
  capHeight: 'cap-height',
  clip: 0,
  clipPath: 'clip-path',
  clipRule: 'clip-rule',
  clipPathUnits: 'clipPathUnits',
  colorInterpolation: 'color-interpolation',
  colorInterpolationFilters: 'color-interpolation-filters',
  colorProfile: 'color-profile',
  colorRendering: 'color-rendering',
  contentScriptType: 'contentScriptType',
  contentStyleType: 'contentStyleType',
  cursor: 0,
  cx: 0,
  cy: 0,
  d: 0,
  decelerate: 0,
  descent: 0,
  diffuseConstant: 'diffuseConstant',
  direction: 0,
  display: 0,
  divisor: 0,
  dominantBaseline: 'dominant-baseline',
  dur: 0,
  dx: 0,
  dy: 0,
  edgeMode: 'edgeMode',
  elevation: 0,
  enableBackground: 'enable-background',
  end: 0,
  exponent: 0,
  externalResourcesRequired: 'externalResourcesRequired',
  fill: 0,
  fillOpacity: 'fill-opacity',
  fillRule: 'fill-rule',
  filter: 0,
  filterRes: 'filterRes',
  filterUnits: 'filterUnits',
  floodColor: 'flood-color',
  floodOpacity: 'flood-opacity',
  focusable: 0,
  fontFamily: 'font-family',
  fontSize: 'font-size',
  fontSizeAdjust: 'font-size-adjust',
  fontStretch: 'font-stretch',
  fontStyle: 'font-style',
  fontVariant: 'font-variant',
  fontWeight: 'font-weight',
  format: 0,
  from: 0,
  fx: 0,
  fy: 0,
  g1: 0,
  g2: 0,
  glyphName: 'glyph-name',
  glyphOrientationHorizontal: 'glyph-orientation-horizontal',
  glyphOrientationVertical: 'glyph-orientation-vertical',
  glyphRef: 'glyphRef',
  gradientTransform: 'gradientTransform',
  gradientUnits: 'gradientUnits',
  hanging: 0,
  horizAdvX: 'horiz-adv-x',
  horizOriginX: 'horiz-origin-x',
  ideographic: 0,
  imageRendering: 'image-rendering',
  'in': 0,
  in2: 0,
  intercept: 0,
  k: 0,
  k1: 0,
  k2: 0,
  k3: 0,
  k4: 0,
  kernelMatrix: 'kernelMatrix',
  kernelUnitLength: 'kernelUnitLength',
  kerning: 0,
  keyPoints: 'keyPoints',
  keySplines: 'keySplines',
  keyTimes: 'keyTimes',
  lengthAdjust: 'lengthAdjust',
  letterSpacing: 'letter-spacing',
  lightingColor: 'lighting-color',
  limitingConeAngle: 'limitingConeAngle',
  local: 0,
  markerEnd: 'marker-end',
  markerMid: 'marker-mid',
  markerStart: 'marker-start',
  markerHeight: 'markerHeight',
  markerUnits: 'markerUnits',
  markerWidth: 'markerWidth',
  mask: 0,
  maskContentUnits: 'maskContentUnits',
  maskUnits: 'maskUnits',
  mathematical: 0,
  mode: 0,
  numOctaves: 'numOctaves',
  offset: 0,
  opacity: 0,
  operator: 0,
  order: 0,
  orient: 0,
  orientation: 0,
  origin: 0,
  overflow: 0,
  overlinePosition: 'overline-position',
  overlineThickness: 'overline-thickness',
  paintOrder: 'paint-order',
  panose1: 'panose-1',
  pathLength: 'pathLength',
  patternContentUnits: 'patternContentUnits',
  patternTransform: 'patternTransform',
  patternUnits: 'patternUnits',
  pointerEvents: 'pointer-events',
  points: 0,
  pointsAtX: 'pointsAtX',
  pointsAtY: 'pointsAtY',
  pointsAtZ: 'pointsAtZ',
  preserveAlpha: 'preserveAlpha',
  preserveAspectRatio: 'preserveAspectRatio',
  primitiveUnits: 'primitiveUnits',
  r: 0,
  radius: 0,
  refX: 'refX',
  refY: 'refY',
  renderingIntent: 'rendering-intent',
  repeatCount: 'repeatCount',
  repeatDur: 'repeatDur',
  requiredExtensions: 'requiredExtensions',
  requiredFeatures: 'requiredFeatures',
  restart: 0,
  result: 0,
  rotate: 0,
  rx: 0,
  ry: 0,
  scale: 0,
  seed: 0,
  shapeRendering: 'shape-rendering',
  slope: 0,
  spacing: 0,
  specularConstant: 'specularConstant',
  specularExponent: 'specularExponent',
  speed: 0,
  spreadMethod: 'spreadMethod',
  startOffset: 'startOffset',
  stdDeviation: 'stdDeviation',
  stemh: 0,
  stemv: 0,
  stitchTiles: 'stitchTiles',
  stopColor: 'stop-color',
  stopOpacity: 'stop-opacity',
  strikethroughPosition: 'strikethrough-position',
  strikethroughThickness: 'strikethrough-thickness',
  string: 0,
  stroke: 0,
  strokeDasharray: 'stroke-dasharray',
  strokeDashoffset: 'stroke-dashoffset',
  strokeLinecap: 'stroke-linecap',
  strokeLinejoin: 'stroke-linejoin',
  strokeMiterlimit: 'stroke-miterlimit',
  strokeOpacity: 'stroke-opacity',
  strokeWidth: 'stroke-width',
  surfaceScale: 'surfaceScale',
  systemLanguage: 'systemLanguage',
  tableValues: 'tableValues',
  targetX: 'targetX',
  targetY: 'targetY',
  textAnchor: 'text-anchor',
  textDecoration: 'text-decoration',
  textRendering: 'text-rendering',
  textLength: 'textLength',
  to: 0,
  transform: 0,
  u1: 0,
  u2: 0,
  underlinePosition: 'underline-position',
  underlineThickness: 'underline-thickness',
  unicode: 0,
  unicodeBidi: 'unicode-bidi',
  unicodeRange: 'unicode-range',
  unitsPerEm: 'units-per-em',
  vAlphabetic: 'v-alphabetic',
  vHanging: 'v-hanging',
  vIdeographic: 'v-ideographic',
  vMathematical: 'v-mathematical',
  values: 0,
  vectorEffect: 'vector-effect',
  version: 0,
  vertAdvY: 'vert-adv-y',
  vertOriginX: 'vert-origin-x',
  vertOriginY: 'vert-origin-y',
  viewBox: 'viewBox',
  viewTarget: 'viewTarget',
  visibility: 0,
  widths: 0,
  wordSpacing: 'word-spacing',
  writingMode: 'writing-mode',
  x: 0,
  xHeight: 'x-height',
  x1: 0,
  x2: 0,
  xChannelSelector: 'xChannelSelector',
  xlinkActuate: 'xlink:actuate',
  xlinkArcrole: 'xlink:arcrole',
  xlinkHref: 'xlink:href',
  xlinkRole: 'xlink:role',
  xlinkShow: 'xlink:show',
  xlinkTitle: 'xlink:title',
  xlinkType: 'xlink:type',
  xmlBase: 'xml:base',
  xmlns: 0,
  xmlnsXlink: 'xmlns:xlink',
  xmlLang: 'xml:lang',
  xmlSpace: 'xml:space',
  y: 0,
  y1: 0,
  y2: 0,
  yChannelSelector: 'yChannelSelector',
  z: 0,
  zoomAndPan: 'zoomAndPan'
};

var SVGDOMPropertyConfig = {
  Properties: {},
  DOMAttributeNamespaces: {
    xlinkActuate: NS.xlink,
    xlinkArcrole: NS.xlink,
    xlinkHref: NS.xlink,
    xlinkRole: NS.xlink,
    xlinkShow: NS.xlink,
    xlinkTitle: NS.xlink,
    xlinkType: NS.xlink,
    xmlBase: NS.xml,
    xmlLang: NS.xml,
    xmlSpace: NS.xml
  },
  DOMAttributeNames: {}
};

Object.keys(ATTRS).forEach(function (key) {
  SVGDOMPropertyConfig.Properties[key] = 0;
  if (ATTRS[key]) {
    SVGDOMPropertyConfig.DOMAttributeNames[key] = ATTRS[key];
  }
});

module.exports = SVGDOMPropertyConfig;
},{}],139:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var EventPropagators = require('./EventPropagators');
var ExecutionEnvironment = require('fbjs/lib/ExecutionEnvironment');
var ReactDOMComponentTree = require('./ReactDOMComponentTree');
var ReactInputSelection = require('./ReactInputSelection');
var SyntheticEvent = require('./SyntheticEvent');

var getActiveElement = require('fbjs/lib/getActiveElement');
var isTextInputElement = require('./isTextInputElement');
var shallowEqual = require('fbjs/lib/shallowEqual');

var skipSelectionChangeEvent = ExecutionEnvironment.canUseDOM && 'documentMode' in document && document.documentMode <= 11;

var eventTypes = {
  select: {
    phasedRegistrationNames: {
      bubbled: 'onSelect',
      captured: 'onSelectCapture'
    },
    dependencies: ['topBlur', 'topContextMenu', 'topFocus', 'topKeyDown', 'topKeyUp', 'topMouseDown', 'topMouseUp', 'topSelectionChange']
  }
};

var activeElement = null;
var activeElementInst = null;
var lastSelection = null;
var mouseDown = false;

// Track whether a listener exists for this plugin. If none exist, we do
// not extract events. See #3639.
var hasListener = false;

/**
 * Get an object which is a unique representation of the current selection.
 *
 * The return value will not be consistent across nodes or browsers, but
 * two identical selections on the same node will return identical objects.
 *
 * @param {DOMElement} node
 * @return {object}
 */
function getSelection(node) {
  if ('selectionStart' in node && ReactInputSelection.hasSelectionCapabilities(node)) {
    return {
      start: node.selectionStart,
      end: node.selectionEnd
    };
  } else if (window.getSelection) {
    var selection = window.getSelection();
    return {
      anchorNode: selection.anchorNode,
      anchorOffset: selection.anchorOffset,
      focusNode: selection.focusNode,
      focusOffset: selection.focusOffset
    };
  } else if (document.selection) {
    var range = document.selection.createRange();
    return {
      parentElement: range.parentElement(),
      text: range.text,
      top: range.boundingTop,
      left: range.boundingLeft
    };
  }
}

/**
 * Poll selection to see whether it's changed.
 *
 * @param {object} nativeEvent
 * @return {?SyntheticEvent}
 */
function constructSelectEvent(nativeEvent, nativeEventTarget) {
  // Ensure we have the right element, and that the user is not dragging a
  // selection (this matches native `select` event behavior). In HTML5, select
  // fires only on input and textarea thus if there's no focused element we
  // won't dispatch.
  if (mouseDown || activeElement == null || activeElement !== getActiveElement()) {
    return null;
  }

  // Only fire when selection has actually changed.
  var currentSelection = getSelection(activeElement);
  if (!lastSelection || !shallowEqual(lastSelection, currentSelection)) {
    lastSelection = currentSelection;

    var syntheticEvent = SyntheticEvent.getPooled(eventTypes.select, activeElementInst, nativeEvent, nativeEventTarget);

    syntheticEvent.type = 'select';
    syntheticEvent.target = activeElement;

    EventPropagators.accumulateTwoPhaseDispatches(syntheticEvent);

    return syntheticEvent;
  }

  return null;
}

/**
 * This plugin creates an `onSelect` event that normalizes select events
 * across form elements.
 *
 * Supported elements are:
 * - input (see `isTextInputElement`)
 * - textarea
 * - contentEditable
 *
 * This differs from native browser implementations in the following ways:
 * - Fires on contentEditable fields as well as inputs.
 * - Fires for collapsed selection.
 * - Fires after user input.
 */
var SelectEventPlugin = {

  eventTypes: eventTypes,

  extractEvents: function (topLevelType, targetInst, nativeEvent, nativeEventTarget) {
    if (!hasListener) {
      return null;
    }

    var targetNode = targetInst ? ReactDOMComponentTree.getNodeFromInstance(targetInst) : window;

    switch (topLevelType) {
      // Track the input node that has focus.
      case 'topFocus':
        if (isTextInputElement(targetNode) || targetNode.contentEditable === 'true') {
          activeElement = targetNode;
          activeElementInst = targetInst;
          lastSelection = null;
        }
        break;
      case 'topBlur':
        activeElement = null;
        activeElementInst = null;
        lastSelection = null;
        break;

      // Don't fire the event while the user is dragging. This matches the
      // semantics of the native select event.
      case 'topMouseDown':
        mouseDown = true;
        break;
      case 'topContextMenu':
      case 'topMouseUp':
        mouseDown = false;
        return constructSelectEvent(nativeEvent, nativeEventTarget);

      // Chrome and IE fire non-standard event when selection is changed (and
      // sometimes when it hasn't). IE's event fires out of order with respect
      // to key and input events on deletion, so we discard it.
      //
      // Firefox doesn't support selectionchange, so check selection status
      // after each key entry. The selection changes after keydown and before
      // keyup, but we check on keydown as well in the case of holding down a
      // key, when multiple keydown events are fired but only one keyup is.
      // This is also our approach for IE handling, for the reason above.
      case 'topSelectionChange':
        if (skipSelectionChangeEvent) {
          break;
        }
      // falls through
      case 'topKeyDown':
      case 'topKeyUp':
        return constructSelectEvent(nativeEvent, nativeEventTarget);
    }

    return null;
  },

  didPutListener: function (inst, registrationName, listener) {
    if (registrationName === 'onSelect') {
      hasListener = true;
    }
  }
};

module.exports = SelectEventPlugin;
},{"./EventPropagators":78,"./ReactDOMComponentTree":92,"./ReactInputSelection":119,"./SyntheticEvent":145,"./isTextInputElement":177,"fbjs/lib/ExecutionEnvironment":3,"fbjs/lib/getActiveElement":12,"fbjs/lib/shallowEqual":23}],140:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

'use strict';

var _prodInvariant = require('./reactProdInvariant');

var EventListener = require('fbjs/lib/EventListener');
var EventPropagators = require('./EventPropagators');
var ReactDOMComponentTree = require('./ReactDOMComponentTree');
var SyntheticAnimationEvent = require('./SyntheticAnimationEvent');
var SyntheticClipboardEvent = require('./SyntheticClipboardEvent');
var SyntheticEvent = require('./SyntheticEvent');
var SyntheticFocusEvent = require('./SyntheticFocusEvent');
var SyntheticKeyboardEvent = require('./SyntheticKeyboardEvent');
var SyntheticMouseEvent = require('./SyntheticMouseEvent');
var SyntheticDragEvent = require('./SyntheticDragEvent');
var SyntheticTouchEvent = require('./SyntheticTouchEvent');
var SyntheticTransitionEvent = require('./SyntheticTransitionEvent');
var SyntheticUIEvent = require('./SyntheticUIEvent');
var SyntheticWheelEvent = require('./SyntheticWheelEvent');

var emptyFunction = require('fbjs/lib/emptyFunction');
var getEventCharCode = require('./getEventCharCode');
var invariant = require('fbjs/lib/invariant');

/**
 * Turns
 * ['abort', ...]
 * into
 * eventTypes = {
 *   'abort': {
 *     phasedRegistrationNames: {
 *       bubbled: 'onAbort',
 *       captured: 'onAbortCapture',
 *     },
 *     dependencies: ['topAbort'],
 *   },
 *   ...
 * };
 * topLevelEventsToDispatchConfig = {
 *   'topAbort': { sameConfig }
 * };
 */
var eventTypes = {};
var topLevelEventsToDispatchConfig = {};
['abort', 'animationEnd', 'animationIteration', 'animationStart', 'blur', 'canPlay', 'canPlayThrough', 'click', 'contextMenu', 'copy', 'cut', 'doubleClick', 'drag', 'dragEnd', 'dragEnter', 'dragExit', 'dragLeave', 'dragOver', 'dragStart', 'drop', 'durationChange', 'emptied', 'encrypted', 'ended', 'error', 'focus', 'input', 'invalid', 'keyDown', 'keyPress', 'keyUp', 'load', 'loadedData', 'loadedMetadata', 'loadStart', 'mouseDown', 'mouseMove', 'mouseOut', 'mouseOver', 'mouseUp', 'paste', 'pause', 'play', 'playing', 'progress', 'rateChange', 'reset', 'scroll', 'seeked', 'seeking', 'stalled', 'submit', 'suspend', 'timeUpdate', 'touchCancel', 'touchEnd', 'touchMove', 'touchStart', 'transitionEnd', 'volumeChange', 'waiting', 'wheel'].forEach(function (event) {
  var capitalizedEvent = event[0].toUpperCase() + event.slice(1);
  var onEvent = 'on' + capitalizedEvent;
  var topEvent = 'top' + capitalizedEvent;

  var type = {
    phasedRegistrationNames: {
      bubbled: onEvent,
      captured: onEvent + 'Capture'
    },
    dependencies: [topEvent]
  };
  eventTypes[event] = type;
  topLevelEventsToDispatchConfig[topEvent] = type;
});

var onClickListeners = {};

function getDictionaryKey(inst) {
  // Prevents V8 performance issue:
  // https://github.com/facebook/react/pull/7232
  return '.' + inst._rootNodeID;
}

function isInteractive(tag) {
  return tag === 'button' || tag === 'input' || tag === 'select' || tag === 'textarea';
}

var SimpleEventPlugin = {

  eventTypes: eventTypes,

  extractEvents: function (topLevelType, targetInst, nativeEvent, nativeEventTarget) {
    var dispatchConfig = topLevelEventsToDispatchConfig[topLevelType];
    if (!dispatchConfig) {
      return null;
    }
    var EventConstructor;
    switch (topLevelType) {
      case 'topAbort':
      case 'topCanPlay':
      case 'topCanPlayThrough':
      case 'topDurationChange':
      case 'topEmptied':
      case 'topEncrypted':
      case 'topEnded':
      case 'topError':
      case 'topInput':
      case 'topInvalid':
      case 'topLoad':
      case 'topLoadedData':
      case 'topLoadedMetadata':
      case 'topLoadStart':
      case 'topPause':
      case 'topPlay':
      case 'topPlaying':
      case 'topProgress':
      case 'topRateChange':
      case 'topReset':
      case 'topSeeked':
      case 'topSeeking':
      case 'topStalled':
      case 'topSubmit':
      case 'topSuspend':
      case 'topTimeUpdate':
      case 'topVolumeChange':
      case 'topWaiting':
        // HTML Events
        // @see http://www.w3.org/TR/html5/index.html#events-0
        EventConstructor = SyntheticEvent;
        break;
      case 'topKeyPress':
        // Firefox creates a keypress event for function keys too. This removes
        // the unwanted keypress events. Enter is however both printable and
        // non-printable. One would expect Tab to be as well (but it isn't).
        if (getEventCharCode(nativeEvent) === 0) {
          return null;
        }
      /* falls through */
      case 'topKeyDown':
      case 'topKeyUp':
        EventConstructor = SyntheticKeyboardEvent;
        break;
      case 'topBlur':
      case 'topFocus':
        EventConstructor = SyntheticFocusEvent;
        break;
      case 'topClick':
        // Firefox creates a click event on right mouse clicks. This removes the
        // unwanted click events.
        if (nativeEvent.button === 2) {
          return null;
        }
      /* falls through */
      case 'topDoubleClick':
      case 'topMouseDown':
      case 'topMouseMove':
      case 'topMouseUp':
      // TODO: Disabled elements should not respond to mouse events
      /* falls through */
      case 'topMouseOut':
      case 'topMouseOver':
      case 'topContextMenu':
        EventConstructor = SyntheticMouseEvent;
        break;
      case 'topDrag':
      case 'topDragEnd':
      case 'topDragEnter':
      case 'topDragExit':
      case 'topDragLeave':
      case 'topDragOver':
      case 'topDragStart':
      case 'topDrop':
        EventConstructor = SyntheticDragEvent;
        break;
      case 'topTouchCancel':
      case 'topTouchEnd':
      case 'topTouchMove':
      case 'topTouchStart':
        EventConstructor = SyntheticTouchEvent;
        break;
      case 'topAnimationEnd':
      case 'topAnimationIteration':
      case 'topAnimationStart':
        EventConstructor = SyntheticAnimationEvent;
        break;
      case 'topTransitionEnd':
        EventConstructor = SyntheticTransitionEvent;
        break;
      case 'topScroll':
        EventConstructor = SyntheticUIEvent;
        break;
      case 'topWheel':
        EventConstructor = SyntheticWheelEvent;
        break;
      case 'topCopy':
      case 'topCut':
      case 'topPaste':
        EventConstructor = SyntheticClipboardEvent;
        break;
    }
    !EventConstructor ? process.env.NODE_ENV !== 'production' ? invariant(false, 'SimpleEventPlugin: Unhandled event type, `%s`.', topLevelType) : _prodInvariant('86', topLevelType) : void 0;
    var event = EventConstructor.getPooled(dispatchConfig, targetInst, nativeEvent, nativeEventTarget);
    EventPropagators.accumulateTwoPhaseDispatches(event);
    return event;
  },

  didPutListener: function (inst, registrationName, listener) {
    // Mobile Safari does not fire properly bubble click events on
    // non-interactive elements, which means delegated click listeners do not
    // fire. The workaround for this bug involves attaching an empty click
    // listener on the target node.
    // http://www.quirksmode.org/blog/archives/2010/09/click_event_del.html
    if (registrationName === 'onClick' && !isInteractive(inst._tag)) {
      var key = getDictionaryKey(inst);
      var node = ReactDOMComponentTree.getNodeFromInstance(inst);
      if (!onClickListeners[key]) {
        onClickListeners[key] = EventListener.listen(node, 'click', emptyFunction);
      }
    }
  },

  willDeleteListener: function (inst, registrationName) {
    if (registrationName === 'onClick' && !isInteractive(inst._tag)) {
      var key = getDictionaryKey(inst);
      onClickListeners[key].remove();
      delete onClickListeners[key];
    }
  }

};

module.exports = SimpleEventPlugin;
}).call(this,require('_process'))
},{"./EventPropagators":78,"./ReactDOMComponentTree":92,"./SyntheticAnimationEvent":141,"./SyntheticClipboardEvent":142,"./SyntheticDragEvent":144,"./SyntheticEvent":145,"./SyntheticFocusEvent":146,"./SyntheticKeyboardEvent":148,"./SyntheticMouseEvent":149,"./SyntheticTouchEvent":150,"./SyntheticTransitionEvent":151,"./SyntheticUIEvent":152,"./SyntheticWheelEvent":153,"./getEventCharCode":165,"./reactProdInvariant":179,"_process":58,"fbjs/lib/EventListener":2,"fbjs/lib/emptyFunction":9,"fbjs/lib/invariant":17}],141:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var SyntheticEvent = require('./SyntheticEvent');

/**
 * @interface Event
 * @see http://www.w3.org/TR/css3-animations/#AnimationEvent-interface
 * @see https://developer.mozilla.org/en-US/docs/Web/API/AnimationEvent
 */
var AnimationEventInterface = {
  animationName: null,
  elapsedTime: null,
  pseudoElement: null
};

/**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticEvent}
 */
function SyntheticAnimationEvent(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
  return SyntheticEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
}

SyntheticEvent.augmentClass(SyntheticAnimationEvent, AnimationEventInterface);

module.exports = SyntheticAnimationEvent;
},{"./SyntheticEvent":145}],142:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var SyntheticEvent = require('./SyntheticEvent');

/**
 * @interface Event
 * @see http://www.w3.org/TR/clipboard-apis/
 */
var ClipboardEventInterface = {
  clipboardData: function (event) {
    return 'clipboardData' in event ? event.clipboardData : window.clipboardData;
  }
};

/**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticUIEvent}
 */
function SyntheticClipboardEvent(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
  return SyntheticEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
}

SyntheticEvent.augmentClass(SyntheticClipboardEvent, ClipboardEventInterface);

module.exports = SyntheticClipboardEvent;
},{"./SyntheticEvent":145}],143:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var SyntheticEvent = require('./SyntheticEvent');

/**
 * @interface Event
 * @see http://www.w3.org/TR/DOM-Level-3-Events/#events-compositionevents
 */
var CompositionEventInterface = {
  data: null
};

/**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticUIEvent}
 */
function SyntheticCompositionEvent(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
  return SyntheticEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
}

SyntheticEvent.augmentClass(SyntheticCompositionEvent, CompositionEventInterface);

module.exports = SyntheticCompositionEvent;
},{"./SyntheticEvent":145}],144:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var SyntheticMouseEvent = require('./SyntheticMouseEvent');

/**
 * @interface DragEvent
 * @see http://www.w3.org/TR/DOM-Level-3-Events/
 */
var DragEventInterface = {
  dataTransfer: null
};

/**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticUIEvent}
 */
function SyntheticDragEvent(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
  return SyntheticMouseEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
}

SyntheticMouseEvent.augmentClass(SyntheticDragEvent, DragEventInterface);

module.exports = SyntheticDragEvent;
},{"./SyntheticMouseEvent":149}],145:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var _assign = require('object-assign');

var PooledClass = require('./PooledClass');

var emptyFunction = require('fbjs/lib/emptyFunction');
var warning = require('fbjs/lib/warning');

var didWarnForAddedNewProperty = false;
var isProxySupported = typeof Proxy === 'function';

var shouldBeReleasedProperties = ['dispatchConfig', '_targetInst', 'nativeEvent', 'isDefaultPrevented', 'isPropagationStopped', '_dispatchListeners', '_dispatchInstances'];

/**
 * @interface Event
 * @see http://www.w3.org/TR/DOM-Level-3-Events/
 */
var EventInterface = {
  type: null,
  target: null,
  // currentTarget is set when dispatching; no use in copying it here
  currentTarget: emptyFunction.thatReturnsNull,
  eventPhase: null,
  bubbles: null,
  cancelable: null,
  timeStamp: function (event) {
    return event.timeStamp || Date.now();
  },
  defaultPrevented: null,
  isTrusted: null
};

/**
 * Synthetic events are dispatched by event plugins, typically in response to a
 * top-level event delegation handler.
 *
 * These systems should generally use pooling to reduce the frequency of garbage
 * collection. The system should check `isPersistent` to determine whether the
 * event should be released into the pool after being dispatched. Users that
 * need a persisted event should invoke `persist`.
 *
 * Synthetic events (and subclasses) implement the DOM Level 3 Events API by
 * normalizing browser quirks. Subclasses do not necessarily have to implement a
 * DOM interface; custom application-specific events can also subclass this.
 *
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {*} targetInst Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @param {DOMEventTarget} nativeEventTarget Target node.
 */
function SyntheticEvent(dispatchConfig, targetInst, nativeEvent, nativeEventTarget) {
  if (process.env.NODE_ENV !== 'production') {
    // these have a getter/setter for warnings
    delete this.nativeEvent;
    delete this.preventDefault;
    delete this.stopPropagation;
  }

  this.dispatchConfig = dispatchConfig;
  this._targetInst = targetInst;
  this.nativeEvent = nativeEvent;

  var Interface = this.constructor.Interface;
  for (var propName in Interface) {
    if (!Interface.hasOwnProperty(propName)) {
      continue;
    }
    if (process.env.NODE_ENV !== 'production') {
      delete this[propName]; // this has a getter/setter for warnings
    }
    var normalize = Interface[propName];
    if (normalize) {
      this[propName] = normalize(nativeEvent);
    } else {
      if (propName === 'target') {
        this.target = nativeEventTarget;
      } else {
        this[propName] = nativeEvent[propName];
      }
    }
  }

  var defaultPrevented = nativeEvent.defaultPrevented != null ? nativeEvent.defaultPrevented : nativeEvent.returnValue === false;
  if (defaultPrevented) {
    this.isDefaultPrevented = emptyFunction.thatReturnsTrue;
  } else {
    this.isDefaultPrevented = emptyFunction.thatReturnsFalse;
  }
  this.isPropagationStopped = emptyFunction.thatReturnsFalse;
  return this;
}

_assign(SyntheticEvent.prototype, {

  preventDefault: function () {
    this.defaultPrevented = true;
    var event = this.nativeEvent;
    if (!event) {
      return;
    }

    if (event.preventDefault) {
      event.preventDefault();
    } else if (typeof event.returnValue !== 'unknown') {
      // eslint-disable-line valid-typeof
      event.returnValue = false;
    }
    this.isDefaultPrevented = emptyFunction.thatReturnsTrue;
  },

  stopPropagation: function () {
    var event = this.nativeEvent;
    if (!event) {
      return;
    }

    if (event.stopPropagation) {
      event.stopPropagation();
    } else if (typeof event.cancelBubble !== 'unknown') {
      // eslint-disable-line valid-typeof
      // The ChangeEventPlugin registers a "propertychange" event for
      // IE. This event does not support bubbling or cancelling, and
      // any references to cancelBubble throw "Member not found".  A
      // typeof check of "unknown" circumvents this issue (and is also
      // IE specific).
      event.cancelBubble = true;
    }

    this.isPropagationStopped = emptyFunction.thatReturnsTrue;
  },

  /**
   * We release all dispatched `SyntheticEvent`s after each event loop, adding
   * them back into the pool. This allows a way to hold onto a reference that
   * won't be added back into the pool.
   */
  persist: function () {
    this.isPersistent = emptyFunction.thatReturnsTrue;
  },

  /**
   * Checks if this event should be released back into the pool.
   *
   * @return {boolean} True if this should not be released, false otherwise.
   */
  isPersistent: emptyFunction.thatReturnsFalse,

  /**
   * `PooledClass` looks for `destructor` on each instance it releases.
   */
  destructor: function () {
    var Interface = this.constructor.Interface;
    for (var propName in Interface) {
      if (process.env.NODE_ENV !== 'production') {
        Object.defineProperty(this, propName, getPooledWarningPropertyDefinition(propName, Interface[propName]));
      } else {
        this[propName] = null;
      }
    }
    for (var i = 0; i < shouldBeReleasedProperties.length; i++) {
      this[shouldBeReleasedProperties[i]] = null;
    }
    if (process.env.NODE_ENV !== 'production') {
      Object.defineProperty(this, 'nativeEvent', getPooledWarningPropertyDefinition('nativeEvent', null));
      Object.defineProperty(this, 'preventDefault', getPooledWarningPropertyDefinition('preventDefault', emptyFunction));
      Object.defineProperty(this, 'stopPropagation', getPooledWarningPropertyDefinition('stopPropagation', emptyFunction));
    }
  }

});

SyntheticEvent.Interface = EventInterface;

if (process.env.NODE_ENV !== 'production') {
  if (isProxySupported) {
    /*eslint-disable no-func-assign */
    SyntheticEvent = new Proxy(SyntheticEvent, {
      construct: function (target, args) {
        return this.apply(target, Object.create(target.prototype), args);
      },
      apply: function (constructor, that, args) {
        return new Proxy(constructor.apply(that, args), {
          set: function (target, prop, value) {
            if (prop !== 'isPersistent' && !target.constructor.Interface.hasOwnProperty(prop) && shouldBeReleasedProperties.indexOf(prop) === -1) {
              process.env.NODE_ENV !== 'production' ? warning(didWarnForAddedNewProperty || target.isPersistent(), 'This synthetic event is reused for performance reasons. If you\'re ' + 'seeing this, you\'re adding a new property in the synthetic event object. ' + 'The property is never released. See ' + 'https://fb.me/react-event-pooling for more information.') : void 0;
              didWarnForAddedNewProperty = true;
            }
            target[prop] = value;
            return true;
          }
        });
      }
    });
    /*eslint-enable no-func-assign */
  }
}
/**
 * Helper to reduce boilerplate when creating subclasses.
 *
 * @param {function} Class
 * @param {?object} Interface
 */
SyntheticEvent.augmentClass = function (Class, Interface) {
  var Super = this;

  var E = function () {};
  E.prototype = Super.prototype;
  var prototype = new E();

  _assign(prototype, Class.prototype);
  Class.prototype = prototype;
  Class.prototype.constructor = Class;

  Class.Interface = _assign({}, Super.Interface, Interface);
  Class.augmentClass = Super.augmentClass;

  PooledClass.addPoolingTo(Class, PooledClass.fourArgumentPooler);
};

PooledClass.addPoolingTo(SyntheticEvent, PooledClass.fourArgumentPooler);

module.exports = SyntheticEvent;

/**
  * Helper to nullify syntheticEvent instance properties when destructing
  *
  * @param {object} SyntheticEvent
  * @param {String} propName
  * @return {object} defineProperty object
  */
function getPooledWarningPropertyDefinition(propName, getVal) {
  var isFunction = typeof getVal === 'function';
  return {
    configurable: true,
    set: set,
    get: get
  };

  function set(val) {
    var action = isFunction ? 'setting the method' : 'setting the property';
    warn(action, 'This is effectively a no-op');
    return val;
  }

  function get() {
    var action = isFunction ? 'accessing the method' : 'accessing the property';
    var result = isFunction ? 'This is a no-op function' : 'This is set to null';
    warn(action, result);
    return getVal;
  }

  function warn(action, result) {
    var warningCondition = false;
    process.env.NODE_ENV !== 'production' ? warning(warningCondition, 'This synthetic event is reused for performance reasons. If you\'re seeing this, ' + 'you\'re %s `%s` on a released/nullified synthetic event. %s. ' + 'If you must keep the original synthetic event around, use event.persist(). ' + 'See https://fb.me/react-event-pooling for more information.', action, propName, result) : void 0;
  }
}
}).call(this,require('_process'))
},{"./PooledClass":83,"_process":58,"fbjs/lib/emptyFunction":9,"fbjs/lib/warning":24,"object-assign":57}],146:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var SyntheticUIEvent = require('./SyntheticUIEvent');

/**
 * @interface FocusEvent
 * @see http://www.w3.org/TR/DOM-Level-3-Events/
 */
var FocusEventInterface = {
  relatedTarget: null
};

/**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticUIEvent}
 */
function SyntheticFocusEvent(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
  return SyntheticUIEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
}

SyntheticUIEvent.augmentClass(SyntheticFocusEvent, FocusEventInterface);

module.exports = SyntheticFocusEvent;
},{"./SyntheticUIEvent":152}],147:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var SyntheticEvent = require('./SyntheticEvent');

/**
 * @interface Event
 * @see http://www.w3.org/TR/2013/WD-DOM-Level-3-Events-20131105
 *      /#events-inputevents
 */
var InputEventInterface = {
  data: null
};

/**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticUIEvent}
 */
function SyntheticInputEvent(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
  return SyntheticEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
}

SyntheticEvent.augmentClass(SyntheticInputEvent, InputEventInterface);

module.exports = SyntheticInputEvent;
},{"./SyntheticEvent":145}],148:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var SyntheticUIEvent = require('./SyntheticUIEvent');

var getEventCharCode = require('./getEventCharCode');
var getEventKey = require('./getEventKey');
var getEventModifierState = require('./getEventModifierState');

/**
 * @interface KeyboardEvent
 * @see http://www.w3.org/TR/DOM-Level-3-Events/
 */
var KeyboardEventInterface = {
  key: getEventKey,
  location: null,
  ctrlKey: null,
  shiftKey: null,
  altKey: null,
  metaKey: null,
  repeat: null,
  locale: null,
  getModifierState: getEventModifierState,
  // Legacy Interface
  charCode: function (event) {
    // `charCode` is the result of a KeyPress event and represents the value of
    // the actual printable character.

    // KeyPress is deprecated, but its replacement is not yet final and not
    // implemented in any major browser. Only KeyPress has charCode.
    if (event.type === 'keypress') {
      return getEventCharCode(event);
    }
    return 0;
  },
  keyCode: function (event) {
    // `keyCode` is the result of a KeyDown/Up event and represents the value of
    // physical keyboard key.

    // The actual meaning of the value depends on the users' keyboard layout
    // which cannot be detected. Assuming that it is a US keyboard layout
    // provides a surprisingly accurate mapping for US and European users.
    // Due to this, it is left to the user to implement at this time.
    if (event.type === 'keydown' || event.type === 'keyup') {
      return event.keyCode;
    }
    return 0;
  },
  which: function (event) {
    // `which` is an alias for either `keyCode` or `charCode` depending on the
    // type of the event.
    if (event.type === 'keypress') {
      return getEventCharCode(event);
    }
    if (event.type === 'keydown' || event.type === 'keyup') {
      return event.keyCode;
    }
    return 0;
  }
};

/**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticUIEvent}
 */
function SyntheticKeyboardEvent(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
  return SyntheticUIEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
}

SyntheticUIEvent.augmentClass(SyntheticKeyboardEvent, KeyboardEventInterface);

module.exports = SyntheticKeyboardEvent;
},{"./SyntheticUIEvent":152,"./getEventCharCode":165,"./getEventKey":166,"./getEventModifierState":167}],149:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var SyntheticUIEvent = require('./SyntheticUIEvent');
var ViewportMetrics = require('./ViewportMetrics');

var getEventModifierState = require('./getEventModifierState');

/**
 * @interface MouseEvent
 * @see http://www.w3.org/TR/DOM-Level-3-Events/
 */
var MouseEventInterface = {
  screenX: null,
  screenY: null,
  clientX: null,
  clientY: null,
  ctrlKey: null,
  shiftKey: null,
  altKey: null,
  metaKey: null,
  getModifierState: getEventModifierState,
  button: function (event) {
    // Webkit, Firefox, IE9+
    // which:  1 2 3
    // button: 0 1 2 (standard)
    var button = event.button;
    if ('which' in event) {
      return button;
    }
    // IE<9
    // which:  undefined
    // button: 0 0 0
    // button: 1 4 2 (onmouseup)
    return button === 2 ? 2 : button === 4 ? 1 : 0;
  },
  buttons: null,
  relatedTarget: function (event) {
    return event.relatedTarget || (event.fromElement === event.srcElement ? event.toElement : event.fromElement);
  },
  // "Proprietary" Interface.
  pageX: function (event) {
    return 'pageX' in event ? event.pageX : event.clientX + ViewportMetrics.currentScrollLeft;
  },
  pageY: function (event) {
    return 'pageY' in event ? event.pageY : event.clientY + ViewportMetrics.currentScrollTop;
  }
};

/**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticUIEvent}
 */
function SyntheticMouseEvent(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
  return SyntheticUIEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
}

SyntheticUIEvent.augmentClass(SyntheticMouseEvent, MouseEventInterface);

module.exports = SyntheticMouseEvent;
},{"./SyntheticUIEvent":152,"./ViewportMetrics":155,"./getEventModifierState":167}],150:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var SyntheticUIEvent = require('./SyntheticUIEvent');

var getEventModifierState = require('./getEventModifierState');

/**
 * @interface TouchEvent
 * @see http://www.w3.org/TR/touch-events/
 */
var TouchEventInterface = {
  touches: null,
  targetTouches: null,
  changedTouches: null,
  altKey: null,
  metaKey: null,
  ctrlKey: null,
  shiftKey: null,
  getModifierState: getEventModifierState
};

/**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticUIEvent}
 */
function SyntheticTouchEvent(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
  return SyntheticUIEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
}

SyntheticUIEvent.augmentClass(SyntheticTouchEvent, TouchEventInterface);

module.exports = SyntheticTouchEvent;
},{"./SyntheticUIEvent":152,"./getEventModifierState":167}],151:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var SyntheticEvent = require('./SyntheticEvent');

/**
 * @interface Event
 * @see http://www.w3.org/TR/2009/WD-css3-transitions-20090320/#transition-events-
 * @see https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent
 */
var TransitionEventInterface = {
  propertyName: null,
  elapsedTime: null,
  pseudoElement: null
};

/**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticEvent}
 */
function SyntheticTransitionEvent(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
  return SyntheticEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
}

SyntheticEvent.augmentClass(SyntheticTransitionEvent, TransitionEventInterface);

module.exports = SyntheticTransitionEvent;
},{"./SyntheticEvent":145}],152:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var SyntheticEvent = require('./SyntheticEvent');

var getEventTarget = require('./getEventTarget');

/**
 * @interface UIEvent
 * @see http://www.w3.org/TR/DOM-Level-3-Events/
 */
var UIEventInterface = {
  view: function (event) {
    if (event.view) {
      return event.view;
    }

    var target = getEventTarget(event);
    if (target.window === target) {
      // target is a window object
      return target;
    }

    var doc = target.ownerDocument;
    // TODO: Figure out why `ownerDocument` is sometimes undefined in IE8.
    if (doc) {
      return doc.defaultView || doc.parentWindow;
    } else {
      return window;
    }
  },
  detail: function (event) {
    return event.detail || 0;
  }
};

/**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticEvent}
 */
function SyntheticUIEvent(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
  return SyntheticEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
}

SyntheticEvent.augmentClass(SyntheticUIEvent, UIEventInterface);

module.exports = SyntheticUIEvent;
},{"./SyntheticEvent":145,"./getEventTarget":168}],153:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var SyntheticMouseEvent = require('./SyntheticMouseEvent');

/**
 * @interface WheelEvent
 * @see http://www.w3.org/TR/DOM-Level-3-Events/
 */
var WheelEventInterface = {
  deltaX: function (event) {
    return 'deltaX' in event ? event.deltaX :
    // Fallback to `wheelDeltaX` for Webkit and normalize (right is positive).
    'wheelDeltaX' in event ? -event.wheelDeltaX : 0;
  },
  deltaY: function (event) {
    return 'deltaY' in event ? event.deltaY :
    // Fallback to `wheelDeltaY` for Webkit and normalize (down is positive).
    'wheelDeltaY' in event ? -event.wheelDeltaY :
    // Fallback to `wheelDelta` for IE<9 and normalize (down is positive).
    'wheelDelta' in event ? -event.wheelDelta : 0;
  },
  deltaZ: null,

  // Browsers without "deltaMode" is reporting in raw wheel delta where one
  // notch on the scroll is always +/- 120, roughly equivalent to pixels.
  // A good approximation of DOM_DELTA_LINE (1) is 5% of viewport size or
  // ~40 pixels, for DOM_DELTA_SCREEN (2) it is 87.5% of viewport size.
  deltaMode: null
};

/**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticMouseEvent}
 */
function SyntheticWheelEvent(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
  return SyntheticMouseEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
}

SyntheticMouseEvent.augmentClass(SyntheticWheelEvent, WheelEventInterface);

module.exports = SyntheticWheelEvent;
},{"./SyntheticMouseEvent":149}],154:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

'use strict';

var _prodInvariant = require('./reactProdInvariant');

var invariant = require('fbjs/lib/invariant');

var OBSERVED_ERROR = {};

/**
 * `Transaction` creates a black box that is able to wrap any method such that
 * certain invariants are maintained before and after the method is invoked
 * (Even if an exception is thrown while invoking the wrapped method). Whoever
 * instantiates a transaction can provide enforcers of the invariants at
 * creation time. The `Transaction` class itself will supply one additional
 * automatic invariant for you - the invariant that any transaction instance
 * should not be run while it is already being run. You would typically create a
 * single instance of a `Transaction` for reuse multiple times, that potentially
 * is used to wrap several different methods. Wrappers are extremely simple -
 * they only require implementing two methods.
 *
 * <pre>
 *                       wrappers (injected at creation time)
 *                                      +        +
 *                                      |        |
 *                    +-----------------|--------|--------------+
 *                    |                 v        |              |
 *                    |      +---------------+   |              |
 *                    |   +--|    wrapper1   |---|----+         |
 *                    |   |  +---------------+   v    |         |
 *                    |   |          +-------------+  |         |
 *                    |   |     +----|   wrapper2  |--------+   |
 *                    |   |     |    +-------------+  |     |   |
 *                    |   |     |                     |     |   |
 *                    |   v     v                     v     v   | wrapper
 *                    | +---+ +---+   +---------+   +---+ +---+ | invariants
 * perform(anyMethod) | |   | |   |   |         |   |   | |   | | maintained
 * +----------------->|-|---|-|---|-->|anyMethod|---|---|-|---|-|-------->
 *                    | |   | |   |   |         |   |   | |   | |
 *                    | |   | |   |   |         |   |   | |   | |
 *                    | |   | |   |   |         |   |   | |   | |
 *                    | +---+ +---+   +---------+   +---+ +---+ |
 *                    |  initialize                    close    |
 *                    +-----------------------------------------+
 * </pre>
 *
 * Use cases:
 * - Preserving the input selection ranges before/after reconciliation.
 *   Restoring selection even in the event of an unexpected error.
 * - Deactivating events while rearranging the DOM, preventing blurs/focuses,
 *   while guaranteeing that afterwards, the event system is reactivated.
 * - Flushing a queue of collected DOM mutations to the main UI thread after a
 *   reconciliation takes place in a worker thread.
 * - Invoking any collected `componentDidUpdate` callbacks after rendering new
 *   content.
 * - (Future use case): Wrapping particular flushes of the `ReactWorker` queue
 *   to preserve the `scrollTop` (an automatic scroll aware DOM).
 * - (Future use case): Layout calculations before and after DOM updates.
 *
 * Transactional plugin API:
 * - A module that has an `initialize` method that returns any precomputation.
 * - and a `close` method that accepts the precomputation. `close` is invoked
 *   when the wrapped process is completed, or has failed.
 *
 * @param {Array<TransactionalWrapper>} transactionWrapper Wrapper modules
 * that implement `initialize` and `close`.
 * @return {Transaction} Single transaction for reuse in thread.
 *
 * @class Transaction
 */
var TransactionImpl = {
  /**
   * Sets up this instance so that it is prepared for collecting metrics. Does
   * so such that this setup method may be used on an instance that is already
   * initialized, in a way that does not consume additional memory upon reuse.
   * That can be useful if you decide to make your subclass of this mixin a
   * "PooledClass".
   */
  reinitializeTransaction: function () {
    this.transactionWrappers = this.getTransactionWrappers();
    if (this.wrapperInitData) {
      this.wrapperInitData.length = 0;
    } else {
      this.wrapperInitData = [];
    }
    this._isInTransaction = false;
  },

  _isInTransaction: false,

  /**
   * @abstract
   * @return {Array<TransactionWrapper>} Array of transaction wrappers.
   */
  getTransactionWrappers: null,

  isInTransaction: function () {
    return !!this._isInTransaction;
  },

  /**
   * Executes the function within a safety window. Use this for the top level
   * methods that result in large amounts of computation/mutations that would
   * need to be safety checked. The optional arguments helps prevent the need
   * to bind in many cases.
   *
   * @param {function} method Member of scope to call.
   * @param {Object} scope Scope to invoke from.
   * @param {Object?=} a Argument to pass to the method.
   * @param {Object?=} b Argument to pass to the method.
   * @param {Object?=} c Argument to pass to the method.
   * @param {Object?=} d Argument to pass to the method.
   * @param {Object?=} e Argument to pass to the method.
   * @param {Object?=} f Argument to pass to the method.
   *
   * @return {*} Return value from `method`.
   */
  perform: function (method, scope, a, b, c, d, e, f) {
    !!this.isInTransaction() ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Transaction.perform(...): Cannot initialize a transaction when there is already an outstanding transaction.') : _prodInvariant('27') : void 0;
    var errorThrown;
    var ret;
    try {
      this._isInTransaction = true;
      // Catching errors makes debugging more difficult, so we start with
      // errorThrown set to true before setting it to false after calling
      // close -- if it's still set to true in the finally block, it means
      // one of these calls threw.
      errorThrown = true;
      this.initializeAll(0);
      ret = method.call(scope, a, b, c, d, e, f);
      errorThrown = false;
    } finally {
      try {
        if (errorThrown) {
          // If `method` throws, prefer to show that stack trace over any thrown
          // by invoking `closeAll`.
          try {
            this.closeAll(0);
          } catch (err) {}
        } else {
          // Since `method` didn't throw, we don't want to silence the exception
          // here.
          this.closeAll(0);
        }
      } finally {
        this._isInTransaction = false;
      }
    }
    return ret;
  },

  initializeAll: function (startIndex) {
    var transactionWrappers = this.transactionWrappers;
    for (var i = startIndex; i < transactionWrappers.length; i++) {
      var wrapper = transactionWrappers[i];
      try {
        // Catching errors makes debugging more difficult, so we start with the
        // OBSERVED_ERROR state before overwriting it with the real return value
        // of initialize -- if it's still set to OBSERVED_ERROR in the finally
        // block, it means wrapper.initialize threw.
        this.wrapperInitData[i] = OBSERVED_ERROR;
        this.wrapperInitData[i] = wrapper.initialize ? wrapper.initialize.call(this) : null;
      } finally {
        if (this.wrapperInitData[i] === OBSERVED_ERROR) {
          // The initializer for wrapper i threw an error; initialize the
          // remaining wrappers but silence any exceptions from them to ensure
          // that the first error is the one to bubble up.
          try {
            this.initializeAll(i + 1);
          } catch (err) {}
        }
      }
    }
  },

  /**
   * Invokes each of `this.transactionWrappers.close[i]` functions, passing into
   * them the respective return values of `this.transactionWrappers.init[i]`
   * (`close`rs that correspond to initializers that failed will not be
   * invoked).
   */
  closeAll: function (startIndex) {
    !this.isInTransaction() ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Transaction.closeAll(): Cannot close transaction when none are open.') : _prodInvariant('28') : void 0;
    var transactionWrappers = this.transactionWrappers;
    for (var i = startIndex; i < transactionWrappers.length; i++) {
      var wrapper = transactionWrappers[i];
      var initData = this.wrapperInitData[i];
      var errorThrown;
      try {
        // Catching errors makes debugging more difficult, so we start with
        // errorThrown set to true before setting it to false after calling
        // close -- if it's still set to true in the finally block, it means
        // wrapper.close threw.
        errorThrown = true;
        if (initData !== OBSERVED_ERROR && wrapper.close) {
          wrapper.close.call(this, initData);
        }
        errorThrown = false;
      } finally {
        if (errorThrown) {
          // The closer for wrapper i threw an error; close the remaining
          // wrappers but silence any exceptions from them to ensure that the
          // first error is the one to bubble up.
          try {
            this.closeAll(i + 1);
          } catch (e) {}
        }
      }
    }
    this.wrapperInitData.length = 0;
  }
};

module.exports = TransactionImpl;
}).call(this,require('_process'))
},{"./reactProdInvariant":179,"_process":58,"fbjs/lib/invariant":17}],155:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var ViewportMetrics = {

  currentScrollLeft: 0,

  currentScrollTop: 0,

  refreshScrollValues: function (scrollPosition) {
    ViewportMetrics.currentScrollLeft = scrollPosition.x;
    ViewportMetrics.currentScrollTop = scrollPosition.y;
  }

};

module.exports = ViewportMetrics;
},{}],156:[function(require,module,exports){
(function (process){
/**
 * Copyright 2014-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

'use strict';

var _prodInvariant = require('./reactProdInvariant');

var invariant = require('fbjs/lib/invariant');

/**
 * Accumulates items that must not be null or undefined into the first one. This
 * is used to conserve memory by avoiding array allocations, and thus sacrifices
 * API cleanness. Since `current` can be null before being passed in and not
 * null after this function, make sure to assign it back to `current`:
 *
 * `a = accumulateInto(a, b);`
 *
 * This API should be sparingly used. Try `accumulate` for something cleaner.
 *
 * @return {*|array<*>} An accumulation of items.
 */

function accumulateInto(current, next) {
  !(next != null) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'accumulateInto(...): Accumulated items must not be null or undefined.') : _prodInvariant('30') : void 0;

  if (current == null) {
    return next;
  }

  // Both are not empty. Warning: Never call x.concat(y) when you are not
  // certain that x is an Array (x could be a string with concat method).
  if (Array.isArray(current)) {
    if (Array.isArray(next)) {
      current.push.apply(current, next);
      return current;
    }
    current.push(next);
    return current;
  }

  if (Array.isArray(next)) {
    // A bit too dangerous to mutate `next`.
    return [current].concat(next);
  }

  return [current, next];
}

module.exports = accumulateInto;
}).call(this,require('_process'))
},{"./reactProdInvariant":179,"_process":58,"fbjs/lib/invariant":17}],157:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

'use strict';

var MOD = 65521;

// adler32 is not cryptographically strong, and is only used to sanity check that
// markup generated on the server matches the markup generated on the client.
// This implementation (a modified version of the SheetJS version) has been optimized
// for our use case, at the expense of conforming to the adler32 specification
// for non-ascii inputs.
function adler32(data) {
  var a = 1;
  var b = 0;
  var i = 0;
  var l = data.length;
  var m = l & ~0x3;
  while (i < m) {
    var n = Math.min(i + 4096, m);
    for (; i < n; i += 4) {
      b += (a += data.charCodeAt(i)) + (a += data.charCodeAt(i + 1)) + (a += data.charCodeAt(i + 2)) + (a += data.charCodeAt(i + 3));
    }
    a %= MOD;
    b %= MOD;
  }
  for (; i < l; i++) {
    b += a += data.charCodeAt(i);
  }
  a %= MOD;
  b %= MOD;
  return a | b << 16;
}

module.exports = adler32;
},{}],158:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var _prodInvariant = require('./reactProdInvariant');

var ReactPropTypeLocationNames = require('./ReactPropTypeLocationNames');
var ReactPropTypesSecret = require('./ReactPropTypesSecret');

var invariant = require('fbjs/lib/invariant');
var warning = require('fbjs/lib/warning');

var ReactComponentTreeHook;

if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'test') {
  // Temporary hack.
  // Inline requires don't work well with Jest:
  // https://github.com/facebook/react/issues/7240
  // Remove the inline requires when we don't need them anymore:
  // https://github.com/facebook/react/pull/7178
  ReactComponentTreeHook = require('react/lib/ReactComponentTreeHook');
}

var loggedTypeFailures = {};

/**
 * Assert that the values match with the type specs.
 * Error messages are memorized and will only be shown once.
 *
 * @param {object} typeSpecs Map of name to a ReactPropType
 * @param {object} values Runtime values that need to be type-checked
 * @param {string} location e.g. "prop", "context", "child context"
 * @param {string} componentName Name of the component for error messages.
 * @param {?object} element The React element that is being type-checked
 * @param {?number} debugID The React component instance that is being type-checked
 * @private
 */
function checkReactTypeSpec(typeSpecs, values, location, componentName, element, debugID) {
  for (var typeSpecName in typeSpecs) {
    if (typeSpecs.hasOwnProperty(typeSpecName)) {
      var error;
      // Prop type validation may throw. In case they do, we don't want to
      // fail the render phase where it didn't fail before. So we log it.
      // After these have been cleaned up, we'll let them throw.
      try {
        // This is intentionally an invariant that gets caught. It's the same
        // behavior as without this statement except with a better message.
        !(typeof typeSpecs[typeSpecName] === 'function') ? process.env.NODE_ENV !== 'production' ? invariant(false, '%s: %s type `%s` is invalid; it must be a function, usually from React.PropTypes.', componentName || 'React class', ReactPropTypeLocationNames[location], typeSpecName) : _prodInvariant('84', componentName || 'React class', ReactPropTypeLocationNames[location], typeSpecName) : void 0;
        error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
      } catch (ex) {
        error = ex;
      }
      process.env.NODE_ENV !== 'production' ? warning(!error || error instanceof Error, '%s: type specification of %s `%s` is invalid; the type checker ' + 'function must return `null` or an `Error` but returned a %s. ' + 'You may have forgotten to pass an argument to the type checker ' + 'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' + 'shape all require an argument).', componentName || 'React class', ReactPropTypeLocationNames[location], typeSpecName, typeof error) : void 0;
      if (error instanceof Error && !(error.message in loggedTypeFailures)) {
        // Only monitor this failure once because there tends to be a lot of the
        // same error.
        loggedTypeFailures[error.message] = true;

        var componentStackInfo = '';

        if (process.env.NODE_ENV !== 'production') {
          if (!ReactComponentTreeHook) {
            ReactComponentTreeHook = require('react/lib/ReactComponentTreeHook');
          }
          if (debugID !== null) {
            componentStackInfo = ReactComponentTreeHook.getStackAddendumByID(debugID);
          } else if (element !== null) {
            componentStackInfo = ReactComponentTreeHook.getCurrentStackAddendum(element);
          }
        }

        process.env.NODE_ENV !== 'production' ? warning(false, 'Failed %s type: %s%s', location, error.message, componentStackInfo) : void 0;
      }
    }
  }
}

module.exports = checkReactTypeSpec;
}).call(this,require('_process'))
},{"./ReactPropTypeLocationNames":128,"./ReactPropTypesSecret":129,"./reactProdInvariant":179,"_process":58,"fbjs/lib/invariant":17,"fbjs/lib/warning":24,"react/lib/ReactComponentTreeHook":192}],159:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

/* globals MSApp */

'use strict';

/**
 * Create a function which has 'unsafe' privileges (required by windows8 apps)
 */

var createMicrosoftUnsafeLocalFunction = function (func) {
  if (typeof MSApp !== 'undefined' && MSApp.execUnsafeLocalFunction) {
    return function (arg0, arg1, arg2, arg3) {
      MSApp.execUnsafeLocalFunction(function () {
        return func(arg0, arg1, arg2, arg3);
      });
    };
  } else {
    return func;
  }
};

module.exports = createMicrosoftUnsafeLocalFunction;
},{}],160:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var CSSProperty = require('./CSSProperty');
var warning = require('fbjs/lib/warning');

var isUnitlessNumber = CSSProperty.isUnitlessNumber;
var styleWarnings = {};

/**
 * Convert a value into the proper css writable value. The style name `name`
 * should be logical (no hyphens), as specified
 * in `CSSProperty.isUnitlessNumber`.
 *
 * @param {string} name CSS property name such as `topMargin`.
 * @param {*} value CSS property value such as `10px`.
 * @param {ReactDOMComponent} component
 * @return {string} Normalized style value with dimensions applied.
 */
function dangerousStyleValue(name, value, component) {
  // Note that we've removed escapeTextForBrowser() calls here since the
  // whole string will be escaped when the attribute is injected into
  // the markup. If you provide unsafe user data here they can inject
  // arbitrary CSS which may be problematic (I couldn't repro this):
  // https://www.owasp.org/index.php/XSS_Filter_Evasion_Cheat_Sheet
  // http://www.thespanner.co.uk/2007/11/26/ultimate-xss-css-injection/
  // This is not an XSS hole but instead a potential CSS injection issue
  // which has lead to a greater discussion about how we're going to
  // trust URLs moving forward. See #2115901

  var isEmpty = value == null || typeof value === 'boolean' || value === '';
  if (isEmpty) {
    return '';
  }

  var isNonNumeric = isNaN(value);
  if (isNonNumeric || value === 0 || isUnitlessNumber.hasOwnProperty(name) && isUnitlessNumber[name]) {
    return '' + value; // cast to string
  }

  if (typeof value === 'string') {
    if (process.env.NODE_ENV !== 'production') {
      // Allow '0' to pass through without warning. 0 is already special and
      // doesn't require units, so we don't need to warn about it.
      if (component && value !== '0') {
        var owner = component._currentElement._owner;
        var ownerName = owner ? owner.getName() : null;
        if (ownerName && !styleWarnings[ownerName]) {
          styleWarnings[ownerName] = {};
        }
        var warned = false;
        if (ownerName) {
          var warnings = styleWarnings[ownerName];
          warned = warnings[name];
          if (!warned) {
            warnings[name] = true;
          }
        }
        if (!warned) {
          process.env.NODE_ENV !== 'production' ? warning(false, 'a `%s` tag (owner: `%s`) was passed a numeric string value ' + 'for CSS property `%s` (value: `%s`) which will be treated ' + 'as a unitless number in a future version of React.', component._currentElement.type, ownerName || 'unknown', name, value) : void 0;
        }
      }
    }
    value = value.trim();
  }
  return value + 'px';
}

module.exports = dangerousStyleValue;
}).call(this,require('_process'))
},{"./CSSProperty":63,"_process":58,"fbjs/lib/warning":24}],161:[function(require,module,exports){
/**
 * Copyright 2016-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * Based on the escape-html library, which is used under the MIT License below:
 *
 * Copyright (c) 2012-2013 TJ Holowaychuk
 * Copyright (c) 2015 Andreas Lubbe
 * Copyright (c) 2015 Tiancheng "Timothy" Gu
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * 'Software'), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
 * CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 */

'use strict';

// code copied and modified from escape-html
/**
 * Module variables.
 * @private
 */

var matchHtmlRegExp = /["'&<>]/;

/**
 * Escape special characters in the given string of html.
 *
 * @param  {string} string The string to escape for inserting into HTML
 * @return {string}
 * @public
 */

function escapeHtml(string) {
  var str = '' + string;
  var match = matchHtmlRegExp.exec(str);

  if (!match) {
    return str;
  }

  var escape;
  var html = '';
  var index = 0;
  var lastIndex = 0;

  for (index = match.index; index < str.length; index++) {
    switch (str.charCodeAt(index)) {
      case 34:
        // "
        escape = '&quot;';
        break;
      case 38:
        // &
        escape = '&amp;';
        break;
      case 39:
        // '
        escape = '&#x27;'; // modified from escape-html; used to be '&#39'
        break;
      case 60:
        // <
        escape = '&lt;';
        break;
      case 62:
        // >
        escape = '&gt;';
        break;
      default:
        continue;
    }

    if (lastIndex !== index) {
      html += str.substring(lastIndex, index);
    }

    lastIndex = index + 1;
    html += escape;
  }

  return lastIndex !== index ? html + str.substring(lastIndex, index) : html;
}
// end code copied and modified from escape-html


/**
 * Escapes text to prevent scripting attacks.
 *
 * @param {*} text Text value to escape.
 * @return {string} An escaped string.
 */
function escapeTextContentForBrowser(text) {
  if (typeof text === 'boolean' || typeof text === 'number') {
    // this shortcircuit helps perf for types that we know will never have
    // special characters, especially given that this function is used often
    // for numeric dom ids.
    return '' + text;
  }
  return escapeHtml(text);
}

module.exports = escapeTextContentForBrowser;
},{}],162:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var _prodInvariant = require('./reactProdInvariant');

var ReactCurrentOwner = require('react/lib/ReactCurrentOwner');
var ReactDOMComponentTree = require('./ReactDOMComponentTree');
var ReactInstanceMap = require('./ReactInstanceMap');

var getHostComponentFromComposite = require('./getHostComponentFromComposite');
var invariant = require('fbjs/lib/invariant');
var warning = require('fbjs/lib/warning');

/**
 * Returns the DOM node rendered by this element.
 *
 * See https://facebook.github.io/react/docs/top-level-api.html#reactdom.finddomnode
 *
 * @param {ReactComponent|DOMElement} componentOrElement
 * @return {?DOMElement} The root node of this element.
 */
function findDOMNode(componentOrElement) {
  if (process.env.NODE_ENV !== 'production') {
    var owner = ReactCurrentOwner.current;
    if (owner !== null) {
      process.env.NODE_ENV !== 'production' ? warning(owner._warnedAboutRefsInRender, '%s is accessing findDOMNode inside its render(). ' + 'render() should be a pure function of props and state. It should ' + 'never access something that requires stale data from the previous ' + 'render, such as refs. Move this logic to componentDidMount and ' + 'componentDidUpdate instead.', owner.getName() || 'A component') : void 0;
      owner._warnedAboutRefsInRender = true;
    }
  }
  if (componentOrElement == null) {
    return null;
  }
  if (componentOrElement.nodeType === 1) {
    return componentOrElement;
  }

  var inst = ReactInstanceMap.get(componentOrElement);
  if (inst) {
    inst = getHostComponentFromComposite(inst);
    return inst ? ReactDOMComponentTree.getNodeFromInstance(inst) : null;
  }

  if (typeof componentOrElement.render === 'function') {
    !false ? process.env.NODE_ENV !== 'production' ? invariant(false, 'findDOMNode was called on an unmounted component.') : _prodInvariant('44') : void 0;
  } else {
    !false ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Element appears to be neither ReactComponent nor DOMNode (keys: %s)', Object.keys(componentOrElement)) : _prodInvariant('45', Object.keys(componentOrElement)) : void 0;
  }
}

module.exports = findDOMNode;
}).call(this,require('_process'))
},{"./ReactDOMComponentTree":92,"./ReactInstanceMap":120,"./getHostComponentFromComposite":169,"./reactProdInvariant":179,"_process":58,"fbjs/lib/invariant":17,"fbjs/lib/warning":24,"react/lib/ReactCurrentOwner":193}],163:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

'use strict';

var KeyEscapeUtils = require('./KeyEscapeUtils');
var traverseAllChildren = require('./traverseAllChildren');
var warning = require('fbjs/lib/warning');

var ReactComponentTreeHook;

if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'test') {
  // Temporary hack.
  // Inline requires don't work well with Jest:
  // https://github.com/facebook/react/issues/7240
  // Remove the inline requires when we don't need them anymore:
  // https://github.com/facebook/react/pull/7178
  ReactComponentTreeHook = require('react/lib/ReactComponentTreeHook');
}

/**
 * @param {function} traverseContext Context passed through traversal.
 * @param {?ReactComponent} child React child component.
 * @param {!string} name String name of key path to child.
 * @param {number=} selfDebugID Optional debugID of the current internal instance.
 */
function flattenSingleChildIntoContext(traverseContext, child, name, selfDebugID) {
  // We found a component instance.
  if (traverseContext && typeof traverseContext === 'object') {
    var result = traverseContext;
    var keyUnique = result[name] === undefined;
    if (process.env.NODE_ENV !== 'production') {
      if (!ReactComponentTreeHook) {
        ReactComponentTreeHook = require('react/lib/ReactComponentTreeHook');
      }
      if (!keyUnique) {
        process.env.NODE_ENV !== 'production' ? warning(false, 'flattenChildren(...): Encountered two children with the same key, ' + '`%s`. Child keys must be unique; when two children share a key, only ' + 'the first child will be used.%s', KeyEscapeUtils.unescape(name), ReactComponentTreeHook.getStackAddendumByID(selfDebugID)) : void 0;
      }
    }
    if (keyUnique && child != null) {
      result[name] = child;
    }
  }
}

/**
 * Flattens children that are typically specified as `props.children`. Any null
 * children will not be included in the resulting object.
 * @return {!object} flattened children keyed by name.
 */
function flattenChildren(children, selfDebugID) {
  if (children == null) {
    return children;
  }
  var result = {};

  if (process.env.NODE_ENV !== 'production') {
    traverseAllChildren(children, function (traverseContext, child, name) {
      return flattenSingleChildIntoContext(traverseContext, child, name, selfDebugID);
    }, result);
  } else {
    traverseAllChildren(children, flattenSingleChildIntoContext, result);
  }
  return result;
}

module.exports = flattenChildren;
}).call(this,require('_process'))
},{"./KeyEscapeUtils":81,"./traverseAllChildren":184,"_process":58,"fbjs/lib/warning":24,"react/lib/ReactComponentTreeHook":192}],164:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

'use strict';

/**
 * @param {array} arr an "accumulation" of items which is either an Array or
 * a single item. Useful when paired with the `accumulate` module. This is a
 * simple utility that allows us to reason about a collection of items, but
 * handling the case when there is exactly one item (and we do not need to
 * allocate an array).
 */

function forEachAccumulated(arr, cb, scope) {
  if (Array.isArray(arr)) {
    arr.forEach(cb, scope);
  } else if (arr) {
    cb.call(scope, arr);
  }
}

module.exports = forEachAccumulated;
},{}],165:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

/**
 * `charCode` represents the actual "character code" and is safe to use with
 * `String.fromCharCode`. As such, only keys that correspond to printable
 * characters produce a valid `charCode`, the only exception to this is Enter.
 * The Tab-key is considered non-printable and does not have a `charCode`,
 * presumably because it does not produce a tab-character in browsers.
 *
 * @param {object} nativeEvent Native browser event.
 * @return {number} Normalized `charCode` property.
 */

function getEventCharCode(nativeEvent) {
  var charCode;
  var keyCode = nativeEvent.keyCode;

  if ('charCode' in nativeEvent) {
    charCode = nativeEvent.charCode;

    // FF does not set `charCode` for the Enter-key, check against `keyCode`.
    if (charCode === 0 && keyCode === 13) {
      charCode = 13;
    }
  } else {
    // IE8 does not implement `charCode`, but `keyCode` has the correct value.
    charCode = keyCode;
  }

  // Some non-printable keys are reported in `charCode`/`keyCode`, discard them.
  // Must not discard the (non-)printable Enter-key.
  if (charCode >= 32 || charCode === 13) {
    return charCode;
  }

  return 0;
}

module.exports = getEventCharCode;
},{}],166:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var getEventCharCode = require('./getEventCharCode');

/**
 * Normalization of deprecated HTML5 `key` values
 * @see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent#Key_names
 */
var normalizeKey = {
  'Esc': 'Escape',
  'Spacebar': ' ',
  'Left': 'ArrowLeft',
  'Up': 'ArrowUp',
  'Right': 'ArrowRight',
  'Down': 'ArrowDown',
  'Del': 'Delete',
  'Win': 'OS',
  'Menu': 'ContextMenu',
  'Apps': 'ContextMenu',
  'Scroll': 'ScrollLock',
  'MozPrintableKey': 'Unidentified'
};

/**
 * Translation from legacy `keyCode` to HTML5 `key`
 * Only special keys supported, all others depend on keyboard layout or browser
 * @see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent#Key_names
 */
var translateToKey = {
  8: 'Backspace',
  9: 'Tab',
  12: 'Clear',
  13: 'Enter',
  16: 'Shift',
  17: 'Control',
  18: 'Alt',
  19: 'Pause',
  20: 'CapsLock',
  27: 'Escape',
  32: ' ',
  33: 'PageUp',
  34: 'PageDown',
  35: 'End',
  36: 'Home',
  37: 'ArrowLeft',
  38: 'ArrowUp',
  39: 'ArrowRight',
  40: 'ArrowDown',
  45: 'Insert',
  46: 'Delete',
  112: 'F1', 113: 'F2', 114: 'F3', 115: 'F4', 116: 'F5', 117: 'F6',
  118: 'F7', 119: 'F8', 120: 'F9', 121: 'F10', 122: 'F11', 123: 'F12',
  144: 'NumLock',
  145: 'ScrollLock',
  224: 'Meta'
};

/**
 * @param {object} nativeEvent Native browser event.
 * @return {string} Normalized `key` property.
 */
function getEventKey(nativeEvent) {
  if (nativeEvent.key) {
    // Normalize inconsistent values reported by browsers due to
    // implementations of a working draft specification.

    // FireFox implements `key` but returns `MozPrintableKey` for all
    // printable characters (normalized to `Unidentified`), ignore it.
    var key = normalizeKey[nativeEvent.key] || nativeEvent.key;
    if (key !== 'Unidentified') {
      return key;
    }
  }

  // Browser does not implement `key`, polyfill as much of it as we can.
  if (nativeEvent.type === 'keypress') {
    var charCode = getEventCharCode(nativeEvent);

    // The enter-key is technically both printable and non-printable and can
    // thus be captured by `keypress`, no other non-printable key should.
    return charCode === 13 ? 'Enter' : String.fromCharCode(charCode);
  }
  if (nativeEvent.type === 'keydown' || nativeEvent.type === 'keyup') {
    // While user keyboard layout determines the actual meaning of each
    // `keyCode` value, almost all function keys have a universal value.
    return translateToKey[nativeEvent.keyCode] || 'Unidentified';
  }
  return '';
}

module.exports = getEventKey;
},{"./getEventCharCode":165}],167:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

/**
 * Translation from modifier key to the associated property in the event.
 * @see http://www.w3.org/TR/DOM-Level-3-Events/#keys-Modifiers
 */

var modifierKeyToProp = {
  'Alt': 'altKey',
  'Control': 'ctrlKey',
  'Meta': 'metaKey',
  'Shift': 'shiftKey'
};

// IE8 does not implement getModifierState so we simply map it to the only
// modifier keys exposed by the event itself, does not support Lock-keys.
// Currently, all major browsers except Chrome seems to support Lock-keys.
function modifierStateGetter(keyArg) {
  var syntheticEvent = this;
  var nativeEvent = syntheticEvent.nativeEvent;
  if (nativeEvent.getModifierState) {
    return nativeEvent.getModifierState(keyArg);
  }
  var keyProp = modifierKeyToProp[keyArg];
  return keyProp ? !!nativeEvent[keyProp] : false;
}

function getEventModifierState(nativeEvent) {
  return modifierStateGetter;
}

module.exports = getEventModifierState;
},{}],168:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

/**
 * Gets the target node from a native browser event by accounting for
 * inconsistencies in browser DOM APIs.
 *
 * @param {object} nativeEvent Native browser event.
 * @return {DOMEventTarget} Target node.
 */

function getEventTarget(nativeEvent) {
  var target = nativeEvent.target || nativeEvent.srcElement || window;

  // Normalize SVG <use> element events #4963
  if (target.correspondingUseElement) {
    target = target.correspondingUseElement;
  }

  // Safari may fire events on text nodes (Node.TEXT_NODE is 3).
  // @see http://www.quirksmode.org/js/events_properties.html
  return target.nodeType === 3 ? target.parentNode : target;
}

module.exports = getEventTarget;
},{}],169:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var ReactNodeTypes = require('./ReactNodeTypes');

function getHostComponentFromComposite(inst) {
  var type;

  while ((type = inst._renderedNodeType) === ReactNodeTypes.COMPOSITE) {
    inst = inst._renderedComponent;
  }

  if (type === ReactNodeTypes.HOST) {
    return inst._renderedComponent;
  } else if (type === ReactNodeTypes.EMPTY) {
    return null;
  }
}

module.exports = getHostComponentFromComposite;
},{"./ReactNodeTypes":126}],170:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

'use strict';

/* global Symbol */

var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

/**
 * Returns the iterator method function contained on the iterable object.
 *
 * Be sure to invoke the function with the iterable as context:
 *
 *     var iteratorFn = getIteratorFn(myIterable);
 *     if (iteratorFn) {
 *       var iterator = iteratorFn.call(myIterable);
 *       ...
 *     }
 *
 * @param {?object} maybeIterable
 * @return {?function}
 */
function getIteratorFn(maybeIterable) {
  var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
  if (typeof iteratorFn === 'function') {
    return iteratorFn;
  }
}

module.exports = getIteratorFn;
},{}],171:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

'use strict';

var nextDebugID = 1;

function getNextDebugID() {
  return nextDebugID++;
}

module.exports = getNextDebugID;
},{}],172:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

/**
 * Given any node return the first leaf node without children.
 *
 * @param {DOMElement|DOMTextNode} node
 * @return {DOMElement|DOMTextNode}
 */

function getLeafNode(node) {
  while (node && node.firstChild) {
    node = node.firstChild;
  }
  return node;
}

/**
 * Get the next sibling within a container. This will walk up the
 * DOM if a node's siblings have been exhausted.
 *
 * @param {DOMElement|DOMTextNode} node
 * @return {?DOMElement|DOMTextNode}
 */
function getSiblingNode(node) {
  while (node) {
    if (node.nextSibling) {
      return node.nextSibling;
    }
    node = node.parentNode;
  }
}

/**
 * Get object describing the nodes which contain characters at offset.
 *
 * @param {DOMElement|DOMTextNode} root
 * @param {number} offset
 * @return {?object}
 */
function getNodeForCharacterOffset(root, offset) {
  var node = getLeafNode(root);
  var nodeStart = 0;
  var nodeEnd = 0;

  while (node) {
    if (node.nodeType === 3) {
      nodeEnd = nodeStart + node.textContent.length;

      if (nodeStart <= offset && nodeEnd >= offset) {
        return {
          node: node,
          offset: offset - nodeStart
        };
      }

      nodeStart = nodeEnd;
    }

    node = getLeafNode(getSiblingNode(node));
  }
}

module.exports = getNodeForCharacterOffset;
},{}],173:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var ExecutionEnvironment = require('fbjs/lib/ExecutionEnvironment');

var contentKey = null;

/**
 * Gets the key used to access text content on a DOM node.
 *
 * @return {?string} Key used to access text content.
 * @internal
 */
function getTextContentAccessor() {
  if (!contentKey && ExecutionEnvironment.canUseDOM) {
    // Prefer textContent to innerText because many browsers support both but
    // SVG <text> elements don't support innerText even when <div> does.
    contentKey = 'textContent' in document.documentElement ? 'textContent' : 'innerText';
  }
  return contentKey;
}

module.exports = getTextContentAccessor;
},{"fbjs/lib/ExecutionEnvironment":3}],174:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var ExecutionEnvironment = require('fbjs/lib/ExecutionEnvironment');

/**
 * Generate a mapping of standard vendor prefixes using the defined style property and event name.
 *
 * @param {string} styleProp
 * @param {string} eventName
 * @returns {object}
 */
function makePrefixMap(styleProp, eventName) {
  var prefixes = {};

  prefixes[styleProp.toLowerCase()] = eventName.toLowerCase();
  prefixes['Webkit' + styleProp] = 'webkit' + eventName;
  prefixes['Moz' + styleProp] = 'moz' + eventName;
  prefixes['ms' + styleProp] = 'MS' + eventName;
  prefixes['O' + styleProp] = 'o' + eventName.toLowerCase();

  return prefixes;
}

/**
 * A list of event names to a configurable list of vendor prefixes.
 */
var vendorPrefixes = {
  animationend: makePrefixMap('Animation', 'AnimationEnd'),
  animationiteration: makePrefixMap('Animation', 'AnimationIteration'),
  animationstart: makePrefixMap('Animation', 'AnimationStart'),
  transitionend: makePrefixMap('Transition', 'TransitionEnd')
};

/**
 * Event names that have already been detected and prefixed (if applicable).
 */
var prefixedEventNames = {};

/**
 * Element to check for prefixes on.
 */
var style = {};

/**
 * Bootstrap if a DOM exists.
 */
if (ExecutionEnvironment.canUseDOM) {
  style = document.createElement('div').style;

  // On some platforms, in particular some releases of Android 4.x,
  // the un-prefixed "animation" and "transition" properties are defined on the
  // style object but the events that fire will still be prefixed, so we need
  // to check if the un-prefixed events are usable, and if not remove them from the map.
  if (!('AnimationEvent' in window)) {
    delete vendorPrefixes.animationend.animation;
    delete vendorPrefixes.animationiteration.animation;
    delete vendorPrefixes.animationstart.animation;
  }

  // Same as above
  if (!('TransitionEvent' in window)) {
    delete vendorPrefixes.transitionend.transition;
  }
}

/**
 * Attempts to determine the correct vendor prefixed event name.
 *
 * @param {string} eventName
 * @returns {string}
 */
function getVendorPrefixedEventName(eventName) {
  if (prefixedEventNames[eventName]) {
    return prefixedEventNames[eventName];
  } else if (!vendorPrefixes[eventName]) {
    return eventName;
  }

  var prefixMap = vendorPrefixes[eventName];

  for (var styleProp in prefixMap) {
    if (prefixMap.hasOwnProperty(styleProp) && styleProp in style) {
      return prefixedEventNames[eventName] = prefixMap[styleProp];
    }
  }

  return '';
}

module.exports = getVendorPrefixedEventName;
},{"fbjs/lib/ExecutionEnvironment":3}],175:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var _prodInvariant = require('./reactProdInvariant'),
    _assign = require('object-assign');

var ReactCompositeComponent = require('./ReactCompositeComponent');
var ReactEmptyComponent = require('./ReactEmptyComponent');
var ReactHostComponent = require('./ReactHostComponent');

var getNextDebugID = require('./getNextDebugID');
var invariant = require('fbjs/lib/invariant');
var warning = require('fbjs/lib/warning');

// To avoid a cyclic dependency, we create the final class in this module
var ReactCompositeComponentWrapper = function (element) {
  this.construct(element);
};
_assign(ReactCompositeComponentWrapper.prototype, ReactCompositeComponent, {
  _instantiateReactComponent: instantiateReactComponent
});

function getDeclarationErrorAddendum(owner) {
  if (owner) {
    var name = owner.getName();
    if (name) {
      return ' Check the render method of `' + name + '`.';
    }
  }
  return '';
}

/**
 * Check if the type reference is a known internal type. I.e. not a user
 * provided composite type.
 *
 * @param {function} type
 * @return {boolean} Returns true if this is a valid internal type.
 */
function isInternalComponentType(type) {
  return typeof type === 'function' && typeof type.prototype !== 'undefined' && typeof type.prototype.mountComponent === 'function' && typeof type.prototype.receiveComponent === 'function';
}

/**
 * Given a ReactNode, create an instance that will actually be mounted.
 *
 * @param {ReactNode} node
 * @param {boolean} shouldHaveDebugID
 * @return {object} A new instance of the element's constructor.
 * @protected
 */
function instantiateReactComponent(node, shouldHaveDebugID) {
  var instance;

  if (node === null || node === false) {
    instance = ReactEmptyComponent.create(instantiateReactComponent);
  } else if (typeof node === 'object') {
    var element = node;
    var type = element.type;
    if (typeof type !== 'function' && typeof type !== 'string') {
      var info = '';
      if (process.env.NODE_ENV !== 'production') {
        if (type === undefined || typeof type === 'object' && type !== null && Object.keys(type).length === 0) {
          info += ' You likely forgot to export your component from the file ' + 'it\'s defined in.';
        }
      }
      info += getDeclarationErrorAddendum(element._owner);
      !false ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s', type == null ? type : typeof type, info) : _prodInvariant('130', type == null ? type : typeof type, info) : void 0;
    }

    // Special case string values
    if (typeof element.type === 'string') {
      instance = ReactHostComponent.createInternalComponent(element);
    } else if (isInternalComponentType(element.type)) {
      // This is temporarily available for custom components that are not string
      // representations. I.e. ART. Once those are updated to use the string
      // representation, we can drop this code path.
      instance = new element.type(element);

      // We renamed this. Allow the old name for compat. :(
      if (!instance.getHostNode) {
        instance.getHostNode = instance.getNativeNode;
      }
    } else {
      instance = new ReactCompositeComponentWrapper(element);
    }
  } else if (typeof node === 'string' || typeof node === 'number') {
    instance = ReactHostComponent.createInstanceForText(node);
  } else {
    !false ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Encountered invalid React node of type %s', typeof node) : _prodInvariant('131', typeof node) : void 0;
  }

  if (process.env.NODE_ENV !== 'production') {
    process.env.NODE_ENV !== 'production' ? warning(typeof instance.mountComponent === 'function' && typeof instance.receiveComponent === 'function' && typeof instance.getHostNode === 'function' && typeof instance.unmountComponent === 'function', 'Only React Components can be mounted.') : void 0;
  }

  // These two fields are used by the DOM and ART diffing algorithms
  // respectively. Instead of using expandos on components, we should be
  // storing the state needed by the diffing algorithms elsewhere.
  instance._mountIndex = 0;
  instance._mountImage = null;

  if (process.env.NODE_ENV !== 'production') {
    instance._debugID = shouldHaveDebugID ? getNextDebugID() : 0;
  }

  // Internal instances should fully constructed at this point, so they should
  // not get any new fields added to them at this point.
  if (process.env.NODE_ENV !== 'production') {
    if (Object.preventExtensions) {
      Object.preventExtensions(instance);
    }
  }

  return instance;
}

module.exports = instantiateReactComponent;
}).call(this,require('_process'))
},{"./ReactCompositeComponent":88,"./ReactEmptyComponent":111,"./ReactHostComponent":116,"./getNextDebugID":171,"./reactProdInvariant":179,"_process":58,"fbjs/lib/invariant":17,"fbjs/lib/warning":24,"object-assign":57}],176:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var ExecutionEnvironment = require('fbjs/lib/ExecutionEnvironment');

var useHasFeature;
if (ExecutionEnvironment.canUseDOM) {
  useHasFeature = document.implementation && document.implementation.hasFeature &&
  // always returns true in newer browsers as per the standard.
  // @see http://dom.spec.whatwg.org/#dom-domimplementation-hasfeature
  document.implementation.hasFeature('', '') !== true;
}

/**
 * Checks if an event is supported in the current execution environment.
 *
 * NOTE: This will not work correctly for non-generic events such as `change`,
 * `reset`, `load`, `error`, and `select`.
 *
 * Borrows from Modernizr.
 *
 * @param {string} eventNameSuffix Event name, e.g. "click".
 * @param {?boolean} capture Check if the capture phase is supported.
 * @return {boolean} True if the event is supported.
 * @internal
 * @license Modernizr 3.0.0pre (Custom Build) | MIT
 */
function isEventSupported(eventNameSuffix, capture) {
  if (!ExecutionEnvironment.canUseDOM || capture && !('addEventListener' in document)) {
    return false;
  }

  var eventName = 'on' + eventNameSuffix;
  var isSupported = eventName in document;

  if (!isSupported) {
    var element = document.createElement('div');
    element.setAttribute(eventName, 'return;');
    isSupported = typeof element[eventName] === 'function';
  }

  if (!isSupported && useHasFeature && eventNameSuffix === 'wheel') {
    // This is the only way to test support for the `wheel` event in IE9+.
    isSupported = document.implementation.hasFeature('Events.wheel', '3.0');
  }

  return isSupported;
}

module.exports = isEventSupported;
},{"fbjs/lib/ExecutionEnvironment":3}],177:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

'use strict';

/**
 * @see http://www.whatwg.org/specs/web-apps/current-work/multipage/the-input-element.html#input-type-attr-summary
 */

var supportedInputTypes = {
  'color': true,
  'date': true,
  'datetime': true,
  'datetime-local': true,
  'email': true,
  'month': true,
  'number': true,
  'password': true,
  'range': true,
  'search': true,
  'tel': true,
  'text': true,
  'time': true,
  'url': true,
  'week': true
};

function isTextInputElement(elem) {
  var nodeName = elem && elem.nodeName && elem.nodeName.toLowerCase();

  if (nodeName === 'input') {
    return !!supportedInputTypes[elem.type];
  }

  if (nodeName === 'textarea') {
    return true;
  }

  return false;
}

module.exports = isTextInputElement;
},{}],178:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var escapeTextContentForBrowser = require('./escapeTextContentForBrowser');

/**
 * Escapes attribute value to prevent scripting attacks.
 *
 * @param {*} value Value to escape.
 * @return {string} An escaped string.
 */
function quoteAttributeValueForBrowser(value) {
  return '"' + escapeTextContentForBrowser(value) + '"';
}

module.exports = quoteAttributeValueForBrowser;
},{"./escapeTextContentForBrowser":161}],179:[function(require,module,exports){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */
'use strict';

/**
 * WARNING: DO NOT manually require this module.
 * This is a replacement for `invariant(...)` used by the error code system
 * and will _only_ be required by the corresponding babel pass.
 * It always throws.
 */

function reactProdInvariant(code) {
  var argCount = arguments.length - 1;

  var message = 'Minified React error #' + code + '; visit ' + 'http://facebook.github.io/react/docs/error-decoder.html?invariant=' + code;

  for (var argIdx = 0; argIdx < argCount; argIdx++) {
    message += '&args[]=' + encodeURIComponent(arguments[argIdx + 1]);
  }

  message += ' for the full message or use the non-minified dev environment' + ' for full errors and additional helpful warnings.';

  var error = new Error(message);
  error.name = 'Invariant Violation';
  error.framesToPop = 1; // we don't care about reactProdInvariant's own frame

  throw error;
}

module.exports = reactProdInvariant;
},{}],180:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var ReactMount = require('./ReactMount');

module.exports = ReactMount.renderSubtreeIntoContainer;
},{"./ReactMount":124}],181:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var ExecutionEnvironment = require('fbjs/lib/ExecutionEnvironment');
var DOMNamespaces = require('./DOMNamespaces');

var WHITESPACE_TEST = /^[ \r\n\t\f]/;
var NONVISIBLE_TEST = /<(!--|link|noscript|meta|script|style)[ \r\n\t\f\/>]/;

var createMicrosoftUnsafeLocalFunction = require('./createMicrosoftUnsafeLocalFunction');

// SVG temp container for IE lacking innerHTML
var reusableSVGContainer;

/**
 * Set the innerHTML property of a node, ensuring that whitespace is preserved
 * even in IE8.
 *
 * @param {DOMElement} node
 * @param {string} html
 * @internal
 */
var setInnerHTML = createMicrosoftUnsafeLocalFunction(function (node, html) {
  // IE does not have innerHTML for SVG nodes, so instead we inject the
  // new markup in a temp node and then move the child nodes across into
  // the target node
  if (node.namespaceURI === DOMNamespaces.svg && !('innerHTML' in node)) {
    reusableSVGContainer = reusableSVGContainer || document.createElement('div');
    reusableSVGContainer.innerHTML = '<svg>' + html + '</svg>';
    var svgNode = reusableSVGContainer.firstChild;
    while (svgNode.firstChild) {
      node.appendChild(svgNode.firstChild);
    }
  } else {
    node.innerHTML = html;
  }
});

if (ExecutionEnvironment.canUseDOM) {
  // IE8: When updating a just created node with innerHTML only leading
  // whitespace is removed. When updating an existing node with innerHTML
  // whitespace in root TextNodes is also collapsed.
  // @see quirksmode.org/bugreports/archives/2004/11/innerhtml_and_t.html

  // Feature detection; only IE8 is known to behave improperly like this.
  var testElement = document.createElement('div');
  testElement.innerHTML = ' ';
  if (testElement.innerHTML === '') {
    setInnerHTML = function (node, html) {
      // Magic theory: IE8 supposedly differentiates between added and updated
      // nodes when processing innerHTML, innerHTML on updated nodes suffers
      // from worse whitespace behavior. Re-adding a node like this triggers
      // the initial and more favorable whitespace behavior.
      // TODO: What to do on a detached node?
      if (node.parentNode) {
        node.parentNode.replaceChild(node, node);
      }

      // We also implement a workaround for non-visible tags disappearing into
      // thin air on IE8, this only happens if there is no visible text
      // in-front of the non-visible tags. Piggyback on the whitespace fix
      // and simply check if any non-visible tags appear in the source.
      if (WHITESPACE_TEST.test(html) || html[0] === '<' && NONVISIBLE_TEST.test(html)) {
        // Recover leading whitespace by temporarily prepending any character.
        // \uFEFF has the potential advantage of being zero-width/invisible.
        // UglifyJS drops U+FEFF chars when parsing, so use String.fromCharCode
        // in hopes that this is preserved even if "\uFEFF" is transformed to
        // the actual Unicode character (by Babel, for example).
        // https://github.com/mishoo/UglifyJS2/blob/v2.4.20/lib/parse.js#L216
        node.innerHTML = String.fromCharCode(0xFEFF) + html;

        // deleteData leaves an empty `TextNode` which offsets the index of all
        // children. Definitely want to avoid this.
        var textNode = node.firstChild;
        if (textNode.data.length === 1) {
          node.removeChild(textNode);
        } else {
          textNode.deleteData(0, 1);
        }
      } else {
        node.innerHTML = html;
      }
    };
  }
  testElement = null;
}

module.exports = setInnerHTML;
},{"./DOMNamespaces":69,"./createMicrosoftUnsafeLocalFunction":159,"fbjs/lib/ExecutionEnvironment":3}],182:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var ExecutionEnvironment = require('fbjs/lib/ExecutionEnvironment');
var escapeTextContentForBrowser = require('./escapeTextContentForBrowser');
var setInnerHTML = require('./setInnerHTML');

/**
 * Set the textContent property of a node, ensuring that whitespace is preserved
 * even in IE8. innerText is a poor substitute for textContent and, among many
 * issues, inserts <br> instead of the literal newline chars. innerHTML behaves
 * as it should.
 *
 * @param {DOMElement} node
 * @param {string} text
 * @internal
 */
var setTextContent = function (node, text) {
  if (text) {
    var firstChild = node.firstChild;

    if (firstChild && firstChild === node.lastChild && firstChild.nodeType === 3) {
      firstChild.nodeValue = text;
      return;
    }
  }
  node.textContent = text;
};

if (ExecutionEnvironment.canUseDOM) {
  if (!('textContent' in document.documentElement)) {
    setTextContent = function (node, text) {
      if (node.nodeType === 3) {
        node.nodeValue = text;
        return;
      }
      setInnerHTML(node, escapeTextContentForBrowser(text));
    };
  }
}

module.exports = setTextContent;
},{"./escapeTextContentForBrowser":161,"./setInnerHTML":181,"fbjs/lib/ExecutionEnvironment":3}],183:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

/**
 * Given a `prevElement` and `nextElement`, determines if the existing
 * instance should be updated as opposed to being destroyed or replaced by a new
 * instance. Both arguments are elements. This ensures that this logic can
 * operate on stateless trees without any backing instance.
 *
 * @param {?object} prevElement
 * @param {?object} nextElement
 * @return {boolean} True if the existing instance should be updated.
 * @protected
 */

function shouldUpdateReactComponent(prevElement, nextElement) {
  var prevEmpty = prevElement === null || prevElement === false;
  var nextEmpty = nextElement === null || nextElement === false;
  if (prevEmpty || nextEmpty) {
    return prevEmpty === nextEmpty;
  }

  var prevType = typeof prevElement;
  var nextType = typeof nextElement;
  if (prevType === 'string' || prevType === 'number') {
    return nextType === 'string' || nextType === 'number';
  } else {
    return nextType === 'object' && prevElement.type === nextElement.type && prevElement.key === nextElement.key;
  }
}

module.exports = shouldUpdateReactComponent;
},{}],184:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var _prodInvariant = require('./reactProdInvariant');

var ReactCurrentOwner = require('react/lib/ReactCurrentOwner');
var REACT_ELEMENT_TYPE = require('./ReactElementSymbol');

var getIteratorFn = require('./getIteratorFn');
var invariant = require('fbjs/lib/invariant');
var KeyEscapeUtils = require('./KeyEscapeUtils');
var warning = require('fbjs/lib/warning');

var SEPARATOR = '.';
var SUBSEPARATOR = ':';

/**
 * This is inlined from ReactElement since this file is shared between
 * isomorphic and renderers. We could extract this to a
 *
 */

/**
 * TODO: Test that a single child and an array with one item have the same key
 * pattern.
 */

var didWarnAboutMaps = false;

/**
 * Generate a key string that identifies a component within a set.
 *
 * @param {*} component A component that could contain a manual key.
 * @param {number} index Index that is used if a manual key is not provided.
 * @return {string}
 */
function getComponentKey(component, index) {
  // Do some typechecking here since we call this blindly. We want to ensure
  // that we don't block potential future ES APIs.
  if (component && typeof component === 'object' && component.key != null) {
    // Explicit key
    return KeyEscapeUtils.escape(component.key);
  }
  // Implicit key determined by the index in the set
  return index.toString(36);
}

/**
 * @param {?*} children Children tree container.
 * @param {!string} nameSoFar Name of the key path so far.
 * @param {!function} callback Callback to invoke with each child found.
 * @param {?*} traverseContext Used to pass information throughout the traversal
 * process.
 * @return {!number} The number of children in this subtree.
 */
function traverseAllChildrenImpl(children, nameSoFar, callback, traverseContext) {
  var type = typeof children;

  if (type === 'undefined' || type === 'boolean') {
    // All of the above are perceived as null.
    children = null;
  }

  if (children === null || type === 'string' || type === 'number' ||
  // The following is inlined from ReactElement. This means we can optimize
  // some checks. React Fiber also inlines this logic for similar purposes.
  type === 'object' && children.$$typeof === REACT_ELEMENT_TYPE) {
    callback(traverseContext, children,
    // If it's the only child, treat the name as if it was wrapped in an array
    // so that it's consistent if the number of children grows.
    nameSoFar === '' ? SEPARATOR + getComponentKey(children, 0) : nameSoFar);
    return 1;
  }

  var child;
  var nextName;
  var subtreeCount = 0; // Count of children found in the current subtree.
  var nextNamePrefix = nameSoFar === '' ? SEPARATOR : nameSoFar + SUBSEPARATOR;

  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      child = children[i];
      nextName = nextNamePrefix + getComponentKey(child, i);
      subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
    }
  } else {
    var iteratorFn = getIteratorFn(children);
    if (iteratorFn) {
      var iterator = iteratorFn.call(children);
      var step;
      if (iteratorFn !== children.entries) {
        var ii = 0;
        while (!(step = iterator.next()).done) {
          child = step.value;
          nextName = nextNamePrefix + getComponentKey(child, ii++);
          subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
        }
      } else {
        if (process.env.NODE_ENV !== 'production') {
          var mapsAsChildrenAddendum = '';
          if (ReactCurrentOwner.current) {
            var mapsAsChildrenOwnerName = ReactCurrentOwner.current.getName();
            if (mapsAsChildrenOwnerName) {
              mapsAsChildrenAddendum = ' Check the render method of `' + mapsAsChildrenOwnerName + '`.';
            }
          }
          process.env.NODE_ENV !== 'production' ? warning(didWarnAboutMaps, 'Using Maps as children is not yet fully supported. It is an ' + 'experimental feature that might be removed. Convert it to a ' + 'sequence / iterable of keyed ReactElements instead.%s', mapsAsChildrenAddendum) : void 0;
          didWarnAboutMaps = true;
        }
        // Iterator will provide entry [k,v] tuples rather than values.
        while (!(step = iterator.next()).done) {
          var entry = step.value;
          if (entry) {
            child = entry[1];
            nextName = nextNamePrefix + KeyEscapeUtils.escape(entry[0]) + SUBSEPARATOR + getComponentKey(child, 0);
            subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
          }
        }
      }
    } else if (type === 'object') {
      var addendum = '';
      if (process.env.NODE_ENV !== 'production') {
        addendum = ' If you meant to render a collection of children, use an array ' + 'instead or wrap the object using createFragment(object) from the ' + 'React add-ons.';
        if (children._isReactElement) {
          addendum = ' It looks like you\'re using an element created by a different ' + 'version of React. Make sure to use only one copy of React.';
        }
        if (ReactCurrentOwner.current) {
          var name = ReactCurrentOwner.current.getName();
          if (name) {
            addendum += ' Check the render method of `' + name + '`.';
          }
        }
      }
      var childrenString = String(children);
      !false ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Objects are not valid as a React child (found: %s).%s', childrenString === '[object Object]' ? 'object with keys {' + Object.keys(children).join(', ') + '}' : childrenString, addendum) : _prodInvariant('31', childrenString === '[object Object]' ? 'object with keys {' + Object.keys(children).join(', ') + '}' : childrenString, addendum) : void 0;
    }
  }

  return subtreeCount;
}

/**
 * Traverses children that are typically specified as `props.children`, but
 * might also be specified through attributes:
 *
 * - `traverseAllChildren(this.props.children, ...)`
 * - `traverseAllChildren(this.props.leftPanelChildren, ...)`
 *
 * The `traverseContext` is an optional argument that is passed through the
 * entire traversal. It can be used to store accumulations or anything else that
 * the callback might find relevant.
 *
 * @param {?*} children Children tree object.
 * @param {!function} callback To invoke upon traversing each child.
 * @param {?*} traverseContext Context for traversal.
 * @return {!number} The number of children in this subtree.
 */
function traverseAllChildren(children, callback, traverseContext) {
  if (children == null) {
    return 0;
  }

  return traverseAllChildrenImpl(children, '', callback, traverseContext);
}

module.exports = traverseAllChildren;
}).call(this,require('_process'))
},{"./KeyEscapeUtils":81,"./ReactElementSymbol":110,"./getIteratorFn":170,"./reactProdInvariant":179,"_process":58,"fbjs/lib/invariant":17,"fbjs/lib/warning":24,"react/lib/ReactCurrentOwner":193}],185:[function(require,module,exports){
(function (process){
/**
 * Copyright 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var _assign = require('object-assign');

var emptyFunction = require('fbjs/lib/emptyFunction');
var warning = require('fbjs/lib/warning');

var validateDOMNesting = emptyFunction;

if (process.env.NODE_ENV !== 'production') {
  // This validation code was written based on the HTML5 parsing spec:
  // https://html.spec.whatwg.org/multipage/syntax.html#has-an-element-in-scope
  //
  // Note: this does not catch all invalid nesting, nor does it try to (as it's
  // not clear what practical benefit doing so provides); instead, we warn only
  // for cases where the parser will give a parse tree differing from what React
  // intended. For example, <b><div></div></b> is invalid but we don't warn
  // because it still parses correctly; we do warn for other cases like nested
  // <p> tags where the beginning of the second element implicitly closes the
  // first, causing a confusing mess.

  // https://html.spec.whatwg.org/multipage/syntax.html#special
  var specialTags = ['address', 'applet', 'area', 'article', 'aside', 'base', 'basefont', 'bgsound', 'blockquote', 'body', 'br', 'button', 'caption', 'center', 'col', 'colgroup', 'dd', 'details', 'dir', 'div', 'dl', 'dt', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'frame', 'frameset', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'iframe', 'img', 'input', 'isindex', 'li', 'link', 'listing', 'main', 'marquee', 'menu', 'menuitem', 'meta', 'nav', 'noembed', 'noframes', 'noscript', 'object', 'ol', 'p', 'param', 'plaintext', 'pre', 'script', 'section', 'select', 'source', 'style', 'summary', 'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th', 'thead', 'title', 'tr', 'track', 'ul', 'wbr', 'xmp'];

  // https://html.spec.whatwg.org/multipage/syntax.html#has-an-element-in-scope
  var inScopeTags = ['applet', 'caption', 'html', 'table', 'td', 'th', 'marquee', 'object', 'template',

  // https://html.spec.whatwg.org/multipage/syntax.html#html-integration-point
  // TODO: Distinguish by namespace here -- for <title>, including it here
  // errs on the side of fewer warnings
  'foreignObject', 'desc', 'title'];

  // https://html.spec.whatwg.org/multipage/syntax.html#has-an-element-in-button-scope
  var buttonScopeTags = inScopeTags.concat(['button']);

  // https://html.spec.whatwg.org/multipage/syntax.html#generate-implied-end-tags
  var impliedEndTags = ['dd', 'dt', 'li', 'option', 'optgroup', 'p', 'rp', 'rt'];

  var emptyAncestorInfo = {
    current: null,

    formTag: null,
    aTagInScope: null,
    buttonTagInScope: null,
    nobrTagInScope: null,
    pTagInButtonScope: null,

    listItemTagAutoclosing: null,
    dlItemTagAutoclosing: null
  };

  var updatedAncestorInfo = function (oldInfo, tag, instance) {
    var ancestorInfo = _assign({}, oldInfo || emptyAncestorInfo);
    var info = { tag: tag, instance: instance };

    if (inScopeTags.indexOf(tag) !== -1) {
      ancestorInfo.aTagInScope = null;
      ancestorInfo.buttonTagInScope = null;
      ancestorInfo.nobrTagInScope = null;
    }
    if (buttonScopeTags.indexOf(tag) !== -1) {
      ancestorInfo.pTagInButtonScope = null;
    }

    // See rules for 'li', 'dd', 'dt' start tags in
    // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-inbody
    if (specialTags.indexOf(tag) !== -1 && tag !== 'address' && tag !== 'div' && tag !== 'p') {
      ancestorInfo.listItemTagAutoclosing = null;
      ancestorInfo.dlItemTagAutoclosing = null;
    }

    ancestorInfo.current = info;

    if (tag === 'form') {
      ancestorInfo.formTag = info;
    }
    if (tag === 'a') {
      ancestorInfo.aTagInScope = info;
    }
    if (tag === 'button') {
      ancestorInfo.buttonTagInScope = info;
    }
    if (tag === 'nobr') {
      ancestorInfo.nobrTagInScope = info;
    }
    if (tag === 'p') {
      ancestorInfo.pTagInButtonScope = info;
    }
    if (tag === 'li') {
      ancestorInfo.listItemTagAutoclosing = info;
    }
    if (tag === 'dd' || tag === 'dt') {
      ancestorInfo.dlItemTagAutoclosing = info;
    }

    return ancestorInfo;
  };

  /**
   * Returns whether
   */
  var isTagValidWithParent = function (tag, parentTag) {
    // First, let's check if we're in an unusual parsing mode...
    switch (parentTag) {
      // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-inselect
      case 'select':
        return tag === 'option' || tag === 'optgroup' || tag === '#text';
      case 'optgroup':
        return tag === 'option' || tag === '#text';
      // Strictly speaking, seeing an <option> doesn't mean we're in a <select>
      // but
      case 'option':
        return tag === '#text';

      // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-intd
      // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-incaption
      // No special behavior since these rules fall back to "in body" mode for
      // all except special table nodes which cause bad parsing behavior anyway.

      // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-intr
      case 'tr':
        return tag === 'th' || tag === 'td' || tag === 'style' || tag === 'script' || tag === 'template';

      // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-intbody
      case 'tbody':
      case 'thead':
      case 'tfoot':
        return tag === 'tr' || tag === 'style' || tag === 'script' || tag === 'template';

      // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-incolgroup
      case 'colgroup':
        return tag === 'col' || tag === 'template';

      // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-intable
      case 'table':
        return tag === 'caption' || tag === 'colgroup' || tag === 'tbody' || tag === 'tfoot' || tag === 'thead' || tag === 'style' || tag === 'script' || tag === 'template';

      // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-inhead
      case 'head':
        return tag === 'base' || tag === 'basefont' || tag === 'bgsound' || tag === 'link' || tag === 'meta' || tag === 'title' || tag === 'noscript' || tag === 'noframes' || tag === 'style' || tag === 'script' || tag === 'template';

      // https://html.spec.whatwg.org/multipage/semantics.html#the-html-element
      case 'html':
        return tag === 'head' || tag === 'body';
      case '#document':
        return tag === 'html';
    }

    // Probably in the "in body" parsing mode, so we outlaw only tag combos
    // where the parsing rules cause implicit opens or closes to be added.
    // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-inbody
    switch (tag) {
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6':
        return parentTag !== 'h1' && parentTag !== 'h2' && parentTag !== 'h3' && parentTag !== 'h4' && parentTag !== 'h5' && parentTag !== 'h6';

      case 'rp':
      case 'rt':
        return impliedEndTags.indexOf(parentTag) === -1;

      case 'body':
      case 'caption':
      case 'col':
      case 'colgroup':
      case 'frame':
      case 'head':
      case 'html':
      case 'tbody':
      case 'td':
      case 'tfoot':
      case 'th':
      case 'thead':
      case 'tr':
        // These tags are only valid with a few parents that have special child
        // parsing rules -- if we're down here, then none of those matched and
        // so we allow it only if we don't know what the parent is, as all other
        // cases are invalid.
        return parentTag == null;
    }

    return true;
  };

  /**
   * Returns whether
   */
  var findInvalidAncestorForTag = function (tag, ancestorInfo) {
    switch (tag) {
      case 'address':
      case 'article':
      case 'aside':
      case 'blockquote':
      case 'center':
      case 'details':
      case 'dialog':
      case 'dir':
      case 'div':
      case 'dl':
      case 'fieldset':
      case 'figcaption':
      case 'figure':
      case 'footer':
      case 'header':
      case 'hgroup':
      case 'main':
      case 'menu':
      case 'nav':
      case 'ol':
      case 'p':
      case 'section':
      case 'summary':
      case 'ul':

      case 'pre':
      case 'listing':

      case 'table':

      case 'hr':

      case 'xmp':

      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6':
        return ancestorInfo.pTagInButtonScope;

      case 'form':
        return ancestorInfo.formTag || ancestorInfo.pTagInButtonScope;

      case 'li':
        return ancestorInfo.listItemTagAutoclosing;

      case 'dd':
      case 'dt':
        return ancestorInfo.dlItemTagAutoclosing;

      case 'button':
        return ancestorInfo.buttonTagInScope;

      case 'a':
        // Spec says something about storing a list of markers, but it sounds
        // equivalent to this check.
        return ancestorInfo.aTagInScope;

      case 'nobr':
        return ancestorInfo.nobrTagInScope;
    }

    return null;
  };

  /**
   * Given a ReactCompositeComponent instance, return a list of its recursive
   * owners, starting at the root and ending with the instance itself.
   */
  var findOwnerStack = function (instance) {
    if (!instance) {
      return [];
    }

    var stack = [];
    do {
      stack.push(instance);
    } while (instance = instance._currentElement._owner);
    stack.reverse();
    return stack;
  };

  var didWarn = {};

  validateDOMNesting = function (childTag, childText, childInstance, ancestorInfo) {
    ancestorInfo = ancestorInfo || emptyAncestorInfo;
    var parentInfo = ancestorInfo.current;
    var parentTag = parentInfo && parentInfo.tag;

    if (childText != null) {
      process.env.NODE_ENV !== 'production' ? warning(childTag == null, 'validateDOMNesting: when childText is passed, childTag should be null') : void 0;
      childTag = '#text';
    }

    var invalidParent = isTagValidWithParent(childTag, parentTag) ? null : parentInfo;
    var invalidAncestor = invalidParent ? null : findInvalidAncestorForTag(childTag, ancestorInfo);
    var problematic = invalidParent || invalidAncestor;

    if (problematic) {
      var ancestorTag = problematic.tag;
      var ancestorInstance = problematic.instance;

      var childOwner = childInstance && childInstance._currentElement._owner;
      var ancestorOwner = ancestorInstance && ancestorInstance._currentElement._owner;

      var childOwners = findOwnerStack(childOwner);
      var ancestorOwners = findOwnerStack(ancestorOwner);

      var minStackLen = Math.min(childOwners.length, ancestorOwners.length);
      var i;

      var deepestCommon = -1;
      for (i = 0; i < minStackLen; i++) {
        if (childOwners[i] === ancestorOwners[i]) {
          deepestCommon = i;
        } else {
          break;
        }
      }

      var UNKNOWN = '(unknown)';
      var childOwnerNames = childOwners.slice(deepestCommon + 1).map(function (inst) {
        return inst.getName() || UNKNOWN;
      });
      var ancestorOwnerNames = ancestorOwners.slice(deepestCommon + 1).map(function (inst) {
        return inst.getName() || UNKNOWN;
      });
      var ownerInfo = [].concat(
      // If the parent and child instances have a common owner ancestor, start
      // with that -- otherwise we just start with the parent's owners.
      deepestCommon !== -1 ? childOwners[deepestCommon].getName() || UNKNOWN : [], ancestorOwnerNames, ancestorTag,
      // If we're warning about an invalid (non-parent) ancestry, add '...'
      invalidAncestor ? ['...'] : [], childOwnerNames, childTag).join(' > ');

      var warnKey = !!invalidParent + '|' + childTag + '|' + ancestorTag + '|' + ownerInfo;
      if (didWarn[warnKey]) {
        return;
      }
      didWarn[warnKey] = true;

      var tagDisplayName = childTag;
      var whitespaceInfo = '';
      if (childTag === '#text') {
        if (/\S/.test(childText)) {
          tagDisplayName = 'Text nodes';
        } else {
          tagDisplayName = 'Whitespace text nodes';
          whitespaceInfo = ' Make sure you don\'t have any extra whitespace between tags on ' + 'each line of your source code.';
        }
      } else {
        tagDisplayName = '<' + childTag + '>';
      }

      if (invalidParent) {
        var info = '';
        if (ancestorTag === 'table' && childTag === 'tr') {
          info += ' Add a <tbody> to your code to match the DOM tree generated by ' + 'the browser.';
        }
        process.env.NODE_ENV !== 'production' ? warning(false, 'validateDOMNesting(...): %s cannot appear as a child of <%s>.%s ' + 'See %s.%s', tagDisplayName, ancestorTag, whitespaceInfo, ownerInfo, info) : void 0;
      } else {
        process.env.NODE_ENV !== 'production' ? warning(false, 'validateDOMNesting(...): %s cannot appear as a descendant of ' + '<%s>. See %s.', tagDisplayName, ancestorTag, ownerInfo) : void 0;
      }
    }
  };

  validateDOMNesting.updatedAncestorInfo = updatedAncestorInfo;

  // For testing
  validateDOMNesting.isTagValidInContext = function (tag, ancestorInfo) {
    ancestorInfo = ancestorInfo || emptyAncestorInfo;
    var parentInfo = ancestorInfo.current;
    var parentTag = parentInfo && parentInfo.tag;
    return isTagValidWithParent(tag, parentTag) && !findInvalidAncestorForTag(tag, ancestorInfo);
  };
}

module.exports = validateDOMNesting;
}).call(this,require('_process'))
},{"_process":58,"fbjs/lib/emptyFunction":9,"fbjs/lib/warning":24,"object-assign":57}],186:[function(require,module,exports){
arguments[4][81][0].apply(exports,arguments)
},{"dup":81}],187:[function(require,module,exports){
arguments[4][83][0].apply(exports,arguments)
},{"./reactProdInvariant":208,"_process":58,"dup":83,"fbjs/lib/invariant":17}],188:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var _assign = require('object-assign');

var ReactChildren = require('./ReactChildren');
var ReactComponent = require('./ReactComponent');
var ReactPureComponent = require('./ReactPureComponent');
var ReactClass = require('./ReactClass');
var ReactDOMFactories = require('./ReactDOMFactories');
var ReactElement = require('./ReactElement');
var ReactPropTypes = require('./ReactPropTypes');
var ReactVersion = require('./ReactVersion');

var onlyChild = require('./onlyChild');
var warning = require('fbjs/lib/warning');

var createElement = ReactElement.createElement;
var createFactory = ReactElement.createFactory;
var cloneElement = ReactElement.cloneElement;

if (process.env.NODE_ENV !== 'production') {
  var ReactElementValidator = require('./ReactElementValidator');
  createElement = ReactElementValidator.createElement;
  createFactory = ReactElementValidator.createFactory;
  cloneElement = ReactElementValidator.cloneElement;
}

var __spread = _assign;

if (process.env.NODE_ENV !== 'production') {
  var warned = false;
  __spread = function () {
    process.env.NODE_ENV !== 'production' ? warning(warned, 'React.__spread is deprecated and should not be used. Use ' + 'Object.assign directly or another helper function with similar ' + 'semantics. You may be seeing this warning due to your compiler. ' + 'See https://fb.me/react-spread-deprecation for more details.') : void 0;
    warned = true;
    return _assign.apply(null, arguments);
  };
}

var React = {

  // Modern

  Children: {
    map: ReactChildren.map,
    forEach: ReactChildren.forEach,
    count: ReactChildren.count,
    toArray: ReactChildren.toArray,
    only: onlyChild
  },

  Component: ReactComponent,
  PureComponent: ReactPureComponent,

  createElement: createElement,
  cloneElement: cloneElement,
  isValidElement: ReactElement.isValidElement,

  // Classic

  PropTypes: ReactPropTypes,
  createClass: ReactClass.createClass,
  createFactory: createFactory,
  createMixin: function (mixin) {
    // Currently a noop. Will be used to validate and trace mixins.
    return mixin;
  },

  // This looks DOM specific but these are actually isomorphic helpers
  // since they are just generating DOM strings.
  DOM: ReactDOMFactories,

  version: ReactVersion,

  // Deprecated hook for JSX spread, don't use this for anything.
  __spread: __spread
};

module.exports = React;
}).call(this,require('_process'))
},{"./ReactChildren":189,"./ReactClass":190,"./ReactComponent":191,"./ReactDOMFactories":194,"./ReactElement":195,"./ReactElementValidator":197,"./ReactPropTypes":200,"./ReactPureComponent":202,"./ReactVersion":203,"./onlyChild":207,"_process":58,"fbjs/lib/warning":24,"object-assign":57}],189:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var PooledClass = require('./PooledClass');
var ReactElement = require('./ReactElement');

var emptyFunction = require('fbjs/lib/emptyFunction');
var traverseAllChildren = require('./traverseAllChildren');

var twoArgumentPooler = PooledClass.twoArgumentPooler;
var fourArgumentPooler = PooledClass.fourArgumentPooler;

var userProvidedKeyEscapeRegex = /\/+/g;
function escapeUserProvidedKey(text) {
  return ('' + text).replace(userProvidedKeyEscapeRegex, '$&/');
}

/**
 * PooledClass representing the bookkeeping associated with performing a child
 * traversal. Allows avoiding binding callbacks.
 *
 * @constructor ForEachBookKeeping
 * @param {!function} forEachFunction Function to perform traversal with.
 * @param {?*} forEachContext Context to perform context with.
 */
function ForEachBookKeeping(forEachFunction, forEachContext) {
  this.func = forEachFunction;
  this.context = forEachContext;
  this.count = 0;
}
ForEachBookKeeping.prototype.destructor = function () {
  this.func = null;
  this.context = null;
  this.count = 0;
};
PooledClass.addPoolingTo(ForEachBookKeeping, twoArgumentPooler);

function forEachSingleChild(bookKeeping, child, name) {
  var func = bookKeeping.func,
      context = bookKeeping.context;

  func.call(context, child, bookKeeping.count++);
}

/**
 * Iterates through children that are typically specified as `props.children`.
 *
 * See https://facebook.github.io/react/docs/top-level-api.html#react.children.foreach
 *
 * The provided forEachFunc(child, index) will be called for each
 * leaf child.
 *
 * @param {?*} children Children tree container.
 * @param {function(*, int)} forEachFunc
 * @param {*} forEachContext Context for forEachContext.
 */
function forEachChildren(children, forEachFunc, forEachContext) {
  if (children == null) {
    return children;
  }
  var traverseContext = ForEachBookKeeping.getPooled(forEachFunc, forEachContext);
  traverseAllChildren(children, forEachSingleChild, traverseContext);
  ForEachBookKeeping.release(traverseContext);
}

/**
 * PooledClass representing the bookkeeping associated with performing a child
 * mapping. Allows avoiding binding callbacks.
 *
 * @constructor MapBookKeeping
 * @param {!*} mapResult Object containing the ordered map of results.
 * @param {!function} mapFunction Function to perform mapping with.
 * @param {?*} mapContext Context to perform mapping with.
 */
function MapBookKeeping(mapResult, keyPrefix, mapFunction, mapContext) {
  this.result = mapResult;
  this.keyPrefix = keyPrefix;
  this.func = mapFunction;
  this.context = mapContext;
  this.count = 0;
}
MapBookKeeping.prototype.destructor = function () {
  this.result = null;
  this.keyPrefix = null;
  this.func = null;
  this.context = null;
  this.count = 0;
};
PooledClass.addPoolingTo(MapBookKeeping, fourArgumentPooler);

function mapSingleChildIntoContext(bookKeeping, child, childKey) {
  var result = bookKeeping.result,
      keyPrefix = bookKeeping.keyPrefix,
      func = bookKeeping.func,
      context = bookKeeping.context;


  var mappedChild = func.call(context, child, bookKeeping.count++);
  if (Array.isArray(mappedChild)) {
    mapIntoWithKeyPrefixInternal(mappedChild, result, childKey, emptyFunction.thatReturnsArgument);
  } else if (mappedChild != null) {
    if (ReactElement.isValidElement(mappedChild)) {
      mappedChild = ReactElement.cloneAndReplaceKey(mappedChild,
      // Keep both the (mapped) and old keys if they differ, just as
      // traverseAllChildren used to do for objects as children
      keyPrefix + (mappedChild.key && (!child || child.key !== mappedChild.key) ? escapeUserProvidedKey(mappedChild.key) + '/' : '') + childKey);
    }
    result.push(mappedChild);
  }
}

function mapIntoWithKeyPrefixInternal(children, array, prefix, func, context) {
  var escapedPrefix = '';
  if (prefix != null) {
    escapedPrefix = escapeUserProvidedKey(prefix) + '/';
  }
  var traverseContext = MapBookKeeping.getPooled(array, escapedPrefix, func, context);
  traverseAllChildren(children, mapSingleChildIntoContext, traverseContext);
  MapBookKeeping.release(traverseContext);
}

/**
 * Maps children that are typically specified as `props.children`.
 *
 * See https://facebook.github.io/react/docs/top-level-api.html#react.children.map
 *
 * The provided mapFunction(child, key, index) will be called for each
 * leaf child.
 *
 * @param {?*} children Children tree container.
 * @param {function(*, int)} func The map function.
 * @param {*} context Context for mapFunction.
 * @return {object} Object containing the ordered map of results.
 */
function mapChildren(children, func, context) {
  if (children == null) {
    return children;
  }
  var result = [];
  mapIntoWithKeyPrefixInternal(children, result, null, func, context);
  return result;
}

function forEachSingleChildDummy(traverseContext, child, name) {
  return null;
}

/**
 * Count the number of children that are typically specified as
 * `props.children`.
 *
 * See https://facebook.github.io/react/docs/top-level-api.html#react.children.count
 *
 * @param {?*} children Children tree container.
 * @return {number} The number of children.
 */
function countChildren(children, context) {
  return traverseAllChildren(children, forEachSingleChildDummy, null);
}

/**
 * Flatten a children object (typically specified as `props.children`) and
 * return an array with appropriately re-keyed children.
 *
 * See https://facebook.github.io/react/docs/top-level-api.html#react.children.toarray
 */
function toArray(children) {
  var result = [];
  mapIntoWithKeyPrefixInternal(children, result, null, emptyFunction.thatReturnsArgument);
  return result;
}

var ReactChildren = {
  forEach: forEachChildren,
  map: mapChildren,
  mapIntoWithKeyPrefixInternal: mapIntoWithKeyPrefixInternal,
  count: countChildren,
  toArray: toArray
};

module.exports = ReactChildren;
},{"./PooledClass":187,"./ReactElement":195,"./traverseAllChildren":209,"fbjs/lib/emptyFunction":9}],190:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var _prodInvariant = require('./reactProdInvariant'),
    _assign = require('object-assign');

var ReactComponent = require('./ReactComponent');
var ReactElement = require('./ReactElement');
var ReactPropTypeLocationNames = require('./ReactPropTypeLocationNames');
var ReactNoopUpdateQueue = require('./ReactNoopUpdateQueue');

var emptyObject = require('fbjs/lib/emptyObject');
var invariant = require('fbjs/lib/invariant');
var warning = require('fbjs/lib/warning');

var MIXINS_KEY = 'mixins';

// Helper function to allow the creation of anonymous functions which do not
// have .name set to the name of the variable being assigned to.
function identity(fn) {
  return fn;
}

/**
 * Policies that describe methods in `ReactClassInterface`.
 */


var injectedMixins = [];

/**
 * Composite components are higher-level components that compose other composite
 * or host components.
 *
 * To create a new type of `ReactClass`, pass a specification of
 * your new class to `React.createClass`. The only requirement of your class
 * specification is that you implement a `render` method.
 *
 *   var MyComponent = React.createClass({
 *     render: function() {
 *       return <div>Hello World</div>;
 *     }
 *   });
 *
 * The class specification supports a specific protocol of methods that have
 * special meaning (e.g. `render`). See `ReactClassInterface` for
 * more the comprehensive protocol. Any other properties and methods in the
 * class specification will be available on the prototype.
 *
 * @interface ReactClassInterface
 * @internal
 */
var ReactClassInterface = {

  /**
   * An array of Mixin objects to include when defining your component.
   *
   * @type {array}
   * @optional
   */
  mixins: 'DEFINE_MANY',

  /**
   * An object containing properties and methods that should be defined on
   * the component's constructor instead of its prototype (static methods).
   *
   * @type {object}
   * @optional
   */
  statics: 'DEFINE_MANY',

  /**
   * Definition of prop types for this component.
   *
   * @type {object}
   * @optional
   */
  propTypes: 'DEFINE_MANY',

  /**
   * Definition of context types for this component.
   *
   * @type {object}
   * @optional
   */
  contextTypes: 'DEFINE_MANY',

  /**
   * Definition of context types this component sets for its children.
   *
   * @type {object}
   * @optional
   */
  childContextTypes: 'DEFINE_MANY',

  // ==== Definition methods ====

  /**
   * Invoked when the component is mounted. Values in the mapping will be set on
   * `this.props` if that prop is not specified (i.e. using an `in` check).
   *
   * This method is invoked before `getInitialState` and therefore cannot rely
   * on `this.state` or use `this.setState`.
   *
   * @return {object}
   * @optional
   */
  getDefaultProps: 'DEFINE_MANY_MERGED',

  /**
   * Invoked once before the component is mounted. The return value will be used
   * as the initial value of `this.state`.
   *
   *   getInitialState: function() {
   *     return {
   *       isOn: false,
   *       fooBaz: new BazFoo()
   *     }
   *   }
   *
   * @return {object}
   * @optional
   */
  getInitialState: 'DEFINE_MANY_MERGED',

  /**
   * @return {object}
   * @optional
   */
  getChildContext: 'DEFINE_MANY_MERGED',

  /**
   * Uses props from `this.props` and state from `this.state` to render the
   * structure of the component.
   *
   * No guarantees are made about when or how often this method is invoked, so
   * it must not have side effects.
   *
   *   render: function() {
   *     var name = this.props.name;
   *     return <div>Hello, {name}!</div>;
   *   }
   *
   * @return {ReactComponent}
   * @nosideeffects
   * @required
   */
  render: 'DEFINE_ONCE',

  // ==== Delegate methods ====

  /**
   * Invoked when the component is initially created and about to be mounted.
   * This may have side effects, but any external subscriptions or data created
   * by this method must be cleaned up in `componentWillUnmount`.
   *
   * @optional
   */
  componentWillMount: 'DEFINE_MANY',

  /**
   * Invoked when the component has been mounted and has a DOM representation.
   * However, there is no guarantee that the DOM node is in the document.
   *
   * Use this as an opportunity to operate on the DOM when the component has
   * been mounted (initialized and rendered) for the first time.
   *
   * @param {DOMElement} rootNode DOM element representing the component.
   * @optional
   */
  componentDidMount: 'DEFINE_MANY',

  /**
   * Invoked before the component receives new props.
   *
   * Use this as an opportunity to react to a prop transition by updating the
   * state using `this.setState`. Current props are accessed via `this.props`.
   *
   *   componentWillReceiveProps: function(nextProps, nextContext) {
   *     this.setState({
   *       likesIncreasing: nextProps.likeCount > this.props.likeCount
   *     });
   *   }
   *
   * NOTE: There is no equivalent `componentWillReceiveState`. An incoming prop
   * transition may cause a state change, but the opposite is not true. If you
   * need it, you are probably looking for `componentWillUpdate`.
   *
   * @param {object} nextProps
   * @optional
   */
  componentWillReceiveProps: 'DEFINE_MANY',

  /**
   * Invoked while deciding if the component should be updated as a result of
   * receiving new props, state and/or context.
   *
   * Use this as an opportunity to `return false` when you're certain that the
   * transition to the new props/state/context will not require a component
   * update.
   *
   *   shouldComponentUpdate: function(nextProps, nextState, nextContext) {
   *     return !equal(nextProps, this.props) ||
   *       !equal(nextState, this.state) ||
   *       !equal(nextContext, this.context);
   *   }
   *
   * @param {object} nextProps
   * @param {?object} nextState
   * @param {?object} nextContext
   * @return {boolean} True if the component should update.
   * @optional
   */
  shouldComponentUpdate: 'DEFINE_ONCE',

  /**
   * Invoked when the component is about to update due to a transition from
   * `this.props`, `this.state` and `this.context` to `nextProps`, `nextState`
   * and `nextContext`.
   *
   * Use this as an opportunity to perform preparation before an update occurs.
   *
   * NOTE: You **cannot** use `this.setState()` in this method.
   *
   * @param {object} nextProps
   * @param {?object} nextState
   * @param {?object} nextContext
   * @param {ReactReconcileTransaction} transaction
   * @optional
   */
  componentWillUpdate: 'DEFINE_MANY',

  /**
   * Invoked when the component's DOM representation has been updated.
   *
   * Use this as an opportunity to operate on the DOM when the component has
   * been updated.
   *
   * @param {object} prevProps
   * @param {?object} prevState
   * @param {?object} prevContext
   * @param {DOMElement} rootNode DOM element representing the component.
   * @optional
   */
  componentDidUpdate: 'DEFINE_MANY',

  /**
   * Invoked when the component is about to be removed from its parent and have
   * its DOM representation destroyed.
   *
   * Use this as an opportunity to deallocate any external resources.
   *
   * NOTE: There is no `componentDidUnmount` since your component will have been
   * destroyed by that point.
   *
   * @optional
   */
  componentWillUnmount: 'DEFINE_MANY',

  // ==== Advanced methods ====

  /**
   * Updates the component's currently mounted DOM representation.
   *
   * By default, this implements React's rendering and reconciliation algorithm.
   * Sophisticated clients may wish to override this.
   *
   * @param {ReactReconcileTransaction} transaction
   * @internal
   * @overridable
   */
  updateComponent: 'OVERRIDE_BASE'

};

/**
 * Mapping from class specification keys to special processing functions.
 *
 * Although these are declared like instance properties in the specification
 * when defining classes using `React.createClass`, they are actually static
 * and are accessible on the constructor instead of the prototype. Despite
 * being static, they must be defined outside of the "statics" key under
 * which all other static methods are defined.
 */
var RESERVED_SPEC_KEYS = {
  displayName: function (Constructor, displayName) {
    Constructor.displayName = displayName;
  },
  mixins: function (Constructor, mixins) {
    if (mixins) {
      for (var i = 0; i < mixins.length; i++) {
        mixSpecIntoComponent(Constructor, mixins[i]);
      }
    }
  },
  childContextTypes: function (Constructor, childContextTypes) {
    if (process.env.NODE_ENV !== 'production') {
      validateTypeDef(Constructor, childContextTypes, 'childContext');
    }
    Constructor.childContextTypes = _assign({}, Constructor.childContextTypes, childContextTypes);
  },
  contextTypes: function (Constructor, contextTypes) {
    if (process.env.NODE_ENV !== 'production') {
      validateTypeDef(Constructor, contextTypes, 'context');
    }
    Constructor.contextTypes = _assign({}, Constructor.contextTypes, contextTypes);
  },
  /**
   * Special case getDefaultProps which should move into statics but requires
   * automatic merging.
   */
  getDefaultProps: function (Constructor, getDefaultProps) {
    if (Constructor.getDefaultProps) {
      Constructor.getDefaultProps = createMergedResultFunction(Constructor.getDefaultProps, getDefaultProps);
    } else {
      Constructor.getDefaultProps = getDefaultProps;
    }
  },
  propTypes: function (Constructor, propTypes) {
    if (process.env.NODE_ENV !== 'production') {
      validateTypeDef(Constructor, propTypes, 'prop');
    }
    Constructor.propTypes = _assign({}, Constructor.propTypes, propTypes);
  },
  statics: function (Constructor, statics) {
    mixStaticSpecIntoComponent(Constructor, statics);
  },
  autobind: function () {} };

function validateTypeDef(Constructor, typeDef, location) {
  for (var propName in typeDef) {
    if (typeDef.hasOwnProperty(propName)) {
      // use a warning instead of an invariant so components
      // don't show up in prod but only in __DEV__
      process.env.NODE_ENV !== 'production' ? warning(typeof typeDef[propName] === 'function', '%s: %s type `%s` is invalid; it must be a function, usually from ' + 'React.PropTypes.', Constructor.displayName || 'ReactClass', ReactPropTypeLocationNames[location], propName) : void 0;
    }
  }
}

function validateMethodOverride(isAlreadyDefined, name) {
  var specPolicy = ReactClassInterface.hasOwnProperty(name) ? ReactClassInterface[name] : null;

  // Disallow overriding of base class methods unless explicitly allowed.
  if (ReactClassMixin.hasOwnProperty(name)) {
    !(specPolicy === 'OVERRIDE_BASE') ? process.env.NODE_ENV !== 'production' ? invariant(false, 'ReactClassInterface: You are attempting to override `%s` from your class specification. Ensure that your method names do not overlap with React methods.', name) : _prodInvariant('73', name) : void 0;
  }

  // Disallow defining methods more than once unless explicitly allowed.
  if (isAlreadyDefined) {
    !(specPolicy === 'DEFINE_MANY' || specPolicy === 'DEFINE_MANY_MERGED') ? process.env.NODE_ENV !== 'production' ? invariant(false, 'ReactClassInterface: You are attempting to define `%s` on your component more than once. This conflict may be due to a mixin.', name) : _prodInvariant('74', name) : void 0;
  }
}

/**
 * Mixin helper which handles policy validation and reserved
 * specification keys when building React classes.
 */
function mixSpecIntoComponent(Constructor, spec) {
  if (!spec) {
    if (process.env.NODE_ENV !== 'production') {
      var typeofSpec = typeof spec;
      var isMixinValid = typeofSpec === 'object' && spec !== null;

      process.env.NODE_ENV !== 'production' ? warning(isMixinValid, '%s: You\'re attempting to include a mixin that is either null ' + 'or not an object. Check the mixins included by the component, ' + 'as well as any mixins they include themselves. ' + 'Expected object but got %s.', Constructor.displayName || 'ReactClass', spec === null ? null : typeofSpec) : void 0;
    }

    return;
  }

  !(typeof spec !== 'function') ? process.env.NODE_ENV !== 'production' ? invariant(false, 'ReactClass: You\'re attempting to use a component class or function as a mixin. Instead, just use a regular object.') : _prodInvariant('75') : void 0;
  !!ReactElement.isValidElement(spec) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'ReactClass: You\'re attempting to use a component as a mixin. Instead, just use a regular object.') : _prodInvariant('76') : void 0;

  var proto = Constructor.prototype;
  var autoBindPairs = proto.__reactAutoBindPairs;

  // By handling mixins before any other properties, we ensure the same
  // chaining order is applied to methods with DEFINE_MANY policy, whether
  // mixins are listed before or after these methods in the spec.
  if (spec.hasOwnProperty(MIXINS_KEY)) {
    RESERVED_SPEC_KEYS.mixins(Constructor, spec.mixins);
  }

  for (var name in spec) {
    if (!spec.hasOwnProperty(name)) {
      continue;
    }

    if (name === MIXINS_KEY) {
      // We have already handled mixins in a special case above.
      continue;
    }

    var property = spec[name];
    var isAlreadyDefined = proto.hasOwnProperty(name);
    validateMethodOverride(isAlreadyDefined, name);

    if (RESERVED_SPEC_KEYS.hasOwnProperty(name)) {
      RESERVED_SPEC_KEYS[name](Constructor, property);
    } else {
      // Setup methods on prototype:
      // The following member methods should not be automatically bound:
      // 1. Expected ReactClass methods (in the "interface").
      // 2. Overridden methods (that were mixed in).
      var isReactClassMethod = ReactClassInterface.hasOwnProperty(name);
      var isFunction = typeof property === 'function';
      var shouldAutoBind = isFunction && !isReactClassMethod && !isAlreadyDefined && spec.autobind !== false;

      if (shouldAutoBind) {
        autoBindPairs.push(name, property);
        proto[name] = property;
      } else {
        if (isAlreadyDefined) {
          var specPolicy = ReactClassInterface[name];

          // These cases should already be caught by validateMethodOverride.
          !(isReactClassMethod && (specPolicy === 'DEFINE_MANY_MERGED' || specPolicy === 'DEFINE_MANY')) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'ReactClass: Unexpected spec policy %s for key %s when mixing in component specs.', specPolicy, name) : _prodInvariant('77', specPolicy, name) : void 0;

          // For methods which are defined more than once, call the existing
          // methods before calling the new property, merging if appropriate.
          if (specPolicy === 'DEFINE_MANY_MERGED') {
            proto[name] = createMergedResultFunction(proto[name], property);
          } else if (specPolicy === 'DEFINE_MANY') {
            proto[name] = createChainedFunction(proto[name], property);
          }
        } else {
          proto[name] = property;
          if (process.env.NODE_ENV !== 'production') {
            // Add verbose displayName to the function, which helps when looking
            // at profiling tools.
            if (typeof property === 'function' && spec.displayName) {
              proto[name].displayName = spec.displayName + '_' + name;
            }
          }
        }
      }
    }
  }
}

function mixStaticSpecIntoComponent(Constructor, statics) {
  if (!statics) {
    return;
  }
  for (var name in statics) {
    var property = statics[name];
    if (!statics.hasOwnProperty(name)) {
      continue;
    }

    var isReserved = name in RESERVED_SPEC_KEYS;
    !!isReserved ? process.env.NODE_ENV !== 'production' ? invariant(false, 'ReactClass: You are attempting to define a reserved property, `%s`, that shouldn\'t be on the "statics" key. Define it as an instance property instead; it will still be accessible on the constructor.', name) : _prodInvariant('78', name) : void 0;

    var isInherited = name in Constructor;
    !!isInherited ? process.env.NODE_ENV !== 'production' ? invariant(false, 'ReactClass: You are attempting to define `%s` on your component more than once. This conflict may be due to a mixin.', name) : _prodInvariant('79', name) : void 0;
    Constructor[name] = property;
  }
}

/**
 * Merge two objects, but throw if both contain the same key.
 *
 * @param {object} one The first object, which is mutated.
 * @param {object} two The second object
 * @return {object} one after it has been mutated to contain everything in two.
 */
function mergeIntoWithNoDuplicateKeys(one, two) {
  !(one && two && typeof one === 'object' && typeof two === 'object') ? process.env.NODE_ENV !== 'production' ? invariant(false, 'mergeIntoWithNoDuplicateKeys(): Cannot merge non-objects.') : _prodInvariant('80') : void 0;

  for (var key in two) {
    if (two.hasOwnProperty(key)) {
      !(one[key] === undefined) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'mergeIntoWithNoDuplicateKeys(): Tried to merge two objects with the same key: `%s`. This conflict may be due to a mixin; in particular, this may be caused by two getInitialState() or getDefaultProps() methods returning objects with clashing keys.', key) : _prodInvariant('81', key) : void 0;
      one[key] = two[key];
    }
  }
  return one;
}

/**
 * Creates a function that invokes two functions and merges their return values.
 *
 * @param {function} one Function to invoke first.
 * @param {function} two Function to invoke second.
 * @return {function} Function that invokes the two argument functions.
 * @private
 */
function createMergedResultFunction(one, two) {
  return function mergedResult() {
    var a = one.apply(this, arguments);
    var b = two.apply(this, arguments);
    if (a == null) {
      return b;
    } else if (b == null) {
      return a;
    }
    var c = {};
    mergeIntoWithNoDuplicateKeys(c, a);
    mergeIntoWithNoDuplicateKeys(c, b);
    return c;
  };
}

/**
 * Creates a function that invokes two functions and ignores their return vales.
 *
 * @param {function} one Function to invoke first.
 * @param {function} two Function to invoke second.
 * @return {function} Function that invokes the two argument functions.
 * @private
 */
function createChainedFunction(one, two) {
  return function chainedFunction() {
    one.apply(this, arguments);
    two.apply(this, arguments);
  };
}

/**
 * Binds a method to the component.
 *
 * @param {object} component Component whose method is going to be bound.
 * @param {function} method Method to be bound.
 * @return {function} The bound method.
 */
function bindAutoBindMethod(component, method) {
  var boundMethod = method.bind(component);
  if (process.env.NODE_ENV !== 'production') {
    boundMethod.__reactBoundContext = component;
    boundMethod.__reactBoundMethod = method;
    boundMethod.__reactBoundArguments = null;
    var componentName = component.constructor.displayName;
    var _bind = boundMethod.bind;
    boundMethod.bind = function (newThis) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      // User is trying to bind() an autobound method; we effectively will
      // ignore the value of "this" that the user is trying to use, so
      // let's warn.
      if (newThis !== component && newThis !== null) {
        process.env.NODE_ENV !== 'production' ? warning(false, 'bind(): React component methods may only be bound to the ' + 'component instance. See %s', componentName) : void 0;
      } else if (!args.length) {
        process.env.NODE_ENV !== 'production' ? warning(false, 'bind(): You are binding a component method to the component. ' + 'React does this for you automatically in a high-performance ' + 'way, so you can safely remove this call. See %s', componentName) : void 0;
        return boundMethod;
      }
      var reboundMethod = _bind.apply(boundMethod, arguments);
      reboundMethod.__reactBoundContext = component;
      reboundMethod.__reactBoundMethod = method;
      reboundMethod.__reactBoundArguments = args;
      return reboundMethod;
    };
  }
  return boundMethod;
}

/**
 * Binds all auto-bound methods in a component.
 *
 * @param {object} component Component whose method is going to be bound.
 */
function bindAutoBindMethods(component) {
  var pairs = component.__reactAutoBindPairs;
  for (var i = 0; i < pairs.length; i += 2) {
    var autoBindKey = pairs[i];
    var method = pairs[i + 1];
    component[autoBindKey] = bindAutoBindMethod(component, method);
  }
}

/**
 * Add more to the ReactClass base class. These are all legacy features and
 * therefore not already part of the modern ReactComponent.
 */
var ReactClassMixin = {

  /**
   * TODO: This will be deprecated because state should always keep a consistent
   * type signature and the only use case for this, is to avoid that.
   */
  replaceState: function (newState, callback) {
    this.updater.enqueueReplaceState(this, newState);
    if (callback) {
      this.updater.enqueueCallback(this, callback, 'replaceState');
    }
  },

  /**
   * Checks whether or not this composite component is mounted.
   * @return {boolean} True if mounted, false otherwise.
   * @protected
   * @final
   */
  isMounted: function () {
    return this.updater.isMounted(this);
  }
};

var ReactClassComponent = function () {};
_assign(ReactClassComponent.prototype, ReactComponent.prototype, ReactClassMixin);

/**
 * Module for creating composite components.
 *
 * @class ReactClass
 */
var ReactClass = {

  /**
   * Creates a composite component class given a class specification.
   * See https://facebook.github.io/react/docs/top-level-api.html#react.createclass
   *
   * @param {object} spec Class specification (which must define `render`).
   * @return {function} Component constructor function.
   * @public
   */
  createClass: function (spec) {
    // To keep our warnings more understandable, we'll use a little hack here to
    // ensure that Constructor.name !== 'Constructor'. This makes sure we don't
    // unnecessarily identify a class without displayName as 'Constructor'.
    var Constructor = identity(function (props, context, updater) {
      // This constructor gets overridden by mocks. The argument is used
      // by mocks to assert on what gets mounted.

      if (process.env.NODE_ENV !== 'production') {
        process.env.NODE_ENV !== 'production' ? warning(this instanceof Constructor, 'Something is calling a React component directly. Use a factory or ' + 'JSX instead. See: https://fb.me/react-legacyfactory') : void 0;
      }

      // Wire up auto-binding
      if (this.__reactAutoBindPairs.length) {
        bindAutoBindMethods(this);
      }

      this.props = props;
      this.context = context;
      this.refs = emptyObject;
      this.updater = updater || ReactNoopUpdateQueue;

      this.state = null;

      // ReactClasses doesn't have constructors. Instead, they use the
      // getInitialState and componentWillMount methods for initialization.

      var initialState = this.getInitialState ? this.getInitialState() : null;
      if (process.env.NODE_ENV !== 'production') {
        // We allow auto-mocks to proceed as if they're returning null.
        if (initialState === undefined && this.getInitialState._isMockFunction) {
          // This is probably bad practice. Consider warning here and
          // deprecating this convenience.
          initialState = null;
        }
      }
      !(typeof initialState === 'object' && !Array.isArray(initialState)) ? process.env.NODE_ENV !== 'production' ? invariant(false, '%s.getInitialState(): must return an object or null', Constructor.displayName || 'ReactCompositeComponent') : _prodInvariant('82', Constructor.displayName || 'ReactCompositeComponent') : void 0;

      this.state = initialState;
    });
    Constructor.prototype = new ReactClassComponent();
    Constructor.prototype.constructor = Constructor;
    Constructor.prototype.__reactAutoBindPairs = [];

    injectedMixins.forEach(mixSpecIntoComponent.bind(null, Constructor));

    mixSpecIntoComponent(Constructor, spec);

    // Initialize the defaultProps property after all mixins have been merged.
    if (Constructor.getDefaultProps) {
      Constructor.defaultProps = Constructor.getDefaultProps();
    }

    if (process.env.NODE_ENV !== 'production') {
      // This is a tag to indicate that the use of these method names is ok,
      // since it's used with createClass. If it's not, then it's likely a
      // mistake so we'll warn you to use the static property, property
      // initializer or constructor respectively.
      if (Constructor.getDefaultProps) {
        Constructor.getDefaultProps.isReactClassApproved = {};
      }
      if (Constructor.prototype.getInitialState) {
        Constructor.prototype.getInitialState.isReactClassApproved = {};
      }
    }

    !Constructor.prototype.render ? process.env.NODE_ENV !== 'production' ? invariant(false, 'createClass(...): Class specification must implement a `render` method.') : _prodInvariant('83') : void 0;

    if (process.env.NODE_ENV !== 'production') {
      process.env.NODE_ENV !== 'production' ? warning(!Constructor.prototype.componentShouldUpdate, '%s has a method called ' + 'componentShouldUpdate(). Did you mean shouldComponentUpdate()? ' + 'The name is phrased as a question because the function is ' + 'expected to return a value.', spec.displayName || 'A component') : void 0;
      process.env.NODE_ENV !== 'production' ? warning(!Constructor.prototype.componentWillRecieveProps, '%s has a method called ' + 'componentWillRecieveProps(). Did you mean componentWillReceiveProps()?', spec.displayName || 'A component') : void 0;
    }

    // Reduce time spent doing lookups by setting these on the prototype.
    for (var methodName in ReactClassInterface) {
      if (!Constructor.prototype[methodName]) {
        Constructor.prototype[methodName] = null;
      }
    }

    return Constructor;
  },

  injection: {
    injectMixin: function (mixin) {
      injectedMixins.push(mixin);
    }
  }

};

module.exports = ReactClass;
}).call(this,require('_process'))
},{"./ReactComponent":191,"./ReactElement":195,"./ReactNoopUpdateQueue":198,"./ReactPropTypeLocationNames":199,"./reactProdInvariant":208,"_process":58,"fbjs/lib/emptyObject":10,"fbjs/lib/invariant":17,"fbjs/lib/warning":24,"object-assign":57}],191:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var _prodInvariant = require('./reactProdInvariant');

var ReactNoopUpdateQueue = require('./ReactNoopUpdateQueue');

var canDefineProperty = require('./canDefineProperty');
var emptyObject = require('fbjs/lib/emptyObject');
var invariant = require('fbjs/lib/invariant');
var warning = require('fbjs/lib/warning');

/**
 * Base class helpers for the updating state of a component.
 */
function ReactComponent(props, context, updater) {
  this.props = props;
  this.context = context;
  this.refs = emptyObject;
  // We initialize the default updater but the real one gets injected by the
  // renderer.
  this.updater = updater || ReactNoopUpdateQueue;
}

ReactComponent.prototype.isReactComponent = {};

/**
 * Sets a subset of the state. Always use this to mutate
 * state. You should treat `this.state` as immutable.
 *
 * There is no guarantee that `this.state` will be immediately updated, so
 * accessing `this.state` after calling this method may return the old value.
 *
 * There is no guarantee that calls to `setState` will run synchronously,
 * as they may eventually be batched together.  You can provide an optional
 * callback that will be executed when the call to setState is actually
 * completed.
 *
 * When a function is provided to setState, it will be called at some point in
 * the future (not synchronously). It will be called with the up to date
 * component arguments (state, props, context). These values can be different
 * from this.* because your function may be called after receiveProps but before
 * shouldComponentUpdate, and this new state, props, and context will not yet be
 * assigned to this.
 *
 * @param {object|function} partialState Next partial state or function to
 *        produce next partial state to be merged with current state.
 * @param {?function} callback Called after state is updated.
 * @final
 * @protected
 */
ReactComponent.prototype.setState = function (partialState, callback) {
  !(typeof partialState === 'object' || typeof partialState === 'function' || partialState == null) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'setState(...): takes an object of state variables to update or a function which returns an object of state variables.') : _prodInvariant('85') : void 0;
  this.updater.enqueueSetState(this, partialState);
  if (callback) {
    this.updater.enqueueCallback(this, callback, 'setState');
  }
};

/**
 * Forces an update. This should only be invoked when it is known with
 * certainty that we are **not** in a DOM transaction.
 *
 * You may want to call this when you know that some deeper aspect of the
 * component's state has changed but `setState` was not called.
 *
 * This will not invoke `shouldComponentUpdate`, but it will invoke
 * `componentWillUpdate` and `componentDidUpdate`.
 *
 * @param {?function} callback Called after update is complete.
 * @final
 * @protected
 */
ReactComponent.prototype.forceUpdate = function (callback) {
  this.updater.enqueueForceUpdate(this);
  if (callback) {
    this.updater.enqueueCallback(this, callback, 'forceUpdate');
  }
};

/**
 * Deprecated APIs. These APIs used to exist on classic React classes but since
 * we would like to deprecate them, we're not going to move them over to this
 * modern base class. Instead, we define a getter that warns if it's accessed.
 */
if (process.env.NODE_ENV !== 'production') {
  var deprecatedAPIs = {
    isMounted: ['isMounted', 'Instead, make sure to clean up subscriptions and pending requests in ' + 'componentWillUnmount to prevent memory leaks.'],
    replaceState: ['replaceState', 'Refactor your code to use setState instead (see ' + 'https://github.com/facebook/react/issues/3236).']
  };
  var defineDeprecationWarning = function (methodName, info) {
    if (canDefineProperty) {
      Object.defineProperty(ReactComponent.prototype, methodName, {
        get: function () {
          process.env.NODE_ENV !== 'production' ? warning(false, '%s(...) is deprecated in plain JavaScript React classes. %s', info[0], info[1]) : void 0;
          return undefined;
        }
      });
    }
  };
  for (var fnName in deprecatedAPIs) {
    if (deprecatedAPIs.hasOwnProperty(fnName)) {
      defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
    }
  }
}

module.exports = ReactComponent;
}).call(this,require('_process'))
},{"./ReactNoopUpdateQueue":198,"./canDefineProperty":204,"./reactProdInvariant":208,"_process":58,"fbjs/lib/emptyObject":10,"fbjs/lib/invariant":17,"fbjs/lib/warning":24}],192:[function(require,module,exports){
(function (process){
/**
 * Copyright 2016-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

'use strict';

var _prodInvariant = require('./reactProdInvariant');

var ReactCurrentOwner = require('./ReactCurrentOwner');

var invariant = require('fbjs/lib/invariant');
var warning = require('fbjs/lib/warning');

function isNative(fn) {
  // Based on isNative() from Lodash
  var funcToString = Function.prototype.toString;
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  var reIsNative = RegExp('^' + funcToString
  // Take an example native function source for comparison
  .call(hasOwnProperty)
  // Strip regex characters so we can use it for regex
  .replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
  // Remove hasOwnProperty from the template to make it generic
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');
  try {
    var source = funcToString.call(fn);
    return reIsNative.test(source);
  } catch (err) {
    return false;
  }
}

var canUseCollections =
// Array.from
typeof Array.from === 'function' &&
// Map
typeof Map === 'function' && isNative(Map) &&
// Map.prototype.keys
Map.prototype != null && typeof Map.prototype.keys === 'function' && isNative(Map.prototype.keys) &&
// Set
typeof Set === 'function' && isNative(Set) &&
// Set.prototype.keys
Set.prototype != null && typeof Set.prototype.keys === 'function' && isNative(Set.prototype.keys);

var setItem;
var getItem;
var removeItem;
var getItemIDs;
var addRoot;
var removeRoot;
var getRootIDs;

if (canUseCollections) {
  var itemMap = new Map();
  var rootIDSet = new Set();

  setItem = function (id, item) {
    itemMap.set(id, item);
  };
  getItem = function (id) {
    return itemMap.get(id);
  };
  removeItem = function (id) {
    itemMap['delete'](id);
  };
  getItemIDs = function () {
    return Array.from(itemMap.keys());
  };

  addRoot = function (id) {
    rootIDSet.add(id);
  };
  removeRoot = function (id) {
    rootIDSet['delete'](id);
  };
  getRootIDs = function () {
    return Array.from(rootIDSet.keys());
  };
} else {
  var itemByKey = {};
  var rootByKey = {};

  // Use non-numeric keys to prevent V8 performance issues:
  // https://github.com/facebook/react/pull/7232
  var getKeyFromID = function (id) {
    return '.' + id;
  };
  var getIDFromKey = function (key) {
    return parseInt(key.substr(1), 10);
  };

  setItem = function (id, item) {
    var key = getKeyFromID(id);
    itemByKey[key] = item;
  };
  getItem = function (id) {
    var key = getKeyFromID(id);
    return itemByKey[key];
  };
  removeItem = function (id) {
    var key = getKeyFromID(id);
    delete itemByKey[key];
  };
  getItemIDs = function () {
    return Object.keys(itemByKey).map(getIDFromKey);
  };

  addRoot = function (id) {
    var key = getKeyFromID(id);
    rootByKey[key] = true;
  };
  removeRoot = function (id) {
    var key = getKeyFromID(id);
    delete rootByKey[key];
  };
  getRootIDs = function () {
    return Object.keys(rootByKey).map(getIDFromKey);
  };
}

var unmountedIDs = [];

function purgeDeep(id) {
  var item = getItem(id);
  if (item) {
    var childIDs = item.childIDs;

    removeItem(id);
    childIDs.forEach(purgeDeep);
  }
}

function describeComponentFrame(name, source, ownerName) {
  return '\n    in ' + (name || 'Unknown') + (source ? ' (at ' + source.fileName.replace(/^.*[\\\/]/, '') + ':' + source.lineNumber + ')' : ownerName ? ' (created by ' + ownerName + ')' : '');
}

function getDisplayName(element) {
  if (element == null) {
    return '#empty';
  } else if (typeof element === 'string' || typeof element === 'number') {
    return '#text';
  } else if (typeof element.type === 'string') {
    return element.type;
  } else {
    return element.type.displayName || element.type.name || 'Unknown';
  }
}

function describeID(id) {
  var name = ReactComponentTreeHook.getDisplayName(id);
  var element = ReactComponentTreeHook.getElement(id);
  var ownerID = ReactComponentTreeHook.getOwnerID(id);
  var ownerName;
  if (ownerID) {
    ownerName = ReactComponentTreeHook.getDisplayName(ownerID);
  }
  process.env.NODE_ENV !== 'production' ? warning(element, 'ReactComponentTreeHook: Missing React element for debugID %s when ' + 'building stack', id) : void 0;
  return describeComponentFrame(name, element && element._source, ownerName);
}

var ReactComponentTreeHook = {
  onSetChildren: function (id, nextChildIDs) {
    var item = getItem(id);
    !item ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Item must have been set') : _prodInvariant('144') : void 0;
    item.childIDs = nextChildIDs;

    for (var i = 0; i < nextChildIDs.length; i++) {
      var nextChildID = nextChildIDs[i];
      var nextChild = getItem(nextChildID);
      !nextChild ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Expected hook events to fire for the child before its parent includes it in onSetChildren().') : _prodInvariant('140') : void 0;
      !(nextChild.childIDs != null || typeof nextChild.element !== 'object' || nextChild.element == null) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Expected onSetChildren() to fire for a container child before its parent includes it in onSetChildren().') : _prodInvariant('141') : void 0;
      !nextChild.isMounted ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Expected onMountComponent() to fire for the child before its parent includes it in onSetChildren().') : _prodInvariant('71') : void 0;
      if (nextChild.parentID == null) {
        nextChild.parentID = id;
        // TODO: This shouldn't be necessary but mounting a new root during in
        // componentWillMount currently causes not-yet-mounted components to
        // be purged from our tree data so their parent id is missing.
      }
      !(nextChild.parentID === id) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Expected onBeforeMountComponent() parent and onSetChildren() to be consistent (%s has parents %s and %s).', nextChildID, nextChild.parentID, id) : _prodInvariant('142', nextChildID, nextChild.parentID, id) : void 0;
    }
  },
  onBeforeMountComponent: function (id, element, parentID) {
    var item = {
      element: element,
      parentID: parentID,
      text: null,
      childIDs: [],
      isMounted: false,
      updateCount: 0
    };
    setItem(id, item);
  },
  onBeforeUpdateComponent: function (id, element) {
    var item = getItem(id);
    if (!item || !item.isMounted) {
      // We may end up here as a result of setState() in componentWillUnmount().
      // In this case, ignore the element.
      return;
    }
    item.element = element;
  },
  onMountComponent: function (id) {
    var item = getItem(id);
    !item ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Item must have been set') : _prodInvariant('144') : void 0;
    item.isMounted = true;
    var isRoot = item.parentID === 0;
    if (isRoot) {
      addRoot(id);
    }
  },
  onUpdateComponent: function (id) {
    var item = getItem(id);
    if (!item || !item.isMounted) {
      // We may end up here as a result of setState() in componentWillUnmount().
      // In this case, ignore the element.
      return;
    }
    item.updateCount++;
  },
  onUnmountComponent: function (id) {
    var item = getItem(id);
    if (item) {
      // We need to check if it exists.
      // `item` might not exist if it is inside an error boundary, and a sibling
      // error boundary child threw while mounting. Then this instance never
      // got a chance to mount, but it still gets an unmounting event during
      // the error boundary cleanup.
      item.isMounted = false;
      var isRoot = item.parentID === 0;
      if (isRoot) {
        removeRoot(id);
      }
    }
    unmountedIDs.push(id);
  },
  purgeUnmountedComponents: function () {
    if (ReactComponentTreeHook._preventPurging) {
      // Should only be used for testing.
      return;
    }

    for (var i = 0; i < unmountedIDs.length; i++) {
      var id = unmountedIDs[i];
      purgeDeep(id);
    }
    unmountedIDs.length = 0;
  },
  isMounted: function (id) {
    var item = getItem(id);
    return item ? item.isMounted : false;
  },
  getCurrentStackAddendum: function (topElement) {
    var info = '';
    if (topElement) {
      var name = getDisplayName(topElement);
      var owner = topElement._owner;
      info += describeComponentFrame(name, topElement._source, owner && owner.getName());
    }

    var currentOwner = ReactCurrentOwner.current;
    var id = currentOwner && currentOwner._debugID;

    info += ReactComponentTreeHook.getStackAddendumByID(id);
    return info;
  },
  getStackAddendumByID: function (id) {
    var info = '';
    while (id) {
      info += describeID(id);
      id = ReactComponentTreeHook.getParentID(id);
    }
    return info;
  },
  getChildIDs: function (id) {
    var item = getItem(id);
    return item ? item.childIDs : [];
  },
  getDisplayName: function (id) {
    var element = ReactComponentTreeHook.getElement(id);
    if (!element) {
      return null;
    }
    return getDisplayName(element);
  },
  getElement: function (id) {
    var item = getItem(id);
    return item ? item.element : null;
  },
  getOwnerID: function (id) {
    var element = ReactComponentTreeHook.getElement(id);
    if (!element || !element._owner) {
      return null;
    }
    return element._owner._debugID;
  },
  getParentID: function (id) {
    var item = getItem(id);
    return item ? item.parentID : null;
  },
  getSource: function (id) {
    var item = getItem(id);
    var element = item ? item.element : null;
    var source = element != null ? element._source : null;
    return source;
  },
  getText: function (id) {
    var element = ReactComponentTreeHook.getElement(id);
    if (typeof element === 'string') {
      return element;
    } else if (typeof element === 'number') {
      return '' + element;
    } else {
      return null;
    }
  },
  getUpdateCount: function (id) {
    var item = getItem(id);
    return item ? item.updateCount : 0;
  },


  getRootIDs: getRootIDs,
  getRegisteredIDs: getItemIDs
};

module.exports = ReactComponentTreeHook;
}).call(this,require('_process'))
},{"./ReactCurrentOwner":193,"./reactProdInvariant":208,"_process":58,"fbjs/lib/invariant":17,"fbjs/lib/warning":24}],193:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

'use strict';

/**
 * Keeps track of the current owner.
 *
 * The current owner is the component who should own any components that are
 * currently being constructed.
 */
var ReactCurrentOwner = {

  /**
   * @internal
   * @type {ReactComponent}
   */
  current: null

};

module.exports = ReactCurrentOwner;
},{}],194:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var ReactElement = require('./ReactElement');

/**
 * Create a factory that creates HTML tag elements.
 *
 * @private
 */
var createDOMFactory = ReactElement.createFactory;
if (process.env.NODE_ENV !== 'production') {
  var ReactElementValidator = require('./ReactElementValidator');
  createDOMFactory = ReactElementValidator.createFactory;
}

/**
 * Creates a mapping from supported HTML tags to `ReactDOMComponent` classes.
 * This is also accessible via `React.DOM`.
 *
 * @public
 */
var ReactDOMFactories = {
  a: createDOMFactory('a'),
  abbr: createDOMFactory('abbr'),
  address: createDOMFactory('address'),
  area: createDOMFactory('area'),
  article: createDOMFactory('article'),
  aside: createDOMFactory('aside'),
  audio: createDOMFactory('audio'),
  b: createDOMFactory('b'),
  base: createDOMFactory('base'),
  bdi: createDOMFactory('bdi'),
  bdo: createDOMFactory('bdo'),
  big: createDOMFactory('big'),
  blockquote: createDOMFactory('blockquote'),
  body: createDOMFactory('body'),
  br: createDOMFactory('br'),
  button: createDOMFactory('button'),
  canvas: createDOMFactory('canvas'),
  caption: createDOMFactory('caption'),
  cite: createDOMFactory('cite'),
  code: createDOMFactory('code'),
  col: createDOMFactory('col'),
  colgroup: createDOMFactory('colgroup'),
  data: createDOMFactory('data'),
  datalist: createDOMFactory('datalist'),
  dd: createDOMFactory('dd'),
  del: createDOMFactory('del'),
  details: createDOMFactory('details'),
  dfn: createDOMFactory('dfn'),
  dialog: createDOMFactory('dialog'),
  div: createDOMFactory('div'),
  dl: createDOMFactory('dl'),
  dt: createDOMFactory('dt'),
  em: createDOMFactory('em'),
  embed: createDOMFactory('embed'),
  fieldset: createDOMFactory('fieldset'),
  figcaption: createDOMFactory('figcaption'),
  figure: createDOMFactory('figure'),
  footer: createDOMFactory('footer'),
  form: createDOMFactory('form'),
  h1: createDOMFactory('h1'),
  h2: createDOMFactory('h2'),
  h3: createDOMFactory('h3'),
  h4: createDOMFactory('h4'),
  h5: createDOMFactory('h5'),
  h6: createDOMFactory('h6'),
  head: createDOMFactory('head'),
  header: createDOMFactory('header'),
  hgroup: createDOMFactory('hgroup'),
  hr: createDOMFactory('hr'),
  html: createDOMFactory('html'),
  i: createDOMFactory('i'),
  iframe: createDOMFactory('iframe'),
  img: createDOMFactory('img'),
  input: createDOMFactory('input'),
  ins: createDOMFactory('ins'),
  kbd: createDOMFactory('kbd'),
  keygen: createDOMFactory('keygen'),
  label: createDOMFactory('label'),
  legend: createDOMFactory('legend'),
  li: createDOMFactory('li'),
  link: createDOMFactory('link'),
  main: createDOMFactory('main'),
  map: createDOMFactory('map'),
  mark: createDOMFactory('mark'),
  menu: createDOMFactory('menu'),
  menuitem: createDOMFactory('menuitem'),
  meta: createDOMFactory('meta'),
  meter: createDOMFactory('meter'),
  nav: createDOMFactory('nav'),
  noscript: createDOMFactory('noscript'),
  object: createDOMFactory('object'),
  ol: createDOMFactory('ol'),
  optgroup: createDOMFactory('optgroup'),
  option: createDOMFactory('option'),
  output: createDOMFactory('output'),
  p: createDOMFactory('p'),
  param: createDOMFactory('param'),
  picture: createDOMFactory('picture'),
  pre: createDOMFactory('pre'),
  progress: createDOMFactory('progress'),
  q: createDOMFactory('q'),
  rp: createDOMFactory('rp'),
  rt: createDOMFactory('rt'),
  ruby: createDOMFactory('ruby'),
  s: createDOMFactory('s'),
  samp: createDOMFactory('samp'),
  script: createDOMFactory('script'),
  section: createDOMFactory('section'),
  select: createDOMFactory('select'),
  small: createDOMFactory('small'),
  source: createDOMFactory('source'),
  span: createDOMFactory('span'),
  strong: createDOMFactory('strong'),
  style: createDOMFactory('style'),
  sub: createDOMFactory('sub'),
  summary: createDOMFactory('summary'),
  sup: createDOMFactory('sup'),
  table: createDOMFactory('table'),
  tbody: createDOMFactory('tbody'),
  td: createDOMFactory('td'),
  textarea: createDOMFactory('textarea'),
  tfoot: createDOMFactory('tfoot'),
  th: createDOMFactory('th'),
  thead: createDOMFactory('thead'),
  time: createDOMFactory('time'),
  title: createDOMFactory('title'),
  tr: createDOMFactory('tr'),
  track: createDOMFactory('track'),
  u: createDOMFactory('u'),
  ul: createDOMFactory('ul'),
  'var': createDOMFactory('var'),
  video: createDOMFactory('video'),
  wbr: createDOMFactory('wbr'),

  // SVG
  circle: createDOMFactory('circle'),
  clipPath: createDOMFactory('clipPath'),
  defs: createDOMFactory('defs'),
  ellipse: createDOMFactory('ellipse'),
  g: createDOMFactory('g'),
  image: createDOMFactory('image'),
  line: createDOMFactory('line'),
  linearGradient: createDOMFactory('linearGradient'),
  mask: createDOMFactory('mask'),
  path: createDOMFactory('path'),
  pattern: createDOMFactory('pattern'),
  polygon: createDOMFactory('polygon'),
  polyline: createDOMFactory('polyline'),
  radialGradient: createDOMFactory('radialGradient'),
  rect: createDOMFactory('rect'),
  stop: createDOMFactory('stop'),
  svg: createDOMFactory('svg'),
  text: createDOMFactory('text'),
  tspan: createDOMFactory('tspan')
};

module.exports = ReactDOMFactories;
}).call(this,require('_process'))
},{"./ReactElement":195,"./ReactElementValidator":197,"_process":58}],195:[function(require,module,exports){
(function (process){
/**
 * Copyright 2014-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var _assign = require('object-assign');

var ReactCurrentOwner = require('./ReactCurrentOwner');

var warning = require('fbjs/lib/warning');
var canDefineProperty = require('./canDefineProperty');
var hasOwnProperty = Object.prototype.hasOwnProperty;

var REACT_ELEMENT_TYPE = require('./ReactElementSymbol');

var RESERVED_PROPS = {
  key: true,
  ref: true,
  __self: true,
  __source: true
};

var specialPropKeyWarningShown, specialPropRefWarningShown;

function hasValidRef(config) {
  if (process.env.NODE_ENV !== 'production') {
    if (hasOwnProperty.call(config, 'ref')) {
      var getter = Object.getOwnPropertyDescriptor(config, 'ref').get;
      if (getter && getter.isReactWarning) {
        return false;
      }
    }
  }
  return config.ref !== undefined;
}

function hasValidKey(config) {
  if (process.env.NODE_ENV !== 'production') {
    if (hasOwnProperty.call(config, 'key')) {
      var getter = Object.getOwnPropertyDescriptor(config, 'key').get;
      if (getter && getter.isReactWarning) {
        return false;
      }
    }
  }
  return config.key !== undefined;
}

function defineKeyPropWarningGetter(props, displayName) {
  var warnAboutAccessingKey = function () {
    if (!specialPropKeyWarningShown) {
      specialPropKeyWarningShown = true;
      process.env.NODE_ENV !== 'production' ? warning(false, '%s: `key` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://fb.me/react-special-props)', displayName) : void 0;
    }
  };
  warnAboutAccessingKey.isReactWarning = true;
  Object.defineProperty(props, 'key', {
    get: warnAboutAccessingKey,
    configurable: true
  });
}

function defineRefPropWarningGetter(props, displayName) {
  var warnAboutAccessingRef = function () {
    if (!specialPropRefWarningShown) {
      specialPropRefWarningShown = true;
      process.env.NODE_ENV !== 'production' ? warning(false, '%s: `ref` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://fb.me/react-special-props)', displayName) : void 0;
    }
  };
  warnAboutAccessingRef.isReactWarning = true;
  Object.defineProperty(props, 'ref', {
    get: warnAboutAccessingRef,
    configurable: true
  });
}

/**
 * Factory method to create a new React element. This no longer adheres to
 * the class pattern, so do not use new to call it. Also, no instanceof check
 * will work. Instead test $$typeof field against Symbol.for('react.element') to check
 * if something is a React Element.
 *
 * @param {*} type
 * @param {*} key
 * @param {string|object} ref
 * @param {*} self A *temporary* helper to detect places where `this` is
 * different from the `owner` when React.createElement is called, so that we
 * can warn. We want to get rid of owner and replace string `ref`s with arrow
 * functions, and as long as `this` and owner are the same, there will be no
 * change in behavior.
 * @param {*} source An annotation object (added by a transpiler or otherwise)
 * indicating filename, line number, and/or other information.
 * @param {*} owner
 * @param {*} props
 * @internal
 */
var ReactElement = function (type, key, ref, self, source, owner, props) {
  var element = {
    // This tag allow us to uniquely identify this as a React Element
    $$typeof: REACT_ELEMENT_TYPE,

    // Built-in properties that belong on the element
    type: type,
    key: key,
    ref: ref,
    props: props,

    // Record the component responsible for creating this element.
    _owner: owner
  };

  if (process.env.NODE_ENV !== 'production') {
    // The validation flag is currently mutative. We put it on
    // an external backing store so that we can freeze the whole object.
    // This can be replaced with a WeakMap once they are implemented in
    // commonly used development environments.
    element._store = {};

    // To make comparing ReactElements easier for testing purposes, we make
    // the validation flag non-enumerable (where possible, which should
    // include every environment we run tests in), so the test framework
    // ignores it.
    if (canDefineProperty) {
      Object.defineProperty(element._store, 'validated', {
        configurable: false,
        enumerable: false,
        writable: true,
        value: false
      });
      // self and source are DEV only properties.
      Object.defineProperty(element, '_self', {
        configurable: false,
        enumerable: false,
        writable: false,
        value: self
      });
      // Two elements created in two different places should be considered
      // equal for testing purposes and therefore we hide it from enumeration.
      Object.defineProperty(element, '_source', {
        configurable: false,
        enumerable: false,
        writable: false,
        value: source
      });
    } else {
      element._store.validated = false;
      element._self = self;
      element._source = source;
    }
    if (Object.freeze) {
      Object.freeze(element.props);
      Object.freeze(element);
    }
  }

  return element;
};

/**
 * Create and return a new ReactElement of the given type.
 * See https://facebook.github.io/react/docs/top-level-api.html#react.createelement
 */
ReactElement.createElement = function (type, config, children) {
  var propName;

  // Reserved names are extracted
  var props = {};

  var key = null;
  var ref = null;
  var self = null;
  var source = null;

  if (config != null) {
    if (hasValidRef(config)) {
      ref = config.ref;
    }
    if (hasValidKey(config)) {
      key = '' + config.key;
    }

    self = config.__self === undefined ? null : config.__self;
    source = config.__source === undefined ? null : config.__source;
    // Remaining properties are added to a new props object
    for (propName in config) {
      if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
        props[propName] = config[propName];
      }
    }
  }

  // Children can be more than one argument, and those are transferred onto
  // the newly allocated props object.
  var childrenLength = arguments.length - 2;
  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    var childArray = Array(childrenLength);
    for (var i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }
    if (process.env.NODE_ENV !== 'production') {
      if (Object.freeze) {
        Object.freeze(childArray);
      }
    }
    props.children = childArray;
  }

  // Resolve default props
  if (type && type.defaultProps) {
    var defaultProps = type.defaultProps;
    for (propName in defaultProps) {
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName];
      }
    }
  }
  if (process.env.NODE_ENV !== 'production') {
    if (key || ref) {
      if (typeof props.$$typeof === 'undefined' || props.$$typeof !== REACT_ELEMENT_TYPE) {
        var displayName = typeof type === 'function' ? type.displayName || type.name || 'Unknown' : type;
        if (key) {
          defineKeyPropWarningGetter(props, displayName);
        }
        if (ref) {
          defineRefPropWarningGetter(props, displayName);
        }
      }
    }
  }
  return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
};

/**
 * Return a function that produces ReactElements of a given type.
 * See https://facebook.github.io/react/docs/top-level-api.html#react.createfactory
 */
ReactElement.createFactory = function (type) {
  var factory = ReactElement.createElement.bind(null, type);
  // Expose the type on the factory and the prototype so that it can be
  // easily accessed on elements. E.g. `<Foo />.type === Foo`.
  // This should not be named `constructor` since this may not be the function
  // that created the element, and it may not even be a constructor.
  // Legacy hook TODO: Warn if this is accessed
  factory.type = type;
  return factory;
};

ReactElement.cloneAndReplaceKey = function (oldElement, newKey) {
  var newElement = ReactElement(oldElement.type, newKey, oldElement.ref, oldElement._self, oldElement._source, oldElement._owner, oldElement.props);

  return newElement;
};

/**
 * Clone and return a new ReactElement using element as the starting point.
 * See https://facebook.github.io/react/docs/top-level-api.html#react.cloneelement
 */
ReactElement.cloneElement = function (element, config, children) {
  var propName;

  // Original props are copied
  var props = _assign({}, element.props);

  // Reserved names are extracted
  var key = element.key;
  var ref = element.ref;
  // Self is preserved since the owner is preserved.
  var self = element._self;
  // Source is preserved since cloneElement is unlikely to be targeted by a
  // transpiler, and the original source is probably a better indicator of the
  // true owner.
  var source = element._source;

  // Owner will be preserved, unless ref is overridden
  var owner = element._owner;

  if (config != null) {
    if (hasValidRef(config)) {
      // Silently steal the ref from the parent.
      ref = config.ref;
      owner = ReactCurrentOwner.current;
    }
    if (hasValidKey(config)) {
      key = '' + config.key;
    }

    // Remaining properties override existing props
    var defaultProps;
    if (element.type && element.type.defaultProps) {
      defaultProps = element.type.defaultProps;
    }
    for (propName in config) {
      if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
        if (config[propName] === undefined && defaultProps !== undefined) {
          // Resolve default props
          props[propName] = defaultProps[propName];
        } else {
          props[propName] = config[propName];
        }
      }
    }
  }

  // Children can be more than one argument, and those are transferred onto
  // the newly allocated props object.
  var childrenLength = arguments.length - 2;
  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    var childArray = Array(childrenLength);
    for (var i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }
    props.children = childArray;
  }

  return ReactElement(element.type, key, ref, self, source, owner, props);
};

/**
 * Verifies the object is a ReactElement.
 * See https://facebook.github.io/react/docs/top-level-api.html#react.isvalidelement
 * @param {?object} object
 * @return {boolean} True if `object` is a valid component.
 * @final
 */
ReactElement.isValidElement = function (object) {
  return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
};

module.exports = ReactElement;
}).call(this,require('_process'))
},{"./ReactCurrentOwner":193,"./ReactElementSymbol":196,"./canDefineProperty":204,"_process":58,"fbjs/lib/warning":24,"object-assign":57}],196:[function(require,module,exports){
arguments[4][110][0].apply(exports,arguments)
},{"dup":110}],197:[function(require,module,exports){
(function (process){
/**
 * Copyright 2014-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

/**
 * ReactElementValidator provides a wrapper around a element factory
 * which validates the props passed to the element. This is intended to be
 * used only in DEV and could be replaced by a static type checker for languages
 * that support it.
 */

'use strict';

var ReactCurrentOwner = require('./ReactCurrentOwner');
var ReactComponentTreeHook = require('./ReactComponentTreeHook');
var ReactElement = require('./ReactElement');

var checkReactTypeSpec = require('./checkReactTypeSpec');

var canDefineProperty = require('./canDefineProperty');
var getIteratorFn = require('./getIteratorFn');
var warning = require('fbjs/lib/warning');

function getDeclarationErrorAddendum() {
  if (ReactCurrentOwner.current) {
    var name = ReactCurrentOwner.current.getName();
    if (name) {
      return ' Check the render method of `' + name + '`.';
    }
  }
  return '';
}

/**
 * Warn if there's no key explicitly set on dynamic arrays of children or
 * object keys are not valid. This allows us to keep track of children between
 * updates.
 */
var ownerHasKeyUseWarning = {};

function getCurrentComponentErrorInfo(parentType) {
  var info = getDeclarationErrorAddendum();

  if (!info) {
    var parentName = typeof parentType === 'string' ? parentType : parentType.displayName || parentType.name;
    if (parentName) {
      info = ' Check the top-level render call using <' + parentName + '>.';
    }
  }
  return info;
}

/**
 * Warn if the element doesn't have an explicit key assigned to it.
 * This element is in an array. The array could grow and shrink or be
 * reordered. All children that haven't already been validated are required to
 * have a "key" property assigned to it. Error statuses are cached so a warning
 * will only be shown once.
 *
 * @internal
 * @param {ReactElement} element Element that requires a key.
 * @param {*} parentType element's parent's type.
 */
function validateExplicitKey(element, parentType) {
  if (!element._store || element._store.validated || element.key != null) {
    return;
  }
  element._store.validated = true;

  var memoizer = ownerHasKeyUseWarning.uniqueKey || (ownerHasKeyUseWarning.uniqueKey = {});

  var currentComponentErrorInfo = getCurrentComponentErrorInfo(parentType);
  if (memoizer[currentComponentErrorInfo]) {
    return;
  }
  memoizer[currentComponentErrorInfo] = true;

  // Usually the current owner is the offender, but if it accepts children as a
  // property, it may be the creator of the child that's responsible for
  // assigning it a key.
  var childOwner = '';
  if (element && element._owner && element._owner !== ReactCurrentOwner.current) {
    // Give the component that originally created this child.
    childOwner = ' It was passed a child from ' + element._owner.getName() + '.';
  }

  process.env.NODE_ENV !== 'production' ? warning(false, 'Each child in an array or iterator should have a unique "key" prop.' + '%s%s See https://fb.me/react-warning-keys for more information.%s', currentComponentErrorInfo, childOwner, ReactComponentTreeHook.getCurrentStackAddendum(element)) : void 0;
}

/**
 * Ensure that every element either is passed in a static location, in an
 * array with an explicit keys property defined, or in an object literal
 * with valid key property.
 *
 * @internal
 * @param {ReactNode} node Statically passed child of any type.
 * @param {*} parentType node's parent's type.
 */
function validateChildKeys(node, parentType) {
  if (typeof node !== 'object') {
    return;
  }
  if (Array.isArray(node)) {
    for (var i = 0; i < node.length; i++) {
      var child = node[i];
      if (ReactElement.isValidElement(child)) {
        validateExplicitKey(child, parentType);
      }
    }
  } else if (ReactElement.isValidElement(node)) {
    // This element was passed in a valid location.
    if (node._store) {
      node._store.validated = true;
    }
  } else if (node) {
    var iteratorFn = getIteratorFn(node);
    // Entry iterators provide implicit keys.
    if (iteratorFn) {
      if (iteratorFn !== node.entries) {
        var iterator = iteratorFn.call(node);
        var step;
        while (!(step = iterator.next()).done) {
          if (ReactElement.isValidElement(step.value)) {
            validateExplicitKey(step.value, parentType);
          }
        }
      }
    }
  }
}

/**
 * Given an element, validate that its props follow the propTypes definition,
 * provided by the type.
 *
 * @param {ReactElement} element
 */
function validatePropTypes(element) {
  var componentClass = element.type;
  if (typeof componentClass !== 'function') {
    return;
  }
  var name = componentClass.displayName || componentClass.name;
  if (componentClass.propTypes) {
    checkReactTypeSpec(componentClass.propTypes, element.props, 'prop', name, element, null);
  }
  if (typeof componentClass.getDefaultProps === 'function') {
    process.env.NODE_ENV !== 'production' ? warning(componentClass.getDefaultProps.isReactClassApproved, 'getDefaultProps is only used on classic React.createClass ' + 'definitions. Use a static property named `defaultProps` instead.') : void 0;
  }
}

var ReactElementValidator = {

  createElement: function (type, props, children) {
    var validType = typeof type === 'string' || typeof type === 'function';
    // We warn in this case but don't throw. We expect the element creation to
    // succeed and there will likely be errors in render.
    if (!validType) {
      if (typeof type !== 'function' && typeof type !== 'string') {
        var info = '';
        if (type === undefined || typeof type === 'object' && type !== null && Object.keys(type).length === 0) {
          info += ' You likely forgot to export your component from the file ' + 'it\'s defined in.';
        }
        info += getDeclarationErrorAddendum();
        process.env.NODE_ENV !== 'production' ? warning(false, 'React.createElement: type is invalid -- expected a string (for ' + 'built-in components) or a class/function (for composite ' + 'components) but got: %s.%s', type == null ? type : typeof type, info) : void 0;
      }
    }

    var element = ReactElement.createElement.apply(this, arguments);

    // The result can be nullish if a mock or a custom function is used.
    // TODO: Drop this when these are no longer allowed as the type argument.
    if (element == null) {
      return element;
    }

    // Skip key warning if the type isn't valid since our key validation logic
    // doesn't expect a non-string/function type and can throw confusing errors.
    // We don't want exception behavior to differ between dev and prod.
    // (Rendering will throw with a helpful message and as soon as the type is
    // fixed, the key warnings will appear.)
    if (validType) {
      for (var i = 2; i < arguments.length; i++) {
        validateChildKeys(arguments[i], type);
      }
    }

    validatePropTypes(element);

    return element;
  },

  createFactory: function (type) {
    var validatedFactory = ReactElementValidator.createElement.bind(null, type);
    // Legacy hook TODO: Warn if this is accessed
    validatedFactory.type = type;

    if (process.env.NODE_ENV !== 'production') {
      if (canDefineProperty) {
        Object.defineProperty(validatedFactory, 'type', {
          enumerable: false,
          get: function () {
            process.env.NODE_ENV !== 'production' ? warning(false, 'Factory.type is deprecated. Access the class directly ' + 'before passing it to createFactory.') : void 0;
            Object.defineProperty(this, 'type', {
              value: type
            });
            return type;
          }
        });
      }
    }

    return validatedFactory;
  },

  cloneElement: function (element, props, children) {
    var newElement = ReactElement.cloneElement.apply(this, arguments);
    for (var i = 2; i < arguments.length; i++) {
      validateChildKeys(arguments[i], newElement.type);
    }
    validatePropTypes(newElement);
    return newElement;
  }

};

module.exports = ReactElementValidator;
}).call(this,require('_process'))
},{"./ReactComponentTreeHook":192,"./ReactCurrentOwner":193,"./ReactElement":195,"./canDefineProperty":204,"./checkReactTypeSpec":205,"./getIteratorFn":206,"_process":58,"fbjs/lib/warning":24}],198:[function(require,module,exports){
(function (process){
/**
 * Copyright 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var warning = require('fbjs/lib/warning');

function warnNoop(publicInstance, callerName) {
  if (process.env.NODE_ENV !== 'production') {
    var constructor = publicInstance.constructor;
    process.env.NODE_ENV !== 'production' ? warning(false, '%s(...): Can only update a mounted or mounting component. ' + 'This usually means you called %s() on an unmounted component. ' + 'This is a no-op. Please check the code for the %s component.', callerName, callerName, constructor && (constructor.displayName || constructor.name) || 'ReactClass') : void 0;
  }
}

/**
 * This is the abstract API for an update queue.
 */
var ReactNoopUpdateQueue = {

  /**
   * Checks whether or not this composite component is mounted.
   * @param {ReactClass} publicInstance The instance we want to test.
   * @return {boolean} True if mounted, false otherwise.
   * @protected
   * @final
   */
  isMounted: function (publicInstance) {
    return false;
  },

  /**
   * Enqueue a callback that will be executed after all the pending updates
   * have processed.
   *
   * @param {ReactClass} publicInstance The instance to use as `this` context.
   * @param {?function} callback Called after state is updated.
   * @internal
   */
  enqueueCallback: function (publicInstance, callback) {},

  /**
   * Forces an update. This should only be invoked when it is known with
   * certainty that we are **not** in a DOM transaction.
   *
   * You may want to call this when you know that some deeper aspect of the
   * component's state has changed but `setState` was not called.
   *
   * This will not invoke `shouldComponentUpdate`, but it will invoke
   * `componentWillUpdate` and `componentDidUpdate`.
   *
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @internal
   */
  enqueueForceUpdate: function (publicInstance) {
    warnNoop(publicInstance, 'forceUpdate');
  },

  /**
   * Replaces all of the state. Always use this or `setState` to mutate state.
   * You should treat `this.state` as immutable.
   *
   * There is no guarantee that `this.state` will be immediately updated, so
   * accessing `this.state` after calling this method may return the old value.
   *
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @param {object} completeState Next state.
   * @internal
   */
  enqueueReplaceState: function (publicInstance, completeState) {
    warnNoop(publicInstance, 'replaceState');
  },

  /**
   * Sets a subset of the state. This only exists because _pendingState is
   * internal. This provides a merging strategy that is not available to deep
   * properties which is confusing. TODO: Expose pendingState or don't use it
   * during the merge.
   *
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @param {object} partialState Next partial state to be merged with state.
   * @internal
   */
  enqueueSetState: function (publicInstance, partialState) {
    warnNoop(publicInstance, 'setState');
  }
};

module.exports = ReactNoopUpdateQueue;
}).call(this,require('_process'))
},{"_process":58,"fbjs/lib/warning":24}],199:[function(require,module,exports){
arguments[4][128][0].apply(exports,arguments)
},{"_process":58,"dup":128}],200:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var ReactElement = require('./ReactElement');
var ReactPropTypeLocationNames = require('./ReactPropTypeLocationNames');
var ReactPropTypesSecret = require('./ReactPropTypesSecret');

var emptyFunction = require('fbjs/lib/emptyFunction');
var getIteratorFn = require('./getIteratorFn');
var warning = require('fbjs/lib/warning');

/**
 * Collection of methods that allow declaration and validation of props that are
 * supplied to React components. Example usage:
 *
 *   var Props = require('ReactPropTypes');
 *   var MyArticle = React.createClass({
 *     propTypes: {
 *       // An optional string prop named "description".
 *       description: Props.string,
 *
 *       // A required enum prop named "category".
 *       category: Props.oneOf(['News','Photos']).isRequired,
 *
 *       // A prop named "dialog" that requires an instance of Dialog.
 *       dialog: Props.instanceOf(Dialog).isRequired
 *     },
 *     render: function() { ... }
 *   });
 *
 * A more formal specification of how these methods are used:
 *
 *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
 *   decl := ReactPropTypes.{type}(.isRequired)?
 *
 * Each and every declaration produces a function with the same signature. This
 * allows the creation of custom validation functions. For example:
 *
 *  var MyLink = React.createClass({
 *    propTypes: {
 *      // An optional string or URI prop named "href".
 *      href: function(props, propName, componentName) {
 *        var propValue = props[propName];
 *        if (propValue != null && typeof propValue !== 'string' &&
 *            !(propValue instanceof URI)) {
 *          return new Error(
 *            'Expected a string or an URI for ' + propName + ' in ' +
 *            componentName
 *          );
 *        }
 *      }
 *    },
 *    render: function() {...}
 *  });
 *
 * @internal
 */

var ANONYMOUS = '<<anonymous>>';

var ReactPropTypes = {
  array: createPrimitiveTypeChecker('array'),
  bool: createPrimitiveTypeChecker('boolean'),
  func: createPrimitiveTypeChecker('function'),
  number: createPrimitiveTypeChecker('number'),
  object: createPrimitiveTypeChecker('object'),
  string: createPrimitiveTypeChecker('string'),
  symbol: createPrimitiveTypeChecker('symbol'),

  any: createAnyTypeChecker(),
  arrayOf: createArrayOfTypeChecker,
  element: createElementTypeChecker(),
  instanceOf: createInstanceTypeChecker,
  node: createNodeChecker(),
  objectOf: createObjectOfTypeChecker,
  oneOf: createEnumTypeChecker,
  oneOfType: createUnionTypeChecker,
  shape: createShapeTypeChecker
};

/**
 * inlined Object.is polyfill to avoid requiring consumers ship their own
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
 */
/*eslint-disable no-self-compare*/
function is(x, y) {
  // SameValue algorithm
  if (x === y) {
    // Steps 1-5, 7-10
    // Steps 6.b-6.e: +0 != -0
    return x !== 0 || 1 / x === 1 / y;
  } else {
    // Step 6.a: NaN == NaN
    return x !== x && y !== y;
  }
}
/*eslint-enable no-self-compare*/

/**
 * We use an Error-like object for backward compatibility as people may call
 * PropTypes directly and inspect their output. However we don't use real
 * Errors anymore. We don't inspect their stack anyway, and creating them
 * is prohibitively expensive if they are created too often, such as what
 * happens in oneOfType() for any type before the one that matched.
 */
function PropTypeError(message) {
  this.message = message;
  this.stack = '';
}
// Make `instanceof Error` still work for returned errors.
PropTypeError.prototype = Error.prototype;

function createChainableTypeChecker(validate) {
  if (process.env.NODE_ENV !== 'production') {
    var manualPropTypeCallCache = {};
  }
  function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
    componentName = componentName || ANONYMOUS;
    propFullName = propFullName || propName;
    if (process.env.NODE_ENV !== 'production') {
      if (secret !== ReactPropTypesSecret && typeof console !== 'undefined') {
        var cacheKey = componentName + ':' + propName;
        if (!manualPropTypeCallCache[cacheKey]) {
          process.env.NODE_ENV !== 'production' ? warning(false, 'You are manually calling a React.PropTypes validation ' + 'function for the `%s` prop on `%s`. This is deprecated ' + 'and will not work in production with the next major version. ' + 'You may be seeing this warning due to a third-party PropTypes ' + 'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.', propFullName, componentName) : void 0;
          manualPropTypeCallCache[cacheKey] = true;
        }
      }
    }
    if (props[propName] == null) {
      var locationName = ReactPropTypeLocationNames[location];
      if (isRequired) {
        if (props[propName] === null) {
          return new PropTypeError('The ' + locationName + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));
        }
        return new PropTypeError('The ' + locationName + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));
      }
      return null;
    } else {
      return validate(props, propName, componentName, location, propFullName);
    }
  }

  var chainedCheckType = checkType.bind(null, false);
  chainedCheckType.isRequired = checkType.bind(null, true);

  return chainedCheckType;
}

function createPrimitiveTypeChecker(expectedType) {
  function validate(props, propName, componentName, location, propFullName, secret) {
    var propValue = props[propName];
    var propType = getPropType(propValue);
    if (propType !== expectedType) {
      var locationName = ReactPropTypeLocationNames[location];
      // `propValue` being instance of, say, date/regexp, pass the 'object'
      // check, but we can offer a more precise error message here rather than
      // 'of type `object`'.
      var preciseType = getPreciseType(propValue);

      return new PropTypeError('Invalid ' + locationName + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'));
    }
    return null;
  }
  return createChainableTypeChecker(validate);
}

function createAnyTypeChecker() {
  return createChainableTypeChecker(emptyFunction.thatReturns(null));
}

function createArrayOfTypeChecker(typeChecker) {
  function validate(props, propName, componentName, location, propFullName) {
    if (typeof typeChecker !== 'function') {
      return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
    }
    var propValue = props[propName];
    if (!Array.isArray(propValue)) {
      var locationName = ReactPropTypeLocationNames[location];
      var propType = getPropType(propValue);
      return new PropTypeError('Invalid ' + locationName + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
    }
    for (var i = 0; i < propValue.length; i++) {
      var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret);
      if (error instanceof Error) {
        return error;
      }
    }
    return null;
  }
  return createChainableTypeChecker(validate);
}

function createElementTypeChecker() {
  function validate(props, propName, componentName, location, propFullName) {
    var propValue = props[propName];
    if (!ReactElement.isValidElement(propValue)) {
      var locationName = ReactPropTypeLocationNames[location];
      var propType = getPropType(propValue);
      return new PropTypeError('Invalid ' + locationName + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
    }
    return null;
  }
  return createChainableTypeChecker(validate);
}

function createInstanceTypeChecker(expectedClass) {
  function validate(props, propName, componentName, location, propFullName) {
    if (!(props[propName] instanceof expectedClass)) {
      var locationName = ReactPropTypeLocationNames[location];
      var expectedClassName = expectedClass.name || ANONYMOUS;
      var actualClassName = getClassName(props[propName]);
      return new PropTypeError('Invalid ' + locationName + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
    }
    return null;
  }
  return createChainableTypeChecker(validate);
}

function createEnumTypeChecker(expectedValues) {
  if (!Array.isArray(expectedValues)) {
    process.env.NODE_ENV !== 'production' ? warning(false, 'Invalid argument supplied to oneOf, expected an instance of array.') : void 0;
    return emptyFunction.thatReturnsNull;
  }

  function validate(props, propName, componentName, location, propFullName) {
    var propValue = props[propName];
    for (var i = 0; i < expectedValues.length; i++) {
      if (is(propValue, expectedValues[i])) {
        return null;
      }
    }

    var locationName = ReactPropTypeLocationNames[location];
    var valuesString = JSON.stringify(expectedValues);
    return new PropTypeError('Invalid ' + locationName + ' `' + propFullName + '` of value `' + propValue + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
  }
  return createChainableTypeChecker(validate);
}

function createObjectOfTypeChecker(typeChecker) {
  function validate(props, propName, componentName, location, propFullName) {
    if (typeof typeChecker !== 'function') {
      return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
    }
    var propValue = props[propName];
    var propType = getPropType(propValue);
    if (propType !== 'object') {
      var locationName = ReactPropTypeLocationNames[location];
      return new PropTypeError('Invalid ' + locationName + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
    }
    for (var key in propValue) {
      if (propValue.hasOwnProperty(key)) {
        var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
        if (error instanceof Error) {
          return error;
        }
      }
    }
    return null;
  }
  return createChainableTypeChecker(validate);
}

function createUnionTypeChecker(arrayOfTypeCheckers) {
  if (!Array.isArray(arrayOfTypeCheckers)) {
    process.env.NODE_ENV !== 'production' ? warning(false, 'Invalid argument supplied to oneOfType, expected an instance of array.') : void 0;
    return emptyFunction.thatReturnsNull;
  }

  function validate(props, propName, componentName, location, propFullName) {
    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
      var checker = arrayOfTypeCheckers[i];
      if (checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret) == null) {
        return null;
      }
    }

    var locationName = ReactPropTypeLocationNames[location];
    return new PropTypeError('Invalid ' + locationName + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`.'));
  }
  return createChainableTypeChecker(validate);
}

function createNodeChecker() {
  function validate(props, propName, componentName, location, propFullName) {
    if (!isNode(props[propName])) {
      var locationName = ReactPropTypeLocationNames[location];
      return new PropTypeError('Invalid ' + locationName + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
    }
    return null;
  }
  return createChainableTypeChecker(validate);
}

function createShapeTypeChecker(shapeTypes) {
  function validate(props, propName, componentName, location, propFullName) {
    var propValue = props[propName];
    var propType = getPropType(propValue);
    if (propType !== 'object') {
      var locationName = ReactPropTypeLocationNames[location];
      return new PropTypeError('Invalid ' + locationName + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
    }
    for (var key in shapeTypes) {
      var checker = shapeTypes[key];
      if (!checker) {
        continue;
      }
      var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
      if (error) {
        return error;
      }
    }
    return null;
  }
  return createChainableTypeChecker(validate);
}

function isNode(propValue) {
  switch (typeof propValue) {
    case 'number':
    case 'string':
    case 'undefined':
      return true;
    case 'boolean':
      return !propValue;
    case 'object':
      if (Array.isArray(propValue)) {
        return propValue.every(isNode);
      }
      if (propValue === null || ReactElement.isValidElement(propValue)) {
        return true;
      }

      var iteratorFn = getIteratorFn(propValue);
      if (iteratorFn) {
        var iterator = iteratorFn.call(propValue);
        var step;
        if (iteratorFn !== propValue.entries) {
          while (!(step = iterator.next()).done) {
            if (!isNode(step.value)) {
              return false;
            }
          }
        } else {
          // Iterator will provide entry [k,v] tuples rather than values.
          while (!(step = iterator.next()).done) {
            var entry = step.value;
            if (entry) {
              if (!isNode(entry[1])) {
                return false;
              }
            }
          }
        }
      } else {
        return false;
      }

      return true;
    default:
      return false;
  }
}

function isSymbol(propType, propValue) {
  // Native Symbol.
  if (propType === 'symbol') {
    return true;
  }

  // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
  if (propValue['@@toStringTag'] === 'Symbol') {
    return true;
  }

  // Fallback for non-spec compliant Symbols which are polyfilled.
  if (typeof Symbol === 'function' && propValue instanceof Symbol) {
    return true;
  }

  return false;
}

// Equivalent of `typeof` but with special handling for array and regexp.
function getPropType(propValue) {
  var propType = typeof propValue;
  if (Array.isArray(propValue)) {
    return 'array';
  }
  if (propValue instanceof RegExp) {
    // Old webkits (at least until Android 4.0) return 'function' rather than
    // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
    // passes PropTypes.object.
    return 'object';
  }
  if (isSymbol(propType, propValue)) {
    return 'symbol';
  }
  return propType;
}

// This handles more types than `getPropType`. Only used for error messages.
// See `createPrimitiveTypeChecker`.
function getPreciseType(propValue) {
  var propType = getPropType(propValue);
  if (propType === 'object') {
    if (propValue instanceof Date) {
      return 'date';
    } else if (propValue instanceof RegExp) {
      return 'regexp';
    }
  }
  return propType;
}

// Returns class name of the object, if any.
function getClassName(propValue) {
  if (!propValue.constructor || !propValue.constructor.name) {
    return ANONYMOUS;
  }
  return propValue.constructor.name;
}

module.exports = ReactPropTypes;
}).call(this,require('_process'))
},{"./ReactElement":195,"./ReactPropTypeLocationNames":199,"./ReactPropTypesSecret":201,"./getIteratorFn":206,"_process":58,"fbjs/lib/emptyFunction":9,"fbjs/lib/warning":24}],201:[function(require,module,exports){
arguments[4][129][0].apply(exports,arguments)
},{"dup":129}],202:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var _assign = require('object-assign');

var ReactComponent = require('./ReactComponent');
var ReactNoopUpdateQueue = require('./ReactNoopUpdateQueue');

var emptyObject = require('fbjs/lib/emptyObject');

/**
 * Base class helpers for the updating state of a component.
 */
function ReactPureComponent(props, context, updater) {
  // Duplicated from ReactComponent.
  this.props = props;
  this.context = context;
  this.refs = emptyObject;
  // We initialize the default updater but the real one gets injected by the
  // renderer.
  this.updater = updater || ReactNoopUpdateQueue;
}

function ComponentDummy() {}
ComponentDummy.prototype = ReactComponent.prototype;
ReactPureComponent.prototype = new ComponentDummy();
ReactPureComponent.prototype.constructor = ReactPureComponent;
// Avoid an extra prototype jump for these methods.
_assign(ReactPureComponent.prototype, ReactComponent.prototype);
ReactPureComponent.prototype.isPureReactComponent = true;

module.exports = ReactPureComponent;
},{"./ReactComponent":191,"./ReactNoopUpdateQueue":198,"fbjs/lib/emptyObject":10,"object-assign":57}],203:[function(require,module,exports){
arguments[4][137][0].apply(exports,arguments)
},{"dup":137}],204:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

'use strict';

var canDefineProperty = false;
if (process.env.NODE_ENV !== 'production') {
  try {
    // $FlowFixMe https://github.com/facebook/flow/issues/285
    Object.defineProperty({}, 'x', { get: function () {} });
    canDefineProperty = true;
  } catch (x) {
    // IE will fail on defineProperty
  }
}

module.exports = canDefineProperty;
}).call(this,require('_process'))
},{"_process":58}],205:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var _prodInvariant = require('./reactProdInvariant');

var ReactPropTypeLocationNames = require('./ReactPropTypeLocationNames');
var ReactPropTypesSecret = require('./ReactPropTypesSecret');

var invariant = require('fbjs/lib/invariant');
var warning = require('fbjs/lib/warning');

var ReactComponentTreeHook;

if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'test') {
  // Temporary hack.
  // Inline requires don't work well with Jest:
  // https://github.com/facebook/react/issues/7240
  // Remove the inline requires when we don't need them anymore:
  // https://github.com/facebook/react/pull/7178
  ReactComponentTreeHook = require('./ReactComponentTreeHook');
}

var loggedTypeFailures = {};

/**
 * Assert that the values match with the type specs.
 * Error messages are memorized and will only be shown once.
 *
 * @param {object} typeSpecs Map of name to a ReactPropType
 * @param {object} values Runtime values that need to be type-checked
 * @param {string} location e.g. "prop", "context", "child context"
 * @param {string} componentName Name of the component for error messages.
 * @param {?object} element The React element that is being type-checked
 * @param {?number} debugID The React component instance that is being type-checked
 * @private
 */
function checkReactTypeSpec(typeSpecs, values, location, componentName, element, debugID) {
  for (var typeSpecName in typeSpecs) {
    if (typeSpecs.hasOwnProperty(typeSpecName)) {
      var error;
      // Prop type validation may throw. In case they do, we don't want to
      // fail the render phase where it didn't fail before. So we log it.
      // After these have been cleaned up, we'll let them throw.
      try {
        // This is intentionally an invariant that gets caught. It's the same
        // behavior as without this statement except with a better message.
        !(typeof typeSpecs[typeSpecName] === 'function') ? process.env.NODE_ENV !== 'production' ? invariant(false, '%s: %s type `%s` is invalid; it must be a function, usually from React.PropTypes.', componentName || 'React class', ReactPropTypeLocationNames[location], typeSpecName) : _prodInvariant('84', componentName || 'React class', ReactPropTypeLocationNames[location], typeSpecName) : void 0;
        error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
      } catch (ex) {
        error = ex;
      }
      process.env.NODE_ENV !== 'production' ? warning(!error || error instanceof Error, '%s: type specification of %s `%s` is invalid; the type checker ' + 'function must return `null` or an `Error` but returned a %s. ' + 'You may have forgotten to pass an argument to the type checker ' + 'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' + 'shape all require an argument).', componentName || 'React class', ReactPropTypeLocationNames[location], typeSpecName, typeof error) : void 0;
      if (error instanceof Error && !(error.message in loggedTypeFailures)) {
        // Only monitor this failure once because there tends to be a lot of the
        // same error.
        loggedTypeFailures[error.message] = true;

        var componentStackInfo = '';

        if (process.env.NODE_ENV !== 'production') {
          if (!ReactComponentTreeHook) {
            ReactComponentTreeHook = require('./ReactComponentTreeHook');
          }
          if (debugID !== null) {
            componentStackInfo = ReactComponentTreeHook.getStackAddendumByID(debugID);
          } else if (element !== null) {
            componentStackInfo = ReactComponentTreeHook.getCurrentStackAddendum(element);
          }
        }

        process.env.NODE_ENV !== 'production' ? warning(false, 'Failed %s type: %s%s', location, error.message, componentStackInfo) : void 0;
      }
    }
  }
}

module.exports = checkReactTypeSpec;
}).call(this,require('_process'))
},{"./ReactComponentTreeHook":192,"./ReactPropTypeLocationNames":199,"./ReactPropTypesSecret":201,"./reactProdInvariant":208,"_process":58,"fbjs/lib/invariant":17,"fbjs/lib/warning":24}],206:[function(require,module,exports){
arguments[4][170][0].apply(exports,arguments)
},{"dup":170}],207:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */
'use strict';

var _prodInvariant = require('./reactProdInvariant');

var ReactElement = require('./ReactElement');

var invariant = require('fbjs/lib/invariant');

/**
 * Returns the first child in a collection of children and verifies that there
 * is only one child in the collection.
 *
 * See https://facebook.github.io/react/docs/top-level-api.html#react.children.only
 *
 * The current implementation of this function assumes that a single child gets
 * passed without a wrapper, but the purpose of this helper function is to
 * abstract away the particular structure of children.
 *
 * @param {?object} children Child collection structure.
 * @return {ReactElement} The first and only `ReactElement` contained in the
 * structure.
 */
function onlyChild(children) {
  !ReactElement.isValidElement(children) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'React.Children.only expected to receive a single React element child.') : _prodInvariant('143') : void 0;
  return children;
}

module.exports = onlyChild;
}).call(this,require('_process'))
},{"./ReactElement":195,"./reactProdInvariant":208,"_process":58,"fbjs/lib/invariant":17}],208:[function(require,module,exports){
arguments[4][179][0].apply(exports,arguments)
},{"dup":179}],209:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var _prodInvariant = require('./reactProdInvariant');

var ReactCurrentOwner = require('./ReactCurrentOwner');
var REACT_ELEMENT_TYPE = require('./ReactElementSymbol');

var getIteratorFn = require('./getIteratorFn');
var invariant = require('fbjs/lib/invariant');
var KeyEscapeUtils = require('./KeyEscapeUtils');
var warning = require('fbjs/lib/warning');

var SEPARATOR = '.';
var SUBSEPARATOR = ':';

/**
 * This is inlined from ReactElement since this file is shared between
 * isomorphic and renderers. We could extract this to a
 *
 */

/**
 * TODO: Test that a single child and an array with one item have the same key
 * pattern.
 */

var didWarnAboutMaps = false;

/**
 * Generate a key string that identifies a component within a set.
 *
 * @param {*} component A component that could contain a manual key.
 * @param {number} index Index that is used if a manual key is not provided.
 * @return {string}
 */
function getComponentKey(component, index) {
  // Do some typechecking here since we call this blindly. We want to ensure
  // that we don't block potential future ES APIs.
  if (component && typeof component === 'object' && component.key != null) {
    // Explicit key
    return KeyEscapeUtils.escape(component.key);
  }
  // Implicit key determined by the index in the set
  return index.toString(36);
}

/**
 * @param {?*} children Children tree container.
 * @param {!string} nameSoFar Name of the key path so far.
 * @param {!function} callback Callback to invoke with each child found.
 * @param {?*} traverseContext Used to pass information throughout the traversal
 * process.
 * @return {!number} The number of children in this subtree.
 */
function traverseAllChildrenImpl(children, nameSoFar, callback, traverseContext) {
  var type = typeof children;

  if (type === 'undefined' || type === 'boolean') {
    // All of the above are perceived as null.
    children = null;
  }

  if (children === null || type === 'string' || type === 'number' ||
  // The following is inlined from ReactElement. This means we can optimize
  // some checks. React Fiber also inlines this logic for similar purposes.
  type === 'object' && children.$$typeof === REACT_ELEMENT_TYPE) {
    callback(traverseContext, children,
    // If it's the only child, treat the name as if it was wrapped in an array
    // so that it's consistent if the number of children grows.
    nameSoFar === '' ? SEPARATOR + getComponentKey(children, 0) : nameSoFar);
    return 1;
  }

  var child;
  var nextName;
  var subtreeCount = 0; // Count of children found in the current subtree.
  var nextNamePrefix = nameSoFar === '' ? SEPARATOR : nameSoFar + SUBSEPARATOR;

  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      child = children[i];
      nextName = nextNamePrefix + getComponentKey(child, i);
      subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
    }
  } else {
    var iteratorFn = getIteratorFn(children);
    if (iteratorFn) {
      var iterator = iteratorFn.call(children);
      var step;
      if (iteratorFn !== children.entries) {
        var ii = 0;
        while (!(step = iterator.next()).done) {
          child = step.value;
          nextName = nextNamePrefix + getComponentKey(child, ii++);
          subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
        }
      } else {
        if (process.env.NODE_ENV !== 'production') {
          var mapsAsChildrenAddendum = '';
          if (ReactCurrentOwner.current) {
            var mapsAsChildrenOwnerName = ReactCurrentOwner.current.getName();
            if (mapsAsChildrenOwnerName) {
              mapsAsChildrenAddendum = ' Check the render method of `' + mapsAsChildrenOwnerName + '`.';
            }
          }
          process.env.NODE_ENV !== 'production' ? warning(didWarnAboutMaps, 'Using Maps as children is not yet fully supported. It is an ' + 'experimental feature that might be removed. Convert it to a ' + 'sequence / iterable of keyed ReactElements instead.%s', mapsAsChildrenAddendum) : void 0;
          didWarnAboutMaps = true;
        }
        // Iterator will provide entry [k,v] tuples rather than values.
        while (!(step = iterator.next()).done) {
          var entry = step.value;
          if (entry) {
            child = entry[1];
            nextName = nextNamePrefix + KeyEscapeUtils.escape(entry[0]) + SUBSEPARATOR + getComponentKey(child, 0);
            subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
          }
        }
      }
    } else if (type === 'object') {
      var addendum = '';
      if (process.env.NODE_ENV !== 'production') {
        addendum = ' If you meant to render a collection of children, use an array ' + 'instead or wrap the object using createFragment(object) from the ' + 'React add-ons.';
        if (children._isReactElement) {
          addendum = ' It looks like you\'re using an element created by a different ' + 'version of React. Make sure to use only one copy of React.';
        }
        if (ReactCurrentOwner.current) {
          var name = ReactCurrentOwner.current.getName();
          if (name) {
            addendum += ' Check the render method of `' + name + '`.';
          }
        }
      }
      var childrenString = String(children);
      !false ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Objects are not valid as a React child (found: %s).%s', childrenString === '[object Object]' ? 'object with keys {' + Object.keys(children).join(', ') + '}' : childrenString, addendum) : _prodInvariant('31', childrenString === '[object Object]' ? 'object with keys {' + Object.keys(children).join(', ') + '}' : childrenString, addendum) : void 0;
    }
  }

  return subtreeCount;
}

/**
 * Traverses children that are typically specified as `props.children`, but
 * might also be specified through attributes:
 *
 * - `traverseAllChildren(this.props.children, ...)`
 * - `traverseAllChildren(this.props.leftPanelChildren, ...)`
 *
 * The `traverseContext` is an optional argument that is passed through the
 * entire traversal. It can be used to store accumulations or anything else that
 * the callback might find relevant.
 *
 * @param {?*} children Children tree object.
 * @param {!function} callback To invoke upon traversing each child.
 * @param {?*} traverseContext Context for traversal.
 * @return {!number} The number of children in this subtree.
 */
function traverseAllChildren(children, callback, traverseContext) {
  if (children == null) {
    return 0;
  }

  return traverseAllChildrenImpl(children, '', callback, traverseContext);
}

module.exports = traverseAllChildren;
}).call(this,require('_process'))
},{"./KeyEscapeUtils":186,"./ReactCurrentOwner":193,"./ReactElementSymbol":196,"./getIteratorFn":206,"./reactProdInvariant":208,"_process":58,"fbjs/lib/invariant":17,"fbjs/lib/warning":24}],210:[function(require,module,exports){
'use strict';

module.exports = require('./lib/React');

},{"./lib/React":188}],211:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EventTarget;
(function (EventTarget) {
    EventTarget[EventTarget["click"] = 0] = "click";
    EventTarget[EventTarget["dblclick"] = 1] = "dblclick";
    EventTarget[EventTarget["mousedown"] = 2] = "mousedown";
    EventTarget[EventTarget["mouseup"] = 3] = "mouseup";
})(EventTarget = exports.EventTarget || (exports.EventTarget = {}));

},{}],212:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UnitImageModule = require("./standardMap/default/unit-image");
const BoardComponentModule = require("./standardMap/default/board-component");
var standardMap;
(function (standardMap) {
    class UnitImage extends UnitImageModule.UnitImage {
    }
    standardMap.UnitImage = UnitImage;
    class BoardComponent extends BoardComponentModule.BoardComponent {
    }
    standardMap.BoardComponent = BoardComponent;
})(standardMap = exports.standardMap || (exports.standardMap = {}));

},{"./standardMap/default/board-component":213,"./standardMap/default/unit-image":220}],213:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const standardRule_1 = require("./../../standardRule");
const map_component_1 = require("./map-component");
const units_component_1 = require("./units-component");
const orders_component_1 = require("./orders-component");
const state_component_1 = require("./state-component");
class BoardComponent extends standardRule_1.standardRule.BoardComponent {
    constructor() {
        super(...arguments);
        this.MapComponent = map_component_1.MapComponent;
        this.UnitsComponent = units_component_1.UnitsComponent;
        this.OrdersComponent = orders_component_1.OrdersComponent;
        this.StateComponent = state_component_1.StateComponent;
        this.width = 900;
        this.height = 787;
    }
}
exports.BoardComponent = BoardComponent;

},{"./../../standardRule":222,"./map-component":215,"./orders-component":217,"./state-component":219,"./units-component":221}],214:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const diplomacy = require("js-diplomacy");
const { England, Russia, France, Germany, Italy, Austria, Turkey } = diplomacy.standardMap.Power;
function powers(power) {
    switch (power) {
        case England:
            return 'rgb(239, 154, 154)';
        case Russia:
            return 'rgb(206, 147, 216)';
        case France:
            return 'rgb(144, 202, 249)';
        case Germany:
            return 'rgb(150, 150, 150)';
        case Italy:
            return 'rgb(159, 168, 218)';
        case Austria:
            return 'rgb(255, 224, 130)';
        case Turkey:
            return 'rgb(255, 171, 145)';
    }
}
class Colors {
    constructor() {
        this.neutralProvince = "rgb(129, 199, 132)";
        this.fill = "black";
        this.border = "white";
        this.dislodged = "red";
        this.margin = "white";
    }
    power(power) { return powers(power); }
}
exports.Colors = Colors;
exports.colors = new Colors();
exports.size = {
    unitRadius: Math.sqrt(30 * 30 + 20 * 20) / 2,
    arrowHeadLength: Math.sqrt(30 * 30 + 20 * 20) / 4,
    marginStrokeWidth: 0.5,
    strokeWidth: 2,
    standoffRadius: 10,
    standoffWidth: 3,
    standoffMarginWidth: 0.5
};

},{"js-diplomacy":27}],215:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const ReactDOM = require("react-dom");
const event_target_1 = require("../../event-target");
const map_image_1 = require("./map-image");
const position_1 = require("./position");
const configs_1 = require("./configs");
class MapComponent extends React.Component {
    constructor() {
        super(...arguments);
        this.colors = configs_1.colors;
        this.size = configs_1.size;
    }
    render() {
        // Render standoff markers
        const standoffs = Array.from(this.props.provinces).map(elem => {
            if (elem.status && elem.status.standoff) {
                const { x, y } = this.positionOf(elem.province);
                const s = this.size.standoffWidth / 2;
                const r = this.size.standoffRadius;
                return React.createElement("polygon", { points: `${s},${r} ${s},${s} ${r},${s} ${r},${-s} ${s},${-s} ${s},${-r} ` +
                        `${-s},${-r} ${-s},${-s} ${-r},${-s} ${-r},${s} ${-s},${s} ${-s},${r}`, stroke: this.colors.border || undefined, strokeWidth: this.size.standoffMarginWidth || undefined, fill: this.colors.fill || undefined, transform: `translate(${x}, ${y}, rotate(45))` });
            }
            else {
                return null;
            }
        }).filter(x => x !== null);
        return React.createElement("g", null,
            React.createElement(map_image_1.MapImage, null),
            standoffs);
    }
    componentDidMount() {
        this.update();
    }
    componentDidUpdate() {
        this.update();
    }
    update() {
        const map = ReactDOM.findDOMNode(this);
        /* Render province informations */
        // Supply centers
        this.props.map.provinces.forEach(province => {
            const tgt = map.querySelector(`.supply_center.${province.name}`);
            if (!tgt)
                throw province.toString();
            if (province.isSupplyCenter) {
                tgt.style.display = "";
            }
            else {
                tgt.style.display = "none";
            }
        });
        // name
        this.props.map.locations.forEach(location => {
            const name = this.locationNameOf(location);
            if (name) {
                const tgt = map.querySelector(`.locaton_name.${location.name}`);
                if (tgt) {
                    tgt.innerHTML = name;
                }
            }
        });
        this.props.map.provinces.forEach(province => {
            const name = this.provinceNameOf(province);
            if (name) {
                const tgt = map.querySelector(`.name.${province.name}`);
                if (tgt) {
                    tgt.innerHTML = name;
                }
            }
        });
        // occupied
        this.props.provinces.forEach(elem => {
            const province = elem.province;
            const color = (elem.status && elem.status.occupied)
                ? this.colors.power(elem.status.occupied)
                : this.colors.neutralProvince;
            const tgt = map.querySelector(`.${province.name}`);
            if (tgt && !(tgt.classList.contains("fix-color"))) {
                tgt.style.fill = color;
                tgt.style.stroke = color;
            }
        });
        // Add eventlistener
        this.props.map.provinces.forEach(province => {
            Array.from(map.querySelectorAll(`.${province.name}`)).forEach(dom => {
                dom.addEventListener('click', () => {
                    if (this.props.on) {
                        this.props.on(event_target_1.EventTarget.click, province);
                    }
                });
                dom.addEventListener('dblclick', () => {
                    if (this.props.on) {
                        this.props.on(event_target_1.EventTarget.dblclick, province);
                    }
                });
                dom.addEventListener('mousedown', () => {
                    if (this.props.on) {
                        this.props.on(event_target_1.EventTarget.mousedown, province);
                    }
                });
                dom.addEventListener('mouseup', () => {
                    if (this.props.on) {
                        this.props.on(event_target_1.EventTarget.mouseup, province);
                    }
                });
            });
        });
    }
    positionOf(province) {
        return position_1.provincePositionOf(province);
    }
    provinceNameOf(province) {
        return null;
    }
    locationNameOf(location) {
        return null;
    }
}
exports.MapComponent = MapComponent;

},{"../../event-target":211,"./configs":214,"./map-image":216,"./position":218,"react":210,"react-dom":59}],216:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
class MapImage extends React.Component {
    render() {
        return React.createElement("g", null,
            React.createElement("g", { className: "fix-color NAt", fill: "#bbdefb", stroke: "#bbdefb" },
                React.createElement("path", { d: "M.8.8c-.4 17.6 0 35.3 0 53V494c1.8 2 5.4 2 8 3.3l63.4 21.2c2.6-1 4-3.8 6.3-5.4 9-8.4 17.6-17.4 26.6-25.7 16.2-7.6 32.4-15 48.5-22.7 23.2-.7 46.4-1 69.6-2 1.7-1.3.2-4 .3-5.8-.5-2.8-1-5.6-1.2-8.4 5.7-1 11.4-1.6 17-2.6 1.7-1.6-1-4.2-1-6 .5-2 3.4-3.4 4.8-5 3-2.3 5.2-6.2 9.4-5.4 4.8-.8 9.5 0 14 2 1.5.7 5 .4 3.5 3-.7 4.7-1.8 9.4-2.4 14.2 1.3 1.8 4-.3 6 0 7.2-1.7 14.6-2.6 21.7-4.5.4-2.7.5-6 0-9-4.3-.3-8.7.7-13 .7-2.2-2-3-5-2.5-8.2 0-6.3.2-12.6 0-19-1.6-2.8-3.6-5.5-7.2-3.7-1.7 0-4.6 1.8-5-1-2-5.4-4.8-10.6-6.4-16 3-1 6.7-1 9.6-2.4 1.4-4.6 3.8-9 4.6-13.7-.6-2.3-4-4-2.2-6.5.6-2.3 2.8-4.6 2.4-7-19.8-16.6-39.8-33-59.4-50-12.8-18-26-35.6-38.6-53.7-2.2-10.4-2.5-21.2-4-31.7-.6-2 .3-5-1.8-6.2-2.5.5-2.3 4-3.3 6-1 3-5 3.4-7.2 5.3l-36.4 20c-15.2-4.7-30.6-9-45.7-14-.8-.7-3-3.3-.6-3 3.5-.5 7.3-.3 10.7-1.4-.8-4-3.5-7.5-5-11.3-1.6-2-1.8-5.8-5-5.7-3.8-1-8-1.4-11.6-2.6-.4-1.5-.2-3 1.8-2.6 6.8-.4 13.6-.7 20.3-1.5 1.5-1.7-1-4-1.4-5.6-1.5-2.8-2.4-6.4-4.7-8.5-7.6.6-15.2 1-22.8 1.3 5.3-8 10.8-15.8 16.5-23.4 6.2 4 12.8 8 18.3 13 1 3.7 1 7.8 2.6 11.2 2 .8 2.3-2.8 3.3-4l5-10.6c8.8-1.4 17.6-3 26.5-4 2.8.6 4.8 3.4 7.6 3.4 3-1.7 6.6-3.2 9-5.5.7-2.7-1-6.8 2.4-8 2.4-.8.8-3-.4-4-13.6-17.4-27.5-34.5-41-52C100.8 89 91 68 81.5 47.2V1.4c-2-2-5.8-.3-8.4-.8H1.5L1 .7H.8z", strokeWidth: ".5" }),
                React.createElement("path", { d: "M98.3 193.8c-.5 0-1.2.3-1 1 0 .4 0 1.2.5 1.6.4.3 1 0 1.3-.5.3-.6.8-1.2.5-1.8-.3-.4-.8-.4-1.2-.4zM171.7 212.6c-.6 0-.8.6-1 1.2l-.8 2.7c0 .7.7 1 1.2.8.3-.2.5 0 .7 0 .5.3 1-.3 1-1 0-1-.2-2-.4-3.2-.2-.2-.5-.5-1-.4z", strokeWidth: ".1" })),
            React.createElement("path", { className: "fix-color Nrg", d: "M81 .5c-.3 15.2 0 30.6 0 45.8 9.7 21.2 19.7 42.4 29.6 63.5l43 54c4.6 1.6 9.6 2 14.2 3.4-1 4-1.5 8 0 12 .8 2.5.4 6.6 4.2 6.7 2.6 1 6.6 1 6.7 4.8 1.4 4 3.4 8.4 4.2 12.6-3.4 2.7-8 4-10.7 7.5 0 5.3 1.2 11 1.6 16.3 1 8.6 1.5 17.3 3 25.8 12.4 19 26 37 39.2 55.4 19.8 16.4 39 33.4 59.3 49.2 2.4 1.8 5.7-.3 8.4 0 5-.6 10-2 15-2 2.3 2 2.6 4.2.3 6.5-3 5.6-6.5 10.8-9 16.4 1 2 4-.2 5.5-.4 3.4-1 6.7-3.5 10.3-1.7 3.3 2 5.5-1.2 7.7-3 4.2-4 9-7.6 12.8-11.8 3.7-14.8 7.3-29.7 11.5-44.3 7.6-7.7 15.4-15.2 23.4-22.4 9.8-4.5 20-8.5 29.5-13.3 6.6-6 12.6-13.2 20-18.5 6-1.8 12.4-2.6 18.3-4.8 4.4-4.5 7-10.5 10.5-15.7 6.6-10.7 13.2-21.5 20-32 5-4.6 10.2-9 15-13.8 2.6-11.6 4.8-23.5 7.7-35 9.3-13.6 17-28.5 28.8-40.2 2.4-3 5.6-5.3 7.4-8.6-.7-3.2-4.2-5-6-7.4-3.6-2-3-4.6-.6-7.4 2-1.8 2.2-6.5 5.2-6 2.7 0 6 1.2 7.7-1.6 7-6.4 14.6-12.4 21.4-19-1.5-3.5-5-6.5-6.5-10 3.8-6 8-11.8 12.6-17.4 3.7 3.7 6 8.7 10 12 6.7-1 13.7-1 20.4-2.5-.6-2.5-4-3.8-5.6-6-1-1-3.2-2.3-3.2-3.5 6.6-5 14.3-8.6 20.7-14 1.2-2.4-.7-5.3-.6-7.8-1.2-7.3-1.8-14.7-3.4-22-8.3-.5-17 0-25.5 0H81z", fill: "#bbdefb", stroke: "#bbdefb", strokeWidth: ".5" }),
            React.createElement("path", { className: "fix-color Bar", d: "M591.4.8c0 3 1 6.2 1.2 9.3 1 6.4 1.6 12.6 2.8 18.8 1.4 1.4 2.8-1.2 4-1.8 4.2-4 8.4-8 12.7-11.8 14.3-.7 28.6-1 42.8-1.4 2.8.8 4.6 3.4 7 5 7.8 5.8 16.5 10.2 24.5 15.5 0 2 0 4-.6 5.7-3.3 2.8-6.4 6-10 8.5C672 48 668 46.3 664 46c-.8 1.6-.5 4.2 1.8 4.5 6.4 3 12.7 6.6 19.2 9.5 4.2-1.2 8.2-3.6 12.4-4.7l12 3c3.6 5.5 7 11.3 10.7 16.7 6 1.4 12.3 1.4 18.4 2.2 2 0 4.2.3 5.8 2 20 13.6 39.8 27.4 59.6 41.5 1 7.3 1.4 14.7 2 22l-9 23.7c-6 2-12 4-17.8 6.2l-40.4-9c-10.6-7-21.2-14.3-31.7-21.5-2 0-3 2.6-4.7 3.6-1.2 1.4-2.8 2.5-3.7 4.2.3 1.7 2.8 2 4 2.8 3 1.6 6.5 2.3 9 4.4l19.4 20c-.3 4.7-1.4 9.4-1.2 14 1.4 7.4 2 15 4 22 2.3 2.8 5.5 5 8 7.5 5 4 9.4 8.5 14.5 12 4 0 8.3-.6 12.4-1.2 1.4-1.3-1-2.7-1.7-4-5.4-7.4-11-14.7-16.7-22 2.2-3.2 4.2-6.7 6.5-9.8 10.2 4 20 9 30 13.4 2.5 1.6 5-1.2 7.4-1.8 1.7-1 4-1.4 5.4-2.7-1-3-3.5-5.8-5-8.7-1.4-2.4-3.3-4.7-4.3-7 6.6-7.3 14-13.8 21-20.6 2.7-2.6 5.4-5.2 8.3-7.7 4.5 2.5 8.8 5.4 13.3 7.7 1.7-.2 2-2.7 3.3-4 3-4.5 6-9 8.7-14-.4-2.4-3-4-4.3-6-2-2.5-5-4.7-6.3-7.7-.7-14-1.5-28.2-2-42.3 9 2 18 3.8 27 6 3.6 4.3 7 8.7 10 13.2-5 3-10.3 5.8-15 9-.5 3.3-.6 6.8-.5 10 3 4.8 5.7 9.8 9 14.4 3.2.3 6.6-.6 10-.7 3.8-.4 7.8-.6 11.7-1.3 1.2-2 .7-4.5 1.3-6.6.4-4 1-8 1.3-12 4-2 8.3-3 12.2-4.8.6-3.4 0-7.2.2-10.7V1.3c-1.2-1.7-4-.4-6-.8h-302l-.3.3z", fill: "#bbdefb", stroke: "#bbdefb", strokeWidth: ".4" }),
            React.createElement("path", { className: "fix-color Nth", d: "M390.4 281.8l-29.8 13.4c-7.6 7.4-15.5 14.5-22.8 22-4.2 14.8-7.5 29.7-11.6 44.4-4.7 5.4-11 9.5-15.8 14.8 0 1.8 2.4 1.6 3.5 2.3 1.7.4 2.2 2.4 3 3.7-4 8-8.3 16-12.4 24 .3 2 3.2 2.7 4.5 4.2 2 1.6 5 2.7 5 5.4 1.6 5.8 3 11.7 4.7 17.4 3.6 3.4 8.2 5.8 12 9 3.3 8.7 8 17 9.3 26.2 0 1.6.7 3 2.5 3 3.3.5 6.7.8 9.8 1.7 2.2 3 4.6 6.2 5 10 .5 3.5 4.2 5 6.3 7.2 3.2 2.5 6 5.5 9.4 7.7 2.6-.3 5.4.2 8-.5 3.5-9.2 7.3-18.4 10.6-27.6 1.6-13.6 2.8-27.3 4.7-41 4.4-2.7 9.6-4.4 14.4-6.6 6-2.8 12.4-5.3 18.4-8 1.4-3.3.7-7 1-10.3-.7-1.8-3.7-1.3-5.4-2-3.4-1.3-7.5-1.4-10-4.2-3.4-2.4-6.6-5-9.8-7.4.4-4.3-.3-8.8.8-13 2-3 5.6-4.4 7.7-7 0-2-2.3-2.8-3.3-4-3.2-3.2-7-6-9.5-9.4-2.3-8.2-5-16.4-7-24.7l-2-49.8c0-.5-.5-.8-1-.7z", fill: "#bbdefb", stroke: "#bbdefb", strokeWidth: ".4" }),
            React.createElement("path", { className: "fix-color Iri", d: "M281.3 446.8c-4.5 1-9 1.7-13.4 2.6-1.5 1.2 0 3.3 0 5 .7 3 1.7 6 2 9.3-2 7-4.4 13.7-7 20.5-4.5 1.4-9.6 1.3-13.8 4l-15.4 7.7-13.3-6.4c0-2.2-.8-4.7 2-5.2 2.7-1.7 6-2.8 8.3-5 1.6-4.7 3-9.5 4-14.4-.7-1.5-3-1-4.5-1.4-4.7-.8-9.4-1.2-14-.8-21 .6-42 1-62.8 1.7-16.2 7.7-32.5 15.2-48.7 23L74.2 517c-.5 2.6 3.6 1 5.2 1.5 18.8.2 37.7.2 56.5.5 24.8 3.7 49.7 7.5 74.6 11 21.4-2.5 42.7-5.3 64-8 3.3-2.2 6.5-4.7 9.5-7.2 1.7-3 3-6.5 5-9.3 2.5-1.7 5.7-2.6 7.8-5 .7-1.4.4-3.6-1.7-3.4-5.3-1.3-11-2.6-16.2-4.2-.7-1-2.5-2.5-.6-3.3 3.8-3.4 8.2-6.2 11.5-10 .7-1.5.6-4-1.5-4-1.6-1.2-5-1-4.4-3.6.4-1.8-1.4-5.3 1.2-5.4 3.7-1.2 8-1.4 11-4.3 2.4-2.3 6-3.8 7.8-7 .7-2.7-2.5-4.4-4-6.3-1.8-1.5-3-3.7-5.3-4.7l-13.2 2.5z", fill: "#bbdefb", stroke: "#bbdefb", strokeWidth: ".4" }),
            React.createElement("path", { className: "fix-color Eng", d: "M357.4 485.5c-2.4 1.5-4 4.2-6 6.2-1.7 2-3.7 3.7-5 6 1 2 3.5 2.8 5 4.2 2.3 1.3.3 3.6-2 3-8.6 1.5-17.4 2.6-26 4.2-15.3 5.2-30.7 10.6-46 15.5-1-1.4-1.5-3.8-3.7-3-19.6 2.6-39 5-58.6 8-1.6 1.5 1.8 2 3 2.3l66.8 18.5c4.7-.8 9.4-2.5 14-3 4.6 1.2 9 3 13.6 4 3.3-1.3 6.7-3 9.8-4.7.5-1.7-1-3.6-1.2-5.4l-2-6.7c1-.8 2-2.5 3.5-1.4 3.8 1.4 7.5 3.5 11.4 4.4 3.2-2.2 6-5.5 9.4-7.7 4-3 8.6-5.6 12.6-8.7.4-4.4 0-9 0-13.4 2.4-2.6 4.3-6 7-8 2.6-.4 5.5-1 7.8-2.3.6-1.7-2-2.4-2.8-3.6-3.4-2.7-6.7-6-10.4-8.5h-.2z", fill: "#bbdefb", stroke: "#bbdefb", strokeWidth: ".4" }),
            React.createElement("path", { className: "fix-color Hel", d: "M428.7 415c-6.6 1.8-12.7 5-19 7.6-4.5 2-9.2 3.7-13.4 6-1.2 5.8-1.5 11.7-2.3 17.5-.8 8.3-2 16.6-2.6 24.8 1.2 1.2 3.8 0 5.4 0 2.5-2.4 4.8-5 7-7.5 3.3-.6 7 1 9.5-1.6 3.2-1.8 6.2-4.3 9-6.7 3.6 1 6.6 3.5 10.2 4.3 2-1.5 3.5-3.8 4.7-6-.5-6.8-1.8-13.6-2.7-20.3-1.6-6-3-12-5-18-.3 0-.6-.2-.8 0z", fill: "#bbdefb", stroke: "#bbdefb", strokeWidth: ".4" }),
            React.createElement("path", { className: "fix-color Ska", d: "M458.6 343.2c-4 1.3-8 2-11.5 4L431.7 369c-6 .3-12 .3-17.8 1-2.8 2.5-6 4.7-8.6 7.5-.4 4.3-.7 8.7-.3 13 3.7 3.3 8 6.4 12.2 9.5 4 1 8.2 2.6 12.4 3 1.6-1.3 1.6-4 2.6-6 1-1.5.6-5 3-5 3.4-.8 5.7-4 8.4-6 3-2.6 6-5 9-7.7l3.8 1c-1 6.4-3.8 12.6-3.2 19-.2 1.8 0 4.4 2.2 4.4 1.2.3 3.4 0 4 .8-3.2 5-7.2 9.6-10 15-.5 1.6-.3 4.5 2 4.5 2.5.5 5 1.5 7.4 0 1.4 0 2.3-1.4 1.5-2.8-.2-1-.8-2-1-3 3-.6 6 0 8.8-1 2-1.5 4-3 6-4.7 1.2 1 3.2 1.7 2 3.6 0 2-1.3 4.2-.6 6 1.7 1 4 .8 5.7.8 1.3-1.5.3-4 .6-6-.4-5.6-.3-11.3-1-16.8-5-10.8-10.2-21.6-15-32.5-.5-5.2-.8-10.5-1.5-15.7-1.6-2.5-2.7-5.5-4.8-7.6h-.6z", fill: "#bbdefb", stroke: "#bbdefb", strokeWidth: ".4" }),
            React.createElement("path", { className: "fix-color Mid", d: "M1.3 495c-1.4 1-.4 3.2-.8 4.8C0 556 .3 612.4.3 668.6v116.6c1.2 1.7 4 .4 6 .8h233c2-1.4 2.5-4.7 4.4-6.2 3.4-.7 7-.5 10.4-1.2 4.6-6.3 8.6-13.2 13-19.7 1.6-2.3 2.8-5 4.7-7 2.6-.6 5.3-2 8-2.2 2.6 1.4 4.8 3.6 7.5 5l19.8-1.5c1.4-1.2.5-3.6 1-5.2.2-5 .5-9.8.6-14.8-1-1.6-3 .4-4.5.5-3 1-6 3-9.4 2-2.4 0-5-.6-6.8 1.2-3.7 1.7-7.2 4-11 5.7-2-.4-5 1-6.2-1.4-4-4.3-7.6-8.8-11.7-13-5.7-.6-11.5-.6-17.2-1-1.2-1.4-4-2-3.4-4.5-.3-4.4.6-9-.5-13.3-1.3-2.3-4.3-2.4-6.3-3.5 0-4 2.5-7.4 3.8-11 2-4.6 4.3-9.2 6.2-14-1.2-8.5-2-17-3.6-25.7-1.2-3.8-3.4-7.4-4.5-11.3.5-1.7.7-3.7 1.7-5 6.2-2.7 12.4-5.8 18.6-8 20 2 40.2 4.2 60.2 6 2.2-1.2 4.7-2 6.6-3.8 2.2-8.5 4.8-17 6.5-25.6-.5-3.7-1-7.5-2-11-3.8-6-8.2-11.7-11.4-18-.7-1.6-.3-3.8-1.4-5.3l-24.7-12c-1-3.6-1.3-7.6-2.7-11-24.7-7-49.4-13.8-74-20.5-25.7-3.6-51.2-7.5-76.7-11-16.7-.6-33.6-.2-50.4-.3-4-.2-8 .4-11.7-.3L1.7 495h-.5z", fill: "#bbdefb", stroke: "#bbdefb", strokeWidth: ".4" }),
            React.createElement("path", { className: "fix-color Wes", d: "M433.8 687c-9.2 6-18 12.4-27.2 18.5h-66c-2.2 2-3.5 5-5.4 7-2 2.4-2 5.6-3.3 8.2-3.7 3-8.4 4.2-12.6 6.4-3.5 2-7.5 3-10.6 5.6-1 2.6-.5 5.6-.8 8.3 0 4-.5 8.2-.2 12.3 2 1.6 5 2.4 7.6 3.4 2.4 1.3 4.4-1.3 6.5-2l47-26.4c10.8 2 21.6 4.5 32.6 6 6.8-1.8 13.3-5 20-6.7 6 .8 11.5 3 17.4 3.2 3.4-.6 6-3.2 9.4-4.3 1.5-1 3.8-1.2 4.8-2.8-2-7-5.3-13.6-8-20.3-.6-2-1.3-5-4-3.3-2 1-4 1.4-5.2-1-2.2-1.2-2-3.3-1.6-5.5 0-2 .8-4.3.2-6.2 0-.4-.5-.2-.8-.3z", fill: "#bbdefb", stroke: "#bbdefb", strokeWidth: ".4" }),
            React.createElement("path", { className: "fix-color GoL", d: "M439.4 618.6c-6.8 4.3-12.6 10-19.4 14-3 2-6 4.7-9.4 6.4-7.8-.2-14.8-4-22-6.2-2.3-.2-3.3 2.7-5 3.8-3 3.4-6.6 6.5-9.5 10 0 3.3.4 6.7.4 10-4 3.6-7.7 7.3-12 10.5-2 0-4-1.8-6-1-4.3 4-9 7.4-13.3 11.4-2.3 4.8-4 10-5.5 15 1 4.3 1.7 9 3.2 13 2.3.8 5 0 7.6.3h58c9.7-6.2 19-13 28.5-19.4 1-2.6.8-6 3-8 1.8-2.7 3.8-5.3 5.7-8 2.3-.4 4 .2 4 2.7.8 1.2.7 4 2.6 3.6 1.6-2.5 2-5.8 3-8.6 1-4.5 3.3-8.8 2.7-13.5-.4-10-.5-20.3-1-30.4-3-1.6-6.6-2.4-10-3.7-1.7-.6-3.4-1.5-5.3-1.7zm6.8 22.7c1.3 1 2.6 2.2 2 4-.3 4.2 0 8.4-.6 12.5-1.6 2-2.5 5-4.7 6.5-2 1.2-2.7-.4-3-2.2l-4.2-12c3.5-2.8 7-6 10.4-8.7z", fill: "#bbdefb", stroke: "#bbdefb", strokeWidth: ".4" }),
            React.createElement("path", { className: "fix-color Tyn", d: "M455 626.3c-1 2.4 0 5.2-.2 7.7.2 8.6.6 17.2.5 25.7-2 6.6-4 13-5.7 19.7v14.4c-1.8 2-4 3.8-5.6 6 1.2 4.5 3.4 8.6 5 13 1.6 3.4 2.6 7.2 4.6 10.5 3.8 3 8 5.7 11.8 8.8-.2 2-1.7 4-1 6.2 1.4 1 3.5-.3 5.2-.2 3.8-.7 7.8-1 11.4-2 4.6-3.2 9.5-6 13.8-9.3.4-2-2.4-2-3.5-2.7l-9-3.8c.4-1.3-.2-3.7 1.8-3.7 2.4-.6 4.7-1.4 7 0 3 .7 5.7 2.4 8.6 2.6L513 716c-.8 1.8-.5 4.4 2.2 3.3 2-.2 4 0 6-1 0-4 .5-8 1.7-11.8 0-2.3 2.3-5 0-7-3.5-4.5-6.5-9.3-10.2-13.6-4.8-4-9.5-8.4-14.4-12.2l-19-9c-8-12.5-17-24.4-23.3-37.8-.3-.4-.6-.5-1-.3z", fill: "#bbdefb", stroke: "#bbdefb", strokeWidth: ".4" }),
            React.createElement("path", { className: "fix-color Ion", d: "M558.6 673.4c-3.4 1-7 2-10 3.5-.6 2 1.4 4 2 6-2 .7-4 2.2-6.2 2.5-3.3-1.4-6.6-3.3-10-4.4-2.2 1-6.2.5-6.7 3.7-.3 1.8-1 4 .8 5 2 2.3 3.8 4.5 5.4 6.8-3.5 7.2-7.4 14.3-11 21.4-3.3.5-6.8.4-10 1.3-1.2 1.4.3 3.5.2 5 .3 2.4 1.3 4.7-.2 6.7-.2 3-3 1.7-5 1.8-3 .2-5-2.6-7.4-3.8-1.8-.7-3.5-3.7-5.5-2.4-4.8 3-9.7 6.6-14.7 9.5-5.4 1-11 1.4-16.2 3-1.4 1 0 3 0 4.6.4 4.2 1.3 8.5 1.3 12.6-2.6 5-5.5 10-8 15.2.2 1.8 2.7 2 3.8 3.3 6.2 3.7 12.3 7.7 18.5 11.2H624c1.6-1.3.3-4.2.7-6 0-7.4.2-14.8 0-22-2-1.3-5-1.5-7.2-2.4-2.2-.8-4.8-1-6.7-2.3l-1.4-3c3.6-1.2 7.5-1.6 11-3 1-1.7-1.7-2.4-2.5-3.5-5.3-4-10.5-8-15.8-11.7-3-.5-6.4-.4-9.2-1.3-3.7-5-7.8-9.5-11-14.7-1.5-4.8-2.2-9.8-3.8-14.5-3-2-6.7-2.7-10-4-2-.7-2.8-3-4-4.8-2-6-3-12.6-4.8-18.8-.2-.3-.4-.7-.8-.6z", fill: "#bbdefb", stroke: "#bbdefb", strokeWidth: ".4" }),
            React.createElement("path", { className: "fix-color Adr", d: "M491.6 597.4c-3.8 2.3-7.7 4.8-11 7.6-.6 4-.2 8.3-.3 12.4 2.7 3.2 6.4 5.6 9.6 8.5 2.6 2 5.5 4.3 7 7.5 2.5 3.5 4.5 7.4 7.2 10.5 8.3 5.3 17.2 10 24.2 17 6.3 5.4 12.3 11 19.2 15.6 4-.4 7.6-2.3 11.3-3.3 1-1.7.2-4.4.5-6.4 0-3.4.5-6.7 0-10-4.7-4-9-8.3-13.8-12l-27.3-15c-6.7-6.7-13.8-13-20.4-20-1.8-4-3.2-8.5-5.5-12.4-.2-.3-.6-.2-1-.2z", fill: "#bbdefb", stroke: "#bbdefb", strokeWidth: ".4" }),
            React.createElement("path", { className: "fix-color Aeg", d: "M629.3 673c-2.6 1-5.3 1.8-8.2 1.3-3.2 0-6.6-.6-9.8 0-1 2.2-.6 4.8-.8 7.2-2 1.3-4 1.7-5.2-.7-1-.7-2.2-3-3.7-2.2-1 1.8-2.2 3.5-2.6 5.4 5.7 7.6 12 15 17.6 22.5.6 2.4 2 5.3 2 7.5-3.6.2-7.4-.3-11 .3-2 5.7-4 11.5-5.8 17.2 2 2.4 5.2 4 7.6 6 4.7 3.4 9 7 14 10.3 4.5 1.6 9 3.4 13.8 4.8 2-.8 2.8-3.3 4.3-4.8 3.3-2 7.3-3 10.7-4.7 3-4.5 6-9 8.7-13.6-.4-2-3-1-4.5-1.2-2-.8-3-3-4.7-4.5-1-1.7-4-2.8-3.5-5 0-2 1.2-4.6.3-6.6-2.2-1.3-5-.7-7.6-1.3-1-1.4-1.6-3.6-2-5.3 2 .2 4.3-.4 4.8-2.7.8-2 2.2-4 .7-6-1.2-3.4-2.8-6.7-3.6-10 1.7-3 5-5.4 5.8-9 .8-2.6-2-2.3-3.8-2.2-3.3.7-5.5-2.2-8.2-3.6-1.7-1-3.8.8-5.5 1z", fill: "#bbdefb", stroke: "#bbdefb", strokeWidth: ".4" }),
            React.createElement("path", { className: "fix-color Eas", d: "M661 729.3c-3.2 4.6-6 9.6-9.3 14-3.4 1.4-7 2.7-10.3 4.3-1.2 2-3 3.7-4 6 .3.8 2 2.6 0 2.4-4.2.7-8.5 1-12.7 1.8-1 2 0 4.6-.3 7 0 6.8 0 13.8.6 20.7 1.7 1 4.2.2 6.3.5h107c1.6-1 1.2-3.6 2-5.2 1.3-5.4 2.3-11 4-16.2 1.7-1.8 4-3.3 3.7-6 1-6.8 2.6-13.5 2.8-20.3-.3-1.7 0-4.7-2.4-4.7-4.4-1.2-8.7-2.6-13-3.5-3 2.7-5.7 6-8.6 8.8-9.8.5-19.5 1-29.3 0-6.5-.6-13-.8-19.6-1.5-5.5-2.7-11-5.8-16.4-8.3-.3 0-.5.2-.7.3z", fill: "#bbdefb", stroke: "#bbdefb", strokeWidth: ".4" }),
            React.createElement("path", { className: "fix-color Bla", d: "M778.8 569c-10 2.8-20.2 5.6-30.3 8.7-3.8 4-8 8-11.7 12 .4 2 2.5 3.7 3.6 5.5 1 2.4 3 2.6 5.3 2.3 2 .2 4.3-.6 5.3 1.5 1.3 1.6 3.3 3 2.6 5.3-.5 1.8 1 5.5-2 4.7-3.2.3-6.2-.4-9-2-2-1-3.7 1.7-5.6 2.4-3.2 1.7-6.2 4-9.4 5.5-2-.3-4-.4-5-2.4l-11.8-14c-.6-2.7 1.6-3.5 3.5-4.5 2.8-2 6.3-3 8.6-5.6.6-1.4-.5-3.2-2.2-2.6h-13.4c-1-2-1-4.7-2.8-6-4.6.2-9.2.5-13.7 1-3.5 4.3-6.2 9-9.3 13.6-1.7 2.4-3 5.2-3 8.3-4 4.3-8.4 8.3-12 12.8l-12 29.8c.6 2 3 3.3 4.4 5 2 1.5 3 3.2 2.3 5.7 0 2.4-1 5-.2 7.3 1.5 1.7 2 5.2 5 4.5 2.4 0 5.2.6 7-1.2 8.4-1.6 16.8-1.8 25-3l14.2-10c12.4 1.7 25 3.3 37.3 5.3 7.2 3.7 14.3 7.7 21.5 11.3 8.7 0 17.5-.2 26.2-.7 5.6-3.3 11.7-6 17-9.7 1.2-1.5 2.6-3.4 1-5.2-2.3-5.4-4-11-7-16.3-3.3-1-6.8-.6-10-1.2-.8-2.6-.6-6-3.3-7.4-5.8-5-11.2-10.5-17-15.3-3-.4-6.2-.2-9-1l-7-7c-.2-2-.2-4.2 2.6-4.6 2-.6 4-1.5 3.7-4 1-5.4 1.6-11 3-16.2 4.6-3 9.8-5.6 14.3-9 .6-1.7-2-2-3.2-2.7-1.2-.3-2.4-1-3.6-1z", fill: "#bbdefb", stroke: "#bbdefb", strokeWidth: ".4" }),
            React.createElement("path", { className: "fix-color Bal", d: "M528.5 369.8c-1.8.7-.6 3-.8 4.5 0 3 1 6.4.5 9.5L518 409.5c-6.2 4.5-12.3 9.4-18.7 13.7-3.2.6-6.4 1.7-9.6 2-4.4-2.2-9-4.5-14-3.8-.5 2 1.5 3.6 2 5.5 1.3 1.3-1 1.6-2 2.2-2.6 1-5.4.4-8.2.6-.3-2 0-4.5-2.2-5.3-2-1-4-3.5-6-1.8-1.8.7-4.6 1.2-3.4 3.6.5 1.5-2 1-2.8 1.4-1.6.7-5-.2-5 2.2 0 4 1.3 8.2 3 12 1 1.5 2.3 3 3.8 4 2.7-1 5-3 7.7-3.6 1.4.3 3.6.5 2.7 2.4-.3 1.3-1 4 1 4 4.7-1 8.6-4 13-5.7 3 .7 6 2.8 9 3.3 1.8-1.4 3.2-4.3 5.8-3.6 1.2 2 1.7 4.6 3.3 6.2 2.5 0 5.2 1.4 7.5 0 8.3-3.2 16.4-7 25.2-8.5 5.3-1 10.4-3 15.8-3 2.7.6 4.3 3.4 6.6 5 1.7 1.6 3.8-1 5.7-1.2 2.4-1 5.4-1.4 6.5-4.2 3.6-5.4 7.8-10.5 10.6-16.5 1-3.4.2-7-2.3-9.8-6.4-8-13.2-15.8-20-23.8-1.8-.7-2.7 2.2-4 3-1 1-1.8 2-2.7 2.7-3-3.2-2.6-7.7-3.2-11.7-3.3-3.4-7.5-6.2-11.2-9.3-1-.7-2-2-3.3-2z", fill: "#bbdefb", stroke: "#bbdefb", strokeWidth: ".4" }),
            React.createElement("path", { className: "Cly", d: "M297.6 355.5c-7.2 1-14.5 1.8-21.6 3-1.5 2.7-2.7 5.7-3.7 8.4.5 1.8 3 3.2 3 5-1.5 4.6-3 9.2-5 13.5-3 1-6.5 1-9.5 2.4.5 3 2.4 5.6 3.4 8.4 1.4 3 2.3 6 4 8.8 1.8.6 4-.5 5.7-.5 1-.2 2.8-1 3.2.8.5 1 1.8 2.5 3 1.2 2.2-1.7 4.8-3 6.7-5-.5-3-2-6-2-8.7 2-5.3 2.5-11 5.8-15.8 3.4-6 7.2-12.2 10.3-18.4-.4-1.3-1.7-3.3-3.4-3.3z", fill: "#81c784", stroke: "#81c784", strokeWidth: ".4" }),
            React.createElement("path", { className: "Edi", d: "M302.5 375.4c-4.6 1.8-9.5 3.3-14 5.3-1.5 4.2-2.6 8.7-3.8 13 1 5 2.8 10 5.5 14.4 5.4 10.2 11 20.2 16.6 30.3 1.7 1 3.7-1.2 5.5-1.5 2-1.2 4.7-1.6 6.2-3.5-.4-3.8-2-7.5-2.7-11.2-.8-2.7-1.3-5.8-2.4-8.5-3-2-6-4.3-9-6.5 4.2-8.2 8.7-16 12.6-24.3-.2-2.8-3-4.5-5.4-5-3-.8-6-1.8-9-2.3z", fill: "#81c784", stroke: "#81c784", strokeWidth: ".4" }),
            React.createElement("path", { className: "Lvp", d: "M286.5 402.5c-2.7 1-5 3-7.4 5 .3 3 .7 6.3.5 9.4 0 5-.4 10-.2 15 1.4 1.4 2 4.6 4.6 3.8 3.7-.2 7.4-.7 11.2-1 0 3.3-.6 6.5 0 9.6 2.8 3 5.7 5.7 8.6 8.6 0 1.6.2 3.7-1.7 4.4-3.2 2.4-6.4 5.2-10 7-2.7 1-5.7 1.4-8.3 2.7 0 2.3-.4 4.7.2 6.8 2.2.8 4.5 2.4 7 2.4 7.5-2.3 15.2-4.3 22.5-7.2 2-1 .4-3.6.3-5.2-2-8-3.7-16.3-6-24.3-7-12.2-13.6-24.5-20.5-36.6-.2-.4-.5-.5-.8-.5z", fill: "#81c784", stroke: "#81c784", strokeWidth: ".4" }),
            React.createElement("path", { className: "Yor", d: "M318.6 434c-3.6 1-7 2.8-10.5 4.6-1 1 .4 2.6.4 3.8 2.3 9 4.4 18.2 6.8 27 3 3.3 5.4 6.8 8.5 9.8 1.5 0 3-1.6 4.4-2 4.2-2 8.4-4 12.3-6.2.6-1.7-.4-3.3-.6-5-.5-3-1-5.8-2.4-8.4-2.3-5.2-4.4-10.5-6.8-15.6-4-2.7-7.5-5.7-11.6-8h-.3z", fill: "#81c784", stroke: "#81c784", strokeWidth: ".3" }),
            React.createElement("path", { className: "Wal", d: "M314.8 468.8c-3.2.7-6.2 1.8-9.3 2.6-5 1.6-10.2 3-15.2 4.7-.8.7-.4 2-.6 2.7.2.8-.3 1.3-1 1.7l-11.4 9.6c-.6.8.4 1.6.7 2.3.3 1 1.2 1.2 2 1.3l16.6 4.2v3c-2.7 1.6-5.5 3-8.2 4.7-1 1.4-1.6 3-2.4 4.6l-2.5 5-8 6.2c-.4.8.6 1.7 1 2.4.2.7.7 2 1.6 1.4 15-5.2 30-10 45-15.4 1-.4.5-1.5.2-2.2l-5.5-15 6-13c0-1-1-1.6-1.6-2.4-2.2-2.7-4.3-5.4-6.6-8-.2-.2-.4-.2-.6-.2z", fill: "#81c784", stroke: "#81c784", strokeWidth: ".1" }),
            React.createElement("path", { className: "Lon", d: "M340.2 471l-17 8.3c-.7 1-1 2.2-1.6 3.3-1.4 3.2-3 6.3-4.3 9.5 0 1.2.7 2.3 1 3.3l5 13.6c.6.7 1.8 0 2.6 0l26-4c1-.4.7-1.7.5-2.5-.8-1-2-1.4-3-2.2l-3.2-2.4c3.7-4.5 7.6-8.7 11.3-13 .3-1-.2-2-.3-3-.2-1.2-.3-2.5-1-3.4l-3.8-5.6c-.8-.6-2-.4-3-.7l-9-1.4h-.3z", fill: "#81c784", stroke: "#81c784", strokeWidth: ".1" }),
            React.createElement("path", { className: "Bre", d: "M340 532.3c-1 .3-1.6 1.3-2.4 2l-3.7 3.5-12.3-5.2c-1 0-1.6 1-2.3 1.3-.7.3-.7 1.2-.4 1.8l3.3 10.8-10 4.8c-4.6-1.5-9-3-13.7-4.4-3 .5-5.8 1.4-8.7 2l-4.6 1c-1 .7-.2 2 0 2.8.5 2.8 1 5.8 1.8 8.6 1 1 2.5 1.3 3.7 2l21.3 10.3c.4 2 .6 4 1.2 6l11 17c.8 1 2 0 3 0l21-6.3c1-.6.3-2 .4-2.8l-4.6-36.5-3.6-18c0-.4-.4-.7-.8-.7z", fill: "#81c784", stroke: "#81c784", strokeWidth: ".1" }),
            React.createElement("path", { className: "Pic", d: "M362 500.2c-1.8 2-3.5 4.4-5.3 6.6-.7.5-1 1.4-.8 2.3-.2 4.2-.2 8.3-.2 12.4l-15.2 10c-.6.7 0 1.7 0 2.5 1 5.7 2.2 11.5 3.4 17.2.6 1 2 .5 2.8.4l33.3-5.2c1-.4.7-1.7 1-2.5l3.5-20.4c-.2-1-1.2-1.6-1.8-2.4-6.5-7-13-14-19.7-20.8-.3-.2-.5-.3-1-.2z", fill: "#81c784", stroke: "#81c784", strokeWidth: ".1" }),
            React.createElement("path", { className: "Bur", d: "M384.7 523.4c-1 .4-.7 1.6-1 2.4-1.2 6.8-2.4 13.6-3.4 20.4l1.7 14.2c-4.7 11.7-9.7 23.3-14.5 35-.5.7-.6 1.5 0 2 2.6 5.4 5.2 10.6 8 15.8.7.7 1.7 0 2.6-.2l10.8-2.6c1-.5.6-1.7 1-2.5l3-19.4c5.2-1.6 10.3-3.2 15.5-5 1.4-1.2 2.6-3 4-4.3 4-5 8.3-10 12.4-14.8l5-16c.4-2 1-3.6 1.4-5.4 0-1-1.4-1-2-1.5l-16.5-7.6c-4.2-.5-8.3-1-12.5-1.3-5-3-9.8-6.3-14.8-9.3h-.5z", fill: "#81c784", stroke: "#81c784", strokeWidth: ".1" }),
            React.createElement("path", { className: "Par", d: "M379.6 546.2l-14.4 2-20.4 3.3c-1 .4-.4 1.7-.4 2.5l4.3 36c.6 1.2 1.8 1.8 2.6 2.7 1.5 1.4 3 3 4.7 4.2 1 .3 2.2 0 3.3 0l7.8-.4c1-.4 1-1.6 1.4-2.3l14-33.6c0-1.7-.3-3.4-.5-5l-1.3-9c-.2-.3-.6-.5-1-.5z", fill: "#81c784", stroke: "#81c784", strokeWidth: ".1" }),
            React.createElement("path", { className: "Gas", d: "M348.3 590l-22.7 6.7c-1 .7-.3 1.8-.2 2.7.4 3 1 6 1.6 9l-6.7 24.5c0 .8 1 1.4 1.6 2 1.6 2 3.3 3.8 5 5.6 1.8.7 3.7 1 5.6 1.5 4.3 1.2 8.6 2.3 13 3.3 1 0 1-1.4 1.2-2.2 2-7 3.8-14 5.6-21.2 2.6-1.7 5.4-3 8-4.7 5-1 9.8-2 14.6-3.3 1-.5.3-1.5 0-2.2l-7.5-15c-.7-.7-2-.2-2.8-.3l-8.5.4c-2.4-2-4.7-4.4-7.2-6.5h-.7z", fill: "#81c784", stroke: "#81c784", strokeWidth: ".1" }),
            React.createElement("path", { className: "Mar", d: "M408 583.4c-5 1.5-10 3-15 4.7-1 .7-.7 2-1 2.8-1 6.4-2 12.8-3.2 19.2l-28.5 6.7c-2.7 1.6-5.5 3-8 4.8-.7 1-.7 2-1 3-1.8 6.8-3.6 13.3-5.2 20 0 1 1 1.2 1.8 1.4l6 1.2c.2 1 0 2.2.5 3.2.5.7 1.6.3 2.4.5l17 1.4c1 0 .8-1.3.8-2v-3.8c4.3-4.6 8.7-9.2 13.2-13.7 5.7 1.7 11.3 4 17 5.8 2 .2 4 .5 6 .4 1.6-.5 2.8-1.8 4.2-2.6l8-5.8c.6-.8-.4-1.8-.7-2.6-3-6.5-6.2-13-9.4-19.4l6.4-6.6c.4-1 0-2 0-3l-1-6.8-6.3-6-3.4-3h-.5z", fill: "#81c784", stroke: "#81c784", strokeWidth: ".1" }),
            React.createElement("path", { className: "Spa", d: "M253.3 630.6l-18.3 8.2c-.8.7-.8 2-1.2 2.8-.2 1.2-1.2 2.4-.5 3.5 1.6 3.5 3 7 4.8 10.5.7.6 1.8.4 2.7.7 8.8 1.4 17.6 2.8 26.4 4.4.7 1 1.2 2 1.6 3.3-2.2 4-4.6 7.8-6.7 11.8-3 17.2-6 34.4-8.7 51.5 0 1.2 1.4 1 2 1 1.3 0 2.4 0 3.6.2 4 4.5 7.8 9 12 13.5.8.5 2 0 3 .3h4.7l11.4-6.4c2.6 0 5 .3 7.5.3 4-1.4 8-2.7 11.8-4.2 7.4-3.4 15-6.8 22.4-10.4 1.2-.6 1-2.2 1.4-3.2.5-1.3.6-2.7 1.2-4 2-3 4.3-5.8 6.3-8.8.2-1.3-.4-2.6-.6-4l-2.3-9.3c1.8-5 3.4-9.8 5.3-14.7l14.2-11.7 5.4 1.5c.8-.2 1.3-1 2-1.6l9.8-9c.4-.8 0-2 .2-3 0-.7 0-2-1-2-6.4-.7-12.7-1.2-19-1.7-.2-1 0-2.2-.4-3.2-.6-.6-1.7-.4-2.5-.7-8.2-1.8-16.3-4-24.4-6-2-2.2-4-4.5-6.3-6.7-.8-.5-1.7.4-2.4.7-1.7.8-3.2 1.8-4.8 2.5l-60-6.3h-.5z", fill: "#81c784", stroke: "#81c784", strokeWidth: ".1" }),
            React.createElement("path", { className: "Por", d: "M239 655.5c-1 0-.8 1.3-.6 2l3 23.8-10 22c0 .8-.2 2 0 2.8 1.3 1 2.8 1.2 4 2 1 0 1.7.4 2 1.2.6.5.8 1.2.7 2v13c.5 1 1.5 1.4 2.2 2 .8.8 1.7 1.8 3 1.6 3.2 0 6.4.4 9.6.4 1.2-.2 1-1.7 1.2-2.6l8.4-49.8c2-4 4.4-7.8 6.6-11.7 0-1-.7-1.7-1-2.6-.2-.7-.7-1.5-1.6-1.4l-26.7-4.4h-.6z", fill: "#81c784", stroke: "#81c784", strokeWidth: ".1" }),
            React.createElement("path", { className: "NAf", d: "M421.2 727.2c-6.5 2.2-13 4.7-19.5 7l-32.4-6c-1.2 0-2.2 1-3.3 1.5-16.4 9-32.7 18.3-49 27.4-3.5-1.2-6.8-2.8-10.2-4-2.7 0-5.4.4-8 .5l-12 1c-2.2-1.8-4.5-3.5-7-5-1-.3-1.8.4-2.8.5-2 .7-4 1.2-5.8 2-1 1-1.7 2.4-2.5 3.7-5 7.5-9.7 15-14.6 22.7-3.4.4-7 .5-10.4 1-.8.4-1 1.5-1.7 2.3-.7 1-1.6 2.2-2 3.5 0 1 1.2.8 2 .8 56.4.2 113 0 169.4 0h21.4c1 0 .7-1.2.4-2l-4.5-13.5 9.8-16.8c.2-2.3 0-4.6 0-7 .2-5 .2-10 .3-15.2-.3-1-1.7-.8-2.5-1-5-1.2-10-2.4-15-3.3z", fill: "#81c784", stroke: "#81c784", strokeWidth: ".1" }),
            React.createElement("path", { className: "Tun", d: "M453.8 723.7c-4.3 2-8.6 3.8-12.7 6.2l-2 1c-.3 0-.7.6-.7 1 0 4.8 0 9.6-.2 14.4v7.3c-3 5.4-6.3 11-9.5 16.4-.2 1 .4 2 .6 3l4.3 12.7c.6.8 1.8.3 2.7.4 13.7 0 27.4.2 41.2 0 1 0 1-1.2.3-1.6L457.3 772c2.7-5.4 5.7-10.7 8.4-16 0-1.7-.3-3.4-.5-5l-1.5-11.6c.7-2.4 1.5-4.7 2-7.2-.2-1-1.4-1.3-2-2l-9.3-6.4c-.2 0-.4-.2-.6 0z", fill: "#81c784", stroke: "#81c784", strokeWidth: ".1" }),
            React.createElement("path", { className: "Pie", d: "M456.3 588.3c-1.5.5-2.7 1.4-4 2l-33.5 1.4c-1 .2-.6 1.5-.6 2.3l1 8c-2 2-4.3 4-6.3 6.3-.7 1 .3 2 .6 2.8 3 6.5 6 13 9.3 19.3.7.8 1.6-.3 2.3-.8 5.8-4.5 11.5-9 17.4-13.4 3.2-2.5 6.6-5 9.6-7.7.8-.7 0-1.8 0-2.6-.4-1.6-.8-3.2-1-4.8l7.4-5c.6-.8 0-1.8-.2-2.7-.5-1.5-.8-3.2-1.4-4.7 0-.2-.4-.4-.7-.3z", fill: "#81c784", stroke: "#81c784", strokeWidth: ".1" }),
            React.createElement("path", { className: "Tus", d: "M452 608.2c-4 3-8 6.2-12 9.5-.4.7.4 1.3 1 1.5 4.5 1.7 9 3.2 13.4 5 1.7 2.8 3 5.8 4.6 8.8 1 1.6 1.7 3.4 2.7 5 .8.7 1.6-.4 2.3-.8l9-6c.7-1-.4-1.8-.7-2.6-1.8-3-3.6-6-5.6-9L453 608.4c-.3-.2-.6-.2-1 0z", fill: "#81c784", stroke: "#81c784", strokeWidth: ".1" }),
            React.createElement("path", { className: "Ven", d: "M493 584.6c-11.2 3.4-22.4 7-33.5 10.5-2.8 2-5.7 3.6-8.3 5.6-.8.6 0 1.7 0 2.5.4 1.8.7 3.6 1.2 5.3 1.2 1.2 2.7 2.2 4 3.4 3.4 2.8 7 5.6 10.2 8.5l7 11.4c2.5 1.7 5 3 7.7 4.7 1 .8 2.5 1.4 3.5 2.3 3.4 4.2 6.6 8.5 10 12.6.6.6 1.5.6 2 0 2.4-2.2 5-4.4 7.2-6.7.3-1-.7-1.7-1-2.5l-8-12.2-14.3-12v-13c3.8-2.5 7.6-5 11.2-7.6 1-.8.6-2.2.8-3.2.4-3 .8-5.8 1-8.6 0-.5-.4-1-1-.8z", fill: "#81c784", stroke: "#81c784", strokeWidth: ".1" }),
            React.createElement("path", { className: "Rom", d: "M472.7 631c-2.8 1.6-5.4 3.5-8 5.3-1 .6-2 1-2.7 2 0 1 1 1.6 1.4 2.5l15.7 23.5c1.5 1 3 1.5 4.6 2.3 5 2.4 10.2 5 15.3 7.3 1 0 1.3-1.2 2-1.7 2.4-3 5-5.8 7.3-8.8.3-1-1-1.5-1.5-2.2-3.5-3.2-7.2-6.3-10.8-9.4-3.8-4.7-7.4-9.5-11.2-14-3.8-2.4-7.6-4.8-11.6-7h-.5z", fill: "#81c784", stroke: "#81c784", strokeWidth: ".1" }),
            React.createElement("path", { className: "Apu", d: "M503.8 644l-7.8 7.4c-.6 1 .7 1.5 1.2 2l11 9.7c-.5.8-1.4 1.4-1.6 2.4 0 1 1.2 1.2 1.8 2 6.5 5 13 10 19.6 15.3 1 .4 2-.4 3-.5 1.2-.2 2.5-.7 3.8-.8l9.6 4.4c1 0 2-.7 2.8-1 1-.5 2.3-1 3.3-1.6.5-.8-.3-1.7-.6-2.5l-2-3.8c-5.2-4-10.4-8-15.3-12.6l-11.2-10c-5.6-3.4-11-7-16.7-10.3h-1z", fill: "#81c784", stroke: "#81c784", strokeWidth: ".1" }),
            React.createElement("path", { className: "Nap", d: "M506 665.7c-2 2.3-4 5-6.2 7.3-.6.5-.7 1.4 0 1.8 4.4 4 9 7.6 13.3 11.5l11 14.7c-1 3.8-2.2 7.6-3 11.5 0 1.7 0 3.5.3 5.3.5 1 2 .5 2.3-.5L534 697c.3-1-.8-2-1.4-2.8l-5-6c0-2 .5-3.7.7-5.5-.3-1-1.5-1.4-2.2-2l-19-15c-.4 0-.6-.2-1 0z", fill: "#81c784", stroke: "#81c784", strokeWidth: ".1" }),
            React.createElement("path", { className: "Bel", d: "M371.5 497.7c-2.7.7-5.4 1.3-8 2.2-.8.4-.2 1.3.4 1.8l20.2 21.4c5.3 3.3 10.5 6.8 16 10 1.5.3 3.2.2 5 .5 2.2 0 4.6.5 7 .5 1-.2.4-1.5.2-2.3-1-3.6-2-7-2.8-10.5.7-1.4 1.5-2.7 2-4 0-1.5.4-3 .3-4.3l-5.7-9c-2.5-1.7-5-3-7.6-4.7-1-.8-2 .2-3 .5l-7 2.6-7.5-5h-9.8z", fill: "#81c784", stroke: "#81c784", strokeWidth: ".1" }),
            React.createElement("path", { className: "Hol", d: "M415.2 460.4c-1.4.4-2.6 1.5-4 2.3h-6.8c-1 .4-1.5 1.4-2.2 2-2 2-3.7 4-5.5 6-1.8 0-3.5.2-5.3.4-1 .6-1 1.8-1.4 2.6-3 8-6 15.8-9.2 23.6-.2 1.2 1.3 1.4 2 2l5.8 3.7c1 0 1.8-.7 2.7-1 2.2-.7 4.3-1.6 6.5-2.4 2.7 1.4 5.2 3.2 8 4.5 1 0 1-1 1.5-2 .5-.7.8-1.5.6-2.5-.3-2.2-.6-4.4-.6-6.5 2.5-3 5.5-5.8 8-9 .5-.5 1-1 1.2-1.7 1-3.2 2-6.4 2.7-9.6-.2-1.8-1-3.5-1.3-5.3l-2-6.6c-.2-.2-.4-.4-.8-.4zm.3 23.5s0-.3 0 0z", fill: "#81c784", stroke: "#81c784", strokeWidth: ".1" }),
            React.createElement("path", { className: "Den", d: "M453 378.2h-.6c-3.7 3-7.2 6-10.8 9.2l-4.7 4c-1 .3-2.2 0-3 .6-.8.7-1 1.8-1.3 2.8l-3 8.5c0 4-.3 7.7-.5 11.5 1.6 6.3 3.3 12.6 4.8 19 0 .8.8 1.3 1.5 1h13c1-.4.5-1.7.5-2.5l-.2-3.4c2.3-.6 4.7-1 7-1.5 1-.4.3-1.6.3-2.5 0-.7-.2-1.7-1-1.7l-5-1-.7-3.8c3.2-5 6.8-9.6 10-14.5.5-.8-.5-1.3-1.2-1.3l-4.2-.6c-.2-3-.3-6.3-.3-9.5 1-4.2 2.2-8.3 3.3-12.5 0-1-1.3-1-2-1.4-.6 0-1.2-.4-1.8-.4zm21 33.2h-.2c-1.8 1-3.2 2.5-5 3.8-.5.5-1 1.3-2 1l-7 .5c-1 .3-.7 1.3-.4 2 .5 1 .8 2.3 1.5 3.3 1.7 1.3 3.8 2.3 5.6 3.6.3 1.4.3 3 .8 4.2.5.8 1.7.3 2.5.4 1.8-.2 3.8.2 5.6-.5 1-.6 2-1 2.7-1.7 0-1-.6-2-1-2.7l-2-4.4c.4-2.5 1-5 1.3-7.4-.2-1-1.2-1.3-2-2l-.6-.2z", fill: "#81c784", stroke: "#81c784", strokeWidth: ".1" }),
            React.createElement("path", { className: "Nwy", d: "M652.4 13.5l-40 1.3c-6 5.2-11.6 11-17.8 16.2-6.8 4.3-13.7 8.4-20.3 13-.3 1.7 2 2.5 3 3.8 2 2 4.4 4 6.5 6-7 .8-14.3 1.7-21.5 2.2-3.5-3.5-6-8.2-9.6-11.7-2 1.4-3.2 4-5 6-2.5 3.8-5.6 7.3-8 11.2 1.2 2.7 3.5 5 5 7.4.5 1 3 2.7 1 3.6l-23 20c-2.3 0-4.7-1-6.7-.4-2.5 3-4.4 6.6-6 10 1 2.2 3.4 3.7 5 5.6 1.5 1.6 3 3 4.4 4.8-5.8 6.7-12.2 13-17.8 19.8L482 162.6l-7.4 34.3c-5 4.6-10.2 9.2-15 14-10 15.7-20 31.4-29.5 47.2-6.2 1.7-12.7 2.7-18.8 4.8-5 2.6-8.6 7.5-12.8 11.2-2.3 2.5-5.2 4.6-7.2 7.4l2.3 52.5c2.4 8 4.6 16.2 7.3 24 4.3 4 8.4 8 12.8 11.8 5.8 0 11.6 0 17.3-.7 3.2-3 5.5-7 8.2-10.6l8.5-11.8c4-1.2 7.7-2.4 11.6-3.4 2 2.6 3.2 5.7 5.3 8 2.6-.4 5.7.4 8-1 3-12 5.4-24 8-36 1-5 2.5-10 3.2-15-2-14.5-4.5-29-6.5-43.4 6.6-12.6 14.2-24.7 21.3-37 10-12.8 20.3-25.4 30.2-38.2 4.6-23.4 8.7-46.8 12.7-70.3.8-3.5.8-7.3 1.6-10.7 3.2-1 6.5-1.7 9.7-.6 3.8.7 7.6 1.8 11.4 2.2 1.5-1.2 3.6-2.6 4-4.4 0-3.3-.5-7 0-10 3-3 5.7-6.7 9-9 3-.4 4.6 2.4 6.6 4 4.2 3.6 8 7.8 12.4 11.2 7.2.2 14.5.8 21.7.7 3.7-2.8 8-5 11.4-8.2 3-8.3 3.7-17.4 8.4-25l2.3-4 17 1.5c1.2 5.5 2.2 11 3.5 16.4 3 3.5 5.6 7.4 9 10.5 2 0 1.7-2.8 2.5-4 1.3-3.6 2.3-7.5 4-11 2.7-3.3 5.8-6.3 8.4-9.6-.4-2-3.4-2-5-3.3l-15-7.5c.4-1-1.2-4.2.8-3.4 3.7 1 7.5 2 11.2 2.6 3.4-2.5 6.6-5.6 9.6-8.7 1-1.7 1-4 1-5.8-10.5-6.7-21.7-12.2-31-20.6-1-.4-2 0-3.2 0z", fill: "#81c784", stroke: "#81c784", strokeWidth: ".4" }),
            React.createElement("path", { className: "Swe", d: "M568.5 87c-1.6.7-.6 3-1 4.5 0 2 .6 4.5 0 6.5-1.6 1-2.7 4-5 2.8-4.6-.8-9-2-13.7-2.6-2 .6-4.4.2-6 1.6-2.6 19-6.4 38-9.8 57l-4.3 23.8c-10 13-20.5 25.6-30.5 38.5-7 12.3-14.3 24.4-21.2 36.7 2 14.6 4.5 29.3 6.7 44l-11 50.7c-2.8.4-5.8 0-8.4 1-.3 4.4.8 9 1 13.4.3 4 3 7.3 4.3 11 3.7 8 7.7 16 11 24 .5 7.2.4 14.5 1.3 21.6 2.3 1.8 5.4 3 8.2 4 3.4-.6 6.8-1.3 10-2.4 6-4.6 12.2-9 18-13.7 3.5-8.8 7.2-17.6 10.5-26.5l-1.4-15c8.6-10.8 17-21.8 24-33.5 2.2-2-.2-5-.6-7.3-1.3-3.8-2-7.8-3.7-11.4-3-1.5-6.4-1-9.6-1.8-1.3-.5-.3-3-.7-4.5l-1.4-42.6c12-12 24.3-24 36.2-36 3.7-6 7.6-11.8 11.2-17.8-.2-2.3-2.2-4-3-6-1-1.7-2-3.3-2.8-5 6-7 12-13.8 18.2-20.6 4 0 8.2.5 12.2 0 1-1.7.5-4.2 1-6.2.4-6 1.3-12 1.4-17.8-2.2-12.7-3.2-25.5-4.6-38.2-5-7-10-14-15.2-20.7-7-4-14-7.8-21-11.5h-.5z", fill: "#81c784", stroke: "#81c784", strokeWidth: ".4" }),
            React.createElement("path", { className: "Fin", d: "M640 56.2c-1.8 1.5-2.5 4.3-3.8 6.4-3.6 6.7-4.5 14.5-6.7 21.7-.5 2.3-3.4 3-5 4.5-2.4 1.5-4.7 3.6-7.2 4.8l-21.7-.8c-5.5-5-10.5-10.5-16.4-15-2.5-1.4-4.3 1.6-6 3-1.3 2-3.7 3.4-4.3 5.7.6 1.8 3 2 4.5 3 5.6 3.3 11.4 6 16.8 9.5 5 6.7 9.8 13.5 14.7 20.2 1.2 13 2.7 26.3 4.6 39.3-.5 7.4-1.4 14.8-1.8 22.2 1 1.4 3 0 4.6 0 1-.4 2.3-.5 2.4 1.2 2.3 6 4.6 12.2 6.6 18.4-7.5 11.4-16 22-24.3 32.8-7 9.3-14.7 18.2-21.5 27.7 1 5.3 2.7 10.6 4 16 1.2 4.8 2.8 9.6 3.8 14.5-.6 6.2-1.8 12.4-2 18.6 1.8 2 4.6 2.8 6.8 4.2 2 1 4 2 4.5 4.3 1 1.8 1.5 4.5 3.5 5.4 7.2-.7 14.4-1.2 21.5-2 10.6-3 21-6.7 32-7.7 2.8-.7 6-.3 8.6-2 7.2-8.8 14.7-17.5 21.6-26.5 2.8-7 5.8-14 8.5-21-1-12.5-1.7-25-2.8-37.6L674 191.8c2-4.6 4.3-9 6-13.6-4.6-12-9.8-23.7-14.3-35.7 2-4.6 5.2-8.7 7.6-13.2-.2-2.4.3-5-.3-7.2l-10.3-9c-.6-6-.8-12.3-1.2-18.4 2.6-3 5.8-5.5 8-8.8-2.8-4-6.5-7.8-9.3-12-1-5-2-10.4-3.4-15.5-1.8-1.2-4.4-.6-6.5-1-3.4-.5-6.8-1-10.2-1z", fill: "#81c784", stroke: "#81c784", strokeWidth: ".4" }),
            React.createElement("path", { className: "StP", d: "M696.8 55c-4.2 2-8.8 3.4-12.8 5.6-3 3.5-6.5 6.6-9.2 10.3-1.8 5-3.2 10.2-5.2 15-2.7 3-6 5.8-8.3 9 .5 6 .4 12 1.4 17.8 1.7 2.5 4.5 4 6.6 6.2 1.5 1.7 4.4 2.8 3.7 5.4 0 2.7.6 5.7-1.5 7.8-2 3.5-4.8 6.7-5.8 10.6 4.4 12 9.5 23.6 14.2 35.5-2 4.6-4.4 9-6 13.8 3.6 12 7.5 23.8 11 35.7 1 12.6 2 25 2.8 37.6-3 7-5.6 14.3-8.7 21.2-6.7 8.5-14 16.7-20.4 25.5-1.4 1.8 1.3 3 2.5 3.8l7.3 5.2 1 8c-5.4 2.6-11 5.7-16.5 8-11.5-.2-23-.8-34.7-.8-4 2.8-8.4 5-12 8.2-1.3 1.5.4 3.4 2 3.5 8.5 2.5 17.3 4.2 25.8 6.8 6.6 3.5 13.6 6.4 20 10.2 1.2 1.8 1 4.3 1.8 6.3 2.2 8.7 4.5 17.3 5 26.3.3 2.6.2 5.4 1 8 3.7 1.8 7.8 2.7 11.7 4 3.5 1.2 7 2.6 10.4 3.2 21.5-12 42.7-24.7 64-37l68-39.8 48.6-39.8 34-5.2c1.6-1 .5-3.3 1-4.8.3-54.6 0-109.3 0-164-1-1.7-3.8 1-5.6 1-2 1-4.6 1.4-6.4 3-1 6-1.5 12.2-2.3 18.3-7.4.7-14.8 2-22.2 2-3-4.6-6-9.4-8.6-14.2v-9.8c5-3 10-5.6 14.8-8.8 0-2-2-3.3-2.7-5-2.2-2.8-4-6-6.7-8.5-9-2.2-17.7-4.3-26.7-6-1.6 1-.3 3.4-.6 5 .6 12.4 1 25 2 37.3.5 2.7 3.4 4.2 4.8 6.4 2 2.2 4.4 4.4 6 6.8-3.6 6.4-7.8 12.4-11.6 18.7-4.7-2.4-9.3-5.7-14-8-2.3 1-3.8 3.4-5.8 5-7.8 7.6-16 15-23.4 23 0 2 2 3.4 2.7 5.2 2.2 3.6 4.8 7.2 6.6 11-3.6 1.8-7.4 3-11 4.8-10.4-4.7-20.7-9.5-31-14-2 0-2.3 2.5-3.4 3.6-1.2 2.2-3 4.2-3.8 6.5l19.4 25.6c-4.5.6-9 1-13.7 1.4-7.4-6.2-15-12.5-22-19-1.8-6.3-2.3-13-3.5-19.2-1.3-5 .2-10 .5-15 1-3-2.5-4.4-4-6.5-5.5-5.5-10.8-11.3-16.4-16.8-4-2-9-3.7-12.6-5.8 2.6-3 5.6-5.5 8.4-8.2 10.8 7.3 21.6 14.8 32.5 22 13.4 3 26.8 6 40.2 8.7 5.8-2 11.7-4 17.4-6.2 2.3-4.4 3.7-9.2 5.6-13.8 1.3-3.5 3-7 4-10.5-.8-7.2-1-14.4-2.3-21.4-10-7.4-20.2-14.3-30.2-21.4-10.7-7.4-21.3-15-32-22-7.2-.8-14.4-1.4-21.5-2.3-4-5.4-7-11.4-11-17-4-1-8.3-2.2-12.5-3z", fill: "#81c784", stroke: "#81c784", strokeWidth: ".4" }),
            React.createElement("path", { className: "Lvn", d: "M606.6 347.8c-1.4 1-.4 3.2-.5 4.6.3 2.5 0 5.2 2 7 3 4.4 6.2 8.8 9 13.3-1.3 5.2-2.7 10.5-4.3 15.6-2.8.7-5.7 1.6-8.5 1.7-4.2-4-7.8-8.6-11.7-13-2.2-.3-4.2 1.6-6.2 2.2-2 1-4.2 1.5-4.5 4-1.7 5-4 10-5.5 15.3-.5 6.7-1.4 13.4-.8 20 .6 3-3 5-2.7 8 2.3 1.7 5.3 2.3 8 3.5 5.3 2 10.8 4 16.2 6.3 2.7 5.5 4.3 11.6 7.2 17 1.5 1.4 3.8.5 5.5 1 6 .3 11.8 1 17.7 1.2 6.5-4.7 13-9.3 19.4-14.2 5-12 10-23.8 14.7-35.8-1-9.3-1.5-18.7-4-27.7-1.3-4.3-2-9-3.5-13-7-3.8-14.3-7.3-21.6-10.7-8.6-2-17-4.5-25.8-6.2z", fill: "#81c784", stroke: "#81c784", strokeWidth: ".4" }),
            React.createElement("path", { className: "Mos", d: "M897.7 291c-11.2 1.6-22.4 3.2-33.5 5-16.3 13.3-32.4 27-49 39.8-8.2 5.6-17 10.2-25.6 15.3C755.8 371 722 390.8 688 410c-1.8.8-3.5 2.6-5.5 2.5-6.8-2-13.4-4.7-20.3-6.3-2.2 0-2 3-3 4.4l-12.7 31c-6 4.4-12.3 8.5-18 13.2-.5 2 1.8 3.4 2.5 5.2 7 10.5 13.8 21.3 21.4 31.5 1.4 2 3.8-.3 5.5-.6 7.3-3 14.5-6.3 21.8-9 15-.5 29.7-.8 44.5-1.6 7-4.6 13.6-10 20.7-14.4 17.7-1.8 35.4-4 53-5.7l72.7-2c6.4 2.5 13 4.8 19.2 7.6 2.6 2.2 5.2 4.8 8 7 2.2 0 1-3 1.3-4.3.2-56.2.2-112.4 0-168.6-.2-3 .2-6-.5-9-.3-.2-.7-.2-1 0z", fill: "#81c784", stroke: "#81c784", strokeWidth: ".4" }),
            React.createElement("path", { className: "Sev", d: "M833.4 459c-13 .5-26 .6-39 1.3-16.7 2-33.4 3.6-50 5.7-6.5 4.7-13.2 9.2-19.5 14-5 12.7-9.4 25.5-14.3 38-7 9-14 18.3-21.3 27-12.3 9-24.7 17.5-37 26.3-.6 2 2 3.6 3 5.4 4 5.7 7.6 11.7 11.8 17.2 3.6 2.4 7 5.3 10.7 7.7 1.8 0 1-3 2-4 3.3-5.8 7-11.4 11.2-16.8l13.8-1c1 1.8 1.2 4 2.5 5.8 5 .3 10.2-.4 15 .3.5 1.3 1 3-.6 3.4-3.7 2.4-8 4-11 7-1.2 2 1.3 3.5 2 5 3.7 4.3 7 9 11 12.7 3 2.4 6.5-.5 9-2 3-1.7 5.7-3.8 8.7-5 2.8 1 5.5 2.6 8.7 2.2 2.5.7 4-.7 3.4-3.3 0-2 .3-4.4-1.5-5.8-1.2-2-2.7-3.5-5.2-3-1.7-.3-4.4 1-5.5-.7l-5-6.5c4.4-4 8.4-8.6 12.8-12.4 10-3 20-5.8 30-8.6l7.5 3c-5.2 3.5-11 6.5-16 10-1.3 6-2 12.3-3 18.5-2 1.2-4.8 1.5-6 3.2-.7 2.5 1 4.4 2.7 5.8 2 1.6 3.4 4 5.7 5 2.8.2 5.7 0 8.3.6 6 5.5 11.7 11.3 18 16.3 2.4 1.2 5 0 7.6 0 3 0 6-1.2 8.5.6 6.7 2.7 13.3 6 20 8.4 13.7 2.4 27.4 4.5 41 7.3 5 4 10 8.3 15.2 12 3.4.5 6.8 1.5 10.2 1.3 1-1.6 0-4.3.4-6.3V474.5c-2.8-3.3-6.6-6-9.8-9-6.3-2.6-12.7-5.2-19-7.5l-37.2 1z", fill: "#81c784", stroke: "#81c784", strokeWidth: ".4" }),
            React.createElement("path", { className: "Rum", d: "M634.8 556.3c-2.5 4.5-4.5 9.5-7.2 14-5 3.4-10.4 6.7-15.4 10.4-4.5 9.6-8.4 19.6-14 28.8-1.4 1.7-2 3.6-.3 5.4 2.3 4.2 4.4 8.8 7 13 4.4.6 9.2 0 14 .3 3 0 6.4.2 9.6-.2 2.7-1.7 5.3-3.5 8-5.4 3.5 1.2 7.3 1.5 10.5 3.2 4 2.6 7.6 5.7 11.7 8 1.7-.3 1.6-2.8 2.4-4 2.2-5 4-10 6-15 3.8-4 7.7-7.7 11.3-11.7.2-1.7-2.5-2.3-3.5-3.6-3.4-2.8-7.6-4.7-9.7-8.7-4.5-6.5-8.7-13-13.5-19.4-5.3-5-10.4-10.4-16-15.2-.2-.2-.4.2-.7.3z", fill: "#81c784", stroke: "#81c784", strokeWidth: ".4" }),
            React.createElement("path", { className: "Ukr", d: "M723 480.4c-14.5.4-29 .8-43.5 1.4-9 3.7-18 7-26.6 11-6 8-11.7 16-17.5 24-9.5 4.3-19 8.4-28.3 13-.7 2 2.4 2 3.5 2.8 5.6 2.6 11.4 4.8 16.8 7.6 3 5.3 5.4 11 8.5 16.2 5.2 5 10.2 10.2 15.6 15 2-.4 3.7-2.5 5.6-3.4 10.8-7.6 21.7-15.2 32.5-23l21.5-27.4c4.4-12 9-24 13-36.3 0-.7-.6-1-1.2-1z", fill: "#81c784", stroke: "#81c784", strokeWidth: ".4" }),
            React.createElement("path", { className: "War", d: "M604 453.7c-5.4 5.4-10 11.6-15 17.3l-35 13.8c-1.2 1.3.4 3.2.5 4.8 2 7 3.7 14.3 6 21.3 3.7 4.4 7.5 9 11.3 13.3 0 3-.7 6-.2 8.7 2.7.2 5.6-.5 8.4-.6 8.5-.7 17-1 25.6-2 10-4.6 20.4-9 30.2-14.2 6-7.5 11.3-15.3 17-23 0-2-2.3-3.7-3.2-5.6-7-10.6-14.2-21.2-21.2-32-3.7-1-7.8-.5-11.6-1l-12.8-1z", fill: "#81c784", stroke: "#81c784", strokeWidth: ".4" }),
            React.createElement("path", { className: "Pru", d: "M572 426.7c-3.3 4-6 8.8-9.3 12.7l-9.2 3.6c-2.5-2-4.7-4.5-7.4-6-8.4 1.4-16.8 3.3-25 5.6-6 2.2-12 4.5-17.8 7-1.8 4-3.5 8.5-5 12.7 1.5 4.3 4 8.4 5 12.8.4 3.2 0 6.4.8 9.4 7.6.5 15.5.3 23.2.5h26.6c11.7-4.6 23.5-9 35.2-14 5-5.6 10-11.3 14.5-17.3.2-2.3-1.4-4.4-2-6.6-1.4-3.5-2.5-7.5-4.5-11-8-3.3-16.3-6-24.4-9.3h-.7z", fill: "#81c784", stroke: "#81c784", strokeWidth: ".4" }),
            React.createElement("path", { className: "Sil", d: "M503 484.4c-5.7 5-11.8 9.7-17.3 14.8-.6 2 2.6 3 2.8 5 .8 2.3 1 5 2 7.2 6.2-.5 12.3-2 18.4-3l35.6 18.7c2 3 3.2 6.2 5.3 8.6 4.5.8 9 2.2 13.7 2.5 2.6-1.6 5.5-3.4 7.7-5.6.2-2.8.8-5.6.3-8.3-3.6-4.4-7.7-8.6-11-13.3-2.8-8.3-4.7-17-7.3-25.3-3-.8-6.5-.3-9.7-.5-13.5-.3-27-.7-40.5-.6h-.2z", fill: "#81c784", stroke: "#81c784", strokeWidth: ".4" }),
            React.createElement("path", { className: "Gal", d: "M590.3 531.4c-6.3.6-12.7.7-19 1.6-2.8 1.3-5 3.5-7.7 5.2-4.6-.8-9.2-2.2-13.8-2.5-2.3 2.3-3.7 5.5-5.6 8-2 2 1.5 3 2.8 4 7.8 5.3 16.7 8.7 25.3 12.7 7.2 5 14.2 10.6 21.5 15.5 6.2 1.5 12.4 3 18.7 4.3 5.2-3.2 10.5-6.7 15.6-10.3 2.4-4.8 5.2-9.4 7-14.4-1.6-5-4.4-9.8-6.8-14.5-1.3-2-4.3-2.3-6.3-3.6-5.5-2.4-11-5-16.5-7l-15.2 1z", fill: "#81c784", stroke: "#81c784", strokeWidth: ".4" }),
            React.createElement("path", { className: "Ber", d: "M493 442.6c-2.2.3-3.2 3-5 3.5-3-.8-5.8-2.5-8.8-3-4.5 2.3-9.3 4.3-13.6 7-1.4 6-2 12-3 18.2-1.2 8.2-2.8 16.3-3.6 24.4.8 3.4 1.6 7 3.2 10 1.5 1 3.6-.4 5.3-.2 5.8-1 11.8-1.6 17.5-3 6.4-4.6 12.3-10 18.4-15 .6-3 .2-6.3.2-9.4l-5.2-12.7c1.4-4 3.4-8 4.5-12.2-.8-1.4-3-.7-4.5-1.2-2.6-.4-2.4-3.8-4-5.5-.3-.5-1-.8-1.5-.7z", fill: "#81c784", stroke: "#81c784", strokeWidth: ".4" }),
            React.createElement("path", { className: "Kie", d: "M442.3 434.4c-2.3 0-4.8-.3-7 .4-1 2 0 4.2 0 6.2.6 4 1.6 8.2 1.7 12.3-1 2.3-3 4.2-4.3 6.3-3.5-1.5-6.8-3.7-10.4-4.7-2.2 1.7-4.4 3.4-6.4 5.4.2 3.5 1.8 6.8 2.5 10.3 1.2 2.7-1 5.5-1.3 8.3-.4 2-2 4.5.2 6 4 5.2 8.3 10.2 12 15.5 2.6 5 5 10.3 7.6 15.3 3.6 2.7 6.8 6 10.8 8.4 1.8-.8 2.4-3.2 3.6-4.6 3.6-5.5 7.4-11 10.6-16.6-.6-3.7-2.6-7.4-3-11.2 2.2-14.2 4.8-28.4 6.5-42.7-.4-1.6-.2-3.4.2-5-.8-2.2-4-1.8-5.5-.8l-5.4 2.7c-2.2-2-4.4-4.3-4.8-7.4-.6-1.7-.4-5-3-4.3h-4.7z", fill: "#81c784", stroke: "#81c784", strokeWidth: ".4" }),
            React.createElement("path", { className: "Ruh", d: "M415.7 484c-3.2 2.5-5.7 5.8-8.5 8.6-.7 3.4 1.5 7.3-.7 10.5-.7 2.2 1.5 3.8 2.2 5.6 1.2 2.3 3.6 4.3 2.8 7 0 2.3-1.5 4.2-2 6.3 1.2 4 1.7 8.5 3.6 12.3 6 3 12 5.8 18 8.4 4.8-.7 9.4-2 14-3 1.6-2 4-3.7 5-6-.7-3-1-6-2-9-3.6-3.2-7.7-6-11.3-9.4-2.6-5.3-4.8-10.8-7.7-16-4.3-5-8-10.5-12.8-15.2 0 .2-.3 0-.5 0z", fill: "#81c784", stroke: "#81c784", strokeWidth: ".4" }),
            React.createElement("path", { className: "Mun", d: "M473.5 501.2c-3.8.8-8 1-11.6 2.3-5 6.8-9.2 14-13.8 21 0 3 1.5 6.3 1.5 9.4-1.4 2-3.3 4.2-5.2 5.7-4.5 1-9 1.8-13.4 3-1.8 5-3 10.2-4.6 15.3-.5 2-1.4 4.2-1.7 6.5 1.4 1.5 4 1.3 5.7 2.2 6.3 1.7 12.5 4 18.8 5.3 4-1.6 7.3-4.3 11.2-5.7 8.7-1.2 17.5-2 26.2-3.5 3.7-3 6-7 9-10.7 1.8-2 3.7-4.5 2.4-7.2-2.3-4.2-6.6-6.7-10-9.8l-7.3-6c0-3.2 0-6.4.2-9.6 3-1.4 6.4-2 9-4 1.2-3.7-.4-7.6-1.3-11-1-2-2.5-4-4.3-5-3.6.7-7.2 1.3-11 1.8z", fill: "#81c784", stroke: "#81c784", strokeWidth: ".4" }),
            React.createElement("path", { className: "Boh", d: "M500 509.8c-3 .7-6.5.6-9.4 1.8-.8 1.7.3 4.5-2.3 4.7-2.4 1.2-5.3 1.7-7.5 3.3 0 3.2-.6 6.6 0 9.7 5.3 4.6 11.2 8.6 16 13.7.7 1.8 1.8 3.3 4 3.6 5 2 10.2 4.5 15.6 5.8 4.8-1.4 9.6-3 14.4-4.6 4-1 8.4-1.4 12.5-2.6 2.3-3 4.4-6.4 6.2-9.6-1-2.7-3-5.3-4.4-8-7.4-4.7-15.6-8.4-23.4-12.7-4.3-2.2-8.5-4.8-13-6.6l-8.6 1.4z", fill: "#81c784", stroke: "#81c784", strokeWidth: ".4" }),
            React.createElement("path", { className: "Tyr", d: "M499.3 546.3c-2 0-1 2.4-2 3.3-3.2 4.6-6.7 9-10.3 13-9 1.3-18.2 2.4-27.2 3.6-3.3 2-7 3.5-10 5.8 1 2.2 3.5 3.4 5.2 5 2.5 1 2.2 3.3 2 5.6-.5 4.2 0 8.4 1.7 12.2 1.5 1.3 3.5-.7 5.2-.8 9.8-3 19.7-6.4 29.6-9.3 5 0 10 .4 15-.2 3.8-1.8 7.8-3.2 11.3-5.2 1-3.3 1-7 2.2-10.4 2.8-3.4 6.2-6.4 8.6-10-.4-3.3-.3-6.7-1-10-1.6-1-3.5.6-5 .7-3.2.8-6.3 2.2-9.4 2.6-5.3-2-10.4-4.6-16-6z", fill: "#81c784", stroke: "#81c784", strokeWidth: ".4" }),
            React.createElement("path", { className: "Vie", d: "M536.7 546.4c-2.2.7-5 .5-6.8 1.7-.3 4 .4 7.7.6 11.5-3 3.6-6.8 6.5-9 10.6-.7 3.4-1.4 6.8-1.7 10.2 4 6.7 7.7 14 13.6 19.4 2.6 2.5 4.8 5.8 8 7.7 2 .2 3-2 4.6-3 2.2-2 5-3.6 7-6 5.3-12.5 10-25.3 17.3-37 2-2.2-2-2.6-3.4-3.5-8-3.3-16-7.3-23.4-12.3-2.2-.4-4.6.7-7 1z", fill: "#81c784", stroke: "#81c784", strokeWidth: ".4" }),
            React.createElement("path", { className: "Bud", d: "M571 560.4c-5.3 8.5-9.6 17.6-13.4 27-1.7 3.7-3 7.7-5 11.4-3.4 3-7.3 5.7-10.5 9 .4 2 2.4 3.6 3.4 5.3 2 2.8 3.7 5.8 7 7.2 2.8 1.6 5.4 4 8.4 5 7.7-3.4 15-7.3 22.7-11 4.5-.8 9-1.3 13.4-2.4 3.4-4.6 5.5-10 8.2-15 2.2-5.3 5-10.3 6.5-15.8-.4-1.8-3-1.3-4.3-2-4.7-1.2-9.5-2-14-3.5-7.3-5-14.3-10.5-21.6-15.5-.4-.2-.6.3-.8.4z", fill: "#81c784", stroke: "#81c784", strokeWidth: ".4" }),
            React.createElement("path", { className: "Tri", d: "M519.3 580c-4.3 1-8 3.7-12 4.6-4.4 0-9-.2-13.2.2-1 1.7-.6 4.4-1.2 6.5-.2 2.6-1.4 5.4.4 7.8 1.8 4 3.2 8.3 5.3 12 7 6.5 13.6 13.3 20.6 19.6l27.6 15c4 3.7 8 7.6 12 11 2-.5 1.8-3.5 2.7-5 1-1.6.8-4.7 3.3-4.4 2.4-.5 5.3 0 7.4-1.3.2-2.4-1.4-4.6-1.8-6.8-1-2.7-1.4-6-4-7.8-4.3-4.5-9-8.6-14.4-11.7-4.7-3-7-8.3-10.8-12.2-5.8-6.6-12.6-12.6-16.8-20.5-1.6-2.2-2.6-5-4.5-7h-.4z", fill: "#81c784", stroke: "#81c784", strokeWidth: ".4" }),
            React.createElement("path", { className: "Alb", d: "M572 646.3c-3 .5-6.5 0-9.2 1.5-1.4 3-2.6 6-3.4 9 0 6-.3 12 .2 18 1.3 5.5 2.4 11 4 16.3 1.5 1.2 3.2-.7 4.7-1 2-1.2 4.5-1.6 6-3.3.3-3.8.2-7.6 1.8-11.2.7-5.5.7-11.2 1-16.8-1.6-4-2.7-8.3-4.5-12.2 0-.2-.3-.2-.6-.2z", fill: "#81c784", stroke: "#81c784", strokeWidth: ".4" }),
            React.createElement("path", { className: "Ser", d: "M596 612c-5.7 1-11.7 1.4-16.8 4.3-6 3-12.4 5.8-18.3 9-.4 2 2.5 3 3.5 4.6 2 1.8 4 3.6 4.5 6.4 2.5 7.5 5.4 15 7.7 22.5 0 5.3-.4 10.6-.6 16 1.3 1.6 2.8-1 4-1.4 1.8-1.3 3.5-3.3 6-2.5 3.8 0 7.7.8 11.4.4 3-1.6 6.7-2.6 9.5-4.7 0-2.3-1.3-4.7-1.8-7-1.8-6-4.2-12-5.7-18 .2-2.7-.3-5.6.3-8 1.6-1.7 3.6-3.3 5-5.2-.6-2.8-2.6-5-3.6-7.7-1.6-3-2.8-6-4.7-8.7h-.5z", fill: "#81c784", stroke: "#81c784", strokeWidth: ".4" }),
            React.createElement("path", { className: "Gre", d: "M607 667c-3.7 1.2-7 3.6-10.7 4.4-4.3-.2-8.5-.7-12.7-.6-2.8 2.3-6.3 4-8.5 6.8-1 3 0 6.6-1.4 9.6-3 1.8-6.8 2.7-9.6 4.8.8 2.7 2.8 5.3 5.6 6 2.8 1.2 5.8 2 8.5 3.3 1.5 5 2.4 10.3 3.8 15.4 4 4.8 7.5 9.8 11.6 14.3 2.5.5 5 1.3 7.7 1 2-1 1.6-4 2.6-5.6l4.2-12.2c3.5-.2 7 .4 10.4-.5 1-1.3-.5-3.2-.7-4.7-1.5-5-5.6-8.4-8.5-12.4L599 684c1-2 1.8-4.2 3-6.2 2 1.5 3.4 3.7 5.5 5 2.3-.3 4-1.7 3.3-4 0-2.8 1-6-1-8-1-1.2-1.4-3.2-3-3.7z", fill: "#81c784", stroke: "#81c784", strokeWidth: ".4" }),
            React.createElement("path", { className: "Bul", d: "M636.4 622.6c-2.8 1.8-5.5 4-8.4 5.5-7.6.2-15.3 0-22.8.2-2 2-4.3 4-6 6.2.2 4-.4 8 1.4 11.7 3 8 5 16.4 8.6 24 1 2 2 4.7 4.5 4.2 5.4.3 11 1 16-1 2-.5 4-2.3 5.7-.8 1.2 1 2.3-.2 2.8-1.3 2-2.2.5-5.4.6-8 0-2.2-.3-4.4-.4-6.6 4.8-1.8 9.7-3 14.8-3.2 2.3-.3 4.6-.2 6.8-.7 1-1.6-1.6-2.6-2.3-3.7-1-1.5-4-2.6-2.3-4.7 1-3 3-6.2 3.7-9.6-4-3.3-8.6-6.3-13-9.4-3.2-.7-6.4-2.2-9.6-2.4z", fill: "#81c784", stroke: "#81c784", strokeWidth: ".4" }),
            React.createElement("path", { className: "Con", d: "M660.6 652.5h-.4c-6.5.3-13 .4-19.2 3-2.3 0-3.5 1.5-2.7 3.8.2 3.6 1 7.3.4 11-.8 1-2.5 3-.6 4 2.8 2 6.5 1.6 9.5.8 5.3-2 10.6-4.2 15.7-6.6 1-2-1.5-3.6-2-5.3-.3-3 .5-6.6.3-10-.2-.3-.5-.5-1-.5zm37 11h-.2c-8 1-16.2 1.4-24 3-2.2.6-1 3-.2 4.2 2.3 2-.7 3.3-2 4.8-1.7 1.4-3 3.8-5.5 3-6.2.3-12.6 0-18.8.3-2.3 2.4-4.4 5.2-6.3 8 1 4 3 8 4.5 12-1 2-1.3 4.3-2.6 6-1.4 0-4.4 0-3.3 2.2.5 1.7 1 4.2 3.5 4.3 3 .4 6.4-.3 8.5 2.3 2.3 2.2 5.7.5 8.5.7l42.5-3c1.5-1 0-3 0-4.6-1.6-10-3.7-19.8-5.3-29.8.4-4.3 1.4-8.6 1.4-13l-.7-.4z", fill: "#81c784", stroke: "#81c784", strokeWidth: ".4" }),
            React.createElement("path", { className: "Ank", d: "M712 653.4c-4.4 3.3-9 6.3-13.3 9.8-.8 4.7-1.5 9.6-2 14.4 2.3 11 4 22 6.4 33 1.4 1.5 3.8 0 5.5 0 7.7-1 15.6-1.4 23.2-2.8 13.6-3.3 27-7 40.6-10 13.6-1 27-1.8 40.6-3 1.5-1.2.8-4 1.4-5.8.6-5.5 2-11 1-16.5-.3-3.7-.5-7.5-1-11.2-1.2-1.5-3 .7-4.3 1-4.4 2.4-8.8 5-13.3 7.2l-25.5.8c-7.4-4-14.7-8-22-11.8l-36.6-5.2H712z", fill: "#81c784", stroke: "#81c784", strokeWidth: ".4" }),
            React.createElement("path", { className: "Arm", d: "M804.2 631c-2.3.5-4.8 0-7 1-.8 1.5.7 3.4.8 5 1.6 1.4 4.3.7 6.3 1.2 1.6.4 4.3-.4 4.6 2l7 16.7c-1 1.6-2.5 3.3-1.7 5.4.3 5.4 1.4 10.7 1.2 16-1.4 9.6-2.4 19-2.3 28.7 0 5-.5 10 0 15 1.4 2.3 1.5 6 4.6 7 2.4 1.4 5 2.6 7.7 2.6 13 1.6 26.2 3 39.2 5 11 3.5 22 7.3 33.3 10.8 2-.2 1-3 1.2-4.2.4-27 0-54.2.2-81.3-1-1.8-4-1-5.7-1.7-2.5-.3-5.2-.4-7-2.3-5-3.5-9.4-7.8-14.6-11-13.6-2.5-27.5-4.7-41.2-7.3-7-3-14-6.3-21-9-2 0-3.8.2-5.6.4z", fill: "#81c784", stroke: "#81c784", strokeWidth: ".4" }),
            React.createElement("path", { className: "Smy", d: "M812 695c-13.4.7-26.7 1.5-40 2.6-14.2 3.5-28.4 7.2-42.7 10.5-25 3.2-50 4.8-75 6.3-1 0-2.3.2-3-1-1-1.2-2.8 0-2.6 1.4 0 2.4-1.6 5.3 1 7 2.3 2 4.3 5 7 6.8 4-1 7.3 2 10.7 3.5 3.8 2 7.5 4.2 11.4 5.7 15.2 1 30.3 2.6 45.5 1.6 3 .3 4.3-3 6.4-4.6l4.7-4.5c4.8 1.4 10 2.5 14.5 4 .5 1.5 0 4.4 2 4.3 10.7-3.2 21.3-7 32-10.4 9 .4 18 1.2 27 1 1.5-.5 3.8-.4 4.5-2-.8-2.7-3-5-2.3-8.2 0-7.8.5-15.6.3-23.4-.2-.6-1-.5-1.6-.5z", fill: "#81c784", stroke: "#81c784", strokeWidth: ".4" }),
            React.createElement("path", { className: "Syr", d: "M813.6 728.2c-6 1.2-12.2.2-18.4 0-3.8 0-7.7-.5-11.5-.2-10.8 3.6-21.6 7-32.2 10.8-1.2 1.6-1 4-1.5 6-1 5.5-1.7 11-2.6 16.5-1.7 2-4.2 3.6-4.2 6.5-1.3 5.8-3 11.5-4 17.4 1 1.3 3 .3 4.6.6 51.6.3 103.2 0 154.8.2 1.7-1.3.4-4.2.8-6 0-10.7 0-21.2-.2-31.7-1.2-1.7-4-1.6-6-2.6-10.3-3.2-20.6-7.2-31.2-9.8-13.2-2-26.5-3.3-39.7-5-2.3-1-4.5-2.6-7-3.3-.6 0-1 .3-1.7.5z", fill: "#81c784", stroke: "#81c784", strokeWidth: ".4" }),
            React.createElement("path", { className: "Bot fix-color", d: "M613.7 180.2c-6 1.4-12 1-18 1-3.4 3-6.2 6.7-9.3 10-3.2 3.6-6.6 7-9.5 10.8.8 3 3 5.5 4.5 8.4.7 1 1.6 2 .5 3-3.5 6-7.2 12.2-11.2 18-12 11.6-23.7 23.3-35.5 35-.5 4.8.2 9.7.2 14.4l1.2 32.4c1 1.5 3.3.8 4.8 1.4 1.8.2 3.6.5 5.5 1 1.8 5.5 3.6 11.3 5.2 17-5.4 9.2-11.8 18-18.3 26.5-2.2 3-4.5 5.5-6.4 8.4.4 2 2.8 3 4 4.3 3.6 2.8 7 6 11 8.5 3 0 5.3-2.3 8-3.3 1.5-1 3.3-1.2 5-.3 1.7.2 0 2.2-.3 3-.7 2.4-2.7 4.5-2.5 7 6.5 8 13.2 15.8 20 23.4.6 1 2.4 2.4 2.7.6.6-4.7.4-9.5 1.5-14 2-5.2 3.7-10.7 6-15.6 3-1.5 6-3 9-4.3 4 4.5 7.8 9.3 12 13.6 2.8 0 5.6-1 8.4-1.6 1.5-1.4 1.4-4 2-5.8 1-3.6 2.2-7 2.6-10.7-3.2-5-7-10-10.2-15-.5-4.4-1-8.7-1-13l12.5-8c11.6.5 23.3.8 35 1 5.2-2.8 10.8-5.3 16-8.3.5-2-.5-4.5-.7-6.7-.3-2.6-3.5-3.2-5-5-2-1-4-3-6.2-4-9.6.5-19 2.2-28.3 5-5.8 1.6-11.6 4-17.8 4-5.2.5-10.6 1-15.8 1.3-2-2.4-2.5-5.8-4.6-8l-9.4-5.2c.4-6.3 1.6-12.7 2-19-2.4-10.4-5.4-20.6-8-30.8 15.7-19.6 31.7-39 46-59.7 0-2.4-1.5-4.6-2-6.8-1.6-4.6-3-9-5-13.5 0-.3-.3-.6-.7-.5z", fill: "#bbdefb", stroke: "#bbdefb", strokeWidth: ".4" }),
            React.createElement("g", null,
                React.createElement("path", { d: "M256.5 429h-7.3c-.8.4-1.3 1.2-2 1.6-3 2.8-6.2 5.4-9.3 8.2-.6.7 0 1.5.2 2.2l1.4 4.5-17.3 2.4c-.7 0-.7 1-.6 1.5l2.3 13c.3 1 1.4.7 2 1l8.7 1-4 15-10.4 5.7c-.7.6-.3 1.5-.3 2.2 0 .8 0 1.6.4 2.3 1.2.8 2.6 1.3 4 2l9 4.5c.8 0 1.4-.6 2-.8l17.6-8.7 10-2c1-.4.8-1.4 1-2l6.5-19c0-1-.5-2.3-.7-3.4l-2.5-11 3-16.2c0-.8-1-1-1.7-1.2l-8.8-3h-3.3zM153.7 164c-1.3 1-2.8 1.7-4 2.8-.5.8-.2 2-.3 2.8v4.2c-3.2 1.8-6.3 3.7-9.5 5.4-2.5-1.3-4.7-3-7-4-1.6 0-3 .4-4.7.6-7.2 1-14.4 2.2-21.7 3.4-1 .5-1 1.7-1.5 2.5L98 197c-.8-5-1.6-9.8-2.6-14.6-.5-1-1.6-1.3-2.4-2-5.2-3.4-10.2-7-15.4-10.5-1-.3-1.4 1-2 1.5-5 7-10 13.8-14.8 20.8-.4.8.5 1.5 1.2 1.3l22-1.3c2 4.5 4.4 9 6.6 13.5l-22.8 1.4c-1.2.3-.6 1.7-.7 2.6.3 1 1.7.8 2.5 1 4 1 7.7 1.7 11.6 2.4l8.3 16.4c-4 .5-7.7.8-11.5 1.4-1 .5-.3 1.7 0 2.4.4 1.2 2 1 3 1.5 14.5 4.3 29 8.8 43.5 13 1 0 2-1 3-1.3 13.5-7.4 27-14.7 40.4-22.2.7-.8.8-2 1.2-3 1-3.7 2-7.4 3.2-11 3.6-2.4 7.3-4.5 10.8-7 .6-.8-.2-1.7-.4-2.5l-4.6-13c-.7-.7-1.8-.7-2.6-1-2-.8-4-1.5-6-2-.8-3.8-1.8-7.4-2.7-11 .4-2.3 1-4.4 1.3-6.6-.2-1-1.6-1-2.4-1.2L154 164h-.3zM552.8 375.6l-9.7 4.6c-.6.7 0 1.7 0 2.6.2 2.3.4 4.6.8 7 .7 1 1.3 2 2 2.8 1 .5 1.7-.7 2.3-1.3 1.6-1.6 3.2-3 4.6-4.8l4-9c0-1-1.4-1-2-1.5-.6-.2-1.2-.6-1.8-.4zM615.7 748.3l-6 1.6c-1 .4 0 1.4.2 2 .3 1 .7 2 1.8 2.2 4.3 1.3 8.6 2.7 13 3.8 4.3-.5 8.7-1 13-1.7 1-.3.8-1.3.4-1.8-.6-1-1-2.4-2.2-2.5l-14.2-5c-1.8.2-3.6.8-5.4 1.2h-.7zM488 715.3c-1.7.3-3.5.7-5.2 1.2-.8.5-.5 1.7-.7 2.5 0 .7 0 1.5 1 1.7 4.4 2 8.8 3.8 13.3 5.7 3.3 2.2 6.5 4.5 9.8 6.6 2 .3 4 .5 6 .4.8-.3.8-1.5 1.3-2.3.4-1 1.4-2 1-3.4l-1.5-7.8c0-1.2.5-2.4.3-3.6-.4-1-1.5-.2-2.3-.2l-11.7 3c-3.6-1.3-7-2.7-10.7-3.7h-.3zM443.3 670.3c-2.6 3.2-5 6.6-7.4 10-1 3-1.2 6.2-1.6 9.3l-.7 7.3c.3 1 1.3 1.4 2 2 .8.8 1.5 2 2.6 2.2 2-.3 3.7-1 5.5-1.4 1.5-1 2.7-2.6 4-3.8.8-.8 2-1.4 2.2-2.4v-15l-3-8c-.7-.8-2-.3-2.7-.5-.4 0-.7.2-1 .3zM446 641l-10 8.6c-.7.8 0 1.8.2 2.6 1.5 4.2 2.8 8.4 4.4 12.5.5 1 1.7 0 2.5 0 1.3-.2 1.6-1.7 2.3-2.5 1-1.6 2-3 2.8-4.7l.6-14c-.2-1-1.2-1.5-1.8-2.3-.3-.2-.6-.2-1 0zM424.3 564.7c-1 .8-1.8 2-2.8 3l-13 15c-.3 1.2 1 1.7 1.5 2.4 2.6 2.5 5 5 7.8 7.2 1 .2 2.2 0 3.2 0 10.5-.6 21-1 31.3-1.4l4.6-2.6c.5-.7 0-1.8.3-2.7v-6.7c-.3-1-1.4-1.3-2-2l-6.3-5-24.2-7.2h-.5z", fill: "#666", stroke: "#666", strokeWidth: ".1" }),
                React.createElement("path", { d: "M668 667.7c-4.2-.6-7.6 2-11.4 3.4-3 1.7-6.8 2.5-9.4 4.8-.8 1.2-.6 3.7 1.4 3 6.4 0 13 .2 19.3 0 2-2 4.6-4 6.3-6.3-1-1.6-1.5-3.8-3-4.8H668z", fill: "#bbdefb", stroke: "#bbdefb", strokeWidth: ".4" })),
            React.createElement("g", null,
                React.createElement("path", { d: "M664 667.7h8m-25.2 7.5v3.3m-22.3 79.8l.2 27.8m13-33l4-5.4L652 743l9.2-14m-39 18l-20-15m7 18.2l12.5-3 15.2 5.3 1.7 3.5-14.2 2-13.6-4.3zm-1.7-83.6l-8.2-24.7V634l5.6-6m-28.8 48l7.5-5.4 13.3.7 10.2-4.6 4.5 7m-39.2-28l4.4 13-.8 16.5-1.4 3-.7 8.7-10.2 4.6m-16-15l11.2-3.6m100.5-38.6l-13.3-9.5-9.6-2.5-8 5.6h-23.7l-8.3-15.5m40 61l2.5-3.8-1-13.4 8.5-2.7 15-1.2M649 711.6l3.7 3 50.2-3.4M813.2 695l-41 2.6-42.6 10.6-26.6 3-6-34 1.7-13.6m117.3 64l-5.5 1.5-26.8-1-32.8 11m63.2-79.2l1.6 17.3-2.3 18-.4 26.7 2.8 6 6 3.3 42 5.2 36 11.4M796.7 632l13.2-1.3 21.5 9.3 41.5 7.3 15.4 12.3 11 1.7M559.6 657l-.2 16.8 4.4 18.5 3 4.7 11.5 4.2 3.5 15.4 11.4 14.4 8.4 1.2 6-18 11.3-.2-2.4-8-17.8-22 3-6.4 5.4 5.4 3.3-1.4.4-7.5 14 .6 9-3 6 4h6.7L664 668l-3-5 .6-10.4-7-6.7 5-12.7 7.4-18.5 12-12 .3-4.7 11.5-17.2 14.2-1 2.3 6h15.4l.5 3-12.6 7.4.2 2.5 13.3 16 4 .3 13.6-8.4 5.2 2.4h6.7l.3-6.8-3.7-4.6-8-.3-5.5-7.4 12-12.3 30.7-8.8 8 3-16.4 10-3 18.6-5.8 2.5v4l7.4 7 9 .8 18.3 17 1.4 5.7 10.4 1 7.6 18.3-2 3.5-17 9.4-25.7.7-22-11.7-37-5.3-14.3 10.2-24.5 2.5-2 1.8 3 4.7-6.6 6.3h-21l-6.4 8 4.7 12-2.4 6-4.3.5 2 5.7 8 .6.3 2-1 6.2 8.2 8.7 4-.2 18.2 9.3 31.7 2 16.7-.7 8.6-9 14.8 4 1 5.7-3.5 21.7-3.5 3.4-5 20.4m-104.3-230l17.3 16.7 15 21.6 12 9m45.7-122.2L711 517.8 689.7 545l-38 27m1.4-79.2l26.6-11 44.8-1.4 20-14.4 53.2-5.8 73-2 19 7.3 9.7 8.7m-237.7-68.5l22 7.3 84.2-49 47-27.5 49.6-40.4 34.5-5.3M684.6 60.2l12.4-5 12.4 3 10.8 17.2 22.2 2L804 121l2 21.8-9.3 23.8-17.7 6-40.2-8.7-32.4-22-9 8.3L711 156l20.3 21-1.3 13 3.8 23 22.4 19.6 14-1.3-19.7-26 6.5-10.2 31.7 14.6 11.5-5-10-16 29.3-28.3 14.3 8.4 11.8-19-11-12.5L832 94l27.5 6 10 13.4-15.6 9v10l9 14.6 22-2.3 2.2-19 12-4.4M606 347.3l-.6-3 12.8-8 35 1 16.3-8.3-1-8-10.6-7.6m-114.5 232l11.3 7 17 7.6 22 16 18.4 4.3m-92.7-1l9 14.8 13.2 14 7.5 10 11.6 7.6m10.7-66l-8 13.7-10.6 25.4-12 9.8M530 548l-14.2 4.5-17.5-7m-4.7 39.2h14.2l12.2-5.4 1.8-10.2 9-9.5-1-11.7 13.5-2.5 6.5-10m-57.5 61.5l6 13.8 20.3 19.6 27.7 15.2 13 11.7 3.6-9.7 9.5-1-4.5-13-7.7-7.7 23.4-11.5L597 612l4-6.5 11.4-24.8L628 570l7.5-15m-139 171l-16 10.2-16.5 2.5m48.3-19.4l9.3-1m-8.4-2.7l-.7 4.2 1.6 9-2 4.5-5.8-.4-9.6-6.6-14.4-6.3.4-3.2 5.6-1.4L499 719zm-58.6-91.4l1 34.7-5.6 19m56.4-12.5l21.7 17M496 652l12.8 11-9 10.6M472.7 631l12 7.2 11 13.7 8-7.6m-51.3-36.2l14.3 11.8 6.5 10.7-10.7 7.2m-3.3-42.5l-8.4 5.3 1.6 7.3-13.2 10.3M423 631l16.2-12.7 15.4 5.6 7.8 15 17 25.3 19.3 9.3 14.5 12.4 11 15-3 11.4.3 5.8 1.5-.2 11.2-21.5-7-8.4 1-5.3 6.5-1.6 10 4.7 6-2.7-2.8-6-10.5-8-16-14.3-17.6-11-9.2-13.7-14.3-12v-13.2l11.7-8 1.7-12.3-35.2 11-2-7.7m96-201.2l22.7 26.8M543 380.6l1 9 2.3 3.4 6-6.6 4.3-9.3-3.5-1.3zm0 .2L527 368m68.6-337.4l-4.3-29.4m-23.8 85.6l.5 10.7-3.7 3.8-15-3-6.4 1-1.6 12.5-12.6 68.8-30 37.8-21.8 37 6.8 44.2-11.2 51-8.2.4M670 86.3l-9.8-12-3.5-16.4-17-1.8-5.6 10.5-4.8 19-11.7 8-22-.8-16-15.3-2.8-.2-8.7 9 22.2 12.2 15 20.5 2.3 23.8 2.3 15.2-2 23.3m-133 240h6.4m-67.4-51.4l-8.6 7.3-.5 13L417 400l13 3.4m-121-26l17.3-15.3 11.5-45 23-21.8 30.2-13.6m90.7 140l8.4 3.7 9.7-2 18.4-13.8 10.6-26.3-1.4-15.5 14.2-18 11-17-5.3-17.5-10.2-1.4-1.6-47 35.7-35.3 12-19-6.3-10.4 18.6-20.7 12.2.2 6.8-1.3 7.4 20.2-17 23.6-29.4 36.6 8 30.6-2.2 19 10.3 5.7 3.8 8 21.8-2 23-6.5 17.6-2.4 22-26.7 8.5-21-2.8-37.8-11.2-35.7 6-13.5-14.6-36 7.7-12.6v-7.4l-10.5-9.3-1-18.3 8.5-9 5.2-15.5 9.5-10.2L664 49.5l-.3-3.8 12.3 3 10-9 .6-5.4L664 20.8l-8.4-7.3-43.2 1.4-17 15.6-21.8 13.7L584 54 562 56 552.7 44l-13 17.6 7 10-24.2 21-6.7-.7-6 10.4 10 10-17.3 18.7-20.3 31.4-7.5 34.5-15 13.7-14.2 22.4-15.4 25.3-20.2 5-18.4 18 2 52.4 7.3 24.2 13 11.8 17.8-.7 16-22.5 11.8-3.5 4.7 7.4 1.6 16.4 15.2 32.7zm124.6 109l21.2 9.3 8 15.3m-7.5-100l25 37.5-17.3 23.8-30 13.8-34 2.6m.5-106.4l3.5-6.6-.4-7.5 1.2-15 6.2-16.5 9.4-4.4 12 13.8 8.8-2 4.5-15.8-10.8-15.4-.7-9.8 27.3 7 21 10.3 5.7 23 1.7 18-14.7 35.7-19.4 14-23-1.6m-213 17.5l4.7-42.7 32.8-14.2m26.5 10l5.6-2.3m-2-5l2 5 5.8 3.3.7 4.7 7.4-.2 3.4-2-3.5-7 1.6-7.4-2.6-2-6.3 5zm-24.6 17.7l-5-20 .7-11.7 4-11 3-.3 15.6-13.5 4 1.2-3.4 13 .3 10 6.3.8-10.8 15.2.7 4.2 6 1 .4 3.6-7.4 1.4.5 6m-1 89.7l2 9.8-5.2 5.7-13.5 3M462 503L448 525l-11-9-7.8-16-13.3-16.6m69 16.4l-23 3.5-3.2-10.5 6.8-43m37.3.8l-4.7 12 5.4 13v8.6L485 499.7l3.5 3.5 1.8 8m63-26.2l-49.4-.6M449 572l8.2 6.7-.2 9.3-4.7 2.6-34 1.4M416 460.2l6.4-5.4 10.3 5 4.7-6.5-2.8-18.6 14.2-.2 2 7.7 4 3.7 7.8-3.8 3.2 1-1 4.3 1.3 2 13.6-6.6 8.6 3.4 3.8-3.8h2.3l2.8 6 6.2 1 18.2-7.2 24.7-5.6 7.6 6.3 9.5-3.7 9-12.7 25.2 9.5 6.8 17.3-15 17.8-35.7 14 7 25.8 11.7 13.7-.7 8.2-7.7 5.6-14-2.8-5-8.4-35.6-18.6-18.4 3-.5 4.3-9.3 3.7v9.8l15.7 12.8 2 3.5-.4 3.5-10.7 13.8-27.5 3.5-10.6 5.8-24.4-7m-44-67.3l10.4-26.4 5.6-.5 7.4-8h7l4.5-2.6 3.5 12.3-3 10.7-9 9.6.5 8-1.6 3.4M453.8 724l-9.8-23.8m-9.2-14l-28.2 19.4h-66M440.8 665l2.7-.7 4.2-6.8.4-14.4-2-2-10.7 9zm-6 20.7l1-5.3 7.4-10h3.3l3 8V694l-5.8 5.5-6 1.7-4-4zm-211-223l-70.4 2-48.7 22.7-32 31M211 530l65-8.3m9 28.7L210.8 530l-78-11.3-60.4-.2-71.8-24m371.7 3.2l-15-12.6m5.4 15.2l8.7-2.3h9.8l7.6 4.8 9-3.5 8.3 5 5.7 9-.2 4.2-2 4 3.4 13M308.5 732.3l-1 20.5M439.2 731l-1 22.7-9.7 16.7 5 15.7m-193.8-.4l3.8-6 10.7-1 17-26.6 8.4-2.5 7.3 5 20-1.3 10 4.2 52-29 32.7 6 19.6-7 18 3.8 6.5-3.7 8.4-3.7 11.4 8.2-2 7.4 2 16.4L457 772l22.4 14M349 590l-4.7-38.6-4-20m40 14.6l2 14.5-15 35.7m-23.2-44.4l36.4-5.6 4-23.3m-8.8 90.2l-8.5-16.8-10.8.4-7.5-6.7-23.8 7m21 48l6.2-23.4 8.2-4.7 15.2-3.6 13.5-3.2 3.6-21.7 16.3-5.2M374.2 652l-.2-5.5 13.7-14 17 6 6.3.6 12-8.6-10.3-21.7 6.7-6.7-1.2-9.6-9.8-9 16.2-19 6.5-21.7-18.6-8.6-12.4-1-16-10-21.3-22.7-6.5 7.4-.2 13.8-15.2 10-6.8 6.5-12.6-5.3-2.6 2 3.8 12-10.3 5-13.7-4.5-13.6 3.2 2.3 11 25.3 12 1 6L325 597l2.2 11.3-6.7 25 6.7 7.2 18.5 4.7 8.4 1.8.3 3.5zm-136.6 3.4l29.6 5 1.6 3.4-7 12-8.6 52m121-75.4v4.4l-11.7 10.5-5.6-1.6-14.4 12-5 14.6 3 13-6.8 9.4-1.6 6.5-23.6 11-11.2 4-7.3-.5-13 7.2h-5l-13-14.7-4.8-.2-12.4-.5-3.5-3V710l-1.4-1.8-5.4-2v-2.7l10-22.2-3.3-25.6-5-11.5 1.5-5 18.7-8.5L314 637l7-3.7m-54-183.7l28.3-5.3m-46.2-15l10.8-.2 10.3 3.6-3 16.8 3.3 14.2-7 20.8-10.5 2-19 9.7-13.4-6.5-.3-4 11-5.7 4-15.5-10.7-1.4-2.5-14.7 18.2-2.6-2-6.6zm-77-219l4.7 43.5 39.5 54.7 60 50.4m47.3 120.5l17-8.4m-25.6-2.3l8.5 10.3-6 13.3 6.2 17m-16-70.4l7.4 29.7-25 7.7m-3-74.4l20.2 37 11.6-5.2m-43-75.2l22.8-3.2 2.7 3.2-12.5 22 14-5.2 6.2 1.7 6 2 2.2 3.4-12.8 24.6 9 6.7 5.4 20 11.7 8.5 8.2 19 1.8 10 11.7 1.7 4.4 6.5 1 5L346 498l6.4 4.6v2l-28.4 4.5-46.7 16-2-3.5 8.5-6.5 4.7-9.4 8.4-4.6v-3.3l-18.3-4.7-1.6-2.6 13-10.6v-3.6l-6.4-2.5V467l9.3-2.7 10.7-8 .2-3.2-9-8.7.3-9.6-13 1.2-3-4.4.6-18.8-1-4.7-2.6-4-8.2 1.5-7.7-17.7 10-2 5.2-14-3.5-4.8zm12.6 22.4l-3.6 12.6 2 8.2-8.3 6M.5.5h899V786H.5zM154 164.3l-43.5-54.5-29.3-63V1M124.6 248l43.3-23.8 4-14 11.3-7-5.6-15.3-8.4-3-2.8-11 1.4-7-14-3-4.3 3v7l-9.8 5.5-7-4.2-26.6 4.2-8.4 18.2-2.8-15.4L77 169.7l-16.7 23.8L84 192l7 14-23.8 1.4v2.8l14 2.8 8.4 16.8-12.6 1.4 1.4 2.8z", fill: "none", stroke: "#000" })),
            React.createElement("g", { fill: "#fff", stroke: "#000", strokeWidth: ".4" },
                React.createElement("path", { d: "M342.2 124.6l-3.6-2-3.7 1.8.7-4-3-3 4.2-.4 1.8-3.7 1.7 3.8 4 .7-3 2.8z", className: "supply_center Nrg" }),
                React.createElement("path", { d: "M126.5 341l-3.6-2-3.7 1.8.8-4-2.8-3 4-.4 2-3.7 1.7 3.7 4 .7-3 3z", className: "supply_center NAt" }),
                React.createElement("path", { d: "M391 417.3l-3.6-2-3.7 2 .8-4-3-3 4.2-.6 2-3.6 1.6 3.8 4 .7-3 2.8z", className: "supply_center Nth" }),
                React.createElement("path", { d: "M290 372.8l-3.7-2-3.7 1.8.8-4-3-3 4.2-.4 2-3.7 1.6 3.8 4 .6-3 2.7z", className: "supply_center Cly" }),
                React.createElement("path", { d: "M307.5 392.6l-3.6-2-3.7 1.8.8-4-2.8-3 4-.4 2-3.7 1.7 3.8 4 .7-3 2.8z", className: "supply_center Edi" }),
                React.createElement("path", { d: "M306 468.2l-3.5-2-3.6 2 .6-4-2.8-3 4-.6 2-3.6 1.7 3.7 4 .7-3 2.8z", className: "supply_center Lvp" }),
                React.createElement("path", { d: "M310.4 486.6l-3.6-2-3.7 2 1-4.2-3-3 4-.4 2-3.6 1.7 3.7 4 .8-3 2.8z", className: "supply_center Wal" }),
                React.createElement("path", { d: "M335 505l-3.5-2-3.6 2 .6-4.2-2.8-3 4-.4 2-3.6 1.7 3.7 4 .6-3 3z", className: "supply_center Lon" }),
                React.createElement("path", { d: "M324.5 469.7l-3.6-2-3.7 1.8.7-4-2.8-3 4-.4 2-3.6 1.7 3.7 4 .8-3 2.8z", className: "supply_center Yor" }),
                React.createElement("path", { d: "M201.5 502.2l-3.6-2-3.8 1.8.8-4-3-3 4.2-.4 2-3.7 1.6 3.6 4 .7-3 2.8z", className: "supply_center Iri" }),
                React.createElement("path", { d: "M333.7 529l-3.6-2-3.6 2 .8-4-3-3 4.2-.5 2-3.7 1.6 3.7 4 .7-3 2.8z", className: "supply_center Eng" }),
                React.createElement("path", { d: "M142.8 662l-3.6-2-3.7 1.8.8-4-3-3 4.2-.4 2-3.7 1.6 3.7 4.2.7-3 3z", className: "supply_center Mid" }),
                React.createElement("path", { d: "M444 322.6l-3.6-2-3.7 1.8.8-4-3-3 4.2-.4 2-3.7 1.6 3.8 4 .7-3 2.8z", className: "supply_center Nwy" }),
                React.createElement("path", { d: "M518.3 279.5l-3.6-2-3.7 1.8.8-4-3-3 4.2-.5 2-3.6 1.6 3.7 4 .6-3 2.8z", className: "supply_center Swe" }),
                React.createElement("path", { d: "M635.6 281l-3.6-2-3.6 1.7.7-4-2.7-3 4-.4 2-3.7 1.7 3.7 4 .7-3 2.8z", className: "supply_center Fin" }),
                React.createElement("path", { d: "M685 336l-3.5-2-3.6 2 .7-4.2-3-3 4-.4 2-3.6 1.8 3.7 4 .7-3 2.8z", className: "supply_center StP" }),
                React.createElement("path", { d: "M638.5 416.6l-3.6-2-3.8 2 .8-4.2-3-3 4.2-.4 2-3.6 1.6 3.7 4 .8-3 2.8z", className: "supply_center Lvn" }),
                React.createElement("path", { d: "M553.6 466l-3.6-2-3.6 2 .7-4-2.7-3 4-.5 2-3.6 1.7 3.6 4 .7-3 2.8z", className: "supply_center Pru" }),
                React.createElement("path", { d: "M544.4 428.6l-3.6-2-3.6 2 .7-4-3-3 4-.6 2-3.6 1.8 3.7 4 .8-3 2.8z", className: "supply_center Bal" }),
                React.createElement("path", { d: "M576.3 335.3l-3.6-2-3.7 2 .8-4.2-3-2.8 4.2-.5 2-3.7 1.6 3.8 4 .6-3 2.8z", className: "supply_center Bot" }),
                React.createElement("path", { d: "M456 366.4l-3.6-2-3.6 2 .8-4-3-3 4-.6 2-3.6 1.8 3.7 4 .6-3 2.8z", className: "supply_center Ska" }),
                React.createElement("path", { d: "M427.7 437l-3.5-2-3.7 2 .8-4-3-3 4.2-.5 1.8-3.6 1.8 3.6 4 .7-3 2.8z", className: "supply_center Hel" }),
                React.createElement("path", { d: "M473 424.4l-3.6-2-3.7 2 .8-4.2-3-3 4.2-.4 2-3.6 1.6 3.7 4 .5-3 3z", className: "supply_center Den" }),
                React.createElement("path", { d: "M446.8 503.6l-3.6-2-3.6 1.8.8-4-3-3 4-.4 2-3.7 1.8 3.8 4 .7-3 2.8z", className: "supply_center Kie" }),
                React.createElement("path", { d: "M405.8 483l-3.6-2-3.6 2 .7-4-2.8-3 4-.5 2-3.6 1.7 3.6 4 .6-3 2.8z", className: "supply_center Hol" }),
                React.createElement("path", { d: "M405 528.3l-3.5-2-3.6 2 .6-4-2.8-3 4-.6 2-3.6 1.7 3.8 4 .7-3 2.8z", className: "supply_center Bel" }),
                React.createElement("path", { d: "M367 520.6l-3.7-2-3.6 1.8.8-4-3-3 4-.4 2-3.7 1.8 3.7 4 .7-3 2.8z", className: "supply_center Pic" }),
                React.createElement("path", { d: "M335.8 582l-3.6-2-3.6 2 .7-4-2.8-3 4-.5 2-3.7 1.7 3.7 4 .7-3 2.8z", className: "supply_center Bre" }),
                React.createElement("path", { d: "M372 563.7l-3.7-2-3.7 2 .8-4.2-3-3 4.2-.4 2-3.5 1.6 3.7 4 .7-3 2.7z", className: "supply_center Par" }),
                React.createElement("path", { d: "M409.4 551l-3.6-2-3.7 1.8 1-4-3-3 4-.4 2-3.7 1.7 3.7 4 .7-3 3z", className: "supply_center Bur" }),
                React.createElement("path", { d: "M422 512.8l-3.5-2-3.7 1.8.8-4-3-3 4.2-.4 2-3.7 1.6 3.7 4 .7-3 2.7z", className: "supply_center Ruh" }),
                React.createElement("path", { d: "M468 535.4l-3.5-2-3.7 2 .8-4.2-3-3 4.2-.4 2-3.6 1.6 3.7 4 .6-3 2.8z", className: "supply_center Mun" }),
                React.createElement("path", { d: "M486.4 484.5l-3.5-2-3.8 2 .8-4.2-3-3 4.2-.4 1.8-3.7 1.8 3.7 4 .7-3 2.8z", className: "supply_center Ber" }),
                React.createElement("path", { d: "M532.4 507l-3.6-2-3.6 2 .7-4-3-3 4-.5 2-3.6 1.8 3.6 4 .7-3 2.8z", className: "supply_center Sil" }),
                React.createElement("path", { d: "M356.3 612.5l-3.6-2-3.6 1.8.8-4-2.8-3 4-.4 2-3.8 1.7 3.8 4 .6-3 2.8z", className: "supply_center Gas" }),
                React.createElement("path", { d: "M369.8 637.2l-3.6-2-3.7 2 .8-4-3-3 4.2-.6 2-3.6 1.6 3.7 4 .7-3 2.8z", className: "supply_center Mar" }),
                React.createElement("path", { d: "M333 676.8l-3.6-2-3.7 2 .8-4-3-3 4.2-.6 2-3.6 1.6 3.7 4 .7-3 2.8z", className: "supply_center Spa" }),
                React.createElement("path", { d: "M253.8 676.8l-3.6-2-3.7 2 .8-4-3-3 4.2-.6 2-3.6 1.6 3.7 4.2.7-3 2.8z", className: "supply_center Por" }),
                React.createElement("path", { d: "M283.5 770.2l-3.6-2-3.8 1.8.8-4-3-3 4.2-.4 2-3.7 1.6 3.6 4 .7-3 2.8z", className: "supply_center NAf" }),
                React.createElement("path", { d: "M455.3 743.3l-3.6-2-3.6 2 1-4.2-3-2.8 4-.5 2-3.6 1.7 3.8 4 .6-3 3z", className: "supply_center Tun" }),
                React.createElement("path", { d: "M410 724.2l-3.5-2-3.7 2 .8-4.2-3-3 4.2-.4 2-3.6 1.6 3.7 4 .7-3 2.8z", className: "supply_center Wes" }),
                React.createElement("path", { d: "M414.3 685.3l-3.6-2-3.6 2 .8-4.2-2.8-2.8 4-.5 2-3.6 1.7 3.8 4 .7-3 2.8z", className: "supply_center GoL" }),
                React.createElement("path", { d: "M431.3 623l-3.6-2-3.7 2 .8-4-3-3 4.2-.5 2-3.7 1.6 3.8 4 .6-3 2.8z", className: "supply_center Pie" }),
                React.createElement("path", { d: "M459 623.8l-3.7-2-3.7 2 .8-4.2-3-3 4.2-.4 2-3.6 1.6 3.7 4 .6-3 2.7z", className: "supply_center Tus" }),
                React.createElement("path", { d: "M478 647.8l-3.6-2-3.7 2 .8-4-3-3 4.2-.6 2-3.6 1.6 3.7 4 .7-3 2.8z", className: "supply_center Rom" }),
                React.createElement("path", { d: "M479.4 625.2l-3.6-2-3.7 2 1-4.2-3-3 4-.4 2-3.6 1.7 3.7 4 .7-3 2.8z", className: "supply_center Ven" }),
                React.createElement("path", { d: "M507.7 576.4l-3.6-2-3.6 2 .8-4-3-3 4.2-.6 2-3.6 1.6 3.7 4 .6-3 2.8z", className: "supply_center Tyr" }),
                React.createElement("path", { d: "M501.3 525.5l-3.6-2-3.7 2 .8-4.2-3-3 4.2-.4 2-3.7 1.6 3.7 4 .7-3 2.8z", className: "supply_center Boh" }),
                React.createElement("path", { d: "M543.7 626l-3.6-2-3.5 1.8.7-4-3-3 4.2-.5 2-3.6 1.7 3.7 4 .7-3 3z", className: "supply_center Tri" }),
                React.createElement("path", { d: "M543 657l-3.6-2-3.7 2 .8-4-3-3 4.2-.6 2-3.6 1.6 3.7 4 .7-3 2.8z", className: "supply_center Adr" }),
                React.createElement("path", { d: "M514 659.2l-3.6-2-3.6 1.8.7-4-2.8-3 4-.4 2-3.7 1.7 3.6 4 .7-3 2.8z", className: "supply_center Apu" }),
                React.createElement("path", { d: "M512 683.2l-3.7-2-3.7 2 .8-4.2-3-3 4.2-.4 2-3.6 1.6 3.7 4 .6-3 2.8z", className: "supply_center Nap" }),
                React.createElement("path", { d: "M558.6 733.4l-3.6-2-3.7 1.8.8-4-2.8-3 4-.4 2-3.7 1.7 4 4 .5-3 2.8z", className: "supply_center Ion" }),
                React.createElement("path", { d: "M477.2 713.6l-3.5-2-3.7 1.8.8-4-3-3 4.2-.4 1.8-3.7 1.8 3.8 4 .7-3 2.8z", className: "supply_center Tyn" }),
                React.createElement("path", { d: "M632.8 708.6l-3.6-2-3.7 2 .8-4-3-3 4.2-.6 2-3.6 1.6 3.7 4.2.8-3 2.8z", className: "supply_center Aeg" }),
                React.createElement("path", { d: "M711.3 769.5l-3.6-2-3.7 1.8.8-4-3-3 4.2-.5 2-3.6 1.6 3.7 4 .6-3 2.8z", className: "supply_center Eas" }),
                React.createElement("path", { d: "M769.3 768l-3.6-2-3.7 2 .8-4-3-3 4.2-.6 2-3.6 1.6 3.7 4 .7-3 2.8z", className: "supply_center Syr" }),
                React.createElement("path", { d: "M776.3 716.4l-3.5-2-3.7 2 1-4-3-3 4-.6 2-3.6 1.7 3.7 4 .6-3 2.8z", className: "supply_center Smy" }),
                React.createElement("path", { d: "M762.2 689.6l-3.6-2-3.7 1.8.7-4-3-3 4.2-.4 1.8-3.7 1.7 3.7 4 .7-3 2.8z", className: "supply_center Ank" }),
                React.createElement("path", { d: "M683.7 705l-3.6-1.8-3.5 1.8.8-4-3-3 4-.5 2-3.6 1.8 3.6 4 .7-3 2.8z", className: "supply_center Con" }),
                React.createElement("path", { d: "M597.5 718l-3.6-2-3.8 1.7.8-4-3-3 4.2-.5 2-3.6 1.6 3.7 4 .7-3 2.8z", className: "supply_center Gre" }),
                React.createElement("path", { d: "M570.6 664l-3.6-2-3.7 2 .8-4-2.8-3 4-.5 2-3.6 1.7 3.6 4 .7-3 2.8z", className: "supply_center Alb" }),
                React.createElement("path", { d: "M585.5 636.5l-3.6-2-3.8 2 .8-4-3-3 4.2-.6 1.8-3.7 1.8 3.7 4 .7-3 2.8z", className: "supply_center Ser" }),
                React.createElement("path", { d: "M567 613.2l-3.5-2-3.7 2 .8-4.2-3-3 4-.4 2-3.6 1.8 3.7 4 .6-3 3z", className: "supply_center Bud" }),
                React.createElement("path", { d: "M541 590l-3.7-2-3.7 1.7.8-4-3-3 4.2-.4 2-3.7 1.6 3.7 4 .7-3 2.8z", className: "supply_center Vie" }),
                React.createElement("path", { d: "M578.4 551l-3.6-2-3.7 1.8 1-4-3-3 4-.4 2-3.7 1.7 3.7 4 .7-3 3z", className: "supply_center Gal" }),
                React.createElement("path", { d: "M628 490.2l-3.7-2-3.7 1.8.8-4-3-3 4.2-.4 1.8-3.7 1.8 3.6 4 .7-3 2.8z", className: "supply_center War" }),
                React.createElement("path", { d: "M652 546.7l-3.7-2-3.7 2 .8-4.2-3-3 4.2-.4 2-3.5 1.6 3.7 4 .7-3 2.7z", className: "supply_center Ukr" }),
                React.createElement("path", { d: "M743 573l-3.5-2-3.6 1.7.6-4-2.8-3 4-.4 2-3.7 1.7 3.8 4 .6-3 2.8z", className: "supply_center Sev" }),
                React.createElement("path", { d: "M638.5 582.8l-3.6-2-3.8 2 .8-4.2-3-3 4.2-.4 2-3.6 1.6 3.7 4 .6-3 2.8z", className: "supply_center Rum" }),
                React.createElement("path", { d: "M853.4 708.6l-3.6-2-3.6 2 .7-4-3-3 4-.6 2-3.6 1.8 3.7 4 .8-3 2.8z", className: "supply_center Arm" }),
                React.createElement("path", { d: "M739.6 637.2l-3.6-2-3.7 2 .8-4-2.8-3 4-.6 2-3.6 1.7 3.7 4 .7-3 2.8z", className: "supply_center Bla" }),
                React.createElement("path", { d: "M735.3 429.3l-3.6-2-3.6 2 1-4-3-3 4-.6 2-3.6 1.7 3.8 4 .7-3 2.8z", className: "supply_center Mos" }),
                React.createElement("path", { d: "M621.2 640.2l-3.6-2-3.7 2 .7-4.2-3-3 4.2-.4 1.8-3.6 1.7 3.7 4 .7-3 2.8z", className: "supply_center Bul" }),
                React.createElement("path", { d: "M778.5 35.5l-3.6-2-3.8 1.8.8-4-3-3 4.2-.4 2-3.8 1.6 3.8 4 .6-3 2.8z", className: "supply_center Bar" })),
            React.createElement("g", { fontWeight: "bold", fontSize: "13.1", fontFamily: "sans-serif", letterSpacing: "0", wordSpacing: "0", stroke: "#fff", strokeWidth: ".5" },
                React.createElement("text", { className: "province_name NAt", y: "336.5", x: "78.8", style: { lineHiehgt: "125%" } },
                    React.createElement("tspan", { y: "336.5", x: "78.8" }, "NAt")),
                React.createElement("text", { className: "province_name Nrg", y: "121.1", x: "300.4", style: { lineHiehgt: "125%" } },
                    React.createElement("tspan", { y: "121.1", x: "300.4" }, "Nrg")),
                React.createElement("text", { className: "province_name Nth", y: "419.5", x: "347.6", style: { lineHiehgt: "125%" } },
                    React.createElement("tspan", { y: "419.5", x: "347.6" }, "Nth")),
                React.createElement("text", { className: "province_name Bar", y: "33.8", x: "735", style: { lineHiehgt: "125%" } },
                    React.createElement("tspan", { y: "33.8", x: "735" }, "Bar")),
                React.createElement("text", { className: "province_name Nwy", y: "302.6", x: "420.9", style: { lineHiehgt: "125%" } },
                    React.createElement("tspan", { y: "302.6", x: "420.9" }, "Nwy")),
                React.createElement("text", { className: "province_name Swe", y: "253.6", x: "498.3", style: { lineHiehgt: "125%" } },
                    React.createElement("tspan", { y: "253.6", x: "498.3" }, "Swe")),
                React.createElement("text", { className: "province_name Fin", y: "279.1", x: "602.9", style: { lineHiehgt: "125%" } },
                    React.createElement("tspan", { y: "279.1", x: "602.9" }, "Fin")),
                React.createElement("text", { className: "province_name StP", y: "325.5", x: "702.5", style: { lineHiehgt: "125%" } },
                    React.createElement("tspan", { y: "325.5", x: "702.5" }, "StP")),
                React.createElement("text", { className: "province_name Bot", y: "352.6", x: "552.3", style: { lineHiehgt: "125%" } },
                    React.createElement("tspan", { y: "352.6", x: "552.3" }, "Bot")),
                React.createElement("text", { className: "province_name Bal", y: "433.7", x: "507.1", style: { lineHiehgt: "125%" } },
                    React.createElement("tspan", { y: "433.7", x: "507.1" }, "Bal")),
                React.createElement("text", { className: "province_name Ska", y: "379.6", x: "426.9", style: { lineHiehgt: "125%" } },
                    React.createElement("tspan", { y: "379.6", x: "426.9" }, "Ska")),
                React.createElement("text", { className: "province_name Hel", y: "447.6", x: "396.9", style: { lineHiehgt: "125%" } },
                    React.createElement("tspan", { y: "447.6", x: "396.9" }, "Hel")),
                React.createElement("text", { className: "province_name Den", y: "410.7", x: "432.8", style: { lineHiehgt: "125%" } },
                    React.createElement("tspan", { y: "410.7", x: "432.8" }, "Den")),
                React.createElement("text", { className: "province_name Lvn", y: "415.9", x: "599.7", style: { lineHiehgt: "125%" } },
                    React.createElement("tspan", { y: "415.9", x: "599.7" }, "Lvn")),
                React.createElement("text", { className: "province_name Mos", y: "428.1", x: "752.9", style: { lineHiehgt: "125%" } },
                    React.createElement("tspan", { y: "428.1", x: "752.9" }, "Mos")),
                React.createElement("text", { className: "province_name Sev", y: "524.8", x: "748.4", style: { lineHiehgt: "125%" } },
                    React.createElement("tspan", { y: "524.8", x: "748.4" }, "Sev")),
                React.createElement("text", { className: "province_name Ukr", y: "520.7", x: "651.3", style: { lineHiehgt: "125%" } },
                    React.createElement("tspan", { y: "520.7", x: "651.3" }, "Ukr")),
                React.createElement("text", { className: "province_name War", y: "489.9", x: "584.7", style: { lineHiehgt: "125%" } },
                    React.createElement("tspan", { y: "489.9", x: "584.7" }, "War")),
                React.createElement("text", { className: "province_name Pru", y: "466.6", x: "513.4", style: { lineHiehgt: "125%" } },
                    React.createElement("tspan", { y: "466.6", x: "513.4" }, "Pru")),
                React.createElement("text", { className: "province_name Sil", y: "506.6", x: "500.4", style: { lineHiehgt: "125%" } },
                    React.createElement("tspan", { y: "506.6", x: "500.4" }, "Sil")),
                React.createElement("text", { className: "province_name Ber", y: "470.8", x: "466.5", style: { lineHiehgt: "125%" } },
                    React.createElement("tspan", { y: "470.8", x: "466.5" }, "Ber")),
                React.createElement("text", { className: "province_name Kie", y: "481.1", x: "426.4", style: { lineHiehgt: "125%" } },
                    React.createElement("tspan", { y: "481.1", x: "426.4" }, "Kie")),
                React.createElement("text", { className: "province_name Mun", y: "554.6", x: "447.9", style: { lineHiehgt: "125%" } },
                    React.createElement("tspan", { y: "554.6", x: "447.9" }, "Mun")),
                React.createElement("text", { className: "province_name Ruh", y: "530.6", x: "412.9", style: { lineHiehgt: "125%" } },
                    React.createElement("tspan", { y: "530.6", x: "412.9" }, "Ruh")),
                React.createElement("text", { className: "province_name Hol", y: "490.6", x: "387.9", style: { lineHiehgt: "125%" } },
                    React.createElement("tspan", { y: "490.6", x: "387.9" }, "Hol")),
                React.createElement("text", { className: "province_name Bel", y: "516.6", x: "376.9", style: { lineHiehgt: "125%" } },
                    React.createElement("tspan", { y: "516.6", x: "376.9" }, "Bel")),
                React.createElement("text", { className: "province_name Boh", y: "540.5", x: "500", style: { lineHiehgt: "125%" } },
                    React.createElement("tspan", { y: "540.5", x: "500" }, "Boh")),
                React.createElement("text", { className: "province_name Gal", y: "558.6", x: "583.4", style: { lineHiehgt: "125%" } },
                    React.createElement("tspan", { y: "558.6", x: "583.4" }, "Gal")),
                React.createElement("text", { className: "province_name Cly", y: "394.2", x: "260.1", style: { lineHiehgt: "125%" } },
                    React.createElement("tspan", { y: "394.2", x: "260.1" }, "Cly")),
                React.createElement("text", { className: "province_name Edi", y: "403.1", x: "285.9", style: { lineHiehgt: "125%" } },
                    React.createElement("tspan", { y: "403.1", x: "285.9" }, "Edi")),
                React.createElement("text", { className: "province_name Yor", y: "458.6", x: "315.3", style: { lineHiehgt: "125%" } },
                    React.createElement("tspan", { y: "458.6", x: "315.3" }, "Yor")),
                React.createElement("text", { className: "province_name Lon", y: "495.1", x: "323.4", style: { lineHiehgt: "125%" } },
                    React.createElement("tspan", { y: "495.1", x: "323.4" }, "Lon")),
                React.createElement("text", { className: "province_name Lvp", y: "428.9", x: "271.7", style: { lineHiehgt: "125%" } },
                    React.createElement("tspan", { y: "428.9", x: "271.7" }, "Lvp")),
                React.createElement("text", { className: "province_name Wal", y: "506.1", x: "284.9", style: { lineHiehgt: "125%" } },
                    React.createElement("tspan", { y: "506.1", x: "284.9" }, "Wal")),
                React.createElement("text", { className: "province_name Iri", y: "501.1", x: "165.4", style: { lineHiehgt: "125%" } },
                    React.createElement("tspan", { y: "501.1", x: "165.4" }, "Iri")),
                React.createElement("text", { className: "province_name Mid", y: "663.8", x: "95.3", style: { lineHiehgt: "125%" } },
                    React.createElement("tspan", { y: "663.8", x: "95.3" }, "Mid")),
                React.createElement("text", { className: "province_name Eng", y: "532.6", x: "285.9", style: { lineHiehgt: "125%" } },
                    React.createElement("tspan", { y: "532.6", x: "285.9" }, "Eng")),
                React.createElement("text", { className: "province_name NAf", y: "774.1", x: "344.9", style: { lineHiehgt: "125%" } },
                    React.createElement("tspan", { y: "774.1", x: "344.9" }, "NAf")),
                React.createElement("text", { className: "province_name Por", y: "692.5", x: "232.5", style: { lineHiehgt: "125%" } },
                    React.createElement("tspan", { y: "692.5", x: "232.5" }, "Por")),
                React.createElement("text", { className: "province_name Spa", y: "687.6", x: "281.4", style: { lineHiehgt: "125%" } },
                    React.createElement("tspan", { y: "687.6", x: "281.4" }, "Spa")),
                React.createElement("text", { className: "province_name Mar", y: "628.6", x: "375.4", style: { lineHiehgt: "125%" } },
                    React.createElement("tspan", { y: "628.6", x: "375.4" }, "Mar")),
                React.createElement("text", { className: "province_name Gas", y: "620.6", x: "326.4", style: { lineHiehgt: "125%" } },
                    React.createElement("tspan", { y: "620.6", x: "326.4" }, "Gas")),
                React.createElement("text", { className: "province_name Bre", y: "569.1", x: "307.4", style: { lineHiehgt: "125%" } },
                    React.createElement("tspan", { y: "569.1", x: "307.4" }, "Bre")),
                React.createElement("text", { className: "province_name Pic", y: "538.1", x: "349", style: { lineHiehgt: "125%" } },
                    React.createElement("tspan", { y: "538.1", x: "349" }, "Pic")),
                React.createElement("text", { className: "province_name Par", y: "575.1", x: "350.4", style: { lineHiehgt: "125%" } },
                    React.createElement("tspan", { y: "575.1", x: "350.4" }, "Par")),
                React.createElement("text", { className: "province_name Bur", y: "566.1", x: "385.9", style: { lineHiehgt: "125%" } },
                    React.createElement("tspan", { y: "566.1", x: "385.9" }, "Bur")),
                React.createElement("text", { className: "province_name GoL", y: "684.2", x: "373.4", style: { lineHiehgt: "125%" } },
                    React.createElement("tspan", { y: "684.2", x: "373.4" }, "GoL")),
                React.createElement("text", { className: "province_name Wes", y: "724.1", x: "364.9", style: { lineHiehgt: "125%" } },
                    React.createElement("tspan", { y: "724.1", x: "364.9" }, "Wes")),
                React.createElement("text", { className: "province_name Tun", y: "778", x: "437.4", style: { lineHiehgt: "125%" } },
                    React.createElement("tspan", { y: "778", x: "437.4" }, "Tun")),
                React.createElement("text", { className: "province_name Tyn", y: "696.1", x: "458.4", style: { lineHiehgt: "125%" } },
                    React.createElement("tspan", { y: "696.1", x: "458.4" }, "Tyn")),
                React.createElement("text", { className: "province_name Ion", y: "756.2", x: "538.4", style: { lineHiehgt: "125%" } },
                    React.createElement("tspan", { y: "756.2", x: "538.4" }, "Ion")),
                React.createElement("text", { className: "province_name Adr", y: "646.1", x: "506.9", style: { lineHiehgt: "125%" } },
                    React.createElement("tspan", { y: "646.1", x: "506.9" }, "Adr")),
                React.createElement("text", { className: "province_name Pie", y: "610.1", x: "422.4", style: { lineHiehgt: "125%" } },
                    React.createElement("tspan", { y: "610.1", x: "422.4" }, "Pie")),
                React.createElement("text", { className: "province_name Tyr", y: "576.6", x: "473.4", style: { lineHiehgt: "125%" } },
                    React.createElement("tspan", { y: "576.6", x: "473.4" }, "Tyr")),
                React.createElement("text", { className: "province_name Bla", y: "637.5", x: "703.3", style: { lineHiehgt: "125%" } },
                    React.createElement("tspan", { y: "637.5", x: "703.3" }, "Bla")),
                React.createElement("text", { className: "province_name Arm", y: "690.1", x: "832.9", style: { lineHiehgt: "125%" } },
                    React.createElement("tspan", { y: "690.1", x: "832.9" }, "Arm")),
                React.createElement("text", { className: "province_name Syr", y: "767.7", x: "782.9", style: { lineHiehgt: "125%" } },
                    React.createElement("tspan", { y: "767.7", x: "782.9" }, "Syr")),
                React.createElement("text", { className: "province_name Smy", y: "726.5", x: "728.6", style: { lineHiehgt: "125%" } },
                    React.createElement("tspan", { y: "726.5", x: "728.6" }, "Smy")),
                React.createElement("text", { className: "province_name Ank", y: "690.6", x: "714.3", style: { lineHiehgt: "125%" } },
                    React.createElement("tspan", { y: "690.6", x: "714.3" }, "Ank")),
                React.createElement("text", { className: "province_name Con", y: "691.6", x: "656.6", style: { lineHiehgt: "125%" } },
                    React.createElement("tspan", { y: "691.6", x: "656.6" }, "Con")),
                React.createElement("text", { className: "province_name Bul", y: "657.6", x: "612.9", style: { lineHiehgt: "125%" } },
                    React.createElement("tspan", { y: "657.6", x: "612.9" }, "Bul")),
                React.createElement("text", { className: "province_name Rum", y: "607.1", x: "619.2", style: { lineHiehgt: "125%" } },
                    React.createElement("tspan", { y: "607.1", x: "619.2" }, "Rum")),
                React.createElement("text", { className: "province_name Gre", y: "704.1", x: "582.3", style: { lineHiehgt: "125%" } },
                    React.createElement("tspan", { y: "704.1", x: "582.3" }, "Gre")),
                React.createElement("text", { className: "province_name Ser", y: "658.1", x: "576", style: { lineHiehgt: "125%" } },
                    React.createElement("tspan", { y: "658.1", x: "576" }, "Ser")),
                React.createElement("text", { className: "province_name Alb", y: "676.1", x: "552.4", style: { lineHiehgt: "125%" } },
                    React.createElement("tspan", { y: "676.1", x: "552.4" }, "Alb")),
                React.createElement("text", { className: "province_name Tri", y: "618.6", x: "511.4", style: { lineHiehgt: "125%" } },
                    React.createElement("tspan", { y: "618.6", x: "511.4" }, "Tri")),
                React.createElement("text", { className: "province_name Vie", y: "571.1", x: "534.9", style: { lineHiehgt: "125%" } },
                    React.createElement("tspan", { y: "571.1", x: "534.9" }, "Vie")),
                React.createElement("text", { className: "province_name Bud", y: "591.7", x: "565.3", style: { lineHiehgt: "125%" } },
                    React.createElement("tspan", { y: "591.7", x: "565.3" }, "Bud")),
                React.createElement("text", { className: "province_name Tus", y: "629.1", x: "435.4", style: { lineHiehgt: "125%" } },
                    React.createElement("tspan", { y: "629.1", x: "435.4" }, "Tus")),
                React.createElement("text", { className: "province_name Ven", y: "611.1", x: "460.9", style: { lineHiehgt: "125%" } },
                    React.createElement("tspan", { y: "611.1", x: "460.9" }, "Ven")),
                React.createElement("text", { className: "province_name Rom", y: "659.1", x: "463.9", style: { lineHiehgt: "125%" } },
                    React.createElement("tspan", { y: "659.1", x: "463.9" }, "Rom")),
                React.createElement("text", { className: "province_name Nap", y: "692.1", x: "500.9", style: { lineHiehgt: "125%" } },
                    React.createElement("tspan", { y: "692.1", x: "500.9" }, "Nap")),
                React.createElement("text", { className: "province_name Apu", y: "669.1", x: "511.9", style: { lineHiehgt: "125%" } },
                    React.createElement("tspan", { y: "669.1", x: "511.9" }, "Apu")),
                React.createElement("text", { className: "province_name Aeg", y: "736.8", x: "619.8", style: { lineHiehgt: "125%" } },
                    React.createElement("tspan", { y: "736.8", x: "619.8" }, "Aeg")),
                React.createElement("text", { className: "province_name Eas", y: "772.8", x: "661.8", style: { inlineHeight: "125%" } },
                    React.createElement("tspan", { y: "772.8", x: "661.8" }, "Eas"))),
            React.createElement("g", { fontWeight: "bold", fontSize: "13.1", fontFamily: "sans-serif", letterSpacing: "0", wordSpacing: "0", stroke: "#fff", strokeWidth: ".5" },
                React.createElement("text", { className: "location_name StP_NC", y: "95", x: "724.4", style: { lineHiehgt: "125%" } },
                    React.createElement("tspan", { y: "95", x: "724.4" }, "NC")),
                React.createElement("text", { className: "location_name StP_SC", y: "347", x: "632.4", style: { lineHiehgt: "125%" } },
                    React.createElement("tspan", { y: "347", x: "632.4" }, "SC")),
                React.createElement("text", { className: "location_name Spa_NC", y: "645.2", x: "268.1", style: { lineHiehgt: "125%" } },
                    React.createElement("tspan", { y: "645.2", x: "268.1" }, "NC")),
                React.createElement("text", { className: "location_name Spa_SC", y: "728.2", x: "285.2", style: { lineHiehgt: "125%" } },
                    React.createElement("tspan", { y: "728.2", x: "285.2" }, "SC")),
                React.createElement("text", { className: "location_name Bul_SC", y: "672.2", x: "613.2", style: { lineHiehgt: "125%" } },
                    React.createElement("tspan", { y: "672.2", x: "613.2" }, "SC")),
                React.createElement("text", { className: "location_name Bul_EC", y: "647.2", x: "645.2", style: { lineHiehgt: "125%" } },
                    React.createElement("tspan", { y: "647.2", x: "645.2" }, "EC"))));
    }
}
exports.MapImage = MapImage;

},{"react":210}],217:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const units_component_1 = require("./units-component");
const standardRule_1 = require("./../../standardRule");
const position_1 = require("./position");
const configs_1 = require("./configs");
class OrdersComponent extends standardRule_1.standardRule.OrdersComponent {
    constructor() {
        super(...arguments);
        this.colors = configs_1.colors;
        this.size = configs_1.size;
        this.Unit = units_component_1.UnitComponent;
    }
    locationPositionOf(location, isDislodged) {
        return position_1.locationPositionOf(location, isDislodged);
    }
    provincePositionOf(province) {
        return position_1.provincePositionOf(province);
    }
}
exports.OrdersComponent = OrdersComponent;

},{"./../../standardRule":222,"./configs":214,"./position":218,"./units-component":221}],218:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const diplomacy = require("js-diplomacy");
const $ = diplomacy.standardMap.locations;
function locationPositionOf(location, isDislodged) {
    if (isDislodged) {
        if (location === $.NAt)
            return { x: 124.4398422241211, y: 351.57806396484375 };
        if (location === $.Nrg)
            return { x: 337.2943115234375, y: 152.8756561279297 };
        if (location === $.Bar)
            return { x: 815.5933227539062, y: 51.651466369628906 };
        if (location === $.Iri)
            return { x: 228.39202880859375, y: 508.54547119140625 };
        if (location === $.Cly)
            return { x: 278.6011657714844, y: 372.7761535644531 };
        if (location === $.Edi)
            return { x: 308.3095703125, y: 414.49151611328125 };
        if (location === $.Lvp)
            return { x: 292.0322265625, y: 444.91595458984375 };
        if (location === $.Yor)
            return { x: 322.4311828613281, y: 446.3056640625 };
        if (location === $.Nth)
            return { x: 369.8224792480469, y: 404.5927734375 };
        if (location === $.Wal)
            return { x: 289.9074401855469, y: 492.2822570800781 };
        if (location === $.Lon)
            return { x: 344.36065673828125, y: 490.87225341796875 };
        if (location === $.Ska)
            return { x: 444.0724792480469, y: 371.3527526855469 };
        if (location === $.Nwy)
            return { x: 403.76141357421875, y: 311.2488708496094 };
        if (location === $.Swe)
            return { x: 539.5283203125, y: 318.3427734375 };
        if (location === $.Fin)
            return { x: 590.4282836914062, y: 272.37835693359375 };
        if (location === $.StP_NC)
            return { x: 779.934326171875, y: 113.97753143310547 };
        if (location === $.StP_SC)
            return { x: 630.7330322265625, y: 340.95855712890625 };
        if (location === $.StP)
            return { x: 755.8904418945312, y: 299.9393615722656 };
        if (location === $.Mos)
            return { x: 762.9635009765625, y: 442.7864685058594 };
        if (location === $.Sev)
            return { x: 714.1729736328125, y: 581.3807373046875 };
        if (location === $.Ukr)
            return { x: 667.509521484375, y: 536.8307495117188 };
        if (location === $.Lvn)
            return { x: 625.0924682617188, y: 390.8027648925781 };
        if (location === $.War)
            return { x: 599.6224975585938, y: 483.7927551269531 };
        if (location === $.Pru)
            return { x: 543.0679931640625, y: 449.8543395996094 };
        if (location === $.Bal)
            return { x: 542.3524780273438, y: 415.90277099609375 };
        if (location === $.Bot)
            return { x: 590.4425048828125, y: 339.5527648925781 };
        if (location === $.Den)
            return { x: 446.1858825683594, y: 396.8153381347656 };
        if (location === $.Hel)
            return { x: 422.13800048828125, y: 440.6614685058594 };
        if (location === $.Kie)
            return { x: 456.07220458984375, y: 451.9716796875 };
        if (location === $.Ber)
            return { x: 495.680419921875, y: 454.8130187988281 };
        if (location === $.Hol)
            return { x: 405.8822326660156, y: 471.7843322753906 };
        if (location === $.Bel)
            return { x: 385.3840637207031, y: 502.1830139160156 };
        if (location === $.Eng)
            return { x: 320.3063659667969, y: 526.9320068359375 };
        if (location === $.Mid)
            return { x: 164.76329040527344, y: 654.2180786132812 };
        if (location === $.Spa_NC)
            return { x: 282.83935546875, y: 636.53515625 };
        if (location === $.Spa)
            return { x: 325.2633056640625, y: 655.6286010742188 };
        if (location === $.Spa_SC)
            return { x: 331.6366882324219, y: 697.3419799804688 };
        if (location === $.Por)
            return { x: 248.19430541992188, y: 688.1619262695312 };
        if (location === $.NAf)
            return { x: 323.14105224609375, y: 762.3985595703125 };
        if (location === $.Tun)
            return { x: 454.6711730957031, y: 734.1174926757812 };
        if (location === $.Wes)
            return { x: 421.4477844238281, y: 715.015380859375 };
        if (location === $.GoL)
            return { x: 410.1080017089844, y: 656.32275390625 };
        if (location === $.Par)
            return { x: 365.58380126953125, y: 562.9927368164062 };
        if (location === $.Pic)
            return { x: 365.5622253417969, y: 517.7230529785156 };
        if (location === $.Bur)
            return { x: 414.35906982421875, y: 554.5027465820312 };
        if (location === $.Ruh)
            return { x: 433.4606628417969, y: 529.0575561523438 };
        if (location === $.Mun)
            return { x: 468.10247802734375, y: 543.1927490234375 };
        if (location === $.Boh)
            return { x: 509.11248779296875, y: 536.832763671875 };
        if (location === $.Sil)
            return { x: 555.7733154296875, y: 522.6843872070312 };
        if (location === $.Gal)
            return { x: 613.0733642578125, y: 552.376708984375 };
        if (location === $.Tyr)
            return { x: 502.7524719238281, y: 568.6327514648438 };
        if (location === $.Vie)
            return { x: 543.7579956054688, y: 582.0769653320312 };
        if (location === $.Bud)
            return { x: 591.8477783203125, y: 594.8096313476562 };
        if (location === $.Rum)
            return { x: 670.3272705078125, y: 601.1825561523438 };
        if (location === $.Bla)
            return { x: 736.1038818359375, y: 627.3422241210938 };
        if (location === $.Arm)
            return { x: 806.0941772460938, y: 641.478759765625 };
        if (location === $.Ank)
            return { x: 755.1911010742188, y: 669.7764282226562 };
        if (location === $.Smy)
            return { x: 721.23681640625, y: 730.5635986328125 };
        if (location === $.Syr)
            return { x: 753.0556030273438, y: 775.1227416992188 };
        if (location === $.Con)
            return { x: 677.4124755859375, y: 670.4827880859375 };
        if (location === $.Bul_SC)
            return { x: 631.4524536132812, y: 673.302734375 };
        if (location === $.Bul)
            return { x: 622.2424926757812, y: 641.4727783203125 };
        if (location === $.Bul_EC)
            return { x: 658.302490234375, y: 637.2427368164062 };
        if (location === $.Gre)
            return { x: 597.4969482421875, y: 717.8351440429688 };
        if (location === $.Aeg)
            return { x: 627.8998413085938, y: 707.24169921875 };
        if (location === $.Eas)
            return { x: 673.876220703125, y: 765.231201171875 };
        if (location === $.Ion)
            return { x: 581.2317504882812, y: 768.7667236328125 };
        if (location === $.Alb)
            return { x: 564.9724731445312, y: 675.4327392578125 };
        if (location === $.Ser)
            return { x: 588.3125, y: 640.062744140625 };
        if (location === $.Tri)
            return { x: 534.5824584960938, y: 625.9327392578125 };
        if (location === $.Adr)
            return { x: 528.9075317382812, y: 645.01220703125 };
        if (location === $.Ven)
            return { x: 489.30328369140625, y: 628.7470092773438 };
        if (location === $.Pie)
            return { x: 439.829345703125, y: 618.869384765625 };
        if (location === $.Tus)
            return { x: 454.6793518066406, y: 631.5811767578125 };
        if (location === $.Rom)
            return { x: 485.7879943847656, y: 659.83984375 };
        if (location === $.Nap)
            return { x: 532.447509765625, y: 699.4751586914062 };
        if (location === $.Apu)
            return { x: 538.113525390625, y: 676.8422241210938 };
        if (location === $.Tyn)
            return { x: 464.5587463378906, y: 685.3287963867188 };
    }
    else {
        if (location === $.Tus)
            return { x: 453.29248046875, y: 625.1227416992188 };
        if (location === $.NAt)
            return { x: 106.0624771118164, y: 359.3527526855469 };
        if (location === $.Nrg)
            return { x: 316.0824890136719, y: 164.18275451660156 };
        if (location === $.Nth)
            return { x: 364.1595764160156, y: 431.4822692871094 };
        if (location === $.Nwy)
            return { x: 409.4234619140625, y: 333.18212890625 };
        if (location === $.Swe)
            return { x: 529.61279296875, y: 340.2370910644531 };
        if (location === $.StP_NC)
            return { x: 747.4224853515625, y: 99.83274841308594 };
        if (location === $.StP)
            return { x: 729.032470703125, y: 300.6527404785156 };
        if (location === $.StP_SC)
            return { x: 660.4398803710938, y: 341.67169189453125 };
        if (location === $.Fin)
            return { x: 597.506591796875, y: 297.83416748046875 };
        if (location === $.Bot)
            return { x: 584.7625122070312, y: 340.9727478027344 };
        if (location === $.Bal)
            return { x: 526.08251953125, y: 416.63275146484375 };
        if (location === $.Ska)
            return { x: 451.1424865722656, y: 366.4127502441406 };
        if (location === $.Den)
            return { x: 444.76116943359375, y: 417.3182678222656 };
        if (location === $.Kie)
            return { x: 444.7782897949219, y: 449.8395690917969 };
        if (location === $.Ber)
            return { x: 477.30694580078125, y: 454.7979736328125 };
        if (location === $.Pru)
            return { x: 564.2691040039062, y: 449.13482666015625 };
        if (location === $.Lvn)
            return { x: 596.0908813476562, y: 399.63427734375 };
        if (location === $.Mos)
            return { x: 741.0625, y: 441.3527526855469 };
        if (location === $.Sil)
            return { x: 538.8298950195312, y: 502.87750244140625 };
        if (location === $.War)
            return { x: 620.8324584960938, y: 485.2027587890625 };
        if (location === $.Ukr)
            return { x: 680.2324829101562, y: 514.9027709960938 };
        if (location === $.Sev)
            return { x: 731.14697265625, y: 594.795166015625 };
        if (location === $.Arm)
            return { x: 825.90478515625, y: 650.6664428710938 };
        if (location === $.Ank)
            return { x: 731.1529541015625, y: 666.232177734375 };
        if (location === $.Smy)
            return { x: 695.802490234375, y: 729.1625366210938 };
        if (location === $.Syr)
            return { x: 759.41796875, y: 752.5067138671875 };
        if (location === $.Con)
            return { x: 656.1853637695312, y: 697.3285522460938 };
        if (location === $.Eas)
            return { x: 650.532470703125, y: 770.8927612304688 };
        if (location === $.Aeg)
            return { x: 628.6224975585938, y: 723.5127563476562 };
        if (location === $.Ion)
            return { x: 557.8924560546875, y: 766.6327514648438 };
        if (location === $.Gre)
            return { x: 582.6600952148438, y: 700.1827392578125 };
        if (location === $.Bul_SC)
            return { x: 625.0924682617188, y: 669.0427856445312 };
        if (location === $.Bul)
            return { x: 619.4224853515625, y: 647.832763671875 };
        if (location === $.Bul_EC)
            return { x: 651.9425048828125, y: 642.1927490234375 };
        if (location === $.Rum)
            return { x: 654.7745971679688, y: 616.0322875976562 };
        if (location === $.Ser)
            return { x: 584.0824584960938, y: 648.552734375 };
        if (location === $.Alb)
            return { x: 564.282470703125, y: 667.6327514648438 };
        if (location === $.Tri)
            return { x: 533.8622436523438, y: 626.6306762695312 };
        if (location === $.Bud)
            return { x: 571.3327026367188, y: 596.2198486328125 };
        if (location === $.Vie)
            return { x: 540.2224731445312, y: 571.4827880859375 };
        if (location === $.Gal)
            return { x: 591.8524780273438, y: 550.9627685546875 };
        if (location === $.Boh)
            return { x: 516.8824768066406, y: 526.9327392578125 };
        if (location === $.Tyr)
            return { x: 492.1324768066406, y: 571.4827880859375 };
        if (location === $.Ven)
            return { x: 478.0024719238281, y: 611.082763671875 };
        if (location === $.Rom)
            return { x: 481.54248046875, y: 653.5027465820312 };
        if (location === $.Apu)
            return { x: 524.6869506835938, y: 661.9758911132812 };
        if (location === $.Adr)
            return { x: 509.8324890136719, y: 632.2927856445312 };
        if (location === $.Nap)
            return { x: 514.0582580566406, y: 682.5043334960938 };
        if (location === $.Tyn)
            return { x: 483.6724853515625, y: 695.2327880859375 };
        if (location === $.Wes)
            return { x: 397.3924865722656, y: 717.852783203125 };
        if (location === $.GoL)
            return { x: 388.9024658203125, y: 664.812744140625 };
        if (location === $.NAf)
            return { x: 301.9486389160156, y: 765.2230224609375 };
        if (location === $.Tun)
            return { x: 455.3693542480469, y: 752.5027465820312 };
        if (location === $.Spa)
            return { x: 304.7524719238281, y: 665.5327758789062 };
        if (location === $.Spa_NC)
            return { x: 259.5124816894531, y: 635.832763671875 };
        if (location === $.Spa_SC)
            return { x: 323.86248779296875, y: 717.852783203125 };
        if (location === $.Por)
            return { x: 246.05982971191406, y: 709.3541259765625 };
        if (location === $.Mid)
            return { x: 139.9924774169922, y: 675.6327514648438 };
        if (location === $.Gas)
            return { x: 335.1769714355469, y: 624.4929809570312 };
        if (location === $.Mar)
            return { x: 399.5227355957031, y: 628.7388916015625 };
        if (location === $.Pie)
            return { x: 429.2227478027344, y: 614.6006469726562 };
        if (location === $.Mun)
            return { x: 443.3495178222656, y: 555.2128295898438 };
        if (location === $.Ruh)
            return { x: 421.4398498535156, y: 512.0830383300781 };
        if (location === $.Bel)
            return { x: 381.1324768066406, y: 509.26275634765625 };
        if (location === $.Hol)
            return { x: 397.3924865722656, y: 483.7927551269531 };
        if (location === $.Hel)
            return { x: 410.8324890136719, y: 442.0627746582031 };
        if (location === $.Eng)
            return { x: 333.7624816894531, y: 516.3127746582031 };
        if (location === $.Lon)
            return { x: 346.4945983886719, y: 480.964599609375 };
        if (location === $.Wal)
            return { x: 297.6811828613281, y: 507.8348693847656 };
        if (location === $.Yor)
            return { x: 321.0124816894531, y: 452.6827697753906 };
        if (location === $.Lvp)
            return { x: 283.54248046875, y: 429.3427734375 };
        if (location === $.Edi)
            return { x: 303.34246826171875, y: 394.6927490234375 };
        if (location === $.Cly)
            return { x: 276.49249267578125, y: 393.28277587890625 };
        if (location === $.Iri)
            return { x: 248.89913940429688, y: 505.71331787109375 };
        if (location === $.Pic)
            return { x: 353.563232421875, y: 531.1627807617188 };
        if (location === $.Par)
            return { x: 359.2024841308594, y: 572.8927612304688 };
        if (location === $.Bur)
            return { x: 395.2624816894531, y: 562.2727661132812 };
        if (location === $.Bre)
            return { x: 302.6492919921875, y: 558.7543334960938 };
        if (location === $.Bar)
            return { x: 849.7499389648438, y: 42.48749542236328 };
        if (location === $.Bla)
            return { x: 756.5918579101562, y: 632.287841796875 };
    }
    return { x: 0, y: 0 };
}
exports.locationPositionOf = locationPositionOf;
function provincePositionOf(province) {
    if (province === $.Tus.province)
        return { x: 453.29248046875, y: 625.1227416992188 };
    if (province === $.NAt.province)
        return { x: 106.0624771118164, y: 359.3527526855469 };
    if (province === $.Nrg.province)
        return { x: 316.0824890136719, y: 164.18275451660156 };
    if (province === $.Nth.province)
        return { x: 364.1595764160156, y: 431.4822692871094 };
    if (province === $.Nwy.province)
        return { x: 409.4234619140625, y: 333.18212890625 };
    if (province === $.Swe.province)
        return { x: 529.61279296875, y: 340.2370910644531 };
    if (province === $.StP.province)
        return { x: 729.032470703125, y: 300.6527404785156 };
    if (province === $.Fin.province)
        return { x: 597.506591796875, y: 297.83416748046875 };
    if (province === $.Bot.province)
        return { x: 584.7625122070312, y: 340.9727478027344 };
    if (province === $.Bal.province)
        return { x: 526.08251953125, y: 416.63275146484375 };
    if (province === $.Ska.province)
        return { x: 451.1424865722656, y: 366.4127502441406 };
    if (province === $.Den.province)
        return { x: 444.76116943359375, y: 417.3182678222656 };
    if (province === $.Kie.province)
        return { x: 444.7782897949219, y: 449.8395690917969 };
    if (province === $.Ber.province)
        return { x: 477.30694580078125, y: 454.7979736328125 };
    if (province === $.Pru.province)
        return { x: 564.2691040039062, y: 449.13482666015625 };
    if (province === $.Lvn.province)
        return { x: 596.0908813476562, y: 399.63427734375 };
    if (province === $.Mos.province)
        return { x: 741.0625, y: 441.3527526855469 };
    if (province === $.Sil.province)
        return { x: 538.8298950195312, y: 502.87750244140625 };
    if (province === $.War.province)
        return { x: 620.8324584960938, y: 485.2027587890625 };
    if (province === $.Ukr.province)
        return { x: 680.2324829101562, y: 514.9027709960938 };
    if (province === $.Sev.province)
        return { x: 731.14697265625, y: 594.795166015625 };
    if (province === $.Arm.province)
        return { x: 825.90478515625, y: 650.6664428710938 };
    if (province === $.Ank.province)
        return { x: 731.1529541015625, y: 666.232177734375 };
    if (province === $.Smy.province)
        return { x: 695.802490234375, y: 729.1625366210938 };
    if (province === $.Syr.province)
        return { x: 759.41796875, y: 752.5067138671875 };
    if (province === $.Con.province)
        return { x: 656.1853637695312, y: 697.3285522460938 };
    if (province === $.Eas.province)
        return { x: 650.532470703125, y: 770.8927612304688 };
    if (province === $.Aeg.province)
        return { x: 628.6224975585938, y: 723.5127563476562 };
    if (province === $.Ion.province)
        return { x: 557.8924560546875, y: 766.6327514648438 };
    if (province === $.Gre.province)
        return { x: 582.6600952148438, y: 700.1827392578125 };
    if (province === $.Bul.province)
        return { x: 619.4224853515625, y: 647.832763671875 };
    if (province === $.Rum.province)
        return { x: 654.7745971679688, y: 616.0322875976562 };
    if (province === $.Ser.province)
        return { x: 584.0824584960938, y: 648.552734375 };
    if (province === $.Alb.province)
        return { x: 564.282470703125, y: 667.6327514648438 };
    if (province === $.Tri.province)
        return { x: 533.8622436523438, y: 626.6306762695312 };
    if (province === $.Bud.province)
        return { x: 571.3327026367188, y: 596.2198486328125 };
    if (province === $.Vie.province)
        return { x: 540.2224731445312, y: 571.4827880859375 };
    if (province === $.Gal.province)
        return { x: 591.8524780273438, y: 550.9627685546875 };
    if (province === $.Boh.province)
        return { x: 516.8824768066406, y: 526.9327392578125 };
    if (province === $.Tyr.province)
        return { x: 492.1324768066406, y: 571.4827880859375 };
    if (province === $.Ven.province)
        return { x: 478.0024719238281, y: 611.082763671875 };
    if (province === $.Rom.province)
        return { x: 481.54248046875, y: 653.5027465820312 };
    if (province === $.Apu.province)
        return { x: 524.6869506835938, y: 661.9758911132812 };
    if (province === $.Adr.province)
        return { x: 509.8324890136719, y: 632.2927856445312 };
    if (province === $.Nap.province)
        return { x: 514.0582580566406, y: 682.5043334960938 };
    if (province === $.Tyn.province)
        return { x: 483.6724853515625, y: 695.2327880859375 };
    if (province === $.Wes.province)
        return { x: 397.3924865722656, y: 717.852783203125 };
    if (province === $.GoL.province)
        return { x: 388.9024658203125, y: 664.812744140625 };
    if (province === $.NAf.province)
        return { x: 301.9486389160156, y: 765.2230224609375 };
    if (province === $.Tun.province)
        return { x: 455.3693542480469, y: 752.5027465820312 };
    if (province === $.Spa.province)
        return { x: 304.7524719238281, y: 665.5327758789062 };
    if (province === $.Por.province)
        return { x: 246.05982971191406, y: 709.3541259765625 };
    if (province === $.Mid.province)
        return { x: 139.9924774169922, y: 675.6327514648438 };
    if (province === $.Gas.province)
        return { x: 335.1769714355469, y: 624.4929809570312 };
    if (province === $.Mar.province)
        return { x: 399.5227355957031, y: 628.7388916015625 };
    if (province === $.Pie.province)
        return { x: 429.2227478027344, y: 614.6006469726562 };
    if (province === $.Mun.province)
        return { x: 443.3495178222656, y: 555.2128295898438 };
    if (province === $.Ruh.province)
        return { x: 421.4398498535156, y: 512.0830383300781 };
    if (province === $.Bel.province)
        return { x: 381.1324768066406, y: 509.26275634765625 };
    if (province === $.Hol.province)
        return { x: 397.3924865722656, y: 483.7927551269531 };
    if (province === $.Hel.province)
        return { x: 410.8324890136719, y: 442.0627746582031 };
    if (province === $.Eng.province)
        return { x: 333.7624816894531, y: 516.3127746582031 };
    if (province === $.Lon.province)
        return { x: 346.4945983886719, y: 480.964599609375 };
    if (province === $.Wal.province)
        return { x: 297.6811828613281, y: 507.8348693847656 };
    if (province === $.Yor.province)
        return { x: 321.0124816894531, y: 452.6827697753906 };
    if (province === $.Lvp.province)
        return { x: 283.54248046875, y: 429.3427734375 };
    if (province === $.Edi.province)
        return { x: 303.34246826171875, y: 394.6927490234375 };
    if (province === $.Cly.province)
        return { x: 276.49249267578125, y: 393.28277587890625 };
    if (province === $.Iri.province)
        return { x: 248.89913940429688, y: 505.71331787109375 };
    if (province === $.Pic.province)
        return { x: 353.563232421875, y: 531.1627807617188 };
    if (province === $.Par.province)
        return { x: 359.2024841308594, y: 572.8927612304688 };
    if (province === $.Bur.province)
        return { x: 395.2624816894531, y: 562.2727661132812 };
    if (province === $.Bre.province)
        return { x: 302.6492919921875, y: 558.7543334960938 };
    if (province === $.Bar.province)
        return { x: 849.7499389648438, y: 42.48749542236328 };
    if (province === $.Bla.province)
        return { x: 756.5918579101562, y: 632.287841796875 };
    return { x: 0, y: 0 };
}
exports.provincePositionOf = provincePositionOf;

},{"js-diplomacy":27}],219:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const diplomacy = require("js-diplomacy");
const Season = diplomacy.standardBoard.Season;
const Phase = diplomacy.standardRule.Phase;
class StateComponent extends React.Component {
    render() {
        return React.createElement("g", null,
            React.createElement("rect", { x: "1", y: "1", height: "30", width: "250", fill: "white", stroke: "black", strokeWidth: "1" }),
            React.createElement("text", { y: "20", x: "10", style: {
                    fontStyle: "normal",
                    fontVariant: "normal",
                    fontWeight: "bold",
                    fontStretch: "normal",
                    fontSize: "16px",
                    fontFamily: "sans-serif",
                    letterSpacing: "0px",
                    wordSpacing: "0px",
                    display: "inline",
                    fill: "#000000",
                    fillOpacity: 1,
                    stroke: "#ffffff",
                    strokeWidth: 0.5,
                    strokeLinecap: "butt",
                    strokeLinejoin: "miter",
                    strokeMiterlimit: 4,
                    strokeDasharray: "none",
                    strokeOpacity: 1
                } },
                React.createElement("tspan", { y: "20", x: "5" }, this.stringify(this.props.state))));
    }
    stringify(state) {
        if (state.turn instanceof diplomacy.standardBoard.Turn) {
            return `${state.turn.year}-${Season[state.turn.season]} (${Phase[state.phase]})`;
        }
        else {
            return state.toString();
        }
    }
}
exports.StateComponent = StateComponent;

},{"js-diplomacy":27,"react":210}],220:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const diplomacy = require("js-diplomacy");
const event_target_1 = require("../../event-target");
const Svg = require("../../util");
class UnitImage extends React.Component {
    render() {
        const position = this.locationPositionOf(this.props.unit.unit.location, this.props.unit.status != null);
        const color = this.colors.power(this.props.unit.unit.power);
        let unitSvg = null;
        switch (this.props.unit.unit.militaryBranch) {
            case diplomacy.standardRule.MilitaryBranch.Army:
                unitSvg = React.createElement("g", { stroke: "#000", transform: `translate(${position.x - 15}, ${position.y - 10})`, onClick: () => { if (this.props.on) {
                        this.props.on(event_target_1.EventTarget.click);
                    } }, onDoubleClick: () => { if (this.props.on) {
                        this.props.on(event_target_1.EventTarget.dblclick);
                    } }, onMouseDown: () => { if (this.props.on) {
                        this.props.on(event_target_1.EventTarget.mousedown);
                    } }, onMouseUp: () => { if (this.props.on) {
                        this.props.on(event_target_1.EventTarget.mouseup);
                    } }, key: "unitSvg" },
                    React.createElement("rect", { ry: ".8372916", y: ".31774175", x: ".31774175", height: "20", width: "30", fill: color, strokeWidth: ".6354835", strokeLinecap: "round" }),
                    React.createElement("g", { strokeWidth: ".29421726", fill: "#666" },
                        React.createElement("path", { d: "M25.194083 2.1799024l.453912.6468885-1.280164.9174794.453909.6468885.640083-.4587382-.186159 1.1056297-7.68096 5.5048637.453907.646889-5.760719 4.12865.186158-1.105627-.45391-.646889-1.92024 1.376215-.2464438-.351261 1.9202378-1.376218-.661346-.942519z", fillRule: "evenodd", transform: "matrix(1.07958 0 0 1.08033 -.114 -.114)" }),
                        React.createElement("path", { d: "M18.090316 11.555055l-2.354067 2.37911-9.4162672 3.965184H2.3965392l.7846879-1.586075H4.750606l.7846879.872341 12.5550221-5.63056", fillRule: "evenodd", transform: "matrix(1.07958 0 0 1.08033 -.114 -.114)" }),
                        React.createElement("path", { d: "M17.599775 6.0118803v.00218c-1.579084.042749-3.124878.7714596-4.173896 1.9645092-.827266.9133584-1.336513 2.0996225-1.478122 3.3260725-.03697.453841-.03829.912911.01055 1.365947.160966 1.32086.767587 2.583013 1.712532 3.512441.896573.908166 2.09462 1.494199 3.351277 1.66413.502855.08044 1.014373.04408 1.51936.0068 1.417655-.176415 2.754531-.90395 3.692007-1.990866.866418-.987889 1.37694-2.281541 1.443388-3.597945.02841-.675807-.03829-1.357955-.234374-2.006169-.295603-1.0125002-.864397-1.9409274-1.634406-2.6551461-.920787-.8868739-2.146044-1.4380975-3.409875-1.5654751-.265542-.0213155-.532444-.029664-.798746-.0260522zm.410225.7476543c.768617.027829 1.515013.2231018 2.190048.5810208L18.01 11.170907zm-.414584.00444v4.4069914l-2.179201-3.8151404c.517312-.2756207 1.076164-.4707045 1.647422-.5525203.172917-.025756.353126-.031499.531779-.039582zm2.96275.7893113c.06773.043637.140402.077801.206165.1249915.557388.3979802 1.03728.9041364 1.40215 1.4865339l-3.796225 2.2144597zm-5.502254.013322l2.179195 3.8128111-3.761501-2.1925316c.234082-.3753918.497823-.7308596.820455-1.0326835.232031-.2227465.491293-.41373.761851-.587596zm7.314634 1.9645092c.02666.052016.05985.1004491.08466.1534713.315655.6403756.478238 1.3463256.50573 2.0587886h-4.373585a.83199264.84062774 0 0 0-.0023-.0044zm-9.100967.019835l3.750645 2.1881499a.83199264.84062774 0 0 0-.0022.0044h-4.334517c.02226-.767327.23455-1.513673.586039-2.1925317zm-.581701 2.6134999h4.295452a.83199264.84062774 0 0 0 .0044.0222l-3.735445 2.17938c-.350997-.677977-.537803-1.433429-.564334-2.201292zm5.934191 0h4.338855c-.03026.750576-.210677 1.495999-.55348 2.164028-.0088.01806-.02109.03464-.03026.05264l-3.759336-2.19473a.83199264.84062774 0 0 0 .0044-.0222zm-1.452075.401222a.83199264.84062774 0 0 0 .02636.03061l-2.144468 3.751423c-.527025-.339487-.994761-.774056-1.365252-1.28044-.08041-.108384-.141193-.229911-.212727-.344212zm1.26541 0l3.73328 2.179375c-.408528.650562-.963578 1.205253-1.60835 1.615898l-2.153125-3.766713a.83199264.84062774 0 0 0 .02812-.02842zm-.37983.252174l2.144468 3.751422c-.340486.180027-.699222.323965-1.072232.420974-.367767.103587-.740327.144383-1.117813.14912v-4.306137a.83199264.84062774 0 0 0 .04555-.01539zm-.507897.0022a.83199264.84062774 0 0 0 .04775.01332v4.30833c-.271694-.0044-.543339-.02694-.809602-.08547-.47701-.09462-.931927-.282963-1.365255-.515248z", transform: "matrix(1.07958 0 0 1.08033 -.114 -.114)" })));
                break;
            case diplomacy.standardRule.MilitaryBranch.Fleet:
                unitSvg = React.createElement("g", { stroke: "#000", transform: `translate(${position.x - 15}, ${position.y - 10})`, onClick: () => { if (this.props.on) {
                        this.props.on(event_target_1.EventTarget.click);
                    } }, onDoubleClick: () => { if (this.props.on) {
                        this.props.on(event_target_1.EventTarget.dblclick);
                    } }, onMouseDown: () => { if (this.props.on) {
                        this.props.on(event_target_1.EventTarget.mousedown);
                    } }, onMouseUp: () => { if (this.props.on) {
                        this.props.on(event_target_1.EventTarget.mouseup);
                    } }, key: "unitSvg" },
                    React.createElement("rect", { ry: ".82358736", y: ".51219875", x: ".51344293", height: "20", width: "30", fill: color, strokeLinecap: "round" }),
                    React.createElement("g", { strokeWidth: ".60250032", fill: "#666", fillRule: "evenodd" },
                        React.createElement("path", { d: "M22.2 17.1v-1.5h1l1 .3h1.5v.25h-1.5l-.2.35.2.3v.3z", transform: "matrix(.83088 0 0 .82887 2.548 2.632)" }),
                        React.createElement("path", { d: "M8.5 17.1v-1.5h-1l-1 .3H5v.25h1.5l.2.35-.2.3v.3zM11.6 16.5v-3l-.5-.5h.5V7.3l-.5-.3h.5V0h.2v7h.5l-.5.3V13h.5l-.5.5v3z", transform: "matrix(.83088 0 0 .82887 2.548 2.632)" }),
                        React.createElement("path", { d: "M20.1 16.5v-3l-.5-.5h.5V7.3l-.5-.3h.5V0h.2v7h.5l-.5.3V13h.5l-.5.5v3zM13 16.5V11l.2-.5h1.1l.2.5v5.5M17 16.5V11l.2-.5h1.1l.2.5v5.5", transform: "matrix(.83088 0 0 .82887 2.548 2.632)" }),
                        React.createElement("path", { d: "M9.3 17.1v-2h.2v-2h1.3v1l-.3.5v.5h1v1h8.8v-1h.5v-1h.5v1h.5v2", transform: "matrix(.83088 0 0 .82887 2.548 2.632)" }),
                        React.createElement("path", { d: "M0 19.5L.25 17H29.5l.5 1.5v1z", transform: "matrix(.83088 0 0 .82887 2.548 2.632)" })));
                break;
        }
        if (this.props.unit.status) {
            const dest = this.provincePositionOf(this.props.unit.status.attackedFrom);
            return React.createElement("g", null,
                React.createElement(Svg.Line, { from: position, dest: dest, stroke: this.colors.fill, strokeWidth: this.size.strokeWidth }),
                React.createElement(Svg.Circle, { center: position, r: this.size.unitRadius, stroke: this.colors.border, strokeWidth: this.size.strokeWidth, fill: this.colors.dislodged }),
                [unitSvg]);
        }
        else {
            return unitSvg;
        }
    }
}
exports.UnitImage = UnitImage;

},{"../../event-target":211,"../../util":223,"js-diplomacy":27,"react":210}],221:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const unit_image_1 = require("./unit-image");
const position_1 = require("./position");
const configs_1 = require("./configs");
class UnitComponent extends unit_image_1.UnitImage {
    constructor() {
        super(...arguments);
        this.colors = configs_1.colors;
        this.size = configs_1.size;
    }
    locationPositionOf(location, isDislodged) {
        return position_1.locationPositionOf(location, isDislodged);
    }
    provincePositionOf(province) {
        return position_1.provincePositionOf(province);
    }
}
exports.UnitComponent = UnitComponent;
class UnitsComponent extends React.Component {
    constructor() {
        super(...arguments);
        this.Unit = UnitComponent;
    }
    render() {
        const units = Array.from(this.props.units)
            .filter(unit => unit.status === null)
            .map(elem => {
            const unit = elem.unit;
            return React.createElement(this.Unit, { key: unit.toString(), unit: elem, on: (event) => {
                    if (this.props.on) {
                        this.props.on(event, unit);
                    }
                } });
        });
        const dislodgedUnits = Array.from(this.props.units)
            .filter(unit => unit.status !== null)
            .map(elem => {
            const unit = elem.unit;
            return React.createElement(this.Unit, { key: `${unit}-dislodged}`, unit: elem, on: (event) => {
                    if (this.props.on) {
                        this.props.on(event, unit);
                    }
                } });
        });
        return React.createElement("g", null,
            units,
            dislodgedUnits);
    }
}
exports.UnitsComponent = UnitsComponent;

},{"./configs":214,"./position":218,"./unit-image":220,"react":210}],222:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const ReactDom = require("react-dom");
const diplomacy = require("js-diplomacy");
const Svg = require("./util");
var standardRule;
(function (standardRule) {
    class OrdersComponent extends React.Component {
        render() {
            const destPosition = (pos, theta, l) => {
                return {
                    x: pos.x + l * Math.cos(theta),
                    y: pos.y + l * Math.sin(theta)
                };
            };
            const orders = Array.from(this.props.orders).map(order => {
                const position = this.locationPositionOf(order.unit.location, order.tpe === diplomacy.standardRule.Order.OrderType.Retreat);
                if (order instanceof diplomacy.standardRule.Order.Hold) {
                    return React.createElement(Svg.Circle, { center: position, r: this.size.unitRadius, strokeWidth: this.size.strokeWidth, fill: "none", stroke: this.colors.fill, key: order.toString() });
                }
                if ((order instanceof diplomacy.standardRule.Order.Move) ||
                    (order instanceof diplomacy.standardRule.Order.Retreat)) {
                    const o = order;
                    const dest = this.locationPositionOf(o.destination, false);
                    const theta = Math.atan2(dest.y - position.y, dest.x - position.x);
                    const d = destPosition(dest, theta, -this.size.arrowHeadLength + this.size.marginStrokeWidth * 2);
                    return React.createElement("g", { key: o.toString() },
                        React.createElement(Svg.ArrowHead, { src: position, dest: dest, headLength: this.size.arrowHeadLength, strokeWidth: this.size.marginStrokeWidth, fillColor: this.colors.fill, strokeColor: this.colors.margin }),
                        React.createElement(Svg.Line, { from: position, dest: d, stroke: this.colors.margin, strokeWidth: this.size.strokeWidth + this.size.marginStrokeWidth * 2 }),
                        React.createElement(Svg.Line, { from: position, dest: d, stroke: this.colors.fill, strokeWidth: this.size.strokeWidth }));
                }
                if (order instanceof diplomacy.standardRule.Order.Support) {
                    const o = order;
                    const dest = this.locationPositionOf(o.destination, false);
                    if (o.target instanceof diplomacy.standardRule.Order.Move) {
                        const ctrl = this.locationPositionOf(o.target.unit.location, false);
                        const theta = Math.atan2(dest.y - ctrl.y, dest.x - ctrl.x);
                        const d = destPosition(dest, theta, -this.size.arrowHeadLength + this.size.marginStrokeWidth * 2);
                        return React.createElement("g", { key: o.toString() },
                            React.createElement(Svg.ArrowHead, { src: ctrl, dest: dest, headLength: this.size.arrowHeadLength, strokeWidth: this.size.marginStrokeWidth, fillColor: this.colors.fill, strokeColor: this.colors.margin }),
                            React.createElement(Svg.Line, { from: position, dest: d, ctrl: ctrl, stroke: this.colors.fill, strokeWidth: this.size.strokeWidth, strokeDasharray: "2, 2" }));
                    }
                    else if (o.target instanceof diplomacy.standardRule.Order.Hold) {
                        const theta = Math.atan2(dest.y - position.x, dest.x - position.x);
                        const d = destPosition(dest, theta, -this.size.arrowHeadLength + this.size.marginStrokeWidth * 2);
                        return React.createElement("g", { key: o.toString() },
                            React.createElement(Svg.ArrowHead, { src: position, dest: dest, headLength: this.size.arrowHeadLength, strokeWidth: this.size.marginStrokeWidth, fillColor: this.colors.fill, strokeColor: this.colors.margin }),
                            React.createElement(Svg.Line, { from: position, dest: d, stroke: this.colors.fill, strokeWidth: this.size.strokeWidth, strokeDasharray: "2, 2" }));
                    }
                }
                if (order instanceof diplomacy.standardRule.Order.Convoy) {
                    const o = order;
                    const dest = this.locationPositionOf(o.target.destination, false);
                    const from = this.locationPositionOf(o.target.unit.location, false);
                    const theta = Math.atan2(dest.y - from.y, dest.x - from.x);
                    const d = destPosition(dest, theta, -this.size.arrowHeadLength + this.size.marginStrokeWidth * 2);
                    return React.createElement("g", { key: o.toString() },
                        React.createElement(Svg.ArrowHead, { src: position, dest: dest, headLength: this.size.arrowHeadLength, strokeWidth: this.size.marginStrokeWidth, fillColor: this.colors.fill, strokeColor: this.colors.margin }),
                        React.createElement(Svg.Line, { from: from, dest: d, ctrl: position, stroke: this.colors.fill, strokeWidth: this.size.strokeWidth, strokeDasharray: "5, 2" }));
                }
                if (order instanceof diplomacy.standardRule.Order.Disband) {
                    const o = order;
                    const p2 = {
                        x: position.x - this.size.unitRadius * Math.cos(Math.PI / 4),
                        y: position.y - this.size.unitRadius * Math.sin(Math.PI / 4)
                    };
                    const p3 = {
                        x: position.x + this.size.unitRadius * Math.cos(Math.PI / 4),
                        y: position.y + this.size.unitRadius * Math.sin(Math.PI / 4)
                    };
                    return React.createElement(Svg.Line, { key: o.toString(), from: p2, dest: p3, stroke: this.colors.fill, strokeWidth: this.size.strokeWidth });
                }
                if (order instanceof diplomacy.standardRule.Order.Build) {
                    const o = order;
                    return React.createElement("g", { opacity: 0.5, key: o.toString() },
                        React.createElement(this.Unit, { unit: { unit: o.unit, status: null } }));
                }
            });
            return React.createElement("g", null, orders);
        }
    }
    standardRule.OrdersComponent = OrdersComponent;
    class BoardComponent extends React.Component {
        render() {
            const provinces = new Set(Array.from(this.props.board.map.provinces).map(province => {
                return {
                    province: province,
                    status: this.props.board.provinceStatuses.get(province) || null
                };
            }));
            const units = new Set(Array.from(this.props.board.units).map(unit => {
                return {
                    unit: unit,
                    status: this.props.board.unitStatuses.get(unit) || null
                };
            }));
            const orders = new Set(Array.from(this.props.orders)
                .filter(order => {
                return order instanceof diplomacy.standardRule.Order.Order;
            }));
            return React.createElement("svg", { width: `${this.width}px`, height: `${this.height}px` },
                React.createElement(this.MapComponent, { on: this.props.onProvince, map: this.props.board.map, provinces: provinces }),
                React.createElement(this.UnitsComponent, { on: this.props.onUnit, units: units }),
                React.createElement(this.OrdersComponent, { orders: orders }),
                React.createElement(this.StateComponent, { state: this.props.board.state }));
        }
        componentDidMount() {
            const svg = ReactDom.findDOMNode(this);
            if (svg.parentNode) {
                const adjust = () => {
                    const rect = svg.parentNode.getBoundingClientRect();
                    const wRatio = rect.width / this.width;
                    const hRatio = rect.height / this.height;
                    const ratio = Math.min(wRatio, hRatio);
                    svg.setAttribute("width", this.width * ratio + "px");
                    svg.setAttribute("height", this.height * ratio + "px");
                    svg.setAttribute("transform", `scale(${ratio})`);
                };
                svg.parentNode.addEventListener("resise", adjust);
                adjust();
            }
        }
    }
    standardRule.BoardComponent = BoardComponent;
})(standardRule = exports.standardRule || (exports.standardRule = {}));

},{"./util":223,"js-diplomacy":27,"react":210,"react-dom":59}],223:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
class ArrowHead extends React.Component {
    render() {
        const theta = Math.atan2(this.props.dest.x - this.props.src.x, this.props.dest.y - this.props.src.y) * 180 / Math.PI;
        const l = Math.sqrt((this.props.dest.x - this.props.src.x) * (this.props.dest.x - this.props.src.x) +
            (this.props.dest.y - this.props.src.y) * (this.props.dest.y - this.props.src.y));
        const destX = this.props.headLength * Math.tan(30 / 180 * Math.PI);
        return React.createElement("polygon", { points: `-${destX},${l - this.props.headLength} 0,${l} ${destX},${l - this.props.headLength}`, fill: this.props.fillColor, stroke: this.props.strokeColor, strokeWidth: this.props.strokeWidth, transform: `translate(${this.props.src.x}, ${this.props.src.y}), rotate(${-theta})` });
    }
}
exports.ArrowHead = ArrowHead;
class Circle extends React.Component {
    render() {
        return React.createElement("circle", { cx: this.props.center.x, cy: this.props.center.y, r: this.props.r, strokeWidth: this.props.strokeWidth, fill: this.props.fill, stroke: this.props.stroke });
    }
}
exports.Circle = Circle;
class Line extends React.Component {
    render() {
        if (this.props.ctrl) {
            return React.createElement("path", { d: `M ${this.props.from.x}, ${this.props.from.y} Q ${this.props.ctrl.x} ${this.props.ctrl.y} ${this.props.dest.x}, ${this.props.dest.y}`, stroke: this.props.stroke, strokeWidth: this.props.strokeWidth, fill: "none", strokeDasharray: this.props.strokeDasharray });
        }
        else {
            return React.createElement("path", { d: `M ${this.props.from.x}, ${this.props.from.y} ${this.props.dest.x}, ${this.props.dest.y}`, stroke: this.props.stroke, strokeWidth: this.props.strokeWidth, fill: "none", strokeDasharray: this.props.strokeDasharray });
        }
    }
}
exports.Line = Line;

},{"react":210}],224:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./event-target"));
__export(require("./util"));
__export(require("./standardRule"));
__export(require("./standardMap"));

},{"./event-target":211,"./standardMap":212,"./standardRule":222,"./util":223}]},{},[1]);

//# sourceMappingURL=vizdip.js.map
