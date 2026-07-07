import { useEffect, useRef, useState } from "react";
import aboutimg1 from "../../assets/aboutimg1.png";

export default function WhoWeAre() {

    const sectionRef = useRef(null);
    const [inView, setInView] = useState(false);

    
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => setInView(entry.isIntersecting),
            { threshold: 0.2, rootMargin: "-60px 0px -60px 0px" }
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
                        transition: "opacity .9s cubic-bezier(.16,.9,.28,1), transform .9s cubic-bezier(.16,.9,.28,1)"
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
                        Who We Are
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
                        Smart Solutions For
                        <br />
                        <span style={{ color: "#2563EB" }}>Modern Businesses</span>
                    </h2>

                    <div style={{ marginTop: "22px", display: "flex", flexDirection: "column", gap: "14px" }}>
                        <p style={{ margin: 0, color: "#475569", fontSize: "15.5px", lineHeight: 1.8 }}>
                            CT Stock is a leading software development company
                            specializing in ERP, Inventory Management, CRM and
                            Business Automation solutions.
                        </p>
                        <p style={{ margin: 0, color: "#475569", fontSize: "15.5px", lineHeight: 1.8 }}>
                            Our mission is to simplify business operations through
                            technology, helping organizations improve productivity,
                            reduce operational costs and make smarter decisions.
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
                                    transform: inView ? "translateY(0)" : "translateY(30px)",
                                    transition: `opacity .8s cubic-bezier(.16,.9,.28,1) ${0.3 + i * 0.15}s, transform .8s cubic-bezier(.16,.9,.28,1) ${0.3 + i * 0.15}s`
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
                                        boxShadow: "0 8px 18px -4px rgba(37,99,235,.45)",
                                        transition: "transform .3s ease, box-shadow .3s ease"
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = "translateY(-4px) scale(1.08)";
                                        e.currentTarget.style.boxShadow = "0 12px 22px -4px rgba(37,99,235,.6)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = "translateY(0) scale(1)";
                                        e.currentTarget.style.boxShadow = "0 8px 18px -4px rgba(37,99,235,.45)";
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
                </div>

                {/* Right Image */}
                <div
                    style={{
                        flex: "1 1 420px",
                        minWidth: "300px",
                        display: "flex",
                        justifyContent: "center",
                        opacity: inView ? 1 : 0,
                        transform: inView ? "translateX(0) scale(1)" : "translateX(60px) scale(.95)",
                        transition: "opacity 1.1s cubic-bezier(.16,.9,.28,1) .2s, transform 1.1s cubic-bezier(.16,.9,.28,1) .2s"
                    }}
                >
                    <div
                        style={{
                            position: "relative",
                            width: "100%",
                            maxWidth: "560px",
                            borderRadius: "20px",
                            overflow: "hidden",
                            boxShadow: "0 25px 60px -18px rgba(15,23,42,.35)",
                            transition: "transform .4s ease, box-shadow .4s ease"
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-6px)";
                            e.currentTarget.style.boxShadow = "0 35px 70px -18px rgba(15,23,42,.45)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "0 25px 60px -18px rgba(15,23,42,.35)";
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