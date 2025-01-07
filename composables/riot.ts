import type { Tier } from "~/types/game/lol/common";

  // 🎯 tier + rank를 안전하게 변환하는 함수
export const parseTier = (tier: string, rank: string): Tier => {
    const combinedTier = `${tier}_${rank}` as Tier;
    if (getTiers().includes(combinedTier)) {
        return combinedTier;
    } else {
        throw new Error(`Invalid tier or rank combination: ${combinedTier}`);
    }
};
