'use strict'

const MINE = '💣'
const MARK = '🚩'
const LIVE = '💖'
var gBoard;
var elTimer = document.querySelector('.timer')
var gTimeIntervalId;
var gIsInterval = true

var gLevel = {
    SIZE: 4,
    MINES: 2,
    LIVES: 2
}
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

function init() {
    gBoard = buildBoard(gLevel.SIZE)
    renderBoard(gBoard)
    smileButtun('😀')
    setLives()
    var elModal = document.querySelector('.modal')
    elModal.style.display = 'none'
    gIsInterval = true
    gGame.isOn=true;
}


function buildBoard(size) {
    var board = []
    for (var i = 0; i < size; i++) {
        board[i] = []
        for (var j = 0; j < size; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
        }
    }
    console.log(board)
    return board;
}

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += `<tr>\n`;
        for (var j = 0; j < board[0].length; j++) {
            strHTML += `\t<td class="cell cell-${i}-${j}" onclick="clickOnCell(this,${i},${j})" oncontextmenu="addMark(event,${i},${j})" ><span></span>`
            strHTML += `\t</td>\n`;
        }
        strHTML += `</tr>\n`;
    }
    var elTable = document.querySelector('.board')
    elTable.innerHTML = strHTML;
}

function setMinesNegsCount(cellI, cellJ, mat) {
    var minesAroundCount = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= mat[i].length) continue;
            if (mat[i][j].isMine) minesAroundCount++;
        }
    }
    return minesAroundCount;
}

function clickOnCell(elBtn, i, j) {
    if(!gGame.isOn)return
    // expandNeighbors(i, j, gBoard)
    if (gIsInterval) {
        setTimer()
        setMinesNegsCount(i, j, gBoard)
        addMinesRand(gBoard)
        gIsInterval = false
    }
    var currCel = gBoard[i][j]
    elBtn.querySelector('.cell span').innerText = (currCel.isMine) ? `${MINE}` : `${setMinesNegsCount(i, j, gBoard)}`
    if (currCel.isMine) {
        gLevel.LIVES--
        setLives()
    } else {
        gGame.shownCount++
    }
    checkLose()
    checkVictory()
}

function addMinesRand() {
    for (var i = 0; i < gLevel.MINES; i++) {
        var randomI = getRandomInt(0, gBoard.length);
        var randomJ = getRandomInt(0, gBoard.length);
        addMine(randomI, randomJ);
    }
}

function addMine(i, j) {
    gBoard[i][j].isMine = true;
}

function setLevel(size, minesNum, livesNum) {
    gLevel.SIZE = size;
    gLevel.MINES = minesNum
    gLevel.LIVES = livesNum
    init()
    gIsInterval = true
}

function setTimer() {
    var startTime = Date.now()
    gTimeIntervalId = setInterval(function () {
        elTimer.innerText = Math.floor(((Date.now() - startTime) / 1000).toFixed(3))
    }, 1000)
}

function checkVictory() {
    var counter = 0;
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].isMine && gBoard[i][j].isMarked) {
                counter++;
            }
        }
    }
    if ((gLevel.LIVES > 0 || counter === gLevel.MINES) && (gLevel.SIZE ** 2 - gLevel.MINES) === gGame.shownCount) {
        console.log('hi')
        gameOver('You won')
        smileButtun('😎')
        clearInterval(gTimeIntervalId)
        gGame.isOn=false
    }
}


function checkLose() {
    var value;
    if (gLevel.LIVES === 0) {
        gameOver('You lose')
        smileButtun('🤯')
        for (var i = 0; i < gBoard.length; i++) {
            for (var j = 0; j < gBoard[0].length; j++) {
                if (gBoard[i][j].isMine) {
                    clearInterval(gTimeIntervalId)
                    gBoard[i][j].isShown = true
                    value = MINE
                    renderCell(i, j, value)
                    gGame.isOn=false
                }
            }
        }
    }
}


function addMark(ev, i, j) {
    ev.preventDefault()
    var value;
    var currCel = gBoard[i][j]
    if (!currCel.isMarked) {
        currCel.isMarked = true
        value = MARK
        gGame.markedCount++
    } else {
        currCel.isMarked = false
        value = (gBoard[i][j].isMine) ? MINE : gBoard[i][j].minesAroundCount
    }
    renderCell(i, j, value)
}

function gameOver(text) {
    var elModal = document.querySelector('.modal')
    elModal.style.display = 'block'
    var elSpan = elModal.querySelector('span')
    elSpan.innerText = text
}

function setLives() {
    var elSpan = document.querySelector('.lives span')
    elSpan.innerText = `💖: ${gLevel.LIVES}`
}

function smileButtun(img) {
    var elSmile = document.querySelector('.restart span')
    elSmile.innerText = img
}

function expandNeighbors(cellI, cellJ, mat) {
    var value;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= mat[i].length) continue;
            if (mat[i][j].isMine || mat[i][j].isMarked)continue;
            if (!mat[i][j].isMine) {
                gBoard.isShown = true
                value = gBoard[i][j].minesAroundCount
                renderCell(cellI, cellJ, value)
            }
        }
    }
}