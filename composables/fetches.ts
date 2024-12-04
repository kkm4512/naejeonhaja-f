import type { ReqPlayer } from "~/types/req/reqLolDto";
import type { ApiResponse, BaseExceptionResponse } from "~/types/res/common";
import type { RiftResponseDto } from "~/types/res/resLolDto";

export const lolFetch = async (teams: ReqPlayer[], endPoint: string): Promise<ApiResponse<RiftResponseDto>> => {
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

        // Parse response body
        const apiResponse: ApiResponse<RiftResponseDto> | BaseExceptionResponse = await response.json();

        // Check if the response status is not OK (error case)
        if (!response.ok) {
            alert(apiResponse.message)
            throw apiResponse as BaseExceptionResponse;
        }

        // Return parsed ApiResponse if successful
        return apiResponse as ApiResponse<RiftResponseDto>;
    } catch (error) {
        console.error("Failed to send match data:", error);
        // Re-throw the error for higher-level handling
        throw error;
    }
};
