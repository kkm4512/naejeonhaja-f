import type { Line, Lines, LolPlayerDto, Tier } from "~/types/game/lol/rift/common";

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
