const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;

const REDIRECT_URI = "http://127.0.0.1:5173/callback";

const SCOPES = [
    "user-read-private",
    "user-read-email",
    "playlist-read-private",
    "playlist-read-collaborative",
];


function base64UrlEncode(bytes) {
    const binary = String.fromCharCode(...bytes);

    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

function generateCodeVerifier() {
    const bytes = new Uint8Array(32);
    crypto.getRandomValues(bytes);

    return base64UrlEncode(bytes);
}

async function generateCodeChallenge(verifier) {
    const data = new TextEncoder().encode(verifier);

    const hash = await crypto.subtle.digest('SHA-256', data);
    const hashBytes = new Uint8Array(hash);

    return base64UrlEncode(hashBytes);
}

async function login() {
    const verifier = generateCodeVerifier();
    localStorage.setItem("code_verifier", verifier);
    const challenge = await generateCodeChallenge(verifier);

    const url = new URL("https://accounts.spotify.com/authorize");
    url.searchParams.append("client_id", CLIENT_ID);
    url.searchParams.append("response_type", "code");
    url.searchParams.append("redirect_uri", REDIRECT_URI);
    url.searchParams.append("scope", SCOPES.join(" "));
    url.searchParams.append("code_challenge", challenge);
    url.searchParams.append("code_challenge_method", "S256");

    window.location.href = url.toString();
}

function logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("code_verifier");

    window.location.reload();
}



// Spotify Playlist retrieval
async function getProfile(token) {
    const response = await fetch("https://api.spotify.com/v1/me",
        {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error(`Spotify returned ${response.status}`);
    }

    const data = await response.json();
    return data;
}

async function getPlaylists(token) {
    let allPlaylists = [];
    let url = "https://api.spotify.com/v1/me/playlists?limit=50";

    while (url) {
        const response = await fetch(url,
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            },
        );

        if (!response.ok) {
            throw new Error(`Spotify returned ${response.status}`);
        }

        const data = await response.json();
        allPlaylists = [...allPlaylists, ...data.items];
        url = data.next;
    }
    return allPlaylists;
}

async function getTracks(playlistId, token) {
    try {
        const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/items`,
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Spotify returned ${response.status}`);
        }

        const data = await response.json();
        return data.items;
    }
    catch (error) {
        console.log("Could not get tracks:", error);
        return null;
    }
}


export { CLIENT_ID, REDIRECT_URI, SCOPES, login, logout, getProfile, getPlaylists, getTracks };