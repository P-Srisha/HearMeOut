function normalize(text) {
    return text.toLowerCase().replace(/&/g, "and")
        .replace(/[^\w\s]/g, "")
        .replace(/\s+/g, " ")
        .trim();
}

async function getPreviewUrl(track) {
    const spotifyArtists = track.artists.map((artist) => normalize(artist.name));
    const spotifyTitle = normalize(track.name);

    //const artistQuery = track.artists.map((artist) => artist.name).join(" ");
    const artistQuery = track.artists[0].name;
    const term = encodeURIComponent(`${artistQuery} ${track.name}`);

    const response = await fetch(`https://itunes.apple.com/search?term=${term}&media=music&entity=song&limit=10`);

    if (!response.ok) {
        throw new Error(`iTunes returned ${response.status}`);
    }

    const data = await response.json();

    const validResults = data.results.filter((result) => {
        if (!result.previewUrl) {
            return false;
        }

        const itunesArtist = normalize(result.artistName);
        const itunesTitle = normalize(result.trackName);

        const artistMatches = spotifyArtists.some
            ((artist) =>
                artist === itunesArtist ||
                itunesArtist.includes(artist) ||
                artist.includes(itunesArtist)
            );

        const titleMatches = spotifyTitle === itunesTitle ||
            itunesTitle.startsWith(spotifyTitle + " feat") ||
            itunesTitle.startsWith(spotifyTitle + " featuring");

        return artistMatches && titleMatches;
    });

    if (validResults.length === 0) {
        console.log("No valid preview found.");
        return null;
    }

    return validResults[0].previewUrl;
}

export { normalize, getPreviewUrl };