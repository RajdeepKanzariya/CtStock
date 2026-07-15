import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/* ==========================================================
   THEME — change colors for the whole Hero from right here.
   Nothing else in this file needs to be touched.
========================================================== */
const THEME = {
    background: "#FFFFFF",

    blobColor1: "rgba(37,99,235,.16)",
    blobColor2: "rgba(56,189,248,.14)",

    dotColor: "rgba(37,99,235,.32)",
    dotColorFaint: "rgba(37,99,235,.15)",

    badgeBg: "rgba(37,99,235,.08)",
    badgeBorder: "rgba(37,99,235,.25)",
    badgeText: "#2563EB",
    badgeDot: "#2563EB",
    badgeDotGlow: "rgba(37,99,235,.5)",

    headingText: "#0F172A",
    headingGradientFrom: "#2563EB",
    headingGradientTo: "#38BDF8",

    paragraphText: "#475569",

    primaryBtnBg: "linear-gradient(90deg,#2563EB,#3B82F6)",
    primaryBtnText: "#FFFFFF",
    primaryBtnShadow: "rgba(37,99,235,.5)",
    primaryBtnShadowHover: "rgba(37,99,235,.6)",

    secondaryBtnBg: "rgba(15,23,42,.03)",
    secondaryBtnBgHover: "rgba(15,23,42,.06)",
    secondaryBtnText: "#334155",
    secondaryBtnBorder: "rgba(15,23,42,.15)"
};

export default function Hero() {

    const navigate = useNavigate();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setMounted(true), 80);
        return () => clearTimeout(timer);
    }, []);

    return (
        <section
            style={{
                position: "relative",
                width: "100%",
                minHeight: "calc(100vh - 78px)",
                background: THEME.background,
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxSizing: "border-box",
                padding: "clamp(60px, 8vw, 100px) 6%"
            }}
        >
            <style>{`
                @keyframes floatDots {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-20px); }
                }
                @keyframes pulseBlob {
                    0%, 100% { transform: scale(1); opacity: .9; }
                    50% { transform: scale(1.08); opacity: 1; }
                }
                @media (max-width: 900px) {
                    .hero-side-decor { display: none !important; }
                }
            `}</style>

            {/* ---------- Left diagonal dot strip ---------- */}
            <div
                className="hero-side-decor"
                style={{
                    position: "absolute",
                    left: "clamp(0px, 4vw, 60px)",
                    top: "50%",
                    transform: "translateY(-50%)"
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%,-50%)",
                        width: "220px",
                        height: "220px",
                        borderRadius: "50%",
                        background: THEME.blobColor1,
                        filter: "blur(60px)",
                        animation: "pulseBlob 5s ease-in-out infinite"
                    }}
                />
                <div style={{ position: "relative", animation: "floatDots 6.5s ease-in-out infinite" }}>
                    <DiagonalDotStrip color={THEME.dotColor} faint={THEME.dotColorFaint} />
                </div>
            </div>

            {/* ---------- Right diagonal dot strip ---------- */}
            <div
                className="hero-side-decor"
                style={{
                    position: "absolute",
                    right: "clamp(0px, 4vw, 60px)",
                    top: "50%",
                    transform: "translateY(-50%)"
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%,-50%)",
                        width: "220px",
                        height: "220px",
                        borderRadius: "50%",
                        background: THEME.blobColor2,
                        filter: "blur(60px)",
                        animation: "pulseBlob 6s ease-in-out infinite"
                    }}
                />
                <div style={{ position: "relative", animation: "floatDots 7.5s ease-in-out infinite" }}>
                    <DiagonalDotStrip color={THEME.dotColor} faint={THEME.dotColorFaint} mirrored />
                </div>
            </div>

            {/* ---------- Center content ---------- */}
            <div
                style={{
                    position: "relative",
                    zIndex: 1,
                    maxWidth: "720px",
                    width: "100%",
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? "translateY(0)" : "translateY(28px)",
                    transition: "opacity .9s cubic-bezier(.16,.9,.28,1), transform .9s cubic-bezier(.16,.9,.28,1)"
                }}
            >
                <div
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        background: THEME.badgeBg,
                        border: `1px solid ${THEME.badgeBorder}`,
                        color: THEME.badgeText,
                        padding: "7px 16px",
                        borderRadius: "999px",
                        fontSize: "13px",
                        fontWeight: "600",
                        letterSpacing: ".3px",
                        marginBottom: "26px"
                    }}
                >
                    <span
                        style={{
                            width: "7px",
                            height: "7px",
                            borderRadius: "50%",
                            background: THEME.badgeDot,
                            boxShadow: `0 0 8px 2px ${THEME.badgeDotGlow}`
                        }}
                    />
                    Empowering Business Since 1996
                </div>

                <h1
                    style={{
                        fontSize: "clamp(26px, 4.6vw, 46px)",
                        fontWeight: 800,
                        lineHeight: 1.2,
                        letterSpacing: "-1px",
                        margin: 0,
                        color: THEME.headingText
                    }}
                >
                    About CtStock
                    <br />
                    <span
                        style={{
                            background: `linear-gradient(90deg,${THEME.headingGradientFrom},${THEME.headingGradientTo})`,
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text"
                        }}
                    >
                    </span>
                </h1>

                <p
                    style={{
                        marginTop: "24px",
                        color: THEME.paragraphText,
                        fontSize: "clamp(15px, 1.4vw, 18px)",
                        lineHeight: 1.85,
                        maxWidth: "100%"
                    }}
                >
                    Since 1996, CtStock has been delivering reliable and industry-focused stock management software, earning the trust of businesses across the ceramic industry. Over the years, our solutions have expanded to serve a wide range of manufacturing sectors, including Polypack, Paper Mills, Laminates, Sanitaryware, Decorative Products, Plastic Industries, Louvers, Wood, Frames, Acrylic, and many more.
                    Our mission is to simplify inventory management with software that is easy to learn, simple to operate, and powerful enough to meet the needs of businesses of every size. With multi-product capabilities, flexible customization, and continuous innovation, CtStock helps organizations manage their operations efficiently while staying prepared for future growth. We believe that technology should make business easier—not more complicated.
                </p>

                <div style={{ display: "flex", gap: "16px", marginTop: "38px", flexWrap: "wrap", justifyContent: "center" }}>

                    <button
                        onClick={() => navigate("/enquiry")}
                        style={{
                            background: THEME.primaryBtnBg,
                            color: THEME.primaryBtnText,
                            border: "none",
                            padding: "15px 30px",
                            borderRadius: "10px",
                            cursor: "pointer",
                            fontSize: "15.5px",
                            fontWeight: 600,
                            boxShadow: `0 10px 25px -8px ${THEME.primaryBtnShadow}`,
                            transition: "transform .25s ease, box-shadow .25s ease"
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-3px)";
                            e.currentTarget.style.boxShadow = `0 14px 30px -6px ${THEME.primaryBtnShadowHover}`;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = `0 10px 25px -8px ${THEME.primaryBtnShadow}`;
                        }}
                    >
                        Get Demo →
                    </button>

                    <button
                        onClick={() => navigate("/products")}
                        style={{
                            background: THEME.secondaryBtnBg,
                            color: THEME.secondaryBtnText,
                            border: `1px solid ${THEME.secondaryBtnBorder}`,
                            padding: "15px 30px",
                            borderRadius: "10px",
                            cursor: "pointer",
                            fontSize: "15.5px",
                            fontWeight: 500,
                            transition: "background .25s ease, transform .25s ease"
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = THEME.secondaryBtnBgHover;
                            e.currentTarget.style.transform = "translateY(-3px)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = THEME.secondaryBtnBg;
                            e.currentTarget.style.transform = "translateY(0)";
                        }}
                    >
                        Explore Products
                    </button>

                </div>
            </div>
        </section>
    );
}

/* ---------- tall diagonal dot strip (fills side height nicely) ---------- */
function DiagonalDotStrip({ color, faint, mirrored }) {
    const dots = [];
    const rows = 12;
    const cols = 3;
    const spacing = 20;
    const diagonalShift = 10; // shifts each row sideways to create the diagonal feel

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const isAccent = (r + c) % 3 === 0;
            const xShift = mirrored ? -r * diagonalShift * 0.15 : r * diagonalShift * 0.15;
            dots.push(
                <circle
                    key={`${r}-${c}`}
                    cx={c * spacing + 10 + xShift}
                    cy={r * spacing + 10}
                    r={isAccent ? 3.2 : 2.1}
                    fill={isAccent ? color : faint}
                />
            );
        }
    }

    const width = cols * spacing + 20;
    const height = rows * spacing + 10;

    return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            {dots}
        </svg>
    );
}