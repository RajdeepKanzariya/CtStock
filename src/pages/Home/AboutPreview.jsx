import { useEffect, useRef, useState } from "react";
import aboutimg1 from "../../assets/aboutimg1.png";
import { useNavigate } from "react-router-dom";

export default function About() {

    const sectionRef = useRef(null);
    const [inView, setInView] = useState(false);
    const navigate = useNavigate();
    // re-trigger animation every time section enters/leaves viewport
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => setInView(entry.isIntersecting),
            { threshold: 0.2 }
        );

        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    const features = [
        { title: "Innovative", icon: <IconBulb /> },
        { title: "Reliable", icon: <IconCheck /> },
        { title: "Scalable", icon: <IconScale /> },
        { title: "Secure", icon: <IconLock /> }
    ];

    return (
        <section
            ref={sectionRef}
            style={{
                width: "100%",
                padding: "clamp(60px, 8vw, 100px) 6%",
                background: "#ffffff",
                boxSizing: "border-box",
                overflow: "hidden"
            }}
        >
            <div
                style={{
                    maxWidth: "1200px",
                    margin: "0 auto",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "clamp(30px, 5vw, 70px)",
                    flexWrap: "wrap"
                }}
            >
                {/* Left Content */}
                <div
                    style={{
                        flex: "1 1 420px",
                        minWidth: "300px",
                        opacity: inView ? 1 : 0,
                        transform: inView ? "translateX(0)" : "translateX(-50px)",
                        transition: "opacity .8s ease, transform .8s cubic-bezier(.2,.8,.2,1)"
                    }}
                >
                    <p
                        style={{
                            color: "#2563EB",
                            fontSize: "13px",
                            fontWeight: 700,
                            letterSpacing: "1px",
                            textTransform: "uppercase",
                            margin: 0
                        }}
                    >
                        About CT Stock
                    </p>

                    <h2
                        style={{
                            margin: "12px 0 0",
                            fontSize: "clamp(28px, 3.6vw, 40px)",
                            fontWeight: 800,
                            lineHeight: 1.2,
                            color: "#0F172A"
                        }}
                    >
                        Smart Software
                        <br />
                        <span style={{ color: "#2563EB" }}>For Modern Businesses</span>
                    </h2>

                    <div style={{ marginTop: "22px", display: "flex", flexDirection: "column", gap: "14px" }}>
                        <p style={{ margin: 0, color: "#475569", fontSize: "15.5px", lineHeight: 1.8 }}>
                            CT Stock is a trusted software development company delivering
                            ERP, CRM, Inventory and Custom Business Solutions for modern
                            industries.
                        </p>
                        <p style={{ margin: 0, color: "#475569", fontSize: "15.5px", lineHeight: 1.8 }}>
                            We help manufacturers, traders and enterprises simplify
                            operations, automate workflows and achieve sustainable growth
                            through innovative technology.
                        </p>
                        <p style={{ margin: 0, color: "#475569", fontSize: "15.5px", lineHeight: 1.8 }}>
                            We build scalable software that grows with your business.
                        </p>
                    </div>

                    {/* Features */}
                    <div
                        style={{
                            display: "flex",
                            gap: "clamp(16px, 3vw, 32px)",
                            marginTop: "34px",
                            flexWrap: "wrap"
                        }}
                    >
                        {features.map((f, i) => (
                            <div
                                key={i}
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: "10px",
                                    opacity: inView ? 1 : 0,
                                    transform: inView ? "translateY(0)" : "translateY(25px)",
                                    transition: `opacity .6s ease ${0.15 + i * 0.12}s, transform .6s ease ${0.15 + i * 0.12}s`
                                }}
                            >
                                <div
                                    style={{
                                        width: "46px",
                                        height: "46px",
                                        borderRadius: "50%",
                                        background: "#2563EB",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "#fff",
                                        boxShadow: "0 8px 18px -4px rgba(37,99,235,.45)"
                                    }}
                                >
                                    {f.icon}
                                </div>
                                <span style={{ fontSize: "13.5px", fontWeight: 600, color: "#334155" }}>
                                    {f.title}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* CTA */}
                    <button onClick={() => navigate("/about")}
                        style={{
                            marginTop: "34px",
                            background: "#2563EB",
                            color: "#fff",
                            border: "none",
                            padding: "14px 28px",
                            borderRadius: "8px",
                            fontSize: "15px",
                            fontWeight: 600,
                            cursor: "pointer",
                            boxShadow: "0 10px 22px -8px rgba(37,99,235,.7)",
                            transition: "transform .25s ease, box-shadow .25s ease",
                            opacity: inView ? 1 : 0,
                            transform: inView ? "translateY(0)" : "translateY(20px)",
                            transitionDelay: inView ? "0.6s" : "0s"
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-3px)";
                            e.currentTarget.style.boxShadow = "0 14px 26px -6px rgba(37,99,235,.8)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "0 10px 22px -8px rgba(37,99,235,.7)";
                        }}
                    >
                        Read More About Us →
                    </button>
                </div>

                {/* Right Image */}
                <div
                    style={{
                        flex: "1 1 420px",
                        minWidth: "300px",
                        display: "flex",
                        justifyContent: "center",
                        opacity: inView ? 1 : 0,
                        transform: inView ? "translateX(0) scale(1)" : "translateX(50px) scale(.96)",
                        transition: "opacity .8s ease .1s, transform .8s cubic-bezier(.2,.8,.2,1) .1s"
                    }}
                >
                    <div
                        style={{
                            position: "relative",
                            width: "100%",
                            maxWidth: "560px",
                            borderRadius: "20px",
                            overflow: "hidden",
                            boxShadow: "0 25px 60px -18px rgba(15,23,42,.35)"
                        }}
                    >
                        <img
                            src={aboutimg1}
                            alt="CT Stock office team"
                            style={{
                                width: "100%",
                                display: "block",
                                borderRadius: "20px"
                            }}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ---------- inline icons ---------- */

function IconBulb() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18h6M10 22h4M12 2a6 6 0 0 0-4 10.5c.6.6 1 1.4 1 2.5h6c0-1.1.4-1.9 1-2.5A6 6 0 0 0 12 2Z" />
        </svg>
    );
}

function IconCheck() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
        </svg>
    );
}

function IconScale() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
        </svg>
    );
}

function IconLock() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="5" y="11" width="14" height="10" rx="2" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" />
        </svg>
    );
}