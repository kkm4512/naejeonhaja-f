import type { Lines, Tier } from "../common";

export type RiftPlayerHistoryRequestDto = {
  playerHistoryTitle: string; 
  riftPlayerRequestDtos: RiftPlayerRequestDto[]; 
};

export type RiftPlayerRequestDto = {
    name: string;
    tier: Tier;
    lines: Lines[];
};


