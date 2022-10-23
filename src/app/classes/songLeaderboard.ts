class Difficulty {
  difficulty: number;
  difficultyRaw: string;
  gameMode: string;
  leaderboardId: number;
}

export class SongLeaderboard {
  coverImage: string;
  createdDate: string;
  dailyPlays: number;
  difficulties: any;
  difficulty: Difficulty;
  id: number;
  levelAuthorName: string;
  loved: boolean;
  lovedDate: any;
  maxPP: number;
  maxScore: number;
  playerScore: any;
  plays: number;
  positiveModifiers: boolean;
  qualified: boolean;
  qualifiedDate: any;
  ranked: boolean;
  rankedDate: string;
  songAuthorName: string;
  songHash: string;
  songName: string;
  songSubName: string;
  stars: number;

  constructor() {
    this.difficulty = new Difficulty();
  }
}
