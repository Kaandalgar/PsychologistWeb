import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
function BlogDetail() {
    const { slug } = useParams();

    const [blog, setBlog] = useState(null);

    useEffect(() => {
        api.get(
            `/BlogPosts/slug/${slug}`
        ).then((response) => {
                setBlog(response.data);
            })
            .catch((error) => {
                console.error("Blog alınamadı:", error);
            });
    }, [slug]);

    if (!blog) {
        return (
            <div className="container" style={{ padding: "100px 0" }}>
                Yazı yükleniyor...
            </div>
        );
    }

    return (
        <main className="blog-detail-page">
            <div className="container blog-detail-container">

                <Link to="/blog" className="text-link">
                    ← Tüm Yazılar
                </Link>

                <div className="blog-detail-header">
                    <span>
                        {new Date(blog.createdDate).toLocaleDateString("tr-TR")}
                    </span>

                    <h1>{blog.title}</h1>

                    <p>{blog.summary}</p>
                </div>

                {blog.imageUrl && (
                    <div className="blog-detail-image">
                        <img
                            src={blog.imageUrl}
                            alt={blog.title}
                        />
                    </div>
                )}

                <article className="blog-detail-content">
                    {blog.content
                        .split("\n")
                        .filter((paragraph) => paragraph.trim() !== "")
                        .map((paragraph, index) => (
                            <p key={index}>{paragraph}</p>
                        ))}
                </article>

            </div>
        </main>
    );
}

export default BlogDetail;