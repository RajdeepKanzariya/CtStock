import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LOGIN_API = "http://localhost:8080/admin-auth/login";

export default function AdminLogin() {

    const navigate = useNavigate();

    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showForgot, setShowForgot] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch(LOGIN_API, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });

            const result = await res.json();

            if (!res.ok) {
                setError(result.message || "Login failed");
                setLoading(false);
                return;
            }

            sessionStorage.setItem("isAdmin", "true");
            sessionStorage.setItem("adminName", result.admin.name);

            navigate("/admin/panel");

        } catch (err) {
            console.error(err);
            setError("Server error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        width: "100%",
        padding: "12px 14px",
        borderRadius: "9px",
        border: "1px solid #E2E8F0",
        fontSize: "14px",
        outline: "none",
        boxSizing: "border-box",
        marginTop: "6px"
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#F1F5F9",
                fontFamily: "Segoe UI, Arial, sans-serif",
                padding: "20px",
                boxSizing: "border-box"
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: "380px",
                    background: "#fff",
                    borderRadius: "16px",
                    border: "1px solid #E2E8F0",
                    padding: "36px",
                    boxSizing: "border-box"
                }}
            >
                <h2 style={{ margin: 0, fontSize: "22px", fontWeight: 800, color: "#0F172A", textAlign: "center" }}>
                    Admin Login
                </h2>
                <p style={{ margin: "8px 0 26px", fontSize: "13.5px", color: "#64748B", textAlign: "center" }}>
                    Sign in to access the admin panel.
                </p>

                {!showForgot ? (
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>Email</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={handleChange}
                                required
                                style={inputStyle}
                            />
                        </div>

                        <div style={{ marginTop: "16px" }}>
                            <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>Password</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                value={form.password}
                                onChange={handleChange}
                                required
                                style={inputStyle}
                            />
                        </div>

                        {error && (
                            <p style={{ color: "#DC2626", fontSize: "13px", marginTop: "12px", marginBottom: 0 }}>
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                marginTop: "22px",
                                width: "100%",
                                background: "#0F172A",
                                color: "#fff",
                                border: "none",
                                padding: "13px",
                                borderRadius: "9px",
                                fontWeight: 700,
                                fontSize: "14.5px",
                                cursor: loading ? "not-allowed" : "pointer",
                                opacity: loading ? 0.7 : 1
                            }}
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>

                        <p
                            onClick={() => setShowForgot(true)}
                            style={{
                                marginTop: "16px",
                                textAlign: "center",
                                fontSize: "13px",
                                color: "#2563EB",
                                fontWeight: 600,
                                cursor: "pointer"
                            }}
                        >
                            Forgot Password?
                        </p>
                    </form>
                ) : (
                    <ForgotPasswordBox onBack={() => setShowForgot(false)} inputStyle={inputStyle} />
                )}
            </div>
        </div>
    );
}

function ForgotPasswordBox({ onBack, inputStyle }) {
    const [email, setEmail] = useState("");
    const [sent, setSent] = useState(false);

    const handleSend = (e) => {
        e.preventDefault();
        // Email sending system is not implemented yet.
        setSent(true);
    };

    return (
        <div>
            {!sent ? (
                <form onSubmit={handleSend}>
                    <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>
                        Enter your registered email
                    </label>
                    <input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={inputStyle}
                    />

                    <button
                        type="submit"
                        style={{
                            marginTop: "18px",
                            width: "100%",
                            background: "#2563EB",
                            color: "#fff",
                            border: "none",
                            padding: "13px",
                            borderRadius: "9px",
                            fontWeight: 700,
                            fontSize: "14.5px",
                            cursor: "pointer"
                        }}
                    >
                        Send Reset Link
                    </button>
                </form>
            ) : (
                <p style={{ fontSize: "13.5px", color: "#334155", textAlign: "center", lineHeight: 1.6 }}>
                    If an account exists with this email, a reset link has been sent.
                    (Email sending is not set up yet — this is a placeholder.)
                </p>
            )}

            <p
                onClick={onBack}
                style={{
                    marginTop: "18px",
                    textAlign: "center",
                    fontSize: "13px",
                    color: "#64748B",
                    fontWeight: 600,
                    cursor: "pointer"
                }}
            >
                ← Back to Login
            </p>
        </div>
    );
}