'use strict';

angular.module('angular-local-db', [])
.service('$localDb', 
  ['$window',
  function($window) {

    /**
    * Initialize
    *
    * @param {object} options
    * @param {string} options.namespace - Namespace to store instance key value pairs
    * @api public
    */
    this.init = function (options) {
      this._pid = options.namespace;
    };

    /**
    * Get key value
    *
    * @param {string} key - the key to get
    * @return {type} - value
    * @api public
    */
    this.get = function (key) {
      if (!key) { throw new Error ('Missing key in localDb get'); }

      return angular.fromJson($window.localStorage[this._pid + ':' + key]);
    };

    /**
    * Set key value
    *
    * @param {string} key - the key to set
    * @param {type} value - value to set
    * @api public
    */
    this.set = function (key, value) {
      if (!key) { throw new Error ('Missing key in localDb set'); }
      if (!value) { throw new Error ('Missing value in localDb set'); }
      if (typeof value !== 'array' && typeof value !== 'object' && typeof value !== 'boolean' && typeof value !== 'string') {
        throw new Error ('Malformed value in localDb set: ' + value); 
      }
      $window.localStorage[this._pid + ':' + key] = angular.toJson(value);
    };

    /**
    * Clear key value
    *
    * @param {string} key - the key to clear
    * @api public
    */
    this.clear = function (key) {
      if (!key) { throw new Error ('Missing key in localDb clear'); }
      $window.localStorage.removeItem(this._pid + ':' + key);
    };

    /**
    * Get collection:index value
    *
    * @param {string} collection - collection to get index in
    * @param {string} index - index to get
    * @return {type} - value
    * @api public
    */
    this.getIndex = function (collection, index) {
      if (!collection) { throw new Error ('Missing collection in localDb getIndex'); }
      if (!index) { throw new Error ('Missing index in localDb getIndex'); }

      return angular.fromJson($window.localStorage[this._pid + ':' + collection + ':' + index]);
    };

    /**
    * Set collection:index value
    *
    * @param {string} collection - collection to set index in
    * @param {string} index - index to set
    * @param {type} value - value to set
    * @api public
    */
    this.setIndex = function (collection, index, value) {
      if (!collection) { throw new Error ('Missing collection in localDb setIndex'); }
      if (!index) { throw new Error ('Missing index in localDb setIndex'); }
      if (typeof value !== 'array' && typeof value !== 'object' && typeof value !== 'boolean' && typeof value !== 'string') {
        throw new Error ('Malformed value in localDb setIndex: ' + value); 
      }

      $window.localStorage[this._pid + ':' + collection + ':' + index] = angular.toJson(value);
    };

    /**
    * Clear collection:index value
    *
    * @param {string} collection - collection to set index in
    * @param {string} index - index to set
    * @api public
    */
    this.clearIndex = function (collection, index) {
      if (!collection) { throw new Error ('Missing collection in localDb clearIndex'); }
      if (!index) { throw new Error ('Missing index in localDb clearIndex'); }

      $window.localStorage.removeItem(this._pid + ':' + collection + ':' + index);
    };

     /**
    * Set set key value
    *
    * @param {string} key - the key to set
    * @param {type} value - value to add to the set set
    * @param {string} compareProperty - optional property to pass in to check equality on in set
    * @api public
    */
    this.addToSet = function (key, value, compareProperty) {
      if (!key) { throw new Error ('Missing key in localDb addToSet'); }
      if (!value) { throw new Error ('Missing value in localDb addToSet'); }
      if (typeof value !== 'array' && typeof value !== 'object' && typeof value !== 'boolean' && typeof value !== 'string') {
        throw new Error ('Malformed value in localDb addToSet: ' + value); 
      }

      compareProperty = compareProperty || "id";
      var set = this.get(key);

      if (!set) { 
        this.set(key, [value]); 
      } else {
        if (!Array.isArray(set)) { throw new Error ('The cached value at the given key is not a set. Key: ' + key); }
        var updated = false;
        set.forEach(function (item, index, indexSet) {
          if (value && value[compareProperty] && item[compareProperty] == value[compareProperty]) {
            indexSet[index] = value;
            updated = true;
          }
        }, this);

        if (!updated) {
          set.push(value);
        }
        this.set(key, set);
      }
    };

    /**
    * Clear set key value
    *
    * @param {string} key - the key to set
    * @param {type} compareValue - value to compare against the compare property of each member of the set
    * @param {string} compareProperty - optional property to pass in to check equality on in set
    * @api public
    */
    this.clearFromSet = function (key, compareValue, compareProperty) {
      if (!key) { throw new Error ('Missing key in localDb clearFromSet'); }
      if (!compareValue) { throw new Error ('Missing compareValue in localDb clearFromSet'); }
      if (typeof compareValue !== 'string' && typeof compareValue !== "number") {
        throw new Error ('Malformed compareValue in localDb clearFromSet: ' + compareValue); 
      }

      compareProperty = compareProperty || "id";
      var set = this.get(key);

      if (!set) { return console.warn('The cached set value at the given key is not initialized. Key: ' + key); }
      if (!Array.isArray(set)) { throw new Error ('The cached value at the given key is not a set. Key: ' + key); }

      set = set.map(function (obj) {
        if (typeof obj !== 'object') { throw new Error ('The referenced set is not composed of comparable objects. Key: ' + key); }
        if (obj[compareProperty] !== compareValue) return obj;
      });

      set = set.filter(function(n){ return n != undefined });

      this.set(key, set);
    };

    /**
    * Add to index list
    *
    * @param {string} collection - collection to set index in
    * @param {string} index - index to set
    * @param {type} value - value to set
    * @api public
    */
    this.addToIndexList = function (collection, index, value) {
      if (!collection) { throw new Error ('Missing collection in localDb addToIndexList'); }
      if (!index) { throw new Error ('Missing index in localDb addToIndexList'); }
      if (!value) { throw new Error ('Missing value in localDb addToIndexList'); }
      if (typeof value !== 'array' && typeof value !== 'object' && typeof value !== 'boolean' && typeof value !== 'string') {
        throw new Error ('Malformed value in localDb addToIndexList: ' + value); 
      }

      var list = this.getIndex(collection, index);
      if (!list) { 
        this.setIndex(collection, index, [value]); 
      } else {
        if (!Array.isArray(set)) { throw new Error ('The cached value at the given key is not a list. Key: ' + key); }
        list.push(value);
        this.setIndex(collection, index, list);
      }
    };

    /**
    * Clear from index list
    *
    * @param {string} collection - collection to set index in
    * @param {string} index - index to set
    * @param {type} value - value to set
    * @api public
    */
    this.clearFromIndexList = function (collection, index, compareValue, compareProperty) {
      if (!collection) { throw new Error ('Missing collection in localDb clearFromIndexList'); }
      if (!index) { throw new Error ('Missing index in localDb clearFromIndexList'); }
      if (!compareValue) { throw new Error ('Missing value in localDb clearFromIndexList'); }
      if (typeof compareValue !== 'string' && typeof compareValue !== "number") {
        throw new Error ('Malformed value in localDb clearFromIndexList: ' + value); 
      }

      compareProperty = compareProperty || "id";

      var list = this.getIndex(collection, index);
      if (!set) { 
        console.warn('The cached list value at the given index is not initialized. Index: ' + index);
      } else {
        if (!Array.isArray(set)) { throw new Error ('The cached value at the given key is not a list. Index: ' + index); }
        list = list.map(function (obj) {
          if (typeof obj !== 'object') { throw new Error ('The referenced list is not composed of comparable objects. Index: ' + index); }
          if (obj[compareProperty] !== compareValue) return obj;
        });

        list = list.filter(function(n){ return n != undefined });

        this.setIndex(collection, index, list);
      }
    };

    /**
    * Add to index set
    *
    * @param {string} collection - collection to set index in
    * @param {string} index - index to set
    * @param {type} value - value to set
    * @param {string} compareProperty - optional property to pass in to check equality on in set
    * @api public
    */
    this.addToIndexSet = function (collection, index, value, compareProperty) {
      if (!collection) { throw new Error ('Missing collection in localDb addToIndexSet'); }
      if (!index) { throw new Error ('Missing index in localDb addToIndexSet'); }
      if (!value) { throw new Error ('Missing value in localDb addToIndexSet'); }

      compareProperty = compareProperty || "id";
      var set = this.getIndex(collection, index);
      if (!set) { 
        this.setIndex(collection, index, [value]); 
      } else {
        if (!Array.isArray(set)) { throw new Error ('The cached value at the given key is not a set. Index: ' + index); }
        var updated = false;
        set.forEach(function (item, index, indexSet) {
          if (value && value[compareProperty] && item[compareProperty] == value[compareProperty]) {
            indexSet[index] = value;
            updated = true;
          }
        }, this);

        if (!updated) {
          set.push(value);
        }
        this.setIndex(collection, index, set);
      }
    };

    /**
    * Clear from index set
    *
    * @param {string} collection - collection to set index in
    * @param {string} index - index to set
    * @param {type} compareValue - value to set
    * @param {string} compareProperty - optional property to pass in to check equality on in set
    * @api public
    */
    this.clearFromIndexSet = function (collection, index, compareValue, compareProperty) {
      if (!collection) { throw new Error ('Missing collection in localDb clearFromIndexSet'); }
      if (!index) { throw new Error ('Missing index in localDb clearFromIndexSet'); }
      if (!compareValue) { throw new Error ('Missing compareValue in localDb clearFromIndexSet'); }
      if (typeof compareValue !== 'string' && typeof compareValue !== "number") { throw new Error ('Malformed compareValue in localDb clearFromIndexSet: ' + compareValue)}

      compareProperty = compareProperty || "id";
      var set = this.getIndex(collection, index);
      if (!set) { 
        console.warn('The cached set value at the given index is not initialized. Index: ' + index);
      } else {
        if (!Array.isArray(set)) { throw new Error ('The cached value at the given key is not a set. Key: ' + index); }

        set = set.map(function (obj) {
          if (typeof obj !== 'object') { throw new Error ('The referenced set is not composed of comparable objects. Index: ' + index); }
          if (obj[compareProperty] !== compareValue) return obj;
        });

        set = set.filter(function(n){ return n != undefined });

        this.setIndex(collection, index, set);
      }
    };

    /**
    * Get collection:index:secondary value
    *
    * @param {string} collection - collection to get index in
    * @param {string} index - index to get
    * @param {string} secondary - secondary index to get
    * @return {type} - value
    * @api public
    */
    this.getSecondaryIndex = function (collection, index, secondary) {
      if (!collection) { throw new Error ('Missing collection in localDb getSecondaryIndex'); }
      if (!index) { throw new Error ('Missing index in localDb getSecondaryIndex'); }
      if (!secondary) { throw new Error ('Missing secondary index in localDb getSecondaryIndex'); }

      return angular.fromJson($window.localStorage[this._pid + ':' + collection + ':' + index + ':' + secondary]);
    };

    /**
    * Set collection:index:secondary value
    *
    * @param {string} collection - collection to set index in
    * @param {string} index - index to set
    * @param {string} secondary - secondary index to set
    * @param {type} value - value to set
    * @api public
    */
    this.setSecondaryIndex = function (collection, index, secondary, value) {
      if (!collection) { throw new Error ('Missing collection in localDb setSecondaryIndex'); }
      if (!index) { throw new Error ('Missing index in localDb setSecondaryIndex'); }
      if (!secondary) { throw new Error ('Missing secondary index in localDb setSecondaryIndex'); }
      if (!value) { throw new Error ('Missing value in localDb setSecondaryIndex'); }
      if (typeof value !== 'array' && typeof value !== 'object'){ throw new Error ('Malformed value in localDb setSecondaryIndex: ' + value); }

      $window.localStorage[this._pid + ':' + collection + ':' + index + ':' + secondary] = angular.toJson(value);
    };

    /**
    * Clear collection:index:secondary value
    *
    * @param {string} collection - collection to set index in
    * @param {string} index - index to set
    * @param {string} secondary - secondary index to set
    * @api public
    */
    this.clearSecondaryIndex = function (collection, index, secondary) {
      if (!collection) { throw new Error ('Missing collection in localDb setSecondaryIndex'); }
      if (!index) { throw new Error ('Missing index in localDb setSecondaryIndex'); }
      if (!secondary) { throw new Error ('Missing secondary index in localDb setSecondaryIndex'); }

      $window.localStorage.removeItem(this._pid + ':' + collection + ':' + index + ':' + secondary);
    };

    /**
    * Add to secondary index list
    *
    * @param {string} collection - collection to set index in
    * @param {string} index - index to set
    * @param {string} secondary - secondary index to set
    * @param {type} value - value to set
    * @api public
    */
    this.addToSecondaryIndexList = function (collection, index, secondary, value) {
      if (!collection) { throw new Error ('Missing collection in localDb addToSecondaryIndex'); }
      if (!index) { throw new Error ('Missing index in localDb addToSecondaryIndex'); }
      if (!secondary) { throw new Error ('Missing secondary index in localDb addToSecondaryIndex'); }
      if (!value) { throw new Error ('Missing value in localDb addToSecondaryIndex'); }
      if (typeof value !== 'array' && typeof value !== 'object'){ throw new Error ('Malformed value in localDb addToSecondaryIndex: ' + value); }

      var hash = this.getIndex(collection, index);
      if (!hash) { hash = {}; this.setIndex(collection, index, hash); }
      var list = this.getSecondaryIndex(collection, index, secondary);
      if (!list) { list = []; this.setSecondaryIndex(collection, index, secondary, list); }
      this.setSecondaryIndex(collection, index, secondary, list.push(value));
    };

    /**
    * Clear from secondary index list
    *
    * @param {string} collection - collection to set index in
    * @param {string} index - index to set
    * @param {string} secondary - secondary index to set
    * @param {type} compareValue - compareValue to remove
    * @param {type} compareProperty - property to compare against compareValue
    * @api public
    */
    this.clearFromSecondaryIndexList = function (collection, index, secondary, compareValue, compareProperty) {
      if (!collection) { throw new Error ('Missing collection in localDb clearFromSecondaryIndexList'); }
      if (!index) { throw new Error ('Missing index in localDb clearFromSecondaryIndexList'); }
      if (!secondary) { throw new Error ('Missing secondary index in localDb clearFromSecondaryIndexList'); }
      if (!compareValue) { throw new Error ('Missing compareValue in localDb clearFromSecondaryIndexList'); }
      if (typeof compareValue !== 'string' && typeof compareValue !== "number"){ throw new Error ('Malformed compareValue in localDb clearFromSecondaryIndexList: ' + compareValue); }

      compareProperty = compareProperty || 'id';

      var hash = this.getIndex(collection, index);
      if (!hash) { return console.warn('The cached hash value at the given index is not initialized. Index: ' + index); }
      var list = this.getSecondaryIndex(collection, index, secondary);
      if (!list) { return console.warn('The cached list value at the given secondary index is not initialized. Secondary Index: ' + secondary); }
      list = list.map(function (obj) {
        if (typeof obj !== 'object') { throw new Error ('The referenced list is not composed of comparable objects. Index: ' + index); }
        if (obj[compareProperty] !== compareValue) return obj;
      });

      list = list.filter(function(n){ return n != undefined });

      this.setSecondaryIndex(collection, index, secondary, list);
    };

    /**
    * Add to secondary index set
    *
    * @param {string} collection - collection to set index in
    * @param {string} index - index to set
    * @param {string} secondary - secondary index to set
    * @param {type} value - value to set
    * @api public
    */
    this.addToSecondaryIndexSet = function (collection, index, secondary, value) {
      if (!collection) { throw new Error ('Missing collection in localDb addToSecondaryIndex'); }
      if (!index) { throw new Error ('Missing index in localDb addToSecondaryIndex'); }
      if (!secondary) { throw new Error ('Missing secondary index in localDb addToSecondaryIndex'); }
      if (!value) { throw new Error ('Missing value in localDb addToSecondaryIndex'); }
      if (typeof value !== 'array' && typeof value !== 'object'){ throw new Error ('Malformed value in localDb addToSecondaryIndex: ' + value); }

      var hash = this.getIndex(collection, index);
      if (!hash) { hash = {}; this.setIndex(collection, index, hash); }
      var set = this.getSecondaryIndex(collection, index, secondary);
      if (!set) {
        set = []; this.setSecondaryIndex(collection, index, secondary, [set]); 
      } else {
        if (!Array.isArray(set)) { throw new Error ('The cached value at the given key is not a set. Key: ' + key); }
        var updated = false;
        set.forEach(function (item, index, indexSet) {
          if (value && value[compareProperty] && item[compareProperty] == value[compareProperty]) {
            indexSet[index] = value;
            updated = true;
          }
        }, this);

        if (!updated) {
          set.push(value);
        }
        this.setSecondaryIndex(collection, index, secondary, set);
      }
    };

    /**
    * Clear from secondary index set
    *
    * @param {string} collection - collection to set index in
    * @param {string} index - index to set
    * @param {string} secondary - secondary index to set
    * @param {type} compareValue - compareValue to remove
    * @param {type} compareProperty - property to compare against compareValue
    * @api public
    */
    this.clearFromSecondaryIndexSet = function (collection, index, secondary, compareValue, compareProperty) {
      if (!collection) { throw new Error ('Missing collection in localDb clearFromSecondaryIndexSet'); }
      if (!index) { throw new Error ('Missing index in localDb clearFromSecondaryIndexSet'); }
      if (!secondary) { throw new Error ('Missing secondary index in localDb clearFromSecondaryIndexSet'); }
      if (!compareValue) { throw new Error ('Missing compareValue in localDb clearFromSecondaryIndexSet'); }
      if (typeof compareValue !== 'string' && typeof compareValue !== "number"){ throw new Error ('Malformed compareValue in localDb clearFromSecondaryIndexSet: ' + compareValue); }

      compareProperty = compareProperty || 'id';

      var hash = this.getIndex(collection, index);
      if (!hash) { return console.warn('The cached hash value at the given index is not initialized. Index: ' + index); }
      var set = this.getSecondaryIndex(collection, index, secondary);
      if (!set) { return console.warn('The cached set value at the given secondary index is not initialized. Secondary Index: ' + secondary); }
      set = set.map(function (obj) {
        if (typeof obj !== 'object') { throw new Error ('The referenced set is not composed of comparable objects. Index: ' + index); }
        if (obj[compareProperty] !== compareValue) return obj;
      });

      set = set.filter(function(n){ return n != undefined });

      this.setSecondaryIndex(collection, index, secondary, set);
    };

}]);
