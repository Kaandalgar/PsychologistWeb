import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function AdminForgotPassword() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setMessage("");
        setError("");

        try {
            const response = await api.post(
                "/Auth/forgot-password",
                { email }
            );

            setMessage(response.data.message);

           
           
        } catch (err) {
            console.error(err);

            setError(
                "İşlem sırasında bir hata oluştu."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="admin-login-page">
            <div className="admin-login-card">

                <span>Admin Paneli</span>

                <h1>Şifremi Unuttum</h1>

                <p>
                    Admin hesabınıza ait e-posta adresini
                    girin.
                </p>

                {message && (
                    <div className="form-success">
                        {message}
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
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="admin-login-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Gönderiliyor..."
                            : "Şifre Sıfırlama Talebi Gönder"}
                    </button>

                </form>

                <div className="login-back-link">
                    <Link to="/admin/login">
                        ← Giriş ekranına dön
                    </Link>
                </div>

            </div>
        </main>
    );
}

export default AdminForgotPassword;