import { useEffect, useState } from "react";
import api from "../services/api";

function AdminSiteSettings() {
    const [formData, setFormData] = useState({
        fullName: "",
        title: "",
        aboutText: "",
        homeIntroText: "",
        email: "",
        phone: "",
        address: "",
        instagramUrl: "",
        linkedInUrl: "",
        profileImageUrl: ""
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [uploadingImage, setUploadingImage] =
        useState(false);

    useEffect(() => {
        const getSiteSettings = async () => {
            try {
                const response = await api.get("/SiteSettings");

                if (response.data) {
                    setFormData({
                        fullName: response.data.fullName || "",
                        title: response.data.title || "",
                        aboutText: response.data.aboutText || "",
                        homeIntroText:
                            response.data.homeIntroText || "",
                        email: response.data.email || "",
                        phone: response.data.phone || "",
                        address: response.data.address || "",
                        instagramUrl:
                            response.data.instagramUrl || "",
                        linkedInUrl:
                            response.data.linkedInUrl || "",
                        profileImageUrl:
                            response.data.profileImageUrl || ""
                    });
                }
            } catch (error) {
                console.error(
                    "Site bilgileri alınamadı:",
                    error
                );

                setErrorMessage(
                    "Site bilgileri alınırken hata oluştu."
                );
            } finally {
                setLoading(false);
            }
        };

        getSiteSettings();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];

        if (!file) {
            return;
        }

        setSuccessMessage("");
        setErrorMessage("");
        setUploadingImage(true);

        try {
            const uploadData = new FormData();

            uploadData.append("file", file);

            const response = await api.post(
                "/Uploads/profile-image",
                uploadData
            );

            setFormData((prev) => ({
                ...prev,
                profileImageUrl:
                    response.data.imageUrl
            }));

            setSuccessMessage(
                "Fotoğraf yüklendi. Değişiklikleri Kaydet butonuna basmayı unutmayın."
            );

        } catch (error) {
            console.error(
                "Fotoğraf yüklenemedi:",
                error
            );

            setErrorMessage(
                typeof error.response?.data === "string"
                    ? error.response.data
                    : "Fotoğraf yüklenirken hata oluştu."
            );
        } finally {
            setUploadingImage(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSuccessMessage("");
        setErrorMessage("");
        setSaving(true);

        try {
            await api.put(
                "/SiteSettings",
                formData
            );

            setSuccessMessage(
                "Site bilgileri başarıyla güncellendi."
            );
        } catch (error) {
            console.error(
                "Site bilgileri güncellenemedi:",
                error
            );

            setErrorMessage(
                "Site bilgileri güncellenirken hata oluştu."
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="admin-page">
                <div className="admin-container">
                    Site bilgileri yükleniyor...
                </div>
            </div>
        );
    }

    return (
        <div className="admin-page">
            <div className="admin-container">

                <div className="admin-header">
                    <div>
                        <span>Admin Panel</span>
                        <h1>Site Bilgileri</h1>
                    </div>
                </div>

                <form
                    className="site-settings-form"
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

                    <div className="settings-section">
                        <div className="settings-section-title">
                            <h2>Profil Bilgileri</h2>
                            <p>
                                Sitede görüntülenecek temel bilgiler.
                            </p>
                        </div>

                        <div className="form-group">
                            <label>Ad Soyad</label>

                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Unvan</label>

                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Ana Sayfa Kısa Tanıtım</label>

                            <textarea
                                name="homeIntroText"
                                value={formData.homeIntroText}
                                onChange={handleChange}
                                rows="4"
                            />
                        </div>

                        <div className="form-group">
                            <label>Hakkımda Yazısı</label>

                            <textarea
                                name="aboutText"
                                value={formData.aboutText}
                                onChange={handleChange}
                                rows="8"
                            />
                        </div>
                    </div>


                    <div className="settings-section">
                        <div className="settings-section-title">
                            <h2>İletişim Bilgileri</h2>
                        </div>

                        <div className="form-row">

                            <div className="form-group">
                                <label>E-posta</label>

                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>Telefon</label>

                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>

                        </div>

                        <div className="form-group">
                            <label>Adres</label>

                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                            />
                        </div>
                    </div>


                    <div className="settings-section">
                        <div className="settings-section-title">
                            <h2>Sosyal Medya</h2>
                        </div>

                        <div className="form-group">
                            <label>Instagram</label>

                            <input
                                type="url"
                                name="instagramUrl"
                                value={formData.instagramUrl}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>LinkedIn</label>

                            <input
                                type="url"
                                name="linkedInUrl"
                                value={formData.linkedInUrl}
                                onChange={handleChange}
                            />
                        </div>
                    </div>


                    <div className="settings-section">

                        <div className="settings-section-title">
                            <h2>Profil Fotoğrafı</h2>

                            <p>
                                Bilgisayarınızdan profil fotoğrafı
                                yükleyebilirsiniz.
                            </p>
                        </div>

                        <div className="form-group">
                            <label>Fotoğraf Seç</label>

                            <input
                                type="file"
                                accept=".jpg,.jpeg,.png,.webp"
                                onChange={handleImageUpload}
                                disabled={uploadingImage}
                            />

                            {uploadingImage && (
                                <small>
                                    Fotoğraf yükleniyor...
                                </small>
                            )}
                        </div>

                        {formData.profileImageUrl && (
                            <div className="settings-image-preview">

                                <img
                                    src={formData.profileImageUrl}
                                    alt="Profil önizleme"
                                />

                                <p>
                                    Fotoğraf başarıyla yüklendi.
                                </p>

                            </div>
                        )}

                    </div>
                       



                    <div className="settings-save-area">
                        <button
                            type="submit"
                            className="admin-add-button"
                            disabled={saving}
                        >
                            {saving
                                ? "Kaydediliyor..."
                                : "Değişiklikleri Kaydet"}
                        </button>
                    </div>

                </form>

            </div>
        </div>
    );
}

export default AdminSiteSettings;