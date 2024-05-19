const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();
const validPuzzle = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
const validPuzzleArr = validPuzzle.split("");
const validPuzzle2 = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
const invalidPuzzle = '115..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
let validPuzzleArr2 = validPuzzle2.split("");
solver.solve(validPuzzleArr2);
const validPuzzleSol = '135762984946381257728459613694517832812936745357824196473298561581673429269145378';

suite('Unit Tests', () => {
    test('Valid puzzle string', () => {
        assert.equal(solver.validate(validPuzzle), "");
    });
    test('Invalid characters puzzle string', () => {
        assert.equal(solver.validate("..9..5.1.85.4....2432......1.A.69.83.9.....6.62.71...9......1945....4.37.4.3..6.."), "Invalid characters in puzzle");
    });
    test('Invalid length puzzle string', () => {
        assert.equal(solver.validate("..9..5.1.85.4....24"), "Expected puzzle to be 81 characters long");
    });
    test('Valid row placement', () => {
        assert.deepEqual(solver.checkRowPlacement(validPuzzle, "A", 2, 7), [true, ""]);
    });
    test('Invalid row placement', () => {
        assert.deepEqual(solver.checkRowPlacement(validPuzzle, "A", 2, 1), [false, "row"]);
    });
    test('Valid column placement', () => {
        assert.deepEqual(solver.checkColPlacement(validPuzzle, "A", 2, 7), [true, ""]);
    });
    test('Invalid column placement', () => {
        assert.deepEqual(solver.checkColPlacement(validPuzzle, "A", 2, 2), [false, "column"]);
    });
    test('Valid region placement', () => {
        assert.deepEqual(solver.checkRegionPlacement(validPuzzle, "A", 2, 7), [true, ""]);
    });
    test('Invalid region placement', () => {
        assert.deepEqual(solver.checkRegionPlacement(validPuzzle, "A", 2, 8), [false, "region"]);
    });
    test('Valid puzzle passes', () => {
        assert.equal(solver.solve(validPuzzleArr), true);
    });
    test('Invalid puzzle fails', () => {
        assert.equal(solver.solve(invalidPuzzle.split("")), false);
    });
    test('returns expected solution', () => {
        assert.equal(validPuzzleArr2.join(""), validPuzzleSol);
    });
});
