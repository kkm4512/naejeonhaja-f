import { defineStore } from 'pinia';
import type { ReqPlayer } from '~/types/req/reqLolDto';
import type { ApiResponse } from '~/types/res/common';
import type { RiftResponseDto } from '~/types/res/resLolDto';

export const useLolStore = defineStore('game', {
  state: () => ({
    riftResponseDto: null as ApiResponse<RiftResponseDto> | null,
    reqPlayers: [] as ReqPlayer[]
  }),
  actions: {
    setRiftResponseDto(data: ApiResponse<RiftResponseDto>) {
      this.riftResponseDto = data;

      localStorage.setItem('riftResponseDto', JSON.stringify(data));
    },
    setReqPlayers(players: ReqPlayer[]) {
      this.reqPlayers = players;
      localStorage.setItem('reqPlayers', JSON.stringify(players));
    }
  },
});
// setReqPlayers