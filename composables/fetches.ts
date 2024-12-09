import type { ApiResponse } from "~/types/common";

// 롤 데이터 보낼때 fetch 메서드
export const lolFetch = async <T,R>(teams: T,endPoint: string): Promise<R> => {
    const jwt = getCookie();
    const { public: { baseApi } } = useRuntimeConfig();
    const url = baseApi + "/game/lol/" + endPoint;
    const body = JSON.stringify(teams);

    try {
        let response;
        // 인증 O, 데이터 O
        if (jwt.value) {
            response =  await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization" : jwt.value
                },
                body,
            });
        }
        // 인증 X, 데이터 O
        else {
            response =  await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body,
            });            
        }

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

// 일반적인 fetch (인증 필요 x)
export const xFetch = async <T,R>(data: T,endPoint: string, methods: string): Promise<R> => {
    const { public: { baseApi } } = useRuntimeConfig();
    const url = baseApi + endPoint;
    const body = JSON.stringify(data);
    let response;

    try {
        // 데이터 O
        if (data !== null){
            response = await fetch(url, {
                method: methods,
                headers: {
                    "Content-Type": "application/json",
                },
                body,
            });
        }
        else {
            // 데이터 X 
            response = await fetch(url, {
                method: methods,
                headers: {
                    "Content-Type": "application/json",
                },
            });            
        }

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

// 일반적인 fetch (인증 필요 o)
export const oFetch = async <T,R>(data: T,endPoint: string, methods: string): Promise<R> => {
    const { public: { baseApi } } = useRuntimeConfig();
    const jwt = getCookie();
    const url = baseApi + endPoint;
    const body = JSON.stringify(data);
    let response;

    try {
        // 인증,데이터 O
        if (jwt.value && data !== null){
             response = await fetch(url, {
                credentials: "include",
                method: methods,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization" : jwt.value
                },
                body,
            });
        }
        // 인증 O, 데이터 X
        else if (jwt.value && data === null) {
            response = await fetch(url, {
                credentials: "include",
                method: methods,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization" : jwt.value
                },
            });
        }

        const result = await response?.json();

        // Handle non-OK status (failure case)
        if (!response?.ok) {
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

