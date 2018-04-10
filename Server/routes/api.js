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

let game = {
    status: "Not Started",
    currentRound: [],
    nextPlayerIndex: 0,
    players: [],
    statusMessage: ""
}

function addPalyer(name) {
    let player = game.players.filter(n => n == name)[0];
    if(!!name && !player) {
        game.players.push(name);
        playerCards[name] = [];
    };
}

// Get users
router.get('/game', (req, res) => {
    let playerName = req.query.p;
    let player = game.players.filter(n => n == playerName)[0];
    let cardCounts = {};
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


router.post('/users', (req, res) => {
    let palyerName = req.query.p;
    addPalyer(palyerName);
    response.data = {};
    res.json(response);
});

module.exports = router;