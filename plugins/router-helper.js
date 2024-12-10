export default defineNuxtPlugin(() => {
    const router = useRouter();
  
    return {
      provide: {
        redirectToLogin: () => {
          router.push("/user/signin");
        },
      },
    };
  });
  