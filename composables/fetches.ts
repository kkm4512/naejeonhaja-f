import type { Player } from "~/types/lolType";

export const lolFetch = async (teams: Player[], endPoint: string): Promise<Response> => {
    const { public: { baseApi } } = useRuntimeConfig();
    const url = baseApi + "/game/lol/" + endPoint;
    const body = JSON.stringify({ teams });
  
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      return response;
    } catch (error) {
      console.error("Failed to send match data:", error);
      throw error;
    }
  };
  