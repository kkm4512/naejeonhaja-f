import type { Lines, Outcome, Tier } from "../common";

export type RiftPlayerHistoryRequestDto = {
  playerHistoryTitle: string; 
  riftPlayerRequestDtos: RiftPlayerRequestDto[]; 
};

export type RiftPlayerRequestDto = {
  name: string;
  tier: Tier;
  lines: Lines[];
};

export type RiftPlayerResultHistoryRequestDto = {
  playerResultHistoryTitle: string; 
  teamA: RiftTeamResultRequestDto; 
  teamB: RiftTeamResultRequestDto; 
};

export type RiftTeamResultRequestDto = {
  outcome: Outcome;
  team: RiftPlayerResultRequestDto[];
}

export type RiftPlayerResultRequestDto = {
  name: string;
  tier: Tier;
  lines: Lines[];
  mmrReduced: boolean; 
};


