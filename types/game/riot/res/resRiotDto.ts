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

export type RiotChampionMasteryDto = {
    puuid: string;
    championId: number;
    championLevel: number;
    championPoints: number;
    lastPlayTime: number;
    championPointsSinceLastLevel: number;
    championPointsUntilNextLevel: number;
    markRequiredForNextLevel: number;
    tokensEarned: number;
    championSeasonMilestone: number;
    milestoneGrades: string[];
    nextSeasonMilestone?: NextSeasonMilestoneDto; // 선택적으로 선언 (nullable 가능성)
}

export type NextSeasonMilestoneDto = {
    requireGradeCounts: Record<string, number>; // Java의 Map -> TS에서는 Record로 매핑
    rewardMarks: number;
    bonus: boolean;
    rewardConfig?: RewardConfigDto; // 선택적으로 선언
    totalGamesRequires: number;
}

export type RewardConfigDto = {
    rewardValue: string;
    rewardType: string;
    maximumReward: number;
}


