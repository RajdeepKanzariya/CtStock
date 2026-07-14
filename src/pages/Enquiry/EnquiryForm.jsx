import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const PRODUCTS_API = "http://localhost:8080/product";

export default function EnquiryForm() {

    const location = useLocation();

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        whatsapp: "",
        email: "",
        company_name: "",
        industry_type: "",
        address: "",
        state: "",
        message: ""
    });

    const [productOptions, setProductOptions] = useState([]);
    const [productOptionsLoading, setProductOptionsLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Fetch the live product list from the database
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(PRODUCTS_API);
                const data = await res.json();

                // active products only, plus a manual "Other" option at the end
                const names = data
                    .filter((p) => p.status === "active")
                    .map((p) => p.name);

                setProductOptions([...names, "Other"]);
            } catch (err) {
                console.error("Failed to fetch products:", err);
                setProductOptions(["Other"]);
            } finally {
                setProductOptionsLoading(false);
            }
        };

        fetchProducts();
    }, []);


    useEffect(() => {
        const preselect = location.state?.productName;
        if (preselect && productOptions.includes(preselect)) {
            setProducts((prev) => (prev.includes(preselect) ? prev : [...prev, preselect]));
        }
       
    }, [productOptions, location.state]);

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
                company_name: "", industry_type: "", address: "", state: "", message: ""
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

                <input
                    list="state-options"
                    type="text"
                    name="state"
                    placeholder="State (select or type)"
                    value={formData.state}
                    onChange={handleChange}
                    style={inputStyle}
                    autoComplete="off"
                />
                <datalist id="state-options">
                    <option value="None" />
                    <option value="Andhra Pradesh" />
                    <option value="Arunachal Pradesh" />
                    <option value="Assam" />
                    <option value="Bihar" />
                    <option value="Chhattisgarh" />
                    <option value="Goa" />
                    <option value="Gujarat" />
                    <option value="Haryana" />
                    <option value="Himachal Pradesh" />
                    <option value="Jharkhand" />
                    <option value="Karnataka" />
                    <option value="Kerala" />
                    <option value="Madhya Pradesh" />
                    <option value="Maharashtra" />
                    <option value="Manipur" />
                    <option value="Meghalaya" />
                    <option value="Mizoram" />
                    <option value="Nagaland" />
                    <option value="Odisha" />
                    <option value="Punjab" />
                    <option value="Rajasthan" />
                    <option value="Sikkim" />
                    <option value="Tamil Nadu" />
                    <option value="Telangana" />
                    <option value="Tripura" />
                    <option value="Uttar Pradesh" />
                    <option value="Uttarakhand" />
                    <option value="West Bengal" />
                    <option value="Andaman and Nicobar Islands" />
                    <option value="Chandigarh" />
                    <option value="Dadra and Nagar Haveli and Daman and Diu" />
                    <option value="Delhi" />
                    <option value="Jammu and Kashmir" />
                    <option value="Ladakh" />
                    <option value="Lakshadweep" />
                    <option value="Puducherry" />
                    <option value="Out of India" />
                </datalist>

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
                        {productOptionsLoading && (
                            <p style={{ color: "#94A3B8", fontSize: "14px", gridColumn: "1 / -1" }}>
                                Loading products...
                            </p>
                        )}
                        {productOptions.map((product) => (
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