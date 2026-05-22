const numList = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const suitList = ["♠", "♦", "♥", "♣"];
let cardList = [];
let player = [];
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
    document.getElementById("dealer").innerText = "카드를 뽑아 시작하세요";
    document.getElementById("player").innerText = "카드를 뽑아 시작하세요";
}

function draw(object) {
    if (state === "ended") return;
    let n = Math.floor(Math.random() * 13);
    let m = Math.floor(Math.random() * 4);
    while (cardList.indexOf(numList[n] + suitList[m]) !== -1) { //무한반복 방지할 것 만들어야 함
        n = Math.floor(Math.random() * 13);
        m = Math.floor(Math.random() * 4);
    }
    object.push(numList[n] + suitList[m]);
    cardList.push(numList[n] + suitList[m]);
    switch (mode) {
        case "blackjack":
            blackjack(object);
            break;
    }
}

function blackjack(object) {
    document.getElementById("dealer").innerText = dealer;
    document.getElementById("player").innerText = player;
    let sum = 0;
    object.forEach((n) => sum += numChange(n));
    if (object === player) {
        if (sum > 21) {
            document.getElementById("dealer").innerText = "버스트! 딜러가 승리하였습니다";
            state = "ended";
        } else if(sum === 21) {
            document.getElementById("dealer").innerText = "BLACKJACK!";
            state = "ended";
        }
        return sum;
    }   
}
function numChange(n) { //로마자 카드 숫자로 바꾸는 것. 추후에 A를 경우에 따라 1 또는 14로 바꾸는 기능 만들어야 함
    switch (n[0]) {
        case "A":
            return 11;
        case "J":
        case "Q":
        case "K":
            return 10;
        default:
            return Number(n.replace(n[n.length - 1], ''));
    }
}