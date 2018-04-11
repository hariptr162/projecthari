const express = require('express');
const router = express.Router();
// const MongoClient = require('mongodb').MongoClient;
// const ObjectID = require('mongodb').ObjectID;

// // Connect
// const connection = (closure) => {
//     return MongoClient.connect('mongodb://localhost:27017/mean', (err, db) => {
//         if (err) return console.log(err);

//         closure(db);
//     });
// };

// Error handling
const sendError = (err, res) => {
    response.status = 501;
    response.message = typeof err == 'object' ? err.message : err;
    res.status(501).json(response);
};

// Response handling
let response = {
    status: 200,
    data: {},
    message: null
};

let playerCards = {};
let game = undefined

function getGame () {
    if(!game) {
        game = {
            players: [],
        };
    }
    game.status =  "Not Started";
    game.currentRound = [];
    game.nextPlayerIndex = 0;
    game.message = "";
    game.currentRoundEnded = false;
    return game;
}
game = getGame();

function getDeckOfCards() {
  let cards = [];
  let types = ["S", "C", "H", "D"];
  for (let type in types) {
    for (let num = 2; num <= 14; num++) {
      cards.push( {
          type: type,
          number: num
      });
    }
  }
  return cards;
}

function addPalyer(name) {
    let player = game.players.filter(n => n == name)[0];
    if(!!name && !player) {
        game.players.push(name);
        playerCards[name] = [];
    };
}

function shuffle(array) {
  var ctr = array.length, temp, index;
  while (ctr > 0) {
    // Pick a random index
    index = Math.floor(Math.random() * ctr);
    // Decrease ctr by 1
    ctr--;
    // And swap the last element with it
    temp = array[ctr];
    array[ctr] = array[index];
    array[index] = temp;
  }
  return array;
}

function removeCardFromPlayer(playerName, card) {
    playerCards[playerName] = palyerCards.filter(n => n.type != card.type || n.number != card.number);
}

// Get users
router.get('/game', (req, res) => {
    let playerName = req.query.p;
    let player = game.players.filter(n => n == playerName)[0];
    let cardCounts = {};
    response.data = {};
    if(!!player){
        for(var name in playerCards) {
            cardCounts[name] = playerCards[name].length;
        }
        response.data = {
            game: game,
            cardCounts: cardCounts,
            cards: playerCards[playerName].cards
        };
    }
    res.json(response);
});

router.post('/game/start', (req, res) => {
  if (game.status != "Started") {
    game = getGame();
    var cards = getDeckOfCards();
    cards = shuffle(cards);
    while (cards.length > 0) {
      for (var index in game.players) {
        var player = game.players[index];
        if (!playerCards[player]) {
          playerCards[player] = [];
        }
        if (cards.length == 0) {
          break;
        }
        var card = cards.pop();
        playerCards[player].push(card);
        if(card.type == "S" && card.number == 13) {
            game.nextPlayerIndex = index;
        }
      }
    }
    game.status = "Started";
    game.message = "Game Started!. Hi " + game.players[0] + " its your turn!"
  }
    response.data = {};
    res.json(response);
});


router.post('/players', (req, res) => {
    let palyerName = req.query.p;
    addPalyer(palyerName);
    response.data = {};
    res.json(response);
});


router.post('/play', (req, res) => {
    let palyerName = req.body.p;
    let card = req.body.card;
    let cardTypeIn = card.type;
    let cardType = cardTypeIn;
    removeCardFromPlayer(playerName, card);
    game.currentRound.push({
        player: playerName,
        card: card
    });
    if(game.currentRound && game.currentRound.length > 0) {
        cardType = game.currentRound[0].card.type;
    }
    
    if(cardType != cardTypeIn) {
        game.CurrentRoundEnded = true;
        game.message = "Current round ended. Rejected by " + playerName + " Start new round."
    }
    else if(game.currentRound.length == game.players.length) {
        game.CurrentRoundEnded = true;
        game.message = "Current round ended";
    }
    else {
        game.nextPlayerIndex += 1;
        game.message = game.players[game.nextPlayerIndex] + "'s turn."; 
    }
    response.data = {};
    res.json(response);
});

router.post('/round/start', (req, res) => {
    if(game.currentRoundEnded) {
        var rejectCard;
        var currLength = game.currentRound.length-1;
        if(game.currentRound[currLength-1].card.type != game.currentRound[currLength-2].card.type) {
            rejectCard = game.currentRound.pop();
        }
        game['currentRound'].sort((a, b) => a.card.number - b.card.number);
        var highPlayer = game.currentRound.pop();
        game.nextPlayerIndex = game.players.indexOf(highPlayer.player);
        while(game.currentRound.length > 0){
            playerCards[highPlayer.player].push(game.currentRound.pop().card);
        }
        game.message = game.players[game.nextPlayerIndex] + "'s turn."; 
    }
    response.data = {};
    res.json(response);
});


module.exports = router;
