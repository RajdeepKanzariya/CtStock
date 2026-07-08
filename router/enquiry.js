import express from "express";
import db from "../config/db.js";

const router = express.Router();

/* SAVE ENQUIRY */
router.post("/", (req, res) => {

    const {
        name,
        phone,
        whatsapp,
        email,
        company_name,
        industry_type,
        address,
        message,
        products
    } = req.body;

    if (!name || !phone || !email || !Array.isArray(products) || products.length === 0) {
        return res.status(400).json({
            success: false,
            message: "Name, Phone, Email and at least one Product are required."
        });
    }

    const sql = `
        INSERT INTO enquiries
        (name, phone, whatsapp, email, company_name, industry_type, address, message)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [name, phone, whatsapp, email, company_name, industry_type, address, message],
        (err, result) => {

            if (err) {
                console.log("ENQUIRY INSERT ERROR:", err);
                return res.status(500).json(err);
            }

            const enquiryId = result.insertId;

            const insertProducts = products.map(
                (p) => new Promise((resolve, reject) => {
                    db.query(
                        "INSERT INTO enquiry_products (enquiry_id, product_name) VALUES (?, ?)",
                        [enquiryId, p],
                        (err) => (err ? reject(err) : resolve())
                    );
                })
            );

            Promise.all(insertProducts)
                .then(() => res.status(201).json({
                    success: true,
                    message: "Enquiry submitted successfully",
                    id: enquiryId
                }))
                .catch((err) => {
                    console.log("ENQUIRY PRODUCTS ERROR:", err);
                    res.status(500).json(err);
                });

        }
    );

});

/* GET ALL ENQUIRIES (with their selected products) */
router.get("/", (req, res) => {

    db.query("SELECT * FROM enquiries ORDER BY id DESC", (err, enquiries) => {

        if (err) return res.status(500).json(err);
        if (enquiries.length === 0) return res.json([]);

        const ids = enquiries.map((e) => e.id);

        db.query(
            "SELECT * FROM enquiry_products WHERE enquiry_id IN (?)",
            [ids],
            (err, products) => {

                if (err) return res.status(500).json(err);

                const result = enquiries.map((e) => ({
                    ...e,
                    products: products
                        .filter((p) => p.enquiry_id === e.id)
                        .map((p) => p.product_name)
                }));

                res.json(result);

            }
        );

    });

});

export default router;