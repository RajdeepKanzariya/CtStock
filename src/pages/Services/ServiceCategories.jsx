import { useState } from "react";
import { categories } from "../../../router/servicesData";

export default function ServiceCategories({ service, onSelect, onBack }) {

    const [hoverId, setHoverId] = useState(null);

    return (
        <section
            style={{
                width: "100%",
                padding: "clamp(60px, 8vw, 100px) 6%",
                background: "#F8FAFC",
                boxSizing: "border-box"
            }}
        >
            <div style={{ maxWidth: "1180px", margin: "0 auto" }}>
                <button
                    onClick={onBack}
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        background: "transparent",
                        border: "none",
                        color: "#2563EB",
                        fontWeight: 600,
                        fontSize: "13.5px",
                        cursor: "pointer",
                        padding: 0,
                        marginBottom: "22px"
                    }}
                >
                    <BackIcon /> Back to Services
                </button>

                <div style={{ maxWidth: "700px" }}>
                    <p style={{ color: "#2563EB", fontSize: "13px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", margin: 0 }}>
                        {service?.title}
                    </p>
                    <h2 style={{ margin: "10px 0 0", fontSize: "clamp(24px, 3vw, 34px)", fontWeight: 800, color: "#0F172A" }}>
                        Choose a Category to Explore
                    </h2>
                </div>

                <div
                    style={{
                        marginTop: "40px",
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                        gap: "20px"
                    }}
                >
                    {categories.map((cat) => {
                        const hover = hoverId === cat.id;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => onSelect(cat)}
                                onMouseEnter={() => setHoverId(cat.id)}
                                onMouseLeave={() => setHoverId(null)}
                                style={{
                                    textAlign: "left",
                                    background: hover ? "linear-gradient(135deg,#2563EB,#3B82F6)" : "#fff",
                                    color: hover ? "#fff" : "#0F172A",
                                    border: hover ? "1px solid transparent" : "1px solid #EAECEF",
                                    borderRadius: "16px",
                                    padding: "24px",
                                    cursor: "pointer",
                                    boxShadow: hover
                                        ? "0 20px 40px -18px rgba(37,99,235,.45)"
                                        : "0 6px 18px -10px rgba(15,23,42,.06)",
                                    transform: hover ? "translateY(-5px)" : "translateY(0)",
                                    transition: "all .25s ease"
                                }}
                            >
                                <span style={{ fontSize: "15.5px", fontWeight: 700, lineHeight: 1.4 }}>
                                    {cat.title}
                                </span>
                                <div
                                    style={{
                                        marginTop: "14px",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "6px",
                                        fontSize: "13px",
                                        fontWeight: 600,
                                        color: hover ? "#DBEAFE" : "#2563EB"
                                    }}
                                >
                                    View Options <ArrowIcon />
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

function BackIcon() {
    return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
        </svg>
    );
}

function ArrowIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
    );
}