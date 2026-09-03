function LoginScreen({ onLogin }) {
    return (
        <div className='login-screen'>
            <h1>HearMeOut</h1>
            <p>Can you recognise your own playlists?</p>

            <button className="login-button" onClick={onLogin}>
                Login with Spotify
            </button>
        </div>
    );
}

export default LoginScreen;