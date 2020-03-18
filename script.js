window.onload = function() {
    var activeColor = 'white';
    var activeChecker;
    var shouldBeat = false;

    //Расставляем черых
    for (var i = 1; i < 4; i++) {
        for (var j = 1; j < 9; j++) {
            if (!((j - i) % 2 == 0)) {
                var square = document.querySelector("tr.row_" + i + " > td.col_" + j);
                square.innerHTML = '<div class="black" data-row=' + i + ' data-col=' + j + ' data-queen="false"></div>';
                square.dataset.color = 'black';
            }
        }
    }

    //Расставляем белых
    for (var i = 6; i < 9; i++) {
        for (var j = 1; j < 9; j++) {
            if (!((j - i) % 2 == 0)) {
                var square = document.querySelector("tr.row_" + i + " > td.col_" + j);
                square.innerHTML = '<div class="white" data-row=' + i + ' data-col=' + j + ' data-queen="false"></div>';
                square.dataset.color = 'white';
            }
        }
    }

    //Обновляем состояние доски и шашек
    function update() {
        activeChecker = NaN;
        for (var i = 1; i < 9; i++) {
            for (var j = 1; j < 9; j++) {
                if (!((j - i) % 2 == 0)) {
                    let square = document.querySelector("tr.row_" + i + " > td.col_" + j);
                    square.style.backgroundColor = '';
                    square.dataset.active = false;
                    square.dataset.canWalk = false;
                    if (square.dataset.color == 'white' || square.dataset.color == 'black') {
                        checker = square.childNodes[0];
                        checker.dataset.col = j;
                        checker.dataset.row = i;
                    }
                }
            }
        }
    }

    //Проверяем может ли шашка побить вражескую шашку по указанной диагонали
    function checkToBeat(row, col, x, y, enemyColor, canWalkOption = true) {
        var element = document.querySelector("tr.row_" + row + " > td.col_" + col);
        var queen = element.children[0].dataset.queen == 'true';
        var canBeat = false;
        var wayLength = queen ? 8 : 2;
        for (var i = 1; i < wayLength; i++) {
            var square = document.querySelector("tr.row_" + (row + x * i) + " > td.col_" + (col + y * i));
            if (0 < row + (x * i) && row + (x * i) < 9 && 0 < col + (y * i) && col + (y * i) < 9) {
                if (square.dataset.color == enemyColor) {
                    square = document.querySelector("tr.row_" + (row + (x * (i + 1))) + " > td.col_" + (col + (y * (i + 1))));
                    if (0 < row + (x * (i + 1)) && row + (x * (i + 1)) < 9 && 0 < col + (y * (i + 1)) && col + (y * (i + 1)) < 9 && !square.dataset.color) {
                        if (canWalkOption) {
                            square.dataset.canWalk = true;
                        }
                        element.style.backgroundColor = 'green';
                        square.style.backgroundColor = 'green';
                        shouldBeat = true;
                        canBeat = true;
                    } else {
                        break;
                    }
                } else if (square.dataset.color == activeColor) {
                    break;
                } else if (canBeat && !square.dataset.color) {
                    if (canWalkOption) {
                        square.dataset.canWalk = true;
                    }
                    square.style.backgroundColor = 'green';
                }

            }
        }
    }

    //Проверка,что шашка может походить по указанной диагонали
    function checkToMove(row, col, x, y) {
        var element = document.querySelector("tr.row_" + row + " > td.col_" + col);
        var queen = element.children[0].dataset.queen == 'true';
        var wayLength = queen ? 8 : 2;
        for (var i = 1; i < wayLength; i++) {
            var square = document.querySelector("tr.row_" + (row + x * i) + " > td.col_" + (col + y * i));
            if (0 < row + (x * i) && row + (x * i) < 9 && 0 < col + (y * i) && col + (y * i) < 9 && !square.dataset.color) {
                square.dataset.canWalk = true;
                element.style.backgroundColor = 'green';
                square.style.backgroundColor = 'green';
                element.dataset.active = true;
            }
        }
    }

    //Проверяем, нужно ли совершить бой для шашек активного цвета
    function checkToShouldBeat() {
        var enemyColor = activeColor == 'white' ? 'black' : 'white';
        for (var i = 1; i < 9; i++) {
            for (var j = 1; j < 9; j++) {
                var element = document.querySelector("tr.row_" + i + " > td.col_" + j);
                if (element.dataset.color == activeColor) {
                    checkToBeat(i, j, -1, -1, enemyColor, false);
                    checkToBeat(i, j, -1, +1, enemyColor, false);
                    checkToBeat(i, j, +1, +1, enemyColor, false);
                    checkToBeat(i, j, +1, -1, enemyColor, false);
                }
            }
        }
    }

    //Показывает возможные ходы для выбранной шашки
    function showPossibleMoves(checker) {
        var row = parseInt(checker.dataset.row);
        var col = parseInt(checker.dataset.col);
        var queen = checker.dataset.queen == 'true';
        var enemyColor = activeColor == 'white' ? 'black' : 'white';
        var element = document.querySelector("tr.row_" + row + " > td.col_" + col);
        checkToBeat(row, col, -1, -1, enemyColor);
        checkToBeat(row, col, -1, +1, enemyColor);
        checkToBeat(row, col, +1, +1, enemyColor);
        checkToBeat(row, col, +1, -1, enemyColor);
        if (shouldBeat) {
            activeChecker = element;
            element.dataset.active = true;
        } else {
            if (element.dataset.color == activeColor) {
                var queen = element.children[0].dataset.queen == 'true';
                if (activeColor == 'white' || queen) {
                    checkToMove(row, col, -1, -1);
                    checkToMove(row, col, -1, +1);
                }
                if (activeColor == 'black' || queen) {
                    checkToMove(row, col, +1, +1);
                    checkToMove(row, col, +1, -1);
                }
                activeChecker = element;
            }
        }
    }

    //Забираем побитую шашку
    function beat(x, y, x_before, y_before) {
        count = x_before - x;
        axis_x = x_before - x < 0 ? -1 : 1;
        axis_y = y_before - y < 0 ? -1 : 1;
        for (var i = 0; i < Math.abs(count) - 1; i++) {
            x += axis_x;
            y += axis_y;
            console.log(x, y);
            element = document.querySelector("tr.row_" + y + " > td.col_" + x);
            element.innerHTML = '';
            element.dataset.color = '';
        }
    }

    //Двигаем шашку
    function move(element) {
        element.innerHTML = activeChecker.innerHTML;
        activeChecker.innerHTML = '';
        activeChecker.dataset.color = '';
        element.dataset.color = activeColor;
        if (element.dataset.color == "white" && y_before == 1) {
            var checker = element.children[0];
            checker.dataset.queen = true;
            checker.style.backgroundColor = '#FFF8DC';

        } else if (element.dataset.color == "black" && y_before == 8) {
            var checker = element.children[0];
            checker.dataset.queen = true;
            checker.style.backgroundColor = '#2F4F4F';
        }
        if (shouldBeat) {
            x_after = parseInt(element.children[0].dataset.col);
            y_after = parseInt(element.children[0].dataset.row);
            update();
            x_before = parseInt(element.children[0].dataset.col);
            y_before = parseInt(element.children[0].dataset.row);
            beat(x_after, y_after, x_before, y_before);
            shouldBeat = false;
            checkToShouldBeat();
            if (!shouldBeat) {
                activeColor = activeColor == 'white' ? 'black' : 'white';
            }
        } else {
            activeColor = activeColor == 'white' ? 'black' : 'white';
        }
        update();
    }

    //Отслеживаем событие клика на шашку активного цвета на поле
    document.querySelector('.checkers').addEventListener('click', function() {
        if (event.target.className == activeColor) {
            update();
            showPossibleMoves(event.target);
        } else if (event.target.dataset.canWalk == 'true') {
            move(event.target);
            checkToShouldBeat();
        }
    });
};