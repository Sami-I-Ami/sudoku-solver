class SudokuSolver {

  // added functions
  // convert row letter to number
  rowLetterToNumber(row) {
    const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
    return rows.findIndex((rowLabel) => rowLabel === row);
  }

  // finding strings (need to repeat for solving)
  findRow(puzzleString, rowNum) {
    const startNum = rowNum * 9;
    return puzzleString.slice(startNum, startNum + 9);
  }

  findCol(puzzleString, column) {
    let colString = "";
    for (let i = column - 1; colString.length < 9; i += 9) {
      colString += puzzleString[i];
    }
    return colString;
  }

  findRegion(puzzleString, rowNum, column) {
    const regionSeparators = [[0, 1, 2], [3, 4, 5], [6, 7, 8]];
    const rowRegion = regionSeparators.find((group) => group.includes(rowNum));
    const colRegion = regionSeparators.find((group) => group.includes(column - 1));
    const startNum = rowRegion[0] * 9 + colRegion[0];
    let regionString = "";
    for (let i = startNum; regionString.length < 9; i += 9) {
      regionString += puzzleString.slice(i, i + 3);
    }
    return [regionString, rowRegion, colRegion];
  }

  // replace coordinate
  replaceCoordinate(string, index, replacement) {
    string = string.split("");
    string[index] = replacement;
    return string.join("");
  }

  // tests if value will not invalidate string for zone
  stringCheck(zoneString, zone, value) {
    const numRegex = /[0-9]+/g;
    const numString = zoneString.match(numRegex).join("");
    for (let i = 0; i < numString.length; i++) {
      // invalid
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
    // convert row to number
    const rowNum = this.rowLetterToNumber(row);

    // find row
    let rowString = this.findRow(puzzleString, rowNum);

    // remove from list if num is already in coordinate (for checks only)
    if (rowString[column - 1] !== ".") {
      rowString = this.replaceCoordinate(rowString, column - 1, ".");
    }

    // check if number matches any other
    return this.stringCheck(rowString, "row", value);
  }

  checkColPlacement(puzzleString, row, column, value) {
    // convert row to number
    const rowNum = this.rowLetterToNumber(row);

    // find column
    let colString = this.findCol(puzzleString, column);
    
    // remove from list if num is already in coordinate (for checks only)
    if (colString[rowNum] !== ".") {
      colString = this.replaceCoordinate(colString, rowNum, ".");
    }

    // check if number matches any other
    return this.stringCheck(colString, "column", value);
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    // convert row to number
    const rowNum = this.rowLetterToNumber(row);

    // find region
    const fullReturn = this.findRegion(puzzleString, rowNum, column);
    let regionString = fullReturn[0]
    
    // remove from list if num is already in coordinate (for checks only)
    const rowRegion = fullReturn[1];
    const colRegion = fullReturn[2];
    const rowIndex = rowRegion.indexOf(rowNum);
    const colIndex = colRegion.indexOf(column - 1);
    if (regionString[rowIndex * 3 + colIndex] !== ".") {
      regionString = this.replaceCoordinate(regionString, rowIndex * 3 + colIndex, ".");
    }
    

    // check if number matches any other
    return this.stringCheck(regionString, "region", value);
  }

  solve(puzzleArr) {
    // change to string
    let puzzleString = puzzleArr.join("");

    // find zone with most elements that is still missing an element
    const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
    const columns = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const regions = [["A", 1], ["A", 4], ["A", 7], ["D", 1], ["D", 4], ["D", 7], ["G", 1], ["G", 4], ["G", 7]];
    
    const numRegex = /[0-9]+/g;

    let longestString = "";
    let longestLength = -1;
    let longestZone = "";
    let longestIndex = -1;

    for (let i = 0; i < rows.length; i++) { // rows
      const rowNum = this.rowLetterToNumber(rows[i]);
      const rowString = this.findRow(puzzleString, rowNum);
      const numString = rowString.match(numRegex).join("");
      if (numString.length > longestLength & numString.length !== 9) {
        longestLength = numString.length;
        longestString = rowString;
        longestZone = "row";
        longestIndex = i;
      }
    }

    if (longestLength !== 8) { //skip if we are already at longest possible length
      for (let i = 0; i < columns.length; i++) { // columns
        const colString = this.findCol(puzzleString, columns[i]);
        const numString = colString.match(numRegex).join("");
        if (numString.length > longestLength & numString.length !== 9) {
          longestLength = numString.length;
          longestString = colString;
          longestZone = "column";
          longestIndex = i;
        }
      }
    }

    if (longestLength !== 8) { //skip if we are already at longest possible length
      for (let i = 0; i < regions.length; i++) { // regions
        const rowNum = this.rowLetterToNumber(regions[i][0]);
        const regionString = this.findRegion(puzzleString, rowNum, regions[i][1])[0];
        const numString = regionString.match(numRegex).join("");
        if (numString.length > longestLength & numString.length !== 9) {
          longestLength = numString.length;
          longestString = regionString;
          longestZone = "region";
          longestIndex = i;
        }
      }
    }

    // check if full
    if (longestLength === -1) {
      return true;
    }

    // get coordinate of first missing number
    const numIndex = longestString.indexOf(".");
    let row = -1;
    let column = 1;
    switch (longestZone) {
      case "row":
        row = rows[longestIndex];
        column = columns[numIndex];
        break;
      case "column":
        row = rows[numIndex];
        column = columns[longestIndex];
        break;
      case "region":
        const rowNum = this.rowLetterToNumber(regions[longestIndex][0]);
        row = rows[Math.floor(numIndex / 3) + rowNum];
        column = numIndex % 3 + regions[longestIndex][1];
        break;
    }

    // check with each number
    for (let num = 1; num <= 9; num++) {
      if (
        this.checkRowPlacement(puzzleString, row, column, num)[0]
        & this.checkColPlacement(puzzleString, row, column, num)[0]
        & this.checkRegionPlacement(puzzleString, row, column, num)[0]
      ) {
        // put it in
        puzzleArr[this.rowLetterToNumber(row) * 9 + column - 1] = num.toString();

        // check if solved
        if (this.solve(puzzleArr)) {
          return true;
        } else {
          // take it out
          puzzleArr[this.rowLetterToNumber(row) * 9 + column - 1] = ".";
        }
      }
    }

    // return false if no number fits
    return false;
  }

}

module.exports = SudokuSolver;

