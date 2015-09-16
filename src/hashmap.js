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

    HashMap.prototype = {
        /**
         * Gets the value associated with a certain key
         * @param key the key to get the value for
         * @returns {*} the value stored, or undefined
         */
        get: function (key) {
            var result = this._find(key);
            return result.v;
        },

        /**
         * Puts a value associated with a key
         * @param key the key to set the value for
         * @param value the value to set, omit to remove key
         * @returns {*} the previous value
         */
        put: function (key, value) {
            var result = this._find(key);
            var obj = {key: key, value: value};

            if (result.b) {
                if (result.e) {
                    result.e.value = value;
                } else {
                    result.b.push(obj);
                    this.length++;
                }
            } else {
                this.entries[result.h] = [obj];
                this.length++;
            }

            return result.v;
        },

        /**
         * Removes an entry
         * @param key the key to remove the entry before
         * @returns {*} the removed value
         */
        remove: function (key) {
            var result = this._find(key);

            if (result.e) {
                if (result.b.length > 1) {
                    result.b.splice(result.i, 1);
                } else {
                    delete this.entries[result.h];
                }
                this.length--;
            }

            return result.v;
        },

        toArray: function () {
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
        },

        _find: function (key) {
            var result = {};
            result.h = calculateHash(key);
            result.b = this.entries[result.h];

            if (result.b) {
                var length = result.b.length;
                while (length--) {
                    var entry = result.b[length];
                    if (entry.key === key) {
                        result.i = length;
                        result.v = entry.value;
                        result.e = entry;
                        break;
                    }
                }
            }
            
            return result;
        }
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
