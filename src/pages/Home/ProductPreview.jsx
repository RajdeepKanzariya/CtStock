import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const PRODUCTS_API = "http://localhost:8080/product";
const IMAGE_BASE = "http://localhost:8080/uploads/";

export default function ProductPreview() {

    const sectionRef = useRef(null);
    const [inView, setInView] = useState(false);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => setInView(entry.isIntersecting),
            { threshold: 0.1, rootMargin: "-60px 0px -60px 0px" }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
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

    const EASE = "cubic-bezier(.16,.9,.28,1)";

    return (
        <section
            ref={sectionRef}
            style={{
                width: "100%",
                padding: "clamp(60px, 8vw, 100px) 6%",
                background: "#F8FAFC",
                boxSizing: "border-box",
                overflow: "hidden"
            }}
        >
            <div
                style={{
                    maxWidth: "700px",
                    margin: "0 auto",
                    textAlign: "center",
                    opacity: inView ? 1 : 0,
                    transform: inView ? "translateY(0)" : "translateY(35px)",
                    transition: `opacity 1s ${EASE}, transform 1s ${EASE}`
                }}
            >
                <p style={{ color: "#2563EB", fontSize: "13px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", margin: 0 }}>
                    Our Products
                </p>
                <h2 style={{ margin: "10px 0 0", fontSize: "clamp(26px, 3.2vw, 36px)", fontWeight: 800, color: "#0F172A" }}>
                    Software Built For <span style={{ color: "#2563EB" }}>Your Business</span>
                </h2>
            </div>

            {loading ? (
                <p style={{ textAlign: "center", marginTop: "50px", color: "#64748B" }}>
                    Loading products...
                </p>
            ) : products.length === 0 ? (
                <p style={{ textAlign: "center", marginTop: "50px", color: "#64748B" }}>
                    No products added yet.
                </p>
            ) : (
                <div
                    style={{
                        maxWidth: "1180px",
                        margin: "48px auto 0",
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                        gap: "22px"
                    }}
                >
                    {products.map((product, i) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            delay={0.08 + i * 0.1}
                            inView={inView}
                            ease={EASE}
                            onClick={() => goToProduct(product.id)}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}

function ProductCard({ product, delay, inView, ease, onClick }) {
    const [hover, setHover] = useState(false);

    return (
        <div
            onClick={onClick}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
                background: "#fff",
                borderRadius: "18px",
                padding: "30px 24px",
                textAlign: "center",
                cursor: "pointer",
                border: hover ? "1px solid rgba(37,99,235,.35)" : "1px solid #EAECEF",
                boxShadow: hover
                    ? "0 22px 40px -18px rgba(37,99,235,.25)"
                    : "0 6px 18px -10px rgba(15,23,42,.08)",
                opacity: inView ? 1 : 0,
                transform: inView
                    ? hover
                        ? "translateY(-6px)"
                        : "translateY(0)"
                    : "translateY(40px)",
                transition: `opacity .8s ${ease} ${delay}s, transform .8s ${ease} ${delay}s, box-shadow .3s ease, border-color .3s ease`
            }}
        >
            <div
                style={{
                    width: "78px",
                    height: "78px",
                    margin: "0 auto",
                    borderRadius: "16px",
                    background: "#F8FAFC",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    transform: hover ? "scale(1.06)" : "scale(1)",
                    transition: "transform .35s ease"
                }}
            >
                {product.logo ? (
                    <img
                        src={IMAGE_BASE + product.logo}
                        alt={product.name}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                            padding: "10px"
                        }}
                    />
                ) : (
                    <span style={{ fontSize: "26px", fontWeight: 800, color: "#2563EB" }}>
                        {product.name ? product.name.charAt(0).toUpperCase() : "?"}
                    </span>
                )}
            </div>

            <h3
                style={{
                    margin: "18px 0 0",
                    fontSize: "16.5px",
                    fontWeight: 700,
                    color: "#0F172A"
                }}
            >
                {product.name}
            </h3>

            <p
                style={{
                    margin: "8px 0 0",
                    fontSize: "13.5px",
                    lineHeight: 1.7,
                    color: "#64748B"
                }}
            >
                {product.short_description || ""}
            </p>

            <span
                style={{
                    display: "inline-block",
                    marginTop: "16px",
                    fontSize: "13px",
                    fontWeight: 700,
                    color: hover ? "#2563EB" : "#94A3B8",
                    transition: "color .3s ease"
                }}
            >
                View Details {hover ? "→" : ""}
            </span>
        </div>
    );
}