import { useState } from "react";
import {
    Link,
    useNavigate,
    useSearchParams
} from "react-router-dom";

import api from "../services/api";

function AdminResetPassword() {
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();

    const token = searchParams.get("token");

    const [newPassword, setNewPassword] =
        useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (!token) {
            setError(
                "Şifre sıfırlama bağlantısı geçersiz."
            );

            return;
        }

        if (newPassword.length < 8) {
            setError(
                "Şifre en az 8 karakter olmalıdır."
            );

            return;
        }

        if (newPassword !== confirmPassword) {
            setError(
                "Şifreler birbiriyle eşleşmiyor."
            );

            return;
        }

        setLoading(true);

        try {
            await api.post(
                "/Auth/reset-password",
                {
                    token,
                    newPassword
                }
            );

            navigate(
                "/admin/login?passwordReset=true"
            );
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data ||
                "Şifre değiştirilemedi."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="admin-login-page">

            <div className="admin-login-card">

                <span>Admin Paneli</span>

                <h1>Yeni Şifre</h1>

                <p>
                    Admin hesabınız için yeni bir
                    şifre belirleyin.
                </p>

                {error && (
                    <div className="login-error">
                        {typeof error === "string"
                            ? error
                            : "Şifre değiştirilemedi."}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <div className="form-group">

                        <label>Yeni Şifre</label>

                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) =>
                                setNewPassword(
                                    e.target.value
                                )
                            }
                            placeholder="En az 8 karakter"
                            minLength={8}
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label>
                            Yeni Şifre Tekrar
                        </label>

                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(
                                    e.target.value
                                )
                            }
                            placeholder="Şifrenizi tekrar girin"
                            required
                        />

                    </div>

                    <button
                        type="submit"
                        className="admin-login-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Değiştiriliyor..."
                            : "Şifremi Değiştir"}
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

export default AdminResetPassword;