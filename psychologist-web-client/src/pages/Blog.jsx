import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Blog() {
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        api.get("/BlogPosts")
            .then((response) => {
                setBlogs(response.data);
            })
            .catch((error) => {
                console.error("Bloglar alınamadı:", error);
            });
    }, []);

    return (
        <main className="blog-page">

            <section className="page-hero">
                <div className="container">
                    <span>Blog</span>

                    <h1>Psikoloji Üzerine Yazılar</h1>

                    <p>
                        Psikoloji, duygular ve günlük yaşam üzerine
                        bilgilendirici içerikler.
                    </p>
                </div>
            </section>

            <section className="blog-list-section">
                <div className="container">

                    <div className="blog-cards">
                        {blogs.map((blog) => (
                            <article
                                className="blog-card"
                                key={blog.id}
                            >
                                <div className="blog-card-image">
                                    {blog.imageUrl ? (
                                        <img
                                            src={blog.imageUrl}
                                            alt={blog.title}
                                        />
                                    ) : (
                                        <span>Blog</span>
                                    )}
                                </div>

                                <div className="blog-card-content">
                                    <span className="blog-date">
                                        {new Date(
                                            blog.createdDate
                                        ).toLocaleDateString("tr-TR")}
                                    </span>

                                    <h3>{blog.title}</h3>

                                    <p>{blog.summary}</p>

                                    <Link
                                        to={`/blog/${blog.slug}`}
                                        className="text-link"
                                    >
                                        Yazıyı Oku →
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>

                </div>
            </section>

        </main>
    );
}

export default Blog;