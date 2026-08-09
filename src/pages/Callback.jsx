import { useEffect } from "react";
import { CLIENT_ID, REDIRECT_URI } from "../services/spotify";

function Callback() {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    async function getAccessToken(code) {
        const verifier = localStorage.getItem("code_verifier");

        const body = new URLSearchParams();
        body.append("client_id", CLIENT_ID);
        body.append("grant_type", "authorization_code");
        body.append("code", code);
        body.append("redirect_uri", REDIRECT_URI);
        body.append("code_verifier", verifier);

        const response = await fetch("https://accounts.spotify.com/api/token",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body,
            }
        );
        const data = await response.json();

        if (!response.ok) {
            console.error("Token request failed:", data);
            return;
        }

        localStorage.setItem("access_token", data.access_token);
        window.location.href = "/";
    }

    useEffect(() => {
        if (code)
            getAccessToken(code);
    }, [code]);

    return (
        <h3>Logging you in...</h3>
    );
}

export default Callback;