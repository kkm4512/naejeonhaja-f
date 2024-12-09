export const getCookie = () => {
    return useCookie("Authorization");
}

export const removeCookie = () => {
    document.cookie = "Authorization=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
}