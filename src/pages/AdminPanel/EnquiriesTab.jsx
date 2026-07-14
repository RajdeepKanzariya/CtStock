import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { statusStyles, thStyle, tdStyle, menuItemStyle, IconDots, IconSearch } from "./shared";

const ENQUIRIES_API = "http://localhost:8080/enquiry";

export default function EnquiriesTab() {

    const [enquiries, setEnquiries] = useState([]);
    const [enquiriesLoading, setEnquiriesLoading] = useState(false);
    const [enquiryStatusFilter, setEnquiryStatusFilter] = useState("all");
    const [enquiryStateFilter, setEnquiryStateFilter] = useState("all");
    const [enquirySearch, setEnquirySearch] = useState("");
    const [enquiryNotesDraft, setEnquiryNotesDraft] = useState({});
    const [enquirySavingId, setEnquirySavingId] = useState(null);
    const [enquiryDeleteTargetId, setEnquiryDeleteTargetId] = useState(null);
    const [expandedId, setExpandedId] = useState(null);
    const [openMenuId, setOpenMenuId] = useState(null);

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
        setOpenMenuId(null);
    };

    const saveEnquiryNotes = (id) => {
        updateEnquiry(id, { notes: enquiryNotesDraft[id] || "" });
    };

    const requestDeleteEnquiry = (id) => {
        setEnquiryDeleteTargetId(id);
        setOpenMenuId(null);
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

    // Unique, sorted list of states present in the data, for the state filter dropdown
    const availableStates = Array.from(
        new Set(enquiries.map((e) => e.state).filter(Boolean))
    ).sort();

    const filteredEnquiries = enquiries.filter((e) => {
        const q = enquirySearch.toLowerCase();

        const matchesSearch =
            (e.name || "").toLowerCase().includes(q) ||
            (e.email || "").toLowerCase().includes(q) ||
            (e.phone || "").toLowerCase().includes(q) ||
            (e.company_name || "").toLowerCase().includes(q) ||
            (e.industry_type || "").toLowerCase().includes(q) ||
            (e.state || "").toLowerCase().includes(q) ||
            (e.address || "").toLowerCase().includes(q);

        const matchesState =
            enquiryStateFilter === "all" || (e.state || "") === enquiryStateFilter;

        return matchesSearch && matchesState;
    });

    /* ============ EXCEL EXPORT ============ */
    const handleExportExcel = () => {

        if (filteredEnquiries.length === 0) {
            alert("There are no enquiries to export for the current filter/search.");
            return;
        }

        const rows = filteredEnquiries.map((e) => ({
            "ID": e.id,
            "Name": e.name || "",
            "Phone": e.phone || "",
            "WhatsApp": e.whatsapp || "",
            "Email": e.email || "",
            "Company Name": e.company_name || "",
            "Industry Type": e.industry_type || "",
            "Address": e.address || "",
            "State": e.state || "",
            "Products": (e.products || []).join(", "),
            "Message": e.message || "",
            "Status": e.status || "pending",
            "Called": e.is_called ? "Yes" : "No",
            "Notes": e.notes || "",
            "Submitted On": e.created_at ? new Date(e.created_at).toLocaleString() : ""
        }));

        const worksheet = XLSX.utils.json_to_sheet(rows);

        worksheet["!cols"] = [
            { wch: 6 },  // ID
            { wch: 20 }, // Name
            { wch: 14 }, // Phone
            { wch: 14 }, // WhatsApp
            { wch: 26 }, // Email
            { wch: 22 }, // Company Name
            { wch: 18 }, // Industry Type
            { wch: 26 }, // Address
            { wch: 20 }, // State
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

                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "20px" }}>
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

                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "16px", marginBottom: "10px" }}>
                    <div style={{ position: "relative", flex: "1 1 300px", maxWidth: "360px" }}>
                        <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }}>
                            <IconSearch />
                        </span>
                        <input
                            placeholder="Search by name, email, phone, company, address..."
                            value={enquirySearch}
                            onChange={(e) => setEnquirySearch(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "11px 14px 11px 40px",
                                borderRadius: "9px",
                                border: "1px solid #E2E8F0",
                                fontSize: "13.5px",
                                outline: "none",
                                boxSizing: "border-box"
                            }}
                        />
                    </div>

                    <select
                        value={enquiryStateFilter}
                        onChange={(e) => setEnquiryStateFilter(e.target.value)}
                        style={{
                            padding: "11px 14px",
                            borderRadius: "9px",
                            border: "1px solid #E2E8F0",
                            fontSize: "13.5px",
                            outline: "none",
                            background: "#fff",
                            color: "#334155",
                            cursor: "pointer",
                            minWidth: "180px"
                        }}
                    >
                        <option value="all">All States</option>
                        {availableStates.map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>

                {enquiriesLoading ? (
                    <p style={{ color: "#64748B", marginTop: "14px" }}>Loading enquiries...</p>
                ) : filteredEnquiries.length === 0 ? (
                    <p style={{ color: "#64748B", marginTop: "14px" }}>No enquiries found.</p>
                ) : (
                    <div style={{ marginTop: "6px" }}>
                        <table width="100%" style={{ borderCollapse: "collapse", fontSize: "13.5px", tableLayout: "fixed" }}>
                            <colgroup>
                                <col style={{ width: "20%" }} />
                                <col style={{ width: "24%" }} />
                                <col style={{ width: "20%" }} />
                                <col style={{ width: "14%" }} />
                                <col style={{ width: "12%" }} />
                                <col style={{ width: "10%" }} />
                            </colgroup>
                            <thead>
                                <tr style={{ textAlign: "left" }}>
                                    <th style={thStyle}>NAME</th>
                                    <th style={thStyle}>CONTACT</th>
                                    <th style={thStyle}>PRODUCTS</th>
                                    <th style={thStyle}>STATUS</th>
                                    <th style={thStyle}>DATE</th>
                                    <th style={thStyle}>ACTIONS</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredEnquiries.map((enq) => {
                                    const status = enq.status || "pending";
                                    const badge = statusStyles[status] || statusStyles.pending;
                                    const isExpanded = expandedId === enq.id;
                                    const isMenuOpen = openMenuId === enq.id;

                                    return (
                                        <>
                                            <tr key={enq.id} style={{ borderTop: "1px solid #F1F5F9" }}>
                                                <td style={{ ...tdStyle, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                    <strong style={{ color: "#0F172A" }}>{enq.name}</strong>
                                                    {enq.is_called ? (
                                                        <div style={{ fontSize: "11px", color: "#15803D", marginTop: "2px" }}>📞 Called</div>
                                                    ) : (
                                                        <div style={{ fontSize: "11px", color: "#94A3B8", marginTop: "2px" }}>📞 Not Called</div>
                                                    )}
                                                </td>
                                                <td style={{ ...tdStyle, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                    <div style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{enq.email}</div>
                                                    <div style={{ color: "#94A3B8", fontSize: "12.5px" }}>{enq.phone}</div>
                                                </td>
                                                <td style={tdStyle}>
                                                    {enq.products && enq.products.length > 0 ? (
                                                        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                                                            {enq.products.slice(0, 2).map((p) => (
                                                                <span
                                                                    key={p}
                                                                    style={{
                                                                        background: "#DBEAFE",
                                                                        color: "#1D4ED8",
                                                                        fontSize: "11px",
                                                                        fontWeight: 700,
                                                                        padding: "2px 8px",
                                                                        borderRadius: "999px",
                                                                        whiteSpace: "nowrap"
                                                                    }}
                                                                >
                                                                    {p}
                                                                </span>
                                                            ))}
                                                            {enq.products.length > 2 && (
                                                                <span style={{ fontSize: "11px", color: "#94A3B8", fontWeight: 600 }}>
                                                                    +{enq.products.length - 2}
                                                                </span>
                                                            )}
                                                        </div>
                                                    ) : "—"}
                                                </td>
                                                <td style={tdStyle}>
                                                    <select
                                                        value={status}
                                                        onChange={(e) => handleEnquiryStatusChange(enq.id, e.target.value)}
                                                        style={{
                                                            width: "100%",
                                                            padding: "6px 8px",
                                                            borderRadius: "8px",
                                                            border: "1px solid #E2E8F0",
                                                            fontSize: "12px",
                                                            fontWeight: 600,
                                                            cursor: "pointer",
                                                            background: badge.bg,
                                                            color: badge.color
                                                        }}
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="contacted">Contacted</option>
                                                        <option value="resolved">Resolved</option>
                                                    </select>
                                                </td>
                                                <td style={{ ...tdStyle, fontSize: "12.5px" }}>
                                                    {enq.created_at ? new Date(enq.created_at).toLocaleDateString() : "—"}
                                                </td>
                                                <td style={{ ...tdStyle, position: "relative" }}>
                                                    <button
                                                        onClick={() => setOpenMenuId(isMenuOpen ? null : enq.id)}
                                                        style={{
                                                            background: "transparent",
                                                            border: "none",
                                                            cursor: "pointer",
                                                            padding: "6px",
                                                            borderRadius: "6px",
                                                            color: "#64748B"
                                                        }}
                                                    >
                                                        <IconDots />
                                                    </button>

                                                    {isMenuOpen && (
                                                        <div
                                                            style={{
                                                                position: "absolute",
                                                                right: "10px",
                                                                top: "38px",
                                                                background: "#fff",
                                                                border: "1px solid #E2E8F0",
                                                                borderRadius: "10px",
                                                                boxShadow: "0 10px 25px -8px rgba(15,23,42,.2)",
                                                                zIndex: 10,
                                                                minWidth: "170px",
                                                                overflow: "hidden"
                                                            }}
                                                        >
                                                            <div
                                                                onClick={() => {
                                                                    setExpandedId(isExpanded ? null : enq.id);
                                                                    setOpenMenuId(null);
                                                                }}
                                                                style={menuItemStyle}
                                                            >
                                                                {isExpanded ? "Hide Details" : "View Details"}
                                                            </div>
                                                            <div
                                                                onClick={() => toggleEnquiryCalled(enq.id, enq.is_called)}
                                                                style={menuItemStyle}
                                                            >
                                                                {enq.is_called ? "Mark as Not Called" : "Mark as Called"}
                                                            </div>
                                                            <div
                                                                onClick={() => requestDeleteEnquiry(enq.id)}
                                                                style={{ ...menuItemStyle, color: "#DC2626" }}
                                                            >
                                                                Delete
                                                            </div>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>

                                            {isExpanded && (
                                                <tr key={`${enq.id}-details`}>
                                                    <td colSpan="6" style={{ padding: "0 14px 18px", background: "#F8FAFC" }}>
                                                        <div
                                                            style={{
                                                                border: "1px solid #E2E8F0",
                                                                borderRadius: "12px",
                                                                padding: "16px",
                                                                background: "#fff"
                                                            }}
                                                        >
                                                            <div
                                                                style={{
                                                                    display: "grid",
                                                                    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                                                                    gap: "10px",
                                                                    fontSize: "13px",
                                                                    color: "#334155"
                                                                }}
                                                            >
                                                                <div>
                                                                    <strong style={{ color: "#0F172A" }}>WhatsApp:</strong> {enq.whatsapp || "—"}
                                                                </div>
                                                                <div>
                                                                    <strong style={{ color: "#0F172A" }}>Company:</strong> {enq.company_name || "—"}
                                                                </div>
                                                                <div>
                                                                    <strong style={{ color: "#0F172A" }}>Industry:</strong> {enq.industry_type || "—"}
                                                                </div>
                                                                <div>
                                                                    <strong style={{ color: "#0F172A" }}>State:</strong> {enq.state || "—"}
                                                                </div>
                                                                <div style={{ gridColumn: "1 / -1" }}>
                                                                    <strong style={{ color: "#0F172A" }}>Address:</strong> {enq.address || "—"}
                                                                </div>
                                                            </div>

                                                            {enq.products && enq.products.length > 0 && (
                                                                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "12px" }}>
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
                                                                <p style={{ fontSize: "13.5px", color: "#334155", marginTop: "12px", lineHeight: 1.6 }}>
                                                                    {enq.message}
                                                                </p>
                                                            )}

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
                                                    </td>
                                                </tr>
                                            )}
                                        </>
                                    );
                                })}
                            </tbody>
                        </table>
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