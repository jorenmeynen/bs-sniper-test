import { Injectable } from '@angular/core';
import { Player } from '../classes/player';
import { PlayerScore } from '../classes/playerScore';
import { Playlist } from '../classes/playlist';
import { ScoresTableRow } from '../classes/ScoresTableRow';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {

  constructor(
    private apiService: ApiService,
  ) { }


  makeSnipePlaylist(sniper: Player, snipee: Player, scoresTableRows: ScoresTableRow[], snipeCount: number): Playlist {
    console.log("sniper:", sniper, "snipee:", snipee, "scoresTableRows:", scoresTableRows);
    let playlist = new Playlist();
    playlist.playlistTitle = this.getPlaylistName(snipee);
    playlist.playlistAuthor = `ss-details.herokuapp.com`;
    playlist.playlistDescription = `Generated playlist for ${sniper.name} to snipe ${snipee.name}`;
    playlist.image = `${snipee.profilePicture}`;

    for (let i = 0; i < scoresTableRows.length; i++) {
      const scoresTableRow = scoresTableRows[i];
      const sniperScore: PlayerScore = scoresTableRow[sniper.id];
      const snipeeScore: PlayerScore = scoresTableRow[snipee.id];
      if (!snipeeScore) continue;
      if (sniperScore?.baseScore > snipeeScore.baseScore) continue;

      const currentSong = playlist.songs.find((song: any) => song.hash === scoresTableRow.hash);
      if (currentSong || playlist.songs.length < snipeCount) {
        playlist.addSong(scoresTableRow);
      }

    }
    sniper
    playlist.playlistAuthor = "ss-details.herokuapp.com"


    return playlist;
  }

  getPlaylistName(player: Player): string {
    const getDateToday = () => {
      const date = new Date();
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      return `${year}-${month}-${day}`;
    }
    return `Snipe ${player.name} ${getDateToday()}`;
  }

  postSnipePlaylistSettings(sniper: Player, songCount: number, playlist: Playlist) {
    return this.apiService.get("playlist/", { 'ss_id': sniper.id, 'name': sniper.name, 'songCount': songCount, 'playlistTitle': playlist.playlistTitle, 'playlistSongs': playlist.songs.map(e => e.levelid) });
  }

  downloadTrackingPlaylist(player: Player, type: 'recent' | 'top') {
    const params = {
      'ss_id': player.id,
      'song_count': 20,
      'page_number': 1,
      'last_request': 0
    }
    return this.apiService.get(`track/${type}`, params);
  }
}
