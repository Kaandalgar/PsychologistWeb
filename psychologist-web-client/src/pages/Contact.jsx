import { useState } from "react";
import api from "../services/api";
import { useSiteSettings } from "../context/SiteSettingsContext";

function Contact() {
    const { siteSettings } = useSiteSettings();

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
    });

    const [successMessage, setSuccessMessage] =
        useState("");

    const [errorMessage, setErrorMessage] =
        useState("");

    const [loading, setLoading] =
        useState(false);


    // =========================
    // API HATA MESAJI
    // =========================

    const getApiErrorMessage = (
        error,
        fallbackMessage
    ) => {
        const data = error.response?.data;

        if (!data) {
            return fallbackMessage;
        }

        if (typeof data === "string") {
            return data;
        }

        // ASP.NET Core DataAnnotations
        if (data.errors) {
            const messages =
                Object.values(data.errors).flat();

            if (messages.length > 0) {
                return messages[0];
            }
        }

        if (data.message) {
            return data.message;
        }

        return fallbackMessage;
    };


    // =========================
    // INPUT CHANGE
    // =========================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };


    // =========================
    // FORM SUBMIT
    // =========================

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSuccessMessage("");
        setErrorMessage("");
        setLoading(true);

        try {
            await api.post(
                "/ContactMessages",
                formData
            );

            setSuccessMessage(
                "Mesajınız başarıyla gönderildi. En kısa sürede sizinle iletişime geçilecektir."
            );

            setFormData({
                fullName: "",
                email: "",
                phone: "",
                subject: "",
                message: ""
            });
        }
        catch (error) {
            console.error(
                "Mesaj gönderilemedi:",
                error
            );

            setErrorMessage(
                getApiErrorMessage(
                    error,
                    "Mesajınız gönderilirken bir hata oluştu. Lütfen tekrar deneyin."
                )
            );
        }
        finally {
            setLoading(false);
        }
    };


    return (
        <main className="contact-page">

            {/* BAŞLIK */}

            <section className="page-hero">

                <div className="container">

                    <span>İletişim</span>

                    <h1>
                        Benimle İletişime Geçin
                    </h1>

                    <p>
                        Merak ettiğiniz konular veya görüşme
                        hakkında bilgi almak için iletişim
                        formunu kullanabilirsiniz.
                    </p>

                </div>

            </section>


            {/* İLETİŞİM */}

            <section className="contact-section">

                <div className="container contact-container">

                    {/* SOL TARAF */}

                    <div className="contact-info">

                        <span className="section-small-title">
                            İletişim
                        </span>

                        <h2>
                            Size nasıl yardımcı olabilirim?
                        </h2>

                        <p>
                            Görüşme süreci, çalışma alanları
                            veya randevu hakkında merak
                            ettikleriniz için mesaj
                            gönderebilirsiniz.
                        </p>


                        <div className="contact-info-list">

                            {/* EMAIL */}

                            <div className="contact-info-item">

                                <span>E-posta</span>

                                <strong>
                                    {siteSettings?.email ||
                                        "psikolog@example.com"}
                                </strong>

                            </div>


                            {/* TELEFON */}

                            <div className="contact-info-item">

                                <span>Telefon</span>

                                <strong>
                                    {siteSettings?.phone ||
                                        "05XX XXX XX XX"}
                                </strong>

                            </div>


                            {/* ADRES */}

                            <div className="contact-info-item">

                                <span>Adres</span>

                                <strong>
                                    {siteSettings?.address ||
                                        "Adres bilgisi"}
                                </strong>

                            </div>


                            {/* GÖRÜŞME */}

                            <div className="contact-info-item">

                                <span>Görüşme</span>

                                <strong>
                                    Online / Yüz Yüze
                                </strong>

                            </div>

                        </div>


                        {/* SOSYAL MEDYA */}

                        {(siteSettings?.instagramUrl ||
                            siteSettings?.linkedInUrl) && (

                                <div className="contact-social">

                                    {siteSettings?.instagramUrl && (
                                        <a
                                            href={
                                                siteSettings.instagramUrl
                                            }
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            Instagram
                                        </a>
                                    )}


                                    {siteSettings?.linkedInUrl && (
                                        <a
                                            href={
                                                siteSettings.linkedInUrl
                                            }
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            LinkedIn
                                        </a>
                                    )}

                                </div>

                            )}


                        {/* NOT */}

                        <div className="contact-note">

                            <strong>Not:</strong>{" "}

                            İletişim formuna özel sağlık
                            bilgilerinizi veya ayrıntılı terapi
                            geçmişinizi yazmamanızı öneririz.

                        </div>

                    </div>


                    {/* FORM */}

                    <form
                        className="contact-form"
                        onSubmit={handleSubmit}
                    >

                        {successMessage && (
                            <div className="form-success">
                                {successMessage}
                            </div>
                        )}

                        {errorMessage && (
                            <div className="form-error">
                                {errorMessage}
                            </div>
                        )}


                        {/* AD SOYAD */}

                        <div className="form-group">

                            <label>
                                Ad Soyad
                            </label>

                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="Adınız ve soyadınız"
                                minLength={2}
                                maxLength={100}
                                required
                            />

                        </div>


                        <div className="form-row">

                            {/* EMAIL */}

                            <div className="form-group">

                                <label>
                                    E-posta
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="ornek@email.com"
                                    maxLength={150}
                                    required
                                />

                            </div>


                            {/* TELEFON */}

                            <div className="form-group">

                                <label>
                                    Telefon
                                    <span>
                                        {" "}
                                        (Opsiyonel)
                                    </span>
                                </label>

                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="05XX XXX XX XX"
                                    maxLength={20}
                                />

                            </div>

                        </div>


                        {/* KONU */}

                        <div className="form-group">

                            <label>
                                Konu
                            </label>

                            <input
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                placeholder="Mesajınızın konusu"
                                minLength={3}
                                maxLength={150}
                                required
                            />

                        </div>


                        {/* MESAJ */}

                        <div className="form-group">

                            <label>
                                Mesajınız
                            </label>

                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                rows="6"
                                minLength={5}
                                maxLength={2000}
                                placeholder="Mesajınızı buraya yazabilirsiniz..."
                                required
                            />

                            <small>
                                {formData.message.length}/2000
                            </small>

                        </div>


                        <button
                            type="submit"
                            className="contact-submit"
                            disabled={loading}
                        >
                            {loading
                                ? "Gönderiliyor..."
                                : "Mesaj Gönder"}
                        </button>

                    </form>

                </div>

            </section>

        </main>
    );
}

export default Contact;