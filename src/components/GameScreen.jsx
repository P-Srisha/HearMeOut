import { useEffect, useRef, useState } from "react";

const REVEAL_TIMES = [0.1, 0.5, 2, 4, 8, 15, 30]

function GameScreen({
    playlist,
    getPlaylistImage,
    onBack,
    onPlayPause,
    isPlaying,
    currentTime,
    currentRevealIndex,
    onSkip,
    tracks,
    onGuess,
    roundStatus,
    onNewSong,
    selectedTrack }) {

    const [guess, setGuess] = useState("");
    const [showResults, setShowResults] = useState(false);
    const [selectedResultIndex, setSelectedResultIndex] = useState(-1);
    const [guessFeedback, setGuessFeedback] = useState("");
    const guessContainerRef = useRef(null);
    const selectedResultRef = useRef(null); // to autoscroll with key up and key down

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (guessContainerRef.current && !guessContainerRef.current.contains(event.target)) {
                setShowResults(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [])

    const filteredTracks = tracks
        .map(entry => entry.item ?? entry.track ?? entry)
        .filter(track => track?.name)
        .filter(track => track.name.toLowerCase().includes(guess.toLowerCase()));


    const submitGuess = async (track) => {
        setGuess("");
        setShowResults(false);
        setSelectedResultIndex(-1);

        const correct = await onGuess(track);
    }
    const handleGuessKeyDown = (event) => {
        if (!showResults || filteredTracks.length === 0) return;

        if (event.key === "ArrowDown") {
            event.preventDefault();

            setSelectedResultIndex((current) => (
                current < filteredTracks.length - 1 ? current + 1 : 0
            ));
        }

        if (event.key === "ArrowUp") {
            event.preventDefault();

            setSelectedResultIndex((current) => (
                current > 0 ? current - 1 : filteredTracks.length - 1
            ));
        }

        if (event.key === "Enter") {
            event.preventDefault();

            if (selectedResultIndex >= 0) {
                const selectedTrack = filteredTracks[selectedResultIndex];

                submitGuess(selectedTrack);
            }
        }

        if (event.key === "Escape") {
            setShowResults(false);
            setSelectedResultIndex(-1);
        }
    }

    useEffect(() => {
        if (selectedResultRef.current) {
            selectedResultRef.current.scrollIntoView({
                block: "nearest",
            });
        }
    }, [selectedResultIndex]);

    return (
        <div className="game-screen">
            <button className="secondary-button" onClick={onBack}>
                ←
            </button>

            <div className="game-content">
                <div className="game-cover">
                    <img
                        src={getPlaylistImage(playlist)}
                        alt={playlist.name}
                    />
                </div>

                <div className="playback-timer">
                    <div className="timer-track">
                        <div className="timer-progress"
                            style={{
                                width: `${Math.max(currentTime > 0 ? 5 : 0, Math.min((currentTime / REVEAL_TIMES[currentRevealIndex]) * 100, 100))}%`
                            }}
                        />
                    </div>

                    <button className="game-play-button" onClick={onPlayPause}>
                        {isPlaying ? (
                            <span className="game-pause-icon">
                                <span></span>
                                <span></span>
                            </span>
                        ) : (
                            <span className="game-play-icon"></span>
                        )}
                    </button>

                    <div className="reveal-times">
                        {REVEAL_TIMES.map((time, index) => (
                            <div
                                key={time}
                                className={`reveal-time ${index < currentRevealIndex ? "passed" :
                                    index === currentRevealIndex ? "current" : "upcoming"
                                    }`}
                            >
                                {time}s
                            </div>
                        ))}
                    </div>

                    <div className="guess-row">
                        <div className="guess-container" ref={guessContainerRef}>
                            <input
                                type="text"
                                placeholder="Search a song"
                                className="guess-input"
                                value={guess}
                                onChange={(e) => {
                                    setGuess(e.target.value);
                                    setSelectedResultIndex(-1);
                                    setGuessFeedback("");
                                }}
                                onFocus={() => setShowResults(true)}
                                onKeyDown={handleGuessKeyDown}
                            />

                            {showResults && (
                                <div className="guess-results">
                                    {filteredTracks.map((track, index) => (
                                        <div key={track.id}
                                            ref={index === selectedResultIndex ? selectedResultRef : null}
                                            className={`guess-result ${index === selectedResultIndex ? "selected" : ""}`}
                                            onClick={() => {
                                                submitGuess(track);
                                            }}
                                        >
                                            {track.name}
                                            <span className="guess-artist">
                                                {" - "}{track.artists?.map(artist => artist.name).join(", ")}
                                            </span>
                                        </div>
                                    ))}
                                </div>)
                            }
                        </div>

                        <button className="secondary-button" onClick={onSkip}>
                            Skip
                        </button>
                    </div>
                </div>
            </div>

            {roundStatus !== "playing" && (
                <div className="round-overlay">
                    <div className="round-popup">
                        {roundStatus === "correct" ? (
                            <h2>Correct</h2>
                        ) : (
                            <h2>Time's up</h2>
                        )}

                        {selectedTrack && (
                            <p>
                                {selectedTrack.name}
                                {" - "}
                                {selectedTrack.artists?.map(
                                    artist => artist.name
                                ).join(", ")}
                            </p>
                        )}


                        <div className="round-buttons">
                            <button className="secondary-button" onClick={onNewSong}>
                                New Song
                            </button>

                            <button className="secondary-button" onClick={onBack}>
                                Back to Playlists
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    )
}

export default GameScreen;