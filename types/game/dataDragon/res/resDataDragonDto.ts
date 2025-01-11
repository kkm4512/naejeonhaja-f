export type ChampionDto = {
    version: string;
    id: string;
    key: string;
    name: string;
    image: ImageDto;
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
