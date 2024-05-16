'use strict';

const { resolveShowConfigPath } = require('@babel/core/lib/config/files/index.js');
const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {

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
      console.log(solver.checkRowPlacement(puzzle, "D", 5, 6));
    });
};
