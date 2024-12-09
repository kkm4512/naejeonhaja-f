import { defineStore } from 'pinia';
import type { ApiResponse } from '~/types/common';
import type { RiftRequestPlayer } from '~/types/req/reqLolDto';
import type { RiftResponseDto } from '~/types/res/resLolDto';

export const useLolStore = defineStore('game', {
  state: () => ({
    // Rift
    riftResponseDto: null as ApiResponse<RiftResponseDto> | null,
    riftRequestPlayer: [] as RiftRequestPlayer[]
  }),
  actions: {
    setRiftResponseDto(data: ApiResponse<RiftResponseDto>) {
      this.riftResponseDto = data;
      localStorage.setItem('riftResponseDto', JSON.stringify(data));
    },
    setRiftRequestPlayer(players: RiftRequestPlayer[]) {
      this.riftRequestPlayer = players;
      localStorage.setItem('riftRequestPlayer', JSON.stringify(players));
    },
  }
});
// setReqPlayers