import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { statusStyles } from "./shared";

const ENQUIRIES_API = "http://localhost:8080/enquiry";

export default function EnquiriesTab() {

    const [enquiries, setEnquiries] = useState([]);
    const [enquiriesLoading, setEnquiriesLoading] = useState(false);
    const [enquiryStatusFilter, setEnquiryStatusFilter] = useState("all");
    const [enquiryNotesDraft, setEnquiryNotesDraft] = useState({});
    const [enquirySavingId, setEnquirySavingId] = useState(null);
    const [enquiryDeleteTargetId, setEnquiryDeleteTargetId] = useState(null);

    useEffect(() => {
        fetchEnquiries();
    }, [enquiryStatusFilter]);

    const fetchEnquiries = async () => {
        setEnquiriesLoading(true);
        try {
            const res = await fetch(ENQUIRIES_API);
            const data = await res.json();
            const filtered =
                enquiryStatusFilter === "all"
                    ? data
                    : data.filter((e) => (e.status || "pending") === enquiryStatusFilter);
            setEnquiries(filtered);

            const drafts = {};
            data.forEach((e) => {
                drafts[e.id] = e.notes || "";
            });
            setEnquiryNotesDraft(drafts);
        } catch (err) {
            console.error("Failed to fetch enquiries:", err);
        } finally {
            setEnquiriesLoading(false);
        }
    };

    const updateEnquiry = async (id, payload) => {
        setEnquirySavingId(id);
        try {
            await fetch(`${ENQUIRIES_API}/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            fetchEnquiries();
        } catch (err) {
            console.error("Failed to update enquiry:", err);
        } finally {
            setEnquirySavingId(null);
        }
    };

    const handleEnquiryStatusChange = (id, status) => {
        updateEnquiry(id, { status });
    };

    const toggleEnquiryCalled = (id, current) => {
        updateEnquiry(id, { is_called: current ? 0 : 1 });
    };

    const saveEnquiryNotes = (id) => {
        updateEnquiry(id, { notes: enquiryNotesDraft[id] || "" });
    };

    const requestDeleteEnquiry = (id) => {
        setEnquiryDeleteTargetId(id);
    };

    const confirmDeleteEnquiry = async () => {
        if (!enquiryDeleteTargetId) return;
        try {
            await fetch(`${ENQUIRIES_API}/${enquiryDeleteTargetId}`, { method: "DELETE" });
            fetchEnquiries();
        } catch (err) {
            console.error("Failed to delete enquiry:", err);
        } finally {
            setEnquiryDeleteTargetId(null);
        }
    };

    /* ============ EXCEL EXPORT ============ */
    // Exports whatever is currently visible (respects the active status filter),
    // so "Pending" tab + Export gives just the pending ones, etc.
    const handleExportExcel = () => {

        if (enquiries.length === 0) {
            alert("There are no enquiries to export for the current filter.");
            return;
        }

        const rows = enquiries.map((e) => ({
            "ID": e.id,
            "Name": e.name || "",
            "Phone": e.phone || "",
            "WhatsApp": e.whatsapp || "",
            "Email": e.email || "",
            "Company Name": e.company_name || "",
            "Industry Type": e.industry_type || "",
            "Address": e.address || "",
            "Products": (e.products || []).join(", "),
            "Message": e.message || "",
            "Status": e.status || "pending",
            "Called": e.is_called ? "Yes" : "No",
            "Notes": e.notes || "",
            "Submitted On": e.created_at ? new Date(e.created_at).toLocaleString() : ""
        }));

        const worksheet = XLSX.utils.json_to_sheet(rows);

        // reasonable column widths so it's readable straight out of the download
        worksheet["!cols"] = [
            { wch: 6 },  // ID
            { wch: 20 }, // Name
            { wch: 14 }, // Phone
            { wch: 14 }, // WhatsApp
            { wch: 26 }, // Email
            { wch: 22 }, // Company Name
            { wch: 18 }, // Industry Type
            { wch: 26 }, // Address
            { wch: 30 }, // Products
            { wch: 40 }, // Message
            { wch: 12 }, // Status
            { wch: 8 },  // Called
            { wch: 30 }, // Notes
            { wch: 20 }  // Submitted On
        ];

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Enquiries");

        const filterLabel = enquiryStatusFilter === "all" ? "all" : enquiryStatusFilter;
        const dateStamp = new Date().toISOString().slice(0, 10);

        XLSX.writeFile(workbook, `enquiries_${filterLabel}_${dateStamp}.xlsx`);
    };

    return (
        <>
            <div
                style={{
                    background: "#fff",
                    borderRadius: "16px",
                    border: "1px solid #E2E8F0",
                    padding: "26px"
                }}
            >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "14px" }}>
                    <div>
                        <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 800, color: "#0F172A" }}>
                            Product Enquiries
                        </h2>
                        <p style={{ margin: "4px 0 0", fontSize: "13.5px", color: "#64748B" }}>
                            All enquiries submitted through your website's enquiry form.
                        </p>
                    </div>

                    <button
                        onClick={handleExportExcel}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            background: "#15803D",
                            color: "#fff",
                            border: "none",
                            padding: "11px 20px",
                            borderRadius: "9px",
                            fontWeight: 600,
                            fontSize: "13.5px",
                            cursor: "pointer"
                        }}
                    >
                        <IconExcel /> Export to Excel
                    </button>
                </div>

                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "20px", marginBottom: "20px" }}>
                    {["all", "pending", "contacted", "resolved"].map((val) => (
                        <div
                            key={val}
                            onClick={() => setEnquiryStatusFilter(val)}
                            style={{
                                padding: "8px 16px",
                                borderRadius: "8px",
                                fontSize: "13px",
                                fontWeight: 600,
                                cursor: "pointer",
                                border: "1px solid #E2E8F0",
                                background: enquiryStatusFilter === val ? "#0F172A" : "#fff",
                                color: enquiryStatusFilter === val ? "#fff" : "#475569",
                                textTransform: "capitalize"
                            }}
                        >
                            {val}
                        </div>
                    ))}
                </div>

                {enquiriesLoading ? (
                    <p style={{ color: "#64748B" }}>Loading enquiries...</p>
                ) : enquiries.length === 0 ? (
                    <p style={{ color: "#64748B" }}>No enquiries found.</p>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                        {enquiries.map((enq) => {
                            const status = enq.status || "pending";
                            const badge = statusStyles[status] || statusStyles.pending;

                            return (
                                <div
                                    key={enq.id}
                                    style={{
                                        background: "#F8FAFC",
                                        border: "1px solid #EAECEF",
                                        borderRadius: "12px",
                                        padding: "18px"
                                    }}
                                >
                                    <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                                            <strong style={{ color: "#0F172A", fontSize: "15px" }}>{enq.name}</strong>
                                            <span
                                                style={{
                                                    background: badge.bg,
                                                    color: badge.color,
                                                    fontSize: "11.5px",
                                                    fontWeight: 700,
                                                    padding: "3px 10px",
                                                    borderRadius: "999px"
                                                }}
                                            >
                                                {badge.label}
                                            </span>
                                            {enq.is_called ? (
                                                <span style={{ fontSize: "11.5px", fontWeight: 700, color: "#15803D" }}>
                                                    📞 Called
                                                </span>
                                            ) : (
                                                <span style={{ fontSize: "11.5px", fontWeight: 700, color: "#94A3B8" }}>
                                                    📞 Not Called
                                                </span>
                                            )}
                                        </div>
                                        <span style={{ fontSize: "12.5px", color: "#94A3B8" }}>
                                            {enq.created_at ? new Date(enq.created_at).toLocaleString() : "—"}
                                        </span>
                                    </div>

                                    <div style={{ fontSize: "13.5px", color: "#64748B", marginTop: "4px" }}>
                                        {enq.email} • {enq.phone} {enq.whatsapp ? `• WA: ${enq.whatsapp}` : ""}
                                    </div>

                                    {(enq.company_name || enq.industry_type || enq.address) && (
                                        <div style={{ fontSize: "13px", color: "#64748B", marginTop: "6px" }}>
                                            {enq.company_name && <>Company: {enq.company_name} • </>}
                                            {enq.industry_type && <>Industry: {enq.industry_type} • </>}
                                            {enq.address && <>Address: {enq.address}</>}
                                        </div>
                                    )}

                                    {enq.products && enq.products.length > 0 && (
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "10px" }}>
                                            {enq.products.map((p) => (
                                                <span
                                                    key={p}
                                                    style={{
                                                        background: "#DBEAFE",
                                                        color: "#1D4ED8",
                                                        fontSize: "11.5px",
                                                        fontWeight: 700,
                                                        padding: "3px 10px",
                                                        borderRadius: "999px"
                                                    }}
                                                >
                                                    {p}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {enq.message && (
                                        <p style={{ fontSize: "14px", color: "#334155", marginTop: "10px", lineHeight: 1.6 }}>
                                            {enq.message}
                                        </p>
                                    )}

                                    <div
                                        style={{
                                            marginTop: "14px",
                                            paddingTop: "14px",
                                            borderTop: "1px dashed #E2E8F0",
                                            display: "flex",
                                            flexWrap: "wrap",
                                            gap: "10px",
                                            alignItems: "center"
                                        }}
                                    >
                                        <select
                                            value={status}
                                            onChange={(e) => handleEnquiryStatusChange(enq.id, e.target.value)}
                                            style={{
                                                padding: "8px 12px",
                                                borderRadius: "8px",
                                                border: "1px solid #E2E8F0",
                                                fontSize: "13px",
                                                fontWeight: 600,
                                                cursor: "pointer",
                                                background: "#fff"
                                            }}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="contacted">Contacted</option>
                                            <option value="resolved">Resolved</option>
                                        </select>

                                        <button
                                            onClick={() => toggleEnquiryCalled(enq.id, enq.is_called)}
                                            style={{
                                                padding: "8px 14px",
                                                borderRadius: "8px",
                                                border: "1px solid #E2E8F0",
                                                fontSize: "13px",
                                                fontWeight: 600,
                                                cursor: "pointer",
                                                background: enq.is_called ? "#DCFCE7" : "#fff",
                                                color: enq.is_called ? "#15803D" : "#334155"
                                            }}
                                        >
                                            {enq.is_called ? "Mark as Not Called" : "Mark as Called"}
                                        </button>

                                        <button
                                            onClick={() => requestDeleteEnquiry(enq.id)}
                                            style={{
                                                padding: "8px 14px",
                                                borderRadius: "8px",
                                                border: "1px solid #FECACA",
                                                fontSize: "13px",
                                                fontWeight: 600,
                                                cursor: "pointer",
                                                background: "#fff",
                                                color: "#DC2626"
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </div>

                                    <div style={{ marginTop: "12px" }}>
                                        <label style={{ fontSize: "12.5px", fontWeight: 600, color: "#334155" }}>
                                            Notes
                                        </label>
                                        <textarea
                                            rows={2}
                                            value={enquiryNotesDraft[enq.id] ?? ""}
                                            onChange={(e) =>
                                                setEnquiryNotesDraft({ ...enquiryNotesDraft, [enq.id]: e.target.value })
                                            }
                                            style={{
                                                width: "100%",
                                                marginTop: "6px",
                                                padding: "10px 12px",
                                                borderRadius: "8px",
                                                border: "1px solid #E2E8F0",
                                                fontSize: "13.5px",
                                                outline: "none",
                                                resize: "vertical",
                                                boxSizing: "border-box",
                                                fontFamily: "inherit"
                                            }}
                                        />
                                        <button
                                            onClick={() => saveEnquiryNotes(enq.id)}
                                            disabled={enquirySavingId === enq.id}
                                            style={{
                                                marginTop: "8px",
                                                padding: "7px 16px",
                                                borderRadius: "8px",
                                                border: "none",
                                                fontSize: "13px",
                                                fontWeight: 600,
                                                cursor: enquirySavingId === enq.id ? "not-allowed" : "pointer",
                                                background: "#2563EB",
                                                color: "#fff",
                                                opacity: enquirySavingId === enq.id ? 0.6 : 1
                                            }}
                                        >
                                            {enquirySavingId === enq.id ? "Saving..." : "Save Note"}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal (enquiries) */}
            {enquiryDeleteTargetId && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: "rgba(15,23,42,.5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 9999
                    }}
                >
                    <div
                        style={{
                            background: "#fff",
                            borderRadius: "16px",
                            padding: "30px",
                            width: "360px",
                            maxWidth: "90%",
                            textAlign: "center",
                            boxShadow: "0 25px 60px -15px rgba(0,0,0,.35)"
                        }}
                    >
                        <div
                            style={{
                                width: "56px",
                                height: "56px",
                                borderRadius: "50%",
                                background: "#FEE2E2",
                                color: "#DC2626",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "0 auto 16px",
                                fontSize: "26px"
                            }}
                        >
                            🗑
                        </div>

                        <h3 style={{ margin: 0, fontSize: "17px", fontWeight: 800, color: "#0F172A" }}>
                            Delete this enquiry?
                        </h3>
                        <p style={{ marginTop: "8px", fontSize: "13.5px", color: "#64748B", lineHeight: 1.6 }}>
                            This action cannot be undone. The enquiry will be permanently removed.
                        </p>

                        <div style={{ display: "flex", gap: "10px", marginTop: "22px" }}>
                            <button
                                onClick={() => setEnquiryDeleteTargetId(null)}
                                style={{
                                    flex: 1,
                                    padding: "11px",
                                    borderRadius: "9px",
                                    border: "1px solid #E2E8F0",
                                    background: "#fff",
                                    color: "#334155",
                                    fontWeight: 600,
                                    fontSize: "13.5px",
                                    cursor: "pointer"
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDeleteEnquiry}
                                style={{
                                    flex: 1,
                                    padding: "11px",
                                    borderRadius: "9px",
                                    border: "none",
                                    background: "#DC2626",
                                    color: "#fff",
                                    fontWeight: 600,
                                    fontSize: "13.5px",
                                    cursor: "pointer"
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

/* ---------- icons ---------- */

function IconExcel() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
            <path d="M14 2v6h6M8 13l3 5M11 13l-3 5" />
        </svg>
    );
}