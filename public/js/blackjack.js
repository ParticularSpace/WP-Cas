


let betAmount = 0;

let dealerSum = 0;
let yourSum = 0;
let dealerAce = 0;
let yourAce = 0;

let unFlipped;
let deck;
let un; 


const stay = document.getElementById("stayBtn");
const dbl = document.getElementById("doubleBtn");
const HIT = document.getElementById("hitBtn");
const Body = document.querySelector("body");

const bButton = document.getElementById("betBtn");
bButton.disabled = true;
let allowHit = true;

const exit = document.getElementById("exit-game-id");



// let lieDetector = true; // just a general variable set to true


// gets only the number that's being displayed
let balanceView = document.getElementById('balance'); //======= 
let balanceText = balanceView.textContent;
let walletBalance = parseFloat(balanceText.split(':')[1]);
// holds that number
let playerBalance;
playerBalance = walletBalance; 
// extra variable for holding temp player balalnce for bet buttons.
let tempBalance;
const audio1 = new Audio("../sounds/intro_game_music_1a.mp3");
const sound1 = new Audio("../sounds/coin_select.wav");
const sound2 = new Audio("../sounds/machine.wav");
const sound3 = new Audio("../sounds/machine2.wav");
const sound4 = new Audio("../sounds/loss.wav ");
const sound5 = new Audio("../sounds/win.wav ");
const sound6 = new Audio("../sounds/button2.wav");

// const chat_window = document.getElementById("lilHChat");
// let isShowing = false;


// window.onload = function() {
//     $(".not-me-score-container").hide();
//     $(".me-score-container").hide();
//     $(".chat-window").hide();
//     playSound(audio1);
// }

window.addEventListener('DOMContentLoaded', function() {
    
    $(".not-me-score-container").hide();
    $(".me-score-container").hide();
    $(".chat-window").hide();
    playSound(audio1);
    $(".endGameResults").hide();
   
});

$(".flip").click(function(){
    $(this).parents(".full-card").toggleClass("flipped");
});

// function correctSumDisplay() {
//     if(yourAce == 1 && yourSum > 21){
//         yourSum = changeAce(yourSum, yourAce);
//         document.getElementById("yourScore").innerHTML = yourSum;
//     }
//     return;
// }




//========================================================================================================
async function updateWalBal (input) {
    try {
        const response = await fetch('/api/profile/wallet/user_wallet/U_W_bal', {
          method: 'POST',
          body: JSON.stringify({ input }),
          headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) {
            throw new Error('Failed to add funds');
        }
    } catch (error) {
        console.error('Error:', error);
    }

    
}


// ====================


// function gameAnnounce to send the gameOutcome to chat route /api/chat/announce
async function gameAnnounce (userMessage, gameOutcome) {
    try {
        const response = await fetch('/api/chat/announce', {
            method: 'POST',
            body: JSON.stringify({userMessage, gameOutcome }),
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) {
            throw new Error('Failed to announce');
        }

        if (response.ok) {
            const data = await response.json();
            const aiMessage = data.message;

            // Add the AI message to the chat window
            const chatMessages = document.querySelector('#chat-messages');
            chatMessages.innerHTML += `<div class="ai-message"><strong>AI:</strong> ${aiMessage}</div>`;

            // Scroll to the bottom of the chat window
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

    } catch (error) {
        console.error('Error:', error);
    }
};





// ====================
 // ==========================================================================================================

// make leave button route back to dashboard 
$("#leave_game").click(function() {
    window.location.href = "../dashboard";

});

$(".exit-game").click(function() {
    window.location.href = "../dashboard";
})
// ========== Apply chat partial =========

// $("#applyChatPartial").click(function(event) {
//     event.preventDefault();

//     if(isShowing == false){
//     $(".chat-window").show();
//     isShowing = true;
//     return;
//     }
//     else if(isShowing == true){
//     $(".chat-window").hide();
//     isShowing = false;
//     return;
//     }
    
// });

function playSoundOnce(A) {
    A.play();
}

function playSound(Y) {
    Y.loop = true;
    Y.play();
}

function stopSound(X) {
    if (X) {
      X.pause();
      X.currentTime = 0;
    }
}


$("#betBtn").click(function() {
    bButton.disabled = true;
});

$(".replay").click(function() {
    // stopSound(audio2);
    
    playSoundOnce(sound3);
    Body.classList.toggle('second-img');

    dealerSum = 0;
    dealerAce = 0;
    yourSum = 0;
    yourAce = 0;
    allowHit = true;
    betAmount = 0;
    document.getElementById("stayBtn").innerHTML = "STAND";
    stay.disabled = false;
    exit.disabled = false;
    dbl.disabled = false;
    HIT.disabled = false;
    $(".endGameResults").hide();
    $(".not-me-score-container").hide();
    $(".me-score-container").hide();
    // call function that adds or subracts amount to user wallet database

    document.getElementById("notYourScore").innerHTML = " ";
    document.getElementById("yourScore").innerHTML = " ";
});

$("#hitBtn").click(function() {
    playSoundOnce(sound6);
    dbl.disabled = true;
    document.getElementById("stayBtn").innerHTML = "Stay";
    hitbtn();
    // correctSumDisplay();

});

$("#stayBtn").click(async function() {

    $(".replay").show();
    $(".leave").show();
    $(".endGameResults").show();
    dbl.disabled = true;
    stay.disabled = true;
    HIT.disabled = true;
    // let displayResult = document.querySelector(".endGameResults");
    if(dealerSum < 17){
        dealerHand();
    }

    dealerSum = changeAce(dealerSum, dealerAce);
    yourSum = changeAce(yourSum, yourAce);

    allowHit = false;
    document.getElementById('faceDown').src = "/../images/fullDeck/" + unFlipped + ".png";


    // displays who won ===========
    let gameOutcome;
    if(yourSum > 21){
        playSoundOnce(sound4);
        gameOutcome = 'BUST';
        playerBalance = playerBalance - betAmount;
        balanceView.textContent = "Balance: " + playerBalance.toFixed(2);
        updateWalBal(playerBalance);
     }
    else if(dealerSum > 21){
        playSoundOnce(sound5);
        endMessage = 'YOU WIN ';
        playerBalance = playerBalance + betAmount;
        balanceView.textContent = "Balance: " + playerBalance.toFixed(2);
        updateWalBal(playerBalance);
        gameOutcome = endMessage + "+" + betAmount;
    }
    else if(yourSum == dealerSum){
        endMessage = 'PUSH ';
        //=====
        balanceView.textContent = "Balance: " + playerBalance.toFixed(2);
        gameOutcome = endMessage + "+0";
    }
    else if(yourSum > dealerSum){
        playSoundOnce(sound5);
        endMessage = 'YOU WIN ';
        playerBalance = playerBalance + betAmount;
        balanceView.textContent = "Balance: " + playerBalance.toFixed(2);
        updateWalBal(playerBalance);
        gameOutcome = endMessage + "+" + betAmount;
    }
    else if(yourSum < dealerSum){
        playSoundOnce(sound4);
        gameOutcome = 'BUST ';
        playerBalance = playerBalance - betAmount;
        balanceView.textContent = "Balance: " + playerBalance.toFixed(2);
        updateWalBal(playerBalance);
    }
    const announceMessage = await gameAnnounce('blackjack ending', gameOutcome);
    console.log(announceMessage, 'announceMessage');
    
    document.getElementById("notYourScore").innerHTML = dealerSum;
    document.getElementById("yourScore").innerHTML = yourSum;
    

});

// double bet amount
$("#doubleBtn").click(function() {
    playSoundOnce(sound6);

    betAmount += betAmount;
    dbl.disabled = true;
    HIT.disabled = true;

    //===== add hit 1 card
    let $newCard = $('<img />');
    let card = deck.pop();
    let url = "/../images/fullDeck/" + card +".png";
    $newCard.attr('src', url);
    yourSum += cardValue(card);
    yourAce += checkForAce(card);
    let $insertCard = $('#e');
    $insertCard.append($newCard);
        
    document.getElementById("yourScore").innerHTML = yourSum;



});

// bet 1
$("#b-1").click(function() {
    playSoundOnce(sound1);

    balanceView.textContent = "Balance: " + playerBalance.toFixed(2);
    
    if(playerBalance < 1){
        return;
    }
    betAmount = 1;

    tempBalance = playerBalance
    tempBalance = tempBalance - betAmount;
    balanceView.textContent = "Balance: " + tempBalance.toFixed(2);

    bButton.disabled = false;
});

// bet 5
$("#b-5").click(function() {
    playSoundOnce(sound1);

    balanceView.textContent = "Balance: " + playerBalance.toFixed(2);

    if(playerBalance < 5){
        return;
    }
    betAmount = 5;

    tempBalance = playerBalance
    tempBalance = tempBalance - betAmount;
    balanceView.textContent = "Balance: " + tempBalance.toFixed(2);

    bButton.disabled = false;
});

// bet 10
$("#b-10").click(function() {
    playSoundOnce(sound1);

    balanceView.textContent = "Balance: " + playerBalance.toFixed(2);

    if(playerBalance < 10){
        return;
    }
    betAmount = 10;

    tempBalance = playerBalance
    tempBalance = tempBalance - betAmount;
    balanceView.textContent = "Balance: " + tempBalance.toFixed(2);

    bButton.disabled = false;
});

// bet 20
$("#b-20").click(function() {
    playSoundOnce(sound1);

    balanceView.textContent = "Balance: " + playerBalance.toFixed(2);

    if(playerBalance < 20){
        return;
    }
    betAmount = 20;

    tempBalance = playerBalance
    tempBalance = tempBalance - betAmount;
    balanceView.textContent = "Balance: " + tempBalance.toFixed(2);

    bButton.disabled = false;
});
// =========================================================================
function build() {
    let values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    let type = ['club', 'diamond', 'heart', 'spade'];
    deck =[];

    for(let i = 0; i < type.length; i++){
        for(let j = 0; j < values.length; j++){
            deck.push(values[j] + '_' + type[i]);
        }
    }
}

// randomize the order
function shuffle() {
    for(let a = 0; a < deck.length; a++){
        let b = Math.floor(Math.random() * deck.length);
        let temp = deck[a];
        deck[a] = deck[b];
        deck[b] = temp;
    }
}

function hitbtn(){
    if(!allowHit){
        return;
    }
    
    let $newCard = $('<img />');
        let card = deck.pop();
        let url = "/../images/fullDeck/" + card +".png";
        $newCard.attr('src', url);
        yourSum += cardValue(card);
        yourAce += checkForAce(card);
        let $insertCard = $('#e');
        $insertCard.append($newCard);

    if(changeAce(yourSum, yourAce) > 21){
        allowHit = false;
    }
    document.getElementById("yourScore").innerHTML = yourSum;
}



function gameStart() { 
    // stopSound(audio1);
    // playSound(audio2);
    playSoundOnce(sound2);
    Body.classList.toggle("second-img");
    endGameRefresh();
    $(".replay").hide();
    $(".leave").hide();
    $("#doubleBtn").show();
    exit.disabled = true;
    //=================================== fade these in...
    $(".not-me-score-container").show();
    $(".me-score-container").show();
    build();
    shuffle();

    unFlipped = deck.pop();
    dealerSum += cardValue(unFlipped);
    dealerAce += checkForAce(unFlipped);
    un = dealerSum;
    dealerHand();
    
    document.getElementById("notYourScore").innerHTML = dealerSum - un; 

    for(i = 0; i < 2; i++){
        

        let $newCard = $('<img />');
        let card = deck.pop();
        let url = "/../images/fullDeck/" + card +".png";
        $newCard.attr('src', url);
        yourSum += cardValue(card);
        yourAce += checkForAce(card);
        let $insertCard = $('#e');
        $insertCard.append($newCard);
    }    
    document.getElementById("yourScore").innerHTML = yourSum;
}

// checks for the value of non numbered cards.
function cardValue(card) {
    let data = card.split('_');
    let value = data[0];

    if(isNaN(value)){
        if(value == 'A'){
            return 11;
        }
        return 10;
    }
    return parseInt(value);
}
// checks for aces. first ace can be 1 or 11, second ace is 11.
function checkForAce(card) {
    if(card[0] == 'A'){
        return 1;
    }
    return 0;
}

function changeAce(a, b){
    while(a > 21 && b > 0){
        a -= 10;
        b -= 1;
        
    }
    
    return a;
}

function endGameRefresh() {
    $("#b").empty();
    let $resetIMG = $("<img />");
    let url = "/../images/fullDeck/back.png";
    $resetIMG.attr('src', url);
    $resetIMG.attr('id', "faceDown");

    let $dealerHand = $('#b');
    $dealerHand.append($resetIMG);

    $("#e").empty();

    
}


function dealerHand(){
    
    
    let $newCard = $('<img />');
    let card = deck.pop();
    let url = "/../images/fullDeck/" + card +".png";
    $newCard.attr('src', url);
    dealerSum += cardValue(card);
    
    dealerAce += checkForAce(card);
    let $dealerHand = $('#b');
    $dealerHand.append($newCard);

    
    
    return;
}

// LET THE GAMES BEGIN
$(document).ready( function() {
    $(".make-bet").click(gameStart);

    

});