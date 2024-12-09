import { defineStore } from 'pinia';
import type { ApiResponse } from '~/types/common';
import type { RiftPlayerRequestDto } from '~/types/game/lol/rift/req/reqLolDto';
import type { RiftTeamResponseDto } from '~/types/game/lol/rift/res/resLolDto';

export const useLolStore = defineStore('game', {
  state: () => ({
    // Rift
    riftTeamResponseDto: null as ApiResponse<RiftTeamResponseDto> | null,
    riftPlayerRequestDto: [] as RiftPlayerRequestDto[]
  }),
  actions: {
    setRiftTeamResponseDto(data: ApiResponse<RiftTeamResponseDto>) {
      this.riftTeamResponseDto = data;
      localStorage.setItem('riftTeamResponseDto', JSON.stringify(data));
    },
    setRiftPlayerRequestDto(players: RiftPlayerRequestDto[]) {
      this.riftPlayerRequestDto = players;
      localStorage.setItem('riftPlayerRequestDto', JSON.stringify(players));
    },
  }
});
// setReqPlayers