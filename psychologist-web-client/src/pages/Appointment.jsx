import { useEffect, useState } from "react";
import api from "../services/api";
function Appointment() {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        appointmentDate: "",
        appointmentType: "Yüz Yüze",
        message: ""
    });

    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const [availableSlots, setAvailableSlots] = useState([]);


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

        // Backend düz string döndürürse
        if (typeof data === "string") {
            return data;
        }

        // ASP.NET Core validation hataları
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
    // MÜSAİT SAATLER
    // =========================

    const getAvailableSlots = async () => {
        try {
            const response = await api.get(
                "/AvailableSlots"
            );

            setAvailableSlots(response.data);
        } catch (error) {
            console.error(
                "Müsait saatler alınamadı:",
                error
            );
        }
    };


    useEffect(() => {
        getAvailableSlots();
    }, []);


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
                "/Appointments",
                formData
            );

            setSuccessMessage(
                "Randevu talebiniz başarıyla oluşturuldu. En kısa sürede sizinle iletişime geçilecektir."
            );

            setFormData({
                fullName: "",
                email: "",
                phone: "",
                appointmentDate: "",
                appointmentType: "Yüz Yüze",
                message: ""
            });

            // Alınan saat dropdown'dan hemen kaybolsun.
            await getAvailableSlots();
        }
        catch (error) {
            console.error(
                "Randevu oluşturulamadı:",
                error
            );

            if (error.response?.status === 409) {
                setErrorMessage(
                    getApiErrorMessage(
                        error,
                        "Bu randevu saati az önce başka biri tarafından alındı. Lütfen farklı bir saat seçin."
                    )
                );

                // Güncel müsait saatleri tekrar getir.
                await getAvailableSlots();
            }
            else if (error.response?.status === 400) {
                setErrorMessage(
                    getApiErrorMessage(
                        error,
                        "Lütfen randevu bilgilerinizi kontrol edin."
                    )
                );
            }
            else {
                setErrorMessage(
                    getApiErrorMessage(
                        error,
                        "Randevu oluşturulurken bir hata oluştu. Lütfen tekrar deneyin."
                    )
                );
            }
        }
        finally {
            setLoading(false);
        }
    };


    return (
        <main className="appointment-page">

            {/* SAYFA BAŞLIĞI */}

            <section className="page-hero">
                <div className="container">

                    <span>Randevu</span>

                    <h1>
                        Randevu Talebi Oluşturun
                    </h1>

                    <p>
                        Online veya yüz yüze görüşme için uygun
                        tarih ve saati seçerek randevu talebi
                        oluşturabilirsiniz.
                    </p>

                </div>
            </section>


            {/* RANDEVU */}

            <section className="appointment-section">

                <div className="container appointment-container">

                    {/* SOL TARAF */}

                    <div className="appointment-info">

                        <span className="section-small-title">
                            Görüşme Talebi
                        </span>

                        <h2>
                            İlk adımı birlikte atalım.
                        </h2>

                        <p>
                            Formu doldurduktan sonra randevu talebiniz
                            değerlendirilir. Talebiniz onaylandığında
                            sizinle iletişime geçilir.
                        </p>


                        <div className="appointment-info-item">
                            <strong>Görüşme Türü</strong>

                            <span>
                                Online veya Yüz Yüze
                            </span>
                        </div>


                        <div className="appointment-info-item">
                            <strong>Randevu Durumu</strong>

                            <span>
                                İlk olarak onay bekler
                            </span>
                        </div>

                    </div>


                    {/* FORM */}

                    <form
                        className="appointment-form"
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

                            <label>Ad Soyad</label>

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

                                <label>E-posta</label>

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

                                <label>Telefon</label>

                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="05XX XXX XX XX"
                                    minLength={10}
                                    maxLength={20}
                                    required
                                />

                            </div>

                        </div>


                        <div className="form-row">

                            {/* TARİH */}

                            <div className="form-group">

                                <label>
                                    Müsait Tarih ve Saat
                                </label>

                                <select
                                    name="appointmentDate"
                                    value={formData.appointmentDate}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">
                                        Tarih ve saat seçin
                                    </option>

                                    {availableSlots.map(
                                        (slot) => {

                                            const date =
                                                new Date(
                                                    slot.startDateTime
                                                );

                                            return (
                                                <option
                                                    key={slot.id}
                                                    value={
                                                        slot.startDateTime
                                                    }
                                                >
                                                    {date.toLocaleDateString(
                                                        "tr-TR",
                                                        {
                                                            weekday: "long",
                                                            day: "2-digit",
                                                            month: "long",
                                                            year: "numeric"
                                                        }
                                                    )}

                                                    {" - "}

                                                    {date.toLocaleTimeString(
                                                        "tr-TR",
                                                        {
                                                            hour: "2-digit",
                                                            minute: "2-digit"
                                                        }
                                                    )}
                                                </option>
                                            );
                                        }
                                    )}

                                </select>

                            </div>


                            {/* GÖRÜŞME TÜRÜ */}

                            <div className="form-group">

                                <label>
                                    Görüşme Türü
                                </label>

                                <select
                                    name="appointmentType"
                                    value={formData.appointmentType}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="Yüz Yüze">
                                        Yüz Yüze
                                    </option>

                                    <option value="Online">
                                        Online
                                    </option>

                                </select>

                            </div>

                        </div>


                        {/* NOT */}

                        <div className="form-group">

                            <label>
                                Kısa Not
                                <span> (Opsiyonel)</span>
                            </label>

                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                rows="5"
                                maxLength={1000}
                                placeholder="Randevuyla ilgili iletmek istediğiniz kısa bir not..."
                            />

                            <small>
                                {formData.message.length}/1000
                            </small>

                        </div>


                        <button
                            type="submit"
                            className="appointment-submit"
                            disabled={loading}
                        >
                            {loading
                                ? "Gönderiliyor..."
                                : "Randevu Talebi Gönder"}
                        </button>

                    </form>

                </div>

            </section>

        </main>
    );
}

export default Appointment;