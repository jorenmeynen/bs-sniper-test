import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SubscriptionLike } from 'rxjs';
import { SongScore } from 'src/app/classes/songScore';
import { PlayerService } from 'src/app/services/player.service';
import { ScoreService } from 'src/app/services/score.service';
import { Player } from 'src/app/classes/player';
import { DataTableDirective } from 'angular-datatables';
import { DecimalPipe } from '@angular/common';
import { Playlist } from 'src/app/classes/playlist';
import { PlaylistService } from 'src/app/services/playlist.service';
import { ScoresTableRow } from 'src/app/classes/ScoresTableRow';
import { LabelType, Options } from '@angular-slider/ngx-slider';
import { faEye as farEye, faEyeSlash as farEyeSlash } from '@fortawesome/free-regular-svg-icons';
import { faArrowUpRightFromSquare, faCheck, faCrosshairs, faDownload, faEye, faEyeSlash, faXmark } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-compare-scores',
  templateUrl: './compare-scores.component.html',
  styleUrls: ['./compare-scores.component.scss']
})
export class CompareScoresComponent implements OnInit, OnDestroy, AfterViewInit {

  faIcons = {
    crosshairs: faCrosshairs,
    download: faDownload,
    xmark: faXmark,
    check: faCheck,
    eyeR: farEye,
    eyeSlashR: farEyeSlash,
    eye: faEye,
    eyeSlash: faEyeSlash,
    openLink: faArrowUpRightFromSquare
  }

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;

  table_id: string = 'scoresTableId';
  table_selector: string = `#${this.table_id}`;
  players: Player[];
  playersScores: { [player_id: string]: SongScore[] } = {};
  scoresTable: any[] = [];
  // showScoresInCommon = true;
  showPlayedSongs = true;
  showRanked = true;

  
  optionsPlayed = [
    { value: 0, label: 'Played' },
    { value: 1, label: 'New Difficulties' },
    { value: 2, label: 'New Songs' },
    { value: 3, label: 'Played + New' },
  ];
  chosenPlayedOption: 'Played' | 'New Difficulties' | 'New Songs' | 'Played + New' = 'Played';



  minStars: number = null;
  maxStars: number = null;
  sliderOptions: Options = {
    floor: 0,
    ceil: 0,
    showTicks: true,
    showOuterSelectionBars: false,
    hidePointerLabels: false,

    animate: false,
    step: 0.01,
    enforceStep: false,
    enforceRange: false,
    showTicksValues: false,
    showSelectionBar: true,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return value + '★';
        case LabelType.High:
          return value + '★';
        default:
          return value + '★';
      }
    }
  };

  showSnipedSongsAlso = true;
  showFC = true;
  showDates = false;
  showPP = false;
  showDifference = false;

  snipeCount: number = null;
  snipeCountDefault = 20;

  dictDifficulty: any = {
    '1': { name: 'easy', symbol: 'E', class: 'easy' },
    '3': { name: 'normal', symbol: 'N', class: 'normal' },
    '5': { name: 'hard', symbol: 'H', class: 'hard' },
    '7': { name: 'expert', symbol: 'X', class: 'expert' },
    '9': { name: 'expert-plus', symbol: 'X+', class: 'expert-plus' },
  }

  main_player_id: string;
  target_player_id: string;

  dtOptions: DataTables.Settings = {};
  // test: DataTables.RowGroupSettings

  playersSubscription: SubscriptionLike;
  playersScoresSubscription: SubscriptionLike;

  constructor(
    private playerService: PlayerService,
    private scoreService: ScoreService,
    private decimalPipe: DecimalPipe,
    private playlistService: PlaylistService,
  ) { }
  ngAfterViewInit(): void {
    this.filterTable();
  }

  ngOnDestroy(): void {
    this.playersSubscription?.unsubscribe();
    this.playersScoresSubscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.players = this.playerService.loadPlayers();
    this.playersScores = this.scoreService.getScoresCurrentPlayers();
    this.main_player_id = this.players[0]?.id;
    this.target_player_id = this.players[1]?.id;

    this.playersSubscription = this.playerService.playersEventEmitter.subscribe(
      (players: Player[]) => {
        console.log('players', players)
        this.players = players;
        // Is this necessary still?
        this.main_player_id = players[0]?.id;
        this.target_player_id = players[1]?.id;
        // this.dtOptions.columns = this.buildColumns(this.players);
      }
    );
    this.playersScoresSubscription = this.scoreService.scoresPlayersEventEmitter.subscribe(
      (scores: { [player_id: string]: SongScore[] }) => {
        this.playersScores = scores;
        this.setScoresTable();
        this.recreateDataTable();
      },
    );

    this.setScoresTable();
    this.setDtOptions();
  }

  recreateDataTable(): void {
    const table_element = $(this.table_selector)
    var table = table_element.DataTable();
    table.destroy();
    table_element.empty(); // empty in case the columns change

    this.dtOptions.data = this.scoresTable;
    this.dtOptions.columns = this.buildColumns(this.players);
    table = table_element.DataTable(this.dtOptions);
  }

  round(num: number, precision: number) {
    return Math.round(num * Math.pow(10, precision)) / Math.pow(10, precision);
  }

  buildColumns(players: Player[]) {
    const playerColumns: DataTables.ColumnSettings[] = players.map((player: any, index) => {
      return {
        className: (index === 2) ? "border-dashed-left" : "",
        'title': player.name,
        'data': player.id,
        'defaultContent': '',
        render: (data: any, type: any, row: any, meta: any) => {
          let score: string;
          if (!data) score = '';
          else if (!row.ranked) score = this.decimalPipe.transform(data?.baseScore, '1.');
          else score = this.round(data?.baseScore / row.maxScore * 100, 2).toFixed(2) + '%';

          let comboInfo = '';
          if (!data || !this.showFC) comboInfo = '';
          else if (data.fullCombo) comboInfo = '';
          else comboInfo = ` <span class="bad-swing">x${+data.badCuts + data.missedNotes}</span>`;

          let timeSet = '';
          if (!data || !this.showDates) timeSet = '';
          else if (data.timeSet) {
            var date = new Date(data.timeSet).toISOString().slice(0, 10);
            timeSet = `<span style="opacity:0.6" class="text-nowrap">${date}</span>`;
          }

          let ppWorth = '';
          if (!data || !this.showPP || !this.showRanked) ppWorth = '';
          else if (data.pp) {
            ppWorth = `<span class="sub-text text-pp fw-bolder text-nowrap">${this.decimalPipe.transform(data.pp, '3.2-2')}pp</span>`;
          }

          let scoreDifference = '';
          if (!data || !this.showDifference || !row[players[0]?.id]?.baseScore) scoreDifference = '';
          else if (data.timeSet) {
            let diff = row[players[0]?.id]?.baseScore - data.baseScore;
            let abs_diff = Math.abs(diff);
            if (diff) {
              let diff_value = (row.ranked) ? this.decimalPipe.transform(abs_diff / row.maxScore * 100, '1.2-3')+'%' : abs_diff;
              scoreDifference = `<span style="opacity:0.6" class="text-nowrap">${diff_value} ${Math.sign(diff) < 0 ? '+' : '-'}</span>`;
            }
          }


          let scoreInfo = `<span class="text-nowrap">${score}${comboInfo}</span>`;
          let values: string[] = [];
          if (this.showDates) {
            values.push(timeSet);
          }
          if (this.showPP && this.showRanked) {
            values.push(ppWorth);
          }
          if (this.showDifference && row[players[0]?.id]?.baseScore) {
            values.push(scoreDifference);
          }
          values.push(scoreInfo);

          return `<div class="score px-2 py-1">${values.join('<br>')}</div>`

        }
      }
    });

    return [
      {
        title: "", data: "stars", className: "p-0 table-img", render: (data: any, type: any, row: any) => {
          const text_color = this.dictDifficulty[row.difficulty].class;
          return `
          <div class="position-relative d-flex align-items-center h-100">
            <img src="${row.coverImage}" class="image-size-50">
            <div class="tag ${text_color}">
              ${data ? data + '★' : this.dictDifficulty[row.difficulty].symbol}
            </div>
          <div>`
        }
      },
      {
        title: "Song", data: "songName", className: "py-1", render: (data: any, type: any, row: any) => `
        ${data}
        <span class="sub-text">${row.songSubName}</span>
        <br>
        <a href='https://beatsaver.com/?q=${row.hash}' target='_blank' title="Open in BeatSaver" class="text-decoration-none">
          <img src="assets/images/beatsaver_icon_mono.png" style="height: 20px">
        </a>
        <a href='https://scoresaber.com/leaderboard/${row.id}' target='_blank' title="Open in ScoreSaber" class="text-decoration-none">
          <img src="assets/images/scoresaber_icon_mono.png" style="height: 25px">
        </a>
        <span class="sub-text text-nowrap" style="color:lightblue">${row.songAuthorName}</span>
        <span class="sub-text text-nowrap">[<span style="color:#6eb66e">${row.levelAuthorName}</span>]</span>
        `
      },
      ...playerColumns
    ];
  }

  setDtOptions() {
    let song = this.scoresTable.find((score) => score.songName?.includes('umor'));
    console.log(song)
    this.dtOptions = {
      data: this.scoresTable,
      pageLength: 10,
      deferRender: true,
      order: [],
      columns: this.buildColumns(this.players),
      createdRow: (row: Node, row_data: any) => {
        const player_scores_td = $('td', row).slice(-this.players.length)

        const player_scores: number[] = this.players.map((player) => row_data[player.id]?.baseScore || 0);
        const index_highest_score = player_scores.indexOf(Math.max(...player_scores))
        const index_highest_score_sniper_target = player_scores.indexOf(Math.max(...player_scores.slice(0, 2)));

        player_scores_td.eq(index_highest_score).children().addClass("highest-score")
        if (index_highest_score !== index_highest_score_sniper_target) {
          player_scores_td.eq(index_highest_score_sniper_target).children().addClass("highest-score-sniper-target");
        }
      }
    }
    // this.dtOptions['rowGroup'] = { dataSrc: 'songName' };
  }

  // 76561198084876475:
  //   badCuts: 0
  //   baseScore: 401787
  //   fullCombo: true
  //   hasReplay: false
  //   hmd: 32
  //   id: 67105034
  //   maxCombo: 462
  //   missedNotes: 0
  //   modifiedScore: 401787
  //   modifiers: ""
  //   multiplier: 1
  //   player_name: "JorenM"
  //   pp: 89.5634
  //   rank: 410
  //   timeSet: "2022-02-06T00:10:08.000Z"
  //   weight: 0.06669231828195633
  // coverImage: "https://cdn.scoresaber.com/covers/236173D5BA7DC379D480B9CB5FB6B4FA5ABE77DA.png"
  // difficulty: 3
  // gameMode: "SoloStandard"
  // hash: "236173D5BA7DC379D480B9CB5FB6B4FA5ABE77DA"
  // id: 14388
  // maxScore: 417795
  // ranked: true
  // songName: "Mr. Blue Sky"
  // songSubName: ""
  // stars: 1.86

  getPlayerById(player_id: string): Player {
    const player = this.players.find((player: any) => player.id === player_id)
    return player
  }

  reorderTableColumn() {
    if (this.main_player_id !== this.players[0].id || this.target_player_id !== this.players[1].id) {
      this.main_player_id = this.players[0]?.id;
      this.target_player_id = this.players[1]?.id;
      this.setScoresTable();
    }
    this.playerService.storePlayers(this.players);
    this.dtOptions.columns = this.buildColumns(this.players);
    this.recreateDataTable();
  }

  setSliderOptions(starsFloor: number, starsCeil: number) {
    this.minStars = starsFloor || 0;
    this.maxStars = starsCeil || 0;

    // From ngx-slider docs:
    // Due to change detection rules in Angular, we need to re-create the options object to apply the change
    const newOptions: Options = Object.assign({}, this.sliderOptions);
    newOptions.floor = starsFloor || 0;
    newOptions.ceil = starsCeil || 0;
    newOptions.ticksArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    newOptions.hideLimitLabels = false;
    newOptions.showTicksValues = false;

    this.sliderOptions = newOptions;
  }

  setScoresTable() {
    let starsFloor: number = null;
    let starsCeil: number = null;

    const setFloorCeilStars = (stars: number) => {
      if (starsFloor === null || stars < starsFloor) starsFloor = stars;
      else if (starsCeil === null || stars > starsCeil) starsCeil = stars;
    }

    // const main_player_id = this.players[0]?.id;

    const player_id = this.target_player_id ? this.target_player_id : this.main_player_id;

    console.log("main_player_name", this.players[0]?.name);

    let start: number;
    start = performance.now();

    this.scoresTable = [];
    const songs_played = new Set();

    for (let i_song = 0; i_song < this.playersScores[player_id]?.length; i_song++) {
      const song = this.playersScores[player_id][i_song];
      // if (this.showRanked === !song.leaderboard.ranked) continue;

      if (song.leaderboard.ranked) {
        setFloorCeilStars(song.leaderboard.stars);
      }
      const scoreRow = {
        'id': song.leaderboard.id,
        'hash': song.leaderboard.songHash,
        'coverImage': song.leaderboard.coverImage,
        'songName': song.leaderboard.songName,
        'songSubName': song.leaderboard.songSubName,
        'songAuthorName': song.leaderboard.songAuthorName,
        'levelAuthorName': song.leaderboard.levelAuthorName,
        'difficulty': song.leaderboard.difficulty.difficulty,
        'gameMode': song.leaderboard.difficulty.gameMode,
        'ranked': song.leaderboard.ranked,
        'stars': song.leaderboard.stars,
        'maxScore': song.leaderboard.maxScore,
        'song_played_by_sniper': false,
      }

      var players_played = 0;
      var highest_score = {
        player_id: '',
        score: 0,
      };
      const songScoresByPlayer: any = {};
      for (let j = 0; j < this.players.length; j++) {
        const player_id = this.players[j].id;
        const score = this.playersScores[player_id]
        const map = score?.find((songScore: any) => songScore.leaderboard.id === scoreRow.id);
        if (map) {
          songScoresByPlayer[player_id] = map.score;
          songScoresByPlayer[player_id]['player_name'] = this.players[j].name;
          players_played++;

          if (highest_score.score < map.score.baseScore) {
            highest_score.player_id = player_id;
            highest_score.score = map.score.baseScore;
          }
        }
      }
      // if (this.showScoresInCommon && players_played <= 1) continue;

      for (let j = 0; j < this.players.length; j++) {
        const player_id = this.players[j].id;
        if (player_id === highest_score.player_id) {
          songScoresByPlayer[player_id].is_highest_score = true;
        }
      }


      if (songScoresByPlayer[this.main_player_id]) {
        songs_played.add(scoreRow.hash);
      }


      Object.assign(scoreRow, songScoresByPlayer);
      this.scoresTable.push(scoreRow);
    }

    // Set songs played by sniper
    for (let i_song = 0; i_song < this.scoresTable.length; i_song++) {
      const song = this.scoresTable[i_song];
      if (songs_played.has(song.hash)) {
        song.song_played_by_sniper = true;
      }
    }

    console.log("songs_played:", songs_played);
    console.log("songs played by sniper:", this.scoresTable.filter((song: any) => song.song_played_by_sniper));
    console.log("songs not played by sniper:", this.scoresTable.filter((song: any) => !song.song_played_by_sniper).length);



    this.setSliderOptions(starsFloor, starsCeil);
    console.log("build_scores_array", Math.round(performance.now() - start), "ms");
    console.log("scoresTable", this.scoresTable)
  }


  filterTable() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      $.fn['dataTable'].ext.search.pop();

      $.fn['dataTable'].ext.search.push((settings: DataTables.Settings, dataArr: any, dataIndex: number, rowData: any, counter: number) => {

        if (this.showRanked !== rowData.ranked) return false;
        // if (!this.showPlayedSongs) {
        //   if (rowData.song_played_by_sniper) return false;
        // } else if (this.showScoresInCommon === !rowData[this.main_player_id]) return false;

        if (this.chosenPlayedOption === 'Played') {
          if (!rowData[this.main_player_id]) return false;
        } else if (this.chosenPlayedOption === 'New Difficulties') {
          if (rowData[this.main_player_id]) return false;
        } else if (this.chosenPlayedOption === 'New Songs') {
          if (rowData.song_played_by_sniper) return false;
        }


        if (!this.showSnipedSongsAlso && rowData[this.main_player_id]?.baseScore > rowData[this.target_player_id].baseScore) return false;
        if (this.showRanked) {
          if (this.minStars && this.minStars > rowData.stars) return false;
          if (this.maxStars && this.maxStars < rowData.stars) return false;
        }

        return true;
      });
      $(this.table_selector).DataTable().draw();
    });
  }

  getFilteredData() {
    var table = $(this.table_selector).DataTable();
    return table.rows({ order: 'current', search: 'applied' }).data().toArray();
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

  makeSnipePlaylist(player: Player) {
    let sniper = this.players[0];
    let snipee = player;
    let scoresTableRows: ScoresTableRow[] = this.getFilteredData();
    const snipeCount = this.snipeCount ? this.snipeCount : this.snipeCountDefault;

    console.log("scoresTableRows", scoresTableRows);

    let playlist = this.playlistService.makeSnipePlaylist(sniper, snipee, scoresTableRows, snipeCount);
    playlist.playlistTitle += this.showRanked ? " Ranked" : " Unranked";
    // playlist.playlistTitle += this.showScoresInCommon ? " Played" : " New";

    switch (this.chosenPlayedOption) {
      case 'Played':
        playlist.playlistTitle += " Played";
        break;
      case 'New Difficulties':
        playlist.playlistTitle += " New Difficulties";
        break;
      case 'New Songs':
        playlist.playlistTitle += " New Songs";
        break;
      case 'Played + New':
        playlist.playlistTitle += " Played + New";
        break;
    }


    if (this.sliderOptions.floor !== this.minStars) {
      if (this.sliderOptions.ceil === this.maxStars) {
        playlist.playlistTitle += ` ${this.minStars}+`;
      } else {
        playlist.playlistTitle += ` ${this.minStars}-${this.maxStars}`;
      }
    } else if (this.sliderOptions.ceil !== this.maxStars) {
      playlist.playlistTitle += ` -${this.maxStars}`;
    }

    let image_base64 = this.getBase64Image(document.getElementById(`profilePicture-${snipee.id}`));
    playlist.image = image_base64;

    let fileName = playlist.playlistTitle;
    console.log("playlist:", playlist);
    this.playlistService.postSnipePlaylistSettings(sniper, snipeCount, playlist).subscribe();
    this.download(playlist, fileName);
  }

  download(playlist: Playlist, fileName: string) {
    const data_string = JSON.stringify(playlist);
    const file = new File([data_string], fileName + '.bplist', {
      type: 'text/plain',
    })

    const link = document.createElement('a')
    const url = URL.createObjectURL(file)

    link.href = url
    link.download = file.name
    document.body.appendChild(link)
    link.click()

    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

}
