import { useEffect, useRef, useState } from "react";

export default function ContactPreview() {

    const sectionRef = useRef(null);
    const [inView, setInView] = useState(false);

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
    });

    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => setInView(entry.isIntersecting),
            { threshold: 0.1, rootMargin: "-80px 0px -80px 0px" }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:8080/contact-form", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });

            const result = await response.json();

            if (!response.ok) {
                alert(result.message || "Failed to submit form");
                return;
            }

            setShowSuccess(true);

            setForm({
                name: "",
                email: "",
                phone: "",
                subject: "",
                message: ""
            });
        } catch (error) {
            console.log(error);
            alert("Server Error");
        }
    };

    const inputStyle = {
        width: "100%",
        padding: "14px 44px 14px 16px",
        borderRadius: "10px",
        border: "1px solid #E2E8F0",
        background: "#fff",
        fontSize: "14px",
        color: "#0F172A",
        outline: "none",
        boxSizing: "border-box",
        transition: "border-color .25s ease, box-shadow .25s ease"
    };

    const focusHandlers = {
        onFocus: (e) => {
            e.target.style.borderColor = "#2563EB";
            e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,.15)";
        },
        onBlur: (e) => {
            e.target.style.borderColor = "#E2E8F0";
            e.target.style.boxShadow = "none";
        }
    };

    const EASE = "cubic-bezier(.16,.9,.28,1)";

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
                    maxWidth: "1180px",
                    margin: "0 auto",
                    display: "flex",
                    alignItems: "stretch",
                    justifyContent: "space-between",
                    gap: "clamp(30px, 5vw, 60px)",
                    flexWrap: "wrap"
                }}
            >
                {/* Left Side - Info */}
                <div
                    style={{
                        flex: "1 1 400px",
                        minWidth: "300px",
                        opacity: inView ? 1 : 0,
                        transform: inView ? "translateX(0)" : "translateX(-50px)",
                        transition: `opacity .9s ${EASE}, transform .9s ${EASE}`
                    }}
                >
                    <p style={{ color: "#2563EB", fontSize: "13px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", margin: 0 }}>
                        Contact Us
                    </p>

                    <h2 style={{ margin: "12px 0 0", fontSize: "clamp(26px, 3.4vw, 36px)", fontWeight: 800, lineHeight: 1.25, color: "#0F172A" }}>
                        Let's Build Something
                        <br />
                        Amazing <span style={{ color: "#2563EB" }}>Together</span>
                    </h2>

                    {/* Contact Items */}
                    <div style={{ marginTop: "26px", display: "flex", flexDirection: "column", gap: "18px" }}>

                        <ContactItem icon={<IconPhone />} title="Call Us" delay={0.15} inView={inView} ease={EASE}>
                            +91 88668 00045
                            <br />
                            +91 75672 00045
                        </ContactItem>

                        <ContactItem icon={<IconMail />} title="E-Mail Us" delay={0.28} inView={inView} ease={EASE}>
                            dalsaniyacommercio@gmail.com
                        </ContactItem>

                        <ContactItem icon={<IconPin />} title="Address" delay={0.41} inView={inView} ease={EASE}>
                            428 Star Arcade, Opp. Sky Mall,
                            <br />
                            Sanala Road, Morbi, Gujarat,
                            <br />
                            India 363641
                        </ContactItem>

                    </div>

                    <p
                        style={{
                            marginTop: "28px",
                            fontSize: "15.5px",
                            fontWeight: 600,
                            color: "#0F172A",
                            opacity: inView ? 1 : 0,
                            transform: inView ? "translateY(0)" : "translateY(20px)",
                            transition: `opacity .8s ${EASE} .55s, transform .8s ${EASE} .55s`
                        }}
                    >
                        Have a project in mind or need expert consultation?
                    </p>

                    <p
                        style={{
                            marginTop: "10px",
                            color: "#64748B",
                            fontSize: "15px",
                            lineHeight: 1.8,
                            opacity: inView ? 1 : 0,
                            transform: inView ? "translateY(0)" : "translateY(20px)",
                            transition: `opacity .8s ${EASE} .65s, transform .8s ${EASE} .65s`
                        }}
                    >
                        Our team is here to help you transform your ideas into
                        powerful software solutions that drive business growth.
                        Contact us today and let's build something amazing
                        together.
                    </p>

                    {/* Social Icons */}
                    <div
                        style={{
                            display: "flex",
                            gap: "12px",
                            marginTop: "26px",
                            opacity: inView ? 1 : 0,
                            transform: inView ? "translateY(0)" : "translateY(20px)",
                            transition: `opacity .8s ${EASE} .75s, transform .8s ${EASE} .75s`
                        }}
                    >
                        <SocialIcon href="https://www.facebook.com/Ct-Stock-102287405540163/?ref=pages_you_manage"><IconFacebook /></SocialIcon>
                        <SocialIcon href="https://api.whatsapp.com/send?phone=918866800045"><IconWhatsapp /></SocialIcon>
                        <SocialIcon href="https://www.instagram.com/ctstock.in/"><IconInstagram /></SocialIcon>
                        <SocialIcon href="https://www.youtube.com/channel/UCpa8OHlBb7eipzHaR3vp-Tg"><IconYoutube /></SocialIcon>
                        {/* <SocialIcon href="#"><IconLinkedin /></SocialIcon> */}
                    </div>
                </div>

                {/* Right Side - Form */}
                <div
                    style={{
                        flex: "1 1 420px",
                        minWidth: "300px",
                        opacity: inView ? 1 : 0,
                        transform: inView ? "translateX(0) scale(1)" : "translateX(50px) scale(.97)",
                        transition: `opacity .9s ${EASE} .15s, transform .9s ${EASE} .15s`
                    }}
                >
                    <form
                        onSubmit={handleSubmit}
                        style={{
                            background: "linear-gradient(180deg,#EAF2FF,#DCEBFF)",
                            border: "1px solid #D3E3FE",
                            borderRadius: "20px",
                            padding: "clamp(26px, 3vw, 36px)",
                            boxSizing: "border-box"
                        }}
                    >
                        <h3 style={{ margin: 0, fontSize: "clamp(20px, 2.2vw, 24px)", fontWeight: 800, color: "#0F172A" }}>
                            Send Us Message
                        </h3>

                        <p style={{ marginTop: "8px", color: "#475569", fontSize: "14.5px", lineHeight: 1.7 }}>
                            Fill out the form below and our team will get back to you
                            as soon as possible.
                        </p>

                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                                gap: "16px",
                                marginTop: "26px"
                            }}
                        >
                            <FieldWrap icon={<IconUser />}>
                                <input type="text" name="name" placeholder="Your Name" value={form.name} onChange={handleChange} style={inputStyle} {...focusHandlers} />
                            </FieldWrap>

                            <FieldWrap icon={<IconMailSmall />}>
                                <input type="email" name="email" placeholder="Your Email" value={form.email} onChange={handleChange} style={inputStyle} {...focusHandlers} />
                            </FieldWrap>

                            <FieldWrap icon={<IconPhoneSmall />}>
                                <input type="text" name="phone" placeholder="Your Phone" value={form.phone} onChange={handleChange} style={inputStyle} {...focusHandlers} />
                            </FieldWrap>

                            <FieldWrap icon={<IconDoc />}>
                                <input type="text" name="subject" placeholder="Subject" value={form.subject} onChange={handleChange} style={inputStyle} {...focusHandlers} />
                            </FieldWrap>
                        </div>

                        <div style={{ marginTop: "16px", position: "relative" }}>
                            <textarea
                                name="message"
                                placeholder="Your Message"
                                rows={6}
                                value={form.message}
                                onChange={handleChange}
                                style={{ ...inputStyle, resize: "vertical", minHeight: "140px", paddingRight: "16px" }}
                                {...focusHandlers}
                            />
                            <span style={{ position: "absolute", top: "14px", right: "16px", color: "#94A3B8", pointerEvents: "none" }}>
                                <IconChat />
                            </span>
                        </div>

                        <button
                            type="submit"
                            style={{
                                marginTop: "22px",
                                width: "100%",
                                background: "linear-gradient(90deg,#2563EB,#3B82F6)",
                                color: "#fff",
                                border: "none",
                                padding: "15px",
                                borderRadius: "10px",
                                fontSize: "15.5px",
                                fontWeight: 700,
                                cursor: "pointer",
                                boxShadow: "0 12px 24px -10px rgba(37,99,235,.7)",
                                transition: "transform .25s ease, box-shadow .25s ease"
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "translateY(-3px)";
                                e.currentTarget.style.boxShadow = "0 16px 28px -8px rgba(37,99,235,.8)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "0 12px 24px -10px rgba(37,99,235,.7)";
                            }}
                        >
                            Send Message
                        </button>
                    </form>
                </div>
            </div>

            {/* Full Width Map */}
            <div
                style={{
                    maxWidth: "1180px",
                    margin: "50px auto 0",
                    borderRadius: "20px",
                    overflow: "hidden",
                    border: "1px solid #E2E8F0",
                    boxShadow: "0 20px 45px -22px rgba(15,23,42,.2)",
                    opacity: inView ? 1 : 0,
                    transform: inView ? "translateY(0)" : "translateY(40px)",
                    transition: `opacity 1s ${EASE} .3s, transform 1s ${EASE} .3s`
                }}
            >
                <iframe
                    title="CT Stock Morbi Location"
                    src="https://www.google.com/maps?q=CT+Stock+Morbi&output=embed"
                    width="100%"
                    height="420"
                    style={{ border: 0, display: "block" }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                />
            </div>

            {showSuccess && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: "rgba(0,0,0,.45)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 9999
                    }}
                >
                    <div
                        style={{
                            background: "#fff",
                            padding: "35px",
                            borderRadius: "18px",
                            width: "350px",
                            textAlign: "center",
                            boxShadow: "0 20px 60px rgba(0,0,0,.25)"
                        }}
                    >
                        <div style={{ fontSize: "55px", color: "#16A34A" }}>✓</div>
                        <h2>Success</h2>
                        <p>Your enquiry has been submitted successfully.</p>
                        <button
                            onClick={() => setShowSuccess(false)}
                            style={{
                                marginTop: "20px",
                                padding: "12px 30px",
                                border: "none",
                                background: "#2563EB",
                                color: "#fff",
                                borderRadius: "8px",
                                cursor: "pointer"
                            }}
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}

/* ---------- helpers ---------- */

function ContactItem({ icon, title, children, delay, inView, ease }) {
    const [hover, setHover] = useState(false);

    return (
        <div
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "14px",
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(20px)",
                transition: `opacity .7s ${ease} ${delay}s, transform .7s ${ease} ${delay}s`
            }}
        >
            <div
                style={{
                    width: "38px",
                    height: "38px",
                    minWidth: "38px",
                    borderRadius: "50%",
                    background: "#2563EB",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    transform: hover ? "scale(1.1)" : "scale(1)",
                    boxShadow: hover
                        ? "0 8px 18px -4px rgba(37,99,235,.55)"
                        : "0 6px 14px -6px rgba(37,99,235,.4)",
                    transition: "transform .25s ease, box-shadow .25s ease"
                }}
            >
                {icon}
            </div>
            <div>
                <p style={{ margin: 0, fontWeight: 700, fontSize: "14.5px", color: "#0F172A" }}>{title}</p>
                <p style={{ margin: "4px 0 0", fontSize: "14px", color: "#64748B", lineHeight: 1.6 }}>{children}</p>
            </div>
        </div>
    );
}

function FieldWrap({ icon, children }) {
    return (
        <div style={{ position: "relative" }}>
            {children}
            <span
                style={{
                    position: "absolute",
                    top: "50%",
                    right: "14px",
                    transform: "translateY(-50%)",
                    color: "#94A3B8",
                    pointerEvents: "none",
                    display: "flex"
                }}
            >
                {icon}
            </span>
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
                width: "38px",
                height: "38px",
                borderRadius: "50%",
                background: hover ? "#2563EB" : "#0F172A",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                transform: hover ? "translateY(-3px)" : "translateY(0)",
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
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.68 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.32 1.85.55 2.81.68A2 2 0 0 1 22 16.92Z" />
        </svg>
    );
}

function IconMail() {
    return (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 6-10 7L2 6" />
        </svg>
    );
}

function IconPin() {
    return (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
        </svg>
    );
}

function IconUser() {
    return (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    );
}

function IconMailSmall() {
    return (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 6-10 7L2 6" />
        </svg>
    );
}

function IconPhoneSmall() {
    return (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.68 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.32 1.85.55 2.81.68A2 2 0 0 1 22 16.92Z" />
        </svg>
    );
}

function IconDoc() {
    return (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
            <path d="M14 2v6h6" />
        </svg>
    );
}

function IconChat() {
    return (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" />
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

function IconLinkedin() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.28 2.38 4.28 5.47v6.27ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z"/>
        </svg>
    );
}