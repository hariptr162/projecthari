import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from './././data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  name: string="";
  constructor(private _router: Router, private _dataService: DateSer) { }

  ngOnInit() {
  }

  go() {

    this._router.navigate(["welcome", this.name]);
  }

}
