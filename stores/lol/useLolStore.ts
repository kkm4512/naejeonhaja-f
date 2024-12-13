import { defineStore } from 'pinia';
import type { LolPlayerDto } from "~/types/game/lol/rift/common";
import type { LolPlayerHistoryRequestDto } from '~/types/game/lol/rift/req/reqLolDto';

export const useLolStore = defineStore('lol', {
  state: () => ({
    // Rift
    riftTeamA: [] as LolPlayerDto[],
    riftTeamB: [] as LolPlayerDto[],
    riftInitTeam: null as LolPlayerHistoryRequestDto | null,

    // Abyss
    abyssTeamA: [] as LolPlayerDto[],
    abyssTeamB: [] as LolPlayerDto[],
    abyssInitTeam: null as LolPlayerHistoryRequestDto | null,

    // TFT
    tftTeamA: [] as LolPlayerDto[],
    tftTeamB: [] as LolPlayerDto[],
    tftInitTeam: null as LolPlayerHistoryRequestDto | null,
  }),
  actions: {
    // Rift
    setInitRiftTeamsWithTitle(riftInitTeam: LolPlayerHistoryRequestDto) {
      this.riftInitTeam = riftInitTeam;
      sessionStorage.setItem('riftInitTeam', JSON.stringify(riftInitTeam));
    },
    updateRiftTeams(riftTeamA: LolPlayerDto[], riftTeamB: LolPlayerDto[]) {
      this.riftTeamA = riftTeamA;
      this.riftTeamB = riftTeamB;
      sessionStorage.setItem('riftTeamA', JSON.stringify(riftTeamA));
      sessionStorage.setItem('riftTeamB', JSON.stringify(riftTeamB));
    },
    loadRiftTeams() {
      const storedTeamA = sessionStorage.getItem('riftTeamA');
      const storedTeamB = sessionStorage.getItem('riftTeamB');
      this.riftTeamA = storedTeamA ? JSON.parse(storedTeamA) : [];
      this.riftTeamB = storedTeamB ? JSON.parse(storedTeamB) : [];
    },
    loadInitRiftTeamsWithTitle() {
      const storedRiftInitTeam = sessionStorage.getItem('riftInitTeam');
      if (storedRiftInitTeam) {
        this.riftInitTeam = JSON.parse(storedRiftInitTeam);
      } else {
        this.riftInitTeam = null; // 초기 상태를 null 또는 빈 값으로 설정
      }
    },    

    // Abyss
    setInitAbyssTeamsWithTitle(abyssInitTeam: LolPlayerHistoryRequestDto) {
      this.abyssInitTeam = abyssInitTeam;
      sessionStorage.setItem('abyssInitTeam', JSON.stringify(abyssInitTeam));
    },
    updateAbyssTeams(abyssTeamA: LolPlayerDto[], abyssTeamB: LolPlayerDto[]) {
      this.abyssTeamA = abyssTeamA;
      this.abyssTeamB = abyssTeamB;
      sessionStorage.setItem('abyssTeamA', JSON.stringify(abyssTeamA));
      sessionStorage.setItem('abyssTeamB', JSON.stringify(abyssTeamB));
    },
    loadAbyssTeams() {
      const storedAbyssTeamA = sessionStorage.getItem('abyssTeamA');
      const storedAbyssTeamB = sessionStorage.getItem('abyssTeamB');
      this.abyssTeamA = storedAbyssTeamA ? JSON.parse(storedAbyssTeamA) : [];
      this.abyssTeamB = storedAbyssTeamB ? JSON.parse(storedAbyssTeamB) : [];
    },
    loadInitAbyssTeamsWithTitle() {
      const storedAbyssInitTeam = sessionStorage.getItem('abyssInitTeam');
      if (storedAbyssInitTeam) {
        this.abyssInitTeam = JSON.parse(storedAbyssInitTeam);
      } else {
        this.abyssInitTeam = null; // 초기 상태를 null 또는 빈 값으로 설정
      }
    },        

    // TFT
    setInitTftTeamsWithTitle(tftInitTeam: LolPlayerHistoryRequestDto) {
      this.tftInitTeam = tftInitTeam;
      sessionStorage.setItem('tftInitTeam', JSON.stringify(tftInitTeam));
    },
    updateTftTeams(tftTeamA: LolPlayerDto[], tftTeamB: LolPlayerDto[]) {
      this.tftTeamA = tftTeamA;
      this.tftTeamB = tftTeamB;
      sessionStorage.setItem('tftTeamA', JSON.stringify(tftTeamA));
      sessionStorage.setItem('tftTeamB', JSON.stringify(tftTeamB));
    },
    loadTftTeams() {
      const storedTftTeamA = sessionStorage.getItem('tftTeamA');
      const storedTftTeamB = sessionStorage.getItem('tftTeamB');
      this.tftTeamA = storedTftTeamA ? JSON.parse(storedTftTeamA) : [];
      this.tftTeamB = storedTftTeamB ? JSON.parse(storedTftTeamB) : [];
    },
    loadInitTftTeamsWithTitle() {
      const storedTftInitTeam = sessionStorage.getItem('tftInitTeam');
      if (storedTftInitTeam) {
        this.tftInitTeam = JSON.parse(storedTftInitTeam);
      } else {
        this.tftInitTeam = null; // 초기 상태를 null 또는 빈 값으로 설정
      }
    },           
  },
});
