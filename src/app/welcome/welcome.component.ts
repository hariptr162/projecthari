import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  name: string;
  constructor(private route: ActivatedRoute) { 
    this.route.params.subscribe(res => {  this.name = res.name });
  }

  ngOnInit() {
  }

}
