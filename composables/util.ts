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
  
