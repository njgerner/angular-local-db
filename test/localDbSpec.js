'use strict';

describe('angular-local-db', () => {

  var $localDb;
  beforeEach(angular.mock.module('angular-local-db'));

  beforeEach(inject((_$localDb_) => {
    $localDb = _$localDb_;
  }));

  it('should exist', () => {
    expect($localDb).toBeDefined();
  });

  it('should initialize with a namespace', () => {
    $localDb.init({namespace: '12345'})
    expect($localDb._pid).toEqual('12345')
  })

  it('should set & get a key', () => {
    $localDb.set('foo', 'bar');
    expect($localDb.get('foo')).toEqual('bar')
  })

});