export interface ApiResponse<T> {
    code: number; // 응답 코드
    message: string; // 응답 메시지
    data: T; // 제네릭 데이터 타입
}

  export type BaseExceptionResponse = {
    code: number; // HTTP 상태 코드
    message: string; // 에러 메시지
    data: null; // 에러 응답에서 데이터는 null
};
  