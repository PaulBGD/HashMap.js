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
        var bucket = this.entries[hash];

        if (bucket) {
            for (var i = 0; i < bucket.length; i++) {
                if (bucket[i].key === key) {
                    return bucket[i].value;
                }
            }
        }

        return null;
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

        if (!bucket) {
            this.entries[hash] = bucket = [];
        }

        for (var i = 0; i < bucket.length; i++) {
            if (bucket[i].key === key) {
                var oldValue = bucket[i].value;
                bucket[i].value = value;
                return oldValue;
            }
        }

        bucket.push({key: key, value: value});
        this.length++;
    };

    /**
     * Removes an entry
     * @param key the key to remove the entry before
     * @returns {*} the removed value
     */
    prototype['remove'] = function (key) {
        var hash = calculateHash(key);
        var bucket = this.entries[hash];

        if (bucket) {
            for (var i = 0; i < bucket.length; i++) {
                if (bucket[i].key === key) {
                    var value = bucket[i].value;

                    if (bucket.length > 1) {
                        bucket.splice(i, 1);
                    } else {
                        delete this.entries[hash];
                    }

                    this.length--;
                    return value;
                }
            }
        }
    };

    prototype['toArray'] = function () {
        var arr = [];
        for (var hash in this.entries) {
            if (this.entries.hasOwnProperty(hash)) {
                for (var i = 0; i < this.entries[hash].length; i++) {
                    arr.push(this.entries[hash][i].value);
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
            var remainder = object % 1;
            return remainder == 0 ? object : remainder * 100 + (object - remainder);
        } else if (type == 'b') {
            return object ? 1231 : 1237;
        } else if (type == 'o') {
            if (object === null) {
                return 19;
            } else {
                hash = 0;
                for (var property in object) {
                    if (object.hasOwnProperty(property)) {
                        var value = object[property];
                        hash = hash * calculateHash(property) + calculateHash(value);
                    }
                }
                return hash;
            }
        } else if (type == 'u') {
            return calculateHash(String(object));
        } else {
            return 0; // symbols, functions, and stuff that we can't calculate a hashcode for
        }
    }

    if (typeof module != 'undefined') {
        module['exports'] = HashMap;
    } else {
        global['HashMap'] = HashMap;
    }
})(this);
