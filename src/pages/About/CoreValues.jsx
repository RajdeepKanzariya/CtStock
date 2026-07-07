import { useEffect, useRef, useState } from "react";

export default function CoreValues() {

    const sectionRef = useRef(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => setInView(entry.isIntersecting),
            { threshold: 0.15, rootMargin: "-60px 0px -60px 0px" }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    const EASE = "cubic-bezier(.16,.9,.28,1)";

    
    const values = [
        {
            title: "Industry Specific",
            desc: "We embrace new ideas to build better software.",
            icon: <IconBriefcase />
        },
        {
            title: "Customer First",
            desc: "Your success is our highest priority.",
            icon: <IconHeart />
        },
        {
            title: "Quality",
            desc: "Reliable software with high performance.",
            icon: <IconStar />
        },
        {
            title: "Integrity",
            desc: "Transparency and honesty in everything.",
            icon: <IconScale />
        },
        {
            title: "Teamwork",
            desc: "Working together to deliver excellence.",
            icon: <IconUsers />
        },
        {
            title: "Innovation",
            desc: "Constantly exploring smarter ways to solve problems.",
            icon: <IconBulb />
        },
        {
            title: "Accountability",
            desc: "We own our work and stand behind every result.",
            icon: <IconCheckShield />
        }
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
                    maxWidth: "700px",
                    margin: "0 auto",
                    textAlign: "center",
                    opacity: inView ? 1 : 0,
                    transform: inView ? "translateY(0)" : "translateY(35px)",
                    transition: `opacity 1s ${EASE}, transform 1s ${EASE}`
                }}
            >
                <p style={{ color: "#2563EB", fontSize: "13px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", margin: 0 }}>
                    Our Core Values
                </p>
                <h2 style={{ margin: "10px 0 0", fontSize: "clamp(26px, 3.2vw, 36px)", fontWeight: 800, color: "#0F172A" }}>
                    What We <span style={{ color: "#2563EB" }}>Stand For</span>
                </h2>
            </div>

            <div
                style={{
                    maxWidth: "1200px",
                    margin: "46px auto 0",
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
                    gap: "20px"
                }}
            >
                {values.map((v, i) => (
                    <ValueCard key={i} value={v} delay={0.1 + i * 0.09} inView={inView} ease={EASE} />
                ))}
            </div>
        </section>
    );
}

function ValueCard({ value, delay, inView, ease }) {
    const [hover, setHover] = useState(false);

    return (
        <div
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
                background: "#fff",
                borderRadius: "16px",
                padding: "26px 22px",
                border: hover ? "1px solid rgba(37,99,235,.35)" : "1px solid #EAECEF",
                boxShadow: hover
                    ? "0 20px 36px -18px rgba(37,99,235,.25)"
                    : "0 6px 18px -10px rgba(15,23,42,.08)",
                opacity: inView ? 1 : 0,
                transform: inView
                    ? hover
                        ? "translateY(-6px)"
                        : "translateY(0)"
                    : "translateY(40px)",
                transition: `opacity .8s ${ease} ${delay}s, transform .8s ${ease} ${delay}s, box-shadow .3s ease, border-color .3s ease`
            }}
        >
            <div
                style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "12px",
                    background: hover
                        ? "linear-gradient(135deg,#2563EB,#3B82F6)"
                        : "rgba(37,99,235,.1)",
                    color: hover ? "#fff" : "#2563EB",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "16px",
                    transform: hover ? "rotate(-6deg) scale(1.08)" : "rotate(0) scale(1)",
                    transition: "all .35s ease"
                }}
            >
                {value.icon}
            </div>

            <h3 style={{ margin: 0, fontSize: "15.5px", fontWeight: 700, color: "#0F172A" }}>
                {value.title}
            </h3>
            <p style={{ marginTop: "8px", fontSize: "13.5px", lineHeight: 1.7, color: "#64748B" }}>
                {value.desc}
            </p>
        </div>
    );
}

/* ---------- icons ---------- */

function IconBriefcase() {
    return (
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
    );
}

function IconHeart() {
    return (
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
        </svg>
    );
}

function IconStar() {
    return (
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m12 2 2.9 6.6L22 9.3l-5 4.8L18.2 22 12 18.3 5.8 22 7 14.1l-5-4.8 7.1-.7Z" />
        </svg>
    );
}

function IconScale() {
    return (
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3v18M5 7l-3 7a3 3 0 0 0 6 0ZM19 7l3 7a3 3 0 0 1-6 0Z" />
            <path d="M5 7h14M9 3h6" />
        </svg>
    );
}

function IconUsers() {
    return (
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    );
}

function IconBulb() {
    return (
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18h6M10 22h4M12 2a6 6 0 0 0-4 10.5c.6.6 1 1.4 1 2.5h6c0-1.1.4-1.9 1-2.5A6 6 0 0 0 12 2Z" />
        </svg>
    );
}

function IconCheckShield() {
    return (
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    );
}