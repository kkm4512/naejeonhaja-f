import type { ChampionDto } from "../dataDragon/res/resDataDragonDto"
import type { RiotAccountDto, RiotChampionMasteryDto, RiotLeagueDto, RiotSummonerDto } from "./res/resRiotDto"

export type LolRankType = {
    RANKED_FLEX_SR:string,
    RANKED_SOLO_5x5:string   
}

export type RiotPlayerDto = {
    riotAccountDto:RiotAccountDto,
    riotSummonerDto:RiotSummonerDto,
    riotLeagueDto:RiotLeagueDto
    riotChampionMasteryDtos:RiotChampionMasteryDto[]
    championDtos:ChampionDto[]
}