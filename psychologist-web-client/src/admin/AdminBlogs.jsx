import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function AdminBlogs() {
    const [blogs, setBlogs] = useState([]);

    const getBlogs = async () => {
        try {
            const response = await api.get("/BlogPosts/admin");
            setBlogs(response.data);
        } catch (error) {
            console.error("Bloglar alınamadı:", error);
        }
    };

    useEffect(() => {
        getBlogs();
    }, []);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Bu blog yazısını silmek istediğinize emin misiniz?"
        );

        if (!confirmDelete) return;

        try {
            await api.delete(`/BlogPosts/${id}`);
            getBlogs();
        } catch (error) {
            console.error("Blog silinirken hata oluştu:", error);
        }
    };

    return (
        <div className="admin-page">
            <div className="admin-container">

                <div className="admin-header">
                    <div>
                        <span>Admin Panel</span>
                        <h1>Blog Yazıları</h1>
                    </div>

                    <Link
                        to="/admin/bloglar/yeni"
                        className="admin-add-button"
                    >
                        + Yeni Blog
                    </Link>
                </div>

                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Başlık</th>
                                <th>Slug</th>
                                <th>Durum</th>
                                <th>Tarih</th>
                                <th>İşlemler</th>
                            </tr>
                        </thead>

                        <tbody>
                            {blogs.map((blog) => (
                                <tr key={blog.id}>
                                    <td>{blog.id}</td>

                                    <td>
                                        <strong>{blog.title}</strong>
                                    </td>

                                    <td>{blog.slug}</td>

                                    <td>
                                        {blog.isPublished ? (
                                            <span className="status active">
                                                Yayında
                                            </span>
                                        ) : (
                                            <span className="status passive">
                                                Taslak
                                            </span>
                                        )}
                                    </td>

                                    <td>
                                        {new Date(
                                            blog.createdDate
                                        ).toLocaleDateString("tr-TR")}
                                    </td>

                                    <td>
                                        <div className="admin-actions">

                                            <Link
                                                to={`/admin/bloglar/duzenle/${blog.id}`}
                                                className="edit-button"
                                            >
                                                Düzenle
                                            </Link>

                                            <button
                                                className="delete-button"
                                                onClick={() =>
                                                    handleDelete(blog.id)
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

export default AdminBlogs;