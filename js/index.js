let Queen = 1;
let Empty = 0;

function makeArray(rows, cols) {
    let rowss = [];
    for (let row = 0; row < rows; row++) {
        let oneRow = [];
        for (let col = 0; col < cols; col++)
            oneRow[col] = Empty;
        rowss[row] = oneRow;
    }
    return rowss;
}

function initialModel() {
    let board = makeArray(8, 8);
    let topLeft = {row:0, col:0};
    return {
        position: topLeft,
        board: board,
        memory: [],
        solved: false
    };
}


function next (position) {
    if (position.col < 7)
        return {row : position.row, col : position.col + 1};
    else
        return {row : position.row + 1, col : 0};
}


function attacksFromAbove(pos1, pos2, board) {
    let hasAQueen  = board[pos1.row][pos1.col] === Queen;
    let sameColumn = pos1.col === pos2.col;
    let onDiagonal = (Math.abs(pos1.row - pos2.row)) ===
        (Math.abs(pos1.col - pos2.col));
    return (hasAQueen && (sameColumn || onDiagonal));
}

function isAttacked(position, board) {
    for (let row = 0; row < position.row; row++)
        for (let col = 0; col < board[0].length; col++) {
            let pos = {row:row, col:col};
            if (attacksFromAbove(pos, position, board))
                return true;
        }
    return false;
}


function makeSquare(model, row, col) {
    let div = document.createElement("div");
    div.className = "inner";
    div.style.background = ((row + col) % 2) === 0 ? "#d0d0d0" : "#7F7F7F";
    if (model.board[row][col] === Queen)
        div.style.backgroundImage="url(../images/crown.png)";
    return div;
}


function view(model) {
    let main = document.createElement('div');
    main.className = "main";
    for(let row = 0; row < 8; row++)
        for(let col = 0; col < 8; col++) {
            let square = makeSquare(model, row, col);
            main.appendChild(square);
        }
    return main;
}

function p2s(position) {
    return "(" + position.row + ", " + position.col + ")";
}

function update (model) {
    let board = model.board;
    let memory = model.memory;

    let solve = function (position) {
        if (position.row === 8) {
            model.solved = true;
            return model;
        }
        if (isAttacked(position, board)) {
            if (position.col < 7) {
                position.col = position.col + 1;
                return solve(position);
            }
            else
                return backTrack(model);
        }
        else {
            board[position.row][position.col] = Queen;
            console.log("settled on:" + p2s(position));
            memory.push(position);
            model.position = {row:position.row + 1, col:0};
            return model;
        }
    }

    let backTrack = function (model) {
        if (model.memory === []) {
            console.log("queens: there is no solution.\n");
            throw 0;
        }
        else {
            let formerPos = model.memory.pop();
            model.board[formerPos.row][formerPos.col] = Empty;
            if (formerPos.col === 7)
                return backTrack(model);       // keep popping ...
            else
                return solve(next(formerPos));
        }
    }
    return solve(model.position);
}


function start(app) {
    let model = initialModel();
    let interval = setInterval(function () {
        if (app.done(model)) {
            clearInterval(interval);
            return 0;
        }
        else {
            let element = app.view(model);
            let main = document.getElementsByClassName('main')[0];
            document.body.removeChild(main);
            document.body.appendChild(element);
            model = app.update(model);
        }
    }, app.interval);
}

function launch(app) {
    document.body.addEventListener("click",
        function () { start(app); });
}

let queens =
    {
        view: view,
        update: update,
        done: (model => model.solved),
        interval : 100
    }

function go () { launch(queens); }
