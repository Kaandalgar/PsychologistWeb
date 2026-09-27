import { Link } from "react-router-dom";

function NotFound() {
    return (
        <main className="not-found-page">
            <div className="not-found-card">
                <span>404</span>

                <h1>Sayfa bulunamadı</h1>

                <p>
                    Aradığınız sayfa kaldırılmış, taşınmış
                    veya hiç var olmamış olabilir.
                </p>

                <Link to="/" className="primary-button">
                    Ana Sayfaya Dön
                </Link>
            </div>
        </main>
    );
}

export default NotFound;