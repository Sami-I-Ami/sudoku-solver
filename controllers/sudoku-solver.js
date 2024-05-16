class SudokuSolver {

  validate(puzzleString) {
    if (puzzleString.length !== 81) {
      return "Expected puzzle to be 81 characters long";
    }
    const characterRegex = /[0-9\.]+/;
    const validCharacters = puzzleString.match(characterRegex)[0];
    if (validCharacters.length !== 81) {
      return "Invalid characters in puzzle";
    }
    return "";
  }

  checkRowPlacement(puzzleString, row, column, value) {

  }

  checkColPlacement(puzzleString, row, column, value) {

  }

  checkRegionPlacement(puzzleString, row, column, value) {

  }

  solve(puzzleString) {
    
  }
}

module.exports = SudokuSolver;

