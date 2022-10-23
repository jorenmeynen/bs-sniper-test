import { EventEmitter, Injectable } from '@angular/core';
import { Player } from '../classes/player';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  private players: Player[] = [];

  public playersEventEmitter: EventEmitter<any> = new EventEmitter(true);

  constructor(
    private apiService: ApiService,
  ) { this.reloadFromStorage() }



  reloadFromStorage() {
    const players = window.localStorage.getItem('players');

    if (players) {
      this.players = JSON.parse(players);
    }
  }

  addPlayer(player: any) {
    const ids = this.players.map(p => p.id);
    const player_index = ids.indexOf(player.id);
    if (player_index === -1) {
      player.shown = true;
      this.players.push(player)
    } else {
      this.players[player_index] = player;
    }
    this.storePlayers(this.players)
  }

  storePlayers(players: any, emit = true) {
    window.localStorage.setItem('players', JSON.stringify(players));
    this.players = players;
    if (emit) this.playersEventEmitter.emit(players);
  }

  loadPlayers() {
    return this.players;
  }


  getPlayers(search: string) {
    return this.apiService.get("players/", { 'search': search })
  }

  getProfile(player_id: string) {
    return this.apiService.get("profile/", { 'ss_id': player_id })
  }

  removePlayer(player_id: string) {
    const players = this.players.filter(p => p.id !== player_id)
    this.storePlayers(players);
  }
}
