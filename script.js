/* 플레이어는 게임을 시작할 때 플레이어 이름으로 된 배열을 만들어야 함. 
만약 플레이어 이름이 abc라면 abc = ["abc"] 와 같이 입력해야 함.
*/
let cardList = [];
function reset() {
    cardList = [];
    for (let i = 0; i < 4; i++) cardList.push(Array(14));
    cardList[0][0] = "♠";
    cardList[1][0] = "♦";
    cardList[2][0] = "♥";
    cardList[3][0] = "♣";
}

function draw(player) {
    let n = Math.floor(Math.random() * 3);
    let m = Math.floor(Math.random() * 12 + 1);
    while (cardList[n][m] != undefined) {
        n = Math.floor(Math.random() * 3);
        m = Math.floor(Math.random() * 12 + 1);
    }
    cardList[n][m] = player[0];
    player.push([m, cardList[n][0]]);
}