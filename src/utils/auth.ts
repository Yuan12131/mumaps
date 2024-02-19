export async function getAccessToken(): Promise<string | null> {
  try {
    const response = await fetch("/auth/token");
    const json = await response.json();

    if (json.access_token) {
      return json.access_token;
    } else {
      console.error("토큰이 비어 있습니다.");
      return null;
    }
  } catch (error) {
    console.error("토큰을 가져오는 도중 오류가 발생했습니다.", error);
    return null;
  }
}

export async function getSearchToken(): Promise<string | null> {
  try {
    const response = await fetch("/auth/searchToken");
    const json = await response.json();

    if (json.access_token) {
      return json.access_token;
    } else {
      console.error("검색 토큰이 비어 있습니다.");
      return null;
    }
  } catch (error) {
    console.error("검색 토큰을 가져오는 도중 오류가 발생했습니다.", error);
    return null;
  }
}