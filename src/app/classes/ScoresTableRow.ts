export class ScoresTableRow {
  id: number;
  hash: string;
  coverImage: string;
  songName: string;
  songSubName: string;
  difficulty: 1 | 3 | 5 | 7 | 9;
  gameMode: string;
  ranked: boolean;
  stars: number;
  maxScore: number;
  [key: string]: any;
  // Additional fields follow [player_id: string]: playerScore
}
