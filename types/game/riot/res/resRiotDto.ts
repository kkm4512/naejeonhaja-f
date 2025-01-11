export type RiotAccountDto = {
    puuid: string,
    gameName: string,
    tagLine: string
}

export type RiotSummonerDto = {
    id: string,
    accountId: string,
    puuid: string,
    profileIconId: number,
    revisionDate: number,
    summonerLevel: number,
};

export type RiotLeagueDto = {
    leagueId: string;
    queueType: string;
    tier: string;
    rank: string;
    summonerId: string;
    leaguePoints: number;
    wins: number;
    losses: number;
};

export type RiotChampionMasteryDto = {
    puuid: string;
    championId: number;
    championLevel: number;
    championPoints: number;
}


