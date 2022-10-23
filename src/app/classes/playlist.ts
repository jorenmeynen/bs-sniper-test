import { ScoresTableRow } from "./ScoresTableRow";

interface difficultyMarker {
  characteristic: string;
  name: string;
}

interface song {
  hash: string,
  key?: string,
  songName: string,
  levelid?: any,
  difficulties: difficultyMarker[];
}

export class Playlist {
  playlistTitle: string;
  playlistAuthor: string;
  playlistDescription: string;
  songs: song[]
  image: string;

  constructor() {
    this.songs = [];
  }

  addSong(row: ScoresTableRow) {
    const currentSong = this.songs.find((song: any) => song.hash === row.hash);
    if (!currentSong) {
      this.songs.push({
        'levelid': row.id,
        'hash': row.hash,
        'songName': row.songName,
        'difficulties': [{
            'characteristic': row.gameMode.replace('Solo', ''),
            'name': this.getDifficultyMarker(row.difficulty)
          }]
      })
    } else {
      currentSong.difficulties.push({
        'characteristic': row.gameMode.replace('Solo', ''),
        'name': this.getDifficultyMarker(row.difficulty)
      })
    }
  }

  private getDifficultyMarker(difficulty: number): string {
    switch (difficulty) {
      case 1:
        return 'Easy';
      case 3:
        return 'Normal';
      case 5:
        return 'Hard';
      case 7:
        return 'Expert';
      case 9:
        return 'ExpertPlus';
      default:
        return '';
    }
  }
}
