import { useEffect, useState } from "react";
import api from "../services/api";

function AdminAvailableSlots() {
    const [slots, setSlots] = useState([]);
    const [startDateTime, setStartDateTime] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const getSlots = async () => {
        try {
            const response = await api.get("/AvailableSlots/admin");
            setSlots(response.data);
        } catch (error) {
            console.error("Müsait saatler alınamadı:", error);
        }
    };

    useEffect(() => {
        getSlots();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        try {
            await api.post("/AvailableSlots", {
                startDateTime,
                isActive: true
            });

            setStartDateTime("");
            setMessage("Müsait saat başarıyla eklendi.");

            getSlots();
        } catch (error) {
            console.error("Saat eklenemedi:", error);

            if (error.response?.status === 409) {
                setError("Bu tarih ve saat zaten mevcut.");
            }
            else if (error.response?.status === 400) {
                setError(
                    error.response?.data ||
                    "Geçerli bir tarih ve saat seçin."
                );
            }
            else {
                setError("Müsait saat eklenirken hata oluştu.");
            }
        }
    };

    const handleToggle = async (id) => {
        try {
            await api.put(`/AvailableSlots/${id}/toggle`);

            getSlots();
        } catch (error) {
            console.error("Durum değiştirilemedi:", error);
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Bu müsait saati silmek istediğinize emin misiniz?"
        );

        if (!confirmDelete) return;

        try {
            await api.delete(`/AvailableSlots/${id}`);

            getSlots();
        } catch (error) {
            console.error("Saat silinemedi:", error);
        }
    };

    return (
        <div className="admin-page">
            <div className="admin-container">

                <div className="admin-header">
                    <div>
                        <span>Admin Panel</span>
                        <h1>Müsait Saatler</h1>
                    </div>
                </div>

                <form
                    className="slot-create-form"
                    onSubmit={handleSubmit}
                >
                    <div>
                        <label>Yeni Tarih ve Saat</label>

                        <input
                            type="datetime-local"
                            value={startDateTime}
                            onChange={(e) =>
                                setStartDateTime(e.target.value)
                            }
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="admin-add-button"
                    >
                        + Müsait Saat Ekle
                    </button>
                </form>

                {message && (
                    <div className="form-success">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="form-error">
                        {error}
                    </div>
                )}

                <div className="admin-table-wrapper">
                    <table className="admin-table">

                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tarih</th>
                                <th>Saat</th>
                                <th>Durum</th>
                                <th>İşlemler</th>
                            </tr>
                        </thead>

                        <tbody>
                            {slots.length === 0 ? (
                                <tr>
                                    <td colSpan="5">
                                        Henüz müsait saat eklenmemiş.
                                    </td>
                                </tr>
                            ) : (
                                slots.map((slot) => {
                                    const date =
                                        new Date(slot.startDateTime);

                                    return (
                                        <tr key={slot.id}>

                                            <td>{slot.id}</td>

                                            <td>
                                                {date.toLocaleDateString(
                                                    "tr-TR"
                                                )}
                                            </td>

                                            <td>
                                                {date.toLocaleTimeString(
                                                    "tr-TR",
                                                    {
                                                        hour: "2-digit",
                                                        minute: "2-digit"
                                                    }
                                                )}
                                            </td>

                                            <td>
                                                {slot.isActive ? (
                                                    <span className="status active">
                                                        Aktif
                                                    </span>
                                                ) : (
                                                    <span className="status passive">
                                                        Pasif
                                                    </span>
                                                )}
                                            </td>

                                            <td>
                                                <div className="admin-actions">

                                                    <button
                                                        className="edit-button"
                                                        onClick={() =>
                                                            handleToggle(
                                                                slot.id
                                                            )
                                                        }
                                                    >
                                                        {slot.isActive
                                                            ? "Pasif Yap"
                                                            : "Aktif Yap"}
                                                    </button>

                                                    <button
                                                        className="delete-button"
                                                        onClick={() =>
                                                            handleDelete(
                                                                slot.id
                                                            )
                                                        }
                                                    >
                                                        Sil
                                                    </button>

                                                </div>
                                            </td>

                                        </tr>
                                    );
                                })
                            )}
                        </tbody>

                    </table>
                </div>

            </div>
        </div>
    );
}

export default AdminAvailableSlots;