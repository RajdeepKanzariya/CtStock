import { Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";

// Layout
import Navbar from "./layout/Navbar/Navbar";
import Footer from "./layout/Footer/Footer";

// Pages
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
// import Services from "./pages/Services/Services";
// import Products from "./pages/Products/Products";
// import ProductDetails from "./pages/Products/ProductDetails";
import Contact from "./pages/Contact/Contact";
// import Enquiry from "./pages/Enquiry/Enquiry";

import AdminPanel from "./AdminPanel";

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

                    <Route path="/admin" element={<AdminPanel />} />

                    {/* Home */}

                    <Route
                        path="/"
                        element={<Home />}
                    />

                   
                    <Route
                        path="/about"
                        element={<About />}
                    />
                     {/*
                    <Route
                        path="/services"
                        element={<Services />}
                    />

                    <Route
                        path="/products"
                        element={<Products />}
                    />

                    <Route
                        path="/products/:id"
                        element={<ProductDetails />}
                    />
                    */}
                    <Route
                        path="/contact"
                        element={<Contact />}
                    />
                    {/*}
                    <Route
                        path="/enquiry"
                        element={<Enquiry />}
                    />
                    */}

                </Routes>

            </main>

            {/* ================= FOOTER ================= */}

            <Footer />
          

        </div>

    );

}

export default App;