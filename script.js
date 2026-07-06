const numList = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const suitList = ["♠", "♦", "♥", "♣"];
let cardList = [];
let player = [];
let sumP = 0;
let dealer = [];
let mode = "main";
let state = "ready";
const game = document.getElementsByClassName("game");

function modeChange(input) {
    document.getElementById(mode).style.display = "none";
    mode = input;
    document.getElementById(mode).style.display = "block";
    reset();
}
function reset() { //게임 끝난 후 모드 변경 없이 리셋 때 필요
    player = [];
    dealer = [];
    cardList = [];
    state = "ready";
    sumP = 0;

    document.getElementById("dealer").innerText = "";
    document.getElementById("player").innerText = "";
    document.getElementById("textbox").innerText = "카드를 뽑아 시작하세요";

    document.getElementById("newgame").style.display = "none";
    switch (mode) {
        case "blackjack":
            document.getElementById("bj_draw").style.display = "inline-block";
            document.getElementById("bj_stop").style.display = "inline-block";
    }
}

function end() {
    switch (mode) {
        case "blackjack":
            document.getElementById("bj_draw").style.display = "none";
            document.getElementById("bj_stop").style.display = "none";
    }
    document.getElementById("newgame").style.display = "inline-block";
    state = "ended";
}

function draw(array) {
    if (state === "ended") return;
    let n = Math.floor(Math.random() * 13);
    let m = Math.floor(Math.random() * 4);
    while (cardList.indexOf(numList[n] + suitList[m]) !== -1) { //무한반복 방지할 것 만들어야 함
        n = Math.floor(Math.random() * 13);
        m = Math.floor(Math.random() * 4);
    }
    array.push(numList[n] + suitList[m]);
    cardList.push(numList[n] + suitList[m]);
    switch (mode) {
        case "blackjack":
            if (player[0] === array[0]) blackjack(array, "player", numList[n] + suitList[m]);
            else blackjack(array, "dealer", numList[n] + suitList[m]);
            break;
    }
}

function blackjack(array, arrayName, card) {
    switch (card[card.length - 1]) {
        case "♦":
        case "♥":
            document.getElementById(arrayName).innerHTML += `<div class="card" style="color: red">${card}</div>`;
            break;
        default:
            document.getElementById(arrayName).innerHTML += `<div class="card">${card}</div>`
            break;
    }
    const textbox = document.getElementById("textbox")
    textbox.innerText = "";
    let num = [];
    let sum = 0;
    num = array.map((n) => numChange(n));
    sum = num.reduce((n, m) => n + m);
    while (Math.max(...num) === 11 && sum > 21) {
        num[num.indexOf(11)] = 1;
        sum -= 10;
    }
    if (array === player) {
        if (sum > 21) {
            textbox.innerText = "버스트! 딜러가 승리하였습니다";
            end();
        } else if(sum === 21) {
            textbox.innerText = "BLACKJACK!";
            end();
        }
        sumP = sum;
    } else {
        if (sum < 17) draw(dealer);
        else if (sum <= 21) {
            if (sum > sumP) textbox.innerText = `${sum} : ${sumP}으로 딜러가 승리하였습니다`;
            else if (sum === sumP) textbox.innerText = `${sum} : ${sumP}으로 무승부 처리되었습니다`;
            else textbox.innerText = `${sum} : ${sumP}으로 승리하였습니다`;
            end();
        } else {
            textbox.innerText = "딜러 버스트! 승리하였습니다";
            end();
        }
    }
    return [num, sum];
}
function numChange(n) { //로마자 카드 숫자로 바꾸는 것.
    switch (mode) {
        case "blackjack":
            switch (n[0]) {
                case "A":
                    return 11;
                case "1":
                case "J":
                case "Q":
                case "K":
                    return 10;
                default:
                    return Number(n[0]);
            }
    }
}