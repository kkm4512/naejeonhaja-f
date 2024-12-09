import type { LineRole, Line, Tier, Lines } from "../common";

export type RiftRequestPayload = {
  playerHistoryTitle: string; 
  riftRequestDtos: RiftRequestPlayer[]; 
};

export type RiftRequestPlayer = {
    name: string;
    tier: Tier;
    lines: Lines[];
};

export type RiftRequestLines = { line: Line; lineRole: LineRole | null };

