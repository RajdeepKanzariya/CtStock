import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PRODUCTS_API = "http://localhost:8080/product";
const IMAGE_BASE = "http://localhost:8080/uploads/";

export default function AllProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    window.scrollTo(0, 0);
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(PRODUCTS_API);
      const data = await res.json();
      setProducts(data.filter((p) => p.status === "active"));
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  const goToProduct = (id) => {
    navigate(`/productDetail/${id}`);
  };

  const filteredProducts = products.filter((p) => {
    const q = search.toLowerCase();
    return (
      (p.name || "").toLowerCase().includes(q) ||
      (p.short_description || "").toLowerCase().includes(q)
    );
  });

  return (
    <div style={{ width: "100%", boxSizing: "border-box" }}>
      <style>{`
                @media (max-width: 640px) {
                    .ap-hero h1 {
                        font-size: 28px !important;
                    }
                    .ap-hero p {
                        font-size: 14px !important;
                    }
                    .ap-search-bar {
                        max-width: 100% !important;
                    }
                }
                @media (max-width: 480px) {
                    .ap-card {
                        flex-direction: column !important;
                        text-align: center !important;
                        align-items: center !important;
                    }
                    .ap-card-body {
                        text-align: center !important;
                        align-items: center !important;
                    }
                    .ap-card-arrow {
                        display: none !important;
                    }
                }
            `}</style>

      {/* ============ HERO ============ */}
      <section
        className="ap-hero"
        style={{
          width: "100%",
          padding: "clamp(60px, 8vw, 90px) 6% clamp(40px, 5vw, 60px)",
          background: "linear-gradient(160deg, #EFF6FF 0%, #F8FAFC 60%)",
          boxSizing: "border-box",
          textAlign: "center",
        }}
      >
        <p
          style={{
            color: "#2563EB",
            fontSize: "13px",
            fontWeight: 700,
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          Full Catalogue
        </p>
        <h1
          style={{
            margin: "12px 0 0",
            fontSize: "clamp(28px, 4vw, 42px)",
            fontWeight: 800,
            color: "#0F172A",
            lineHeight: 1.2,
          }}
        >
          Explore All Our <span style={{ color: "#2563EB" }}>Products</span>
        </h1>
        <p
          style={{
            margin: "14px auto 0",
            fontSize: "15.5px",
            color: "#64748B",
            maxWidth: "560px",
            lineHeight: 1.75,
          }}
        >
          Browse our complete suite of ERP, CRM, Inventory and Business
          Management software — built to fit every kind of trade.
        </p>

        <div
          className="ap-search-bar"
          style={{
            marginTop: "32px",
            maxWidth: "440px",
            margin: "32px auto 0",
            position: "relative",
          }}
        >
          <span
            style={{
              position: "absolute",
              left: "18px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#94A3B8",
            }}
          >
            <IconSearch />
          </span>
          <input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "14px 18px 14px 46px",
              borderRadius: "12px",
              border: "1px solid #E2E8F0",
              fontSize: "14.5px",
              outline: "none",
              boxSizing: "border-box",
              background: "#fff",
              boxShadow: "0 10px 25px -15px rgba(15,23,42,.2)",
            }}
          />
        </div>
      </section>

      {/* ============ PRODUCTS LIST ============ */}
      <section
        style={{
          width: "100%",
          padding: "0 6% clamp(70px, 8vw, 110px)",
          boxSizing: "border-box",
          background: "#fff",
        }}
      >
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          {loading ? (
            <p
              style={{
                textAlign: "center",
                marginTop: "60px",
                color: "#64748B",
              }}
            >
              Loading products...
            </p>
          ) : filteredProducts.length === 0 ? (
            <p
              style={{
                textAlign: "center",
                marginTop: "60px",
                color: "#64748B",
              }}
            >
              No products found.
            </p>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "18px",
                marginTop: "40px",
              }}
            >
              {filteredProducts.map((product) => (
                <ProductRow
                  key={product.id}
                  product={product}
                  onClick={() => goToProduct(product.id)}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

/* ---------- Product row card ---------- */

function ProductRow({ product, onClick }) {
  const [hover, setHover] = useState(false);
  const accent = product.accent_color || "#2563EB";

  return (
    <div
      className="ap-card"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "24px",
        padding: "22px 26px",
        borderRadius: "18px",
        cursor: "pointer",
        background: "#fff",
        border: hover ? `1px solid ${accent}55` : "1px solid #E2E8F0",
        boxShadow: hover
          ? `0 20px 45px -22px ${accent}55`
          : "0 6px 18px -12px rgba(15,23,42,.08)",
        transform: hover ? "translateY(-3px)" : "translateY(0)",
        transition: "all .25s ease",
      }}
    >
      {/* Logo */}
      <div
        style={{
          width: "72px",
          height: "72px",
          minWidth: "72px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {product.logo ? (
          <img
            src={IMAGE_BASE + product.logo}
            alt={product.name}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
              filter: "drop-shadow(0 6px 12px rgba(15,23,42,.15))",
            }}
          />
        ) : (
          <span
            style={{
              fontSize: "30px",
              fontWeight: 800,
              background: `linear-gradient(135deg, ${accent}, ${accent}99)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {product.name ? product.name.charAt(0).toUpperCase() : "?"}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="ap-card-body" style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: "17.5px",
              fontWeight: 800,
              color: "#0F172A",
            }}
          >
            {product.name}
          </h3>
        </div>

        {product.short_description && (
          <p
            style={{
              margin: "6px 0 0",
              fontSize: "14px",
              color: "#64748B",
              lineHeight: 1.65,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {product.short_description}
          </p>
        )}
      </div>

      {/* Arrow / CTA */}
      <div
        className="ap-card-arrow"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          fontSize: "13.5px",
          fontWeight: 700,
          color: hover ? accent : "#94A3B8",
          whiteSpace: "nowrap",
          transition: "color .25s ease",
        }}
      >
        View Details
        <span
          style={{
            display: "inline-flex",
            transform: hover ? "translateX(4px)" : "translateX(0)",
            transition: "transform .25s ease",
          }}
        >
          →
        </span>
      </div>
    </div>
  );
}

function IconSearch() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}
