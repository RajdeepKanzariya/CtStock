import cl1 from "../../assets/cl1.png";
import cl2 from "../../assets/cl2.png";
import cl3 from "../../assets/cl3.png";
import cl4 from "../../assets/cl4.png";
import cl5 from "../../assets/cl5.png";
import cl6 from "../../assets/cl6.png";
import cl7 from "../../assets/cl7.png";
import cl8 from "../../assets/cl8.png";
import cl9 from "../../assets/cl9.png";
import cl10 from "../../assets/cl10.png";
import cl11 from "../../assets/cl11.png";


const clients = [
    cl1, cl2, cl3, cl4, cl5, cl6, cl7, cl8, cl9, cl10, cl11
];

export default function OurClients() {

    const loopClients = [...clients, ...clients];

    return (
        <section
            style={{
                width: "100%",
                padding: "clamp(50px, 7vw, 90px) 0",
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
                    padding: "0 6%",
                    boxSizing: "border-box"
                }}
            >
                <p
                    style={{
                        color: "#2563EB",
                        fontSize: "13px",
                        fontWeight: 700,
                        letterSpacing: "1.5px",
                        textTransform: "uppercase",
                        margin: 0
                    }}
                >
                    Our Clients
                </p>
                <h2
                    style={{
                        margin: "10px 0 0",
                        fontSize: "clamp(26px, 3.2vw, 36px)",
                        fontWeight: 800,
                        color: "#0F172A"
                    }}
                >
                    Trusted By <span style={{ color: "#2563EB" }}>Leading Brands</span>
                </h2>
            </div>

            {/* Scrolling Logo Strip */}
            <div
                style={{
                    marginTop: "46px",
                    position: "relative",
                    width: "100%",
                    overflow: "hidden",
                    maskImage:
                        "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
                    WebkitMaskImage:
                        "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)"
                }}
            >
                <div className="clients-track">
                    {loopClients.map((logo, i) => (
                        <div className="client-logo-box" key={i}>
                            <img src={logo} alt={`Client ${i + 1}`} />
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                .clients-track {
                    display: flex;
                    align-items: center;
                    gap: 60px;
                    width: max-content;
                    animation: scrollClients 30s linear infinite;
                }

                .clients-track:hover {
                    animation-play-state: paused;
                }

                .client-logo-box {
                    flex: 0 0 auto;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 60px;
                }

                .client-logo-box img {
                    height: 100%;
                    max-width: 140px;
                    width: auto;
                    object-fit: contain;
                    filter: grayscale(100%) opacity(0.6);
                    transition: filter .3s ease, transform .3s ease;
                }

                .client-logo-box:hover img {
                    filter: grayscale(0%) opacity(1);
                    transform: scale(1.05);
                }

                @keyframes scrollClients {
                    from {
                        transform: translateX(0);
                    }
                    to {
                        transform: translateX(-50%);
                    }
                }

                @media (max-width: 640px) {
                    .clients-track {
                        gap: 40px;
                    }
                    .client-logo-box {
                        height: 44px;
                    }
                    .client-logo-box img {
                        max-width: 100px;
                    }
                }
            `}</style>
        </section>
    );
}