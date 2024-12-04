export type ResPlayer = {
    name: string;
    tier: ResTier;
    lines: ResLines[];
    mmr: number;
    mmrReduced: boolean; 
  };
  
export type ResLine = 'TOP' | 'JUNGLE' | 'MID' | 'AD' | 'SUPPORT';
export type ResTier =
  | "UNRANKED"
  | "IRON_IV" | "IRON_III" | "IRON_II" | "IRON_I"
  | "BRONZE_IV" | "BRONZE_III" | "BRONZE_II" | "BRONZE_I"
  | "SILVER_IV" | "SILVER_III" | "SILVER_II" | "SILVER_I"
  | "GOLD_IV" | "GOLD_III" | "GOLD_II" | "GOLD_I"
  | "PLATINUM_IV" | "PLATINUM_III" | "PLATINUM_II" | "PLATINUM_I"
  | "EMERALD_IV" | "EMERALD_III" | "EMERALD_II" | "EMERALD_I"
  | "DIAMOND_IV" | "DIAMOND_III" | "DIAMOND_II" | "DIAMOND_I"
  | "MASTER"
  | "GRANDMASTER"
  | "CHALLENGER";
  export type ResLineRole = 'MAINLINE' | 'SUBLINE';
  export type ResLines = { line: ResLine; lineRole: ResLineRole | null };

// lolFetcg Response Type
export interface RiftResponseDto {
    teamA: ResPlayer[];  // Team A의 플레이어 리스트
    teamB: ResPlayer[];  // Team B의 플레이어 리스트
}


