import { EventEmitter, Injectable } from '@angular/core';
import * as LZString from 'lz-string';
import { SizeTest } from '../classes/LocalStorageSizeTest';
import { SongScore } from '../classes/songScore';
import { ApiService } from './api.service';
import { PlayerService } from './player.service';

@Injectable({
  providedIn: 'root'
})
export class ScoreService {

  private scoresCurrentPlayers: any = {};
  public scoresPlayersEventEmitter: EventEmitter<any> = new EventEmitter(true);

  constructor(
    private apiService: ApiService,
    private playerService: PlayerService,
  ) { this.reloadFromStorage() }


  reloadFromStorage() {
    const players = this.playerService.loadPlayers();
    for (let i = 0; i < players.length; i++) {
      const player = players[i];

      const scorePlayer = window.localStorage.getItem(`${player.id}`);
      if (scorePlayer) {
        // this.speedTestFromStorage(scorePlayer);
        this.scoresCurrentPlayers[player.id] = this.unpivot(this.csvToArr2D(LZString.decompress(scorePlayer)));
      }
    }
    console.log("scoresCurrentPlayers", this.scoresCurrentPlayers)
  }

  storeScoresPlayer(ss_id: string, scores: any[]) {
    try {
      // window.localStorage.setItem(`${ss_id}`, JSON.stringify(scores));
      // window.localStorage.setItem(`${ss_id}`, JSON.stringify(this.pivot(scores)));
      window.localStorage.setItem(`${ss_id}`, LZString.compress(this.arr2DtoCsv(this.pivot(scores))));
    } catch (err) {
      console.log("LocalStorage Error:", err)
    }
    this.scoresCurrentPlayers[ss_id] = scores;
    this.scoresPlayersEventEmitter.emit(this.scoresCurrentPlayers)
  }

  storeScoresCurrentPlayers(scoresCurrentPlayers: any) {
    window.localStorage.setItem('scoresCurrentPlayers', JSON.stringify(scoresCurrentPlayers));
    this.scoresCurrentPlayers = scoresCurrentPlayers;
    this.scoresPlayersEventEmitter.emit(this.scoresCurrentPlayers)
  }

  getScoresCurrentPlayers() {
    return this.scoresCurrentPlayers;
  }

  getScoresFull(ss_id: string) {
    return this.apiService.get("scores/full/", { ss_id: ss_id })
  }

  getScores(ss_id: string, page_number: number) {
    return this.apiService.get("scores/", { 'ss_id': ss_id, 'page_number': page_number })
  }

  removePlayerScores(ss_id: string) {
    delete this.scoresCurrentPlayers[ss_id]
    window.localStorage.removeItem(`${ss_id}`);
    this.playerService.removePlayer(ss_id);
    this.scoresPlayersEventEmitter.emit(this.scoresCurrentPlayers);
  }


  pivot(arr: any[]): [][] {
    var mp = new Map();

    function setValue(a: any, path: any, val: any) {
      if (Object(val) !== val) { // primitive value
        var pathStr = path.join('.');
        var i = (mp.has(pathStr) ? mp : mp.set(pathStr, mp.size)).get(pathStr);
        a[i] = val;
      } else {
        for (var key in val) {
          setValue(a, key == '0' ? path : path.concat(key), val[key]);
        }
      }
      return a;
    }

    var result = arr.map((obj: object) => setValue([], [], obj));
    return [[...mp.keys()], ...result];
  }

  // unpivot(arr: [][]) {
  //   let new_arr: any[] = [];
  //   const keys: string[] = arr[0];

  //   for (let i = 1; i < arr.length; i++) {
  //     let obj: any = {};
  //     for (let j = 0; j < keys.length; j++) {
  //       const [main, sub] = keys[j].split('.');
  //       if (!obj[main]) obj[main] = {};
  //       obj[main][sub] = arr[i][j];
  //     }
  //     new_arr.push(obj);
  //   }
  //   return new_arr
  // }

  unpivot(arr: string[][]) {
    let new_arr: any[] = [];
    const keys: string[] = arr[0];

    for (let i = 1; i < arr.length; i++) {
      let songScore = new SongScore();
      songScore.setValues(keys, arr[i])
      new_arr.push(songScore);
    }
    return new_arr
  }

  arr2DtoCsv(arr: any[], delimiter: string = '\t') {
    return arr.map(row => {
      return row.map((val: any) => {
        if (typeof val === 'string') return val.replace(/\t|\n/g, ' ');
        else if (typeof val === 'boolean') return +val;
        else return val;
      }).join(delimiter);
    }
    ).join('\n');
  }

  csvToArr2D(csv: string, delimiter: string = '\t') {
    return csv.split('\n').map(row => row.split(delimiter));
  }





  speedTestFromStorage(scorePlayer: string) {

    let start: number;

    start = performance.now();
    const decomp = LZString.decompress(scorePlayer);
    const time_decomp = performance.now() - start;

    start = performance.now();
    const arr2d = this.csvToArr2D(decomp);
    const time_arr2d = performance.now() - start;

    start = performance.now();
    const back = this.unpivot(arr2d);
    const time_back = performance.now() - start;

    let tests: SizeTest[] = [
      new SizeTest('decomp:  ', decomp, time_decomp),
      new SizeTest('arr2d:   ', JSON.stringify(arr2d), time_arr2d),
      new SizeTest('back:    ', JSON.stringify(back), time_back),
    ];
    tests.forEach((test) => test.log());

    console.log("arr2d:", arr2d)
    console.log("back:", back)
  }

  memorySizeTesting(playerScores: SongScore[]) {
    let start: number;

    start = performance.now();
    const base1 = JSON.stringify(playerScores)
    const time_base1 = performance.now() - start;

    start = performance.now();
    const base2 = JSON.stringify(this.pivot(playerScores))
    const time_base2 = performance.now() - start;

    start = performance.now();
    const base3 = this.arr2DtoCsv(this.pivot(playerScores))
    const time_base3 = performance.now() - start;



    start = performance.now();
    const comp1 = LZString.compress(JSON.stringify(playerScores))
    const time_lz1 = performance.now() - start;

    start = performance.now();
    const comp2 = LZString.compress(JSON.stringify(this.pivot(playerScores)))
    const time_lz2 = performance.now() - start;

    start = performance.now();
    const comp3 = LZString.compress(this.arr2DtoCsv(this.pivot(playerScores)))
    const time_lz3 = performance.now() - start;

    let tests: SizeTest[] = [
      new SizeTest('object[]: ', base1, time_base1),
      new SizeTest('2D array:', base2, time_base2),
      new SizeTest('csv:     ', base3, time_base3),
      new SizeTest('lz object[]:', comp1, time_lz1),
      new SizeTest('lz 2D array:', comp2, time_lz2),
      new SizeTest('lz csv:     ', comp3, time_lz3),
    ]

    tests.forEach((test) => test.log())



    // let end: number;
    // start = performance.now();
    // const uncomp1 = LZString.decompress(comp1)
    // end = performance.now();
    // console.log('-lz default: ', Math.round(end-start), 'ms')

    // start = performance.now();
    // const uncomp2 = LZString.decompress(comp2)
    // end = performance.now();
    // console.log('-lz 2D array:', Math.round(end-start), 'ms')

    // start = performance.now();
    // const uncomp3 = LZString.decompress(comp3)
    // end = performance.now();
    // console.log('-lz csv:    ', Math.round(end-start), 'ms')

  }

}
