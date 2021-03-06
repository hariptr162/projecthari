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
          type: types[type],
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
    playerCards[playerName] = playerCards[playerName].filter(n => n.type != card.type || n.number != card.number);
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
            cards: playerCards[playerName]
        };
    }
    res.json(response);
});

router.post('/game/start', (req, res) => {
  if (game.status != "Started") {
    game = getGame();
    var cards = getDeckOfCards();
    cards = shuffle(cards);
    playerCards = {};
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
        if(card.type == "S" && card.number == 14) {
            game.nextPlayerIndex = parseInt(index);
        }
      }
    }
    game.status = "Started";
    game.message = "Game Started!." + game.players[game.nextPlayerIndex] + ", its your turn!"
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
    let playerName = req.body.p;
    if(!!playerName && game.players[game.nextPlayerIndex] == playerName) {
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
        
        if (cardType != cardTypeIn) {
            game.currentRoundEnded = true;
            game.message = "Current round ended. Rejected by " + playerName + " Start new round."
        }
        else {
            game.nextPlayerIndex += 1;
            game.nextPlayerIndex = game.nextPlayerIndex % game.players.length;
            while (game.players[game.nextPlayerIndex] != playerName) {
                if (playerCards[game.players[game.nextPlayerIndex]].length > 0) {
                    break;
                }
                game.nextPlayerIndex += 1;
                game.nextPlayerIndex = game.nextPlayerIndex % game.players.length;
            }
            if (game.players[game.nextPlayerIndex] == game.currentRound[0].player) {
                game.currentRoundEnded = true;
                game.message = "Current round ended."
            }
            else {
                game.message = game.players[game.nextPlayerIndex] + "'s turn.";
            }
        }
        let remaining = game.players.filter((p) => playerCards[p].length > 0);
        if (remaining.length == 1) {
            game.message = "Game Ended. " + remaining[0] + " is the loser."
            game.status = "Ended";
        }
    }
    response.data = {};
    res.json(response);
});

router.post('/round/start', (req, res) => {
    if(game.currentRoundEnded) {
        var rejectCard;
        var currLength = game.currentRound.length;
        if(game.currentRound[currLength-1].card.type != game.currentRound[currLength-2].card.type) {
            rejectCard = game.currentRound.pop();
            currLength = currLength - 1;
        }
        game['currentRound'].sort((a, b) => a.card.number - b.card.number);
        var highPlayer = game.currentRound[currLength-1];
        game.nextPlayerIndex = game.players.indexOf(highPlayer.player);
        while(game.currentRound.length > 0){
            var card = game.currentRound.pop().card;
            if(!!rejectCard) {
                playerCards[highPlayer.player].push(card);
            }
        }
        if(!!rejectCard) {
            playerCards[highPlayer.player].push(rejectCard.card);
        }
        game.message = game.players[game.nextPlayerIndex] + "'s turn."; 
        game.currentRoundEnded = false;
    }
    response.data = {};
    res.json(response);
});


module.exports = router;
