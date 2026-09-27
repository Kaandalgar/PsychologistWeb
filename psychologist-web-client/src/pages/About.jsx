import { useSiteSettings } from "../context/SiteSettingsContext";

function About() {
    const { siteSettings } = useSiteSettings();

    return (
        <main className="about-page">

            {/* PAGE HERO */}
            <section className="page-hero">
                <div className="container">

                    <span>Hakkımda</span>

                    <h1>
                        {siteSettings?.fullName || "Psikolog Ad Soyad"}
                    </h1>

                    <p>
                        {siteSettings?.title || "Psikolojik Danışman"}
                    </p>

                </div>
            </section>


            {/* ABOUT CONTENT */}
            <section className="about-detail-section">

                <div className="container about-detail-container">

                    {/* SOL - FOTOĞRAF */}
                    <div className="about-detail-photo">

                        {siteSettings?.profileImageUrl ? (
                            <img
                                src={siteSettings.profileImageUrl}
                                alt={
                                    siteSettings?.fullName ||
                                    "Psikolog profil fotoğrafı"
                                }
                            />
                        ) : (
                            <div className="about-detail-placeholder">
                                Psikolog Fotoğrafı
                            </div>
                        )}

                    </div>


                    {/* SAĞ - İÇERİK */}
                    <div className="about-detail-content">

                        <span className="section-small-title">
                            Tanışalım
                        </span>

                        <h2>
                            Kendinizi güvenle ifade
                            edebileceğiniz bir alan.
                        </h2>

                        <h3>
                            {siteSettings?.fullName ||
                                "Psikolog Ad Soyad"}
                        </h3>

                        <span className="about-title">
                            {siteSettings?.title ||
                                "Psikolojik Danışman"}
                        </span>


                        <div className="about-text">

                            {siteSettings?.aboutText ? (
                                siteSettings.aboutText
                                    .split("\n")
                                    .filter(
                                        (paragraph) =>
                                            paragraph.trim() !== ""
                                    )
                                    .map((paragraph, index) => (
                                        <p key={index}>
                                            {paragraph}
                                        </p>
                                    ))
                            ) : (
                                <>
                                    <p>
                                        Psikolojik danışmanlık
                                        sürecinde bireyin
                                        kendisini daha iyi
                                        tanımasına,
                                        duygularını anlamasına
                                        ve yaşamındaki
                                        zorluklarla daha
                                        sağlıklı şekilde başa
                                        çıkmasına destek
                                        oluyorum.
                                    </p>

                                    <p>
                                        Her bireyin
                                        ihtiyaçlarının ve yaşam
                                        deneyiminin farklı
                                        olduğuna inanıyor,
                                        görüşme sürecini kişiye
                                        özel şekilde
                                        yapılandırıyorum.
                                    </p>
                                </>
                            )}

                        </div>

                    </div>

                </div>

            </section>


            {/* APPROACH */}
            <section className="about-approach">

                <div className="container">

                    <div className="section-title">
                        <span>Yaklaşım</span>

                        <h2>
                            Danışmanlık Sürecinde
                        </h2>

                        <p>
                            Güven, gizlilik ve karşılıklı
                            anlayış üzerine kurulu bir görüşme
                            süreci.
                        </p>
                    </div>


                    <div className="about-values">

                        <div className="about-value-card">
                            <span>01</span>

                            <h3>Güvenli Alan</h3>

                            <p>
                                Kendinizi yargılanmadan ve
                                rahatça ifade edebileceğiniz
                                güvenli bir görüşme ortamı.
                            </p>
                        </div>


                        <div className="about-value-card">
                            <span>02</span>

                            <h3>Kişiye Özel Süreç</h3>

                            <p>
                                Her bireyin ihtiyaçları ve
                                yaşam deneyimleri farklıdır.
                                Görüşmeler bu doğrultuda
                                şekillendirilir.
                            </p>
                        </div>


                        <div className="about-value-card">
                            <span>03</span>

                            <h3>Gizlilik</h3>

                            <p>
                                Görüşmelerin gizliliği ve
                                danışan mahremiyeti sürecin
                                temel unsurlarındandır.
                            </p>
                        </div>

                    </div>

                </div>

            </section>

        </main>
    );
}

export default About;