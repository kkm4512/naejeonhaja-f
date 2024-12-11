export const logout = async () => {
    removeCookie();
    window.location.reload(); // 페이지 새로고침
};