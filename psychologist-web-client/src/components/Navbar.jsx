import { useState } from "react";
import { Link } from "react-router-dom";
import { useSiteSettings } from "../context/SiteSettingsContext";

function Navbar() {
    const { siteSettings } = useSiteSettings();
    const [menuOpen, setMenuOpen] = useState(false);

    const closeMenu = () => {
        setMenuOpen(false);
    };

    return (
        <header className="navbar">
            <div className="container navbar-container">

                <Link
                    to="/"
                    className="logo"
                    onClick={closeMenu}
                >
                    <span className="logo-title">
                        {siteSettings?.fullName ||
                            "Psikolog Ad Soyad"}
                    </span>

                    <span className="logo-subtitle">
                        Psikolojik Danışmanlık
                    </span>
                </Link>


                {/* MOBİL MENÜ BUTONU */}
                <button
                    type="button"
                    className={`mobile-menu-button ${menuOpen ? "open" : ""
                        }`}
                    onClick={() =>
                        setMenuOpen((prev) => !prev)
                    }
                    aria-label="Menüyü aç/kapat"
                    aria-expanded={menuOpen}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>


                {/* MENÜ */}
                <nav
                    className={`nav-links ${menuOpen ? "mobile-open" : ""
                        }`}
                >
                    <Link
                        to="/"
                        onClick={closeMenu}
                    >
                        Ana Sayfa
                    </Link>

                    <Link
                        to="/hakkimda"
                        onClick={closeMenu}
                    >
                        Hakkımda
                    </Link>

                    <Link
                        to="/hizmetler"
                        onClick={closeMenu}
                    >
                        Hizmetler
                    </Link>

                    <Link
                        to="/blog"
                        onClick={closeMenu}
                    >
                        Blog
                    </Link>

                    <Link
                        to="/iletisim"
                        onClick={closeMenu}
                    >
                        İletişim
                    </Link>

                    <Link
                        to="/randevu"
                        className="appointment-button"
                        onClick={closeMenu}
                    >
                        Randevu Al
                    </Link>
                </nav>

            </div>
        </header>
    );
}

export default Navbar;