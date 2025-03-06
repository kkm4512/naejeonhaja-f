import html2canvas from "html2canvas";
import { TagType } from "~/types/inquiry/inquiryDtos";

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

  const diffTime = now.getTime() - date.getTime(); // 밀리초 차이
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); // 일 단위 변환

  if (diffDays === 0) {
    return "오늘"
  } else if (diffDays === 1) {
    return "1일 전";
  } else if (diffDays < 30) {
    return `${diffDays}일 전`;
  } else if (diffDays < 365) {
    return `${Math.floor(diffDays / 30)}개월 전`;
  } else {
    return `${Math.floor(diffDays / 365)}년 전`;
  }
};

