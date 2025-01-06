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
    veteran: boolean;      // 리그에서 오래 활동한 플레이어인지 여부
    inactive: boolean;     // 계정이 비활성화 상태인지 여부
    freshBlood: boolean;   // 신규 플레이어인지 여부
    hotStreak: boolean;    // 현재 연승 중인지 여부
};

