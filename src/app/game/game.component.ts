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

  private playerName: string;
  private game: any;
  private myCards: any;
  private cardCounts: any;
  private cardTransform: any = { 11: "J", 12: "Q", 13: "K", 14: "A" };
  private cardTypes: string[] = ["S", "C", "D", "H"];
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

  private getGame() {
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
      });
      //this.getGame();
    }, 1);
  }

  private startGame() {
    this._dataService.startGame();
  }

  private paly(card) {
    this._dataService.play(this.playerName, card);
  }

  private startRound() {
    this._dataService.startRound();
  }

  private getCardDisplay(card) {
    return ((this.cardTransform[card.number] ? this.cardTransform[card.number] : card.number) + " " + card.type);
  }

  private getCurrentRoundCard(player: string) {
    var card = this.game.currentRound.filter(n => n.player == player)[0];
    if (!!card) {
      return this.getCardDisplay(card.card);
    }
  }

}
