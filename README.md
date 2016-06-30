angular-local-db
=========

An [AngularJS](https://github.com/angular/angular.js) module that that provides a simple key-value browser based database API. This module utilizes the browers local storage to provide for each caching and robust offline access to stored data.

### Features

* **init**
* **get**
* **set**
* **clear**
* **getIndex**
* **setIndex**
* **clearIndex**
* **addToSet**
* **clearFromSet**
* **addToIndexList**
* **clearFromIndexList**
* **addToIndexSet**
* **clearFromIndexSet**
* **getSecondaryIndex**
* **setSecondaryIndex**
* **clearSecondaryIndex**
* **addToSecondaryIndexList**
* **clearFromSecondaryIndexList**
* **addToSecondaryIndexSet**
* **clearFromSecondaryIndexSet**

Install
=======

### Bower

```bash
bower install angular-local-db --save
```

### NPM
```bash
npm install angular-local-db --save
```

Usage
=====

### Require angular-local-db

```javascript
angular.module('app', [
    'angular-local-db'
]).controller('Ctrl', function(
    $scope,
    $localDb
){});
```

Methods
=====

### init(options)
Initializes the localDb instance namespace. This is useful to allow for caching of many users data on the same browser.

```javascript
$localDb.init({namespace: User.id})
```

### get(key)
Gets the stored value for the assigned key.

```javascript
let myValue = $localDb.get(myKey)
```

Todos
=====

* ngdoc Documentation
* Unit Tests
* Gulp Tasks

Any contribution will be appreciated.