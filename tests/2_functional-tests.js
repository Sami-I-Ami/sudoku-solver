const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
    test('Solve puzzle with valid string', function(done) {
        chai.request(server)
          .post('/api/solve')
          .send({puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'})
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.equal(res.body.solution, '135762984946381257728459613694517832812936745357824196473298561581673429269145378')
            done();
          });
    });
    test('Solve puzzle with no string', function(done) {
        chai.request(server)
          .post('/api/solve')
          .send()
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.equal(res.body.error, "Required field missing");
            done();
          });
    });
    test('Solve puzzle with invalid characters', function(done) {
        chai.request(server)
          .post('/api/solve')
          .send({puzzle: "..9..5.1.85.4.A..2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."})
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.equal(res.body.error, "Invalid characters in puzzle");
            done();
          });
    });
    test('Solve puzzle with incorrect length', function(done) {
        chai.request(server)
          .post('/api/solve')
          .send({puzzle: "..9..5.1.85.4...2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."})
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.equal(res.body.error, "Expected puzzle to be 81 characters long");
            done();
          });
    });
    test('Solve puzzle that cannot be solved', function(done) {
        chai.request(server)
          .post('/api/solve')
          .send({puzzle: "9.9..5.1.85..4...2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."})
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.equal(res.body.error, "Puzzle cannot be solved");
            done();
          });
    });
    test('Check valid placement', function(done) {
        chai.request(server)
          .post('/api/check')
          .send({
            puzzle: "..9..5.1.85..4...2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
            coordinate: "A1",
            value: "7"
          })
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.equal(res.body.valid, true);
            done();
          });
    });
    test('Check placement with one conflict', function(done) {
        chai.request(server)
          .post('/api/check')
          .send({
            puzzle: "..9..5.1.85..4...2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
            coordinate: "A1",
            value: "2"
          })
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.equal(res.body.valid, false);
            assert.deepEqual(res.body.conflict, ["region"]);
            done();
          });
    });
    test('Check placement with 2 conflicts', function(done) {
        chai.request(server)
          .post('/api/check')
          .send({
            puzzle: "..9..5.1.85..4...2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
            coordinate: "A1",
            value: "9"
          })
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.equal(res.body.valid, false);
            assert.deepEqual(res.body.conflict, ["row", "region"]);
            done();
          });
    });
    test('Check placement with all conflicts', function(done) {
        chai.request(server)
          .post('/api/check')
          .send({
            puzzle: "..9..5.1.85..4...2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
            coordinate: "A1",
            value: "5"
          })
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.equal(res.body.valid, false);
            assert.deepEqual(res.body.conflict, ["row", "column", "region"]);
            done();
          });
    });
    test('Check placement with missing field', function(done) {
        chai.request(server)
          .post('/api/check')
          .send({})
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.equal(res.body.error, "Required field(s) missing");
            done();
          });
    });
    test('Check placement with invalid characters', function(done) {
        chai.request(server)
          .post('/api/check')
          .send({
            puzzle: "..9..5.1.85..4.A.2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
            coordinate: "A1",
            value: "5"
          })
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.equal(res.body.error, "Invalid characters in puzzle");
            done();
          });
    });
    test('Check placement with invalid length', function(done) {
        chai.request(server)
          .post('/api/check')
          .send({
            puzzle: "..9..5.1.85..4..2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
            coordinate: "A1",
            value: "5"
          })
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.equal(res.body.error, "Expected puzzle to be 81 characters long");
            done();
          });
    });
    test('Check placement with invalid coordinate', function(done) {
        chai.request(server)
          .post('/api/check')
          .send({
            puzzle: "..9..5.1.85...4..2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
            coordinate: "A11",
            value: "5"
          })
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.equal(res.body.error, "Invalid coordinate");
            done();
          });
    });
    test('Check placement with invalid coordinate', function(done) {
        chai.request(server)
          .post('/api/check')
          .send({
            puzzle: "..9..5.1.85...4..2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
            coordinate: "A1",
            value: "0.5"
          })
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.equal(res.body.error, "Invalid value");
            done();
          });
    });
});

