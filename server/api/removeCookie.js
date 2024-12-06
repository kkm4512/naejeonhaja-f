export default defineEventHandler((event) => {
  setCookie(event, "Authorization", "", {
    maxAge: -1, // 쿠키 즉시 만료
    path: "/", // 전체 경로에서 쿠키 제거
  });
});
