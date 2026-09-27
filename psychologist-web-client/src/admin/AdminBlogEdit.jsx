import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function AdminBlogEdit() {
    const navigate = useNavigate();
    const { id } = useParams();

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

    useEffect(() => {
        const getBlog = async () => {
            try {
                const response = await api.get(`/BlogPosts/${id}`);

                setFormData(response.data);
            } catch (error) {
                console.error("Blog alınamadı:", error);
            }
        };

        getBlog();
    }, [id]);

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

        try {
            await api.put(
                `/BlogPosts/${id}`,
                formData
            );

            alert("Blog başarıyla güncellendi.");

            navigate("/admin/bloglar");
        } catch (error) {
            console.error(
                "Blog güncellenirken hata oluştu:",
                error
            );

            alert("Blog güncellenemedi.");
        }
    };

    return (
        <div className="admin-page">
            <div className="admin-form-container">

                <div className="admin-form-header">
                    <span>Admin Panel</span>
                    <h1>Blog Yazısını Düzenle</h1>
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
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>URL</label>

                        <input
                            type="text"
                            value={formData.slug}
                            readOnly
                        />
                    </div>

                    <div className="form-group">
                        <label>Kısa Özet</label>

                        <textarea
                            name="summary"
                            value={formData.summary}
                            onChange={handleChange}
                            rows="3"
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
                            Değişiklikleri Kaydet
                        </button>

                    </div>
                </form>

            </div>
        </div>
    );
}

export default AdminBlogEdit;