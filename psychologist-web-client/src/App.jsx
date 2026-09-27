import {
    BrowserRouter,
    Routes,
    Route,
    useLocation
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import Contact from "./pages/Contact";
import Appointment from "./pages/Appointment";

import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";

import AdminServices from "./admin/AdminServices";
import AdminServiceCreate from "./admin/AdminServiceCreate";
import AdminServiceEdit from "./admin/AdminServiceEdit";

import AdminBlogs from "./admin/AdminBlogs";
import AdminBlogCreate from "./admin/AdminBlogCreate";
import AdminBlogEdit from "./admin/AdminBlogEdit";

import AdminAppointments from "./admin/AdminAppointments";
import AdminAvailableSlots from "./admin/AdminAvailableSlots";

import AdminLayout from "./admin/layout/AdminLayout";

import AdminMessages from "./admin/AdminMessages";

import AdminSiteSettings from "./admin/AdminSiteSettings";
import { SiteSettingsProvider } from "./context/SiteSettingsContext";

import AdminForgotPassword from "./admin/AdminForgotPassword";
import AdminResetPassword from "./admin/AdminResetPassword";

import NotFound from "./pages/NotFound";

function AppContent() {
    const location = useLocation();

    const isAdminPage =
        location.pathname.startsWith("/admin");

    return (
        <>
            {!isAdminPage && <Navbar />}

            <Routes>

                {/* PUBLIC */}

                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/hakkimda"
                    element={<About />}
                />

                <Route
                    path="/hizmetler"
                    element={<Services />}
                />

                <Route
                    path="/blog"
                    element={<Blog />}
                />

                <Route
                    path="/blog/:slug"
                    element={<BlogDetail />}
                />

                <Route
                    path="/iletisim"
                    element={<Contact />}
                />

                <Route
                    path="/randevu"
                    element={<Appointment />}
                />

                <Route
                    path="*"
                    element={<NotFound />}
                />


                {/* ADMIN LOGIN */}

                <Route
                    path="/admin/login"
                    element={<AdminLogin />}
                />

                <Route
                    path="/admin/sifremi-unuttum"
                    element={<AdminForgotPassword />}
                />

                <Route
                    path="/admin/sifre-sifirla"
                    element={<AdminResetPassword />}
                />

                {/* ADMIN PANEL */}

                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute>
                            <AdminLayout />
                        </ProtectedRoute>
                    }
                >

                    <Route
                        index
                        element={<AdminDashboard />}
                    />

                    <Route
                        path="hizmetler"
                        element={<AdminServices />}
                    />

                    <Route
                        path="site-bilgileri"
                        element={<AdminSiteSettings />}
                    />


                    <Route
                        path="hizmetler/yeni"
                        element={<AdminServiceCreate />}
                    />

                    <Route
                        path="hizmetler/duzenle/:id"
                        element={<AdminServiceEdit />}
                    />

                    <Route
                        path="bloglar"
                        element={<AdminBlogs />}
                    />

                    <Route
                        path="bloglar/yeni"
                        element={<AdminBlogCreate />}
                    />

                    <Route
                        path="bloglar/duzenle/:id"
                        element={<AdminBlogEdit />}
                    />

                    <Route
                        path="randevular"
                        element={<AdminAppointments />}
                    />

                    <Route
                        path="musait-saatler"
                        element={<AdminAvailableSlots />}
                    />

                    <Route
                        path="mesajlar"
                        element={<AdminMessages />}
                    />

                </Route>

            </Routes>

            {!isAdminPage && <Footer />}
        </>
    );
}


function App() {
    return (
        <BrowserRouter>
            <SiteSettingsProvider>
                <AppContent />
            </SiteSettingsProvider>
        </BrowserRouter>
    );
}

export default App;