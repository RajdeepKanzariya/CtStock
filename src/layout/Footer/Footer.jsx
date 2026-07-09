import { useEffect, useRef, useState } from "react";
import logo from "../../assets/ctstockLogo.jpg";

export default function Footer() {

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

    const fadeUp = (delay) => ({
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(35px)",
        transition: `opacity .9s ${EASE} ${delay}s, transform .9s ${EASE} ${delay}s`
    });

    return (
        <footer
            ref={sectionRef}
            style={{
                width: "100%",
                background: "linear-gradient(160deg,#0B1120 0%,#111A2E 60%,#0B1120 100%)",
                color: "#fff",
                boxSizing: "border-box",
                overflow: "hidden"
            }}
        >
            <div
                style={{
                    maxWidth: "1200px",
                    margin: "0 auto",
                    padding: "clamp(50px, 6vw, 70px) 6% 40px",
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                    gap: "clamp(30px, 4vw, 50px)"
                }}
            >
                {/* Brand Column */}
                <div style={fadeUp(0.05)}>
                    <img
                        src={logo}
                        alt="CT Stock Logo"
                        style={{ height: "38px", width: "auto", display: "block" }}
                    />

                    <p style={{ marginTop: "18px", color: "#94A3B8", fontSize: "13.5px", lineHeight: 1.8, maxWidth: "230px" }}>
                        Building Smarter Businesses
                        <br />
                        Through Innovative Software.
                    </p>

                    <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
                        <SocialIcon href="https://www.facebook.com/Ct-Stock-102287405540163/?ref=pages_you_manage"><IconFacebook /></SocialIcon>
                        <SocialIcon href="https://api.whatsapp.com/send?phone=918866800045"><IconWhatsapp /></SocialIcon>
                        <SocialIcon href="https://www.instagram.com/ctstock.in/"><IconInstagram /></SocialIcon>
                        <SocialIcon href="https://www.youtube.com/channel/UCpa8OHlBb7eipzHaR3vp-Tg"><IconYoutube /></SocialIcon>
                    </div>

                    <div style={{ marginTop: "22px", display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{ display: "flex", gap: "2px", color: "#FBBF24" }}>
                            {Array.from({ length: 5 }).map((_, i) => (
                                <IconStar key={i} />
                            ))}
                        </div>
                        <span style={{ fontSize: "13px", color: "#94A3B8", fontWeight: 500 }}>
                            Trusted by 500+ Businesses
                        </span>
                    </div>
                </div>

                {/* About Column */}
                <div style={{ ...fadeUp(0.18), display: "flex", flexDirection: "column", gap: "16px" }}>
                    <p style={{ margin: 0, color: "#94A3B8", fontSize: "13.5px", lineHeight: 1.85 }}>
                        CT Stock is a trusted software development company delivering
                        innovative ERP, Inventory, CRM and business automation
                        solutions for modern industries.
                    </p>
                    <p style={{ margin: 0, color: "#94A3B8", fontSize: "13.5px", lineHeight: 1.85 }}>
                        Our mission is to simplify complex business operations
                        through technology, helping organizations increase
                        efficiency, reduce costs and make smarter decisions.
                    </p>
                    <p style={{ margin: 0, color: "#94A3B8", fontSize: "13.5px", lineHeight: 1.85 }}>
                        From manufacturing and packaging to ceramic, retail and
                        distribution, our customized software solutions are
                        designed to grow with your business.
                    </p>
                </div>

                {/* Contact Column */}
                <div style={{ ...fadeUp(0.3), display: "flex", flexDirection: "column", gap: "18px" }}>
                    <ContactLine icon={<IconPhone />} label="Contact Number">
                        +91 88668 00045
                        <br />
                        +91 75672 00045
                    </ContactLine>

                    <ContactLine icon={<IconMail />} label="E-Mail">
                        dalsaniyacommercio@gmail.com
                    </ContactLine>

                    <ContactLine icon={<IconPin />} label="Address">
                        428 Star Arcade, Opp. Sky Mall,
                        <br />
                        Sanala Road, Morbi, Gujarat,
                        <br />
                        India 363641
                    </ContactLine>
                </div>
            </div>

            {/* Bottom bar */}
            <div
                style={{
                    borderTop: "1px solid rgba(255,255,255,.08)",
                    padding: "18px 6%",
                    ...fadeUp(0.45)
                }}
            >
                <p
                    style={{
                        margin: 0,
                        textAlign: "center",
                        fontSize: "12.5px",
                        color: "#64748B"
                    }}
                >
                    © {new Date().getFullYear()} CT Stock. All rights reserved.
                </p>
            </div>
        </footer>
    );
}

/* ---------- helpers ---------- */

function ContactLine({ icon, label, children }) {
    const [hover, setHover] = useState(false);
    return (
        <div
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "10px"
            }}
        >
            <span
                style={{
                    color: hover ? "#38BDF8" : "#60A5FA",
                    marginTop: "2px",
                    transform: hover ? "scale(1.15)" : "scale(1)",
                    transition: "all .25s ease"
                }}
            >
                {icon}
            </span>
            <div>
                <p style={{ margin: 0, fontWeight: 600, fontSize: "13.5px", color: hover ? "#38BDF8" : "#fff", transition: "color .25s ease" }}>
                    {label}
                </p>
                <p style={{ margin: "3px 0 0", fontSize: "13px", color: "#94A3B8", lineHeight: 1.7 }}>
                    {children}
                </p>
            </div>
        </div>
    );
}

function SocialIcon({ href, children }) {
    const [hover, setHover] = useState(false);
    return (
        <a
            href={href}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: hover ? "#2563EB" : "rgba(255,255,255,.06)",
                border: "1px solid rgba(255,255,255,.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                transform: hover ? "translateY(-4px)" : "translateY(0)",
                boxShadow: hover ? "0 10px 20px -6px rgba(37,99,235,.6)" : "none",
                transition: "all .25s ease",
                textDecoration: "none"
            }}
        >
            {children}
        </a>
    );
}

/* ---------- icons ---------- */

function IconPhone() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.68 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.32 1.85.55 2.81.68A2 2 0 0 1 22 16.92Z" />
        </svg>
    );
}

function IconMail() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 6-10 7L2 6" />
        </svg>
    );
}

function IconPin() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
        </svg>
    );
}

function IconStar() {
    return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
            <path d="m12 2 2.9 6.6L22 9.3l-5 4.8L18.2 22 12 18.3 5.8 22 7 14.1l-5-4.8 7.1-.7Z" />
        </svg>
    );
}

function IconFacebook() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12Z" />
        </svg>
    );
}

function IconWhatsapp() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm0 18.2a8.1 8.1 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.6.1s-.6.8-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-2-1.2 7.4 7.4 0 0 1-1.4-1.7c-.1-.2 0-.4.1-.5l.4-.5c.1-.2.2-.3.2-.5s0-.4-.1-.5-.6-1.5-.9-2c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2c0 1.3.9 2.6 1.1 2.8s1.7 2.7 4.2 3.7a13.4 13.4 0 0 0 1.4.5 3.3 3.3 0 0 0 1.5.1c.5-.1 1.4-.6 1.6-1.1s.2-1 .1-1.1-.2-.2-.4-.3Z" />
        </svg>
    );
}

function IconInstagram() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        </svg>
    );
}

function IconYoutube() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23 12s0-3.6-.5-5.2a3 3 0 0 0-2.1-2.1C18.8 4.2 12 4.2 12 4.2s-6.8 0-8.4.5A3 3 0 0 0 1.5 6.8C1 8.4 1 12 1 12s0 3.6.5 5.2a3 3 0 0 0 2.1 2.1c1.6.5 8.4.5 8.4.5s6.8 0 8.4-.5a3 3 0 0 0 2.1-2.1c.5-1.6.5-5.2.5-5.2Z" fill="none" stroke="currentColor" strokeWidth="2"/>
            <path d="m9.8 15.3 5.5-3.3-5.5-3.3v6.6Z" />
        </svg>
    );
}