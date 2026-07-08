import { useState } from "react";

const PRODUCT_OPTIONS = [
    "CtStock", "CtStock_Lite", "CtStock_Gen",
    "CtStock_Order", "CtStock_Bisc", "CtStock_Pack",
    "CtStock_Roll", "CtStock_Paper", "CtChequePrint",
    "CtAddress", "CtCRM", "CtBill",
    "Other"
];

export default function EnquiryForm() {

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        whatsapp: "",
        email: "",
        company_name: "",
        industry_type: "",
        address: "",
        message: ""
    });

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const toggleProduct = (product) => {
        setProducts((prev) =>
            prev.includes(product)
                ? prev.filter((p) => p !== product)
                : [...prev, product]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (products.length === 0) {
            setError("Please select at least one product.");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("http://localhost:8080/enquiry", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, products })
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.message || "Something went wrong");
            }

            setSuccess("Enquiry submitted successfully!");
            setFormData({
                name: "", phone: "", whatsapp: "", email: "",
                company_name: "", industry_type: "", address: "", message: ""
            });
            setProducts([]);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        width: "100%",
        padding: "14px 16px",
        borderRadius: "8px",
        border: "1px solid #D1D5DB",
        fontSize: "15px",
        color: "#374151",
        outline: "none",
        boxSizing: "border-box"
    };

    return (
        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 20px" }}>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>

                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    style={inputStyle}
                    required
                />

                <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                    style={inputStyle}
                    required
                />

                <input
                    type="tel"
                    name="whatsapp"
                    placeholder="Whatsapp Number"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    style={inputStyle}
                />

                <input
                    type="email"
                    name="email"
                    placeholder="E-Mail"
                    value={formData.email}
                    onChange={handleChange}
                    style={inputStyle}
                    required
                />

                <input
                    type="text"
                    name="company_name"
                    placeholder="Company Name"
                    value={formData.company_name}
                    onChange={handleChange}
                    style={inputStyle}
                />

                <input
                    type="text"
                    name="industry_type"
                    placeholder="Industry Type (e.g. Ceramic / Polypack / Packaging etc.)"
                    value={formData.industry_type}
                    onChange={handleChange}
                    style={inputStyle}
                />

                <input
                    type="text"
                    name="address"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleChange}
                    style={inputStyle}
                />

                <div>
                    <p style={{ fontWeight: 700, marginBottom: "12px", color: "#1F2937" }}>
                        Please Choose Your Product <span style={{ color: "red" }}>*</span>
                    </p>

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                            gap: "12px"
                        }}
                    >
                        {PRODUCT_OPTIONS.map((product) => (
                            <label
                                key={product}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    fontSize: "15px",
                                    color: "#374151",
                                    cursor: "pointer"
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={products.includes(product)}
                                    onChange={() => toggleProduct(product)}
                                    style={{ width: "16px", height: "16px" }}
                                />
                                {product}
                            </label>
                        ))}
                    </div>
                </div>

                <textarea
                    name="message"
                    placeholder="Message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    style={{ ...inputStyle, resize: "vertical" }}
                />

                {error && <p style={{ color: "#DC2626", margin: 0 }}>{error}</p>}
                {success && <p style={{ color: "#16A34A", margin: 0 }}>{success}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        background: "#3B4E8C",
                        color: "#fff",
                        border: "none",
                        padding: "16px",
                        borderRadius: "8px",
                        fontSize: "16px",
                        fontWeight: 600,
                        cursor: loading ? "not-allowed" : "pointer",
                        opacity: loading ? 0.7 : 1
                    }}
                >
                    {loading ? "Submitting..." : "Submit"}
                </button>

            </form>
        </div>
    );
}