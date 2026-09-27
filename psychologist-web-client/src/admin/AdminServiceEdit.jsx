import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function AdminServiceEdit() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        imageUrl: "",
        isActive: true,
        displayOrder: 1
    });

    useEffect(() => {
        const getService = async () => {
            try {
                const response = await api.get(
                    `/TherapyServices/${id}`
                );

                setFormData(response.data);
            } catch (error) {
                console.error("Hizmet alınamadı:", error);
            }
        };

        getService();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await api.put(
                `/TherapyServices/${id}`,
                {
                    ...formData,
                    displayOrder: Number(formData.displayOrder)
                }
            );

            navigate("/admin/hizmetler");

        } catch (error) {
            console.error("Hizmet güncellenirken hata oluştu:", error);
        }
    };

    return (
        <div className="admin-page">
            <div className="admin-form-container">

                <div className="admin-form-header">
                    <span>Admin Panel</span>
                    <h1>Hizmeti Düzenle</h1>
                </div>

                <form className="admin-form" onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label>Hizmet Başlığı</label>

                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Açıklama</label>

                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="6"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Görsel URL</label>

                        <input
                            type="text"
                            name="imageUrl"
                            value={formData.imageUrl ?? ""}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Gösterim Sırası</label>

                        <input
                            type="number"
                            name="displayOrder"
                            value={formData.displayOrder}
                            onChange={handleChange}
                            min="1"
                        />
                    </div>

                    <div className="form-checkbox">
                        <input
                            type="checkbox"
                            name="isActive"
                            checked={formData.isActive}
                            onChange={handleChange}
                        />

                        <label>Aktif</label>
                    </div>

                    <div className="form-buttons">

                        <button
                            type="button"
                            className="cancel-button"
                            onClick={() => navigate("/admin/hizmetler")}
                        >
                            Vazgeç
                        </button>

                        <button
                            type="submit"
                            className="save-button"
                        >
                            Değişiklikleri Kaydet
                        </button>

                    </div>

                </form>
            </div>
        </div>
    );
}

export default AdminServiceEdit;