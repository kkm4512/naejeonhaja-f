export type ReqPlayer = {
    name: string;
    tier: ReqTier;
    lines: ReqLines[];
  };
  
export type ReqLine = 'TOP' | 'JUNGLE' | 'MID' | 'AD' | 'SUPPORT';
export type ReqTier =
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
  export type ReqLineRole = 'MAINLINE' | 'SUBLINE';
  export type ReqLines = { line: ReqLine; lineRole: ReqLineRole | null };
