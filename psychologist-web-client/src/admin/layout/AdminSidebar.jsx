import { NavLink, useNavigate } from "react-router-dom";

function AdminSidebar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("admin");

        navigate("/admin/login");
    };

    return (
        <aside className="admin-sidebar">

            <div className="admin-sidebar-brand">
                <h2>Psikolog</h2>
                <span>Yönetim Paneli</span>
            </div>

            <nav className="admin-sidebar-menu">

                <NavLink
                    to="/admin"
                    end
                    className={({ isActive }) =>
                        isActive ? "active" : ""
                    }
                >
                    Dashboard
                </NavLink>

                <NavLink
                    to="/admin/hizmetler"
                    className={({ isActive }) =>
                        isActive ? "active" : ""
                    }
                >
                    Hizmetler
                </NavLink>

                <NavLink
                    to="/admin/bloglar"
                    className={({ isActive }) =>
                        isActive ? "active" : ""
                    }
                >
                    Bloglar
                </NavLink>

                <NavLink
                    to="/admin/randevular"
                    className={({ isActive }) =>
                        isActive ? "active" : ""
                    }
                >
                    Randevular
                </NavLink>

                <NavLink
                    to="/admin/musait-saatler"
                    className={({ isActive }) =>
                        isActive ? "active" : ""
                    }
                >
                    Müsait Saatler
                </NavLink>

                <NavLink
                    to="/admin/mesajlar"
                    className={({ isActive }) =>
                        isActive ? "active" : ""
                    }
                >
                    Mesajlar
                </NavLink>

                <NavLink
                    to="/admin/site-bilgileri"
                    className={({ isActive }) =>
                        isActive ? "active" : ""
                    }
                >
                    Site Bilgileri
                </NavLink>

            </nav>

            <div className="admin-sidebar-bottom">

                <NavLink
                    to="/"
                    className="view-site-link"
                >
                    Siteyi Görüntüle
                </NavLink>

                <button
                    onClick={handleLogout}
                    className="admin-logout-button"
                >
                    Çıkış Yap
                </button>

            </div>

        </aside>
    );
}

export default AdminSidebar;