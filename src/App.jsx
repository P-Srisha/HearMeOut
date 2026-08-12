import { useEffect, useState, useRef } from "react";
import "./index.css"
import { login, logout, getProfile, getPlaylists, getTracks } from "./services/spotify";
import { getRandomTrack } from "./game/gameLogic";
// import { FastAverageColor } from "fast-average-color";

// const fac = new FastAverageColor();

function App() {
	const [profile, setProfile] = useState(null);
	const [playlists, setPlaylists] = useState([]);
	const [selectedPlaylist, setSelectedPlaylist] = useState(null);
	const [tracks, setTracks] = useState(null);
	const [selectedTrack, setSelectedTrack] = useState(null);
	const audioRef = useRef(null);
	const [previewUrl, setPreviewUrl] = useState(null);
	// const [themeColor, setThemeColor] = useState(null);


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
		setSelectedPlaylist(playlist);

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

	// useEffect(() => {
	// 	console.log(playlists);
	// }, [playlists]);

	useEffect(() => {
		if (previewUrl && audioRef.current) {
			audioRef.current.play();
		}
	}, [previewUrl]);


	return (
		<div className="app">
			<h1>HearMeOut</h1>

			<p>Can you recognise your own playlists?</p>

			{profile ? (
				<>
					<h2>Welcome back, {profile.display_name}!</h2>
					<p>Number of playlists: {playlists.length}</p>

					<div className="playlist-grid">
						{playlists.map((playlist) => (						
							<div className="playlist-card" key={playlist.id} onClick={() => selectPlaylist(playlist)}>
								<div className="playlist-image">
									<img
										src={getPlaylistImage(playlist)}
										alt={playlist.name}
									/>

									<div className="overlay">
										<div className="play-button"
											 onClick={(e) => {
												e.stopPropagation();
												selectPlaylist(playlist);
											 }}>
											▶
										</div>
									</div>
								</div>
								<h3>{playlist.name}</h3>
								<p>{playlist.items.total} songs</p>
							</div>
						))}
					</div>

					<audio ref={audioRef} src={previewUrl}/>

					<button onClick={logout}>
						Logout
					</button>
				</>
			) : (
				<button onClick={login}>
					Login with Spotify
				</button>
			)}
		</div>
	);
}

export default App;