import { useEffect, useState } from "react";
import api from "../services/api";

function AdminAppointments() {
    const [appointments, setAppointments] = useState([]);

    const getAppointments = async () => {
        try {
            const response = await api.get("/Appointments");
            setAppointments(response.data);
        } catch (error) {
            console.error("Randevular alınamadı:", error);
        }
    };

    useEffect(() => {
        getAppointments();
    }, []);

    const updateStatus = async (id, status) => {
        try {
            await api.put(
                `/Appointments/${id}/status`,
                {
                    status: status
                }
            );

            getAppointments();
        } catch (error) {
            console.error(
                "Randevu durumu güncellenemedi:",
                error
            );
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Bu randevuyu tamamen silmek istediğinize emin misiniz?"
        );

        if (!confirmDelete) return;

        try {
            await api.delete(`/Appointments/${id}`);

            getAppointments();
        } catch (error) {
            console.error(
                "Randevu silinemedi:",
                error
            );
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 0:
                return "Bekliyor";

            case 1:
                return "Onaylandı";

            case 2:
                return "İptal Edildi";

            case 3:
                return "Tamamlandı";

            default:
                return "Bilinmiyor";
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 0:
                return "appointment-pending";

            case 1:
                return "appointment-approved";

            case 2:
                return "appointment-cancelled";

            case 3:
                return "appointment-completed";

            default:
                return "";
        }
    };

    return (
        <div className="admin-page">
            <div className="admin-container">

                <div className="admin-header">
                    <div>
                        <span>Admin Panel</span>
                        <h1>Randevular</h1>
                    </div>
                </div>

                <div className="admin-table-wrapper">

                    <table className="admin-table">

                        <thead>
                            <tr>
                                <th>Danışan</th>
                                <th>İletişim</th>
                                <th>Tarih</th>
                                <th>Tür</th>
                                <th>Durum</th>
                                <th>İşlemler</th>
                            </tr>
                        </thead>

                        <tbody>

                            {appointments.map((appointment) => (

                                <tr key={appointment.id}>

                                    <td>
                                        <strong>
                                            {appointment.fullName}
                                        </strong>
                                    </td>

                                    <td>
                                        <div>
                                            {appointment.phone}
                                        </div>

                                        <small>
                                            {appointment.email}
                                        </small>
                                    </td>

                                    <td>
                                        {new Date(
                                            appointment.appointmentDate
                                        ).toLocaleString("tr-TR", {
                                            dateStyle: "short",
                                            timeStyle: "short"
                                        })}
                                    </td>

                                    <td>
                                        {appointment.appointmentType}
                                    </td>

                                    <td>
                                        <span
                                            className={`appointment-status ${getStatusClass(
                                                appointment.status
                                            )}`}
                                        >
                                            {getStatusText(
                                                appointment.status
                                            )}
                                        </span>
                                    </td>

                                    <td>
                                        <div className="appointment-actions">

                                            {appointment.status === 0 && (
                                                <>
                                                    <button
                                                        className="approve-button"
                                                        onClick={() =>
                                                            updateStatus(
                                                                appointment.id,
                                                                1
                                                            )
                                                        }
                                                    >
                                                        Onayla
                                                    </button>

                                                    <button
                                                        className="cancel-appointment-button"
                                                        onClick={() =>
                                                            updateStatus(
                                                                appointment.id,
                                                                2
                                                            )
                                                        }
                                                    >
                                                        İptal
                                                    </button>
                                                </>
                                            )}

                                            {appointment.status === 1 && (
                                                <button
                                                    className="complete-button"
                                                    onClick={() =>
                                                        updateStatus(
                                                            appointment.id,
                                                            3
                                                        )
                                                    }
                                                >
                                                    Tamamlandı
                                                </button>
                                            )}

                                            <button
                                                className="delete-button"
                                                onClick={() =>
                                                    handleDelete(
                                                        appointment.id
                                                    )
                                                }
                                            >
                                                Sil
                                            </button>

                                        </div>
                                    </td>

                                </tr>
                            ))}

                        </tbody>

                    </table>

                </div>

            </div>
        </div>
    );
}

export default AdminAppointments;