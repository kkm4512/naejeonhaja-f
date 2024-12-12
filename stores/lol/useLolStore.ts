import { defineStore } from 'pinia';
import type { LolPlayerDto } from "~/types/game/lol/rift/common";
import type { LolPlayerHistoryRequestDto } from '~/types/game/lol/rift/req/reqLolDto';

export const useLolStore = defineStore('lol', {
  state: () => ({
    riftTeamA: [] as LolPlayerDto[],
    riftTeamB: [] as LolPlayerDto[],
    riftInitTeam: null as LolPlayerHistoryRequestDto | null,
  }),
  actions: {
    setInitTeamsWithTitle(riftInitTeam: LolPlayerHistoryRequestDto) {
      this.riftInitTeam = riftInitTeam;

      // 데이터 저장
      sessionStorage.setItem('riftInitTeam', JSON.stringify(riftInitTeam));
    },
    setTeams(riftTeamA: LolPlayerDto[], riftTeamB: LolPlayerDto[]) {
      this.riftTeamA = riftTeamA;
      this.riftTeamB = riftTeamB;

      // 데이터 저장
      sessionStorage.setItem('riftTeamA', JSON.stringify(riftTeamA));
      sessionStorage.setItem('riftTeamB', JSON.stringify(riftTeamB));
    },
    loadTeams() {
        // Session Storage에서 데이터 복원
        const storedTeamA = sessionStorage.getItem('riftTeamA');
        const storedTeamB = sessionStorage.getItem('riftTeamB');
  
        this.riftTeamA = storedTeamA ? JSON.parse(storedTeamA) : [];
        this.riftTeamB = storedTeamB ? JSON.parse(storedTeamB) : [];
      },
    },    
});
