export interface LeaderboardEntry {
  userId: string;
  displayName: string;
  photoURL?: string;
  compassionPoints: number;
  rank: number;
  change: number;
}
