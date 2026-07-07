import { useEffect, useState } from "react";

const API_BASE = "http://localhost:8080/team-member";
const IMAGE_BASE = "http://localhost:8080/uploads/";
const MESSAGES_API = "http://localhost:8080/contact-form";

export default function AdminPanel() {

    const [activeTab, setActiveTab] = useState("team"); // "team" | "messages"

    /* ============ TEAM STATE ============ */
    const [members, setMembers] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [search, setSearch] = useState("");

    const [form, setForm] = useState({
        fullName: "",
        designation: "",
        linkedinUrl: "",
        facebookUrl: "",
        mobileNumber: ""
    });

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [openMenuId, setOpenMenuId] = useState(null);

    /* ============ MESSAGES STATE ============ */
    const [messages, setMessages] = useState([]);
    const [messagesLoading, setMessagesLoading] = useState(false);
    const [statusFilter, setStatusFilter] = useState("all"); // all | pending | contacted | resolved
    const [notesDraft, setNotesDraft] = useState({}); // { [messageId]: draftText }
    const [savingId, setSavingId] = useState(null);

    useEffect(() => {
        fetchMembers();
    }, []);

    useEffect(() => {
        if (activeTab === "messages") {
            fetchMessages();
        }
    }, [activeTab, statusFilter]);

    const fetchMembers = async () => {
        try {
            const res = await fetch(API_BASE);
            const data = await res.json();
            setMembers(data);
        } catch (err) {
            console.error("Failed to fetch members:", err);
        }
    };

    const fetchMessages = async () => {
        setMessagesLoading(true);
        try {
            const url =
                statusFilter === "all"
                    ? MESSAGES_API
                    : `${MESSAGES_API}?status=${statusFilter}`;

            const res = await fetch(url);
            const data = await res.json();
            setMessages(data);

            // preload notes drafts so textareas show existing notes
            const drafts = {};
            data.forEach((m) => {
                drafts[m.id] = m.notes || "";
            });
            setNotesDraft(drafts);
        } catch (err) {
            console.error("Failed to fetch messages:", err);
        } finally {
            setMessagesLoading(false);
        }
    };

    const updateMessage = async (id, payload) => {
        setSavingId(id);
        try {
            await fetch(`${MESSAGES_API}/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            fetchMessages();
        } catch (err) {
            console.error("Failed to update message:", err);
        } finally {
            setSavingId(null);
        }
    };

    const handleStatusChange = (id, status) => {
        updateMessage(id, { status });
    };

    const toggleCalled = (id, current) => {
        updateMessage(id, { is_called: current ? 0 : 1 });
    };

    const saveNotes = (id) => {
        updateMessage(id, { notes: notesDraft[id] || "" });
    };

    const deleteMessage = async (id) => {
        if (!window.confirm("Delete this message?")) return;
        try {
            await fetch(`${MESSAGES_API}/${id}`, { method: "DELETE" });
            fetchMessages();
        } catch (err) {
            console.error("Failed to delete message:", err);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const resetForm = () => {
        setForm({
            fullName: "",
            designation: "",
            linkedinUrl: "",
            facebookUrl: "",
            mobileNumber: ""
        });
        setImageFile(null);
        setImagePreview(null);
        setEditId(null);
    };

    const openAddForm = () => {
        resetForm();
        setShowForm(true);
    };

    const closeForm = () => {
        resetForm();
        setShowForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append("fullName", form.fullName);
        formData.append("designation", form.designation);
        formData.append("linkedinUrl", form.linkedinUrl);
        formData.append("facebookUrl", form.facebookUrl);
        formData.append("mobileNumber", form.mobileNumber);

        if (imageFile) {
            formData.append("image", imageFile);
        }

        try {
            let res;

            if (editId !== null) {
                res = await fetch(`${API_BASE}/${editId}`, {
                    method: "PUT",
                    body: formData
                });
            } else {
                if (!imageFile) {
                    alert("Please select a photo — it is required for a new member.");
                    setLoading(false);
                    return;
                }
                res = await fetch(API_BASE, {
                    method: "POST",
                    body: formData
                });
            }

            const result = await res.json();

            if (!res.ok) {
                console.error("Server rejected:", result);
                alert(result.sqlMessage || result.message || "Something went wrong");
                setLoading(false);
                return;
            }

            closeForm();
            fetchMembers();
        } catch (err) {
            console.error("Save failed:", err);
            alert("Network/Server error");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (member) => {
        setForm({
            fullName: member.fullName || "",
            designation: member.designation || "",
            linkedinUrl: member.linkedinUrl || "",
            facebookUrl: member.facebookUrl || "",
            mobileNumber: member.mobileNumber || ""
        });
        setImageFile(null);
        setImagePreview(member.image ? IMAGE_BASE + member.image : null);
        setEditId(member.id);
        setShowForm(true);
        setOpenMenuId(null);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this member?")) return;

        try {
            await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
            fetchMembers();
        } catch (err) {
            console.error("Delete failed:", err);
        }
        setOpenMenuId(null);
    };

    const filteredMembers = members.filter((m) => {
        const q = search.toLowerCase();
        return (
            (m.fullName || "").toLowerCase().includes(q) ||
            (m.designation || "").toLowerCase().includes(q) ||
            (m.mobileNumber || "").toLowerCase().includes(q)
        );
    });

    const getInitial = (name) => (name ? name.trim().charAt(0).toUpperCase() : "?");

    const avatarColors = ["#EC4899", "#6366F1", "#F59E0B", "#10B981", "#3B82F6", "#EF4444", "#8B5CF6"];
    const getAvatarColor = (id) => avatarColors[id % avatarColors.length];

    const statusStyles = {
        pending: { bg: "#FEF3C7", color: "#92400E", label: "Pending" },
        contacted: { bg: "#DBEAFE", color: "#1D4ED8", label: "Contacted" },
        resolved: { bg: "#DCFCE7", color: "#15803D", label: "Resolved" }
    };

    /* ============ STYLES ============ */

    const sidebarItemStyle = (tab) => ({
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "11px 16px",
        borderRadius: "8px",
        fontSize: "14px",
        fontWeight: 600,
        cursor: "pointer",
        marginBottom: "4px",
        background: activeTab === tab ? "#0F172A" : "transparent",
        color: activeTab === tab ? "#fff" : "#475569",
        transition: "all .15s ease"
    });

    const inputStyle = {
        width: "100%",
        padding: "11px 14px",
        borderRadius: "8px",
        border: "1px solid #E2E8F0",
        fontSize: "14px",
        outline: "none",
        boxSizing: "border-box"
    };

    const filterTabStyle = (val) => ({
        padding: "8px 16px",
        borderRadius: "8px",
        fontSize: "13px",
        fontWeight: 600,
        cursor: "pointer",
        border: "1px solid #E2E8F0",
        background: statusFilter === val ? "#0F172A" : "#fff",
        color: statusFilter === val ? "#fff" : "#475569",
        transition: "all .15s ease"
    });

    return (
        <div
            style={{
                display: "flex",
                minHeight: "100vh",
                background: "#F1F5F9",
                fontFamily: "Segoe UI, Arial, sans-serif"
            }}
        >
            {/* ============ SIDEBAR ============ */}
            <aside
                style={{
                    width: "230px",
                    minWidth: "230px",
                    background: "#fff",
                    borderRight: "1px solid #E2E8F0",
                    padding: "24px 16px",
                    boxSizing: "border-box"
                }}
            >
                <p style={{ fontSize: "11px", fontWeight: 700, color: "#94A3B8", letterSpacing: "1px", padding: "0 8px", marginBottom: "10px" }}>
                    MAIN MENU
                </p>

                <div style={sidebarItemStyle("team")} onClick={() => setActiveTab("team")}>
                    <IconUsers /> Team Members
                </div>

                <div style={sidebarItemStyle("messages")} onClick={() => setActiveTab("messages")}>
                    <IconMessage /> Messages
                </div>
            </aside>

            {/* ============ MAIN CONTENT ============ */}
            <main style={{ flex: 1, padding: "28px 34px", boxSizing: "border-box" }}>

                {/* Breadcrumb */}
                <div style={{ fontSize: "13px", color: "#94A3B8", marginBottom: "18px" }}>
                    Home / <span style={{ color: "#0F172A", fontWeight: 600 }}>
                        {activeTab === "team" ? "Team Members" : "Messages"}
                    </span>
                </div>

                {/* ============ TEAM TAB ============ */}
                {activeTab === "team" && (
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
                                    Team Members
                                </h2>
                                <p style={{ margin: "4px 0 0", fontSize: "13.5px", color: "#64748B" }}>
                                    Add, update or remove your website's team members.
                                </p>
                            </div>

                            {!showForm && (
                                <button
                                    onClick={openAddForm}
                                    style={{
                                        background: "#0F172A",
                                        color: "#fff",
                                        border: "none",
                                        padding: "11px 20px",
                                        borderRadius: "9px",
                                        fontWeight: 600,
                                        fontSize: "13.5px",
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "6px"
                                    }}
                                >
                                    <IconPlus /> Add New Member
                                </button>
                            )}
                        </div>

                        {showForm && (
                            <form
                                onSubmit={handleSubmit}
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                                    gap: "16px",
                                    marginTop: "22px",
                                    background: "#F8FAFC",
                                    padding: "24px",
                                    borderRadius: "14px",
                                    border: "1px solid #EAECEF"
                                }}
                            >
                                <h3 style={{ gridColumn: "1 / -1", margin: 0, color: "#0F172A" }}>
                                    {editId !== null ? "Update Member" : "Add New Member"}
                                </h3>

                                <div>
                                    <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>Full Name</label>
                                    <input
                                        name="fullName"
                                        placeholder="Full Name"
                                        value={form.fullName}
                                        onChange={handleChange}
                                        required
                                        style={{ ...inputStyle, marginTop: "6px" }}
                                    />
                                </div>

                                <div>
                                    <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>Designation</label>
                                    <input
                                        name="designation"
                                        placeholder="Designation"
                                        value={form.designation}
                                        onChange={handleChange}
                                        required
                                        style={{ ...inputStyle, marginTop: "6px" }}
                                    />
                                </div>

                                <div>
                                    <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>Mobile Number</label>
                                    <input
                                        name="mobileNumber"
                                        placeholder="+91 00000 00000"
                                        value={form.mobileNumber}
                                        onChange={handleChange}
                                        style={{ ...inputStyle, marginTop: "6px" }}
                                    />
                                </div>

                                <div>
                                    <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>LinkedIn URL</label>
                                    <input
                                        name="linkedinUrl"
                                        placeholder="LinkedIn URL"
                                        value={form.linkedinUrl}
                                        onChange={handleChange}
                                        style={{ ...inputStyle, marginTop: "6px" }}
                                    />
                                </div>

                                <div>
                                    <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>Facebook URL</label>
                                    <input
                                        name="facebookUrl"
                                        placeholder="Facebook URL"
                                        value={form.facebookUrl}
                                        onChange={handleChange}
                                        style={{ ...inputStyle, marginTop: "6px" }}
                                    />
                                </div>

                                <div>
                                    <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>
                                        Photo {editId === null && <span style={{ color: "#DC2626" }}>*</span>}
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        style={{ ...inputStyle, marginTop: "6px", padding: "8px" }}
                                    />
                                </div>

                                {imagePreview && (
                                    <div style={{ gridColumn: "1 / -1" }}>
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            style={{
                                                width: "80px",
                                                height: "80px",
                                                objectFit: "cover",
                                                borderRadius: "10px",
                                                border: "1px solid #E2E8F0"
                                            }}
                                        />
                                    </div>
                                )}

                                <div style={{ gridColumn: "1 / -1", display: "flex", gap: "10px" }}>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        style={{
                                            background: "#2563EB",
                                            color: "#fff",
                                            border: "none",
                                            padding: "12px 24px",
                                            borderRadius: "8px",
                                            fontWeight: 600,
                                            cursor: loading ? "not-allowed" : "pointer",
                                            opacity: loading ? 0.7 : 1
                                        }}
                                    >
                                        {loading ? "Saving..." : editId !== null ? "Update Member" : "Add Member"}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={closeForm}
                                        style={{
                                            background: "#fff",
                                            color: "#334155",
                                            border: "1px solid #CBD5E1",
                                            padding: "12px 24px",
                                            borderRadius: "8px",
                                            fontWeight: 600,
                                            cursor: "pointer"
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* Search */}
                        <div style={{ marginTop: "22px", position: "relative", maxWidth: "360px" }}>
                            <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }}>
                                <IconSearch />
                            </span>
                            <input
                                placeholder="Search by name, designation or mobile..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
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

                        {/* Table */}
                        <div style={{ marginTop: "18px", overflowX: "auto" }}>
                            <table width="100%" style={{ borderCollapse: "collapse", fontSize: "13.5px", minWidth: "800px" }}>
                                <thead>
                                    <tr style={{ textAlign: "left" }}>
                                        <th style={thStyle}>MEMBER DETAILS</th>
                                        <th style={thStyle}>DESIGNATION</th>
                                        <th style={thStyle}>MOBILE</th>
                                        <th style={thStyle}>LINKEDIN</th>
                                        <th style={thStyle}>FACEBOOK</th>
                                        <th style={thStyle}>ACTIONS</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredMembers.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" style={{ padding: "30px", textAlign: "center", color: "#94A3B8" }}>
                                                No team members found.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredMembers.map((member) => (
                                            <tr key={member.id} style={{ borderTop: "1px solid #F1F5F9" }}>
                                                <td style={tdStyle}>
                                                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                                        {member.image ? (
                                                            <img
                                                                src={IMAGE_BASE + member.image}
                                                                alt={member.fullName}
                                                                style={{
                                                                    width: "38px",
                                                                    height: "38px",
                                                                    borderRadius: "50%",
                                                                    objectFit: "cover"
                                                                }}
                                                            />
                                                        ) : (
                                                            <div
                                                                style={{
                                                                    width: "38px",
                                                                    height: "38px",
                                                                    borderRadius: "50%",
                                                                    background: getAvatarColor(member.id),
                                                                    color: "#fff",
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    justifyContent: "center",
                                                                    fontWeight: 700,
                                                                    fontSize: "14px"
                                                                }}
                                                            >
                                                                {getInitial(member.fullName)}
                                                            </div>
                                                        )}
                                                        <div>
                                                            <div style={{ fontWeight: 700, color: "#0F172A" }}>{member.fullName}</div>
                                                            <div style={{ fontSize: "12px", color: "#94A3B8" }}>ID: {member.id}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td style={tdStyle}>{member.designation || "—"}</td>
                                                <td style={tdStyle}>{member.mobileNumber || "—"}</td>
                                                <td style={tdStyle}>
                                                    {member.linkedinUrl ? (
                                                        <a href={member.linkedinUrl} target="_blank" rel="noreferrer" style={linkStyle}>View</a>
                                                    ) : "—"}
                                                </td>
                                                <td style={tdStyle}>
                                                    {member.facebookUrl ? (
                                                        <a href={member.facebookUrl} target="_blank" rel="noreferrer" style={linkStyle}>View</a>
                                                    ) : "—"}
                                                </td>
                                                <td style={{ ...tdStyle, position: "relative" }}>
                                                    <button
                                                        onClick={() => setOpenMenuId(openMenuId === member.id ? null : member.id)}
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

                                                    {openMenuId === member.id && (
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
                                                                minWidth: "130px",
                                                                overflow: "hidden"
                                                            }}
                                                        >
                                                            <div
                                                                onClick={() => handleEdit(member)}
                                                                style={menuItemStyle}
                                                            >
                                                                Update
                                                            </div>
                                                            <div
                                                                onClick={() => handleDelete(member.id)}
                                                                style={{ ...menuItemStyle, color: "#DC2626" }}
                                                            >
                                                                Delete
                                                            </div>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ============ MESSAGES TAB ============ */}
                {activeTab === "messages" && (
                    <div
                        style={{
                            background: "#fff",
                            borderRadius: "16px",
                            border: "1px solid #E2E8F0",
                            padding: "26px"
                        }}
                    >
                        <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 800, color: "#0F172A" }}>
                            Contact Form Messages
                        </h2>
                        <p style={{ margin: "4px 0 18px", fontSize: "13.5px", color: "#64748B" }}>
                            All enquiries submitted through your website's contact form.
                        </p>

                        {/* Status Filter Tabs */}
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "20px" }}>
                            <div style={filterTabStyle("all")} onClick={() => setStatusFilter("all")}>All</div>
                            <div style={filterTabStyle("pending")} onClick={() => setStatusFilter("pending")}>Pending</div>
                            <div style={filterTabStyle("contacted")} onClick={() => setStatusFilter("contacted")}>Contacted</div>
                            <div style={filterTabStyle("resolved")} onClick={() => setStatusFilter("resolved")}>Resolved</div>
                        </div>

                        {messagesLoading ? (
                            <p style={{ color: "#64748B" }}>Loading messages...</p>
                        ) : messages.length === 0 ? (
                            <p style={{ color: "#64748B" }}>No messages found.</p>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                                {messages.map((msg) => {
                                    const status = msg.status || "pending";
                                    const badge = statusStyles[status] || statusStyles.pending;

                                    return (
                                        <div
                                            key={msg.id}
                                            style={{
                                                background: "#F8FAFC",
                                                border: "1px solid #EAECEF",
                                                borderRadius: "12px",
                                                padding: "18px"
                                            }}
                                        >
                                            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                                                    <strong style={{ color: "#0F172A", fontSize: "15px" }}>{msg.name}</strong>
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
                                                    {msg.is_called ? (
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
                                                    {msg.created_at ? new Date(msg.created_at).toLocaleString() : "—"}
                                                </span>
                                            </div>

                                            <div style={{ fontSize: "13.5px", color: "#64748B", marginTop: "4px" }}>
                                                {msg.email} • {msg.phone}
                                            </div>

                                            <div style={{ fontSize: "14px", fontWeight: 600, color: "#2563EB", marginTop: "10px" }}>
                                                Subject: {msg.subject}
                                            </div>

                                            <p style={{ fontSize: "14px", color: "#334155", marginTop: "6px", lineHeight: 1.6 }}>
                                                {msg.message}
                                            </p>

                                            {/* Controls */}
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
                                                    onChange={(e) => handleStatusChange(msg.id, e.target.value)}
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
                                                    onClick={() => toggleCalled(msg.id, msg.is_called)}
                                                    style={{
                                                        padding: "8px 14px",
                                                        borderRadius: "8px",
                                                        border: "1px solid #E2E8F0",
                                                        fontSize: "13px",
                                                        fontWeight: 600,
                                                        cursor: "pointer",
                                                        background: msg.is_called ? "#DCFCE7" : "#fff",
                                                        color: msg.is_called ? "#15803D" : "#334155"
                                                    }}
                                                >
                                                    {msg.is_called ? "Mark as Not Called" : "Mark as Called"}
                                                </button>

                                                <button
                                                    onClick={() => deleteMessage(msg.id)}
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

                                            {/* Notes */}
                                            <div style={{ marginTop: "12px" }}>
                                                <label style={{ fontSize: "12.5px", fontWeight: 600, color: "#334155" }}>
                                                    Notes (e.g. what was discussed on the call)
                                                </label>
                                                <textarea
                                                    rows={2}
                                                    value={notesDraft[msg.id] ?? ""}
                                                    onChange={(e) =>
                                                        setNotesDraft({ ...notesDraft, [msg.id]: e.target.value })
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
                                                    onClick={() => saveNotes(msg.id)}
                                                    disabled={savingId === msg.id}
                                                    style={{
                                                        marginTop: "8px",
                                                        padding: "7px 16px",
                                                        borderRadius: "8px",
                                                        border: "none",
                                                        fontSize: "13px",
                                                        fontWeight: 600,
                                                        cursor: savingId === msg.id ? "not-allowed" : "pointer",
                                                        background: "#2563EB",
                                                        color: "#fff",
                                                        opacity: savingId === msg.id ? 0.6 : 1
                                                    }}
                                                >
                                                    {savingId === msg.id ? "Saving..." : "Save Note"}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}

/* ---------- table styles ---------- */

const thStyle = {
    padding: "12px 14px",
    color: "#94A3B8",
    fontWeight: 700,
    fontSize: "11.5px",
    letterSpacing: "0.5px",
    borderBottom: "1px solid #F1F5F9"
};

const tdStyle = {
    padding: "14px",
    color: "#334155",
    verticalAlign: "middle"
};

const linkStyle = {
    color: "#2563EB",
    fontWeight: 600,
    textDecoration: "none"
};

const menuItemStyle = {
    padding: "10px 14px",
    fontSize: "13.5px",
    fontWeight: 600,
    color: "#334155",
    cursor: "pointer"
};

/* ---------- icons ---------- */

function IconUsers() {
    return (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    );
}

function IconMessage() {
    return (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" />
        </svg>
    );
}

function IconPlus() {
    return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14" />
        </svg>
    );
}

function IconSearch() {
    return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
        </svg>
    );
}

function IconDots() {
    return (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="5" r="1.5" />
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="12" cy="19" r="1.5" />
        </svg>
    );
}