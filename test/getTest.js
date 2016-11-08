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

describe('/lists tests', function() {
  it('should return Spice Night for id 1', function(done) {
    request
      .get('/lists/1')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(function(res) {
        res.body.id.should.equal(1)
        res.body.listName.should.equal("Spice Night!")
        res.body.ingredients.should.equal("['peppers', 'onions', 'cheese', 'cilantro', 'pork', 'beef']")
      })
      .end(done);
    });

    // add list
    it('should allow me to add a list', function(done) {
      request
        .post('/lists')
        .send({"name":"Italian Night", "ingredients":"['penne','meatballs','ricotta','sausage','garlic','peppers']"})
        .expect(200)
        .expect('Content-Type',/json/)
        .expect(function(res) {
          should.exist(res.body.id);
          res.body.name.should.equal("Italian Night");
          res.body.ingredients.should.equal("['penne','meatballs','ricotta','sausage','garlic','peppers']");
    })
      .end(done);
    })


    it('should allow me to delete a list', function(done) {
      request
        .delete('/lists/listId')
        .expect('Content-Type',/json/)
      .end(done);
    })

});
