# HearMeOut

A music recognition game built with React and Vite.

HearMeOut connects to a user's Spotify account, loads their playlists, and turns them into a progressive music recognition game. Players listen to increasingly longer portions of a randomly chosen song and are tasked to recognize it within 30-seconds.

## Features

- Spotify Authentication: Secure OAuth 2.0 authentication using PKCE.
- Playlist Integration: Fetches and displays the user's Spotify playlists with artwork.
- Random Song Selection: Selects a random playable track from the chosen playlist.
- Cross-API Track Resolution: Matches Spotify track metadata against iTunes results to obtain usable audio previews.
- Track Matching and Validation: Uses artist/title matching and filtering to avoid incorrect iTunes results such as remixes, alternate versions, or unrelated tracks.
- Progressive Audio Reveals: Gradually increases the available audio from 0.1s to 30s.
- Interactive Gameplay: Players can play, pause, skip reveal stages, and submit guesses.
- Song Search and Autocomplete: Search through playlist tracks with real-time suggestions.
- Keyboard Navigation: Navigate search results using ArrowUp, ArrowDown, Enter and Esc.
- Guess Validation: Correct guesses immediately end the round, while incorrect guesses advance the reveal stage.
- Audio State Management: Automatically pauses and resets audio when switching songs or ending rounds.
- Component-Based Architecture: Separates authentication, API services, playlist selection, gameplay and UI components.

## Tech Stack

- **Frontend:** React, Vite
- **Styling:** CSS
- **Authentication:** Spotify OAuth 2.0 with PKCE
- **APIs:** Spotify Web API, iTunes Search API
- **Audio:** HTML5 Audio API
- **Development:** JavaScript, Git, GitHub


## How It Works

1. **Authentication**  
   The user logs into Spotify using OAuth 2.0 with PKCE.

2. **Playlist Selection**  
   The application retrieves the user's Spotify playlists and displays them with their artwork in a grid-like manner.

3. **Track Selection**  
   When a playlist is selected, a random track is chosen from its contents.

4. **Audio Preview Resolution**  
   The selected track's title and artist information are searched through the iTunes Search API to find a matching audio preview.

5. **Progressive Reveal**  
   The song starts with a 0.1-second reveal. Each incorrect guess or skip advances the reveal through 0.5s, 2s, 4s, 8s, 15s, and finally 30s.

6. **Guess Validation**  
   The user's guess is compared against the selected track. A correct guess ends the round immediately, while an incorrect guess advances the reveal stage.

7. **Round Completion**  
   The round ends when the player either correctly identifies the song or reaches the 30-second limit. The result and song information are then displayed.


## Project Structure

```text
src/  
├── assets/  
├── components/  
│    ├── GameScreen.jsx  
│    ├── Header.jsx  
│    ├── LoginScreen.jsx  
│    └── PlaylistGrid.jsx  
├── game/  
│    └── gameLogic.js  
├── services/   
│    ├── itunes.js  
│    └── spotify.js  
├── pages/  
│    └── Callback.jsx  
├── App.jsx  
├── index.css  
└── main.jsx

```

## Setup and Installation

### Prerequisites

- Node.js
- A Spotify Developer application

### Installation

1. Clone the repository:

```bash
git clone https://github.com/P-Srisha/HearMeOut.git
cd HearMeOut
```

2. Install dependencies

```bash
npm install
```

3. Configure Spotify

Create a Spotify application through the Spotify Developer Dashboard.

Add the following redirect URI to your application:
```bash
http://127.0.0.1:5173/callback
```

Create a .env file in the project root:

```bash
VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id
```

4. Start the development server:

```bash
npm run dev
```

## Future Improvements

- Multiplayer or competitive gameplay
- Persistent game statistics and scoring
- Expanded support for different audio preview sources

## Disclaimer

This project uses the Spotify Web API and iTunes Search API to retrieve playlist metadata and audio preview information. **It is not affiliated with, endorsed by, or sponsored by Spotify or Apple.**

This application is intended to be run locally and is not intended for commercial use.
