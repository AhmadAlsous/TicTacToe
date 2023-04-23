$(function () {
  let level = 1;
  let game = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];
  let canClick = true;
  let mode = 1;
  let p = 1;
  let one = 0;
  let tie = 0;
  let two = 0;

  $('.fa-user-group').click(function () {
    mode = !mode;
    startOver();
    $(this).toggleClass('fa-user');
    $(this).toggleClass('fa-xl');
    $(this).toggleClass('fa-user-group');
    $(this).toggleClass('fa-lg');
    changeMode();
  });

  $('.sqr').click(function () {
    if (
      mode == 1 &&
      canClick &&
      $(this).find('p').attr('class') !== 'clicked'
    ) {
      let attribute = this.className;
      let row = attribute.slice(5, 6);
      let col = attribute.slice(8, 9);
      game[row][col] = char(level);
      $(this).find('p').addClass('clicked');
      $(this).find('p').text(char(level));
      announceWinner();
    }
  });

  $('.sqr').click(function () {
    if (
      mode == 0 &&
      canClick &&
      $(this).find('p').attr('class') !== 'clicked'
    ) {
      let attribute = this.className;
      let row = attribute.slice(5, 6);
      let col = attribute.slice(8, 9);
      game[row][col] = 'X';
      $(this).find('p').addClass('clicked');
      $(this).find('p').text('X');
      if (level < 5) nextTurn();
      else {
        if (showWinner() == 0) nextTurn();
        else {
          changeScore('X');
          playAgain();
          return;
        }
      }
      setTimeout(function () {
        let randomRow = Math.floor(Math.random() * 3);
        let randomCol = Math.floor(Math.random() * 3);
        while (!validPos(randomRow, randomCol)) {
          randomRow = Math.floor(Math.random() * 3);
          randomCol = Math.floor(Math.random() * 3);
        }
        game[randomRow][randomCol] = 'O';
        $('.r' + randomRow + '.c' + randomCol)
          .find('p')
          .addClass('clicked');
        $('.r' + randomRow + '.c' + randomCol)
          .find('p')
          .text('O');
      }, 500);
      if (level < 5) nextTurn();
      else {
        if (showWinner() == 0) nextTurn();
        else {
          changeScore('O');
          playAgain();
        }
      }
    }
  });

  function nextTurn() {
    canClick = true;
    if (level < 9) level++;
    else {
      tie++;
      $('.score.tie').text(tie);
      playAgain();
    }
    if (mode == 1) {
      $('.' + char(level)).css('font-weight', '700');
      $('.' + char(level + 1)).css('font-weight', '100');
    }
  }

  function validPos(row, col) {
    return game[row][col] === 0;
  }

  function changeMode() {
    if (p % 2 == 1) {
      $('.second').text('COMPUTER (O)');
      $('h6').text('1 PLAYER');
    } else {
      $('.second').text('PLAYER 2 (O)');
      $('h6').text('2 PLAYERS');
    }
    p++;
  }

  function changeScore(winner) {
    let change;
    if (winner === 'X') {
      one++;
      change = one;
    } else {
      two++;
      change = two;
    }
    $('.score.' + winner).text(change);
  }

  function playAgain() {
    canClick = false;
    level = 0;
    game = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
    setTimeout(function () {
      $(document).one('click', function () {
        $('.sqr').find('p').removeClass('clicked');
        nextTurn();
      });
    }, 100);
  }

  function startOver() {
    level = 0;
    game = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
    one = -1;
    tie = 0;
    two = -1;
    changeScore('X');
    changeScore('O');
    $('.score.tie').text('0');
    $('.sqr').find('p').removeClass('clicked');
    nextTurn();
  }

  function char(level) {
    if (level % 2 === 1) return 'X';
    return 'O';
  }

  function showWinner() {
    let winner = 0;
    let winRow = 0;
    let sum1, sum2;
    for (let i = 0; i < 3; i++) {
      sum1 = game[i][0] + game[i][1] + game[i][2];
      sum2 = game[0][i] + game[1][i] + game[2][i];
      if (sum1 == 'XXX' || sum1 == 'OOO') {
        winner = char(level);
        winRow = i + 1;
      }
      if (sum2 == 'XXX' || sum2 == 'OOO') {
        winner = char(level);
        winRow = i + 4;
      }
    }
    let sum3 = game[0][0] + game[1][1] + game[2][2];
    let sum4 = game[0][2] + game[1][1] + game[2][0];
    if (sum3 == 'XXX' || sum1 == 'OOO') {
      winner = char(level);
      winRow = 7;
    }
    if (sum4 == 'XXX' || sum4 == 'OOO') {
      winner = char(level);
      winRow = 8;
    }
    console.log(sum1);
    console.log(sum2);
    console.log(sum3);
    console.log(sum4);
    return winner;
  }
  function announceWinner() {
    if (level < 5) nextTurn();
    else {
      if (showWinner() == 0) nextTurn();
      else {
        changeScore(showWinner());
        playAgain();
      }
    }
  }

  function aiWinner() {
    if (level < 5) {
      nextTurn();
    } else if (level >= 5 && level < 9) {
      if (showWinner() == 0) nextTurn();
      else {
        changeScore(showWinner());
        playAgain();
      }
    } else {
      if (showWinner() == 0) {
        tie++;
        $('.score.tie').text(tie);
        playAgain();
      } else {
        changeScore(showWinner());
        playAgain();
      }
    }
  }
});
