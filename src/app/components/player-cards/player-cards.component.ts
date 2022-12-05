import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { faCaretLeft, faCaretRight, faCrosshairs, faDownload, faGlobe, faRotate, faSatelliteDish, faToggleOff, faToggleOn, faUserMinus } from '@fortawesome/free-solid-svg-icons';
import { finalize, from, mergeMap } from 'rxjs';
import { Player } from 'src/app/classes/player';
import { SongScore } from 'src/app/classes/songScore';
import { PlayerService } from 'src/app/services/player.service';
import { ScoreService } from 'src/app/services/score.service';
import twemoji from 'twemoji';
import * as lookup from 'country-code-lookup';
import { PlaylistService } from 'src/app/services/playlist.service';
import { Playlist } from 'src/app/classes/playlist';

@Component({
  selector: 'app-player-cards',
  templateUrl: './player-cards.component.html',
  styleUrls: ['./player-cards.component.scss']
})
export class PlayerCardsComponent implements OnInit, OnDestroy {

  // TODO: add periodic fetching of player profiles to get updated playcounts

  faIcons = {
    globe: faGlobe,
    caretLeft: faCaretLeft,
    caretRight: faCaretRight,
    rotate: faRotate,
    crosshairs: faCrosshairs,
    toggleOn: faToggleOn,
    toggleOff: faToggleOff,
    userMinus: faUserMinus,
    satelliteDish: faSatelliteDish,
    download: faDownload,
  }

  @Input() players: Player[] = [];
  @Output() playerMoved = new EventEmitter<Player>();
  @Output() snipeAction = new EventEmitter<Player>();
  scoresCurrentPlayers: { [player_id: string]: SongScore[] };

  loadingPlayerScores: { [player_id: string]: boolean } = {};

  constructor(
    private scoreService: ScoreService,
    private playerService: PlayerService,
    private sanitizer: DomSanitizer,
    private playlistService: PlaylistService,
  ) { }
  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    this.scoresCurrentPlayers = this.scoreService.getScoresCurrentPlayers();
  }

  // Not sure if this is the best way to do this, but it works 👍
  parseEmoji(countryCode: string) {
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char =>  127397 + char.charCodeAt(null));
    const emoji = String.fromCodePoint(...codePoints);

    var div = document.createElement('div');
    div.textContent = emoji;
    twemoji.parse(div);

    var img = div.querySelector('img');
    img.title = lookup.byIso(countryCode).country;
    return this.sanitizer.bypassSecurityTrustHtml(img.outerHTML);
  }

  addedPlayer(player: Player) {
    this.reloadPlayerScores(player);
  }


  // Moving player cards
  movePlayerToTarget(player: Player) {
    const index = this.players.indexOf(player);
    this.players.splice(index, 1);
    this.players.splice(1, 0, player);
    this.playerMoved.emit();
  }
  movePlayerFarLeft(player: Player) {
    const index = this.players.indexOf(player);
    this.players.splice(index, 1);
    this.players.unshift(player);
    this.playerMoved.emit();
  }
  movePlayerLeft(player: Player) {
    const index = this.players.indexOf(player);
    this.players.splice(index, 1);
    this.players.splice(index - 1, 0, player);
    this.playerMoved.emit();
  }
  movePlayerRight(player: Player) {
    const index = this.players.indexOf(player);
    this.players.splice(index, 1);
    this.players.splice(index + 1, 0, player);
    this.playerMoved.emit();
  }
  movePlayerFarRight(player: Player) {
    const index = this.players.indexOf(player);
    this.players.splice(index, 1);
    this.players.push(player);
    this.playerMoved.emit();
  }



  toggleShown(player: Player) {
    player.shown = !player.shown;
    this.playerService.storePlayers(this.players);
  }

  makeSnipePlaylist(player: Player) {
    this.snipeAction.emit(player);
  }

  removePlayerScores(player: Player) {
    this.scoreService.removePlayerScores(player.id)
  }







  reloadPlayerScores(player: Player) {
    this.loadingPlayerScores[player.id] = true;
    this.playerService.getProfile(player.id).subscribe({
      next: (profile: any) => {
        this.playerService.addPlayer(profile);
        this.getPlayerScores(profile);
      },
      error: (err) => {
        this.loadingPlayerScores[player.id] = false;
        console.error(err)
      }
    });
  }

  getPlayerScores(player: Player) {

    this.scoresCurrentPlayers[player.id] = [];

    const name = player.name;
    const ss_id = player.id;
    const playCount = player.scoreStats.totalPlayCount;
    const pages = Math.ceil(playCount / 100)
    console.log(`Geting`, playCount, `scores for ${name}, in`, pages, `pages`)

    const observables = [];
    for (let page = 1; page <= pages; page++) {
      observables.push(this.scoreService.getScores(ss_id, page))
    }

    const concurrency = 10;
    const playerScores: SongScore[] = [];

    const start = performance.now()

    from(observables)
      .pipe(mergeMap(obj => obj, concurrency))
      .pipe(finalize(() => this.loadingPlayerScores[player.id] = false))
      .subscribe({
        next: (e: any) => {
          playerScores.push(...e['playerScores'])
          this.scoresCurrentPlayers[ss_id] = playerScores;
        },
        error: (err) => console.error(err),
        complete: () => {
          console.log(`${name}:`, Math.round(performance.now() - start) / 1000, 'seconds')
          // this.scoreService.memorySizeTesting(playerScores)

          this.scoreService.storeScoresPlayer(ss_id, playerScores)
        },
      });
  }


  downloadTrackingPlaylist(player: Player, type: 'recent' | 'top') {
    this.playlistService.downloadTrackingPlaylist(player, type).subscribe(
      (playlist: Playlist) => {
        let image_base64 = this.getBase64Image(document.getElementById(`profilePicture-${player.id}`));
        playlist.image = image_base64;
        const blob = new Blob([JSON.stringify(playlist)], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${player.name} ${type} scores.bplist`;
        link.click();
      }
    );
  }

  getBase64Image(img: any) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width * 2;
    canvas.height = img.height * 2;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    var dataURL = canvas.toDataURL("image/png");
    return dataURL
  }


  // emoji: "I ❤️ twemoji!"
  // getFlag() {
  //   return twemoji.parse(`I ${twemoji.convert.fromCodePoint('1f1e7')}${twemoji.convert.fromCodePoint('1f1ea')} twemoji!`, {
  //     folder: 'svg',
  //     ext: '.svg'
  //   });
  //   console.log(twemoji.convert.fromCodePoint('1f1e7-1f1ea'))
  // }

}
