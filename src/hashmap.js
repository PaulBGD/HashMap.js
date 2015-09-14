(function (global) {

    /**
     * Creates a new HashMap.
     * All keys are calculated down to a numerical hash.
     * @constructor
     */
    function HashMap() {
        this.entries = [];
        this.length = 0;
    }

    var prototype = HashMap.prototype;

    /**
     * Gets the value associated with a certain key
     * @param key the key to get the value for
     * @returns {*} the value stored, or null
     */
    prototype['get'] = function (key) {
        return this.contains(key) ? this.entries[calculateHash(key)].value : null;
    };

    /**
     * Puts a value associated with a key
     * @param key the key to set the value for
     * @param value the value to set
     * @returns {*} the previous value
     */
    prototype['put'] = function (key, value) {
        var hash = calculateHash(key);
        var previous = this.entries[hash];
        this.entries[hash] = {key: key, value: value};
        if (!previous) {
            this.length++;
        }
        return previous;
    };

    /**
     * Returns the value associated with a key, or sets the association if it is not set
     * @param key the key to get the value for
     * @param func a function with the parameter "key" which returns a new value
     * @returns {*} the value
     */
    prototype['getOrCompute'] = function (key, func) {
        var hash = calculateHash(key);
        var value = this.entries[hash];
        if (!value) {
            value = func(key);
            this.put(key, value);
        }
        return value;
    };

    /**
     * Removes an entry
     * @param key the key to remove the entry before
     * @returns {*} the removed entry
     */
    prototype['remove'] = function (key) {
        var remove = this.get(key);
        if (remove) {
            this.length--;
        }
        return remove;
    };

    /**
     * Checks if an entry exists for an associated key
     * @param key the key to check for an entry
     * @returns {boolean} true if there is an entry
     */
    prototype['contains'] = function(key) {
        return !!this.entries[calculateHash(key)];
    };

    function calculateHash(object, computed) {
        computed = computed || [];
        var type = (typeof object).charAt(0);
        if (type == 's') {
            var hash = 0;
            for (var i = 0; i < object.length; i++) {
                hash = 10 * i * object.charCodeAt(i);
            }
            return hash;
        } else if (type == 'n') {
            return object;
        } else if (type == 'b') {
            return object ? 15 : 25;
        } else if (type == 'o') {
            if (object === null) {
                return 19;
            } else {
                hash = 0;
                i = 0;
                for (var property in object) {
                    if (object.hasOwnProperty(property)) {
                        var value = object[property];
                        var previouslyComputed = false;
                        var length = computed.length;
                        while (length--) {
                            if (computed[length] === value) {
                                previouslyComputed = true;
                                break;
                            }
                        }
                        if (!previouslyComputed) {
                            computed.push(value);
                            hash += ++i * (calculateHash(value, computed) + calculateHash(property));
                        }
                    }
                }
                return hash;
            }
        } else if (type == 'u') {
            return 13;
        } else {
            return calculateHash(type.toString()); // symbols, functions, and stuff
        }
    }

    global['HashMap'] = HashMap;
})(typeof module != 'undefined' ? module['exports'] : this);
