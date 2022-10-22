import { PlayerScore } from "./playerScore";
import { SongLeaderboard } from "./songLeaderboard";
export class SongScore {
  leaderboard: SongLeaderboard
  score: PlayerScore

  constructor() {
    this.score = new PlayerScore();
    this.leaderboard = new SongLeaderboard();
  }

  setValues(keys: string[], values: string[]) {
    for (let i = 0; i < keys.length; i++) {
      this.assign(keys[i], values[i]);
    }
  }

  private assign(key: string, value: string) {

    switch (key) {
      case 'score.badCuts':
        this.score.badCuts = parseInt(value);
        break;
      case 'score.baseScore':
        this.score.baseScore = parseInt(value);
        break;
      case 'score.fullCombo':
        this.score.fullCombo = value === "1";
        break;
      case 'score.hasReplay':
        this.score.hasReplay = value === "1";
        break;
      case 'score.hmd':
        this.score.hmd = parseInt(value);
        break;
      case 'score.id':
        this.score.id = parseInt(value);
        break;
      case 'score.maxCombo':
        this.score.maxCombo = parseInt(value);
        break;
      case 'score.missedNotes':
        this.score.missedNotes = parseInt(value);
        break;
      case 'score.modifiedScore':
        this.score.modifiedScore = parseInt(value);
        break;
      case 'score.modifiers':
        this.score.modifiers = value;
        break;
      case 'score.multiplier':
        this.score.multiplier = parseInt(value);
        break;
      case 'score.pp':
        this.score.pp = parseFloat(value);
        break;
      case 'score.rank':
        this.score.rank = parseInt(value);
        break;
      case 'score.timeSet':
        this.score.timeSet = value;
        break;
      case 'score.weight':
        this.score.weight = parseFloat(value);
        break;
      case 'leaderboard.coverImage':
        this.leaderboard.coverImage = value;
        break;
      case 'leaderboard.createdDate':
        this.leaderboard.createdDate = value;
        break;
      case 'leaderboard.dailyPlays':
        this.leaderboard.dailyPlays = parseInt(value);
        break;
      case 'leaderboard.difficulties':
        this.leaderboard.difficulties = value === "" ? null : value;
        break;
      case 'leaderboard.id':
        this.leaderboard.id = parseInt(value);
        break;
      case 'leaderboard.levelAuthorName':
        this.leaderboard.levelAuthorName = value;
        break;
      case 'leaderboard.loved':
        this.leaderboard.loved = value === "1";
        break;
      case 'leaderboard.lovedDate':
        this.leaderboard.lovedDate = value === "" ? null : value;
        break;
      case 'leaderboard.maxPP':
        this.leaderboard.maxPP = parseInt(value);
        break;
      case 'leaderboard.maxScore':
        this.leaderboard.maxScore = parseInt(value);
        break;
      case 'leaderboard.playerScore':
        this.leaderboard.playerScore = value === "" ? null : value;
        break;
      case 'leaderboard.plays':
        this.leaderboard.plays = parseInt(value);
        break;
      case 'leaderboard.positiveModifiers':
        this.leaderboard.positiveModifiers = value === "1";
        break;
      case 'leaderboard.qualified':
        this.leaderboard.qualified = value === "1";
        break;
      case 'leaderboard.qualifiedDate':
        this.leaderboard.qualifiedDate = value === "" ? null : value;
        break;
      case 'leaderboard.ranked':
        this.leaderboard.ranked = value === "1";
        break;
      case 'leaderboard.rankedDate':
        this.leaderboard.rankedDate = value === "" ? null : value;;
        break;
      case 'leaderboard.songAuthorName':
        this.leaderboard.songAuthorName = value;
        break;
      case 'leaderboard.songHash':
        this.leaderboard.songHash = value;
        break;
      case 'leaderboard.songName':
        this.leaderboard.songName = value;
        break;
      case 'leaderboard.songSubName':
        this.leaderboard.songSubName = value;
        break;
      case 'leaderboard.stars':
        this.leaderboard.stars = parseFloat(value);
        break;
      case 'leaderboard.difficulty.difficulty':
        this.leaderboard.difficulty.difficulty = parseInt(value);
        break;
      case 'leaderboard.difficulty.difficultyRaw':
        this.leaderboard.difficulty.difficultyRaw = value;
        break;
      case 'leaderboard.difficulty.gameMode':
        this.leaderboard.difficulty.gameMode = value;
        break;
      case 'leaderboard.difficulty.leaderboardId':
        this.leaderboard.difficulty.leaderboardId = parseInt(value);
        break;
    }

  }
}
