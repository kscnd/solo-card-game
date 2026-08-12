const list = ["A♠", "2♠", "3♠", "4♠", "5♠", "6♠", "7♠", "8♠", "9♠", "10♠", "J♠", "Q♠", "K♠", 
            "A♦", "2♦", "3♦", "4♦", "5♦", "6♦", "7♦", "8♦", "9♦", "10♦", "J♦", "Q♦", "K♦", 
            "A♥", "2♥", "3♥", "4♥", "5♥", "6♥", "7♥", "8♥", "9♥", "10♥", "J♥", "Q♥", "K♥", 
            "A♣", "2♣", "3♣", "4♣", "5♣", "6♣", "7♣", "8♣", "9♣", "10♣", "J♣", "Q♣", "K♣"];
/**뽑을 수 있는 카드 */   let cardList = [...list];
/**버린 카드 */          let discards = [];
/**플레이어 덱 */        let player = [];
/**플레이어 숫자 합 */    let sumP = 0;
/**딜러 덱 */            let dealer = [];
/**"main" | 게임 이름 */ let mode = "main";
/**ready | setting | ended */     let state = "ready";
/**베팅한 포인트 */       let betPoint = 0;
/**dealer | player */   let turn = "player";

addPoint(0);

function modeChange(input) {
    document.getElementById(mode).style.display = "none";
    let elements = Array.from(document.getElementsByClassName(mode));
    elements.forEach((e) => e.style.display = "none");

    elements = Array.from(document.getElementsByClassName(input));
    elements.forEach((e) => e.style.display = "inline-block");
    if (input === "main") document.getElementById("tothemain").style.display = "none";
    else document.getElementById("tothemain").style.display = "inline-block";
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
    turn = "player";
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
            break;
        case "onecard":
            document.getElementById("oc_textbox").innerText = "플레이 방법을 꼭 읽어주세요!";
            document.getElementById("oc_betpoint").style.display = "inline-block";
            document.getElementById("oc_bet").style.display = "inline-block";
            document.getElementById("oc_draw").style.display = "none";
            document.getElementById("oc_newgame").style.display = "none";
            document.getElementById("oc_discard").innerText = "";
            document.getElementById("oc_suit").innerText = "";
            document.getElementById("oc_discard2").innerText = "";
            document.getElementById("oc_dealer").innerText = "";
            document.getElementById("oc_player").innerText = "";
            oc.isAttacking = false;
            oc.damage = 0;
            break;
    }
}

function end() {
    state = "ended";
    document.getElementById("tothemain").style.display = "inline-block";
    switch (mode) {
        case "blackjack":
            document.getElementById("bj_draw").style.display = "none";
            document.getElementById("bj_stop").style.display = "none";
            document.getElementById("bj_newgame").style.display = "inline-block";
            document.getElementById("bj_guideb").style.display = "inline-block";
            break;
        case "onecard":
            document.getElementById("oc_draw").style.display = "none";
            document.getElementById("oc_guideb").style.display = "inline-block";
            document.getElementById("oc_newgame").style.display = "inline-block";
            if (dealer.length === 0) {
                document.getElementById("oc_textbox").innerText = "딜러 승리!";
            } else if (player.length === 0) {
                document.getElementById("oc_textbox").innerText = "플레이어 승리!";
            } else if (player.length >= 25) {
                document.getElementById("oc_textbox").innerText = "플레이어 파산! 딜러 승리!";
            } else if (dealer.length >= 25) {
                document.getElementById("oc_textbox").innerText = "딜러 파산! 플레이어 승리!";
            } else {
                document.getElementById("oc_textbox").innerText = "ERROR";
            }
            break;
    }
}

/**
 * 베팅 및 게임 시작
 * @param {string} point 
 */
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
    if (betPoint < 0) {
        document.getElementById("bj_textbox").innerText = "양수 값을 입력해 주세요";
        return "음수임"
    }// 예외사항 
    localStorage.currentPoint = Number(localStorage.currentPoint) - betPoint;
    document.getElementById("currentPoint").innerText = `현재 포인트: ${localStorage.currentPoint}`;
    document.getElementById("tothemain").style.display = "none";

    switch (mode) {
        case "blackjack":
            document.getElementById("bj_draw").style.display = "inline-block";
            document.getElementById("bj_stop").style.display = "inline-block";
            document.getElementById("bj_guideb").style.display = "none";
            document.getElementById("bj_bet").style.display = "none";
            document.getElementById("bj_betpoint").style.display = "none";
            document.getElementById("bj_textbox").innerText = `베팅한 포인트: ${betPoint}`
            draw(player, "player");
            draw(player, "player");
            if (state === "ended") {
                bj_textbox.innerText = `BLACKJACK\n${Math.ceil(betPoint * 1.5)}포인트를 추가로 얻습니다`;
                localStorage.currentPoint = Number(localStorage.currentPoint) + Math.ceil(betPoint / 2);
                //이미 betPoint * 2를 얻었기 때문에 0.5배만 얻음
                document.getElementById("currentPoint").innerText = `현재 포인트: ${localStorage.currentPoint}`;
            }
            break;
        case "onecard":
            state = "setting";
            document.getElementById("oc_draw").style.display = "inline-block";
            document.getElementById("oc_guideb").style.display = "none";
            document.getElementById("oc_bet").style.display = "none";
            document.getElementById("oc_betpoint").style.display = "none";
            let array = [];
            draw(array, 'discard');
            discards.push(document.getElementById("oc_discard").innerText);
            let lastCard = document.getElementById("oc_discard").innerText
            document.getElementById("oc_suit").innerText = lastCard[lastCard.length - 1];
            for (let i = 0; i < 7; i++) {
                state = "setting";
                draw(player, 'player');
                draw(dealer, 'dealer');
            }
            break;
    }
    
}

/**
 * 카드 뽑는 함수
 * @param {string[]} array 덱
 * @param {string} arrayName 덱 주인
 */
function draw(array, arrayName) {
    if (state === "ended") return;
    if (state === "ready" && turn !== arrayName) return;
    if (cardList.length === 0) {
        cardList = [...discards];
        discards = [cardList[cardList.length - 2], cardList[cardList.length - 1]];
        cardList.splice(-2);
    }
    let n = Math.floor(Math.random() * cardList.length);
    array.push(cardList[n]);
    cardList.splice(n, 1);

    switch (mode) {
        case "blackjack":
            blackjack(array, arrayName, array[array.length - 1]);
            break;
        case "onecard":
            if (arrayName === "dealer") {
                document.getElementById("oc_dealer").innerHTML += displaycard("");
            } else {
                document.getElementById(`oc_${arrayName}`).innerHTML += displaycard(array[array.length - 1]);
            }
            state = "setting";
            for (let i = 1; i < oc.damage; i++) {
                setTimeout(() => {
                    if (cardList.length === 0) {
                        cardList = [...discards];
                        discards = [cardList[cardList.length - 2], cardList[cardList.length - 1]];
                        cardList.splice(-2);
                    }
                    let n = Math.floor(Math.random() * cardList.length);
                    array.push(cardList[n]);
                    cardList.splice(n, 1);
                    if (arrayName === "dealer") {
                        document.getElementById("oc_dealer").innerHTML += displaycard("");
                    } else {
                        document.getElementById(`oc_${arrayName}`).innerHTML += displaycard(array[array.length - 1]);
                    }
                }, 500 * i);
            }
            setTimeout(() => {
                state = "ready";
                oc.damage = 0;
                oc.isAttacking = false;
                if (array.length >= 25) end();
            }, 500 * (oc.damage));
            break;
    }
}

/**
 * 플레이어 포인트 보충(메인 화면에서 사용)
 * @param {string} point 
 */
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

/**
 * 블랙잭 게임 시 draw 함수에 의해 실행.
 * @param {string[]} array 덱
 * @param {string} arrayName 덱 주인
 * @param {string} card 
 */
function blackjack(array, arrayName, card) {
    document.getElementById(arrayName).innerHTML += displaycard(card);
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
        if (sum < 17) draw(dealer, 'dealer');
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

/**
 * 카드 숫자 추출 함수
 * @param {string} n 카드 ex) "A♠"
 */
function numChange(n) {
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

/**
 * 카드 모양 나오게 html 만들어줌
 * @param {string} card 
 * @returns  카드 모양 html 요소
 */
function displaycard(card) {
    if (card === "") return '<div class="card" style="background-color: #9292ca">??</div>';
    switch (mode) {
        case "blackjack":
            switch (card[card.length - 1]) {
                case "♦":
                case "♥":
                    return `<div class="card" style="color: red">${card}</div>`;
                default:
                    return `<div class="card">${card}</div>`
            }
        case "onecard":
            switch (card[card.length - 1]) {
                case "♦":
                case "♥":
                    return `<div class="card" style="color: red" onclick="oc.discard('${card}', 'player')">${card}</div>`;
                default:
                    return `<div class="card" onclick="oc.discard('${card}', 'player')">${card}</div>`
            }
    }
}

const oc = {
    isAttacking: false,
    /**공격으로 먹는 카드 수 */ damage: 0,
    /**
     * 카드 버리는 함수
     * @param {string} card 버리는 카드
     * @param {string} arrayName 덱 주인
     */
    discard(card, arrayName) {
        if (state !== "ready") return;
        if (arrayName !== turn) return;
        if (discards.indexOf(card) + 1) return; 
        if (this.checkAvailable([card])[0] === false) return;
        const lastCard = document.getElementById("oc_discard").innerText;
        let suit = document.getElementById("oc_suit");
        document.getElementById(`oc_discard2`).innerHTML = displaycard(lastCard);
        document.getElementById("oc_discard").innerHTML = displaycard(card);
        discards.push(card);
        suit.innerText = card[card.length - 1];
        if (arrayName === "player") {
            let newElements = document.getElementById("oc_player").innerHTML.replace(displaycard(card), "");
            document.getElementById("oc_player").innerHTML = newElements;
            player.splice(player.indexOf(card), 1);
            if (card[0] !== "K" && card[0] !== "J") {
                turn = "dealer";
            }
            if (player.length === 0) {
                end();
                return;
            }
        } else if (arrayName === "dealer") {
            let newElements = document.getElementById("oc_dealer").innerHTML.replace(displaycard(""), "");
            document.getElementById("oc_dealer").innerHTML = newElements;
            dealer.splice(dealer.indexOf(card), 1);
            if (card[0] !== "K" && card[0] !== "J") {
                turn = "player";
                document.getElementById("oc_textbox").innerText = "플레이어 턴";
            } else turn = "dealer";
            if (dealer.length === 0) {
                end();
                return;
            }
        }

        this.isAttacking = true;
        switch (card) {
            case "A♠":
                this.damage += 5;
                break;
            case "A♦":
            case "A♥":
            case "A♣":
                this.damage += 3;
                break;
            case "2♠":
            case "2♦":
            case "2♥":
            case "2♣":
                this.damage += 2;
                break;
            default:
                this.isAttacking = false;
                break;
        }
        if (turn === "dealer") this.dealerAct()
    },
    /**
     * 덱에 낼 수 있는게 있는지 체크
     * @param {string[]} array 단일 카드면 배열로 감싸야 함
     * @returns {boolean[]}
     * true index 반환으로 수정?
     */
    checkAvailable(array) {
        const lastCard = document.getElementById("oc_discard").innerText;
        let suit = document.getElementById("oc_suit");
        let b = -1;
        let barray = [];
        for (let i = 0; i < array.length; i++) {
            barray.push(b);
            b = false;
            if (lastCard[0] !== array[i][0] && suit.innerText !== array[i][array[i].length - 1]) continue;
            if (this.isAttacking) {
                if (lastCard[0] === "A") {
                    if (lastCard[1] === "♠") continue;
                    if (array[i][0] !== "A") continue;
                }
                if (lastCard[0] === "2") {
                    if (array[i][0] !== "2" && array[i][0] !== "A") continue;
                }
            }
            b = true;
        }
        barray.push(b);
        barray = barray.slice(1);
        return barray;
    },
    dealerAct() {
        if (state !== "ready") return;
        turn = "dealer";
        document.getElementById("oc_textbox").innerText = "딜러 행동 중";
        c = this.checkAvailable(dealer).indexOf(true);
        if (c === -1) {
            setTimeout(() => {
                draw(dealer, "dealer");
                turn = "player";
                document.getElementById("oc_textbox").innerText = "플레이어 턴";
            }, 1000);
        } else setTimeout(() => {this.discard(dealer[c], "dealer")}, 1000);
    }
} 