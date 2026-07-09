import { useEffect, useState } from "react";
import {
    IMAGE_BASE,
    inputStyle,
    thStyle,
    tdStyle,
    linkStyle,
    menuItemStyle,
    IconPlus,
    IconSearch,
    IconDots
} from "./shared";

const API_BASE = "http://localhost:8080/team-member";

export default function TeamTab() {

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

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            const res = await fetch(API_BASE);
            const data = await res.json();
            setMembers(data);
        } catch (err) {
            console.error("Failed to fetch members:", err);
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

    return (
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
    );
}