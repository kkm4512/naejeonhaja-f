import { defineStore } from 'pinia';
export const useSwitchStore = defineStore('switch', {
  state: () => ({
    // 5:5 결과표에서 GoBack을 눌렀다면, 팀구성하는 화면에서 5:5결과를 최초에 신청한 인원들로 세팅되게 하기위함
    riftGoBackedSwitch: false as boolean,
    abyssGoBackedSwitch: false as boolean
  }),  
  actions: {
    // Rift
    onRiftGoBackedSwitch(){
        this.riftGoBackedSwitch = true;
    },
    offRiftGoBackedSwitch(){
        this.riftGoBackedSwitch = false;
    },
    getRiftGoBackedSwtich(){
        return this.riftGoBackedSwitch;
    },
    // Abyss
    onAbyssGoBackedSwitch(){
        this.abyssGoBackedSwitch = true;
    },
    offAbyssGoBackedSwitch(){
        this.abyssGoBackedSwitch = false;
    },
    getAbyssGoBackedSwtich(){
        return this.abyssGoBackedSwitch;
    },    
  }
});
// setReqPlayers