import { Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";

// Layout
import Navbar from "./layout/Navbar/Navbar";
import Footer from "./layout/Footer/Footer";

// Pages
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Services from "./pages/Services/Services";
import Products from "./pages/Products/Products";
import Contact from "./pages/Contact/Contact";
import ProductDetail from "./pages/ProductDetails/productDetail";
import Enquiry from "./pages/Enquiry/enquiry";

import AdminPanel from "./pages/AdminPanel/AdminPanel";
import AdminLogin from "./pages/AdminPanel/AdminLogin";
import AdminUserPanel from "./pages/AdminPanel/AdminUserPanel";

function ProtectedAdminRoute({ children }) {
    const isAdmin = sessionStorage.getItem("isAdmin") === "true";
    const role = sessionStorage.getItem("adminRole");
    if (!isAdmin) return <Navigate to="/admin" replace />;
    if (role === "user") return <Navigate to="/admin/user-panel" replace />;
    return children;
}

function ProtectedUserRoute({ children }) {
    const isAdmin = sessionStorage.getItem("isAdmin") === "true";
    return isAdmin ? children : <Navigate to="/admin" replace />;
}

function App() {

    return (

        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                background: "#ffffff"
            }}
        >

            {/* ================= NAVBAR ================= */}

            <Navbar />

            {/* ================= MAIN CONTENT ================= */}

            <main
                style={{
                    flex: 1
                }}
            >
                <ScrollToTop />

                <Routes>

                    <Route path="/admin" element={<AdminLogin />} />
                    <Route
                        path="/admin/panel"
                        element={
                            <ProtectedAdminRoute>
                                <AdminPanel />
                            </ProtectedAdminRoute>
                        }
                    />
                    <Route
                        path="/admin/user-panel"
                        element={
                            <ProtectedUserRoute>
                                <AdminUserPanel />
                            </ProtectedUserRoute>
                        }
                    />

                    {/* Home */}

                    <Route
                        path="/"
                        element={<Home />}
                    />

                   
                    <Route
                        path="/about"
                        element={<About />}
                    />

                    <Route
                        path="/services"
                        element={<Services />}
                    />

                      
                    <Route
                        path="/products"
                        element={<Products />}
                    />
                   
                    <Route
                        path="/contact"
                        element={<Contact />}
                    />
                    <Route
                        path="/productDetail/:id"
                        element={<ProductDetail />}
                    />
                    
                    <Route
                        path="/enquiry"
                        element={<Enquiry />}
                    />
                    

                </Routes>

            </main>

            {/* ================= FOOTER ================= */}

            <Footer />
          

        </div>

    );

}

export default App;