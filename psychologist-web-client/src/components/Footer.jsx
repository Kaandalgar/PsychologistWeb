import { Link } from "react-router-dom";
import { useSiteSettings } from "../context/SiteSettingsContext";

function Footer() {
    const { siteSettings } = useSiteSettings();

    return (
        <footer className="footer">
            <div className="container footer-container">

                <div className="footer-brand">
                    <h3>
                        {siteSettings?.fullName || "Psikolog Ad Soyad"}
                    </h3>

                    <p>
                        {siteSettings?.homeIntroText ||
                            "Kendinizi anlamak ve yaşamınızdaki zorluklarla daha sağlıklı şekilde baş etmek için profesyonel psikolojik destek."}
                    </p>
                </div>


                <div className="footer-links">
                    <h4>Hızlı Bağlantılar</h4>

                    <Link to="/">Ana Sayfa</Link>
                    <Link to="/hakkimda">Hakkımda</Link>
                    <Link to="/hizmetler">Hizmetler</Link>
                    <Link to="/blog">Blog</Link>
                    <Link to="/iletisim">İletişim</Link>
                </div>


                <div className="footer-contact">
                    <h4>İletişim</h4>

                    <p>
                        Telefon:{" "}
                        {siteSettings?.phone || "05XX XXX XX XX"}
                    </p>

                    <p>
                        E-posta:{" "}
                        {siteSettings?.email || "psikolog@email.com"}
                    </p>

                    <p>
                        {siteSettings?.address || "Ankara, Türkiye"}
                    </p>

                    {(siteSettings?.instagramUrl ||
                        siteSettings?.linkedInUrl) && (
                            <div className="footer-social">

                                {siteSettings?.instagramUrl && (
                                    <a
                                        href={siteSettings.instagramUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        Instagram
                                    </a>
                                )}

                                {siteSettings?.linkedInUrl && (
                                    <a
                                        href={siteSettings.linkedInUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        LinkedIn
                                    </a>
                                )}

                            </div>
                        )}

                </div>

            </div>


            <div className="footer-bottom">
                © {new Date().getFullYear()}{" "}
                {siteSettings?.fullName || "Psikolog Ad Soyad"}.
                Tüm hakları saklıdır.
            </div>

        </footer>
    );
}

export default Footer;