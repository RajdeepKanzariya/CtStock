import { useEffect, useState } from "react";

const API_BASE = "http://localhost:8080/team-member";
const IMAGE_BASE = "http://localhost:8080/uploads/";
const MESSAGES_API = "http://localhost:8080/contact-form";

export default function AdminPanel() {

    const [activeTab, setActiveTab] = useState("team"); // "team" | "messages"

    /* ============ TEAM STATE ============ */
    const [members, setMembers] = useState([]);
    const [showForm, setShowForm] = useState(false);

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

    /* ============ MESSAGES STATE ============ */
    const [messages, setMessages] = useState([]);
    const [messagesLoading, setMessagesLoading] = useState(false);

    useEffect(() => {
        fetchMembers();
    }, []);

    useEffect(() => {
        if (activeTab === "messages") {
            fetchMessages();
        }
    }, [activeTab]);

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
            const res = await fetch(MESSAGES_API);
            const data = await res.json();
            setMessages(data);
        } catch (err) {
            console.error("Failed to fetch messages:", err);
        } finally {
            setMessagesLoading(false);
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
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this member?")) return;

        try {
            await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
            fetchMembers();
        } catch (err) {
            console.error("Delete failed:", err);
        }
    };

    const inputStyle = {
        width: "100%",
        padding: "11px 14px",
        borderRadius: "8px",
        border: "1px solid #E2E8F0",
        fontSize: "14px",
        outline: "none",
        boxSizing: "border-box"
    };

    const tabStyle = (tab) => ({
        padding: "10px 20px",
        borderRadius: "8px",
        border: "none",
        fontWeight: 600,
        fontSize: "14px",
        cursor: "pointer",
        background: activeTab === tab ? "#2563EB" : "#F1F5F9",
        color: activeTab === tab ? "#fff" : "#334155"
    });

    return (
        <div
            style={{
                maxWidth: "1000px",
                margin: "40px auto",
                padding: "20px",
                fontFamily: "Segoe UI, Arial, sans-serif"
            }}
        >
            <h2 style={{ margin: 0, color: "#0F172A" }}>Admin Panel</h2>

            {/* ============ TABS ============ */}
            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                <button style={tabStyle("team")} onClick={() => setActiveTab("team")}>
                    Team Members
                </button>
                <button style={tabStyle("messages")} onClick={() => setActiveTab("messages")}>
                    Messages
                </button>
            </div>

            {/* ============ TEAM TAB ============ */}
            {activeTab === "team" && (
                <div style={{ marginTop: "26px" }}>

                    {!showForm && (
                        <button
                            onClick={openAddForm}
                            style={{
                                background: "#2563EB",
                                color: "#fff",
                                border: "none",
                                padding: "12px 24px",
                                borderRadius: "8px",
                                fontWeight: 600,
                                cursor: "pointer"
                            }}
                        >
                            + Add Member
                        </button>
                    )}

                    {showForm && (
                        <form
                            onSubmit={handleSubmit}
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                                gap: "16px",
                                marginTop: "16px",
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

                    <hr style={{ margin: "30px 0", border: "none", borderTop: "1px solid #EAECEF" }} />

                    <table
                        cellPadding="10"
                        width="100%"
                        style={{ borderCollapse: "collapse", fontSize: "14px" }}
                    >
                        <thead>
                            <tr style={{ background: "#F8FAFC", textAlign: "left" }}>
                                <th style={{ padding: "10px", borderBottom: "1px solid #EAECEF" }}>Photo</th>
                                <th style={{ padding: "10px", borderBottom: "1px solid #EAECEF" }}>Name</th>
                                <th style={{ padding: "10px", borderBottom: "1px solid #EAECEF" }}>Designation</th>
                                <th style={{ padding: "10px", borderBottom: "1px solid #EAECEF" }}>Mobile</th>
                                <th style={{ padding: "10px", borderBottom: "1px solid #EAECEF" }}>LinkedIn</th>
                                <th style={{ padding: "10px", borderBottom: "1px solid #EAECEF" }}>Facebook</th>
                                <th style={{ padding: "10px", borderBottom: "1px solid #EAECEF" }}>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {members.length === 0 ? (
                                <tr>
                                    <td colSpan="7" style={{ padding: "20px", textAlign: "center", color: "#64748B" }}>
                                        No team members yet.
                                    </td>
                                </tr>
                            ) : (
                                members.map((member) => (
                                    <tr key={member.id} style={{ borderBottom: "1px solid #EAECEF" }}>
                                        <td style={{ padding: "10px" }}>
                                            {member.image ? (
                                                <img
                                                    src={IMAGE_BASE + member.image}
                                                    alt={member.fullName}
                                                    style={{
                                                        width: "44px",
                                                        height: "44px",
                                                        objectFit: "cover",
                                                        borderRadius: "8px"
                                                    }}
                                                />
                                            ) : (
                                                "—"
                                            )}
                                        </td>
                                        <td style={{ padding: "10px" }}>{member.fullName}</td>
                                        <td style={{ padding: "10px" }}>{member.designation}</td>
                                        <td style={{ padding: "10px" }}>{member.mobileNumber || "—"}</td>
                                        <td style={{ padding: "10px" }}>
                                            {member.linkedinUrl ? (
                                                <a href={member.linkedinUrl} target="_blank" rel="noreferrer">Link</a>
                                            ) : "—"}
                                        </td>
                                        <td style={{ padding: "10px" }}>
                                            {member.facebookUrl ? (
                                                <a href={member.facebookUrl} target="_blank" rel="noreferrer">Link</a>
                                            ) : "—"}
                                        </td>
                                        <td style={{ padding: "10px" }}>
                                            <button onClick={() => handleEdit(member)} style={{ marginRight: "8px" }}>
                                                Update
                                            </button>
                                            <button onClick={() => handleDelete(member.id)}>
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ============ MESSAGES TAB ============ */}
            {activeTab === "messages" && (
                <div style={{ marginTop: "26px" }}>
                    <h3 style={{ margin: "0 0 16px", color: "#0F172A" }}>Contact Form Messages</h3>

                    {messagesLoading ? (
                        <p style={{ color: "#64748B" }}>Loading messages...</p>
                    ) : messages.length === 0 ? (
                        <p style={{ color: "#64748B" }}>No messages received yet.</p>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    style={{
                                        background: "#F8FAFC",
                                        border: "1px solid #EAECEF",
                                        borderRadius: "12px",
                                        padding: "18px"
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            flexWrap: "wrap",
                                            gap: "8px"
                                        }}
                                    >
                                        <strong style={{ color: "#0F172A", fontSize: "15px" }}>
                                            {msg.name}
                                        </strong>
                                        <span style={{ fontSize: "12.5px", color: "#94A3B8" }}>
                                            {msg.created_at
                                                ? new Date(msg.created_at).toLocaleString()
                                                : "—"}
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
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}