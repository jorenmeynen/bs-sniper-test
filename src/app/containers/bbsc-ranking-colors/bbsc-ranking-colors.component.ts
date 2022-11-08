import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bbsc-ranking-colors',
  templateUrl: './bbsc-ranking-colors.component.html',
  styleUrls: ['./bbsc-ranking-colors.component.scss']
})
export class BbscRankingColorsComponent implements OnInit {

  colors = {
    'current': {

    },
    'suggested': {
      "mods": "#00F2FF",
      "100 ": "#D904AB",
      "250 ": "#FA0501",
      "500 ": "#DE5A0B",
      "1000 ": "#F5A700",
      "2500 ": "#F5E405",
      "5000 ": "#65FF00",
      "5000+": "#0CE85C",
    }
  }

  constructor() { }

  ngOnInit(): void {
  }

  getObjectKeys<T>(obj: T) {
    return Object.keys(obj) as Array<keyof T>;
  }

}
