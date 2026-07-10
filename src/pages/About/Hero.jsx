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
                        Empowering Business Since 1996
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
                        About{" "}
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
                        
                        </span>
                    </h1>

                    <p
                        style={{
                            marginTop: "24px",
                            color: "#94A3B8",
                            fontSize: "clamp(15px, 1.4vw, 18px)",
                            lineHeight: 1.85,
                            maxWidth: "520px"
                        }}
                    >
                        Since 1996, CtStock has been delivering reliable and industry-focused stock management software, earning the trust of businesses across the ceramic industry. Over the years, our solutions have expanded to serve a wide range of manufacturing sectors, including Polypack, Paper Mills, Laminates, Sanitaryware, Decorative Products, Plastic Industries, Louvers, Wood, Frames, Acrylic, and many more.
                        <br></br>
                        Our mission is to simplify inventory management with software that is easy to learn, simple to operate, and powerful enough to meet the needs of businesses of every size. With multi-product capabilities, flexible customization, and continuous innovation, CtStock helps organizations manage their operations efficiently while staying prepared for future growth. We believe that technology should make business easier—not more complicated.
                    </p>

                    <div style={{ display: "flex", gap: "16px", marginTop: "38px", flexWrap: "wrap" }}>

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
                            onClick={() => navigate("/products")}
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
                        {/* gradient glow frame behind image */}
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

                            {/* subtle top sheen */}
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