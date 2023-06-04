// test.js
const assert = require('assert');
const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const app = require('../agent-based/app/app');

describe('Agent Based App', () => {
  it('should send a message to the queue', (done) => {
    request(app)
      .post('/send')
      .send({ message: 'Test message' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        assert.strictEqual(res.body.message, 'Test message');
        done();
      });
  });

  it('should receive a message from the queue', (done) => {
    request(app)
      .get('/receive')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        assert.strictEqual(res.text, 'Test message');
        done();
      });
  });
});
