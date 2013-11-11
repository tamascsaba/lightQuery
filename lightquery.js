/*!
 * lightQuery
 *
 * @author Csaba Tamas
 * @version 0.0.1
 *
 */
(function(window) {
    'use strict';

    var
        /**
         * Define the core function
         *
         * @param  {(string|object)} selector
         * @param  {object}          context
         * @return {object}          LightQuery constructor
         */
        $ = function (selector, context) {
            return new LightQuery(selector, context);
        },

        /**
         * Creates an instance of LightQuery
         *
         * @constructor
         * @this {LightQuery}
         * @param {(string|object)} selector
         * @param {object}          context
         * @return {object}
         */
        LightQuery = function (selector, context) {
            var root = (context && context.hasOwnProperty('querySelectorAll')) ? context : document,
                query = [];

            // String Selector
            if (typeof selector === 'string') {
                query = [].slice.apply(root.querySelectorAll(selector));
            } else {
                // HTMLElement
                if (selector.nodeType) {
                    query = [selector];
                }
                // NodeList
                if (selector instanceof NodeList) {
                    query = [].slice.apply(selector);
                }
                // Array with HTMLElelment
                if (selector instanceof Array) {
                    query = selector;
                }
                //Wrong syntax
                if (!(query instanceof Array)){
                    throw new Error('Wrong selector! You must be use sting or HTMLElement');
                    return null;
                }
            }

            this.length = query.length;

            var i, l = this.length;
            for (i = 0; i < l; i++) {
                this[i] = query[i];
            }

            return this;
        };

    Object.defineProperties(LightQuery.prototype, {

        // ----------------------------------------------------------------------------------------
        // Basic Property and Methods
        // ----------------------------------------------------------------------------------------
        version: {
            value : '0.0.1',
            writable: false,
        },

        each: {
            /**
             * Generic iterator function
             *
             * @param  {Function} cb callback function
             * @return {object}   this
             */
            value: function(cb) {
                if (typeof cb !== 'function') { return; }

                var i, l = this.length;

                for (i = 0; i < l; i++) {
                    if (i in this) {
                        cb.call(this[i], i, this[i]);
                    }
                }
                return this;
            }
        },

        // ----------------------------------------------------------------------------------------
        // Event Methods (bind, unbind, trigger)
        // ----------------------------------------------------------------------------------------
        bind: {
            /**
             * Bind event to the element(s)
             * @param  {string}   type
             * @param  {Function} cb
             * @param  {boolen}   capture
             * @return {object}   this
             */
            value: function(type,cb,capture) {
                return this.each(function(element) {
                    element.addEventListener(type,cb,capture ? true: false);
                });
            }
        },
        unbind: {
            /**
             * Bind event to the element(s)
             * @param  {string}   type
             * @param  {Function} cb
             * @param  {boolen}   capture
             * @return {object}   this
             */
            value: function(type,cb,capture) {
                return this.each(function(element) {
                    element.removeEventListener(type,cb,capture ? true: false);
                });
            }
        },
        trigger: {
            /**
             * Execute event(s)
             * @param  {string} event Event type (click, focus....)
             * @return {object}       this
             */
            value: function ( event ) {
                this.each(function(ctx) {
                    if(document.createEvent) {
                        var evtObj = document.createEvent('Events');
                        evtObj.initEvent(event, true, false);
                        ctx.dispatchEvent(evtObj);
                    } else {
                        throw new Error('Your browser don\'t support document.createEvent');
                    }
                });
            }
        },

        // ----------------------------------------------------------------------------------------
        // Filter Methods (find, !filter, !eq, !index)
        // ----------------------------------------------------------------------------------------
        find: {
            /**
             * Find elements
             * @param  {string} query
             * @return {object}
             */
            value: function(query) {
                var findedElements = [];
                this.each(function() {
                   [].slice.apply(this.querySelectorAll(query)).forEach(function(element) {
                      findedElements.push(element);
                   });
                });
                return $(findedElements);
            }
        },

        // ----------------------------------------------------------------------------------------
        // Style Properties (css, width, height, offset)
        // ----------------------------------------------------------------------------------------
        css: {
            /**
             * Get/Set the style
             * @param  {string} attrib
             * @param  {string} value
             * @return {(string|object)}
             */
            value: function(attrib,value) {
                if(typeof attrib === 'string' && value === undefined){
                    return window.getComputedStyle(this[0],null).getPropertyValue(attrib);
                }

                if(typeof attrib !== 'object'){
                    attrib[attrib] = value;
                }

                return this.each(function(){
                    var i;
                    for(i in attrib){
                        if(attrib.hasOwnProperty(i)){
                            this.style[i] = attrib[i];
                        }
                    }
                });
            }
        },
        width: {
            /**
             * Get/Set the width of element(s)
             * @param  {string} value
             * @return {this}
             */
            value: function(value){
                if (!this.length) return [];

                if(value === undefined){
                    return this[0].clientWidth;
                }
                return this.each(function() {
                    var v = parseInt(value, 10);
                    this.style.width = (v) ? v + 'px' : '';
                });
            }
        },
        height: {
            /**
             * Get/Set the height of element(s)
             * @param  {string} value
             * @return {this}
             */
            value: function(value){
                if (!this.length) return [];

                if(value === undefined){
                    return this[0].clientHeight;
                }
                return this.each(function() {
                    var v = parseInt(value,10);
                    this.style.height = (v)?v + 'px' : '';
                });
            }
        },
        offset: {
            /**
             * Get the current coordinates
             * @return {object} top, left, bottom, right cordination
             */
            value: function() {
                if (!this.length) return [];

                var offset = this[0].getBoundingClientRect();
                return {
                    top: offset.top,
                    left: offset.left,
                    bottom: offset.bottom,
                    right: offset.right
                };
            }
        },

        // ----------------------------------------------------------------------------------------
        // DOM Insertion, Inside (html, !text, append, prepend, !appendTo, !prependTo)
        // ----------------------------------------------------------------------------------------
        html: {
            /**
             * Get/Set the innerHTML on element(s)
             * @param  {string} value
             * @return {object}
             */
            value: function(value) {
                if(value === undefined){
                    return this[0].innerHTML;
                }
                return this.each(function() {
                    this.innerHTML = value;
                });
            }
        },
        append: {
            /**
             * Insert content end of element(s)
             * @param  {(string|HTMLElement} value
             * @return {object}
             */
            value: function(value) {
                return this.each(function(element) {
                    if (typeof value === 'string') {
                        element.insertAdjacentHTML('beforeend', value)
                    } else {
                        element.appendChild(value);
                    }
                });
            }
        },
        prepend: {
            /**
             * Insert content begin of element(s)
             * @param  {(string|HTMLElement} value
             * @return {object}
             */
            value: function(value) {
                return this.each(function(element) {
                    var first;
                    if (typeof value === 'string') {
                        element.insertAdjacentHTML('afterbegin', value)
                    } else if(element.firstChild){
                        element.insertBefore(value, element.firstChild);
                    } else {
                        element.appendChild(value);
                    }
                });
            }
        },

        // ----------------------------------------------------------------------------------------
        // Class Methods (hassClass, addClass, removeClass, toogleClass)
        // ----------------------------------------------------------------------------------------
        hasClass: {
            /**
             * Element(s) has a given class name
             * @param  {string} className
             * @return {boolen}
             */
            value: function(className) {
                this.each(function() {
                    if(this.classList.contains(className)) return true;
                });

                return false;
            }
        },
        addClass: {
            /**
             * Add class to the element(s)
             * @param  {string} className
             * @return {object} this
             */
            value: function(className) {
                // Multiple classname seprecate with space
                if (/\s/.test(className)) {
                    var classes = className.split(' ');

                    for (var i = 0; i < this.length; i++) {
                        for (var j = 0; j < classes.length; j++) {
                            this[i].classList.add(classes[j]);
                        };
                    };
                } else {
                    this.each(function() {
                        this.classList.add(className);
                    });
                }

                return this;
            }
        },
        removeClass: {
            /**
             * Remove class to the element(s)
             * @param  {string} className
             * @return {object} this
             */
            value: function(className) {
                // Multiple classname seprecate with space
                if (/\s/.test(className)) {
                    var classes = className.split(' ');

                    for (var i = 0; i < this.length; i++) {
                        for (var j = 0; j < classes.length; j++) {
                            this[i].classList.remove(classes[j]);
                        };
                    };
                } else {
                    this.each(function() {
                        this.classList.remove(className);
                    });
                }

                return this;
            }
        },
        toogleClass: {
            /**
             * Toogle the class name
             * @param  {string} className
             * @return {object} this
             */
            value: function(className) {
                return this.each(function() {
                    this.classList.toggle(className);
                });
            }
        },

        // ----------------------------------------------------------------------------------------
        // Tree Traversal (prev, next, first, last)
        // ----------------------------------------------------------------------------------------
        prev: {
            /**
             * Get the previous element(s)
             * @return {object}
             */
            value: function() {
                var previousElements = [];

                this.each(function(element) {
                    if (element.previousElementSibling) {
                        previousElements.push(element.previousElementSibling);
                    }
                });

                return previousElements.length ? $(previousElements) : this;
            }
        },
        next: {
            /**
             * Get the next element(s)
             * @return {object}
             */
            value: function() {
                var nextElements = [];

                this.each(function(element) {
                    if (element.nextElementSibling) {
                        nextElements.push(node.nextElementSibling);
                    }
                });

                return nextElements.length ? $(nextElements) : this;
            }
        },
        first: {
            /**
             * Get the nfirst element(s)
             * @return {object}
             */
            value: function () {
                var firstElements = [];
                this.each(function(element) {
                    firstElement.push(element.firstElementChild);
                });

                return $(firstElement);
            }
        },
        last: {
            /**
             * Get the last element(s)
             * @return {object}
             */
            value: function() {
                var lastElements = [];

                this.each(function(element) {
                    lastElements.push(element.lastElementChild);
                });

                return $(lastElements);
            }
        },
    });

    // Add $ to the window object
    window.$ = $;

})(window);
