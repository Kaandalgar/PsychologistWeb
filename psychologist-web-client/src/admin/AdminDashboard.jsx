import { useEffect, useState } from "react";
import api from "../services/api";

function AdminDashboard() {
    const [stats, setStats] = useState({
        pendingAppointments: 0,
        totalAppointments: 0,
        blogs: 0,
        services: 0,
        availableSlots: 0,
        unreadMessages: 0
    });

    useEffect(() => {
        const getDashboardData = async () => {
            try {
                const [
                    appointmentsResponse,
                    blogsResponse,
                    servicesResponse,
                    slotsResponse,
                    messagesResponse
                ] = await Promise.all([
                    api.get("/Appointments"),
                    api.get("/BlogPosts/admin"),
                    api.get("/TherapyServices"),
                    api.get("/AvailableSlots/admin"),
                    api.get("/ContactMessages")
                ]);

                const appointments =
                    appointmentsResponse.data;

                setStats({
                    pendingAppointments:
                        appointments.filter(
                            (x) => x.status === 0
                        ).length,

                    totalAppointments:
                        appointments.length,

                    blogs:
                        blogsResponse.data.length,

                    services:
                        servicesResponse.data.length,

                    availableSlots:
                        slotsResponse.data.filter(
                            (x) => x.isActive
                        ).length,

                    unreadMessages:
                        messagesResponse.data.filter(
                            (x) => !x.isRead
                        ).length
                });

            } catch (error) {
                console.error(
                    "Dashboard verileri alınamadı:",
                    error
                );
            }
        };

        getDashboardData();
    }, []);

    return (
        <div className="admin-dashboard">

            <div className="dashboard-header">
                <span>Yönetim Paneli</span>

                <h1>Dashboard</h1>

                <p>
                    Site ve randevu sisteminin genel durumu.
                </p>
            </div>

            <div className="dashboard-cards">

                <div className="dashboard-card">
                    <span>Bekleyen Randevu</span>
                    <strong>
                        {stats.pendingAppointments}
                    </strong>
                </div>

                <div className="dashboard-card">
                    <span>Toplam Randevu</span>
                    <strong>
                        {stats.totalAppointments}
                    </strong>
                </div>

                <div className="dashboard-card">
                    <span>Blog Yazısı</span>
                    <strong>
                        {stats.blogs}
                    </strong>
                </div>

                <div className="dashboard-card">
                    <span>Aktif Hizmet</span>
                    <strong>
                        {stats.services}
                    </strong>
                </div>

                <div className="dashboard-card">
                    <span>Müsait Saat</span>
                    <strong>
                        {stats.availableSlots}
                    </strong>
                </div>

                <div className="dashboard-card">
                    <span>Okunmamış Mesaj</span>
                    <strong>
                        {stats.unreadMessages}
                    </strong>
                </div>

            </div>

        </div>
    );
}

export default AdminDashboard;