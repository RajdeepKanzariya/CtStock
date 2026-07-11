import { useState, useEffect } from "react";

import slider1 from "../../assets/sliderimg1.png";
import slider2 from "../../assets/sliderimg2.png";

const THEME = {
    background: "#FFFFFF",
    glowColor1: "rgba(37,99,235,.14)",
    glowColor2: "rgba(14,165,233,.10)",

    badgeBg: "rgba(37,99,235,.08)",
    badgeBorder: "rgba(37,99,235,.25)",
    badgeText: "#2563EB",
    badgeDot: "#2563EB",
    badgeDotGlow: "rgba(37,99,235,.5)",

    headingText: "#0F172A",
    headingGradientFrom: "#2563EB",
    headingGradientTo: "#38BDF8",
    subHeadingText: "#334155",

    paragraphText: "#475569",

    primaryBtnBg: "linear-gradient(90deg,#2563EB,#3B82F6)",
    primaryBtnText: "#FFFFFF",
    primaryBtnShadow: "rgba(37,99,235,.5)",
    primaryBtnShadowHover: "rgba(37,99,235,.6)",

    secondaryBtnBg: "rgba(15,23,42,.03)",
    secondaryBtnBgHover: "rgba(15,23,42,.06)",
    secondaryBtnText: "#334155",
    secondaryBtnBorder: "rgba(15,23,42,.15)",

    sliderGlow: "linear-gradient(135deg,#2563EB,#38BDF8)",
    sliderBorder: "rgba(15,23,42,.1)",
    sliderShadow: "rgba(15,23,42,.25)",
    sliderSheen: "linear-gradient(180deg, rgba(255,255,255,.35), transparent 30%)",

    dotActive: "linear-gradient(90deg,#3B82F6,#38BDF8)",
    dotInactive: "rgba(15,23,42,.2)"
};

export default function Hero() {

    const images = [slider1, slider2];
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % images.length);
        }, 4000);
        return () => clearInterval(interval);
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
                boxSizing: "border-box",
                padding: "clamp(60px, 8vw, 100px) 6%"
            }}
        >
            {/* decorative glow blobs */}
            <div
                style={{
                    position: "absolute",
                    top: "-120px",
                    right: "-120px",
                    width: "380px",
                    height: "380px",
                    borderRadius: "50%",
                    background: THEME.glowColor1,
                    filter: "blur(90px)",
                    pointerEvents: "none"
                }}
            />
            <div
                style={{
                    position: "absolute",
                    bottom: "-140px",
                    left: "-100px",
                    width: "320px",
                    height: "320px",
                    borderRadius: "50%",
                    background: THEME.glowColor2,
                    filter: "blur(100px)",
                    pointerEvents: "none"
                }}
            />

            <div
                style={{
                    position: "relative",
                    width: "100%",
                    maxWidth: "1280px",
                    margin: "0 auto",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "clamp(30px, 5vw, 70px)",
                    flexWrap: "wrap"
                }}
            >
                {/* Left Side */}
                <div style={{ flex: "1 1 420px", minWidth: "320px", color: THEME.headingText }}>

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
                        We'd Love To Hear From You
                    </div>

                    <h1
                        style={{
                            fontSize: "clamp(34px, 4.6vw, 56px)",
                            fontWeight: 800,
                            lineHeight: 1.15,
                            letterSpacing: "-1px",
                            margin: 0,
                            color: THEME.headingText
                        }}
                    >
                        Get In{" "}
                        <span
                            style={{
                                background: `linear-gradient(90deg,${THEME.headingGradientFrom},${THEME.headingGradientTo})`,
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text"
                            }}
                        >
                            Touch
                        </span>
                        <br />
                        <span style={{ fontSize: "clamp(20px, 2.6vw, 30px)", fontWeight: 700, color: THEME.subHeadingText }}>
                            Have A Question Or Need A Quote?
                            <br />
                            We're Here To Help
                        </span>
                    </h1>

                    <p
                        style={{
                            marginTop: "24px",
                            color: THEME.paragraphText,
                            fontSize: "clamp(15px, 1.4vw, 18px)",
                            lineHeight: 1.85,
                            maxWidth: "520px"
                        }}
                    >
                        Reach out to our team for product inquiries, demo requests,
                        or support. We usually respond within 24 hours and are happy
                        to help you find the right solution for your business.
                    </p>

                    <div style={{ display: "flex", gap: "16px", marginTop: "38px", flexWrap: "wrap" }}>

                        {/* <button
                            style={{
                                background: "linear-gradient(90deg,#2563EB,#3B82F6)",
                                color: "#fff",
                                border: "none",
                                padding: "15px 30px",
                                borderRadius: "10px",
                                cursor: "pointer",
                                fontSize: "15.5px",
                                fontWeight: 600,
                                boxShadow: "0 10px 25px -8px rgba(37,99,235,.7)",
                                transition: "transform .25s ease, box-shadow .25s ease"
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "translateY(-3px)";
                                e.currentTarget.style.boxShadow = "0 14px 30px -6px rgba(37,99,235,.85)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "0 10px 25px -8px rgba(37,99,235,.7)";
                            }}
                        >
                            Get Demo →
                        </button> */}

                        <button
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

                {/* Right Side - Slider */}
                <div style={{ flex: "1 1 420px", minWidth: "320px", display: "flex", justifyContent: "center" }}>

                    <div
                        style={{
                            position: "relative",
                            width: "100%",
                            maxWidth: "620px"
                        }}
                    >
                        {/* gradient glow frame behind image */}
                        <div
                            style={{
                                position: "absolute",
                                inset: "-14px",
                                borderRadius: "26px",
                                background: THEME.sliderGlow,
                                opacity: 0.35,
                                filter: "blur(26px)",
                                zIndex: 0
                            }}
                        />

                        <div
                            style={{
                                position: "relative",
                                width: "100%",
                                aspectRatio: "4 / 3",
                                borderRadius: "20px",
                                overflow: "hidden",
                                border: `1px solid ${THEME.sliderBorder}`,
                                boxShadow: `0 30px 70px -20px ${THEME.sliderShadow}`,
                                zIndex: 1
                            }}
                        >
                            {images.map((img, index) => (
                                <img
                                    key={index}
                                    src={img}
                                    alt={"slider-" + index}
                                    style={{
                                        position: "absolute",
                                        inset: 0,
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        opacity: index === current ? 1 : 0,
                                        transform:
                                            index === current
                                                ? "scale(1)"
                                                : "scale(1.08)",
                                        transition: "opacity 1.1s ease, transform 1.4s ease"
                                    }}
                                />
                            ))}

                            {/* subtle top sheen */}
                            <div
                                style={{
                                    position: "absolute",
                                    inset: 0,
                                    background: THEME.sliderSheen,
                                    pointerEvents: "none"
                                }}
                            />

                            {/* dots */}
                            <div
                                style={{
                                    position: "absolute",
                                    bottom: "18px",
                                    left: "50%",
                                    transform: "translateX(-50%)",
                                    display: "flex",
                                    gap: "9px",
                                    zIndex: 2
                                }}
                            >
                                {images.map((_, index) => (
                                    <span
                                        key={index}
                                        onClick={() => setCurrent(index)}
                                        style={{
                                            width: current === index ? "26px" : "8px",
                                            height: "8px",
                                            borderRadius: "50px",
                                            background:
                                                current === index
                                                    ? THEME.dotActive
                                                    : THEME.dotInactive,
                                            cursor: "pointer",
                                            transition: ".35s"
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}