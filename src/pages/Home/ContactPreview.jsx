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

            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify(form),

        });

        const result = await response.json();

        if (response.ok) {

            console.log(result);

            setShowSuccess(true);

            setForm({
                name: "",
                email: "",
                phone: "",
                subject: "",
                message: ""
            });

        } else {

            alert(result.message);

        }

    }
    catch (error) {

        console.log(error);

        alert("Server Error");

    }

};

    const inputStyle = {
        width: "100%",
        padding: "13px 16px",
        borderRadius: "10px",
        border: "1px solid #E2E8F0",
        background: "#F8FAFC",
        fontSize: "14px",
        color: "#0F172A",
        outline: "none",
        boxSizing: "border-box",
        transition: "border-color .25s ease, box-shadow .25s ease, background .25s ease"
    };

    const focusHandlers = {
        onFocus: (e) => {
            e.target.style.borderColor = "#2563EB";
            e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,.15)";
            e.target.style.background = "#fff";
        },
        onBlur: (e) => {
            e.target.style.borderColor = "#E2E8F0";
            e.target.style.boxShadow = "none";
            e.target.style.background = "#F8FAFC";
        }
    };

    const EASE = "cubic-bezier(.16,.9,.28,1)";

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
                    maxWidth: "1180px",
                    margin: "0 auto",
                    textAlign: "center",
                    opacity: inView ? 1 : 0,
                    transform: inView ? "translateY(0)" : "translateY(55px)",
                    transition: `opacity 1.1s ${EASE}, transform 1.1s ${EASE}`
                }}
            >
                <p style={{ color: "#2563EB", fontSize: "13px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", margin: 0 }}>
                    Get In Touch
                </p>
                <h2 style={{ margin: "10px 0 0", fontSize: "clamp(28px, 3.6vw, 40px)", fontWeight: 800, color: "#0F172A" }}>
                    Let's Build Something <span style={{ color: "#2563EB" }}>Amazing Together</span>
                </h2>
                <p style={{ margin: "14px auto 0", maxWidth: "560px", color: "#64748B", fontSize: "15px", lineHeight: 1.8 }}>
                    Have a project in mind or need expert consultation? Contact us
                    today and let's turn your ideas into powerful business solutions.
                </p>
            </div>

            {/* Unified Card */}
            <div
                style={{
                    maxWidth: "1180px",
                    margin: "50px auto 0",
                    display: "flex",
                    flexWrap: "wrap",
                    borderRadius: "24px",
                    overflow: "hidden",
                    boxShadow: "0 30px 70px -30px rgba(15,23,42,.25)",
                    opacity: inView ? 1 : 0,
                    transform: inView ? "translateY(0) scale(1)" : "translateY(80px) scale(.94)",
                    transition: `opacity 1.3s ${EASE} .25s, transform 1.3s ${EASE} .25s`
                }}
            >
                {/* Left Panel - dark gradient info */}
                <div
                    style={{
                        flex: "1 1 380px",
                        minWidth: "300px",
                        background: "linear-gradient(160deg,#0B1120 0%,#152140 60%,#0B1120 100%)",
                        color: "#fff",
                        padding: "clamp(32px, 4vw, 46px)",
                        boxSizing: "border-box",
                        position: "relative",
                        overflow: "hidden"
                    }}
                >
                    <div
                        style={{
                            position: "absolute",
                            top: "-80px",
                            right: "-80px",
                            width: "220px",
                            height: "220px",
                            borderRadius: "50%",
                            background: "rgba(37,99,235,.25)",
                            filter: "blur(70px)",
                            pointerEvents: "none"
                        }}
                    />

                    <h3
                        style={{
                            margin: 0,
                            fontSize: "clamp(20px, 2.2vw, 24px)",
                            fontWeight: 800,
                            position: "relative",
                            opacity: inView ? 1 : 0,
                            transform: inView ? "translateY(0)" : "translateY(25px)",
                            transition: `opacity .9s ${EASE} .4s, transform .9s ${EASE} .4s`
                        }}
                    >
                        Contact Information
                    </h3>
                    <p
                        style={{
                            marginTop: "8px",
                            color: "#94A3B8",
                            fontSize: "14px",
                            lineHeight: 1.7,
                            position: "relative",
                            opacity: inView ? 1 : 0,
                            transform: inView ? "translateY(0)" : "translateY(25px)",
                            transition: `opacity .9s ${EASE} .5s, transform .9s ${EASE} .5s`
                        }}
                    >
                        Reach out through any channel below, we usually respond
                        within a few hours.
                    </p>

                    <div style={{ marginTop: "30px", display: "flex", flexDirection: "column", gap: "22px", position: "relative" }}>

                        <ContactRow icon={<IconPhone />} title="Call Us" delay={0.65} inView={inView} ease={EASE}>
                            +91 88668 00045
                            <br />
                            +91 75672 00045
                        </ContactRow>

                        <ContactRow icon={<IconMail />} title="E-Mail Us" delay={0.8} inView={inView} ease={EASE}>
                            dalsaniyacommercio@gmail.com
                        </ContactRow>

                        <ContactRow icon={<IconPin />} title="Address" delay={0.95} inView={inView} ease={EASE}>
                            428 Star Arcade, Opp. Sky Mall,
                            <br />
                            Sanala Road, Morbi, Gujarat,
                            <br />
                            India 363641
                        </ContactRow>

                    </div>

                    {/* Map */}
                    <div
                        style={{
                            marginTop: "32px",
                            borderRadius: "14px",
                            overflow: "hidden",
                            border: "1px solid rgba(255,255,255,.12)",
                            position: "relative",
                            opacity: inView ? 1 : 0,
                            transform: inView ? "translateY(0)" : "translateY(35px)",
                            transition: `opacity 1s ${EASE} 1.15s, transform 1s ${EASE} 1.15s, border-color .3s ease`
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(56,189,248,.5)")}
                        onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,.12)")}
                    >
                        <iframe
                            title="CT Stock Morbi Location"
                            src="https://www.google.com/maps?q=CT+Stock+Morbi&output=embed"
                            width="100%"
                            height="200"
                            style={{ border: 0, display: "block", filter: "grayscale(15%) contrast(1.05)" }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>
                </div>

                {/* Right Panel - form */}
                <div
                    style={{
                        flex: "1 1 420px",
                        minWidth: "300px",
                        background: "#fff",
                        padding: "clamp(32px, 4vw, 46px)",
                        boxSizing: "border-box"
                    }}
                >
                    <h3
                        style={{
                            margin: 0,
                            fontSize: "clamp(20px, 2.2vw, 24px)",
                            fontWeight: 800,
                            color: "#0F172A",
                            opacity: inView ? 1 : 0,
                            transform: inView ? "translateY(0)" : "translateY(25px)",
                            transition: `opacity .9s ${EASE} .45s, transform .9s ${EASE} .45s`
                        }}
                    >
                        Send Us a Message
                    </h3>
                    <p
                        style={{
                            marginTop: "8px",
                            color: "#64748B",
                            fontSize: "14px",
                            lineHeight: 1.7,
                            opacity: inView ? 1 : 0,
                            transform: inView ? "translateY(0)" : "translateY(25px)",
                            transition: `opacity .9s ${EASE} .55s, transform .9s ${EASE} .55s`
                        }}
                    >
                        Fill out the form below and our team will get back to you
                        as soon as possible.
                    </p>

                    <form
                        onSubmit={handleSubmit}
                        style={{
                            marginTop: "26px",
                            opacity: inView ? 1 : 0,
                            transform: inView ? "translateY(0)" : "translateY(35px)",
                            transition: `opacity 1s ${EASE} .7s, transform 1s ${EASE} .7s`
                        }}
                    >

                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px" }}>
                            <div>
                                <FieldLabel>Your Name</FieldLabel>
                                <input type="text" name="name" placeholder="Your Name" value={form.name} onChange={handleChange} style={inputStyle} {...focusHandlers} />
                            </div>
                            <div>
                                <FieldLabel>Your Email</FieldLabel>
                                <input type="email" name="email" placeholder="Your Email" value={form.email} onChange={handleChange} style={inputStyle} {...focusHandlers} />
                            </div>
                            <div>
                                <FieldLabel>Your Phone</FieldLabel>
                                <input type="text" name="phone" placeholder="Your Phone" value={form.phone} onChange={handleChange} style={inputStyle} {...focusHandlers} />
                            </div>
                            <div>
                                <FieldLabel>Subject</FieldLabel>
                                <input type="text" name="subject" placeholder="Subject" value={form.subject} onChange={handleChange} style={inputStyle} {...focusHandlers} />
                            </div>
                        </div>

                        <div style={{ marginTop: "16px" }}>
                            <FieldLabel>Your Message</FieldLabel>
                            <textarea
                                name="message"
                                placeholder="Your Message"
                                rows={6}
                                value={form.message}
                                onChange={handleChange}
                                style={{ ...inputStyle, resize: "vertical", minHeight: "130px" }}
                                {...focusHandlers}
                            />
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
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "8px",
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
                            Send Message <IconSend />
                        </button>
                    </form>
                </div>
          </div>

{
    showSuccess && (

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

                <div
                    style={{
                        fontSize: "55px",
                        color: "#16A34A"
                    }}
                >
                    ✓
                </div>

                <h2>Success</h2>

                <p>
                    Your enquiry has been submitted successfully.
                </p>

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

    )
}

</section>
);
}

/* ---------- helpers ---------- */

function FieldLabel({ children }) {
    return (
        <label style={{ display: "block", marginBottom: "6px", fontSize: "12.5px", fontWeight: 600, color: "#334155" }}>
            {children}
        </label>
    );
}

function ContactRow({ icon, title, children, delay, inView, ease }) {
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
                transform: inView
                    ? hover
                        ? "translateX(4px)"
                        : "translateX(0)"
                    : "translateX(-35px)",
                transition: `opacity .9s ${ease} ${delay}s, transform .9s ${ease} ${delay}s`
            }}
        >
            <div
                style={{
                    width: "40px",
                    height: "40px",
                    minWidth: "40px",
                    borderRadius: "12px",
                    background: hover ? "#2563EB" : "rgba(255,255,255,.08)",
                    border: "1px solid rgba(255,255,255,.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    transform: hover ? "translateY(-3px) rotate(-4deg) scale(1.05)" : "translateY(0) rotate(0) scale(1)",
                    boxShadow: hover ? "0 10px 20px -6px rgba(37,99,235,.6)" : "none",
                    transition: "all .3s ease"
                }}
            >
                {icon}
            </div>
            <div>
                <p style={{ margin: 0, fontWeight: 700, fontSize: "14px", color: hover ? "#60A5FA" : "#fff", transition: "color .3s ease" }}>
                    {title}
                </p>
                <p style={{ margin: "4px 0 0", fontSize: "13.5px", color: "#94A3B8", lineHeight: 1.6 }}>{children}</p>
            </div>
        </div>
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

function IconSend() {
    return (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m22 2-7 20-4-9-9-4Z" />
            <path d="M22 2 11 13" />
        </svg>
    );
}