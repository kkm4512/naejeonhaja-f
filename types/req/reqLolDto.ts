import type { LineRole, Line, Tier, Lines } from "../common";

export type RiftRequestPlayer = {
    name: string;
    tier: Tier;
    lines: Lines[];
};

export type RiftRequestLines = { line: Line; lineRole: LineRole | null };

export type AbyssRequestPlayer = {
    name: string;
    tier: Tier;
};

export type TftRequestPlayer = {
  name: string;
  tier: Tier;
};


