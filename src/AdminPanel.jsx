import { useEffect, useState } from "react";

const API_BASE = "http://localhost:8080/team-member";
const IMAGE_BASE = "http://localhost:8080/uploads/";
const MESSAGES_API = "http://localhost:8080/contact-form";
const PRODUCTS_API = "http://localhost:8080/product";
const ENQUIRIES_API = "http://localhost:8080/enquiry";
const SERVICES_API = "http://localhost:8080/services";
const CATEGORIES_API = "http://localhost:8080/categories";
const OFFERS_API = "http://localhost:8080/offers";
export default function AdminPanel() {

    const [activeTab, setActiveTab] = useState("team");
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
    const [statusFilter, setStatusFilter] = useState("all");
    const [notesDraft, setNotesDraft] = useState({});
    const [savingId, setSavingId] = useState(null);
    const [deleteTargetId, setDeleteTargetId] = useState(null);

    /* ============ PRODUCTS STATE ============ */
    const [products, setProducts] = useState([]);
    const [productsLoading, setProductsLoading] = useState(false);
    const [productSearch, setProductSearch] = useState("");
    const [showProductForm, setShowProductForm] = useState(false);
    const [productEditId, setProductEditId] = useState(null);
    const [productSaving, setProductSaving] = useState(false);
    const [productOpenMenuId, setProductOpenMenuId] = useState(null);
const [productDeleteTargetId, setProductDeleteTargetId] = useState(null);

    /* ============ ENQUIRIES STATE ============ */
    const [enquiries, setEnquiries] = useState([]);
    const [enquiriesLoading, setEnquiriesLoading] = useState(false);
    const [enquiryStatusFilter, setEnquiryStatusFilter] = useState("all");
    const [enquiryNotesDraft, setEnquiryNotesDraft] = useState({});
    const [enquirySavingId, setEnquirySavingId] = useState(null);
    const [enquiryDeleteTargetId, setEnquiryDeleteTargetId] = useState(null);

    /* ============ SERVICES PAGE MANAGEMENT STATE ============ */
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

    const [offerCategoryId, setOfferCategoryId] = useState(""); // which category's offers we're viewing
    const [offersList, setOffersList] = useState([]);
    const [offersListLoading, setOffersListLoading] = useState(false);
    const [showOfferForm, setShowOfferForm] = useState(false);
    const [offerEditId, setOfferEditId] = useState(null);
    const [offerForm, setOfferForm] = useState({ title: "", domain: "", description: "", url: "", sort_order: 0 });
    const [offerSaving, setOfferSaving] = useState(false);
    const [offerDeleteTargetId, setOfferDeleteTargetId] = useState(null);

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
        fetchMembers();
    }, []);

    useEffect(() => {
        if (activeTab === "messages") {
            fetchMessages();
        }
        if (activeTab === "products") {
            fetchProducts();
        }
        if (activeTab === "enquiries") {
            fetchEnquiries();
        }
        if (activeTab === "servicesPage") {
            if (servicesSubTab === "services") fetchServicesList();
            if (servicesSubTab === "categories") fetchCategoriesList();
            if (servicesSubTab === "offers") {
                fetchCategoriesList(); // needed to populate the category dropdown
                if (offerCategoryId) fetchOffersList(offerCategoryId);
            }
        }
    }, [activeTab, statusFilter, enquiryStatusFilter, servicesSubTab, offerCategoryId]);

    useEffect(() => {
        return () => {
            if (logoPreview && logoPreview.startsWith("blob:")) URL.revokeObjectURL(logoPreview);
            if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
            screenshotPreviews.forEach((p) => URL.revokeObjectURL(p.url));
        };

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

    /* ============ ENQUIRIES HANDLERS ============ */

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
    };

    const saveEnquiryNotes = (id) => {
        updateEnquiry(id, { notes: enquiryNotesDraft[id] || "" });
    };

    const requestDeleteEnquiry = (id) => {
        setEnquiryDeleteTargetId(id);
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

    /* ============ SERVICES PAGE HANDLERS ============ */

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

    /* ============ PRODUCTS HANDLERS ============ */

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

        // allow re-selecting the same file again later if removed
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

                <div style={sidebarItemStyle("products")} onClick={() => setActiveTab("products")}>
                    <IconBox /> Products
                </div>

                <div style={sidebarItemStyle("enquiries")} onClick={() => setActiveTab("enquiries")}>
                    <IconMessage /> Enquiries
                </div>

                <div style={sidebarItemStyle("servicesPage")} onClick={() => setActiveTab("servicesPage")}>
                    <IconBox /> Services Page
                </div>
            </aside>

            {/* ============ MAIN CONTENT ============ */}
            <main style={{ flex: 1, padding: "28px 34px", boxSizing: "border-box" }}>

            {/* Breadcrumb */}
                <div style={{ fontSize: "13px", color: "#94A3B8", marginBottom: "18px" }}>
                    Home / <span style={{ color: "#0F172A", fontWeight: 600 }}>
                        {activeTab === "team" ? "Team Members"
                            : activeTab === "messages" ? "Messages"
                            : activeTab === "products" ? "Products"
                            : activeTab === "enquiries" ? "Enquiries"
                            : "Services Page"}
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
                )}

                {/* ============ PRODUCTS TAB ============ */}
                {activeTab === "products" && (
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

                                    {/* New video chosen but not yet saved */}
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

                                    {/* No new video chosen yet — show what's already saved, if editing */}
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

                                    {/* Newly picked screenshots — not uploaded yet, shown instantly via object URLs */}
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

                                    {/* Existing Screenshots (edit mode) — always freshly loaded from the server */}
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
                )}

                {/* ============ ENQUIRIES TAB ============ */}
                {activeTab === "enquiries" && (
                    <div
                        style={{
                            background: "#fff",
                            borderRadius: "16px",
                            border: "1px solid #E2E8F0",
                            padding: "26px"
                        }}
                    >
                        <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 800, color: "#0F172A" }}>
                            Product Enquiries
                        </h2>
                        <p style={{ margin: "4px 0 18px", fontSize: "13.5px", color: "#64748B" }}>
                            All enquiries submitted through your website's enquiry form.
                        </p>

                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "20px" }}>
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

                        {enquiriesLoading ? (
                            <p style={{ color: "#64748B" }}>Loading enquiries...</p>
                        ) : enquiries.length === 0 ? (
                            <p style={{ color: "#64748B" }}>No enquiries found.</p>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                                {enquiries.map((enq) => {
                                    const status = enq.status || "pending";
                                    const badge = statusStyles[status] || statusStyles.pending;

                                    return (
                                        <div
                                            key={enq.id}
                                            style={{
                                                background: "#F8FAFC",
                                                border: "1px solid #EAECEF",
                                                borderRadius: "12px",
                                                padding: "18px"
                                            }}
                                        >
                                            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                                                    <strong style={{ color: "#0F172A", fontSize: "15px" }}>{enq.name}</strong>
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
                                                    {enq.is_called ? (
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
                                                    {enq.created_at ? new Date(enq.created_at).toLocaleString() : "—"}
                                                </span>
                                            </div>

                                            <div style={{ fontSize: "13.5px", color: "#64748B", marginTop: "4px" }}>
                                                {enq.email} • {enq.phone} {enq.whatsapp ? `• WA: ${enq.whatsapp}` : ""}
                                            </div>

                                            {(enq.company_name || enq.industry_type || enq.address) && (
                                                <div style={{ fontSize: "13px", color: "#64748B", marginTop: "6px" }}>
                                                    {enq.company_name && <>Company: {enq.company_name} • </>}
                                                    {enq.industry_type && <>Industry: {enq.industry_type} • </>}
                                                    {enq.address && <>Address: {enq.address}</>}
                                                </div>
                                            )}

                                            {enq.products && enq.products.length > 0 && (
                                                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "10px" }}>
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
                                                <p style={{ fontSize: "14px", color: "#334155", marginTop: "10px", lineHeight: 1.6 }}>
                                                    {enq.message}
                                                </p>
                                            )}

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
                                                    onChange={(e) => handleEnquiryStatusChange(enq.id, e.target.value)}
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
                                                    onClick={() => toggleEnquiryCalled(enq.id, enq.is_called)}
                                                    style={{
                                                        padding: "8px 14px",
                                                        borderRadius: "8px",
                                                        border: "1px solid #E2E8F0",
                                                        fontSize: "13px",
                                                        fontWeight: 600,
                                                        cursor: "pointer",
                                                        background: enq.is_called ? "#DCFCE7" : "#fff",
                                                        color: enq.is_called ? "#15803D" : "#334155"
                                                    }}
                                                >
                                                    {enq.is_called ? "Mark as Not Called" : "Mark as Called"}
                                                </button>

                                                <button
                                                    onClick={() => requestDeleteEnquiry(enq.id)}
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
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* ============ SERVICES PAGE TAB ============ */}
                {activeTab === "servicesPage" && (
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
                )}
            </main>

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
        </div>
    );
}

function ConfirmDeleteModal({ title, message, onCancel, onConfirm }) {
    return (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(15,23,42,.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
            <div style={{ background: "#fff", borderRadius: "16px", padding: "30px", width: "360px", maxWidth: "90%", textAlign: "center", boxShadow: "0 25px 60px -15px rgba(0,0,0,.35)" }}>
                <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "#FEE2E2", color: "#DC2626", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: "26px" }}>🗑</div>
                <h3 style={{ margin: 0, fontSize: "17px", fontWeight: 800, color: "#0F172A" }}>{title}</h3>
                <p style={{ marginTop: "8px", fontSize: "13.5px", color: "#64748B", lineHeight: 1.6 }}>{message}</p>
                <div style={{ display: "flex", gap: "10px", marginTop: "22px" }}>
                    <button onClick={onCancel} style={{ flex: 1, padding: "11px", borderRadius: "9px", border: "1px solid #E2E8F0", background: "#fff", color: "#334155", fontWeight: 600, fontSize: "13.5px", cursor: "pointer" }}>Cancel</button>
                    <button onClick={onConfirm} style={{ flex: 1, padding: "11px", borderRadius: "9px", border: "none", background: "#DC2626", color: "#fff", fontWeight: 600, fontSize: "13.5px", cursor: "pointer" }}>Delete</button>
                </div>
            </div>
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

const smallBtnStyle = {
    padding: "8px 14px",
    borderRadius: "8px",
    border: "1px solid #E2E8F0",
    background: "#fff",
    color: "#334155",
    fontSize: "13px",
    fontWeight: 600,
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

function IconBox() {
    return (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
            <path d="m3.3 7 8.7 5 8.7-5M12 22V12" />
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