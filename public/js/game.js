// const {User} = require('./User');

// deposit money
// collect bet amount
// spin slots
// check outcome
// if user won, give winnings, else take bet
// play again?

let dealerSum = 0;
let yourSum = 0;
let dealerAce = 0;
let yourAce = 0;

let unFlipped;
let deck;

let allowHit = true;

window.onload = function() {
    build();
    shuffle();
    gStart();
}

function toHide(aSelection) {
    let a = document.getElementById(aSelection);
    a.style.display = 'none';
}
function toShow(bSelection) {
    let b = document.getElementById(bSelection);
    b.style.display = 'block';
}

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
function shuffle() {
    for(let a = 0; a < deck.length; a++){
        let b = Math.floor(Math.random() * deck.length);
        let temp = deck[a];
        deck[a] = deck[b];
        deck[b] = temp;
    }
}
// give players their starting hand.
function gStart() {
    toHide('goAgain');
    // puts a car value into unflipped card
    unFlipped = deck.pop();
    dealerSum += cardValue(unFlipped);
    dealerAce += checkForAce(unFlipped);

        dealerHand();
   /* while(dealerSum < 17){
        let $newCard = $('<img />');
        let card = deck.pop();
        let url = "assets/images/fullDeck/" + card +".png";
        $newCard.attr('src', url);
        dealerSum += cardValue(card);
        dealerAce += checkForAce(card);
        let $dealerHand = $('#dealer-cards');
        $dealerHand.append($newCard);
        
    }*/

    for(i = 0; i < 2; i++){
        let $newCard = $('<img />');
        let card = deck.pop();
        let url = "/public/images/fullDeck/" + card +".png";
        $newCard.attr('src', url);
        yourSum += cardValue(card);
        yourAce += checkForAce(card);
        let $yourHand = $('#your-cards');
        $yourHand.append($newCard);
    }    

    document.getElementById('hit').addEventListener('click', hitbtn);
    document.getElementById('stay').addEventListener('click', staybtn);
}

function dealerHand(){
    
    
    let $newCard = $('<img />');
    let card = deck.pop();
    let url = "/public/images/fullDeck/" + card +".png";
    $newCard.attr('src', url);
    dealerSum += cardValue(card);
    dealerAce += checkForAce(card);
    let $dealerHand = $('#dealer-cards');
    $dealerHand.append($newCard);
        
    
    return;
}


// function for 'hit' button
function hitbtn(){
    if(!allowHit){
        return;
    }
    
    let $newCard = $('<img />');
        let card = deck.pop();
        let url = "/public/images/fullDeck/" + card +".png";
        $newCard.attr('src', url);
        yourSum += cardValue(card);
        yourAce += checkForAce(card);
        let $yourHand = $('#your-cards');
        $yourHand.append($newCard);

        if(changeAce(yourSum, yourAce) > 21){
            allowHit = false;
        }
}
// function for the 'stay' button
function staybtn(){
    if(dealerSum < 16){
        dealerHand();
    }
    dealerSum = changeAce(dealerSum, dealerAce);
    yourSum = changeAce(yourSum, yourAce);

    allowHit = false;
    document.getElementById('faceDown').src = "./public/images/fullDeck/" + unFlipped + ".png";
    let endMessage = '';
    if(yourSum > 21){
        endMessage = 'YOU LOSE';
    }
    else if(dealerSum > 21){
        endMessage = 'YOU WIN';
    }
    else if(yourSum == dealerSum){
        endMessage = 'TIE';
    }
    else if(yourSum > dealerSum){
        endMessage = 'YOU WIN';
    }
    else if(yourSum < dealerSum){
        endMessage = 'YOU LOSE';
    }
    document.getElementById("dealer-sum").innerHTML = dealerSum;
    document.getElementById("your-sum").innerHTML = yourSum;
    document.getElementById("results").innerHTML = endMessage;

    
    toHide('hit');
    toHide('stay');

    goAgain();
}

function goAgain(){

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
// checks for aces. first ace is 11, second ace can be 1.
function checkForAce(card) {
    if(card[0] == 'A'){
        return 1;
    }
    return 0;
}

// swaps ace values // going to make this players choice if only 1 A
function changeAce(a, b){
    while(a > 21 && b > 0){
        a -= 10;
        b -= 1;
    }
    return a;
}

// TO-DO LIST:
//
// need to get user funds from the User database
// need split and double functions.
// need to communicate with user bets.
// bets need to alter user funds.
// need to make A value be chosen if only 1 A is in hand