import { useEffect, useRef, useState } from "react";

export default function Process() {

    const sectionRef = useRef(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => setInView(entry.isIntersecting),
            { threshold: 0.1, rootMargin: "-60px 0px -60px 0px" }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    const EASE = "cubic-bezier(.16,.9,.28,1)";

    const steps = [
        {
            num: "01",
            title: "Requirement",
            desc: "We start by understanding what you truly need from your software solution.",
            icon: <IconClipboardList />
        },
        {
            num: "02",
            title: "Gathering Information & Analysis",
            desc: "We dig into your workflows and business goals to analyze feasibility and scope.",
            icon: <IconSearch />
        },
        {
            num: "03",
            title: "Planning",
            desc: "We map out timelines, resources and technical strategy before writing any code.",
            icon: <IconClipboard />
        },
        {
            num: "04",
            title: "Software Design",
            desc: "UI/UX and system architecture are designed to be intuitive, scalable and future-ready.",
            icon: <IconPenTool />
        },
        {
            num: "05",
            title: "Implementation (Coding)",
            desc: "Our developers build the product using clean, modern and maintainable code.",
            icon: <IconCode />
        },
        {
            num: "06",
            title: "Testing",
            desc: "Rigorous QA across functionality, performance and security before anything ships.",
            icon: <IconBug />
        },
        {
            num: "07",
            title: "Deployment",
            desc: "We launch your software into production with a smooth, well-planned rollout.",
            icon: <IconRocket />
        },
        {
            num: "08",
            title: "Maintenance",
            desc: "Ongoing support, updates and monitoring to keep your software running at its best.",
            icon: <IconTool />
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
                    Our Process
                </p>
                <h2 style={{ margin: "10px 0 0", fontSize: "clamp(26px, 3.2vw, 36px)", fontWeight: 800, color: "#0F172A" }}>
                    How We <span style={{ color: "#2563EB" }}>Bring Ideas to Life</span>
                </h2>
            </div>

            {/* Timeline */}
            <div
                style={{
                    position: "relative",
                    maxWidth: "900px",
                    margin: "56px auto 0"
                }}
            >
                {/* center connecting line */}
                <div
                    style={{
                        position: "absolute",
                        left: "50%",
                        top: 0,
                        bottom: 0,
                        width: "2px",
                        background: "linear-gradient(180deg, rgba(37,99,235,.05), rgba(37,99,235,.35), rgba(37,99,235,.05))",
                        transform: "translateX(-50%)"
                    }}
                    className="tl-line"
                />

                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {steps.map((step, i) => (
                        <StepRow
                            key={i}
                            step={step}
                            index={i}
                            delay={0.08 + i * 0.12}
                            inView={inView}
                            ease={EASE}
                        />
                    ))}
                </div>
            </div>

            {/* collapse to single column below 720px */}
            <style>{`
                @media (max-width: 720px) {
                    .tl-line { left: 22px !important; transform: none !important; }
                    .tl-row { flex-direction: row !important; }
                    .tl-card-left, .tl-card-right { 
                        width: 100% !important; 
                        text-align: left !important; 
                        padding-left: 20px !important; 
                        padding-right: 0 !important;
                    }
                    .tl-spacer { display: none !important; }
                    .tl-node { position: static !important; margin-right: 14px !important; }
                }
            `}</style>
        </section>
    );
}

function StepRow({ step, index, delay, inView, ease }) {
    const isLeft = index % 2 === 0;
    const [hover, setHover] = useState(false);

    const card = (
        <div
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
                background: "#fff",
                borderRadius: "16px",
                padding: "22px 24px",
                border: hover ? "1px solid rgba(37,99,235,.35)" : "1px solid #EAECEF",
                boxShadow: hover
                    ? "0 20px 36px -18px rgba(37,99,235,.22)"
                    : "0 6px 18px -10px rgba(15,23,42,.08)",
                transform: hover ? "translateY(-4px)" : "translateY(0)",
                transition: "box-shadow .3s ease, border-color .3s ease, transform .3s ease"
            }}
        >
            <p style={{ margin: 0, fontSize: "12px", fontWeight: 700, color: "#2563EB", letterSpacing: ".5px" }}>
                STEP {step.num}
            </p>
            <h3 style={{ margin: "6px 0 0", fontSize: "16.5px", fontWeight: 700, color: "#0F172A" }}>
                {step.title}
            </h3>
            <p style={{ marginTop: "8px", fontSize: "13.5px", lineHeight: 1.7, color: "#64748B" }}>
                {step.desc}
            </p>
        </div>
    );

    return (
        <div
            className="tl-row"
            style={{
                display: "flex",
                alignItems: "center",
                gap: "0",
                position: "relative",
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(35px)",
                transition: `opacity .8s ${ease} ${delay}s, transform .8s ${ease} ${delay}s`
            }}
        >
            {/* Left slot */}
            <div className="tl-card-left" style={{ width: "calc(50% - 34px)", paddingRight: "34px" }}>
                {isLeft ? card : null}
            </div>

            {/* Node */}
            <div
                className="tl-node"
                style={{
                    position: "relative",
                    width: "58px",
                    minWidth: "58px",
                    height: "58px",
                    borderRadius: "50%",
                    background: hover
                        ? "linear-gradient(135deg,#2563EB,#3B82F6)"
                        : "#DBEAFE",
                    color: hover ? "#fff" : "#2563EB",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 2,
                    border: "4px solid #F8FAFC",
                    boxShadow: "0 6px 16px -6px rgba(37,99,235,.4)",
                    transition: "all .35s ease"
                }}
            >
                {step.icon}
            </div>

            {/* Right slot */}
            <div className="tl-card-right" style={{ width: "calc(50% - 34px)", paddingLeft: "34px" }}>
                {!isLeft ? card : null}
            </div>
        </div>
    );
}

/* ---------- icons ---------- */

function IconClipboardList() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="8" y="2" width="8" height="4" rx="1" />
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
            <path d="M9 12h.01M9 16h.01M12.5 12H15M12.5 16H15" />
        </svg>
    );
}

function IconSearch() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
        </svg>
    );
}

function IconClipboard() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="8" y="2" width="8" height="4" rx="1" />
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
            <path d="M9 12h6M9 16h6" />
        </svg>
    );
}

function IconPenTool() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m12 19 7-7 3 3-7 7-3-3Z" />
            <path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5ZM2 2l7.586 7.586" />
            <circle cx="11" cy="11" r="2" />
        </svg>
    );
}

function IconCode() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m16 18 6-6-6-6M8 6l-6 6 6 6" />
        </svg>
    );
}

function IconBug() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="8" y="6" width="8" height="12" rx="4" />
            <path d="M12 2v4M9 9H4M9 13H3M9 17H4M15 9h5M15 13h6M15 17h5M5 5l3 3M19 5l-3 3" />
        </svg>
    );
}

function IconRocket() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09Z" />
            <path d="M12 15c3.5-1.5 6-4.5 7.5-9C21 2 20 1.5 16.5 3c-4.5 1.5-7.5 4-9 7.5-.5 1-1 3-1 3s2 .5 3 1Z" />
            <path d="M9 12H4s.55-2.23 2-3c1.62-.87 4 0 4 0M12 15v5s2.23-.55 3-2c.87-1.62 0-4 0-4" />
        </svg>
    );
}

function IconTool() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76Z" />
        </svg>
    );
}