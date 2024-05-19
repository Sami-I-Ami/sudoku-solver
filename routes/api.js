'use strict';

const { resolveShowConfigPath } = require('@babel/core/lib/config/files/index.js');
const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const {puzzle, coordinate, value} = req.body;
      if (!puzzle | !coordinate | !value) {
        res.json({error: "Required field(s) missing"});
        return;
      }

      const message = solver.validate(puzzle);
      if (message) {
        res.json({error: message});
        return;
      }

      const coordinateRegex = /^[A-I][1-9]$/;
      const valueRegex = /^[1-9]$/;
      if (!coordinateRegex.test(coordinate)) {
        res.json({error: "Invalid coordinate"});
        return;
      } else if (!valueRegex.test(value)) {
        res.json({error: "Invalid value"});
        return;
      }

      const row = coordinate[0];
      const column = coordinate[1];

      const rowCheck = solver.checkRowPlacement(puzzle, row, column, value);
      const colCheck = solver.checkColPlacement(puzzle, row, column, value);
      const regionCheck = solver.checkRegionPlacement(puzzle, row, column, value);
      let conflict = [];
      conflict.push(rowCheck[1], colCheck[1], regionCheck[1]);
      conflict = conflict.filter((conflict) => conflict !== "");

      if (conflict.length !== 0) {
        res.json({valid: false, conflict});
      } else {
        res.json({valid: true});
      }

    });
    
  app.route('/api/solve')
    .post((req, res) => {
      const puzzle = req.body.puzzle;
      if (!puzzle) {
        res.json({error: "Required field missing"});
        return;
      }
      const message = solver.validate(puzzle);
      if (message) {
        res.json({error: message});
        return;
      }

      let puzzleArr = [...puzzle]; // since strings are not mutable
      solver.solve(puzzleArr);
      const solvedPuzzle = puzzleArr.join("");

      if (solvedPuzzle.includes(".")) {
        res.json({error: "Puzzle cannot be solved"});
        return;
      } else {
        res.json({solution: solvedPuzzle});
      }
    });
};
