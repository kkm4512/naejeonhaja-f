import type { ApiResponse, Page } from "~/types/common";
import type { LolPlayerHistoryResponseSimpleDto } from "~/types/game/lol/res/resLolDto";

// 플레이어 히스토리 내역을 부모 컴포넌트로 올려주는 메서드
export const emitSearchResults = debounce(async (domain: string, query: string, page: number, emit: (event: string, data: Page<LolPlayerHistoryResponseSimpleDto>) => void ) => {
    const response = await uFetch<null, ApiResponse<Page<LolPlayerHistoryResponseSimpleDto>>>(
      null,
      `/game/lol/${domain}/simpleSearch?playerHistoryTitle=${query}&page=${page}`,
      "GET",
      true
    );
    emit("update:lolPlayerHistorySearchResults", response.data); // 부모에게 검색 결과 전달
  }, 300);