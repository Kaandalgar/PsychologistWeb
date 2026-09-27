import { useState } from "react";
import {
    Link,
    useNavigate,
    useSearchParams
} from "react-router-dom";

import api from "../services/api";

function AdminLogin() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const passwordReset =
        searchParams.get("passwordReset");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await api.post(
                "/Auth/login",
                {
                    email,
                    password
                }
            );

            localStorage.setItem(
                "token",
                response.data.token
            );

            if (response.data.admin) {
                localStorage.setItem(
                    "admin",
                    JSON.stringify(response.data.admin)
                );
            }

            navigate("/admin");
        } catch (err) {
            console.error("Login hatası:", err);

            if (
                typeof err.response?.data === "string"
            ) {
                setError(err.response.data);
            } else {
                setError(
                    err.response?.data?.message ||
                    "E-posta veya şifre hatalı."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="admin-login-page">
            <div className="admin-login-card">

                <span>Admin Paneli</span>

                <h1>Giriş Yap</h1>

                <p>
                    Yönetim paneline erişmek için
                    hesabınızla giriş yapın.
                </p>

                {passwordReset === "true" && (
                    <div className="form-success">
                        Şifreniz başarıyla değiştirildi.
                        Yeni şifrenizle giriş yapabilirsiniz.
                    </div>
                )}

                {error && (
                    <div className="login-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label>E-posta</label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            placeholder="admin@psikolog.com"
                            autoComplete="email"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Şifre</label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            placeholder="Şifrenizi girin"
                            autoComplete="current-password"
                            required
                        />
                    </div>

                    <div className="forgot-password-link">
                        <Link to="/admin/sifremi-unuttum">
                            Şifremi unuttum?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        className="admin-login-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Giriş yapılıyor..."
                            : "Giriş Yap"}
                    </button>

                </form>

            </div>
        </main>
    );
}

export default AdminLogin;