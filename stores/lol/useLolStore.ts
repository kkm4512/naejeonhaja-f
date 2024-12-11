import { defineStore } from 'pinia';
import type { RiftPlayerHistoryRequestDto, RiftPlayerRequestDto, RiftPlayerResultHistoryRequestDto } from '~/types/game/lol/rift/req/reqLolDto';
import type { RiftTeamResponseDto } from '~/types/game/lol/rift/res/resLolDto';

export const useLolStore = defineStore('game', {
  state: () => ({
    // Rift
    riftTeamResponseDto: null as RiftTeamResponseDto | null,
    riftPlayerRequestDto: [] as RiftPlayerRequestDto[],
    riftPlayerHistoryRequestDto: null as RiftPlayerHistoryRequestDto | null,
    riftPlayerResultHistoryRequestDto: null as RiftPlayerResultHistoryRequestDto | null,
    riftTeamResultRequestDto: null as RiftPlayerResultHistoryRequestDto | null
  }),  
  actions: {
    setRiftTeamResponseDto(data: RiftTeamResponseDto) {
      this.riftTeamResponseDto = data;
      localStorage.setItem('riftTeamResponseDto', JSON.stringify(data));
    },
    getRiftTeamResponseDto():RiftTeamResponseDto | null {
      return this.riftTeamResponseDto ?? null;
    },    
    setRiftPlayerRequestDto(data: RiftPlayerRequestDto[]) {
      this.riftPlayerRequestDto = data;
      localStorage.setItem('riftPlayerRequestDto', JSON.stringify(data));
    },
    getRiftPlayerRequestDto(): RiftPlayerRequestDto[] {
      return this.riftPlayerRequestDto ?? [];
    },    
    // GoBackSwitch 전용
    setRiftPlayerHisotryRequestDto(data: RiftPlayerHistoryRequestDto) {
      this.riftPlayerHistoryRequestDto = data;
      localStorage.setItem('riftPlayerHisotryRequestDto', JSON.stringify(data));
    },
    // GoBackSwitch 전용
    getRiftPlayerHisotryRequestDto(): RiftPlayerHistoryRequestDto | null {
      return this.riftPlayerHistoryRequestDto;
    },
    // Result 전용
    updateRiftPlayerReulstHisotryRequestDto(data: RiftPlayerResultHistoryRequestDto) {
      this.riftPlayerResultHistoryRequestDto = data;
      localStorage.setItem('riftPlayerResultHistoryRequestDto', JSON.stringify(data));
    },
    // Result 전용
    getRiftPlayerResultHistoryRequestDto(): RiftPlayerResultHistoryRequestDto | null {
      return this.riftPlayerResultHistoryRequestDto;
    },        
  }
});
// setReqPlayers