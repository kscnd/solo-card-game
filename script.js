const numList = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const suitList = ["♠", "♦", "♥", "♣"];
let player = [];
let dealer = [];

function reset() {
    player = [];
    dealer = [];
}

function draw(object) {
    let n = Math.floor(Math.random() * 13);
    let m = Math.floor(Math.random() * 4);
    while (player.indexOf(numList[n] + suitList[m]) !== -1 && dealer.indexOf(numList[n] + suitList[m]) !== -1) {
        n = Math.floor(Math.random() * 13);
        m = Math.floor(Math.random() * 4);
    }
    object.push(numList[n] + suitList[m]);
}