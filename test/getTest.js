require("../app.js");
var supertest = require('supertest');
var express = require('express');
var assert = require('assert');
var should = require('should');

describe.skip('Baseline tests', function() {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      assert.equal(-1, [1,2,3].indexOf(5));
      assert.equal(-1, [1,2,3].indexOf(0));
      [1,2,3].indexOf(5).should.equal(-1);
      [1,2,3].indexOf(0).should.equal(-1);
    });
  });
});

//TODO: Grab localhost info from app.js
var request = supertest("http://localhost:8000");
describe('/person tests', function() {
  it('should return Ted for id 1', function(done) {
    request
      .get('/persons/1')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(function(res) {
        res.body.id.should.equal(1)
        res.body.firstName.should.equal("Ted")
        res.body.lastName.should.equal("Neward")
        res.body.status.should.equal("MEANing")
      })
      .end(done);
    });
});
