import type { LolPlayerDto, LolTeamResultDto } from "../common";
import type { LolPlayerHistorySimpleDto } from "../res/resLolDto";

export type LolPlayerHistoryRequestDto = {
  playerHistoryTitle: string | null; 
  lolPlayerDtos: LolPlayerDto[] | []; 
};

export type LolPlayerResultHistoryRequestDto = {
  playerResultHistoryTitle: string; 
  teamA: LolTeamResultDto; 
  teamB: LolTeamResultDto; 
};

export type LolPlayerHistoryDeleteAllRequestDto = {
  lolPlayerHistorySimpleDtos: LolPlayerHistorySimpleDto[];
}

export type LolPlayerHistoryUpdateRequestDto = {
  playerHistoryTitle: string;
} 










