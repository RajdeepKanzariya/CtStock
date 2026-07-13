export default function DownloadSection() {

    // Path is relative to the "public" folder — place your zip at:
    // frontend/public/downloads/ctstock-app.zip
    const fileUrl = "/downloads/ctstock-app.zip";

    return (
        <section
            style={{
                width: "100%",
                padding: "clamp(50px, 7vw, 80px) 6%",
                background: "#F8FAFC",
                boxSizing: "border-box"
            }}
        >
            <div
                style={{
                    maxWidth: "800px",
                    margin: "0 auto",
                    background: "#fff",
                    border: "1px solid #E2E8F0",
                    borderRadius: "20px",
                    padding: "clamp(30px, 4vw, 44px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "24px",
                    flexWrap: "wrap",
                    boxShadow: "0 15px 35px -20px rgba(15,23,42,.15)"
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <div
                        style={{
                            width: "54px",
                            height: "54px",
                            minWidth: "54px",
                            borderRadius: "14px",
                            background: "rgba(37,99,235,.1)",
                            color: "#2563EB",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >
                        <IconZip />
                    </div>
                    <div>
                        <h3 style={{ margin: 0, fontSize: "17px", fontWeight: 800, color: "#0F172A" }}>
                            Download Our Software Setup
                        </h3>
                        <p style={{ margin: "4px 0 0", fontSize: "13.5px", color: "#64748B" }}>
                            Get the full setup files in one ZIP archive.
                        </p>
                    </div>
                </div>

                <a
                    href={fileUrl}
                    download
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        background: "linear-gradient(90deg,#2563EB,#3B82F6)",
                        color: "#fff",
                        textDecoration: "none",
                        padding: "13px 26px",
                        borderRadius: "10px",
                        fontWeight: 700,
                        fontSize: "14.5px",
                        whiteSpace: "nowrap",
                        boxShadow: "0 10px 22px -8px rgba(37,99,235,.6)",
                        transition: "transform .2s ease"
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                >
                    <IconDownload /> Download CT - Setup
                </a>
            </div>
        </section>
    );
}

function IconZip() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
            <path d="M14 2v6h6M10 12v6M10 12h1M10 15h1M10 18h1" />
        </svg>
    );
}

function IconDownload() {
    return (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
        </svg>
    );
}