import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

function Services() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getServices = async () => {
            try {
                const response = await api.get(
                    "/TherapyServices"
                )

                setServices(response.data);
            } catch (error) {
                console.error(
                    "Hizmetler alınamadı:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        getServices();
    }, []);

    return (
        <main className="services-page">

            {/* SAYFA BAŞLIĞI */}
            <section className="page-hero">
                <div className="container">

                    <span>Hizmetler</span>

                    <h1>
                        Destek Alanları
                    </h1>

                    <p>
                        İhtiyaçlarınıza uygun, güvenli ve
                        destekleyici psikolojik danışmanlık
                        hizmetleri.
                    </p>

                </div>
            </section>


            {/* HİZMETLER */}
            <section className="services-section">
                <div className="container">

                    <div className="section-title">

                        <span>
                            Psikolojik Danışmanlık
                        </span>

                        <h2>
                            Size Nasıl Yardımcı Olabilirim?
                        </h2>

                        <p>
                            Her bireyin ihtiyaçları farklıdır.
                            Görüşme süreci ihtiyaçlarınıza göre
                            şekillendirilir.
                        </p>

                    </div>


                    {loading ? (

                        <div className="services-loading">
                            Hizmetler yükleniyor...
                        </div>

                    ) : services.length === 0 ? (

                        <div className="services-empty">
                            Henüz hizmet eklenmemiş.
                        </div>

                    ) : (

                        <div className="service-cards">

                            {services.map(
                                (service, index) => (

                                    <div
                                        className="service-card"
                                        key={service.id}
                                    >

                                        <div className="service-icon">
                                            {String(index + 1)
                                                .padStart(
                                                    2,
                                                    "0"
                                                )}
                                        </div>


                                        {service.imageUrl && (
                                            <div className="service-page-image">

                                                <img
                                                    src={
                                                        service.imageUrl
                                                    }
                                                    alt={
                                                        service.title
                                                    }
                                                />

                                            </div>
                                        )}


                                        <h3>
                                            {service.title}
                                        </h3>

                                        <p>
                                            {
                                                service.description
                                            }
                                        </p>

                                        <Link
                                            to="/randevu"
                                            className="text-link"
                                        >
                                            Randevu Al →
                                        </Link>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </div>
            </section>


            {/* CTA */}
            <section className="appointment-cta">

                <div className="container cta-container">

                    <div>
                        <span>
                            Görüşme Talebi
                        </span>

                        <h2>
                            İlk adımı atmaya hazır mısınız?
                        </h2>

                        <p>
                            Size uygun müsait tarih ve
                            saatlerden birini seçebilirsiniz.
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

        </main>
    );
}

export default Services;