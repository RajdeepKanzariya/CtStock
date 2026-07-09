import { useEffect, useState } from "react";
import {
    IMAGE_BASE,
    inputStyle,
    thStyle,
    tdStyle,
    menuItemStyle,
    smallBtnStyle,
    IconPlus,
    IconSearch,
    IconDots
} from "./shared";

const PRODUCTS_API = "http://localhost:8080/product";

export default function ProductsTab() {

    const [products, setProducts] = useState([]);
    const [productsLoading, setProductsLoading] = useState(false);
    const [productSearch, setProductSearch] = useState("");
    const [showProductForm, setShowProductForm] = useState(false);
    const [productEditId, setProductEditId] = useState(null);
    const [productSaving, setProductSaving] = useState(false);
    const [productOpenMenuId, setProductOpenMenuId] = useState(null);
    const [productDeleteTargetId, setProductDeleteTargetId] = useState(null);

    const [productForm, setProductForm] = useState({
        name: "",
        slug: "",
        short_description: "",
        title: "",
        long_description: "",
        demo_link: "",
        accent_color: "#2563EB",
        sort_order: 0
    });

    const [usagesList, setUsagesList] = useState([""]);
    const [featuresList, setFeaturesList] = useState([""]);

    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);

    const [videoFile, setVideoFile] = useState(null);
    const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);
    const [existingVideoName, setExistingVideoName] = useState(null);

    const [screenshotFiles, setScreenshotFiles] = useState([]);
    const [screenshotPreviews, setScreenshotPreviews] = useState([]);

    const [existingScreenshots, setExistingScreenshots] = useState([]);
    const [screenshotDeleteId, setScreenshotDeleteId] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        return () => {
            if (logoPreview && logoPreview.startsWith("blob:")) URL.revokeObjectURL(logoPreview);
            if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
            screenshotPreviews.forEach((p) => URL.revokeObjectURL(p.url));
        };
    }, []);

    const fetchProducts = async () => {
        setProductsLoading(true);
        try {
            const res = await fetch(PRODUCTS_API);
            const data = await res.json();
            setProducts(data);
        } catch (err) {
            console.error("Failed to fetch products:", err);
        } finally {
            setProductsLoading(false);
        }
    };

    const handleProductChange = (e) => {
        setProductForm({ ...productForm, [e.target.name]: e.target.value });
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (logoPreview && logoPreview.startsWith("blob:")) {
            URL.revokeObjectURL(logoPreview);
        }

        setLogoFile(file);
        setLogoPreview(URL.createObjectURL(file));
    };

    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (videoPreviewUrl) {
            URL.revokeObjectURL(videoPreviewUrl);
        }

        setVideoFile(file);
        setVideoPreviewUrl(URL.createObjectURL(file));
    };

    const removeNewVideo = () => {
        if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
        setVideoFile(null);
        setVideoPreviewUrl(null);
    };

    const handleScreenshotsChange = (e) => {
        const newFiles = Array.from(e.target.files || []);
        if (newFiles.length === 0) return;

        const existingKeys = new Set(screenshotFiles.map((f) => `${f.name}_${f.size}`));
        const trulyNew = newFiles.filter((f) => !existingKeys.has(`${f.name}_${f.size}`));

        const newPreviews = trulyNew.map((file) => ({
            file,
            url: URL.createObjectURL(file)
        }));

        setScreenshotFiles([...screenshotFiles, ...trulyNew]);
        setScreenshotPreviews([...screenshotPreviews, ...newPreviews]);

        e.target.value = "";
    };

    const removeNewScreenshot = (index) => {
        const preview = screenshotPreviews[index];
        if (preview) URL.revokeObjectURL(preview.url);

        setScreenshotFiles(screenshotFiles.filter((_, i) => i !== index));
        setScreenshotPreviews(screenshotPreviews.filter((_, i) => i !== index));
    };

    const updateUsageField = (index, value) => {
        const updated = [...usagesList];
        updated[index] = value;
        setUsagesList(updated);
    };

    const addUsageField = () => setUsagesList([...usagesList, ""]);

    const removeUsageField = (index) => {
        setUsagesList(usagesList.filter((_, i) => i !== index));
    };

    const updateFeatureField = (index, value) => {
        const updated = [...featuresList];
        updated[index] = value;
        setFeaturesList(updated);
    };

    const addFeatureField = () => setFeaturesList([...featuresList, ""]);

    const removeFeatureField = (index) => {
        setFeaturesList(featuresList.filter((_, i) => i !== index));
    };

    const resetProductForm = () => {
        setProductForm({
            name: "",
            slug: "",
            short_description: "",
            title: "",
            long_description: "",
            demo_link: "",
            accent_color: "#2563EB",
            sort_order: 0
        });
        setUsagesList([""]);
        setFeaturesList([""]);

        if (logoPreview && logoPreview.startsWith("blob:")) URL.revokeObjectURL(logoPreview);
        setLogoFile(null);
        setLogoPreview(null);

        if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
        setVideoFile(null);
        setVideoPreviewUrl(null);
        setExistingVideoName(null);

        screenshotPreviews.forEach((p) => URL.revokeObjectURL(p.url));
        setScreenshotFiles([]);
        setScreenshotPreviews([]);
        setExistingScreenshots([]);

        setProductEditId(null);
    };

    const openAddProductForm = () => {
        resetProductForm();
        setShowProductForm(true);
    };

    const closeProductForm = () => {
        resetProductForm();
        setShowProductForm(false);
    };

    const handleProductSubmit = async (e) => {
        e.preventDefault();
        setProductSaving(true);

        const formData = new FormData();
        formData.append("name", productForm.name);
        formData.append("slug", productForm.slug);
        formData.append("short_description", productForm.short_description);
        formData.append("title", productForm.title);
        formData.append("long_description", productForm.long_description);
        formData.append("demo_link", productForm.demo_link);
        formData.append("accent_color", productForm.accent_color);
        formData.append("sort_order", productForm.sort_order);

        formData.append("usages", JSON.stringify(usagesList.filter((u) => u.trim() !== "")));
        formData.append("features", JSON.stringify(featuresList.filter((f) => f.trim() !== "")));

        if (logoFile) formData.append("logo", logoFile);
        if (videoFile) formData.append("video", videoFile);
        screenshotFiles.forEach((file) => formData.append("screenshots", file));

        try {
            let res;

            if (productEditId !== null) {
                res = await fetch(`${PRODUCTS_API}/${productEditId}`, {
                    method: "PUT",
                    body: formData
                });
            } else {
                if (!logoFile) {
                    alert("Please select a logo — it is required for a new product.");
                    setProductSaving(false);
                    return;
                }
                res = await fetch(PRODUCTS_API, {
                    method: "POST",
                    body: formData
                });
            }

            const result = await res.json();

            if (!res.ok) {
                console.error("Server rejected:", result);
                alert(result.sqlMessage || result.message || "Something went wrong");
                setProductSaving(false);
                return;
            }

            closeProductForm();
            fetchProducts();
        } catch (err) {
            console.error("Save failed:", err);
            alert("Network/Server error");
        } finally {
            setProductSaving(false);
        }
    };

    const handleEditProduct = async (product) => {
        try {
            const res = await fetch(`${PRODUCTS_API}/${product.id}`);
            const full = await res.json();

            setProductForm({
                name: full.name || "",
                slug: full.slug || "",
                short_description: full.short_description || "",
                title: full.title || "",
                long_description: full.long_description || "",
                demo_link: full.demo_link || "",
                accent_color: full.accent_color || "#2563EB",
                sort_order: full.sort_order || 0
            });

            setUsagesList(
                full.usages && full.usages.length > 0
                    ? full.usages.map((u) => u.usage_text)
                    : [""]
            );

            setFeaturesList(
                full.features && full.features.length > 0
                    ? full.features.map((f) => f.feature_text)
                    : [""]
            );

            setLogoFile(null);
            setLogoPreview(full.logo ? IMAGE_BASE + full.logo : null);

            setVideoFile(null);
            setVideoPreviewUrl(null);
            setExistingVideoName(full.video || null);

            setScreenshotFiles([]);
            setScreenshotPreviews([]);
            setExistingScreenshots(full.screenshots || []);

            setProductEditId(product.id);
            setShowProductForm(true);
            setProductOpenMenuId(null);
        } catch (err) {
            console.error("Failed to load product details:", err);
        }
    };

    const requestDeleteScreenshot = (screenshotId) => {
        setScreenshotDeleteId(screenshotId);
    };

    const confirmDeleteScreenshot = async () => {
        if (!screenshotDeleteId) return;
        try {
            await fetch(`${PRODUCTS_API}/screenshot/${screenshotDeleteId}`, { method: "DELETE" });
            setExistingScreenshots(existingScreenshots.filter((s) => s.id !== screenshotDeleteId));
        } catch (err) {
            console.error("Failed to delete screenshot:", err);
        } finally {
            setScreenshotDeleteId(null);
        }
    };

    const moveScreenshot = (index, direction) => {
        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= existingScreenshots.length) return;

        const reordered = [...existingScreenshots];
        const [moved] = reordered.splice(index, 1);
        reordered.splice(newIndex, 0, moved);
        setExistingScreenshots(reordered);

        fetch(`${PRODUCTS_API}/${productEditId}/screenshots/reorder`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ order: reordered.map((s) => s.id) })
        }).catch((err) => console.error("Failed to save screenshot order:", err));
    };

    const toggleProductStatus = async (product) => {
        const newStatus = product.status === "active" ? "inactive" : "active";
        try {
            await fetch(`${PRODUCTS_API}/${product.id}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus })
            });
            fetchProducts();
        } catch (err) {
            console.error("Failed to toggle status:", err);
        }
        setProductOpenMenuId(null);
    };

    const requestDeleteProduct = (id) => {
        setProductDeleteTargetId(id);
        setProductOpenMenuId(null);
    };

    const confirmDeleteProduct = async () => {
        if (!productDeleteTargetId) return;
        try {
            await fetch(`${PRODUCTS_API}/${productDeleteTargetId}`, { method: "DELETE" });
            fetchProducts();
        } catch (err) {
            console.error("Failed to delete product:", err);
        } finally {
            setProductDeleteTargetId(null);
        }
    };

    const filteredProducts = products.filter((p) => {
        const q = productSearch.toLowerCase();
        return (
            (p.name || "").toLowerCase().includes(q) ||
            (p.short_description || "").toLowerCase().includes(q)
        );
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
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "14px" }}>
                    <div>
                        <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 800, color: "#0F172A" }}>
                            Products
                        </h2>
                        <p style={{ margin: "4px 0 0", fontSize: "13.5px", color: "#64748B" }}>
                            Add, update, delete or toggle products shown on the website.
                        </p>
                    </div>

                    {!showProductForm && (
                        <button
                            onClick={openAddProductForm}
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
                            <IconPlus /> Add New Product
                        </button>
                    )}
                </div>

                {showProductForm && (
                    <form
                        onSubmit={handleProductSubmit}
                        style={{
                            marginTop: "22px",
                            background: "#F8FAFC",
                            padding: "24px",
                            borderRadius: "14px",
                            border: "1px solid #EAECEF"
                        }}
                    >
                        <h3 style={{ margin: 0, color: "#0F172A" }}>
                            {productEditId !== null ? "Update Product" : "Add New Product"}
                        </h3>

                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                                gap: "16px",
                                marginTop: "18px"
                            }}
                        >
                            <div>
                                <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>Name</label>
                                <input
                                    name="name"
                                    placeholder="e.g. CtStock_Lite"
                                    value={productForm.name}
                                    onChange={handleProductChange}
                                    required
                                    style={{ ...inputStyle, marginTop: "6px" }}
                                />
                            </div>

                            <div>
                                <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>Slug (URL)</label>
                                <input
                                    name="slug"
                                    placeholder="e.g. ctstock-lite"
                                    value={productForm.slug}
                                    onChange={handleProductChange}
                                    required
                                    style={{ ...inputStyle, marginTop: "6px" }}
                                />
                            </div>

                            <div>
                                <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>Short Description (home page)</label>
                                <input
                                    name="short_description"
                                    placeholder="e.g. Ceramic Trading Software"
                                    value={productForm.short_description}
                                    onChange={handleProductChange}
                                    style={{ ...inputStyle, marginTop: "6px" }}
                                />
                            </div>

                            <div>
                                <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>Title (page 2 heading)</label>
                                <input
                                    name="title"
                                    placeholder="e.g. CtStock_Lite - Ceramic Trading Software"
                                    value={productForm.title}
                                    onChange={handleProductChange}
                                    style={{ ...inputStyle, marginTop: "6px" }}
                                />
                            </div>

                            <div>
                                <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>Demo Link</label>
                                <input
                                    name="demo_link"
                                    placeholder="https://..."
                                    value={productForm.demo_link}
                                    onChange={handleProductChange}
                                    style={{ ...inputStyle, marginTop: "6px" }}
                                />
                            </div>

                            <div>
                                <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>Accent Color</label>
                                <input
                                    type="color"
                                    name="accent_color"
                                    value={productForm.accent_color}
                                    onChange={handleProductChange}
                                    style={{ ...inputStyle, marginTop: "6px", padding: "4px", height: "42px" }}
                                />
                            </div>

                            <div>
                                <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>Sort Order</label>
                                <input
                                    type="number"
                                    name="sort_order"
                                    value={productForm.sort_order}
                                    onChange={handleProductChange}
                                    style={{ ...inputStyle, marginTop: "6px" }}
                                />
                            </div>
                        </div>

                        {/* ============ LOGO ============ */}
                        <div
                            style={{
                                marginTop: "20px",
                                padding: "16px",
                                background: "#fff",
                                border: "1px solid #E2E8F0",
                                borderRadius: "12px"
                            }}
                        >
                            <label style={{ fontSize: "13px", fontWeight: 700, color: "#334155" }}>
                                Logo {productEditId === null && <span style={{ color: "#DC2626" }}>*</span>}
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleLogoChange}
                                style={{ ...inputStyle, marginTop: "8px", padding: "8px" }}
                            />

                            {logoPreview && (
                                <div style={{ marginTop: "12px" }}>
                                    <p style={{ margin: "0 0 6px", fontSize: "12px", color: "#94A3B8", fontWeight: 600 }}>
                                        {logoFile ? "New Logo Preview" : "Current Logo"}
                                    </p>
                                    <img
                                        src={logoPreview}
                                        alt="Logo Preview"
                                        style={{
                                            width: "70px",
                                            height: "70px",
                                            objectFit: "contain",
                                            borderRadius: "10px",
                                            border: "1px solid #E2E8F0",
                                            background: "#F8FAFC",
                                            padding: "6px"
                                        }}
                                    />
                                </div>
                            )}
                        </div>

                        {/* ============ VIDEO ============ */}
                        <div
                            style={{
                                marginTop: "16px",
                                padding: "16px",
                                background: "#fff",
                                border: "1px solid #E2E8F0",
                                borderRadius: "12px"
                            }}
                        >
                            <label style={{ fontSize: "13px", fontWeight: 700, color: "#334155" }}>
                                Video (page 3)
                            </label>
                            <input
                                type="file"
                                accept="video/*"
                                onChange={handleVideoChange}
                                style={{ ...inputStyle, marginTop: "8px", padding: "8px" }}
                            />

                            {videoPreviewUrl && (
                                <div style={{ marginTop: "12px" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                                        <p style={{ margin: 0, fontSize: "12px", color: "#94A3B8", fontWeight: 600 }}>
                                            New Video Preview — will replace current video on save
                                        </p>
                                        <button
                                            type="button"
                                            onClick={removeNewVideo}
                                            style={{ ...smallBtnStyle, color: "#DC2626", borderColor: "#FECACA", padding: "4px 10px" }}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                    <video
                                        src={videoPreviewUrl}
                                        controls
                                        style={{ width: "100%", maxWidth: "360px", borderRadius: "10px", border: "1px solid #E2E8F0" }}
                                    />
                                </div>
                            )}

                            {!videoPreviewUrl && existingVideoName && (
                                <div style={{ marginTop: "12px" }}>
                                    <p style={{ margin: "0 0 6px", fontSize: "12px", color: "#94A3B8", fontWeight: 600 }}>
                                        Current Video
                                    </p>
                                    <video
                                        src={IMAGE_BASE + existingVideoName}
                                        controls
                                        style={{ width: "100%", maxWidth: "360px", borderRadius: "10px", border: "1px solid #E2E8F0" }}
                                    />
                                </div>
                            )}

                            {!videoPreviewUrl && !existingVideoName && (
                                <p style={{ margin: "8px 0 0", fontSize: "12.5px", color: "#94A3B8" }}>
                                    No video uploaded yet.
                                </p>
                            )}
                        </div>

                        {/* ============ SCREENSHOTS ============ */}
                        <div
                            style={{
                                marginTop: "16px",
                                padding: "16px",
                                background: "#fff",
                                border: "1px solid #E2E8F0",
                                borderRadius: "12px"
                            }}
                        >
                            <label style={{ fontSize: "13px", fontWeight: 700, color: "#334155" }}>
                                Screenshots (page 3, multiple)
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleScreenshotsChange}
                                style={{ ...inputStyle, marginTop: "8px", padding: "8px" }}
                            />

                            {screenshotPreviews.length > 0 && (
                                <div style={{ marginTop: "16px" }}>
                                    <p style={{ margin: "0 0 8px", fontSize: "12px", color: "#2563EB", fontWeight: 700 }}>
                                        New Screenshots to Upload ({screenshotPreviews.length})
                                    </p>
                                    <div
                                        style={{
                                            display: "grid",
                                            gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                                            gap: "12px"
                                        }}
                                    >
                                        {screenshotPreviews.map((p, i) => (
                                            <div
                                                key={p.url}
                                                style={{
                                                    position: "relative",
                                                    border: "1px solid #93C5FD",
                                                    borderRadius: "10px",
                                                    overflow: "hidden",
                                                    background: "#EFF6FF"
                                                }}
                                            >
                                                <img
                                                    src={p.url}
                                                    alt={`New screenshot ${i + 1}`}
                                                    style={{ width: "100%", height: "90px", objectFit: "cover", display: "block" }}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeNewScreenshot(i)}
                                                    style={{
                                                        position: "absolute",
                                                        top: "4px",
                                                        right: "4px",
                                                        width: "22px",
                                                        height: "22px",
                                                        borderRadius: "50%",
                                                        border: "none",
                                                        background: "rgba(220,38,38,.9)",
                                                        color: "#fff",
                                                        fontSize: "12px",
                                                        fontWeight: 700,
                                                        cursor: "pointer",
                                                        lineHeight: "22px",
                                                        padding: 0
                                                    }}
                                                >
                                                    ✕
                                                </button>
                                                <div style={{ padding: "4px 6px", fontSize: "10.5px", color: "#1D4ED8", background: "#DBEAFE" }}>
                                                    new — not saved yet
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {productEditId !== null && (
                                <div style={{ marginTop: "16px" }}>
                                    <p style={{ margin: "0 0 8px", fontSize: "12px", color: "#334155", fontWeight: 700 }}>
                                        Existing Screenshots — delete or reorder ({existingScreenshots.length})
                                    </p>

                                    {existingScreenshots.length === 0 ? (
                                        <p style={{ margin: 0, fontSize: "12.5px", color: "#94A3B8" }}>
                                            No screenshots saved yet for this product.
                                        </p>
                                    ) : (
                                        <div
                                            style={{
                                                display: "grid",
                                                gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                                                gap: "12px"
                                            }}
                                        >
                                            {existingScreenshots.map((s, i) => (
                                                <div
                                                    key={s.id}
                                                    style={{
                                                        position: "relative",
                                                        border: "1px solid #E2E8F0",
                                                        borderRadius: "10px",
                                                        overflow: "hidden",
                                                        background: "#fff"
                                                    }}
                                                >
                                                    <img
                                                        src={IMAGE_BASE + s.image}
                                                        alt={`Screenshot ${i + 1}`}
                                                        style={{ width: "100%", height: "90px", objectFit: "cover", display: "block" }}
                                                    />

                                                    <button
                                                        type="button"
                                                        onClick={() => requestDeleteScreenshot(s.id)}
                                                        style={{
                                                            position: "absolute",
                                                            top: "4px",
                                                            right: "4px",
                                                            width: "22px",
                                                            height: "22px",
                                                            borderRadius: "50%",
                                                            border: "none",
                                                            background: "rgba(220,38,38,.9)",
                                                            color: "#fff",
                                                            fontSize: "12px",
                                                            fontWeight: 700,
                                                            cursor: "pointer",
                                                            lineHeight: "22px",
                                                            padding: 0
                                                        }}
                                                    >
                                                        ✕
                                                    </button>

                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            justifyContent: "space-between",
                                                            padding: "4px 6px",
                                                            background: "#F8FAFC",
                                                            borderTop: "1px solid #E2E8F0"
                                                        }}
                                                    >
                                                        <button
                                                            type="button"
                                                            onClick={() => moveScreenshot(i, -1)}
                                                            disabled={i === 0}
                                                            style={{
                                                                border: "none",
                                                                background: "transparent",
                                                                cursor: i === 0 ? "default" : "pointer",
                                                                opacity: i === 0 ? 0.3 : 1,
                                                                fontSize: "13px"
                                                            }}
                                                        >
                                                            ↑
                                                        </button>
                                                        <span style={{ fontSize: "11px", color: "#94A3B8" }}>#{i + 1}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => moveScreenshot(i, 1)}
                                                            disabled={i === existingScreenshots.length - 1}
                                                            style={{
                                                                border: "none",
                                                                background: "transparent",
                                                                cursor: i === existingScreenshots.length - 1 ? "default" : "pointer",
                                                                opacity: i === existingScreenshots.length - 1 ? 0.3 : 1,
                                                                fontSize: "13px"
                                                            }}
                                                        >
                                                            ↓
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div style={{ marginTop: "18px" }}>
                            <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>Long Description (page 3)</label>
                            <textarea
                                name="long_description"
                                rows={4}
                                placeholder="Detailed product description..."
                                value={productForm.long_description}
                                onChange={handleProductChange}
                                style={{ ...inputStyle, marginTop: "6px", resize: "vertical", fontFamily: "inherit" }}
                            />
                        </div>

                        {/* Usages */}
                        <div style={{ marginTop: "18px" }}>
                            <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>Usage (page 2, one per line)</label>
                            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "6px" }}>
                                {usagesList.map((val, i) => (
                                    <div key={i} style={{ display: "flex", gap: "8px" }}>
                                        <input
                                            value={val}
                                            onChange={(e) => updateUsageField(i, e.target.value)}
                                            placeholder="e.g. All type of Ceramic Tiles Traders"
                                            style={inputStyle}
                                        />
                                        {usagesList.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeUsageField(i)}
                                                style={{ ...smallBtnStyle, color: "#DC2626", borderColor: "#FECACA" }}
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button type="button" onClick={addUsageField} style={{ ...smallBtnStyle, alignSelf: "flex-start" }}>
                                    + Add Usage
                                </button>
                            </div>
                        </div>

                        {/* Features */}
                        <div style={{ marginTop: "18px" }}>
                            <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>Features (page 2, one per line)</label>
                            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "6px" }}>
                                {featuresList.map((val, i) => (
                                    <div key={i} style={{ display: "flex", gap: "8px" }}>
                                        <input
                                            value={val}
                                            onChange={(e) => updateFeatureField(i, e.target.value)}
                                            placeholder="e.g. Multi User Support"
                                            style={inputStyle}
                                        />
                                        {featuresList.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeFeatureField(i)}
                                                style={{ ...smallBtnStyle, color: "#DC2626", borderColor: "#FECACA" }}
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button type="button" onClick={addFeatureField} style={{ ...smallBtnStyle, alignSelf: "flex-start" }}>
                                    + Add Feature
                                </button>
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: "10px", marginTop: "22px" }}>
                            <button
                                type="submit"
                                disabled={productSaving}
                                style={{
                                    background: "#2563EB",
                                    color: "#fff",
                                    border: "none",
                                    padding: "12px 24px",
                                    borderRadius: "8px",
                                    fontWeight: 600,
                                    cursor: productSaving ? "not-allowed" : "pointer",
                                    opacity: productSaving ? 0.7 : 1
                                }}
                            >
                                {productSaving ? "Saving..." : productEditId !== null ? "Update Product" : "Add Product"}
                            </button>

                            <button
                                type="button"
                                onClick={closeProductForm}
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
                        placeholder="Search by product name..."
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
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
                                <th style={thStyle}>PRODUCT</th>
                                <th style={thStyle}>SHORT DESCRIPTION</th>
                                <th style={thStyle}>STATUS</th>
                                <th style={thStyle}>ACTIONS</th>
                            </tr>
                        </thead>

                        <tbody>
                            {productsLoading ? (
                                <tr>
                                    <td colSpan="4" style={{ padding: "30px", textAlign: "center", color: "#94A3B8" }}>
                                        Loading products...
                                    </td>
                                </tr>
                            ) : filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan="4" style={{ padding: "30px", textAlign: "center", color: "#94A3B8" }}>
                                        No products found.
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map((product) => (
                                    <tr key={product.id} style={{ borderTop: "1px solid #F1F5F9" }}>
                                        <td style={tdStyle}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                                {product.logo ? (
                                                    <img
                                                        src={IMAGE_BASE + product.logo}
                                                        alt={product.name}
                                                        style={{
                                                            width: "38px",
                                                            height: "38px",
                                                            borderRadius: "8px",
                                                            objectFit: "contain",
                                                            background: "#F8FAFC",
                                                            padding: "4px"
                                                        }}
                                                    />
                                                ) : (
                                                    <div
                                                        style={{
                                                            width: "38px",
                                                            height: "38px",
                                                            borderRadius: "8px",
                                                            background: "#DBEAFE",
                                                            color: "#2563EB",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            fontWeight: 700,
                                                            fontSize: "14px"
                                                        }}
                                                    >
                                                        {product.name ? product.name.charAt(0).toUpperCase() : "?"}
                                                    </div>
                                                )}
                                                <div>
                                                    <div style={{ fontWeight: 700, color: "#0F172A" }}>{product.name}</div>
                                                    <div style={{ fontSize: "12px", color: "#94A3B8" }}>/{product.slug}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={tdStyle}>{product.short_description || "—"}</td>
                                        <td style={tdStyle}>
                                            <span
                                                style={{
                                                    background: product.status === "active" ? "#DCFCE7" : "#F1F5F9",
                                                    color: product.status === "active" ? "#15803D" : "#64748B",
                                                    fontSize: "11.5px",
                                                    fontWeight: 700,
                                                    padding: "3px 10px",
                                                    borderRadius: "999px"
                                                }}
                                            >
                                                {product.status === "active" ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                        <td style={{ ...tdStyle, position: "relative" }}>
                                            <button
                                                onClick={() => setProductOpenMenuId(productOpenMenuId === product.id ? null : product.id)}
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

                                            {productOpenMenuId === product.id && (
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
                                                        minWidth: "150px",
                                                        overflow: "hidden"
                                                    }}
                                                >
                                                    <div onClick={() => handleEditProduct(product)} style={menuItemStyle}>
                                                        Update
                                                    </div>
                                                    <div onClick={() => toggleProductStatus(product)} style={menuItemStyle}>
                                                        {product.status === "active" ? "Set Inactive" : "Set Active"}
                                                    </div>
                                                    <div
                                                        onClick={() => requestDeleteProduct(product.id)}
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

            {/* Delete Confirmation Modal (products) */}
            {productDeleteTargetId && (
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
                            Delete this product?
                        </h3>
                        <p style={{ marginTop: "8px", fontSize: "13.5px", color: "#64748B", lineHeight: 1.6 }}>
                            This will permanently remove the product along with its usages, features and screenshots.
                        </p>

                        <div style={{ display: "flex", gap: "10px", marginTop: "22px" }}>
                            <button
                                onClick={() => setProductDeleteTargetId(null)}
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
                                onClick={confirmDeleteProduct}
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

            {/* Delete Confirmation Modal (single screenshot) */}
            {screenshotDeleteId && (
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
                            width: "340px",
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
                            Delete this screenshot?
                        </h3>
                        <p style={{ marginTop: "8px", fontSize: "13.5px", color: "#64748B", lineHeight: 1.6 }}>
                            This image will be permanently removed from the product.
                        </p>

                        <div style={{ display: "flex", gap: "10px", marginTop: "22px" }}>
                            <button
                                onClick={() => setScreenshotDeleteId(null)}
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
                                onClick={confirmDeleteScreenshot}
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