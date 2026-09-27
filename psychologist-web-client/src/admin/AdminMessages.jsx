import { useEffect, useState } from "react";
import api from "../services/api";

function AdminMessages() {
    const [messages, setMessages] = useState([]);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [loading, setLoading] = useState(true);

    const getMessages = async () => {
        try {
            const response = await api.get("/ContactMessages");

            setMessages(response.data);
        } catch (error) {
            console.error(
                "Mesajlar alınamadı:",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getMessages();
    }, []);

    const handleOpenMessage = async (message) => {
        setSelectedMessage(message);

        if (!message.isRead) {
            try {
                await api.put(
                    `/ContactMessages/${message.id}/read`
                );

                setMessages((prev) =>
                    prev.map((item) =>
                        item.id === message.id
                            ? {
                                ...item,
                                isRead: true
                            }
                            : item
                    )
                );

                setSelectedMessage((prev) => ({
                    ...prev,
                    isRead: true
                }));
            } catch (error) {
                console.error(
                    "Mesaj okundu olarak işaretlenemedi:",
                    error
                );
            }
        }
    };

    const handleToggleRead = async (message) => {
        try {
            if (message.isRead) {
                await api.put(
                    `/ContactMessages/${message.id}/unread`
                );
            } else {
                await api.put(
                    `/ContactMessages/${message.id}/read`
                );
            }

            setMessages((prev) =>
                prev.map((item) =>
                    item.id === message.id
                        ? {
                            ...item,
                            isRead: !item.isRead
                        }
                        : item
                )
            );

            if (
                selectedMessage?.id === message.id
            ) {
                setSelectedMessage((prev) => ({
                    ...prev,
                    isRead: !prev.isRead
                }));
            }

        } catch (error) {
            console.error(
                "Mesaj durumu değiştirilemedi:",
                error
            );
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Bu mesajı silmek istediğinize emin misiniz?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            await api.delete(
                `/ContactMessages/${id}`
            );

            setMessages((prev) =>
                prev.filter(
                    (message) =>
                        message.id !== id
                )
            );

            if (selectedMessage?.id === id) {
                setSelectedMessage(null);
            }

        } catch (error) {
            console.error(
                "Mesaj silinemedi:",
                error
            );
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);

        return date.toLocaleString(
            "tr-TR",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        );
    };

    if (loading) {
        return (
            <div className="admin-page">
                <div className="admin-container">
                    Mesajlar yükleniyor...
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

                        <h1>
                            Mesajlar
                        </h1>
                    </div>

                    <div className="message-summary">
                        {
                            messages.filter(
                                (message) =>
                                    !message.isRead
                            ).length
                        }
                        {" "}
                        okunmamış mesaj
                    </div>

                </div>


                {messages.length === 0 ? (

                    <div className="admin-empty-state">
                        Henüz iletişim mesajı bulunmuyor.
                    </div>

                ) : (

                    <div className="admin-table-wrapper">

                        <table className="admin-table">

                            <thead>
                                <tr>
                                    <th>Durum</th>
                                    <th>Gönderen</th>
                                    <th>Konu</th>
                                    <th>Tarih</th>
                                    <th>İşlemler</th>
                                </tr>
                            </thead>

                            <tbody>

                                {messages.map(
                                    (message) => (

                                        <tr
                                            key={
                                                message.id
                                            }
                                            className={
                                                !message.isRead
                                                    ? "message-unread-row"
                                                    : ""
                                            }
                                        >

                                            <td>

                                                {message.isRead ? (

                                                    <span className="message-status read">
                                                        Okundu
                                                    </span>

                                                ) : (

                                                    <span className="message-status unread">
                                                        Okunmadı
                                                    </span>

                                                )}

                                            </td>

                                            <td>

                                                <strong>
                                                    {
                                                        message.fullName
                                                    }
                                                </strong>

                                                <small className="message-email">
                                                    {
                                                        message.email
                                                    }
                                                </small>

                                            </td>

                                            <td>
                                                {
                                                    message.subject
                                                }
                                            </td>

                                            <td>
                                                {formatDate(
                                                    message.createdDate
                                                )}
                                            </td>

                                            <td>

                                                <div className="admin-actions">

                                                    <button
                                                        className="edit-button"
                                                        onClick={() =>
                                                            handleOpenMessage(
                                                                message
                                                            )
                                                        }
                                                    >
                                                        Görüntüle
                                                    </button>

                                                    <button
                                                        className="edit-button"
                                                        onClick={() =>
                                                            handleToggleRead(
                                                                message
                                                            )
                                                        }
                                                    >
                                                        {message.isRead
                                                            ? "Okunmadı Yap"
                                                            : "Okundu Yap"}
                                                    </button>

                                                    <button
                                                        className="delete-button"
                                                        onClick={() =>
                                                            handleDelete(
                                                                message.id
                                                            )
                                                        }
                                                    >
                                                        Sil
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>


            {selectedMessage && (

                <div
                    className="message-modal-overlay"
                    onClick={() =>
                        setSelectedMessage(null)
                    }
                >

                    <div
                        className="message-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <div className="message-modal-header">

                            <div>

                                <span>
                                    İletişim Mesajı
                                </span>

                                <h2>
                                    {
                                        selectedMessage.subject
                                    }
                                </h2>

                            </div>

                            <button
                                className="message-modal-close"
                                onClick={() =>
                                    setSelectedMessage(null)
                                }
                            >
                                ×
                            </button>

                        </div>


                        <div className="message-detail-grid">

                            <div>
                                <span>
                                    Ad Soyad
                                </span>

                                <strong>
                                    {
                                        selectedMessage.fullName
                                    }
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Tarih
                                </span>

                                <strong>
                                    {formatDate(
                                        selectedMessage.createdDate
                                    )}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    E-posta
                                </span>

                                <strong>
                                    {
                                        selectedMessage.email
                                    }
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Telefon
                                </span>

                                <strong>
                                    {
                                        selectedMessage.phone ||
                                        "Belirtilmedi"
                                    }
                                </strong>
                            </div>

                        </div>


                        <div className="message-content">

                            <span>
                                Mesaj
                            </span>

                            <p>
                                {
                                    selectedMessage.message
                                }
                            </p>

                        </div>


                        <div className="message-modal-actions">

                            <button
                                className="edit-button"
                                onClick={() =>
                                    handleToggleRead(
                                        selectedMessage
                                    )
                                }
                            >
                                {selectedMessage.isRead
                                    ? "Okunmadı Olarak İşaretle"
                                    : "Okundu Olarak İşaretle"}
                            </button>

                            <button
                                className="delete-button"
                                onClick={() =>
                                    handleDelete(
                                        selectedMessage.id
                                    )
                                }
                            >
                                Mesajı Sil
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}

export default AdminMessages;