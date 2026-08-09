import { useEffect, useState } from "react";
import "./index.css"
import { CLIENT_ID, login, logout } from "./services/spotify";
// import { FastAverageColor } from "fast-average-color";

// const fac = new FastAverageColor();

function App() {
	const [profile, setProfile] = useState(null);
	const [playlists, setPlaylists] = useState([]);
	const [selectedPlaylist, setSelectedPlaylist] = useState(null);
	const [tracks, setTracks] = useState(null);
	// const [themeColor, setThemeColor] = useState(null);
	
	async function getProfile(token) {
		const response = await fetch("https://api.spotify.com/v1/me",
			{
				method: "GET",
				headers: {
					"Authorization": `Bearer ${token}`,
				},
			}
		);

		const data = await response.json();
		setProfile(data);
	}

	async function getPlaylists(token) {
		const response = await fetch("https://api.spotify.com/v1/me/playlists",
			{
				method: "GET",
				headers: {
					"Authorization": `Bearer ${token}`,
				},
			},
		);

		const data = await response.json();
		setPlaylists(data.items);
	}

	async function getTracks(playlistId, token) {
		const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/items`,
			{
				method: "GET",
				headers: {
					"Authorization": `Bearer ${token}`,
				},
			}
		);

		const data = await response.json();
		setTracks(data.items);
	}

	function selectPlaylist(playlist) {
	// 	const img = new Image();
	// 	img.src = playlist.images[0].url;
	// 	await img.decode();
	// 	const color = await fac.getColorAsync(img);
		const token = localStorage.getItem("access_token");
		getTracks(playlist.id, token);
		console.log(playlist);
		setSelectedPlaylist(playlist);
	}

	useEffect(() => {
		const token = localStorage.getItem("access_token");

		if (token) {
			getProfile(token);
			getPlaylists(token);
		}
	}, []);

	useEffect(() => {
		console.log(playlists);
	}, [playlists]);

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
										src={playlist.images?.[0]?.url}
										alt={playlist.name}
									/>

									<div className="overlay">
										<div className="play-button">
											 ▶
    									</div>
									</div>
								</div>
								<h3>{playlist.name}</h3>
								<p>{playlist.items.total} songs</p>
							</div>
						))}
					</div>


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