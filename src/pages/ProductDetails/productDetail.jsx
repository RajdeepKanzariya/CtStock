import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const PRODUCTS_API = "http://localhost:8080/product";
const IMAGE_BASE = "http://localhost:8080/uploads/";

export default function ProductDetail() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [activeScreenshot, setActiveScreenshot] = useState(0);

    useEffect(() => {
        fetchProduct();
        window.scrollTo(0, 0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchProduct = async () => {
        setLoading(true);
        setNotFound(false);
        try {
            const res = await fetch(`${PRODUCTS_API}/${id}`);
            if (!res.ok) {
                setNotFound(true);
                return;
            }
            const data = await res.json();
            setProduct(data);
            setActiveScreenshot(0);
        } catch (err) {
            console.error("Failed to fetch product:", err);
            setNotFound(true);
        } finally {
            setLoading(false);
        }
    };

    const accent = product?.accent_color || "#2563EB";

    if (loading) {
        return (
            <div style={{ padding: "100px 6%", textAlign: "center", color: "#64748B" }}>
                Loading product...
            </div>
        );
    }

    if (notFound || !product) {
        return (
            <div style={{ padding: "100px 6%", textAlign: "center" }}>
                <h2 style={{ color: "#0F172A" }}>Product not found</h2>
                <p style={{ color: "#64748B", marginTop: "10px" }}>
                    The product you're looking for doesn't exist or was removed.
                </p>
                <button
                    onClick={() => navigate("/")}
                    style={{
                        marginTop: "20px",
                        background: "#2563EB",
                        color: "#fff",
                        border: "none",
                        padding: "12px 24px",
                        borderRadius: "9px",
                        fontWeight: 600,
                        cursor: "pointer"
                    }}
                >
                    ← Back to Home
                </button>
            </div>
        );
    }

    return (
        <div style={{ width: "100%", boxSizing: "border-box" }}>

            {/* ============ TOP HERO — logo, title, desc, usages, features, demo ============ */}
            <section
                style={{
                    width: "100%",
                    padding: "clamp(60px, 8vw, 90px) 6% clamp(50px, 6vw, 70px)",
                    background: `linear-gradient(160deg, ${accent}12 0%, #F8FAFC 60%)`,
                    boxSizing: "border-box"
                }}
            >
                <div
                    style={{
                        maxWidth: "1100px",
                        margin: "0 auto",
                        display: "flex",
                        gap: "clamp(24px, 4vw, 48px)",
                        alignItems: "flex-start",
                        flexWrap: "wrap"
                    }}
                >
                    {/* Logo */}
                    <div
                        style={{
                            width: "110px",
                            height: "110px",
                            minWidth: "110px",
                            borderRadius: "22px",
                            background: "#fff",
                            border: "1px solid #E2E8F0",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "hidden",
                            boxShadow: "0 12px 28px -12px rgba(15,23,42,.15)"
                        }}
                    >
                        {product.logo ? (
                            <img
                                src={IMAGE_BASE + product.logo}
                                alt={product.name}
                                style={{ width: "100%", height: "100%", objectFit: "contain", padding: "14px" }}
                            />
                        ) : (
                            <span style={{ fontSize: "38px", fontWeight: 800, color: accent }}>
                                {product.name ? product.name.charAt(0).toUpperCase() : "?"}
                            </span>
                        )}
                    </div>

                    {/* Title + desc + demo button */}
                    <div style={{ flex: "1 1 340px", minWidth: "260px" }}>
                        <p style={{ margin: 0, color: accent, fontSize: "13px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase" }}>
                            {product.name}
                        </p>
                        <h1 style={{ margin: "8px 0 0", fontSize: "clamp(24px, 3vw, 34px)", fontWeight: 800, color: "#0F172A", lineHeight: 1.25 }}>
                            {product.title || product.name}
                        </h1>
                        {product.short_description && (
                            <p style={{ marginTop: "12px", fontSize: "15px", color: "#475569", lineHeight: 1.75, maxWidth: "640px" }}>
                                {product.short_description}
                            </p>
                        )}

                        {product.demo_link && (
                            <a
                                onClick={() => navigate("/enquiry")}
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    marginTop: "24px",
                                    background: accent,
                                    color: "#fff",
                                    padding: "13px 26px",
                                    borderRadius: "10px",
                                    fontWeight: 700,
                                    fontSize: "14.5px",
                                    textDecoration: "none",
                                    boxShadow: `0 12px 24px -10px ${accent}99`
                                }}
                            >
                                Get Demo →
                            </a>
                        )}
                    </div>
                </div>

                {/* Usages + Features */}
                <div
                    style={{
                        maxWidth: "1100px",
                        margin: "clamp(36px, 5vw, 56px) auto 0",
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                        gap: "24px"
                    }}
                >
                    {product.usages && product.usages.length > 0 && (
                        <InfoCard title="Who It's For" accent={accent}>
                            {product.usages.map((u) => (
                                <ListRow key={u.id} accent={accent}>{u.usage_text}</ListRow>
                            ))}
                        </InfoCard>
                    )}

                    {product.features && product.features.length > 0 && (
                        <InfoCard title="Key Features" accent={accent}>
                            {product.features.map((f) => (
                                <ListRow key={f.id} accent={accent}>{f.feature_text}</ListRow>
                            ))}
                        </InfoCard>
                    )}
                </div>
            </section>

            {/* ============ VIDEO ============ */}
            {product.video && (
                <section
                    style={{
                        width: "100%",
                        padding: "clamp(50px, 6vw, 70px) 6%",
                        background: "#0F172A",
                        boxSizing: "border-box"
                    }}
                >
                    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
                        <video
                            src={IMAGE_BASE + product.video}
                            controls
                            style={{
                                width: "100%",
                                borderRadius: "16px",
                                boxShadow: "0 30px 70px -25px rgba(0,0,0,.6)"
                            }}
                        />
                    </div>
                </section>
            )}

            {/* ============ LONG DESCRIPTION ============ */}
            {product.long_description && (
                <section
                    style={{
                        width: "100%",
                        padding: "clamp(50px, 6vw, 70px) 6%",
                        background: "#fff",
                        boxSizing: "border-box"
                    }}
                >
                    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
                        <h2 style={{ margin: 0, fontSize: "clamp(22px, 2.6vw, 28px)", fontWeight: 800, color: "#0F172A" }}>
                            About {product.name}
                        </h2>
                        <p style={{ marginTop: "16px", fontSize: "15.5px", lineHeight: 1.9, color: "#475569", whiteSpace: "pre-line" }}>
                            {product.long_description}
                        </p>
                    </div>
                </section>
            )}

            {/* ============ SCREENSHOTS ============ */}
            {product.screenshots && product.screenshots.length > 0 && (
                <section
                    style={{
                        width: "100%",
                        padding: "clamp(50px, 6vw, 70px) 6%",
                        background: "#F8FAFC",
                        boxSizing: "border-box"
                    }}
                >
                    <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
                        <h2 style={{ margin: 0, fontSize: "clamp(22px, 2.6vw, 28px)", fontWeight: 800, color: "#0F172A", textAlign: "center" }}>
                            Screenshots
                        </h2>

                        {/* Main preview */}
                        <div
                            style={{
                                marginTop: "30px",
                                borderRadius: "18px",
                                overflow: "hidden",
                                border: "1px solid #E2E8F0",
                                boxShadow: "0 25px 55px -20px rgba(15,23,42,.2)",
                                background: "#fff"
                            }}
                        >
                            <img
                                src={IMAGE_BASE + product.screenshots[activeScreenshot].image}
                                alt={`${product.name} screenshot ${activeScreenshot + 1}`}
                                style={{ width: "100%", display: "block" }}
                            />
                        </div>

                        {/* Thumbnails */}
                        {product.screenshots.length > 1 && (
                            <div
                                style={{
                                    display: "flex",
                                    gap: "12px",
                                    marginTop: "18px",
                                    overflowX: "auto",
                                    paddingBottom: "6px"
                                }}
                            >
                                {product.screenshots.map((s, i) => (
                                    <img
                                        key={s.id}
                                        src={IMAGE_BASE + s.image}
                                        alt={`Thumbnail ${i + 1}`}
                                        onClick={() => setActiveScreenshot(i)}
                                        style={{
                                            width: "90px",
                                            height: "60px",
                                            objectFit: "cover",
                                            borderRadius: "8px",
                                            cursor: "pointer",
                                            flexShrink: 0,
                                            border: activeScreenshot === i
                                                ? `2px solid ${accent}`
                                                : "2px solid transparent",
                                            opacity: activeScreenshot === i ? 1 : 0.6,
                                            transition: "all .2s ease"
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* ============ BOTTOM CTA ============ */}
            <section
                style={{
                    width: "100%",
                    padding: "clamp(50px, 6vw, 70px) 6%",
                    background: "#fff",
                    textAlign: "center",
                    boxSizing: "border-box"
                }}
            >
                <h2 style={{ margin: 0, fontSize: "clamp(22px, 2.6vw, 28px)", fontWeight: 800, color: "#0F172A" }}>
                    Ready to try {product.name}?
                </h2>
                <p style={{ marginTop: "10px", color: "#64748B", fontSize: "15px" }}>
                    Get a live demo and see how it fits your business.
                </p>

                <div style={{ display: "flex", gap: "14px", justifyContent: "center", marginTop: "24px", flexWrap: "wrap" }}>
                    {product.demo_link && (
                        <a
                            onClick={() => navigate("/enquiry")}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                                background: accent,
                                color: "#fff",
                                padding: "14px 30px",
                                borderRadius: "10px",
                                fontWeight: 700,
                                fontSize: "15px",
                                textDecoration: "none",
                                boxShadow: `0 12px 24px -10px ${accent}99`
                            }}
                        >
                            Get Demo →
                        </a>
                    )}

                    <button
                        onClick={() => navigate("/")}
                        style={{
                            background: "#fff",
                            color: "#334155",
                            border: "1px solid #CBD5E1",
                            padding: "14px 30px",
                            borderRadius: "10px",
                            fontWeight: 700,
                            fontSize: "15px",
                            cursor: "pointer"
                        }}
                    >
                        ← Back to All Products
                    </button>
                </div>
            </section>
        </div>
    );
}

/* ---------- helpers ---------- */

function InfoCard({ title, accent, children }) {
    return (
        <div
            style={{
                background: "#fff",
                borderRadius: "16px",
                border: "1px solid #E2E8F0",
                padding: "24px",
                boxShadow: "0 10px 28px -18px rgba(15,23,42,.15)"
            }}
        >
            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: "#0F172A" }}>
                {title}
            </h3>
            <div style={{ marginTop: "14px", display: "flex", flexDirection: "column", gap: "10px" }}>
                {children}
            </div>
        </div>
    );
}

function ListRow({ accent, children }) {
    return (
        <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
            <span
                style={{
                    width: "18px",
                    height: "18px",
                    minWidth: "18px",
                    borderRadius: "50%",
                    background: `${accent}1A`,
                    color: accent,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "11px",
                    fontWeight: 800,
                    marginTop: "2px"
                }}
            >
                ✓
            </span>
            <span style={{ fontSize: "14px", color: "#334155", lineHeight: 1.6 }}>
                {children}
            </span>
        </div>
    );
}