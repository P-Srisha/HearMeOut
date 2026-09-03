import { useEffect, useState, useRef } from "react";
import "./index.css"
import { login, logout, getProfile, getPlaylists, getTracks } from "./services/spotify";
import { getRandomTrack } from "./game/gameLogic";

import LoginScreen from "./components/LoginScreen";
import Header from "./components/Header";
import PlaylistGrid from "./components/PlaylistGrid";
import GameScreen from "./components/GameScreen";

function App() {
	const [profile, setProfile] = useState(null);
	const [playlists, setPlaylists] = useState([]);
	const [selectedPlaylist, setSelectedPlaylist] = useState(null);
	const [tracks, setTracks] = useState([]);
	const [selectedTrack, setSelectedTrack] = useState(null);
	const audioRef = useRef(null);
	const [previewUrl, setPreviewUrl] = useState(0);

	const [currentView, setCurrentView] = useState("playlists");
	const [isPlaying, setIsPlaying] = useState(false);
	const [currentTime, setCurrentTime] = useState(0);
	const [roundStatus, setRoundStatus] = useState("playing");

	const REVEAL_TIMES = [0.1, 0.5, 2, 4, 8, 15, 30];
	const [currentRevealIndex, setCurrentRevealIndex] = useState(0);


	const togglePlayPause = async () => {
		if (!audioRef.current) return;

		if (audioRef.current.paused) {
			audioRef.current.currentTime = 0;
			setCurrentTime(0);
			await audioRef.current.play();
			setIsPlaying(true);
		}
		else {
			audioRef.current.pause();
			setIsPlaying(false);
		}
	}

	const handleTimeUpdate = () => {
		if (!audioRef.current) return;

		const time = audioRef.current.currentTime;
		setCurrentTime(time);
		const revealTime = REVEAL_TIMES[currentRevealIndex];
		
		if (time >= revealTime) {
			audioRef.current.pause();
			audioRef.current.currentTime = 0;
			setCurrentTime(0);
			setIsPlaying(false);

			if (currentRevealIndex === REVEAL_TIMES.length - 1)
				setRoundStatus("timeout");
		}
	}

	const handleAudioEnded = () => {
		setIsPlaying(false);

		if (currentRevealIndex === REVEAL_TIMES.length - 1) {
			setCurrentTime(0);
			setRoundStatus("timeout");
		}
	};

	const skipReveal = () => {
		if (currentRevealIndex < REVEAL_TIMES.length - 1) {
			setCurrentRevealIndex(currentRevealIndex + 1);
		}
		else {
			if (audioRef.current) {
				audioRef.current.pause();
				audioRef.current.currentTime = 0;
			}
			setIsPlaying(false);
			setCurrentTime(0);
			setRoundStatus("timeout");
		}
	}

	function getPlaylistImage(playlist) {
		if (playlist.name.startsWith("ql") && playlist.name.endsWith(" copy")) {
			const number = Number(playlist.name.match(/^ql(\d+) copy$/)?.[1]);

			const original = playlists.find(p => 
				p.name === `Quick Loop ${number}~`
			);

			if (original?.images?.[0]?.url) {
				return original.images[0].url;
			}
		}
		return playlist.images?.[0]?.url;
	}

	
	async function selectPlaylist(playlist) {
		const token = localStorage.getItem("access_token");
	
		if (audioRef.current) {
			audioRef.current.pause();
			audioRef.current.currentTime = 0;
		}
		setIsPlaying(false);
		setCurrentRevealIndex(0);

		setSelectedPlaylist(playlist);
		setCurrentView("game");
		setRoundStatus("playing");

		const playlistTracks = await getTracks(playlist.id, token);

		if (!playlistTracks || playlistTracks.length === 0) {
			console.log("No tracks found.");
			return;
		}
		setTracks(playlistTracks);

		const result = await getRandomTrack(playlistTracks);

		if (!result) {
			console.log("No playable tracks found.");
			return;
		}

		setSelectedTrack(result.track);
		setPreviewUrl(result.previewUrl);

		console.log("Selected track:", result.track);
		console.log("Preview URL:", result.previewUrl);
	}

	useEffect(() => {
		const token = localStorage.getItem("access_token");

		if (token) {
			async function loadData() {
				try {
					const profileData = await getProfile(token);
					const playlistData = await getPlaylists(token);
					
					setProfile(profileData);
					setPlaylists(playlistData);
				}
				catch (error) {
					console.log("Could not load Spotify data:", error);
				}
			}

			loadData();
		}
	}, []);

	const handleGuess = async (guessedTrack) => {
		if (!selectedTrack) return false;
		if (guessedTrack.id === selectedTrack.id) {
			console.log("Correct");

			if (audioRef.current) {
				audioRef.current.pause();
				audioRef.current.currentTime = 0;
			}

			setIsPlaying(false);
			setCurrentTime(0);
			setRoundStatus("correct");

			return true;
		}
		console.log("Wrong");
		
		if (currentRevealIndex === REVEAL_TIMES.length - 1) {
			if (audioRef.current) {
				audioRef.current.pause();
				audioRef.current.currentTime = 0;
			}
			setIsPlaying(false);
			setCurrentTime(0);
			setRoundStatus("timeout");

			return false;
		}
		setCurrentRevealIndex((current) => current + 1);
		return false;
	}

	const newSong = async () => {
		if (!tracks || tracks.length === 0) return;

		if (audioRef.current) {
			audioRef.current.pause();
			audioRef.current.currentTime = 0;
		}

		setIsPlaying(false);
		setCurrentTime(0);
		setCurrentRevealIndex(0);
		setRoundStatus("playing");

		const result = await getRandomTrack(tracks);

		if (!result) {
			console.log("No playable tracks found.");
			return;
		}

		setSelectedTrack(result.track);
		setPreviewUrl(result.previewUrl);
	}

	return (
		<div className="app">
			{!profile ? (
				<LoginScreen onLogin={login} />
			) : (
				<>
					<Header 
						profile={profile} 
						onLogout={logout}
					/>

					{currentView === "playlists" && (
						<>
							<h2>Welcome back, {profile.display_name}!</h2>

							<p>Number of playlists: {playlists.length}</p>

							<PlaylistGrid
								playlists={playlists}
								getPlaylistImage={getPlaylistImage}
								onSelectPlaylist={selectPlaylist}
							/>
						</>	
					)}

					{currentView === "game" && selectedPlaylist && (
						<GameScreen 
							playlist={selectedPlaylist}
							getPlaylistImage={getPlaylistImage}
							onBack={() => setCurrentView("playlists")}
							onPlayPause={togglePlayPause}
							isPlaying={isPlaying}
							currentTime={currentTime}
							currentRevealIndex={currentRevealIndex}
							onSkip={skipReveal}
							tracks={tracks}
							onGuess={handleGuess}
							roundStatus={roundStatus}
							onNewSong={newSong}
							selectedTrack={selectedTrack}
						/>
					)}

					<audio 
						ref={audioRef}
						src={previewUrl}
						onTimeUpdate={handleTimeUpdate}
						onEnded={handleAudioEnded}
					/>
				</>
			)}
		</div>
	);
}

export default App;