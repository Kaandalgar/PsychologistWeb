import { useEffect, useState } from "react";
import api from "../services/api"; import { Link } from "react-router-dom";

function AdminServices() {
    const [services, setServices] = useState([]);

    const getServices = async () => {
        try {
            const response = await api.get("/TherapyServices");
            setServices(response.data);
        } catch (error) {
            console.error("Hizmetler alınamadı:", error);
        }
    };

    useEffect(() => {
        getServices();
    }, []);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Bu hizmeti silmek istediğinize emin misiniz?"
        );

        if (!confirmDelete) return;

        try {
            await api.delete(`/TherapyServices/${id}`);

            getServices();
        } catch (error) {
            console.error("Hizmet silinirken hata oluştu:", error);
        }
    };

    return (
        <div className="admin-page">
            <div className="admin-container">

                <div className="admin-header">
                    <div>
                        <span>Admin Panel</span>
                        <h1>Hizmetler</h1>
                    </div>

                    <Link
                        to="/admin/hizmetler/yeni"
                        className="admin-add-button"
                    >
                        + Yeni Hizmet
                    </Link>
                </div>

                <div className="admin-table-wrapper">
                    <table className="admin-table">

                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Hizmet</th>
                                <th>Açıklama</th>
                                <th>Sıra</th>
                                <th>Durum</th>
                                <th>İşlemler</th>
                            </tr>
                        </thead>

                        <tbody>
                            {services.map((service) => (
                                <tr key={service.id}>

                                    <td>{service.id}</td>

                                    <td>
                                        <strong>{service.title}</strong>
                                    </td>

                                    <td>{service.description}</td>

                                    <td>{service.displayOrder}</td>

                                    <td>
                                        {service.isActive ? (
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
                                            <Link
                                                to={`/admin/hizmetler/duzenle/${service.id}`}
                                                className="edit-button"
                                            >
                                                Düzenle
                                            </Link>
                                            <button
                                                className="delete-button"
                                                onClick={() => handleDelete(service.id)}
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

export default AdminServices;