class SudokuSolver {

  // added functions
  // tests if value will not invalidate string for zone
  stringCheck(zoneString, zone, value) {
    const numRegex = /[0-9]+/g;
    const numString = zoneString.match(numRegex).join("");
    for (let i = 0; i < numString.length; i++) {
      //invalid
      if (numString[i] == value) {
        return [false, zone];
      }
    }

    // valid
    return [true, ""];
  }

  // convert row letter to number
  rowLetterToNumber(row) {
    const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
    return rows.findIndex((rowLabel) => rowLabel === row);
  }

  // original functions
  validate(puzzleString) {
    // test length
    if (puzzleString.length !== 81) {
      return "Expected puzzle to be 81 characters long";
    }

    // test characters
    const characterRegex = /[0-9\.]+/;
    const validCharacters = puzzleString.match(characterRegex)[0];
    if (validCharacters.length !== 81) {
      return "Invalid characters in puzzle";
    }

    // valid
    return "";
  }

  checkRowPlacement(puzzleString, row, column, value) {
    // find row
    const rowNum = this.rowLetterToNumber(row);
    const startNum = rowNum * 9;
    let rowString = puzzleString.slice(startNum, startNum + 9);

    // remove from list if num is already in coordinate (for checks only)
    if (rowString[column - 1] !== ".") {
      rowString = rowString.split("");
      rowString[column - 1] = ".";
      rowString = rowString.join("");
    }
    
    // check if number matches any other
    return this.stringCheck(rowString, "row", value);
  }

  checkColPlacement(puzzleString, row, column, value) {

  }

  checkRegionPlacement(puzzleString, row, column, value) {

  }

  solve(puzzleString) {
    
  }
}

module.exports = SudokuSolver;

