require("../app.js");
var supertest = require('supertest');
var express = require('express');
var assert = require('assert');

describe.skip('Baseline tests', function() {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      assert.equal(-1, [1,2,3].indexOf(5));
      assert.equal(-1, [1,2,3].indexOf(0));
      // [1,2,3].indexOf(5).should.equal(-1);
      // [1,2,3].indexOf(0).should.equal(-1);
    });
  });
});

//TODO: Grab localhost info from app.js
var request = supertest("http://localhost:8000");

describe('/lists tests', function() {
  it('should return Spice Night for id 1', function(done) {
    request
      .get('/lists/1')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(function(res) {
        assert.equal(1, res.body.id);
        assert.equal("Spice Night!", res.body.listName);
        assert.equal("['peppers', 'onions', 'cheese', 'cilantro', 'pork', 'beef']", res.body.ingredients);
      })
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });

  //get all test
  it('should return all lists', function(done) {
    request
      .get('/lists')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(function(res) {
        assert.equal(1, res.body[0].id);
        assert.equal("Spice Night!", res.body[0].listName);
        assert.equal("['peppers', 'onions', 'cheese', 'cilantro', 'pork', 'beef']", res.body[0].ingredients);
        assert.equal(2, res.body[1].id);
        assert.equal("Sweet Night!", res.body[1].listName);
        assert.equal("['vanilla extract', 'syrup', 'ice cream', 'chocolate', 'cookies', 'apples']", res.body[1].ingredients);
      })
    .end(function(err, res) {
      if (err) return done(err);
      done();
    });
  });

  // add list
  it('should allow me to add a list', function(done) {
    request
      .post('/lists')
      .send({"name":"Italian Night", "ingredients":"['penne','meatballs','ricotta','sausage','garlic','peppers']"})
      .expect(200)
      .expect('Content-Type',/json/)
      .expect(function(res) {
        assert(res.body.id != null);
        assert("Italian Night", res.body.name);
        assert("['penne','meatballs','ricotta','sausage','garlic','peppers']", res.body.ingredients);
      })
    .end(function(err, res) {
      if (err) return done(err);
      done();
    });
  });

  // delete all
  it('should allow me to delete a list', function(done) {
    request
      .delete('/lists')
      .expect(200)
      .expect('Content-Type',/json/)
      .expect(function(res) {
        var empty = [];
        assert(res.body, empty);
      })
    .end(function(err, res) {
      if (err) return done(err);
      done();
    });
  });

  //TODO: right update test

});
