import { useEffect, useRef, useState } from "react";

const API_BASE = "http://localhost:8080/team-member";
const IMAGE_BASE = "http://localhost:8080/uploads/";

export default function Team() {

    const sectionRef = useRef(null);
    const [inView, setInView] = useState(false);
    const [team, setTeam] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => setInView(entry.isIntersecting),
            { threshold: 0.1, rootMargin: "-60px 0px -60px 0px" }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    // fetch team members from backend
    useEffect(() => {
        fetchTeam();
    }, []);

    const fetchTeam = async () => {
        try {
            const res = await fetch(API_BASE);
            const data = await res.json();
            setTeam(data);
        } catch (err) {
            console.error("Failed to fetch team members:", err);
        } finally {
            setLoading(false);
        }
    };

    const EASE = "cubic-bezier(.16,.9,.28,1)";

    return (
        <section
            ref={sectionRef}
            style={{
                width: "100%",
                padding: "clamp(60px, 8vw, 100px) 6%",
                background: "#FFFFFF",
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
                    Our Team
                </p>
                <h2 style={{ margin: "10px 0 0", fontSize: "clamp(26px, 3.2vw, 36px)", fontWeight: 800, color: "#0F172A" }}>
                    Meet Our <span style={{ color: "#2563EB" }}>Experts</span>
                </h2>
            </div>

            {loading ? (
                <p style={{ textAlign: "center", marginTop: "50px", color: "#64748B" }}>
                    Loading team...
                </p>
            ) : team.length === 0 ? (
                <p style={{ textAlign: "center", marginTop: "50px", color: "#64748B" }}>
                    No team members added yet.
                </p>
            ) : (
                <div
                    className="team-grid"
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(5, 1fr)",
                        gap: "22px",
                        maxWidth: "1200px",
                        margin: "48px auto 0"
                    }}
                >
                    {team.map((member, i) => (
                        <MemberCard
                            key={member.id}
                            member={member}
                            delay={0.08 + i * 0.1}
                            inView={inView}
                            ease={EASE}
                        />
                    ))}
                </div>
            )}

            <style>{`
                @media (max-width: 1024px) {
                    .team-grid { grid-template-columns: repeat(3, 1fr) !important; }
                }
                @media (max-width: 640px) {
                    .team-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 16px !important; }
                }
                @media (max-width: 400px) {
                    .team-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </section>
    );
}

function MemberCard({ member, delay, inView, ease }) {
    const [hover, setHover] = useState(false);

    return (
        <div
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
                background: "#fff",
                borderRadius: "16px",
                padding: "16px 16px 20px",
                border: hover ? "1px solid rgba(37,99,235,.35)" : "1px solid #EAECEF",
                boxShadow: hover
                    ? "0 20px 36px -18px rgba(37,99,235,.22)"
                    : "0 6px 18px -10px rgba(15,23,42,.08)",
                textAlign: "center",
                opacity: inView ? 1 : 0,
                transform: inView
                    ? hover
                        ? "translateY(-4px)"
                        : "translateY(0)"
                    : "translateY(35px)",
                transition: `opacity .8s ${ease} ${delay}s, transform .8s ${ease} ${delay}s, box-shadow .3s ease, border-color .3s ease`
            }}
        >
            <div
                style={{
                    width: "100%",
                    aspectRatio: "1 / 1",
                    borderRadius: "10px",
                    overflow: "hidden",
                    marginBottom: "14px",
                    background: "#DBEAFE"
                }}
            >
                {member.image ? (
                    <img
                        src={IMAGE_BASE + member.image}
                        alt={member.fullName}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block"
                        }}
                    />
                ) : (
                    <div
                        style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#2563EB",
                            fontSize: "13px",
                            fontWeight: 600
                        }}
                    >
                        No Photo
                    </div>
                )}
            </div>

            <h3 style={{ margin: 0, fontSize: "15.5px", fontWeight: 700, color: "#0F172A" }}>
                {member.fullName}
            </h3>
            <p style={{ margin: "4px 0 12px", fontSize: "13.5px", fontWeight: 700, color: "#2563EB" }}>
                {member.designation}
            </p>

            <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                {member.linkedinUrl && (
                    <SocialIcon href={member.linkedinUrl} label={`${member.fullName} LinkedIn`}>
                        <IconLinkedin />
                    </SocialIcon>
                )}
                {member.facebookUrl && (
                    <SocialIcon href={member.facebookUrl} label={`${member.fullName} Facebook`}>
                        <IconFacebook />
                    </SocialIcon>
                )}
            </div>
        </div>
    );
}

function SocialIcon({ href, label, children }) {
    const [hover, setHover] = useState(false);
    return (
        <a
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={label}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: hover ? "#2563EB" : "#DBEAFE",
                color: hover ? "#fff" : "#2563EB",
                transition: "all .25s ease",
                textDecoration: "none"
            }}
        >
            {children}
        </a>
    );
}

/* ---------- icons ---------- */

function IconLinkedin() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.28 2.38 4.28 5.47v6.27ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z"/>
        </svg>
    );
}

function IconFacebook() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13.5 21v-7.5H16l.5-3h-3V8.5c0-.86.24-1.45 1.48-1.45H16.6V4.36C16.31 4.32 15.34 4.24 14.2 4.24c-2.33 0-3.92 1.42-3.92 4.03V10.5H7.77v3h2.51V21h3.22Z"/>
        </svg>
    );
}