class SudokuSolver {

  // added functions
  // convert row letter to number
  rowLetterToNumber(row) {
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
  return rows.findIndex((rowLabel) => rowLabel === row);
  }

  // remove number if checking coordinate
  replaceCoordinate(string, index) {
    string = string.split("");
    string[index] = ".";
    return string.join("");
  }

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
      rowString = this.replaceCoordinate(rowString, column - 1);
    }

    // check if number matches any other
    return this.stringCheck(rowString, "row", value);
  }

  checkColPlacement(puzzleString, row, column, value) {
    // convert row to number
    const rowNum = this.rowLetterToNumber(row);

    // find column
    let colString = "";
    for (let i = column - 1; colString.length < 9; i += 9) {
      colString += puzzleString[i];
    }
    
    // remove from list if num is already in coordinate (for checks only)
    if (colString[rowNum] !== ".") {
      colString = this.replaceCoordinate(colString, rowNum);
    }

    // check if number matches any other
    return this.stringCheck(colString, "column", value);
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    // convert row to number
    const rowNum = this.rowLetterToNumber(row);

    // find region
    const regionSeparators = [[0, 1, 2], [3, 4, 5], [6, 7, 8]];
    const rowRegion = regionSeparators.find((group) => group.includes(rowNum));
    const colRegion = regionSeparators.find((group) => group.includes(column - 1));
    const startNum = rowRegion[0] * 9 + colRegion[0];
    let regionString = "";
    for (let i = startNum; regionString.length < 9; i += 9) {
      regionString += puzzleString.slice(i, i + 3);
    }
    
    // remove from list if num is already in coordinate (for checks only)
    const rowIndex = rowRegion.indexOf(rowNum);
    const colIndex = colRegion.indexOf(column - 1);
    if (regionString[rowIndex * 3 + colIndex] !== ".") {
      regionString = this.replaceCoordinate(regionString, rowIndex * 3 + colIndex);
    }
    

    // check if number matches any other
    return this.stringCheck(regionString, "region", value);
  }

  solve(puzzleString) {
    
  }
}

module.exports = SudokuSolver;

