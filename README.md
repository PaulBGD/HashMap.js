# HashMap.js 
< 500 byte library for HashMaps in JavaScript

## Download

[Development Version](src/hashmap.js) [Production Version](src/hashmap.min.js)

## About

HashMap.js is a library which adds HashMaps to JavaScript. While some modern browsers support Maps, this library supports all browsers back to even IE8!

This library also works well with the [Stream.js](https://github.com/PaulBGD/Stream.js) library.

## Examples

Setting a value using a complex object as a key:

```javascript
var statuses = new HashMap();
var user = {names: ['Paul',' PaulBGD'], logged_in: true};
statuses.put(user, 'online');

console.log('Paul\'s Status: ' + statuses.get(user));
// => Paul's Status: online
```

Getting a value, or adding a default one:

```javascript
console.log('Paul\'s Status: ' + statuses.getOrCompute(user, function (user) {
    return database.getStatus(user);
}));
// => Paul's Status: online
```

Using the [Stream.js](https://github.com/PaulBGD/Stream.js) library to get all online usernames:

```javascript
new Stream(status.entries)
    .filter(function (entry) { return entry.value == 'online' })
    .map(function (entry) { return entry.key.username })
    .forEach(function (username) {
        console.log(username + ' is online!');
    });
```

## Functions

### `new HashMap() => HashMap`

Creates a new HashMap.

### `HashMap.prototype.get(key:Object) => Object`

Returns the value associated with the key

### `HashMap.prototype.put(key:Object, value:Object) => Object`

Sets a value associated with the key, returns the previous value if it was set.

### `HashMap.prototype.getOrCompute(key:Object, func:function(key:Object) => value:Object) => Object`

Returns the value associated with a key, or sets the association if it is not set.

### `HashMap.prototype.remove(key:Object) => Object`

Removes an entry from the specified key, returns the entry removed if it exists.

### `HashMap.prototype.entries => Array`

An array containing all of the entries.

### `HashMap.prototype.size => Number`

Returns the size of this HashMap
