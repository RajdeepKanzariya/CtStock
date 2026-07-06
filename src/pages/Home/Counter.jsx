import { useEffect, useRef, useState } from "react";

export default function Counter() {

    const counters = [
        { number: 500, suffix: "+", title: "Happy Clients" },
        { number: 100, suffix: "+", title: "Products" },
        { number: 10, suffix: "+", title: "Years Experience" },
        { number: 24, suffix: "/7", title: "Support" }
    ];

    const sectionRef = useRef(null);
    const [inView, setInView] = useState(false);
    const [counts, setCounts] = useState(counters.map(() => 0));

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                }else {
                    setInView(false); 
                    setCounts(counters.map(() => 0)); 
                }
            },
            { threshold: 0.25 }
        );

        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!inView) return;

        const duration = 1400;
        const startTime = performance.now();

        const tick = (now) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);

            setCounts(counters.map((item) => Math.round(item.number * eased)));

            if (progress < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
    }, [inView]);

    return (
        <section
            ref={sectionRef}
            style={{
                width: "100%",
                padding: "clamp(60px, 8vw, 100px) 6%",
                background: "#F8FAFC",
                boxSizing: "border-box"
            }}
        >
            <div
                style={{
                    maxWidth: "1200px",
                    margin: "0 auto",
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "clamp(18px, 2.5vw, 28px)"
                }}
            >
                {counters.map((item, index) => (
                    <div
                        key={index}
                        style={{
                            background: "#fff",
                            borderRadius: "18px",
                            padding: "clamp(32px, 4vw, 44px) 20px",
                            textAlign: "center",
                            border: "1px solid #EAECEF",
                            boxShadow: "0 6px 20px rgba(15,23,42,.05)",
                            opacity: inView ? 1 : 0,
                            transform: inView ? "translateY(0)" : "translateY(45px)",
                            transition: `opacity .7s ease ${index * 0.15}s, transform .7s cubic-bezier(.2,.8,.2,1) ${index * 0.15}s, box-shadow .3s ease, border-color .3s ease`
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = "0 14px 30px rgba(15,23,42,.1)";
                            e.currentTarget.style.borderColor = "#CBD5E1";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = "0 6px 20px rgba(15,23,42,.05)";
                            e.currentTarget.style.borderColor = "#EAECEF";
                        }}
                    >
                        <h2
                            style={{
                                margin: 0,
                                fontSize: "clamp(34px, 4.2vw, 48px)",
                                fontWeight: 800,
                                letterSpacing: "-1px",
                                color: "#0F172A"
                            }}
                        >
                            {counts[index]}
                            <span style={{ color: "#2563EB" }}>{item.suffix}</span>
                        </h2>

                        <p
                            style={{
                                marginTop: "12px",
                                color: "#64748B",
                                fontSize: "clamp(14px, 1.3vw, 16px)",
                                fontWeight: 500
                            }}
                        >
                            {item.title}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}