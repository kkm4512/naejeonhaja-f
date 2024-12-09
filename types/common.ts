export interface ApiResponse<T> {
    code: number; // 응답 코드
    message: string; // 응답 메시지
    data: T; // 제네릭 데이터 타입
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

