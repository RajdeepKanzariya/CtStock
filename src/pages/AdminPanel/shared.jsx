export const IMAGE_BASE = "http://localhost:8080/uploads/";

export const statusStyles = {
    pending: { bg: "#FEF3C7", color: "#92400E", label: "Pending" },
    contacted: { bg: "#DBEAFE", color: "#1D4ED8", label: "Contacted" },
    resolved: { bg: "#DCFCE7", color: "#15803D", label: "Resolved" }
};

export const inputStyle = {
    width: "100%",
    padding: "11px 14px",
    borderRadius: "8px",
    border: "1px solid #E2E8F0",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box"
};

export const thStyle = {
    padding: "12px 14px",
    color: "#94A3B8",
    fontWeight: 700,
    fontSize: "11.5px",
    letterSpacing: "0.5px",
    borderBottom: "1px solid #F1F5F9"
};

export const tdStyle = {
    padding: "14px",
    color: "#334155",
    verticalAlign: "middle"
};

export const linkStyle = {
    color: "#2563EB",
    fontWeight: 600,
    textDecoration: "none"
};

export const menuItemStyle = {
    padding: "10px 14px",
    fontSize: "13.5px",
    fontWeight: 600,
    color: "#334155",
    cursor: "pointer"
};

export const smallBtnStyle = {
    padding: "8px 14px",
    borderRadius: "8px",
    border: "1px solid #E2E8F0",
    background: "#fff",
    color: "#334155",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer"
};

export function ConfirmDeleteModal({ title, message, onCancel, onConfirm }) {
    return (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(15,23,42,.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
            <div style={{ background: "#fff", borderRadius: "16px", padding: "30px", width: "360px", maxWidth: "90%", textAlign: "center", boxShadow: "0 25px 60px -15px rgba(0,0,0,.35)" }}>
                <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "#FEE2E2", color: "#DC2626", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: "26px" }}>🗑</div>
                <h3 style={{ margin: 0, fontSize: "17px", fontWeight: 800, color: "#0F172A" }}>{title}</h3>
                <p style={{ marginTop: "8px", fontSize: "13.5px", color: "#64748B", lineHeight: 1.6 }}>{message}</p>
                <div style={{ display: "flex", gap: "10px", marginTop: "22px" }}>
                    <button onClick={onCancel} style={{ flex: 1, padding: "11px", borderRadius: "9px", border: "1px solid #E2E8F0", background: "#fff", color: "#334155", fontWeight: 600, fontSize: "13.5px", cursor: "pointer" }}>Cancel</button>
                    <button onClick={onConfirm} style={{ flex: 1, padding: "11px", borderRadius: "9px", border: "none", background: "#DC2626", color: "#fff", fontWeight: 600, fontSize: "13.5px", cursor: "pointer" }}>Delete</button>
                </div>
            </div>
        </div>
    );
}

export function IconUsers() {
    return (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    );
}

export function IconMessage() {
    return (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" />
        </svg>
    );
}

export function IconBox() {
    return (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
            <path d="m3.3 7 8.7 5 8.7-5M12 22V12" />
        </svg>
    );
}

export function IconPlus() {
    return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14" />
        </svg>
    );
}

export function IconSearch() {
    return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
        </svg>
    );
}

export function IconDots() {
    return (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="5" r="1.5" />
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="12" cy="19" r="1.5" />
        </svg>
    );
}