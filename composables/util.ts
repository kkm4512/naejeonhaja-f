import html2canvas from "html2canvas";
import { jwtDecode } from "jwt-decode";
import { TagType } from "~/types/inquiry/inquiryDtos";
import type { User } from "~/types/user/req/User";

export const cleanDomain = (domain: string) => domain.replace(/^['"]|['"]$/g, '');

export const debounce = (func: Function, delay: number) => {
    let timeout: ReturnType<typeof setTimeout> | null = null;
  
    return function (...args: any[]) {
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => {
        func(...args);
      }, delay);
    };
  }

  export const getPlayerName = (name:string | undefined) => {
    if (name?.includes('#')) {
        return name.split('#')[0];
    }
    return name;
  };

  export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));


  export const captureScreen = async (x: number, y: number, w: number, h: number) => {
    try {
      const canvas = await html2canvas(document.body, {
        x,
        y,
        width: w,
        height: h,
        scale: 2,
        useCORS: true,
        backgroundColor: null,
        logging: false,
      });
  
      canvas.toBlob(async (blob) => {
        if (blob) { // blob이 null이 아닌 경우만 실행
          await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
          alert('클립보드에 복사되었습니다, Ctrl + V를 통하여 캡처한 화면을 붙여넣기 가능합니다');
        } else {
          alert('캡처에 실패했습니다: Blob 생성 실패');
        }
      });
    } catch (error) {
      console.error('캡처 오류:', error);
      alert('화면 캡처에 실패했습니다.');
    }
  };
  
  // 태그 타입 설명 매핑 객체
export const TagTypeDescriptions: Record<TagType, string> = {
  [TagType.MATCHING_ISSUE]: "매칭 문제",
  [TagType.TEAM_COMPOSITION]: "팀 구성",
  [TagType.ETC]: "기타",
  [TagType.BUG]: "버그",
  [TagType.FEATURE_REQUEST]: "기능 요청"
};
  

export const formatRelativeDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();

  // 시간 정보를 제거하고 날짜 차이만 계산
  const diffTime = Math.floor((now.setHours(0, 0, 0, 0) - date.setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24));

  if (diffTime === 0) {
    return "오늘";
  } else if (diffTime === 1) {
    return "1일 전";
  } else if (diffTime < 30) {
    return `${diffTime}일 전`;
  } else if (diffTime < 365) {
    return `${Math.floor(diffTime / 30)}개월 전`;
  } else {
    return `${Math.floor(diffTime / 365)}년 전`;
  }
};

export const getJwtFormatUser = (cookie: string | null | undefined): User | null => {
  if (!cookie) {
    return null; // 쿠키가 없으면 null 반환
  }

  try {
    const user: User = jwtDecode(cookie);
    return user;
  } catch (error) {
    console.error("Invalid JWT Token", error);
    return null; // 잘못된 토큰일 경우 null 반환
  }
};

