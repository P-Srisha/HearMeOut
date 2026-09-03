function Header({ profile, onLogout }) {
    return (
        <header className="header">
            <h1>HearMeOut</h1>
            <details className="account-menu">
                <summary>
                    {profile.display_name} ▾
                </summary>

                <div className="account-dropdown">
                    <button className="secondary-button" onClick={onLogout}>
                        Logout
                    </button>
                </div>
            </details>
        </header>
    );
}

export default Header;