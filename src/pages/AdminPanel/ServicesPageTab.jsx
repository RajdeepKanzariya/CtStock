import { useEffect, useState } from "react";
import { inputStyle, thStyle, tdStyle, linkStyle, smallBtnStyle, ConfirmDeleteModal, IconPlus } from "./shared";

const SERVICES_API = "http://localhost:8080/services";
const CATEGORIES_API = "http://localhost:8080/categories";
const OFFERS_API = "http://localhost:8080/offers";

export default function ServicesPageTab() {

    const [servicesSubTab, setServicesSubTab] = useState("services"); // "services" | "categories" | "offers"

    const [servicesList, setServicesList] = useState([]);
    const [servicesListLoading, setServicesListLoading] = useState(false);
    const [showServiceForm, setShowServiceForm] = useState(false);
    const [serviceEditId, setServiceEditId] = useState(null);
    const [serviceForm, setServiceForm] = useState({ slug: "", title: "", sort_order: 0 });
    const [serviceSaving, setServiceSaving] = useState(false);
    const [serviceDeleteTargetId, setServiceDeleteTargetId] = useState(null);

    const [categoriesList, setCategoriesList] = useState([]);
    const [categoriesListLoading, setCategoriesListLoading] = useState(false);
    const [showCategoryForm, setShowCategoryForm] = useState(false);
    const [categoryEditId, setCategoryEditId] = useState(null);
    const [categoryForm, setCategoryForm] = useState({ slug: "", title: "", sort_order: 0 });
    const [categorySaving, setCategorySaving] = useState(false);
    const [categoryDeleteTargetId, setCategoryDeleteTargetId] = useState(null);

    const [offerCategoryId, setOfferCategoryId] = useState("");
    const [offersList, setOffersList] = useState([]);
    const [offersListLoading, setOffersListLoading] = useState(false);
    const [showOfferForm, setShowOfferForm] = useState(false);
    const [offerEditId, setOfferEditId] = useState(null);
    const [offerForm, setOfferForm] = useState({ title: "", domain: "", description: "", url: "", sort_order: 0 });
    const [offerSaving, setOfferSaving] = useState(false);
    const [offerDeleteTargetId, setOfferDeleteTargetId] = useState(null);

    useEffect(() => {
        if (servicesSubTab === "services") fetchServicesList();
        if (servicesSubTab === "categories") fetchCategoriesList();
        if (servicesSubTab === "offers") {
            fetchCategoriesList();
            if (offerCategoryId) fetchOffersList(offerCategoryId);
        }
    }, [servicesSubTab, offerCategoryId]);

    // -- Services --
    const fetchServicesList = async () => {
        setServicesListLoading(true);
        try {
            const res = await fetch(SERVICES_API);
            setServicesList(await res.json());
        } catch (err) {
            console.error("Failed to fetch services:", err);
        } finally {
            setServicesListLoading(false);
        }
    };

    const resetServiceForm = () => {
        setServiceForm({ slug: "", title: "", sort_order: 0 });
        setServiceEditId(null);
    };

    const openAddServiceForm = () => {
        resetServiceForm();
        setShowServiceForm(true);
    };

    const closeServiceForm = () => {
        resetServiceForm();
        setShowServiceForm(false);
    };

    const handleServiceSubmit = async (e) => {
        e.preventDefault();
        setServiceSaving(true);
        try {
            const url = serviceEditId !== null ? `${SERVICES_API}/${serviceEditId}` : SERVICES_API;
            const method = serviceEditId !== null ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(serviceForm)
            });
            const result = await res.json();

            if (!res.ok) {
                alert(result.sqlMessage || result.message || "Something went wrong");
                return;
            }

            closeServiceForm();
            fetchServicesList();
        } catch (err) {
            console.error("Failed to save service:", err);
        } finally {
            setServiceSaving(false);
        }
    };

    const handleEditService = (service) => {
        setServiceForm({ slug: service.slug, title: service.title, sort_order: service.sort_order || 0 });
        setServiceEditId(service.id);
        setShowServiceForm(true);
    };

    const confirmDeleteService = async () => {
        if (!serviceDeleteTargetId) return;
        try {
            await fetch(`${SERVICES_API}/${serviceDeleteTargetId}`, { method: "DELETE" });
            fetchServicesList();
        } catch (err) {
            console.error("Failed to delete service:", err);
        } finally {
            setServiceDeleteTargetId(null);
        }
    };

    // -- Categories --
    const fetchCategoriesList = async () => {
        setCategoriesListLoading(true);
        try {
            const res = await fetch(CATEGORIES_API);
            setCategoriesList(await res.json());
        } catch (err) {
            console.error("Failed to fetch categories:", err);
        } finally {
            setCategoriesListLoading(false);
        }
    };

    const resetCategoryForm = () => {
        setCategoryForm({ slug: "", title: "", sort_order: 0 });
        setCategoryEditId(null);
    };

    const openAddCategoryForm = () => {
        resetCategoryForm();
        setShowCategoryForm(true);
    };

    const closeCategoryForm = () => {
        resetCategoryForm();
        setShowCategoryForm(false);
    };

    const handleCategorySubmit = async (e) => {
        e.preventDefault();
        setCategorySaving(true);
        try {
            const url = categoryEditId !== null ? `${CATEGORIES_API}/${categoryEditId}` : CATEGORIES_API;
            const method = categoryEditId !== null ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(categoryForm)
            });
            const result = await res.json();

            if (!res.ok) {
                alert(result.sqlMessage || result.message || "Something went wrong");
                return;
            }

            closeCategoryForm();
            fetchCategoriesList();
        } catch (err) {
            console.error("Failed to save category:", err);
        } finally {
            setCategorySaving(false);
        }
    };

    const handleEditCategory = (category) => {
        setCategoryForm({ slug: category.slug, title: category.title, sort_order: category.sort_order || 0 });
        setCategoryEditId(category.id);
        setShowCategoryForm(true);
    };

    const confirmDeleteCategory = async () => {
        if (!categoryDeleteTargetId) return;
        try {
            await fetch(`${CATEGORIES_API}/${categoryDeleteTargetId}`, { method: "DELETE" });
            fetchCategoriesList();
            if (offerCategoryId === String(categoryDeleteTargetId)) {
                setOfferCategoryId("");
                setOffersList([]);
            }
        } catch (err) {
            console.error("Failed to delete category:", err);
        } finally {
            setCategoryDeleteTargetId(null);
        }
    };

    // -- Offers --
    const fetchOffersList = async (categoryId) => {
        setOffersListLoading(true);
        try {
            const res = await fetch(`${CATEGORIES_API}/${categoryId}/offers`);
            setOffersList(await res.json());
        } catch (err) {
            console.error("Failed to fetch offers:", err);
        } finally {
            setOffersListLoading(false);
        }
    };

    const resetOfferForm = () => {
        setOfferForm({ title: "", domain: "", description: "", url: "", sort_order: 0 });
        setOfferEditId(null);
    };

    const openAddOfferForm = () => {
        resetOfferForm();
        setShowOfferForm(true);
    };

    const closeOfferForm = () => {
        resetOfferForm();
        setShowOfferForm(false);
    };

    const handleOfferSubmit = async (e) => {
        e.preventDefault();
        if (!offerCategoryId) {
            alert("Please select a category first.");
            return;
        }
        setOfferSaving(true);
        try {
            const url = offerEditId !== null ? `${OFFERS_API}/${offerEditId}` : OFFERS_API;
            const method = offerEditId !== null ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...offerForm, category_id: offerCategoryId })
            });
            const result = await res.json();

            if (!res.ok) {
                alert(result.sqlMessage || result.message || "Something went wrong");
                return;
            }

            closeOfferForm();
            fetchOffersList(offerCategoryId);
        } catch (err) {
            console.error("Failed to save offer:", err);
        } finally {
            setOfferSaving(false);
        }
    };

    const handleEditOffer = (offer) => {
        setOfferForm({
            title: offer.title,
            domain: offer.domain || "",
            description: offer.description || "",
            url: offer.url,
            sort_order: offer.sort_order || 0
        });
        setOfferEditId(offer.id);
        setShowOfferForm(true);
    };

    const confirmDeleteOffer = async () => {
        if (!offerDeleteTargetId) return;
        try {
            await fetch(`${OFFERS_API}/${offerDeleteTargetId}`, { method: "DELETE" });
            fetchOffersList(offerCategoryId);
        } catch (err) {
            console.error("Failed to delete offer:", err);
        } finally {
            setOfferDeleteTargetId(null);
        }
    };

    return (
        <>
            <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #E2E8F0", padding: "26px" }}>

                <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 800, color: "#0F172A" }}>
                    Services Page
                </h2>
                <p style={{ margin: "4px 0 18px", fontSize: "13.5px", color: "#64748B" }}>
                    Manage the services list, categories, and their offers shown on the public Services page.
                </p>

                {/* Sub-tabs */}
                <div style={{ display: "flex", gap: "8px", marginBottom: "22px" }}>
                    {["services", "categories", "offers"].map((tab) => (
                        <div
                            key={tab}
                            onClick={() => setServicesSubTab(tab)}
                            style={{
                                padding: "8px 16px",
                                borderRadius: "8px",
                                fontSize: "13px",
                                fontWeight: 600,
                                cursor: "pointer",
                                border: "1px solid #E2E8F0",
                                background: servicesSubTab === tab ? "#0F172A" : "#fff",
                                color: servicesSubTab === tab ? "#fff" : "#475569",
                                textTransform: "capitalize"
                            }}
                        >
                            {tab}
                        </div>
                    ))}
                </div>

                {/* ---------- SERVICES SUB-TAB ---------- */}
                {servicesSubTab === "services" && (
                    <>
                        {!showServiceForm && (
                            <button onClick={openAddServiceForm} style={{ background: "#0F172A", color: "#fff", border: "none", padding: "11px 20px", borderRadius: "9px", fontWeight: 600, fontSize: "13.5px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", marginBottom: "18px" }}>
                                <IconPlus /> Add New Service
                            </button>
                        )}

                        {showServiceForm && (
                            <form onSubmit={handleServiceSubmit} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "14px", marginBottom: "20px", background: "#F8FAFC", padding: "20px", borderRadius: "12px", border: "1px solid #EAECEF" }}>
                                <div>
                                    <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>Title</label>
                                    <input value={serviceForm.title} onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })} required style={{ ...inputStyle, marginTop: "6px" }} />
                                </div>
                                <div>
                                    <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>Slug</label>
                                    <input value={serviceForm.slug} onChange={(e) => setServiceForm({ ...serviceForm, slug: e.target.value })} required style={{ ...inputStyle, marginTop: "6px" }} />
                                </div>
                                <div>
                                    <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>Sort Order</label>
                                    <input type="number" value={serviceForm.sort_order} onChange={(e) => setServiceForm({ ...serviceForm, sort_order: e.target.value })} style={{ ...inputStyle, marginTop: "6px" }} />
                                </div>
                                <div style={{ gridColumn: "1 / -1", display: "flex", gap: "10px" }}>
                                    <button type="submit" disabled={serviceSaving} style={{ background: "#2563EB", color: "#fff", border: "none", padding: "11px 22px", borderRadius: "8px", fontWeight: 600, cursor: "pointer" }}>
                                        {serviceSaving ? "Saving..." : serviceEditId !== null ? "Update Service" : "Add Service"}
                                    </button>
                                    <button type="button" onClick={closeServiceForm} style={{ background: "#fff", color: "#334155", border: "1px solid #CBD5E1", padding: "11px 22px", borderRadius: "8px", fontWeight: 600, cursor: "pointer" }}>
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}

                        <table width="100%" style={{ borderCollapse: "collapse", fontSize: "13.5px" }}>
                            <thead>
                                <tr style={{ textAlign: "left" }}>
                                    <th style={thStyle}>TITLE</th>
                                    <th style={thStyle}>SLUG</th>
                                    <th style={thStyle}>SORT</th>
                                    <th style={thStyle}>ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {servicesListLoading ? (
                                    <tr><td colSpan="4" style={{ padding: "24px", textAlign: "center", color: "#94A3B8" }}>Loading...</td></tr>
                                ) : servicesList.length === 0 ? (
                                    <tr><td colSpan="4" style={{ padding: "24px", textAlign: "center", color: "#94A3B8" }}>No services yet.</td></tr>
                                ) : (
                                    servicesList.map((s) => (
                                        <tr key={s.id} style={{ borderTop: "1px solid #F1F5F9" }}>
                                            <td style={tdStyle}>{s.title}</td>
                                            <td style={tdStyle}>/{s.slug}</td>
                                            <td style={tdStyle}>{s.sort_order}</td>
                                            <td style={tdStyle}>
                                                <button onClick={() => handleEditService(s)} style={{ ...smallBtnStyle, marginRight: "8px" }}>Update</button>
                                                <button onClick={() => setServiceDeleteTargetId(s.id)} style={{ ...smallBtnStyle, color: "#DC2626", borderColor: "#FECACA" }}>Delete</button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </>
                )}

                {/* ---------- CATEGORIES SUB-TAB ---------- */}
                {servicesSubTab === "categories" && (
                    <>
                        {!showCategoryForm && (
                            <button onClick={openAddCategoryForm} style={{ background: "#0F172A", color: "#fff", border: "none", padding: "11px 20px", borderRadius: "9px", fontWeight: 600, fontSize: "13.5px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", marginBottom: "18px" }}>
                                <IconPlus /> Add New Category
                            </button>
                        )}

                        {showCategoryForm && (
                            <form onSubmit={handleCategorySubmit} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "14px", marginBottom: "20px", background: "#F8FAFC", padding: "20px", borderRadius: "12px", border: "1px solid #EAECEF" }}>
                                <div>
                                    <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>Title</label>
                                    <input value={categoryForm.title} onChange={(e) => setCategoryForm({ ...categoryForm, title: e.target.value })} required style={{ ...inputStyle, marginTop: "6px" }} />
                                </div>
                                <div>
                                    <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>Slug</label>
                                    <input value={categoryForm.slug} onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })} required style={{ ...inputStyle, marginTop: "6px" }} />
                                </div>
                                <div>
                                    <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>Sort Order</label>
                                    <input type="number" value={categoryForm.sort_order} onChange={(e) => setCategoryForm({ ...categoryForm, sort_order: e.target.value })} style={{ ...inputStyle, marginTop: "6px" }} />
                                </div>
                                <div style={{ gridColumn: "1 / -1", display: "flex", gap: "10px" }}>
                                    <button type="submit" disabled={categorySaving} style={{ background: "#2563EB", color: "#fff", border: "none", padding: "11px 22px", borderRadius: "8px", fontWeight: 600, cursor: "pointer" }}>
                                        {categorySaving ? "Saving..." : categoryEditId !== null ? "Update Category" : "Add Category"}
                                    </button>
                                    <button type="button" onClick={closeCategoryForm} style={{ background: "#fff", color: "#334155", border: "1px solid #CBD5E1", padding: "11px 22px", borderRadius: "8px", fontWeight: 600, cursor: "pointer" }}>
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}

                        <table width="100%" style={{ borderCollapse: "collapse", fontSize: "13.5px" }}>
                            <thead>
                                <tr style={{ textAlign: "left" }}>
                                    <th style={thStyle}>TITLE</th>
                                    <th style={thStyle}>SLUG</th>
                                    <th style={thStyle}>SORT</th>
                                    <th style={thStyle}>ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categoriesListLoading ? (
                                    <tr><td colSpan="4" style={{ padding: "24px", textAlign: "center", color: "#94A3B8" }}>Loading...</td></tr>
                                ) : categoriesList.length === 0 ? (
                                    <tr><td colSpan="4" style={{ padding: "24px", textAlign: "center", color: "#94A3B8" }}>No categories yet.</td></tr>
                                ) : (
                                    categoriesList.map((c) => (
                                        <tr key={c.id} style={{ borderTop: "1px solid #F1F5F9" }}>
                                            <td style={tdStyle}>{c.title}</td>
                                            <td style={tdStyle}>/{c.slug}</td>
                                            <td style={tdStyle}>{c.sort_order}</td>
                                            <td style={tdStyle}>
                                                <button onClick={() => handleEditCategory(c)} style={{ ...smallBtnStyle, marginRight: "8px" }}>Update</button>
                                                <button onClick={() => setCategoryDeleteTargetId(c.id)} style={{ ...smallBtnStyle, color: "#DC2626", borderColor: "#FECACA" }}>Delete</button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </>
                )}

                {/* ---------- OFFERS SUB-TAB ---------- */}
                {servicesSubTab === "offers" && (
                    <>
                        <div style={{ marginBottom: "18px" }}>
                            <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>Select Category</label>
                            <select
                                value={offerCategoryId}
                                onChange={(e) => setOfferCategoryId(e.target.value)}
                                style={{ ...inputStyle, marginTop: "6px", maxWidth: "320px" }}
                            >
                                <option value="">-- Choose a category --</option>
                                {categoriesList.map((c) => (
                                    <option key={c.id} value={c.id}>{c.title}</option>
                                ))}
                            </select>
                        </div>

                        {offerCategoryId && !showOfferForm && (
                            <button onClick={openAddOfferForm} style={{ background: "#0F172A", color: "#fff", border: "none", padding: "11px 20px", borderRadius: "9px", fontWeight: 600, fontSize: "13.5px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", marginBottom: "18px" }}>
                                <IconPlus /> Add New Offer
                            </button>
                        )}

                        {showOfferForm && (
                            <form onSubmit={handleOfferSubmit} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px", marginBottom: "20px", background: "#F8FAFC", padding: "20px", borderRadius: "12px", border: "1px solid #EAECEF" }}>
                                <div>
                                    <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>Title</label>
                                    <input value={offerForm.title} onChange={(e) => setOfferForm({ ...offerForm, title: e.target.value })} required style={{ ...inputStyle, marginTop: "6px" }} />
                                </div>
                                <div>
                                    <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>Domain</label>
                                    <input value={offerForm.domain} onChange={(e) => setOfferForm({ ...offerForm, domain: e.target.value })} style={{ ...inputStyle, marginTop: "6px" }} />
                                </div>
                                <div style={{ gridColumn: "1 / -1" }}>
                                    <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>Description</label>
                                    <textarea rows={2} value={offerForm.description} onChange={(e) => setOfferForm({ ...offerForm, description: e.target.value })} style={{ ...inputStyle, marginTop: "6px", resize: "vertical", fontFamily: "inherit" }} />
                                </div>
                                <div style={{ gridColumn: "1 / -1" }}>
                                    <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>URL</label>
                                    <input value={offerForm.url} onChange={(e) => setOfferForm({ ...offerForm, url: e.target.value })} required style={{ ...inputStyle, marginTop: "6px" }} />
                                </div>
                                <div>
                                    <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>Sort Order</label>
                                    <input type="number" value={offerForm.sort_order} onChange={(e) => setOfferForm({ ...offerForm, sort_order: e.target.value })} style={{ ...inputStyle, marginTop: "6px" }} />
                                </div>
                                <div style={{ gridColumn: "1 / -1", display: "flex", gap: "10px" }}>
                                    <button type="submit" disabled={offerSaving} style={{ background: "#2563EB", color: "#fff", border: "none", padding: "11px 22px", borderRadius: "8px", fontWeight: 600, cursor: "pointer" }}>
                                        {offerSaving ? "Saving..." : offerEditId !== null ? "Update Offer" : "Add Offer"}
                                    </button>
                                    <button type="button" onClick={closeOfferForm} style={{ background: "#fff", color: "#334155", border: "1px solid #CBD5E1", padding: "11px 22px", borderRadius: "8px", fontWeight: 600, cursor: "pointer" }}>
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}

                        {offerCategoryId && (
                            <table width="100%" style={{ borderCollapse: "collapse", fontSize: "13.5px" }}>
                                <thead>
                                    <tr style={{ textAlign: "left" }}>
                                        <th style={thStyle}>TITLE</th>
                                        <th style={thStyle}>DOMAIN</th>
                                        <th style={thStyle}>URL</th>
                                        <th style={thStyle}>ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {offersListLoading ? (
                                        <tr><td colSpan="4" style={{ padding: "24px", textAlign: "center", color: "#94A3B8" }}>Loading...</td></tr>
                                    ) : offersList.length === 0 ? (
                                        <tr><td colSpan="4" style={{ padding: "24px", textAlign: "center", color: "#94A3B8" }}>No offers yet for this category.</td></tr>
                                    ) : (
                                        offersList.map((o) => (
                                            <tr key={o.id} style={{ borderTop: "1px solid #F1F5F9" }}>
                                                <td style={tdStyle}>{o.title}</td>
                                                <td style={tdStyle}>{o.domain || "—"}</td>
                                                <td style={tdStyle}>
                                                    <a href={o.url} target="_blank" rel="noreferrer" style={linkStyle}>View</a>
                                                </td>
                                                <td style={tdStyle}>
                                                    <button onClick={() => handleEditOffer(o)} style={{ ...smallBtnStyle, marginRight: "8px" }}>Update</button>
                                                    <button onClick={() => setOfferDeleteTargetId(o.id)} style={{ ...smallBtnStyle, color: "#DC2626", borderColor: "#FECACA" }}>Delete</button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        )}
                    </>
                )}
            </div>

            {/* Delete Confirmation Modal (service) */}
            {serviceDeleteTargetId && (
                <ConfirmDeleteModal
                    title="Delete this service?"
                    message="This will permanently remove the service from the Services page."
                    onCancel={() => setServiceDeleteTargetId(null)}
                    onConfirm={confirmDeleteService}
                />
            )}

            {/* Delete Confirmation Modal (category) */}
            {categoryDeleteTargetId && (
                <ConfirmDeleteModal
                    title="Delete this category?"
                    message="This will permanently remove the category along with all of its offers."
                    onCancel={() => setCategoryDeleteTargetId(null)}
                    onConfirm={confirmDeleteCategory}
                />
            )}

            {/* Delete Confirmation Modal (offer) */}
            {offerDeleteTargetId && (
                <ConfirmDeleteModal
                    title="Delete this offer?"
                    message="This will permanently remove this offer from the category."
                    onCancel={() => setOfferDeleteTargetId(null)}
                    onConfirm={confirmDeleteOffer}
                />
            )}
        </>
    );
}