import { useState } from "react";
import { offersByCategory } from "../../../router/servicesData";

export default function ServiceOffers({ category, onBack }) {

    const [hoverIndex, setHoverIndex] = useState(null);
    const offers = offersByCategory[category?.id] || [];

    return (
        <section
            style={{
                width: "100%",
                padding: "clamp(60px, 8vw, 100px) 6%",
                background: "#F8FAFC",
                boxSizing: "border-box"
            }}
        >
            <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
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
                    <BackIcon /> Back to Categories
                </button>

                <div style={{ maxWidth: "700px" }}>
                    <p style={{ color: "#2563EB", fontSize: "13px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", margin: 0 }}>
                        {category?.title}
                    </p>
                    <h2 style={{ margin: "10px 0 0", fontSize: "clamp(24px, 3vw, 32px)", fontWeight: 800, color: "#0F172A" }}>
                        Recommended Solutions
                    </h2>
                </div>

                <div style={{ marginTop: "36px", display: "flex", flexDirection: "column", gap: "18px" }}>
                    {offers.map((offer, i) => {
                        const hover = hoverIndex === i;
                        return (
                            <div
                                key={i}
                                onMouseEnter={() => setHoverIndex(i)}
                                onMouseLeave={() => setHoverIndex(null)}
                                style={{
                                    background: "#fff",
                                    border: hover ? "1px solid rgba(37,99,235,.35)" : "1px solid #EAECEF",
                                    borderRadius: "18px",
                                    padding: "clamp(22px, 3vw, 30px)",
                                    display: "flex",
                                    flexWrap: "wrap",
                                    alignItems: "center",
                                    gap: "20px",
                                    justifyContent: "space-between",
                                    boxShadow: hover
                                        ? "0 20px 40px -18px rgba(37,99,235,.2)"
                                        : "0 6px 18px -10px rgba(15,23,42,.06)",
                                    transform: hover ? "translateY(-4px)" : "translateY(0)",
                                    transition: "all .25s ease"
                                }}
                            >
                                <div style={{ flex: "1 1 340px" }}>
                                    <p style={{ margin: 0, color: "#2563EB", fontSize: "12.5px", fontWeight: 700 }}>
                                        {offer.domain}
                                    </p>
                                    <h3 style={{ margin: "6px 0 0", fontSize: "17px", fontWeight: 800, color: "#0F172A", lineHeight: 1.4 }}>
                                        {offer.title}
                                    </h3>
                                    <p style={{ marginTop: "8px", fontSize: "14px", color: "#64748B", lineHeight: 1.7 }}>
                                        {offer.description}
                                    </p>
                                </div>

                                <a
                                    href={offer.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        background: "linear-gradient(90deg,#2563EB,#3B82F6)",
                                        color: "#fff",
                                        textDecoration: "none",
                                        padding: "13px 24px",
                                        borderRadius: "10px",
                                        fontWeight: 700,
                                        fontSize: "14px",
                                        whiteSpace: "nowrap",
                                        boxShadow: "0 10px 22px -8px rgba(37,99,235,.6)",
                                        transition: "transform .2s ease"
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
                                    onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                                >
                                    Visit Site <ArrowIcon />
                                </a>
                            </div>
                        );
                    })}

                    {offers.length === 0 && (
                        <p style={{ color: "#94A3B8", fontSize: "14px" }}>
                            No solutions available for this category yet.
                        </p>
                    )}
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
            <path d="M7 17 17 7M7 7h10v10" />
        </svg>
    );
}