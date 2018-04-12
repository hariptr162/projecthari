import { Injectable } from '@angular/core';

import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Promise } from 'q';

@Injectable()
export class DataService {

  result:any;

  constructor(private _http: Http) { }

  public getGame(playerName) {
    var promise = Promise<any>((resolve, reject) => {
      return this._http.get("/api/game?p=" + playerName)
        .toPromise().then(
          result => resolve(result.json().data),
          () => reject("error"));
    });
    return promise;
  }

  public joinGame(playerName) {
    var promise = Promise((resolve, reject) => {
      return this._http.post("/api/players?p=" + playerName, null)
        .toPromise().then(
          result => resolve(result.json().data),
          () => reject("error"));
    });
    return promise;
  }

  public startGame() {
    var promise = Promise((resolve, reject) => {
      return this._http.post("/api/game/start", null)
        .toPromise().then(
          result => resolve(result.json().data),
          () => reject("error"));
    });
    return promise;
  }

  public startRound() {
    var promise = Promise<any>((resolve, reject) => {
      return this._http.post("/api/round/start", null)
        .toPromise().then(
          result => resolve(result.json().data),
          () => reject("error"));
    });
    return promise;
  }

  public play(name, card) {
    var promise = Promise((resolve, reject) => {
      return this._http.post("/api/play", {p: name, card: card})
        .toPromise().then(
          result => resolve(result.json().data),
          () => reject("error"));
    });
    return promise;
  }






}
