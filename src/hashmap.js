(function (global) {

    /**
     * A unique object to symbolize removal
     * @type {{}}
     */
    var REMOVE = {};

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
        var bucket = this.entries[hash];

        if (bucket) {
            var length = bucket.length;
            while (length--) {
                var obj = bucket[length];
                if (obj.key === key) {
                    return obj.value;
                }
            }
        }
    };

    /**
     * Puts a value associated with a key
     * @param key the key to set the value for
     * @param value the value to set
     * @returns {*} the previous value
     */
    prototype['put'] = function (key, value) {
        var hash = calculateHash(key);
        var bucket = this.entries[hash];

        var obj = {key: key, value: value};
        if (bucket) {
            var length = bucket.length;
            while (length--) {
                var entry = bucket[length];
                if (entry.key === key) {
                    var oldValue = entry.value;
                    if (value == REMOVE) {
                        if (bucket.length > 1) {
                            bucket.splice(length, 1);
                        } else {
                            this.entries[hash] = null;
                        }
                    } else {
                        entry.value = value;
                    }
                    return oldValue;
                }
            }
            bucket.push(obj);
        } else {
            this.entries[hash] = [obj];
        }

        this.length++;
    };

    /**
     * Removes an entry
     * @param key the key to remove the entry before
     * @returns {*} the removed value
     */
    prototype['remove'] = function (key) {
        return this.put(key, REMOVE);
    };

    prototype['toArray'] = function () {
        var arr = [];
        for (var hash in this.entries) {
            if (this.entries.hasOwnProperty(hash)) {
                var bucket = this.entries[hash];
                for (var i = 0, max = bucket.length; i < max; i++) {
                    var entry = bucket[i];
                    if (entry) {
                        arr.push(entry.value);
                    }
                }
            }
        }
        return arr;
    };

    function calculateHash(object) {
        if (!object) {
            return 0;
        }
        var hash = object.toString.hash;
        if (hash !== undefined) {
            return hash;
        }
        var type = (typeof object).charAt(0);
        if (type == 's') {
            hash = 0;
            for (var i = 0; i < object.length; i++) {
                hash = 31 * hash + (object.charCodeAt(i) * 2); // the 2 makes it more unique
            }
        } else if (type == 'n') {
            hash = object; // since we use an object now which converts to strings, decimals are fine
        } else if (type == 'b') {
            hash = object ? 1231 : 1237;
        } else if (type == 'o' && object) { // null is an object, so skip it
            hash = 0;
            for (var property in object) {
                if (object.hasOwnProperty(property)) {
                    var value = object[property];
                    hash = hash * calculateHash(property) + calculateHash(value);
                }
            }
        } else {
            hash = 0; // symbols, functions, undefined, and stuff that we can't calculate a hashcode for
        }
        object.toString.hash = hash; // store our hash for future use in a place where it will never been seen
        return hash;
    }

    if (typeof module != 'undefined') {
        module['exports'] = HashMap;
    } else {
        global['HashMap'] = HashMap;
    }
})(this);
