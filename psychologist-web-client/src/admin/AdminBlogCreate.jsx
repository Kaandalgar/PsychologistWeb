import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AdminBlogCreate() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        summary: "",
        content: "",
        slug: "",
        imageUrl: "",
        isPublished: true
    });

    const createSlug = (text) => {
        return text
            .toLowerCase()
            .replace(/ğ/g, "g")
            .replace(/ü/g, "u")
            .replace(/ş/g, "s")
            .replace(/ı/g, "i")
            .replace(/ö/g, "o")
            .replace(/ç/g, "c")
            .replace(/[^a-z0-9\s-]/g, "")
            .trim()
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        const newValue =
            type === "checkbox" ? checked : value;

        setFormData((prev) => ({
            ...prev,
            [name]: newValue,
            ...(name === "title"
                ? { slug: createSlug(value) }
                : {})
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("Gönderilen veri:", formData);

        try {
            const response = await api.post(
                "/BlogPosts",
                formData
            );

            console.log(
                "Blog başarıyla eklendi:",
                response.data
            );

            alert("Blog başarıyla kaydedildi.");

            navigate("/admin/bloglar");
        } catch (error) {
            console.error(
                "Blog eklenirken hata oluştu:",
                error
            );

            console.log(
                "Base URL:",
                error.config?.baseURL
            );

            console.log(
                "İstek URL:",
                error.config?.url
            );

            console.log(
                "Durum:",
                error.response?.status
            );

            console.log(
                "API cevabı:",
                error.response?.data
            );

            alert(
                `Blog kaydedilemedi. Hata: ${error.response?.status ??
                "Bilinmeyen hata"
                }`
            );
        }
    };

    return (
        <div className="admin-page">
            <div className="admin-form-container">

                <div className="admin-form-header">
                    <span>Admin Panel</span>
                    <h1>Yeni Blog Yazısı</h1>
                </div>

                <form
                    className="admin-form"
                    onSubmit={handleSubmit}
                >
                    <div className="form-group">
                        <label>Başlık</label>

                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Örn: Kaygı ile Baş Etmenin Yolları"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>URL</label>

                        <input
                            type="text"
                            value={formData.slug}
                            readOnly
                            placeholder="Başlıktan otomatik oluşturulur"
                        />
                    </div>

                    <div className="form-group">
                        <label>Kısa Özet</label>

                        <textarea
                            name="summary"
                            value={formData.summary}
                            onChange={handleChange}
                            rows="3"
                            placeholder="Blog kartında görünecek kısa açıklama..."
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>İçerik</label>

                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            rows="12"
                            placeholder="Blog yazısının içeriği..."
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

                    <div className="form-checkbox">
                        <input
                            type="checkbox"
                            name="isPublished"
                            checked={formData.isPublished}
                            onChange={handleChange}
                        />

                        <label>Yayınla</label>
                    </div>

                    <div className="form-buttons">
                        <button
                            type="button"
                            className="cancel-button"
                            onClick={() =>
                                navigate("/admin/bloglar")
                            }
                        >
                            Vazgeç
                        </button>

                        <button
                            type="submit"
                            className="save-button"
                        >
                            Blogu Kaydet
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
}

export default AdminBlogCreate;