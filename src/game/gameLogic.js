import { getPreviewUrl } from "../services/itunes";

async function getRandomTrack(tracks) {
    const availableTracks = [...tracks];

    while (availableTracks.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableTracks.length);
        const randomItem = availableTracks.splice(randomIndex, 1)[0];
        const track = randomItem.item;

        if (!track || track.type !== "track") {
            continue;
        }
        console.log("Trying:", track.name);
        const previewUrl = await getPreviewUrl(track);

        if (previewUrl) {
            console.log("Found preview:", track.name);
            return { track, previewUrl };
        }
        console.log("No preview, trying another track...");
    }
    console.log("No playable tracks found.");
    return null;
}

export { getRandomTrack };