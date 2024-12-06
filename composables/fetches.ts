import type { ApiResponse } from "~/types/common";

// 롤 데이터 보낼때 fetch 메서드
export const lolFetch = async <T,R>(teams: T[],endPoint: string): Promise<R> => {
    const { public: { baseApi } } = useRuntimeConfig();
    const url = baseApi + "/game/lol/" + endPoint;
    const body = JSON.stringify(teams);

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body,
        });

        const result = await response.json();

        // Handle non-OK status (failure case)
        if (!response.ok) {
            const errorResponse: ApiResponse<void> = result;
            console.error("Server Error:", errorResponse);
            alert(errorResponse.message);
            throw errorResponse; // Re-throw as BaseExceptionResponse
        }

        // Return parsed success response as T
        return result as R;
    } catch (error) {
        console.error("Failed to send match data:", error);
        throw error;
    }
};

// 평범하게 사용되는 일반적인 fetch
export const uFetch = async <T,R>(data: T,endPoint: string, methods: string): Promise<R> => {
    const { public: { baseApi } } = useRuntimeConfig();
    const url = baseApi + endPoint;
    const body = JSON.stringify(data);

    try {
        const response = await fetch(url, {
            credentials: "include",
            method: methods,
            headers: {
                "Content-Type": "application/json",
            },
            body,
        });

        const result = await response.json();

        // Handle non-OK status (failure case)
        if (!response.ok) {
            const errorResponse: ApiResponse<void> = result;
            console.error("Server Error:", errorResponse);
            alert(errorResponse.message);
            throw errorResponse; // Re-throw as BaseExceptionResponse
        }

        // Return parsed success response as T
        return result as R;
    } catch (error) {
        console.error("Failed to send match data:", error);
        throw error;
    }
};

