import type { ApiResponse } from "~/types/common";

export const uFetch = async <T, R>(data: T | null,endPoint: string,methods: string,requiresAuth: boolean = false): Promise<R> => {
    const { public: { baseApi } } = useRuntimeConfig();
    const jwt = requiresAuth ? getCookie() : null;
    const url = baseApi + endPoint;
    const body = data !== null ? JSON.stringify(data) : null;
    let response;
  
    try {
      // 요청 옵션 설정
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (requiresAuth && jwt?.value) {
        headers["Authorization"] = jwt.value;
      }
  
      const fetchOptions: RequestInit = {
        method: methods,
        headers,
        credentials: "include", // 쿠키 포함 설정
      };
  
      if (body) {
        fetchOptions.body = body;
      }
  
      // Fetch 요청
      response = await fetch(url, fetchOptions);
      const result = await response.json();
  
      // Handle non-OK status (failure case)
      if (!response.ok) {
        const errorResponse: ApiResponse<void> = result;
        console.error("Server Error:", errorResponse);
        alert(errorResponse.message);
        throw errorResponse; // Re-throw as BaseExceptionResponse
      }
  
      // Return parsed success response as R
      return result as R;
    } catch (error) {
      console.error("Failed to send match data:", error);
      throw error;
    }
  };
  