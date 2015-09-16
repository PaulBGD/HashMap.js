// a few quick tests to make sure things still work
var HashMap = require('./src/hashmap');
var map = new HashMap();

// simple put/get/remove
map.put('key', 'value');
if (map.get('key') !== 'value') {
    throw new Error('Simple get/put returned wrong value');
}
map.remove('key');
if (map.get('key') !== undefined) {
    throw new Error('Remove did not remove key');
}

// the words shores and shot's generate the same hash
map.put('shores', 'value1');
map.put("shot's", 'value2');
if (map.get('shores') !== 'value1') {
    throw new Error('Duplicate hashes do not work');
}

// complex objects
var object = {str: 'value', arr: ['one', 'two'], bool: true, num: 1};

map.put(object, 'value');
if (map.get(object) !== 'value') {
    throw new Error('Complex key object does not work');
}

console.log('Everything appears fine.');
