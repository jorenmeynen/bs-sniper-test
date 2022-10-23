import { Component, OnInit } from '@angular/core';
import { SubscriptionLike } from 'rxjs';
import { PlayerService } from 'src/app/services/player.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {


  playersSubscription: SubscriptionLike;
  players: any[] = [];


  constructor(
    private playerService: PlayerService
  ) { }

  ngOnInit(): void {
    this.players = this.playerService.loadPlayers();
    this.playersSubscription = this.playerService.playersEventEmitter.subscribe(
      (players: any) => this.players = players,
    );
  }

  addPlayer(player: any) {
    console.log("dashboard:", player)
    this.players.push(player)
  }

  removePlayer(player: any) {
    const players = this.players.filter(p => p.id !== player.id)
    this.playerService.storePlayers(players);
  }


}
