


let betAmount = 0;

let dealerSum = 0;
let yourSum = 0;
let dealerAce = 0;
let yourAce = 0;

let unFlipped;
let deck;

const bButton = document.getElementById("betBtn");
bButton.disabled = true;
let allowHit = true;

// gets only the number that's being displayed
let balanceView = document.getElementById('balance'); //======= 
let balanceText = balanceView.textContent;
let walletBalance = parseFloat(balanceText.split(':')[1]);
// holds that number
let playerBalance;
playerBalance = walletBalance; 


window.onload = function() {
    $(".not-me-score-container").hide();
    $(".me-score-container").hide();
}

$(".flip").click(function(){
    $(this).parents(".full-card").toggleClass("flipped");
});



async function updateWalletBalance ( input ) {
    try {
      const response = await fetch('/api/wallet/fund', {
        method: 'POST',
        body: JSON.stringify({ input }),
        headers: { 'Content-Type': 'application/json' }
      });
  
      if (!response.ok) {
        throw new Error('Failed to communicate with balance');
      }
  
    }
     catch (err) {
    res.status(500).json(err);
    }
}
  
 

// make leave button route back to dashboard 
// 



$("#betBtn").click(function() {
    bButton.disabled = true;
});

$(".replay").click(function() {
    dealerSum = 0;
    dealerAce = 0;
    yourSum = 0;
    yourAce = 0;
    allowHit = true;
    betAmount = 0;
    $(".not-me-score-container").hide();
    $(".me-score-container").hide();
    // call function that adds or subracts amount to user wallet database

    document.getElementById("notYourScore").innerHTML = " ";
    document.getElementById("yourScore").innerHTML = " ";
});

$("#hitBtn").click(function() {
    $("#doubleBtn").hide();
    hitbtn();

});

$("#stayBtn").click(function() {
    $(".replay").show();
    $(".leave").show();

    if(dealerSum < 17){
        dealerHand();
    }

    dealerSum = changeAce(dealerSum, dealerAce);
    yourSum = changeAce(yourSum, yourAce);

    allowHit = false;
    document.getElementById('faceDown').src = "/../images/fullDeck/" + unFlipped + ".png";


    // just displays who won ===========

     if(yourSum > 21){
        endMessage = 'YOU LOSE';
        playerBalance = betAmount - playerBalance;
        balanceView.textContent = "Balance: " + playerBalance.toFixed(2);
        updateWallet(playerBalance.toFixed(2));
     }
    else if(dealerSum > 21){
        endMessage = 'YOU WIN';
        playerBalance = betAmount + playerBalance;
        balanceView.textContent = "Balance: " + playerBalance.toFixed(2);

    }
    else if(yourSum == dealerSum){
        endMessage = 'TIE';
        //=====

    }
    else if(yourSum > dealerSum){
        endMessage = 'YOU WIN';
        playerBalance = betAmount + playerBalance;
        balanceView.textContent = "Balance: " + playerBalance.toFixed(2);

    }
    else if(yourSum < dealerSum){
        endMessage = 'YOU LOSE';
        playerBalance = betAmount - playerBalance;
        balanceView.textContent = "Balance: " + playerBalance.toFixed(2);

    }
    document.getElementById("notYourScore").innerHTML = dealerSum;
    document.getElementById("yourScore").innerHTML = yourSum;

});

// double bet amount
$("#doubleBtn").click(function() {
    betAmount += betAmount;
    $("#doubleBtn").hide();
});

// bet 1
$("#b-1").click(function() {
    if(playerBalance < 1){
        return;
    }
    betAmount = 1;
    bButton.disabled = false;
});

// bet 5
$("#b-5").click(function() {
    if(playerBalance < 5){
        return;
    }
    betAmount = 5;
    bButton.disabled = false;
});

// bet 10
$("#b-10").click(function() {
    if(playerBalance < 10){
        return;
    }
    betAmount = 10;
    bButton.disabled = false;
});

// bet 20
$("#b-20").click(function() {
    if(playerBalance < 20){
        return;
    }
    betAmount = 20;
    bButton.disabled = false;
});
// =========================================================================
function build() {
    let values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    let type = ['club', 'diamond', 'heart', 'spade'];
    deck =[];

    for(let i = 0; i < type.length; i++){
        for(let j = 0; j < values.length; j++){
            deck.push(values[j] + '-' + type[i]);
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
    endGameRefresh();
    $(".replay").hide();
    $(".leave").hide();
    $("#doubleBtn").show();

    //=================================== fade these in...
    $(".not-me-score-container").show();
    $(".me-score-container").show();
    build();
    shuffle();

    unFlipped = deck.pop();
    dealerSum += cardValue(unFlipped);
    dealerAce += checkForAce(unFlipped);

    dealerHand();


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
    let data = card.split('-');
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