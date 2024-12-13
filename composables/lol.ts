import type { Line, Lines, LolPlayerDto, Outcome, Tier } from "~/types/game/lol/common";

// 라인 약어 변환 함수
export const getAbbreviatedLine = (line: string | undefined) => {
    if (!line) return ''; // 라인이 없는 경우 빈 문자열 반환
    const lineAbbreviations: Record<string, string> = {
      SUPPORT: "SP",
      JUNGLE: "JG",
    };
    return lineAbbreviations[line] || line; // 매칭되지 않는 경우 원래 라인 이름 반환
};


// 랜덤 데이터 생성 함수
export const generateRandomData = (title:string | null, players:LolPlayerDto[]) => {
  const sampleNicknames:string[] = getSampleNicknames();
  const tiers: Tier[] = getTiers();
  const lines: Line[] = getLines();

  const usedNicknames = new Set<string>();
  title = crypto.randomUUID();
  const randomNickname = () => {
    let nickname;
    do {
      nickname = sampleNicknames[Math.floor(Math.random() * sampleNicknames.length)];
    } while (usedNicknames.has(nickname));
    usedNicknames.add(nickname);
    return nickname;
  };

  const randomTier = () => tiers[Math.floor(Math.random() * tiers.length)];

  const randomlines = (): Lines[] => {
    const selectedlines: Lines[] = [];
    const lineCount = Math.floor(Math.random() * lines.length) + 1;
    while (selectedlines.length < lineCount) {
      const randomline = lines[Math.floor(Math.random() * lines.length)] as Line;
      if (!selectedlines.find((l) => l.line === randomline)) {
        const type = Math.random() > 0.5 ? "MAINLINE" : "SUBLINE";
        selectedlines.push({ line: randomline, lineRole: type });
      }
    }
    return selectedlines;
  };

  players.forEach((player) => {
    player.name = randomNickname();
    player.tier = randomTier();
    player.lines = randomlines();
  });
};

// 랜덤 데이터 생성 함수
export const generateRandomDataNoLine = (title:string | null, players:LolPlayerDto[]) => {
  const sampleNicknames:string[] = getSampleNicknames();
  const tiers: Tier[] = getTiers();

  const usedNicknames = new Set<string>();
  title = crypto.randomUUID();
  const randomNickname = () => {
    let nickname;
    do {
      nickname = sampleNicknames[Math.floor(Math.random() * sampleNicknames.length)];
    } while (usedNicknames.has(nickname));
    usedNicknames.add(nickname);
    return nickname;
  };

  const randomTier = () => tiers[Math.floor(Math.random() * tiers.length)];

  players.forEach((player) => {
    player.name = randomNickname();
    player.tier = randomTier();
  });
};

export const getOutcomeClass = (outcome: Outcome) => {
  const baseClass =  'absolute -top-4 left-1/2 transform -translate-x-1/2 -translate-y-0 text-sm font-bold py-1 px-4 rounded-full shadow-md';

  if (outcome === 'WINNER')
    return { text: 'Winner', class: `${baseClass} bg-yellow-300 text-yellow-800` };
  if (outcome === 'LOSE')
    return { text: 'Lose', class: `${baseClass} bg-gray-300 text-gray-800` };
  if (outcome === 'DRAW')
    return { text: 'Draw', class: `${baseClass} bg-gray-200 text-gray-700` };
  return { text: '', class: '' }; // 기본값 (표시 안 함)
};


// 팀과 결과 상태에 따라 배경 클래스를 반환
export const getTeamBackgroundClass = (outcome: Outcome, team: 'TeamA' | 'TeamB') => {
  const baseColor = team === 'TeamA' ? 'blue' : 'red'; // A팀은 파랑, B팀은 빨강

  if (outcome === 'WINNER') return `bg-${baseColor}-300 opacity-100`; // 승리한 경우 (가장 밝게)
  if (outcome === 'LOSE') return `bg-gray-200 opacity-60`;            // 패배한 경우 (회색빛)
  if (outcome === 'DRAW') return `bg-${baseColor}-200 opacity-80`;    // 무승부인 경우 (중간 밝기)
  return `bg-${baseColor}-200 opacity-85`;                            // 기본값 (조금 더 밝게)
};









  


// 티어 그룹별 색상 매핑 함수
export const getTierGroupClass = (tier: string) => {
  const tierGroupColors: Record<string, string> = {
    UNRANKED: "border-gray-200",
    IRON: "border-gray-400",
    BRONZE: "border-yellow-600",
    SILVER: "border-gray-200",
    GOLD: "border-yellow-300",
    PLATINUM: "border-green-300",
    EMERALD: "border-teal-300",
    DIAMOND: "border-blue-300",
    MASTER: "border-purple-400",
    GRANDMASTER: "border-red-400",
    CHALLENGER: "border-blue-400",
  };
  const tierGroup = tier.split("_")[0];
  return tierGroupColors[tierGroup] || "border-gray-200";
};

  // 팀의 mmr 계산 메서드 
export const calculateTotalMMR = (team: LolPlayerDto[]) => {
    return team.reduce((total, player) => total + player.mmr, 0);
};

export const getTiers = (): Tier[] => {
  return [
    "UNRANKED",
    "IRON_IV", "IRON_III", "IRON_II", "IRON_I",
    "BRONZE_IV", "BRONZE_III", "BRONZE_II", "BRONZE_I",
    "SILVER_IV", "SILVER_III", "SILVER_II", "SILVER_I",
    "GOLD_IV", "GOLD_III", "GOLD_II", "GOLD_I",
    "PLATINUM_IV", "PLATINUM_III", "PLATINUM_II", "PLATINUM_I",
    "EMERALD_IV", "EMERALD_III", "EMERALD_II", "EMERALD_I",
    "DIAMOND_IV", "DIAMOND_III", "DIAMOND_II", "DIAMOND_I",
    "MASTER",
    "GRANDMASTER",
    "CHALLENGER"
  ];
}

export const getLines = (): Line[] => {
  return ["TOP", "JUNGLE", "MID", "AD", "SUPPORT"];
}

export const getSampleNicknames = (): string[] => {
  return [
    "Summoner1", "Summoner2", "Summoner3", "Summoner4", "Summoner5",
    "Summoner6", "Summoner7", "Summoner8", "Summoner9", "Summoner10"
  ];
}
