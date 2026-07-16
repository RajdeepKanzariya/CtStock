import { useState, useEffect } from "react";

const API_BASE = "http://localhost:8080";

export default function ServiceList({ onSelect }) {

    const [hoverId, setHoverId] = useState(null);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_BASE}/services`)
            .then((res) => res.json())
            .then((data) => setServices(data))
            .catch((err) => console.error("Failed to fetch services:", err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <section style={{ padding: "80px 6%", textAlign: "center", color: "#64748B" }}>
                Loading services...
            </section>
        );
    }

    return (
        <section
            style={{
                width: "100%",
                padding: "clamp(60px, 8vw, 100px) 6%",
                background: "#F8FAFC",
                boxSizing: "border-box"
            }}
        >
            <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
                <p style={{ color: "#2563EB", fontSize: "13px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", margin: 0 }}>
                    Our Services
                </p>
                <h2 style={{ margin: "10px 0 0", fontSize: "clamp(26px, 3.4vw, 38px)", fontWeight: 800, color: "#0F172A" }}>
                    What Can We <span style={{ color: "#2563EB" }}>Help You With?</span>
                </h2>
                <p style={{ margin: "14px 0 0", color: "#64748B", fontSize: "15px", lineHeight: 1.8 }}>
                    Pick a service below to explore recommended tools and solutions.
                </p>
            </div>

            <div
                style={{
                    maxWidth: "1180px",
                    margin: "48px auto 0",
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "20px"
                }}
            >
                {services.map((service) => {
                    const hover = hoverId === service.id;
                    return (
                        <button
                            key={service.id}
                            onClick={() => onSelect(service)}
                            onMouseEnter={() => setHoverId(service.id)}
                            onMouseLeave={() => setHoverId(null)}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "14px",
                                textAlign: "left",
                                background: "#fff",
                                border: hover ? "1px solid rgba(37,99,235,.4)" : "1px solid #EAECEF",
                                borderRadius: "16px",
                                padding: "20px",
                                cursor: "pointer",
                                boxShadow: hover
                                    ? "0 18px 34px -16px rgba(37,99,235,.25)"
                                    : "0 6px 18px -10px rgba(15,23,42,.06)",
                                transform: hover ? "translateY(-4px)" : "translateY(0)",
                                transition: "all .25s ease"
                            }}
                        >
                            <div
                                style={{
                                    width: "46px",
                                    height: "46px",
                                    minWidth: "46px",
                                    borderRadius: "12px",
                                    background: hover ? "linear-gradient(135deg,#2563EB,#3B82F6)" : "rgba(37,99,235,.1)",
                                    color: hover ? "#fff" : "#2563EB",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    transition: "all .25s ease"
                                }}
                            >
                                <ServiceIcon slug={service.slug} title={service.title} />
                            </div>
                            <span style={{ fontSize: "15px", fontWeight: 700, color: "#0F172A" }}>
                                {service.title}
                            </span>
                        </button>
                    );
                })}
            </div>
        </section>
    );
}

function ServiceIcon({ slug, title }) {
    const common = { width: 21, height: 21, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };

    // Normalize so icon matching keeps working even if slugs in the DB
    // have different casing/spacing (e.g. "Desktop Software Development").
    const key = (slug || title || "")
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-");

    switch (key) {
        case "job-portal":
            return <svg {...common}><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>;

        // WebApp Development -> browser window icon (rectangle with a top "chrome" bar + dots)
        // distinct from the plain desktop monitor used below.
        case "web-dev":
        case "webapp-development":
            return (
                <svg {...common}>
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <line x1="2" y1="9" x2="22" y2="9" />
                    <circle cx="5.5" cy="6.5" r=".6" fill="currentColor" stroke="none" />
                    <circle cx="8" cy="6.5" r=".6" fill="currentColor" stroke="none" />
                </svg>
            );

        case "ecommerce":
        case "e-commerce-development":
            return <svg {...common}><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" /></svg>;

        // Digital Marketing -> bullhorn/megaphone icon (clearer "broadcast/promote" meaning)
        case "digital-marketing":
            return (
                <svg {...common}>
                    <path d="M3 11v2a2 2 0 0 0 2 2h1l3 5 1-1-2-4h6l5 3V6l-5 3H6a2 2 0 0 0-2 2Z" />
                    <path d="M11 20v-3" />
                </svg>
            );

        case "social-media":
        case "social-media-management":
            return <svg {...common}><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m8.6 10.5 6.8-3.9M8.6 13.5l6.8 3.9" /></svg>;

        case "graphic-design":
            return <svg {...common}><circle cx="13.5" cy="6.5" r=".5" /><circle cx="17.5" cy="10.5" r=".5" /><circle cx="8.5" cy="7.5" r=".5" /><circle cx="6.5" cy="12.5" r=".5" /><path d="M12 2a10 10 0 1 0 10 10c0-.5 0-1-.5-1H17a2 2 0 0 1-2-2V7c0-2-3-5-5-5Z" /></svg>;

        case "app-dev":
        case "app-development":
            return <svg {...common}><rect x="5" y="2" width="14" height="20" rx="2" /><path d="M12 18h.01" /></svg>;

        // Customize Software Solution -> sliders/adjustment icon (clearer "customize" meaning
        // than the generic 4-square grid used before)
        case "google-workspace":
        case "customize-software-solution":
            return (
                <svg {...common}>
                    <line x1="4" y1="6" x2="20" y2="6" />
                    <circle cx="9" cy="6" r="2" fill="currentColor" stroke="none" />
                    <line x1="4" y1="12" x2="20" y2="12" />
                    <circle cx="15" cy="12" r="2" fill="currentColor" stroke="none" />
                    <line x1="4" y1="18" x2="20" y2="18" />
                    <circle cx="11" cy="18" r="2" fill="currentColor" stroke="none" />
                </svg>
            );

        case "chatbot":
            return <svg {...common}><rect x="3" y="11" width="18" height="10" rx="2" /><circle cx="8.5" cy="16" r="1" /><circle cx="15.5" cy="16" r="1" /><path d="M12 7v4M9 4h6" /></svg>;

        case "cloud-computing":
            return <svg {...common}><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10Z" /></svg>;

        // Desktop Software Development -> plain monitor + stand
        case "desktop-software-development":
            return (
                <svg {...common}>
                    <rect x="3" y="4" width="18" height="12" rx="2" />
                    <path d="M8 20h8M12 16v4" />
                </svg>
            );

        default:
            return <svg {...common}><circle cx="12" cy="12" r="9" /></svg>;
    }
}