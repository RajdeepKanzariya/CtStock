import { useEffect, useState } from "react";
import { statusStyles } from "./shared";

const MESSAGES_API = "http://localhost:8080/contact-form";

export default function MessagesTab() {

    const [messages, setMessages] = useState([]);
    const [messagesLoading, setMessagesLoading] = useState(false);
    const [statusFilter, setStatusFilter] = useState("all");
    const [notesDraft, setNotesDraft] = useState({});
    const [savingId, setSavingId] = useState(null);
    const [deleteTargetId, setDeleteTargetId] = useState(null);

    useEffect(() => {
        fetchMessages();
    }, [statusFilter]);

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

    const requestDeleteMessage = (id) => {
        setDeleteTargetId(id);
    };

    const confirmDeleteMessage = async () => {
        if (!deleteTargetId) return;
        try {
            await fetch(`${MESSAGES_API}/${deleteTargetId}`, { method: "DELETE" });
            fetchMessages();
        } catch (err) {
            console.error("Failed to delete message:", err);
        } finally {
            setDeleteTargetId(null);
        }
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
        <>
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
                                            onClick={() => requestDeleteMessage(msg.id)}
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

            {/* Delete Confirmation Modal (messages) */}
            {deleteTargetId && (
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
                            Delete this message?
                        </h3>
                        <p style={{ marginTop: "8px", fontSize: "13.5px", color: "#64748B", lineHeight: 1.6 }}>
                            This action cannot be undone. The message will be permanently removed.
                        </p>

                        <div style={{ display: "flex", gap: "10px", marginTop: "22px" }}>
                            <button
                                onClick={() => setDeleteTargetId(null)}
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
                                onClick={confirmDeleteMessage}
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