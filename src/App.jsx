import "./index.css"
import { CLIENT_ID } from "./services/spotify";

function App() {
	console.log(import.meta.env);
	return (
    	<div className="app">
			<h1>HearMeOut</h1>
			
			<p>Can you recognise your own playlists?</p>
			<p>{CLIENT_ID}</p>
			<button>Login with Spotify</button>
		</div>
  	);
}

export default App;