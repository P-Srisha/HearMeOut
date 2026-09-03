function PlaylistGrid({ playlists, getPlaylistImage, onSelectPlaylist }) {
    return (
        <div className="playlist-grid">
            {playlists.map((playlist) => (
                <div className="playlist-card" key={playlist.id} onClick={() => onSelectPlaylist(playlist)}>
                    <div className="playlist-image">
                        <img 
                            src={getPlaylistImage(playlist)}
                            alt={playlist.name}
                        />

                        <div className="overlay">
                            <div
                                className="play-button" onClick={(e) => {
                                    e.stopPropagation();
                                    onSelectPlaylist(playlist);
                                }}
                            >
                                ▶
                            </div>
                        </div>
                    </div>
                    <h3>{playlist.name}</h3>
                    <p>{playlist.items.total} songs</p>
                </div>
            ))}
        </div>
    );
}

export default PlaylistGrid;