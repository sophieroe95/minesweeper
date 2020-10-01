"use strict";

// insert 10 times bomb random function
// insert numbers - 3 is 3 adjaccent, 2 if 2 adjacent, 1 if 1, grey if 0
// if click on bomb, reveal all bombs, end game - you lost pop up, play again option
// if 3,2,1 or 0, reveal square
// game ends when all grey space has been identified or all flags in correct position - you win popup
// //to ask sam how to do function so they are relative to each other?
// var minutesLabel = document.getElementById("minutes");
// var secondsLabel = document.getElementById("seconds");
// var totalSeconds = 0;
// setInterval(setTime, 1000);
// function setTime() {
//   ++totalSeconds;
//   secondsLabel.innerHTML = pad(totalSeconds % 60);
//   minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
// }
// function pad(val) {
//   var valString = val + "";
//   if (valString.length < 2) {
//     return "0" + valString;
//   } else {
//     return valString;
//   }
// }
// const placeBombs ()
// forEach 
// index id 0-99
// check neighbours +1,-1,-11,-10,-9
// class bomb
// push into array 
document.addEventListener('DOMContentLoaded', function () {
  var timeLeftDisplay = document.querySelector('#time-left');
  var startBtn = document.querySelector('#start-button');
  timeLeft = 500;
  var grid = document.querySelector('.grid');
  var flagsLeft = document.querySelector('#flags-left');
  var result = document.querySelector('#result');
  var width = 10;
  var bombAmount = 10;
  var flags = 0;
  var squares = [];
  var isGameOver = false;

  function countDown() {
    setInterval(function () {
      if (timeLeft <= 0) {
        clearInterval(timeLeft = 0);
      }

      timeLeftDisplay.innerHTML = timeLeft;
      timeLeft -= 1;
    }, 1000);
  }

  startBtn.addEventListener('click', countDown); //create Board

  function createBoard() {
    flagsLeft.innerHTML = bombAmount; //get shuffled game array with random bombs

    var bombsArray = Array(bombAmount).fill('bomb');
    var emptyArray = Array(width * width - bombAmount).fill('valid');
    var gameArray = emptyArray.concat(bombsArray);
    var shuffledArray = gameArray.sort(function () {
      return Math.random() - 0.5;
    });

    var _loop = function _loop(i) {
      var square = document.createElement('div');
      square.setAttribute('id', i);
      square.classList.add(shuffledArray[i]);
      grid.appendChild(square);
      squares.push(square); //normal click

      square.addEventListener('click', function (e) {
        click(square);
      }); //cntrl and left click

      square.oncontextmenu = function (e) {
        e.preventDefault();
        addFlag(square);
      };
    };

    for (var i = 0; i < width * width; i++) {
      _loop(i);
    } //add numbers


    for (var _i = 0; _i < squares.length; _i++) {
      var total = 0;
      var isLeftEdge = _i % width === 0;
      var isRightEdge = _i % width === width - 1;

      if (squares[_i].classList.contains('valid')) {
        // west, north-east, north, north-west, east, south-west,south-east, south
        if (_i > 0 && !isLeftEdge && squares[_i - 1].classList.contains('bomb')) total++;
        if (_i > 9 && !isRightEdge && squares[_i + 1 - width].classList.contains('bomb')) total++;
        if (_i > 10 && squares[_i - width].classList.contains('bomb')) total++;
        if (_i > 11 && !isLeftEdge && squares[_i - 1 - width].classList.contains('bomb')) total++;
        if (_i < 98 && !isRightEdge && squares[_i + 1].classList.contains('bomb')) total++;
        if (_i < 90 && !isLeftEdge && squares[_i - 1 + width].classList.contains('bomb')) total++;
        if (_i < 88 && !isRightEdge && squares[_i + 1 + width].classList.contains('bomb')) total++;
        if (_i < 89 && squares[_i + width].classList.contains('bomb')) total++;

        squares[_i].setAttribute('data', total);
      }
    }
  }

  createBoard(); //add Flag with right click

  function addFlag(square) {
    if (isGameOver) return;

    if (!square.classList.contains('checked') && flags < bombAmount) {
      if (!square.classList.contains('flag')) {
        square.classList.add('flag');
        square.innerHTML = ' 🚩';
        flags++;
        flagsLeft.innerHTML = bombAmount - flags;
        checkForWin();
      } else {
        square.classList.remove('flag');
        square.innerHTML = '';
        flags--;
        flagsLeft.innerHTML = bombAmount - flags;
      }
    }
  } //click on square actions


  function click(square) {
    var currentId = square.id;
    if (isGameOver) return;
    if (square.classList.contains('checked') || square.classList.contains('flag')) return;

    if (square.classList.contains('bomb')) {
      gameOver(square);
    } else {
      var total = square.getAttribute('data');

      if (total != 0) {
        square.classList.add('checked');
        if (total == 1) square.classList.add('one');
        if (total == 2) square.classList.add('two');
        if (total == 3) square.classList.add('three');
        if (total == 4) square.classList.add('four');
        square.innerHTML = total;
        return;
      }

      checkSquare(square, currentId);
    }

    square.classList.add('checked');
  } //check neighboring squares once square is clicked


  function checkSquare(square, currentId) {
    var isLeftEdge = currentId % width === 0;
    var isRightEdge = currentId % width === width - 1;
    setTimeout(function () {
      if (currentId > 0 && !isLeftEdge) {
        var newId = squares[parseInt(currentId) - 1].id; //const newId = parseInt(currentId) - 1   ....refactor

        var newSquare = document.getElementById(newId);
        click(newSquare);
      }

      if (currentId > 9 && !isRightEdge) {
        var _newId = squares[parseInt(currentId) + 1 - width].id; //const newId = parseInt(currentId) +1 -width   ....refactor

        var _newSquare = document.getElementById(_newId);

        click(_newSquare);
      }

      if (currentId > 10) {
        var _newId2 = squares[parseInt(currentId - width)].id; //const newId = parseInt(currentId) -width   ....refactor

        var _newSquare2 = document.getElementById(_newId2);

        click(_newSquare2);
      }

      if (currentId > 11 && !isLeftEdge) {
        var _newId3 = squares[parseInt(currentId) - 1 - width].id; //const newId = parseInt(currentId) -1 -width   ....refactor

        var _newSquare3 = document.getElementById(_newId3);

        click(_newSquare3);
      }

      if (currentId < 98 && !isRightEdge) {
        var _newId4 = squares[parseInt(currentId) + 1].id; //const newId = parseInt(currentId) +1   ....refactor

        var _newSquare4 = document.getElementById(_newId4);

        click(_newSquare4);
      }

      if (currentId < 90 && !isLeftEdge) {
        var _newId5 = squares[parseInt(currentId) - 1 + width].id; //const newId = parseInt(currentId) -1 +width   ....refactor

        var _newSquare5 = document.getElementById(_newId5);

        click(_newSquare5);
      }

      if (currentId < 88 && !isRightEdge) {
        var _newId6 = squares[parseInt(currentId) + 1 + width].id; //const newId = parseInt(currentId) +1 +width   ....refactor

        var _newSquare6 = document.getElementById(_newId6);

        click(_newSquare6);
      }

      if (currentId < 89) {
        var _newId7 = squares[parseInt(currentId) + width].id; //const newId = parseInt(currentId) +width   ....refactor

        var _newSquare7 = document.getElementById(_newId7);

        click(_newSquare7);
      }
    }, 10);
  } //game over


  function gameOver(square) {
    result.innerHTML = 'BOOM! Game Over!';
    isGameOver = true; //show ALL the bombs

    squares.forEach(function (square) {
      if (square.classList.contains('bomb')) {
        square.innerHTML = '💣';
        square.classList.remove('bomb');
        square.classList.add('checked');
      }
    });
  } //check for win


  function checkForWin() {
    ///simplified win argument
    var matches = 0;

    for (var i = 0; i < squares.length; i++) {
      if (squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')) {
        matches++;
      }

      if (matches === bombAmount) {
        result.innerHTML = 'YOU WIN!';
        isGameOver = true;
      }
    }
  }
});