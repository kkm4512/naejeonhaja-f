export type Line = 'TOP' | 'JUNGLE' | 'MID' | 'AD' | 'SUPPORT';

export type Lines = { line: Line; lineRole: LineRole | null };

export type Tier =
  | "UNRANKED"
  | "IRON_IV" | "IRON_III" | "IRON_II" | "IRON_I"
  | "BRONZE_IV" | "BRONZE_III" | "BRONZE_II" | "BRONZE_I"
  | "SILVER_IV" | "SILVER_III" | "SILVER_II" | "SILVER_I"
  | "GOLD_IV" | "GOLD_III" | "GOLD_II" | "GOLD_I"
  | "PLATINUM_IV" | "PLATINUM_III" | "PLATINUM_II" | "PLATINUM_I"
  | "EMERALD_IV" | "EMERALD_III" | "EMERALD_II" | "EMERALD_I"
  | "DIAMOND_IV" | "DIAMOND_III" | "DIAMOND_II" | "DIAMOND_I"
  | "MASTER"
  | "GRANDMASTER"
  | "CHALLENGER";

  export type LineRole = 'MAINLINE' | 'SUBLINE';


  export interface ApiResponse<T> {
    code: number; // 응답 코드
    message: string; // 응답 메시지
    data: T; // 제네릭 데이터 타입
}

export type SigninDto = {
  email: string;
  password: string;
};

export type SignupDto = {
  email: string;
  password: string;
  nickname: string;
};

export type UserRole = "ROLE_USER" | "ROLE_ADMIN"; // Enum 타입 정의 (Java Enum에 맞게 설정)

export interface User {
  id: number; 
  nickname: string; 
  email: string; 
  password: string; 
  userRole: UserRole; 
}

// Page 타입 정의
export type Page<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
};

