import { defineStore } from 'pinia';
import type { ApiResponse } from '~/types/common';
import type { AbyssRequestPlayer, RiftRequestPlayer, TftRequestPlayer } from '~/types/req/reqLolDto';
import type { AbyssResponseDto, RiftResponseDto, TftResponseDto } from '~/types/res/resLolDto';

export const useLolStore = defineStore('game', {
  state: () => ({
    riftResponseDto: null as ApiResponse<RiftResponseDto> | null,
    abyssResponseDto: null as ApiResponse<AbyssResponseDto> | null,
    tftResponseDto: null as ApiResponse<TftResponseDto> | null,
    riftRequestPlayer: [] as RiftRequestPlayer[],
    abyssRequestPlayer: [] as AbyssRequestPlayer[],
    tftRequestPlayer: [] as TftRequestPlayer[]
  }),
  actions: {
    setRiftResponseDto(data: ApiResponse<RiftResponseDto>) {
      this.riftResponseDto = data;
      localStorage.setItem('riftResponseDto', JSON.stringify(data));
    },
    setAbyssResponseDto(data: ApiResponse<AbyssResponseDto>) {
      this.abyssResponseDto = data;
      localStorage.setItem('abyssResponseDto', JSON.stringify(data));
    },
    setTftResponseDto(data: ApiResponse<TftResponseDto>) {
      this.tftResponseDto = data;
      localStorage.setItem('tftResponseDto', JSON.stringify(data));
    },        
    setRiftRequestPlayer(players: RiftRequestPlayer[]) {
      this.riftRequestPlayer = players;
      localStorage.setItem('riftRequestPlayer', JSON.stringify(players));
    },
    setAbyssRequestPlayer(players: AbyssRequestPlayer[]) {
      this.abyssRequestPlayer = players;
      localStorage.setItem('abyssRequestPlayer', JSON.stringify(players));
    },
    setTftRequestPlayer(players: TftRequestPlayer[]) {
      this.tftRequestPlayer = players;
      localStorage.setItem('tftRequestPlayer', JSON.stringify(players));
    }        
  },
});
// setReqPlayers