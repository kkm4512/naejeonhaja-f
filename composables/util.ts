import html2canvas from "html2canvas";

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
  
  
