import { useRuntimeConfig } from '#imports';

export const removeCookie = () => {
  const config = useRuntimeConfig();
  const domain = config.public.cookieDomain;

  document.cookie = `Authorization=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};
