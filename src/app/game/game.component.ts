import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { ActivatedRoute } from '@angular/router';
import { Type } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  public playerName: string;
  public game: any;
  public myCards: any;
  public cardCounts: any;
  public cardTransform: any = { 11: "J", 12: "Q", 13: "K", 14: "A" };
  public cardTypes: string[] = ["S", "C", "D", "H"];
  public currentCards: any = {};
  constructor(
    private _dataService: DataService,
    private route: ActivatedRoute) {
    route.params.subscribe(res => { this.Init(res.name); });
  }

  ngOnInit() {
  }

  private Init(playerName: string) {
    this.playerName = playerName;
    this.getGame();
  }

  public getGame() {
    setTimeout(() => {
      this._dataService.getGame(this.playerName).then((data) => {
        this.game = data.game;
        this.cardCounts = data.cardCounts;
        let myCards = {
          "S": [],
          "D": [],
          "C": [],
          "H": []
        };
        if (data && data.cards) {
          for (var cardi in data.cards) {
            myCards[data.cards[cardi].type].push(data.cards[cardi]);
          }
        }
        for (var type in myCards) {
          myCards[type].sort((a, b) => a.number - b.number);
        }
        this.myCards = myCards;
        for (var playeri in this.game.players) {
          var player = this.game.players[playeri];
          var round = this.game.currentRound.filter(n => n.player == player)[0];
          this.currentCards[player] = round ? round.card: undefined;
        }
      });
      //this.getGame();
    }, 1);
  }

  public startGame() {
    this._dataService.startGame();
  }

  public paly(card) {
    this._dataService.play(this.playerName, card);
  }

  public startRound() {
    this._dataService.startRound();
  }

  public getCardDisplay(card) {
    return ((this.cardTransform[card.number] ? this.cardTransform[card.number] : card.number) + " " + card.type);
  }

  public getCurrentRoundCard(player: string) {
    if (!!this.currentCards[player]) {
      return this.getCardDisplay(this.currentCards[player]);
    }
    return "";
  }

}
