(function (global) {

    /**
     * Creates a new HashMap.
     * All keys are calculated down to a numerical hash.
     * @constructor
     */
    function HashMap() {
        this.entries = {};
        this.length = 0;
    }

    var prototype = HashMap.prototype;

    /**
     * Gets the value associated with a certain key
     * @param key the key to get the value for
     * @returns {*} the value stored, or null
     */
    prototype['get'] = function (key) {
        var hash = calculateHash(key);
        var entry = this.entries[hash];
        return entry ? entry.value : null;
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
        return previous ? previous.value : null;
    };

    /**
     * Removes an entry
     * @param key the key to remove the entry before
     * @returns {*} the removed value
     */
    prototype['remove'] = function (key) {
        var hash = calculateHash(key);
        var remove = this.entries[hash];
        if (remove) {
            this.length--;
            this.entries[hash] = undefined;
        }
        return remove.value;
    };

    prototype['toArray'] = function () {
        var arr = [];
        for (var property in this.entries) {
            if (this.entries.hasOwnProperty(property)) {
                var value = this.entries[property];
                if (value != null) {
                    arr.push(value);
                }
            }
        }
        return arr;
    };

    function calculateHash(object) {
        var type = (typeof object).charAt(0);
        if (type == 's') {
            var hash = 0;
            for (var i = 0; i < object.length; i++) {
                hash = 31 * hash + (object.charCodeAt(i) * 2);
            }
            return hash;
        } else if (type == 'n') {
            return object; // since we use an object now which converts to strings, decimals are fine
        } else if (type == 'b') {
            return object ? 1231 : 1237;
        } else if (type == 'o' && object) { // null is an object, so skip it
            hash = 0;
            for (var property in object) {
                if (object.hasOwnProperty(property)) {
                    var value = object[property];
                    hash = hash * calculateHash(property) + calculateHash(value);
                }
            }
            return hash;
        } else {
            return 0; // symbols, functions, undefined, and stuff that we can't calculate a hashcode for
        }
    }

    if (typeof module != 'undefined') {
        module['exports'] = HashMap;
    } else {
        global['HashMap'] = HashMap;
    }
})(this);
