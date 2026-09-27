import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

import { useSiteSettings } from "../context/SiteSettingsContext";

function Home() {
    const { siteSettings } = useSiteSettings();

    const [services, setServices] = useState([]);
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        api.get("/TherapyServices")

            .then((response) => {
                setServices(response.data);
            })
            .catch((error) => {
                console.error("Hizmetler alınamadı:", error);
            });
    }, []);

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
        <>
            {/* HERO */}
            <section className="hero">
                <div className="container hero-container">

                    <div className="hero-content">

                        <span className="hero-small-title">
                            Güvenli • Destekleyici • Profesyonel
                        </span>

                        <h1>
                            Kendinizi anlamaya
                            <span> birlikte başlayalım.</span>
                        </h1>

                        <p>
                            {siteSettings?.homeIntroText ||
                                "Yaşamın getirdiği zorluklarla baş ederken kendinizi daha iyi tanımanız, duygularınızı anlamanız ve yaşam kalitenizi artırmanız için profesyonel psikolojik destek."}
                        </p>

                        <div className="hero-buttons">

                            <Link
                                to="/randevu"
                                className="primary-button"
                            >
                                Randevu Al
                            </Link>

                            <Link
                                to="/hakkimda"
                                className="secondary-button"
                            >
                                Hakkımda
                            </Link>

                        </div>
                    </div>


                    <div className="hero-image">

                        {siteSettings?.profileImageUrl ? (
                            <img
                                src={siteSettings.profileImageUrl}
                                alt={
                                    siteSettings?.fullName ||
                                    "Psikolog profil fotoğrafı"
                                }
                            />
                        ) : (
                            <div className="image-placeholder">
                                <span>
                                    Psikolog Fotoğrafı
                                </span>
                            </div>
                        )}

                    </div>

                </div>
            </section>


            {/* SERVICES */}
            <section className="services-section">
                <div className="container">

                    <div className="section-title">
                        <span>Destek Alanları</span>

                        <h2>
                            Size Nasıl Yardımcı Olabilirim?
                        </h2>

                        <p>
                            İhtiyaçlarınıza uygun, güvenli ve
                            destekleyici bir terapi süreci.
                        </p>
                    </div>


                    <div className="service-cards">

                        {services.map((service, index) => (

                            <div
                                className="service-card"
                                key={service.id}
                            >

                                <div className="service-icon">
                                    {String(index + 1).padStart(
                                        2,
                                        "0"
                                    )}
                                </div>

                                <h3>
                                    {service.title}
                                </h3>

                                <p>
                                    {service.description}
                                </p>

                                <Link to="/hizmetler">
                                    Detaylı Bilgi →
                                </Link>

                            </div>
                        ))}

                    </div>

                </div>
            </section>


            {/* ABOUT */}
            <section className="home-about">
                <div className="container about-container">

                    <div className="about-photo">

                        {siteSettings?.profileImageUrl ? (
                            <img
                                src={siteSettings.profileImageUrl}
                                alt={
                                    siteSettings?.fullName ||
                                    "Psikolog"
                                }
                            />
                        ) : (
                            <div className="about-image-placeholder">
                                Fotoğraf
                            </div>
                        )}

                    </div>


                    <div className="about-content">

                        <span className="section-small-title">
                            Hakkımda
                        </span>

                        <h2>
                            Kendinizi rahatça ifade
                            edebileceğiniz güvenli bir alan.
                        </h2>

                        <h3>
                            {siteSettings?.fullName ||
                                "Psikolog Ad Soyad"}
                        </h3>

                        <p>
                            {siteSettings?.aboutText ||
                                "Psikolojik danışmanlık sürecinde kişinin kendisini daha iyi tanımasını, duygularını keşfetmesini ve yaşamındaki zorluklarla daha sağlıklı şekilde başa çıkabilmesini destekliyorum."}
                        </p>

                        <p>
                            Her danışanın hikayesinin kendine
                            özgü olduğuna inanıyor ve
                            görüşmelerimi kişinin ihtiyaçlarına
                            göre şekillendiriyorum.
                        </p>

                        <Link
                            to="/hakkimda"
                            className="text-link"
                        >
                            Beni Daha Yakından Tanıyın →
                        </Link>

                    </div>

                </div>
            </section>


            {/* BLOG */}
            <section className="home-blog">
                <div className="container">

                    <div className="section-title">
                        <span>Blog</span>

                        <h2>Son Yazılar</h2>

                        <p>
                            Psikoloji, iyi oluş ve günlük yaşam
                            üzerine bilgilendirici içerikler.
                        </p>
                    </div>


                    <div className="blog-cards">

                        {blogs.slice(0, 3).map((blog) => (

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
                                        ).toLocaleDateString(
                                            "tr-TR"
                                        )}
                                    </span>

                                    <h3>
                                        {blog.title}
                                    </h3>

                                    <p>
                                        {blog.summary}
                                    </p>

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


                    <div className="all-blogs-link">

                        <Link
                            to="/blog"
                            className="secondary-button"
                        >
                            Tüm Yazıları Gör
                        </Link>

                    </div>

                </div>
            </section>


            {/* CTA */}
            <section className="appointment-cta">
                <div className="container cta-container">

                    <div>
                        <span>
                            İlk adımı atmaya hazır mısınız?
                        </span>

                        <h2>
                            Kendiniz için bugün bir adım atın.
                        </h2>

                        <p>
                            Online veya yüz yüze görüşme için
                            randevu talebi oluşturabilirsiniz.
                        </p>
                    </div>

                    <Link
                        to="/randevu"
                        className="cta-button"
                    >
                        Randevu Oluştur
                    </Link>

                </div>
            </section>
        </>
    );
}

export default Home;