export const getCookie = async() => {
    const { data } = await useFetch("/api/getCookie");
    return data.value;
}

export const removeCookie = async() => {
    await useFetch("/api/removeCookie");
}