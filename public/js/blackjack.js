//set up websocket server
let ws = new WebSocket('ws://localhost:3001');

ws.onerror = function(event) {
    console.error("ws error observed:", event);
    console.log(event.type);  // Logs the type of the event
    console.log(event.message);  // Logs the message of the event, if any
  };
  

// ws.onopen = () => {
//     console.log('WebSocket Client Connected');
//   };
  
// ws.onmessage = (message) => {
//     const data = JSON.parse(message.data);
//     console.log('Received: ', data);
//   };

// declare global variables
let bet_amount = 0;
let dealerSum = 0;
let yourSum = 0;
let dealerAce = 0;
let yourAce = 0;
let unFlipped;
let deck;
let un;
let playerHasBlackjack = false;
let canBet = true;

// get the DOM elements
const stay = document.getElementById("stayBtn");
const dbl = document.getElementById("doubleBtn");
const HIT = document.getElementById("hitBtn");
const Body = document.querySelector("body");

// grab the chip ID's
const b1 = document.getElementById("b-1");
b1.hidden = false;
const b5 = document.getElementById("b-5");
b5.hidden = false;
const b10 = document.getElementById("b-10");
b10.hidden = false;
const b20 = document.getElementById("b-20");
b20.hidden = false;

const bButton = document.getElementById("betBtn");
bButton.hidden = false;
let allowHit = true;

const exit = document.getElementById("play-again-id");

// get the wallet balance
let balanceView = document.getElementById('balance');
let balanceText = balanceView.textContent;
let walletBalance = parseFloat(balanceText.split(':')[1]);
let playerBalance;
playerBalance = walletBalance;
let tempBalance;

// setup event listeners
window.addEventListener('DOMContentLoaded', function () {
    $(".not-me-score-container").hide();
    $(".me-score-container").hide();
    $(".chat-window").hide();
    $(".endGameResults").hide();
});

// function updateWalBal to update the user wallet database
async function updateWalBal(input) {
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

// Function to make a call to /blackjack that updates the blackjack table with the game outcome and all needed info is sent to the database including user_id, bet, result, amount_won_lost, time_played, remaining_deck

async function updateBlackJackTable(bet_amount, gameOutcome, amount_won_lost) {
    


    try {
        const response = await fetch('/api/users/blackjack', {
            method: 'POST',
            body: JSON.stringify({ bet_amount, gameOutcome, amount_won_lost }),
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) {
            throw new Error('Failed to update blackjack table');
        }
        
    } catch (error) {
        console.error('Error:', error);
    }
}


// function gameAnnounce to send the gameOutcome to chat route /api/chat/announce
async function gameAnnounce(userMessage, gameOutcome) {
    try {
        const response = await fetch('/api/chat/announce', {
            method: 'POST',
            body: JSON.stringify({ userMessage, gameOutcome }),
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

function dealCardsAnimation() {
    // Get the player's and dealer's hand elements
    const playerHand = $('#e');
    const dealerHand = $('#b');

    // Get the deck element
    const deck = $('#deck'); // Replace with the actual id of your deck element

    // Deal a card to the player
    let playerCard = deck.children().last();
    playerCard.animate({
        top: playerHand.offset().top,
        left: playerHand.offset().left
    }, 1000, function() {
        // Animation complete
        playerHand.append(playerCard);
    });

    // Wait for a bit before dealing the next card
    setTimeout(function() {
        // Deal a card to the dealer
        let dealerCard = deck.children().last();
        dealerCard.animate({
            top: dealerHand.offset().top,
            left: dealerHand.offset().left
        }, 1000, function() {
            // Animation complete
            dealerHand.append(dealerCard);
        });
    }, 1500);
}

function dealCard(hand, card) {
    // Create new card DOM element
    var newCard = document.createElement("div");
    newCard.id = card.id;
    newCard.className = "card";

    // Create image element for the card
    var img = document.createElement("img");
    img.src = `../images/fullDeck/${card.image}`;

    // Append img element to the card
    newCard.appendChild(img);

    // Add the card to the hand
    hand.appendChild(newCard);

    // Add the slide-in animation
    newCard.style.animation = 'slideIn 0.5s forwards';

    // Wait until the next frame to remove the animation
    // so it doesn't keep sliding in every time the screen updates
    requestAnimationFrame(() => {
        newCard.style.animation = '';
    });

    // If the hand parameter represents the dealer's hand, update their score
    if (hand === dealerHand) {
        // Add the value of the new card to the dealer's total score
        dealerSum += cardValue(card);
        // Update the dealer's score in the UI
        document.getElementById("notYourScore").innerHTML = dealerSum;
    }

    
}

// make leave button route back to dashboard 
$("#exitBtn").click(function () {
    window.location.href = "../dashboard";
});

// bring back the chips to bet again and play another game
$(".play-again").click(function () {

    // reset the board
    resetBoard();

    // reset the chips
    $("#pile").empty();

    
    console.log("Game reset");
})

$("#betBtn").click(function () {
    bButton.hidden = true;
    b1.hidden = true;
    b5.hidden = true;
    b10.hidden = true;
    b20.hidden = true;

    
    // update the player's and dealer's scores
    $("#yourScore").text(yourSum);
    $("#notYourScore").text(dealerSum);
    dealCardsAnimation();
});

$("#hitBtn").click(function () {
    // hit button

    if (!allowHit) {
        return;
    }

    let $newCard = $('<img />');
    let card = deck.pop();
    let url = "/../images/fullDeck/" + card + ".png";
    $newCard.attr('src', url);
    yourSum += cardValue(card);
    yourAce += checkForAce(card);

    // Call changeAce after the new card value is added to yourSum
    yourSum = changeAce(yourSum, yourAce);

     // Send game update to server
     ws.send(JSON.stringify({
        type: 'gameUpdate',
        newCard: card,
        yourSum: yourSum
      }));

    $('#e').append($newCard);


    // Check if yourSum is greater than 21 and end game if it is
    if (yourSum > 21) {
        allowHit = false;
        // Show the dealer's unflipped card
        $('#faceDown').attr('src', "/../images/fullDeck/" + unFlipped + ".png");
        // Display Bust message
        gameOutcome = 'BUST';
        //set amount_won_lost to negative bet_amount
        amount_won_lost = -bet_amount;

        balanceView.textContent = "Balance: " + playerBalance.toFixed(2);
        updateWalBal(playerBalance);
        updateBlackJackTable(bet_amount, gameOutcome, amount_won_lost)
        gameAnnounce('blackjack ending', gameOutcome);

        // Reset the board after a brief delay to allow player to see the result
        setTimeout(resetBoard, 2000); // Delay of 2 seconds
    }

    $("#yourScore").text(yourSum);
});


function resetBoard() {
    // Clear the player's and dealer's hands
    const playerHand = document.getElementById('e'); // Assuming 'e' is the id of the player's hand element
    while (playerHand.firstChild) {
        playerHand.firstChild.remove();
    }
    const dealerHand = document.getElementById('b'); // Assuming 'd' is the id of the dealer's hand element
    while (dealerHand.firstChild) {
        dealerHand.firstChild.remove();
    }



    // Reset the gameplay variables
    bet_amount = 0;
    dealerSum = 0;
    yourSum = 0;
    dealerAce = 0;
    yourAce = 0;
    unFlipped = undefined;

    

    // Hide game elements
    $(".not-me-score-container").hide();
    $(".me-score-container").hide();
    $(".endGameResults").hide();

    // Reshuffle the deck
    build();
    shuffle();

    // Reset the game controls
    bButton.hidden = false;
    b1.hidden = false;
    b5.hidden = false;
    b10.hidden = false;
    b20.hidden = false;
    dbl.disabled = false;
    stay.disabled = false;
    HIT.disabled = false;
    exit.disabled = true;

    // Reset the dealer's unflipped card
    $('#faceDown').attr('src', "/../images/fullDeck/back.png");

    // Reset the player's and dealer's scores
    $("#yourScore").text(0);
    $("#notYourScore").text(0);

    // Reset the allowHit flag
    allowHit = true;

    // reset the chips
    $("#pile").empty();
}

function updateScores() {
    

    dealerSum = changeAce(dealerSum, dealerAce);
    yourSum = changeAce(yourSum, yourAce);

    document.getElementById("notYourScore").innerHTML = dealerSum;
    document.getElementById("yourScore").innerHTML = yourSum;
}

async function handleDealer() {
    
    while (dealerSum <= 16) {
        dealerHand();
        dealerSum = changeAce(dealerSum, dealerAce);
    }
    updateScores();
}


function calculateOutcome() {

    

    if (yourSum > 21) {
        return 'BUST';
    } else if (dealerSum > 21) {
        return 'WIN';
    } else if (yourSum > dealerSum) {
        return 'WIN';
    } else if (yourSum < dealerSum) {
        return 'LOSE';
    } else {
        return 'PUSH';
    }
}

function updateInterface(gameOutcome) {
    // Show the dealer's unflipped card
    $('#faceDown').attr('src', "/../images/fullDeck/" + unFlipped + ".png");

    // Display the game outcome
    gameAnnounce('blackjack ending', gameOutcome);

    // Update the player's balance
    if (gameOutcome === 'WIN') {
        if (playerHasBlackjack) {
            // If the player has a blackjack, give them a 3:2 payout
            playerBalance += bet_amount * 2.5;
            amount_won_lost = bet_amount * 1.5;
        } else {
            playerBalance += bet_amount * 2;
            amount_won_lost = bet_amount;
        }
        balanceView.textContent = "Balance: " + playerBalance.toFixed(2);
        updateWalBal(playerBalance);
        updateBlackJackTable(bet_amount, gameOutcome, amount_won_lost);
    } else if (gameOutcome === 'PUSH') {
        playerBalance += bet_amount;
        balanceView.textContent = "Balance: " + playerBalance.toFixed(2);
        amount_won_lost = 0;
        updateWalBal(playerBalance);
        updateBlackJackTable(bet_amount, gameOutcome, amount_won_lost);
    } else if (gameOutcome === 'LOSE') {
        amount_won_lost = -bet_amount;
        updateBlackJackTable(bet_amount, gameOutcome, amount_won_lost);
    } else if (gameOutcome === 'BUST') {
        amount_won_lost = -bet_amount;
        updateBlackJackTable(bet_amount, gameOutcome, amount_won_lost);
    }

    // Enable the play again button
    exit.disabled = false;
}

document.getElementById('join-lobby-button').addEventListener('click', function() {
    // Hide the join button
    this.style.display = 'none';
  
    // Show the leave button
    document.getElementById('leave-lobby-button').style.display = 'block';
  
    // Joining a lobby
ws.send(JSON.stringify({
    type: 'joinLobby',
    lobby: 'lobbyName', // Replace with the actual lobby name
  }));
  });

  

  $("#stayBtn").click(async function () {
    $(".replay").show();
    $(".leave").show();
    $(".endGameResults").show();
    dbl.disabled = true;
    stay.disabled = true;
    HIT.disabled = true;

    allowHit = false;
    document.getElementById('faceDown').src = "/../images/fullDeck/" + unFlipped + ".png";

    await handleDealer();
    const gameOutcome = calculateOutcome();
    updateInterface(gameOutcome);

    if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
            type: 'stay',
            gameState: {
                playerSum: yourSum,
                dealerSum: dealerSum,
                outcome: gameOutcome
            }
        }));
    } else {
        console.log('WebSocket connection is not open:', ws.readyState);
    }
});


// double bet amount NOT WORKED ON YET
$("#doubleBtn").click(function () {

    bet_amount += bet_amount;
    dbl.disabled = true;
    HIT.disabled = true;

    //===== add hit 1 card
    let $newCard = $('<img />');
    let card = deck.pop();
    let url = "/../images/fullDeck/" + card + ".png";
    $newCard.attr('src', url);
    yourSum += cardValue(card);
    yourAce += checkForAce(card);
    let $insertCard = $('#e');
    $insertCard.append($newCard);

    

    document.getElementById("yourScore").innerHTML = yourSum;



});

function updateBet(betIncrement) {
    if (playerBalance < betIncrement || bet_amount + betIncrement > 300) {
        canBet = false;
        return;
    }

    bet_amount += betIncrement;

    playerBalance -= betIncrement;
    balanceView.textContent = "Balance: " + playerBalance.toFixed(2);

    bButton.disabled = false;
}

$(".chip").click(function () {
    if (canBet) {
        let betIncrement = parseInt($(this).attr('data-value'), 10);
        updateBet(betIncrement);
        moveChip($(this), 'pile');
    }
});

$('#pile').click(function () {
    // find the last chip
    let lastChip = $(this).children().last();

    // check if a chip exists
    if (lastChip.length) {
        // parse the chip value as a number and add it back to the player balance
        let chipValue = parseInt(lastChip.attr('data-value'), 10);
        playerBalance += chipValue;
        bet_amount -= chipValue;

        // update the balance view
        balanceView.textContent = "Balance: " + playerBalance.toFixed(2);

        // remove the chip
        lastChip.remove();

        // Enable the chips if the total bet is less than 300
        if (bet_amount < 300) {
            canBet = true;
        }
    }
});




function moveChip(chipElement, destinationId) {
    let chipClone = chipElement.clone();
    let destination = $(`#${destinationId}`);

    if(canBet === false) {
        return;
    }

    // append the clone to the pile right away, and position it absolutely relative to the pile
    chipClone.appendTo(destination);
    chipClone.css({
        position: 'absolute',
        top: chipElement.offset().top - destination.offset().top,
        left: chipElement.offset().left - destination.offset().left,
        'z-index': 1000
    });

    // animate the chip to the center of the pile, and add a little randomness to the final position
    chipClone.animate({
        top: '50%',
        left: '50%',
        marginTop: (Math.random() - 0.5) * 20,
        marginLeft: (Math.random() - 0.5) * 20
    }, 'slow');

    // Add the data-value attribute to the chip clone
    chipClone.attr('data-value', chipElement.attr('data-value'));
}

// Updating bet functions with animation
$("#b-1").click(function () {
    updateBet(1);
    moveChip($(this), 'pile');
});

$("#b-5").click(function () {
    updateBet(5);
    moveChip($(this), 'pile');
});

$("#b-10").click(function () {
    updateBet(10);
    moveChip($(this), 'pile');
});

$("#b-20").click(function () {
    updateBet(20);
    moveChip($(this), 'pile');
});

ws.addEventListener('message', function(event) {
    try {
        let message = JSON.parse(event.data);
        if (message.type === 'gameState') {
            // Update game state based on the received game state
            yourSum = message.yourSum;
            dealerSum = message.dealerSum;
            dealerAce = message.dealerAce;
            yourAce = message.yourAce;
            unFlipped = message.unFlipped;
            deck = message.deck;
            playerHasBlackjack = message.playerHasBlackjack;
            canBet = message.canBet;

            // Update UI elements
            document.getElementById("yourScore").innerHTML = yourSum;
            document.getElementById("notYourScore").innerHTML = dealerSum;
            document.getElementById("balance").innerHTML = "Balance: " + message.balance;
            // ... update other UI elements based on the game state ...
        }
    } catch (error) {
        console.error('Received a message that is not valid JSON:', event.data);
    }
});


// create deck
function build() {
    let values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    let type = ['club', 'diamond', 'heart', 'spade'];
    deck = [];

    for (let i = 0; i < type.length; i++) {
        for (let j = 0; j < values.length; j++) {
            deck.push(values[j] + '_' + type[i]);
        }
    }
}

// shuffle deck
function shuffle() {
    for (let i = deck.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

// hit button
function hitbtn() {
    if (!allowHit) {
        return;
    }

    let $newCard = $('<img />');
    let card = deck.pop();
    let url = "/../images/fullDeck/" + card + ".png";
    $newCard.attr('src', url);
    yourSum += cardValue(card);
    yourAce += checkForAce(card);
    let $insertCard = $('#e');
    $insertCard.append($newCard);

    if (changeAce(yourSum, yourAce) > 21) {
        allowHit = false;
    }
    $("#yourScore").text(yourSum);
    ws.send(JSON.stringify({ type: 'hit' }));
}

function cardValue(card) {
    let data = card.split('_');
    let value = data[0];

    if (isNaN(value)) {
        if (value == 'A') {
            return 11;
        }
        return 10;
    }
    return parseInt(value);
}

// start game
function gameStart() {

    // playSoundOnce(sound2);
    Body.classList.toggle("second-img");
    endGameRefresh();
    $(".replay").hide();
    $(".leave").hide();
    $("#doubleBtn").show();
    exit.disabled = true;

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

    for (i = 0; i < 2; i++) {
        let $newCard = $('<img />');
        let card = deck.pop();
        let url = "/../images/fullDeck/" + card + ".png";
        $newCard.attr('src', url);
        
        let cardVal = cardValue(card);
        //check if card is an ace
        //if card is an ace, add 1 to yourAce
        yourAce += checkForAce(card);
        //add card value to yourSum
        yourSum += cardVal;
    
        // If the card is an ace and yourSum exceeds 21, treat the ace as 1 instead of 11
        if (yourSum > 21 && yourAce > 0) {
            yourSum -= 10;
            yourAce -= 1;
        }
    
        let $insertCard = $('#e');
        $insertCard.append($newCard);
    }

    // Check if the player has a blackjack
    if (yourSum === 21 && yourAce === 1) {
        playerHasBlackjack = true;
    }
    
    console.log(yourSum, 'yourSum');
    $("#yourScore").text(yourSum);

    ws.send(JSON.stringify({ type: 'startGame', bet: bet_amount }));
}






function checkForAce(card) {
    if (card[0] == 'A') {
        return 1;
    }
    return 0;
}

function changeAce(a, b) {
    while (a > 21 && b > 0) {
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


function dealerHand() {


    let $newCard = $('<img />');
    let card = deck.pop();
    let url = "/../images/fullDeck/" + card + ".png";
    $newCard.attr('src', url);
    dealerSum += cardValue(card);

    dealerAce += checkForAce(card);
    let $dealerHand = $('#b');
    $dealerHand.append($newCard);



    return;
}

$(document).ready(function () {
    $(".make-bet").click(gameStart);

});