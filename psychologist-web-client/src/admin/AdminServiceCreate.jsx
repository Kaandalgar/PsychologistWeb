import { useState } from "react";
import api from "../services/api"; import { useNavigate } from "react-router-dom";

function AdminServiceCreate() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        imageUrl: "",
        isActive: true,
        displayOrder: 1
    });

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
            await api.post(
                "/TherapyServices",
                {
                    ...formData,
                    displayOrder: Number(formData.displayOrder)
                }
            );

            navigate("/admin/hizmetler");
        } catch (error) {
            console.error("Hizmet eklenirken hata oluştu:", error);
        }
    };

    return (
        <div className="admin-page">
            <div className="admin-form-container">

                <div className="admin-form-header">
                    <span>Admin Panel</span>
                    <h1>Yeni Hizmet Ekle</h1>
                </div>

                <form
                    className="admin-form"
                    onSubmit={handleSubmit}
                >

                    <div className="form-group">
                        <label>Hizmet Başlığı</label>

                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Örn: Çift Terapisi"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Açıklama</label>

                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Hizmet açıklaması..."
                            rows="6"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Görsel URL</label>

                        <input
                            type="text"
                            name="imageUrl"
                            value={formData.imageUrl}
                            onChange={handleChange}
                            placeholder="Opsiyonel"
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

                        <label>Aktif olarak yayınla</label>
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
                            Hizmeti Kaydet
                        </button>
                    </div>

                </form>

            </div>
        </div>
    );
}

export default AdminServiceCreate;