export class Player {
  badges: [];
  banned: boolean;
  bio: string;
  country: string;
  countryRank:  number;
  histories: string;
  id: string;
  inactive: boolean;
  name: string;
  permissions: number;
  pp: number;
  profilePicture: string;
  rank: number;
  role: any;
  scoreStats: {
    averageRankedAccuracy: number;
    rankedPlayCount: number;
    replaysWatched: number;
    totalPlayCount: number;
    totalRankedScore: number;
    totalScore: number;
  }
  shown = true;
}
