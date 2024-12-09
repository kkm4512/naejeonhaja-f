export type Line = 'TOP' | 'JUNGLE' | 'MID' | 'AD' | 'SUPPORT';

export type Lines = { line: Line; lineRole: LineRole | null };

export type Tier =
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

  export type LineRole = 'MAINLINE' | 'SUBLINE';