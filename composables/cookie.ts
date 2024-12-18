import { useRuntimeConfig } from '#imports';

export const removeCookie = () => {
  const config = useRuntimeConfig();
  const domain = config.public.cookieDomain;
  console.log("도매인 찍어보가 : " + domain);
  document.cookie = `Authorization=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; ${domain ? `domain=${domain}` : ''}`;
};
