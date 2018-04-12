import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { ActivatedRoute } from '@angular/router';

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
      this.getGame();
    }, 10000);
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

}
