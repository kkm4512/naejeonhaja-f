export interface LolPlayerLine {
  line: string
  lineRole: string
}

export interface LolPlayerRequest {
  name: string
  tier: string
  lines: LolPlayerLine[]
  mmr: number
  mmrReduced: boolean
  profileIconUrl?: string
}

export interface TeamBalanceRequest {
  lolPlayers: LolPlayerRequest[]
}

export interface TeamPlayer {
  name: string
  tier: string
  lines: LolPlayerLine[]
  mmr: number
  mmrReduced: boolean
  profileIconUrl?: string
}

export interface TeamBalanceData {
  balance: string
  teamATotalMmr: number
  teamBTotalMmr: number
  teamA: TeamPlayer[]
  teamB: TeamPlayer[]
}

export interface StandardResponse<T> {
  code: number
  message: string
  data?: T
  datas?: T
}

export interface RiotAccountDto {
  puuid?: string
  gameName?: string
  tagLine?: string
}

export interface RiotSummonerDto {
  profileIconId?: number
  summonerLevel?: number
  name?: string
}

export interface RiotLeagueDto {
  tier?: string
  rank?: string
  leaguePoints?: number
  wins?: number
  losses?: number
  queueType?: string
}

export interface RiotMasteryDto {
  championId?: number
  championLevel?: number
  championPoints?: number
}

export interface RiotChampionDto {
  id?: string
  key?: string
  name?: string
  title?: string
}

export interface RiotPlayerBasicInfo {
  riotAccountDto?: RiotAccountDto
  riotSummonerDto?: RiotSummonerDto
  riotLeagueDto?: RiotLeagueDto
  masteries?: RiotMasteryDto[]
  champions?: RiotChampionDto[]
}
