import { useEffect, useRef, useState } from "react";

export default function MissionVision() {

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

    const EASE = "cubic-bezier(.16,.9,.28,1)";

    const cards = [
        {
            title: "Our Mission",
            desc: "To develop reliable, secure and innovative software solutions that empower businesses to achieve sustainable growth.",
            icon: <IconTarget />,
            bg: "linear-gradient(135deg,#DBE7FF,#EAF1FF)",
            iconBg: "linear-gradient(135deg,#2563EB,#3B82F6)",
            iconShadow: "0 12px 24px -8px rgba(37,99,235,.55)"
        },
        {
            title: "Our Vision",
            desc: "To become one of India's most trusted software companies by delivering world-class digital business solutions.",
            icon: <IconEye />,
            bg: "linear-gradient(135deg,#DCFCE7,#EFFDF3)",
            iconBg: "linear-gradient(135deg,#22C55E,#4ADE80)",
            iconShadow: "0 12px 24px -8px rgba(34,197,94,.55)"
        }
    ];

    return (
        <section
            ref={sectionRef}
            style={{
                width: "100%",
                padding: "clamp(60px, 8vw, 100px) 6%",
                background: "#F8FAFC",
                boxSizing: "border-box",
                overflow: "hidden"
            }}
        >
            <div
                style={{
                    maxWidth: "1000px",
                    margin: "0 auto",
                    textAlign: "center",
                    opacity: inView ? 1 : 0,
                    transform: inView ? "translateY(0)" : "translateY(35px)",
                    transition: `opacity 1s ${EASE}, transform 1s ${EASE}`
                }}
            >
                <p style={{ color: "#2563EB", fontSize: "13px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", margin: 0 }}>
                    Driven By Purpose
                </p>
                <h2 style={{ margin: "10px 0 0", fontSize: "clamp(26px, 3.2vw, 36px)", fontWeight: 800, color: "#0F172A" }}>
                    Our Mission & <span style={{ color: "#2563EB" }}>Vision</span>
                </h2>
            </div>

            <div
                style={{
                    maxWidth: "1000px",
                    margin: "46px auto 0",
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                    gap: "clamp(20px, 3vw, 32px)"
                }}
            >
                {cards.map((c, i) => (
                    <Card key={i} card={c} delay={0.2 + i * 0.18} inView={inView} ease={EASE} />
                ))}
            </div>
        </section>
    );
}

function Card({ card, delay, inView, ease }) {
    const [hover, setHover] = useState(false);

    return (
        <div
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
                background: card.bg,
                borderRadius: "20px",
                padding: "clamp(28px, 3.5vw, 38px)",
                display: "flex",
                gap: "20px",
                alignItems: "flex-start",
                boxShadow: hover
                    ? "0 25px 50px -20px rgba(15,23,42,.25)"
                    : "0 10px 28px -16px rgba(15,23,42,.15)",
                opacity: inView ? 1 : 0,
                transform: inView
                    ? hover
                        ? "translateY(-8px)"
                        : "translateY(0)"
                    : "translateY(45px)",
                transition: `opacity .9s ${ease} ${delay}s, transform .9s ${ease} ${delay}s, box-shadow .35s ease`
            }}
        >
            <div
                style={{
                    width: "56px",
                    height: "56px",
                    minWidth: "56px",
                    borderRadius: "16px",
                    background: card.iconBg,
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: card.iconShadow,
                    transform: hover ? "rotate(-6deg) scale(1.08)" : "rotate(0) scale(1)",
                    transition: "transform .35s ease"
                }}
            >
                {card.icon}
            </div>

            <div>
                <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 800, color: "#0F172A" }}>
                    {card.title}
                </h3>
                <p style={{ marginTop: "8px", fontSize: "14.5px", lineHeight: 1.75, color: "#334155" }}>
                    {card.desc}
                </p>
            </div>
        </div>
    );
}

/* ---------- icons ---------- */

function IconTarget() {
    return (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <circle cx="12" cy="12" r="5" />
            <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
            <path d="m18 6 2-2M20 4l1-1" />
        </svg>
    );
}

function IconEye() {
    return (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );
}