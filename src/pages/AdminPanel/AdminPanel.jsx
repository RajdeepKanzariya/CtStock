import { useState } from "react";
import { IconUsers, IconMessage, IconBox } from "./shared";
import TeamTab from "./TeamTab";
import MessagesTab from "./MessagesTab";
import ProductsTab from "./ProductsTab";
import EnquiriesTab from "./EnquiriesTab";
import ServicesPageTab from "./ServicesPageTab";

export default function AdminPanel() {

    const [activeTab, setActiveTab] = useState("team");

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

                {activeTab === "team" && <TeamTab />}
                {activeTab === "messages" && <MessagesTab />}
                {activeTab === "products" && <ProductsTab />}
                {activeTab === "enquiries" && <EnquiriesTab />}
                {activeTab === "servicesPage" && <ServicesPageTab />}

            </main>
        </div>
    );
}