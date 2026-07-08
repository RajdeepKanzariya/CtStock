import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import slider1 from "../../assets/sliderimg1.png";
import slider2 from "../../assets/sliderimg2.png";

export default function Hero() {

    const images = [slider1, slider2];
    const [current, setCurrent] = useState(0);
    const navigate = useNavigate();
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % images.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section
            style={{
                position: "relative",
                width: "100%",
                minHeight: "calc(100vh - 78px)",
                background:
                    "radial-gradient(circle at 15% 20%, rgba(37,99,235,.25), transparent 45%), radial-gradient(circle at 85% 80%, rgba(56,189,248,.18), transparent 50%), linear-gradient(160deg, #0B1120 0%, #111A2E 55%, #0B1120 100%)",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                boxSizing: "border-box",
                padding: "clamp(60px, 8vw, 100px) 6%"
            }}
        >
            {/* decorative glow blobs */}
            <div
                style={{
                    position: "absolute",
                    top: "-120px",
                    right: "-120px",
                    width: "380px",
                    height: "380px",
                    borderRadius: "50%",
                    background: "rgba(37,99,235,.25)",
                    filter: "blur(90px)",
                    pointerEvents: "none"
                }}
            />
            <div
                style={{
                    position: "absolute",
                    bottom: "-140px",
                    left: "-100px",
                    width: "320px",
                    height: "320px",
                    borderRadius: "50%",
                    background: "rgba(14,165,233,.18)",
                    filter: "blur(100px)",
                    pointerEvents: "none"
                }}
            />

            <div
                style={{
                    position: "relative",
                    width: "100%",
                    maxWidth: "1280px",
                    margin: "0 auto",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "clamp(30px, 5vw, 70px)",
                    flexWrap: "wrap"
                }}
            >
                {/* Left Side */}
                <div style={{ flex: "1 1 420px", minWidth: "320px", color: "#fff" }}>

                    <div
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            background: "rgba(37,99,235,.12)",
                            border: "1px solid rgba(96,165,250,.35)",
                            color: "#93C5FD",
                            padding: "7px 16px",
                            borderRadius: "999px",
                            fontSize: "13px",
                            fontWeight: "600",
                            letterSpacing: ".3px",
                            marginBottom: "26px"
                        }}
                    >
                        <span
                            style={{
                                width: "7px",
                                height: "7px",
                                borderRadius: "50%",
                                background: "#38BDF8",
                                boxShadow: "0 0 8px 2px rgba(56,189,248,.7)"
                            }}
                        />
                        We'd Love to Hear From You
                    </div>

                    <h1
                        style={{
                            fontSize: "clamp(34px, 4.6vw, 56px)",
                            fontWeight: 800,
                            lineHeight: 1.15,
                            letterSpacing: "-1px",
                            margin: 0,
                            color: "#F8FAFC"
                        }}
                    >
                        Contact{" "}
                        <span
                            style={{
                                background: "linear-gradient(90deg,#60A5FA,#38BDF8)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text"
                            }}
                        >
                            CtStock
                        </span>
                        <br />
                        <span style={{ fontSize: "clamp(20px, 2.6vw, 30px)", fontWeight: 700, color: "#CBD5E1" }}>
                            Let's Build Something Amazing Together
                        </span>
                    </h1>

                    <p
                        style={{
                            marginTop: "24px",
                            color: "#94A3B8",
                            fontSize: "clamp(15px, 1.4vw, 18px)",
                            lineHeight: 1.85,
                            maxWidth: "480px"
                        }}
                    >
                        Need a demo or a custom business solution? Our experts
                        are ready to help you find the right fit.
                    </p>

                    <div style={{ display: "flex", gap: "16px", marginTop: "34px", flexWrap: "wrap" }}>

                        <button
                            onClick={() => navigate("/enquiry")}
                            style={{
                                background: "linear-gradient(90deg,#2563EB,#3B82F6)",
                                color: "#fff",
                                border: "none",
                                padding: "15px 30px",
                                borderRadius: "10px",
                                cursor: "pointer",
                                fontSize: "15.5px",
                                fontWeight: 600,
                                boxShadow: "0 10px 25px -8px rgba(37,99,235,.7)",
                                transition: "transform .25s ease, box-shadow .25s ease"
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "translateY(-3px)";
                                e.currentTarget.style.boxShadow = "0 14px 30px -6px rgba(37,99,235,.85)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "0 10px 25px -8px rgba(37,99,235,.7)";
                            }}
                        >
                            Get Demo →
                        </button>

                        <button
                            style={{
                                background: "rgba(255,255,255,.04)",
                                color: "#E2E8F0",
                                border: "1px solid rgba(148,163,184,.35)",
                                padding: "15px 30px",
                                borderRadius: "10px",
                                cursor: "pointer",
                                fontSize: "15.5px",
                                fontWeight: 500,
                                transition: "background .25s ease, transform .25s ease"
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = "rgba(255,255,255,.09)";
                                e.currentTarget.style.transform = "translateY(-3px)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = "rgba(255,255,255,.04)";
                                e.currentTarget.style.transform = "translateY(0)";
                            }}
                        >
                            Explore Products
                        </button>

                    </div>

                    {/* Quick contact info */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "30px" }}>

                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <IconPhone />
                            <span style={{ color: "#CBD5E1", fontSize: "13.5px", lineHeight: 1.6 }}>
                                +91 88668 00045
                                <br />
                                +91 75672 00045
                            </span>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <IconMail />
                            <span style={{ color: "#CBD5E1", fontSize: "13.5px" }}>
                                dalsaniyacommercio@gmail.com
                            </span>
                        </div>

                        <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                            <span style={{ marginTop: "2px" }}><IconPin /></span>
                            <span style={{ color: "#CBD5E1", fontSize: "13.5px", lineHeight: 1.6 }}>
                                428 Star Arcade, Opp. Sky Mall,
                                <br />
                                Sanala Road, Morbi, Gujarat, India 363641
                            </span>
                        </div>

                    </div>
                </div>

                {/* Right Side - Slider */}
                <div style={{ flex: "1 1 420px", minWidth: "320px", display: "flex", justifyContent: "center" }}>

                    <div
                        style={{
                            position: "relative",
                            width: "100%",
                            maxWidth: "620px"
                        }}
                    >
                        
                        <div
                            style={{
                                position: "absolute",
                                inset: "-14px",
                                borderRadius: "26px",
                                background: "linear-gradient(135deg,#2563EB,#38BDF8)",
                                opacity: 0.35,
                                filter: "blur(26px)",
                                zIndex: 0
                            }}
                        />

                        <div
                            style={{
                                position: "relative",
                                width: "100%",
                                aspectRatio: "4 / 3",
                                borderRadius: "20px",
                                overflow: "hidden",
                                border: "1px solid rgba(148,163,184,.25)",
                                boxShadow: "0 30px 70px -20px rgba(0,0,0,.65)",
                                zIndex: 1
                            }}
                        >
                            {images.map((img, index) => (
                                <img
                                    key={index}
                                    src={img}
                                    alt={"slider-" + index}
                                    style={{
                                        position: "absolute",
                                        inset: 0,
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        opacity: index === current ? 1 : 0,
                                        transform:
                                            index === current
                                                ? "scale(1)"
                                                : "scale(1.08)",
                                        transition: "opacity 1.1s ease, transform 1.4s ease"
                                    }}
                                />
                            ))}

                            
                            <div
                                style={{
                                    position: "absolute",
                                    inset: 0,
                                    background: "linear-gradient(180deg, rgba(255,255,255,.06), transparent 30%)",
                                    pointerEvents: "none"
                                }}
                            />

                            {/* dots */}
                            <div
                                style={{
                                    position: "absolute",
                                    bottom: "18px",
                                    left: "50%",
                                    transform: "translateX(-50%)",
                                    display: "flex",
                                    gap: "9px",
                                    zIndex: 2
                                }}
                            >
                                {images.map((_, index) => (
                                    <span
                                        key={index}
                                        onClick={() => setCurrent(index)}
                                        style={{
                                            width: current === index ? "26px" : "8px",
                                            height: "8px",
                                            borderRadius: "50px",
                                            background:
                                                current === index
                                                    ? "linear-gradient(90deg,#3B82F6,#38BDF8)"
                                                    : "rgba(255,255,255,.45)",
                                            cursor: "pointer",
                                            transition: ".35s"
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ---------- icons ---------- */

function IconPhone() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.68 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.32 1.85.55 2.81.68A2 2 0 0 1 22 16.92Z" />
        </svg>
    );
}

function IconMail() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 6-10 7L2 6" />
        </svg>
    );
}

function IconPin() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
        </svg>
    );
}