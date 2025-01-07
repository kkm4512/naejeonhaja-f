export type ChampionDto = {
    version: string;
    id: string;
    key: string;
    name: string;
    title: string;
    blurb: string;
    image: ImageDto;
    tags: string[];
    partype: string;
};

export type ImageDto = {
    full: string;
    sprite: string;
    group: string;
    x: number;
    y: number;
    w: number;
    h: number;
};
