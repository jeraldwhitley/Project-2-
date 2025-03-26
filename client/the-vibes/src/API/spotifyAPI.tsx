interface SpotifyTokenResponse{
  access_token: string;
  token_type: string;
  expires_in: number;
}

export const getToken = async():Promise<string | null> => {
    try {
        const CLIENT_ID = "8af6542b2cd3449c93103801e10a07f6";
        const CLIENT_SECRET = "5e63eea52cd7402696cbcafbfdb4ad5d";
        const response = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: "Basic " + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`),
            },
            body: "grant_type=client_credentials",
          });
      
          const data: SpotifyTokenResponse = await response.json();
          return data.access_token;
    } catch (err) {
       console.error("Error getting token", err) 
       throw err
    }
}