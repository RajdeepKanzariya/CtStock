import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from "../../assets/ctstockLogo.jpg";

export default function Navbar() {

    const [width, setWidth] = useState(window.innerWidth);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {

        const resize = () => setWidth(window.innerWidth);

        window.addEventListener("resize", resize);

        return () => window.removeEventListener("resize", resize);

    }, []);

    const mobile = width < 768;

    // Responsive values
    const padding = width > 1400 ? "0 70px"
        : width > 1200 ? "0 50px"
            : width > 992 ? "0 35px"
                : "0 20px";

    const gap = width > 1400 ? "34px"
        : width > 1200 ? "26px"
            : width > 992 ? "18px"
                : "12px";

    const fontSize = width > 1200 ? "15px" : "13px";

    const navStyle = ({ isActive }) => ({
    color: isActive ? "#2563eb" : "#111827",
    textDecoration: "none",
    fontWeight: isActive ? 700 : 500,
    fontSize,
    fontFamily: "'Inter', sans-serif",
    whiteSpace: "nowrap",
    transition: "0.3s",

    paddingBottom: "5px",

    borderBottom: isActive
        ? "3px solid #2563eb"
        : "3px solid transparent"
});

    return (

        <nav
            style={{
                width: "100%",
                height: "78px",
                background: "#fff",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding,
                position: "sticky",
                top: 0,
                zIndex: 999,
                boxShadow: "0 2px 8px rgba(0,0,0,.08)",
                boxSizing: "border-box"
            }}
        >

            <NavLink to="/">
                <img
                    src={logo}
                    alt="CTStock Logo"
                    style={{
                        height: width > 992 ? "48px" : "40px",
                        cursor: "pointer"
                    }}
                />
            </NavLink>

            {!mobile ? (

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap,
                        flexShrink: 1
                    }}
                >

                    <NavLink to="/" style={navStyle}>Home</NavLink>

                    <NavLink to="/about" style={navStyle}>About Us</NavLink>

                    <NavLink to="/services" style={navStyle}>Services</NavLink>

                    <NavLink to="/products" style={navStyle}>Products</NavLink>

                    <NavLink to="/enquiry" style={navStyle}>Enquiry</NavLink>

                    <NavLink to="/contact" style={navStyle}>Contact Us</NavLink>

                </div>

            ) : (

                <div>

                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        style={{
                            background: "transparent",
                            border: "none",
                            fontSize: "30px",
                            cursor: "pointer"
                        }}
                    >
                        ☰
                    </button>

                    {menuOpen && (

                        <div
                            style={{
                                position: "absolute",
                                top: "78px",
                                right: "15px",
                                width: "220px",
                                background: "#fff",
                                display: "flex",
                                flexDirection: "column",
                                gap: "18px",
                                padding: "20px",
                                borderRadius: "10px",
                                boxShadow: "0 5px 20px rgba(0,0,0,.15)"
                            }}
                        >

                            <NavLink to="/" style={navStyle}>Home</NavLink>

                            <NavLink to="/about" style={navStyle}>About Us</NavLink>

                            <NavLink to="/services" style={navStyle}>Services</NavLink>

                            <NavLink to="/products" style={navStyle}>Products</NavLink>

                            <NavLink to="/enquiry" style={navStyle}>Enquiry</NavLink>

                            <NavLink to="/contact" style={navStyle}>Contact Us</NavLink>

                        </div>

                    )}

                </div>

            )}

        </nav>

    );
}