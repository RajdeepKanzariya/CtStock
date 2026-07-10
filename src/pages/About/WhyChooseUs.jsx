import { useEffect, useRef, useState } from "react";

export default function WhyChooseUs() {

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

    const items = [
        {
            title: "Excellent Customer(Service) Support",
            desc: "Prompt, reliable, and professional assistance whenever you need it.",
            icon: <IconBriefcase />
        },
        {
            title: " Customized Reports",
            desc: " Reports can be tailored to match your organization's specific requirements.",
            icon: <IconUsers />
        },
        {
            title: " Flexible Software Customization",
            desc: "Entry screens, data structures, and workflows can be modified to suit your business processes.",
            icon: <IconPuzzle />
        },
        {
            title: "Continuous User Guidance",
            desc: "Ongoing training and expert guidance to help you make the best use of every feature in the software.",
            icon: <IconChip />
        },
        {
            title: "Simple and User-Friendly Interface",
            desc: "Designed for easy operation with minimal learning time.",
            icon: <IconHeadset />
        },
        {
            title: " Future-Ready Development",
            desc: "The software is continuously enhanced with new features and improvements to meet evolving business needs.",
            icon: <IconShield />
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
                    maxWidth: "700px",
                    margin: "0 auto",
                    textAlign: "center",
                    opacity: inView ? 1 : 0,
                    transform: inView ? "translateY(0)" : "translateY(35px)",
                    transition: `opacity 1s ${EASE}, transform 1s ${EASE}`
                }}
            >
                <p style={{ color: "#2563EB", fontSize: "13px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", margin: 0 }}>
                    Why Choose CT Stock
                </p>
                <h2 style={{ margin: "10px 0 0", fontSize: "clamp(26px, 3.4vw, 38px)", fontWeight: 800, color: "#0F172A" }}>
                    We Deliver <span style={{ color: "#2563EB" }}>More Than Just Software</span>
                </h2>
            </div>

            <div
                style={{
                    maxWidth: "1180px",
                    margin: "50px auto 0",
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                    gap: "22px"
                }}
            >
                {items.map((item, i) => (
                    <FeatureCard key={i} item={item} delay={0.12 + i * 0.1} inView={inView} ease={EASE} />
                ))}
            </div>
        </section>
    );
}

function FeatureCard({ item, delay, inView, ease }) {
    const [hover, setHover] = useState(false);

    return (
        <div
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
                background: "#fff",
                borderRadius: "18px",
                padding: "30px 26px",
                border: hover ? "1px solid rgba(37,99,235,.35)" : "1px solid #EAECEF",
                boxShadow: hover
                    ? "0 20px 40px -18px rgba(37,99,235,.25)"
                    : "0 6px 20px -10px rgba(15,23,42,.08)",
                opacity: inView ? 1 : 0,
                transform: inView
                    ? hover
                        ? "translateY(-8px)"
                        : "translateY(0)"
                    : "translateY(45px)",
                transition: `opacity .8s ${ease} ${delay}s, transform .8s ${ease} ${delay}s, box-shadow .3s ease, border-color .3s ease`
            }}
        >
            <div
                style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "14px",
                    background: hover
                        ? "linear-gradient(135deg,#2563EB,#3B82F6)"
                        : "rgba(37,99,235,.1)",
                    color: hover ? "#fff" : "#2563EB",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "18px",
                    transform: hover ? "rotate(-6deg) scale(1.06)" : "rotate(0) scale(1)",
                    transition: "all .35s ease"
                }}
            >
                {item.icon}
            </div>

            <h3 style={{ margin: 0, fontSize: "17px", fontWeight: 700, color: "#0F172A" }}>
                {item.title}
            </h3>
            <p style={{ marginTop: "8px", fontSize: "14px", lineHeight: 1.75, color: "#64748B" }}>
                {item.desc}
            </p>
        </div>
    );
}

/* ---------- icons ---------- */

function IconBriefcase() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
    );
}

function IconUsers() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    );
}

function IconPuzzle() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
        </svg>
    );
}

function IconChip() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="6" y="6" width="12" height="12" rx="2" />
            <path d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2" />
        </svg>
    );
}

function IconHeadset() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
            <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3ZM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3Z" />
        </svg>
    );
}

function IconShield() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    );
}