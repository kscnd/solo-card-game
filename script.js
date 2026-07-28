const list = ["A♠", "2♠", "3♠", "4♠", "5♠", "6♠", "7♠", "8♠", "9♠", "10♠", "J♠", "Q♠", "K♠", 
            "A♦", "2♦", "3♦", "4♦", "5♦", "6♦", "7♦", "8♦", "9♦", "10♦", "J♦", "Q♦", "K♦", 
            "A♥", "2♥", "3♥", "4♥", "5♥", "6♥", "7♥", "8♥", "9♥", "10♥", "J♥", "Q♥", "K♥", 
            "A♣", "2♣", "3♣", "4♣", "5♣", "6♣", "7♣", "8♣", "9♣", "10♣", "J♣", "Q♣", "K♣"];
let cardList = [...list];
let discards = [];
let player = [];
let sumP = 0;
let dealer = [];
let mode = "main";
let state = "ready";
let betPoint = 0;

addPoint(0);

function modeChange(input) {
    document.getElementById(mode).style.display = "none";
    mode = input;
    document.getElementById(mode).style.display = "block";
    reset();
}
function reset() { //게임 끝난 후 모드 변경 없이 리셋 때 필요
    player = [];
    dealer = [];
    cardList = [...list];
    discards = [];
    state = "ready";
    sumP = 0;

    document.getElementById("dealer").innerText = "";
    document.getElementById("player").innerText = "";
    
    switch (mode) {
        case "blackjack":
            document.getElementById("bj_textbox").innerText = "베팅할 포인트를 입력하세요";
            document.getElementById("bj_betpoint").style.display = "inline-block";
            document.getElementById("bj_bet").style.display = "inline-block";
            document.getElementById("bj_draw").style.display = "none";
            document.getElementById("bj_stop").style.display = "none";
            document.getElementById("bj_newgame").style.display = "none";
        case "onecard":
            document.getElementById("oc_textbox").innerText = "플레이 방법을 꼭 읽어주세요!";
            document.getElementById("oc_betpoint").style.display = "inline-block";
            document.getElementById("oc_bet").style.display = "inline-block";
            document.getElementById("oc_draw").style.display = "none";
            document.getElementById("oc_newgame").style.display = "none";
    }
}

function end() {
    switch (mode) {
        case "blackjack":
            document.getElementById("bj_draw").style.display = "none";
            document.getElementById("bj_stop").style.display = "none";
            document.getElementById("bj_newgame").style.display = "inline-block";
        case "onecard":
            document.getElementById("oc_draw").style.display = "none";
            document.getElementById("oc_newgame").style.display = "inline-block";
    }
    state = "ended";
}

function bet(point) {
    betPoint = Number(point);
    if (Number(localStorage.currentPoint) < betPoint) {
        document.getElementById("bj_textbox").innerText = "포인트가 부족합니다";
        return "포인트 부족"
    }
    if (betPoint % 1) {
        document.getElementById("bj_textbox").innerText = "정수를 입력해 주세요";
        return "정수 아님";
    }
    if (!(betPoint >= 1)) {
        document.getElementById("bj_textbox").innerText = "양수 값을 입력해 주세요";
        return "음수임"
    }// 예외사항 
    localStorage.currentPoint = Number(localStorage.currentPoint) - betPoint;
    document.getElementById("currentPoint").innerText = `현재 포인트: ${localStorage.currentPoint}`;

    switch (mode) {
        case "blackjack":
            document.getElementById("bj_draw").style.display = "inline-block";
            document.getElementById("bj_stop").style.display = "inline-block";
            document.getElementById("bj_bet").style.display = "none";
            document.getElementById("bj_betpoint").style.display = "none";
            document.getElementById("bj_textbox").innerText = `베팅한 포인트: ${betPoint}`
            draw(player);
            draw(player);
            if (state === "ended") {
                bj_textbox.innerText = `BLACKJACK\n${Math.ceil(betPoint * 1.5)}포인트를 추가로 얻습니다`;
                localStorage.currentPoint = Number(localStorage.currentPoint) + Math.ceil(betPoint / 2);
                //이미 betPoint * 2를 얻었기 때문에 0.5배만 얻음
                document.getElementById("currentPoint").innerText = `현재 포인트: ${localStorage.currentPoint}`;
            }
    }
    
}

function draw(array) {
    if (state === "ended") return;
    if (cardList.length === 0) {
        cardList = [...discards];
        discards = [];
    }
    let n = Math.floor(Math.random() * cardList.length);
    array.push(cardList[n]);
    cardList.splice(n, 1);

    switch (mode) {
        case "blackjack":
            if (player[0] === array[0]) blackjack(array, "player", array[array.length - 1]);
            else blackjack(array, "dealer", array[array.length - 1]);
            break;
    }
}

function addPoint(point) {
    point = Number(point);
    if (point < 0) {
        document.getElementById("point_textbox").innerText = "양수 값을 입력해 주세요";
        return "음수임"
    }
    if (point % 1) {
        document.getElementById("point_textbox").innerText = "정수를 입력해 주세요";
        return "정수 아님";
    } //예외사항. addPoint(0)은 페이지 세팅에 쓸거임.

    if (localStorage.addedPoint === undefined) {
        localStorage.setItem("addedPoint", point);
    } else {
        localStorage.addedPoint = Number(localStorage.addedPoint) + point;
    }
    if (localStorage.currentPoint === undefined) {
        localStorage.setItem("currentPoint", point);
    } else {
        localStorage.currentPoint = Number(localStorage.currentPoint) + point;
    } //localStorage에 변경사항 저장

    document.getElementById("addedPoint").innerText = `추가한 포인트: ${localStorage.addedPoint}`;
    document.getElementById("currentPoint").innerText = `현재 포인트: ${localStorage.currentPoint}`;
    if (point > 0) {
    document.getElementById("point_textbox").innerText = `${point}포인트가 정상적으로 추가되었습니다`;
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
    const bj_textbox = document.getElementById("bj_textbox")
    let num = [];
    let sum = 0;
    num = array.map((n) => numChange(n));
    sum = num.reduce((n, m) => n + m);
    while (Math.max(...num) === 11 && sum > 21) {
        num[num.indexOf(11)] = 1;
        sum -= 10;
    }
    if (arrayName === "player") {
        if (sum > 21) {
            bj_textbox.innerText = `버스트! 포인트를 잃습니다`;
            end();
        } else if(sum === 21) {
            bj_textbox.innerText = `21점에 도달해 승리했습니다!\n${betPoint}포인트를 추가로 얻습니다`;
            localStorage.currentPoint = Number(localStorage.currentPoint) + betPoint * 2;
            document.getElementById("currentPoint").innerText = `현재 포인트: ${localStorage.currentPoint}`;
            end();
        }
        sumP = sum;
    } else {
        if (sum < 17) draw(dealer);
        else if (sum <= 21) {
            if (sum > sumP) bj_textbox.innerText = `${sum} : ${sumP}으로 딜러가 승리하였습니다\n포인트를 잃습니다`;
            else if (sum === sumP) {
                bj_textbox.innerText = `${sum} : ${sumP}으로 무승부 처리되었습니다\n포인트를 돌려받습니다.`;
                localStorage.currentPoint = Number(localStorage.currentPoint) + betPoint;
                document.getElementById("currentPoint").innerText = `현재 포인트: ${localStorage.currentPoint}`;
            }
            else {
                bj_textbox.innerText = `${sum} : ${sumP}으로 승리하였습니다\n${betPoint}포인트를 추가로 얻습니다`;
                localStorage.currentPoint = Number(localStorage.currentPoint) + betPoint * 2;
                document.getElementById("currentPoint").innerText = `현재 포인트: ${localStorage.currentPoint}`;
            }
            end();
        } else {
            bj_textbox.innerText = `딜러 버스트! 승리하였습니다\n${betPoint}포인트를 추가로 얻습니다`;
            localStorage.currentPoint = Number(localStorage.currentPoint) + betPoint * 2;
            document.getElementById("currentPoint").innerText = `현재 포인트: ${localStorage.currentPoint}`;
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