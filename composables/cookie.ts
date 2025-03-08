import type { CookieRef } from '#app';
import { useRuntimeConfig } from '#imports';

export const removeCookie = () => {
  const config = useRuntimeConfig();
  const domain = config.public.cookieDomain;
  document.cookie = `Authorization=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; ${domain ? `domain=${domain}` : ''}`;
};

export const getAuthorizationCookie = ():CookieRef<string | null> => {
  return useCookie("Authorization");
}
