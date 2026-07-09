import express from "express";
import db from "../config/db.js";

const router = express.Router();

/* ===========================
        GET ALL SERVICES
=========================== */
router.get("/services", (req, res) => {

    db.query(
        "SELECT * FROM services ORDER BY sort_order ASC, id ASC",
        (err, result) => {

            if (err) {
                console.log(err);
                return res.status(500).json({ success: false, message: "Database Error" });
            }

            res.json(result);

        }
    );

});

/* ===========================
        ADD SERVICE
=========================== */
router.post("/services", (req, res) => {

    const { slug, title, sort_order } = req.body;

    if (!slug || !title) {
        return res.status(400).json({ success: false, message: "slug and title are required" });
    }

    db.query(
        "INSERT INTO services (slug, title, sort_order) VALUES (?, ?, ?)",
        [slug, title, sort_order || 0],
        (err, result) => {

            if (err) {
                console.log(err);
                return res.status(500).json({ success: false, message: "Database Error", sqlMessage: err.sqlMessage });
            }

            res.json({ success: true, id: result.insertId });

        }
    );

});

/* ===========================
        UPDATE SERVICE
=========================== */
router.put("/services/:id", (req, res) => {

    const { id } = req.params;
    const { slug, title, sort_order } = req.body;

    db.query(
        "UPDATE services SET slug = ?, title = ?, sort_order = ? WHERE id = ?",
        [slug, title, sort_order || 0, id],
        (err) => {

            if (err) {
                console.log(err);
                return res.status(500).json({ success: false, message: "Database Error", sqlMessage: err.sqlMessage });
            }

            res.json({ success: true });

        }
    );

});

/* ===========================
        DELETE SERVICE
=========================== */
router.delete("/services/:id", (req, res) => {

    const { id } = req.params;

    db.query("DELETE FROM services WHERE id = ?", [id], (err) => {

        if (err) {
            console.log(err);
            return res.status(500).json({ success: false, message: "Database Error" });
        }

        res.json({ success: true });

    });

});

/* ===========================
        GET ALL CATEGORIES
=========================== */
router.get("/categories", (req, res) => {

    db.query(
        "SELECT * FROM categories ORDER BY sort_order ASC, id ASC",
        (err, result) => {

            if (err) {
                console.log(err);
                return res.status(500).json({ success: false, message: "Database Error" });
            }

            res.json(result);

        }
    );

});

/* ===========================
        ADD CATEGORY
=========================== */
router.post("/categories", (req, res) => {

    const { slug, title, sort_order } = req.body;

    if (!slug || !title) {
        return res.status(400).json({ success: false, message: "slug and title are required" });
    }

    db.query(
        "INSERT INTO categories (slug, title, sort_order) VALUES (?, ?, ?)",
        [slug, title, sort_order || 0],
        (err, result) => {

            if (err) {
                console.log(err);
                return res.status(500).json({ success: false, message: "Database Error", sqlMessage: err.sqlMessage });
            }

            res.json({ success: true, id: result.insertId });

        }
    );

});

/* ===========================
        UPDATE CATEGORY
=========================== */
router.put("/categories/:id", (req, res) => {

    const { id } = req.params;
    const { slug, title, sort_order } = req.body;

    db.query(
        "UPDATE categories SET slug = ?, title = ?, sort_order = ? WHERE id = ?",
        [slug, title, sort_order || 0, id],
        (err) => {

            if (err) {
                console.log(err);
                return res.status(500).json({ success: false, message: "Database Error", sqlMessage: err.sqlMessage });
            }

            res.json({ success: true });

        }
    );

});

/* ===========================
        DELETE CATEGORY
=========================== */
router.delete("/categories/:id", (req, res) => {

    const { id } = req.params;

    db.query("DELETE FROM categories WHERE id = ?", [id], (err) => {

        if (err) {
            console.log(err);
            return res.status(500).json({ success: false, message: "Database Error" });
        }

        res.json({ success: true });

    });

});

/* ===========================
    GET OFFERS FOR A CATEGORY 
=========================== */
router.get("/offers/:categorySlug", (req, res) => {

    const { categorySlug } = req.params;

    db.query(
        "SELECT id FROM categories WHERE slug = ?",
        [categorySlug],
        (err, categoryResult) => {

            if (err) {
                console.log(err);
                return res.status(500).json({ success: false, message: "Database Error" });
            }

            if (categoryResult.length === 0) {
                return res.status(404).json({ success: false, message: "Category not found" });
            }

            const categoryId = categoryResult[0].id;

            db.query(
                "SELECT * FROM offers WHERE category_id = ? ORDER BY sort_order ASC, id ASC",
                [categoryId],
                (err, offers) => {

                    if (err) {
                        console.log(err);
                        return res.status(500).json({ success: false, message: "Database Error" });
                    }

                    res.json(offers);

                }
            );

        }
    );

});

/* ===========================
    GET OFFERS FOR A CATEGORY 
=========================== */
router.get("/categories/:id/offers", (req, res) => {

    const { id } = req.params;

    db.query(
        "SELECT * FROM offers WHERE category_id = ? ORDER BY sort_order ASC, id ASC",
        [id],
        (err, offers) => {

            if (err) {
                console.log(err);
                return res.status(500).json({ success: false, message: "Database Error" });
            }

            res.json(offers);

        }
    );

});

/* ===========================
        ADD OFFER
=========================== */
router.post("/offers", (req, res) => {

    const { category_id, title, domain, description, url, sort_order } = req.body;

    if (!category_id || !title || !url) {
        return res.status(400).json({ success: false, message: "category_id, title and url are required" });
    }

    db.query(
        `INSERT INTO offers (category_id, title, domain, description, url, sort_order)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [category_id, title, domain, description, url, sort_order || 0],
        (err, result) => {

            if (err) {
                console.log(err);
                return res.status(500).json({ success: false, message: "Database Error", sqlMessage: err.sqlMessage });
            }

            res.json({ success: true, id: result.insertId });

        }
    );

});

/* ===========================
        UPDATE OFFER
=========================== */
router.put("/offers/:id", (req, res) => {

    const { id } = req.params;
    const { category_id, title, domain, description, url, sort_order } = req.body;

    db.query(
        `UPDATE offers SET
            category_id = ?, title = ?, domain = ?, description = ?, url = ?, sort_order = ?
         WHERE id = ?`,
        [category_id, title, domain, description, url, sort_order || 0, id],
        (err) => {

            if (err) {
                console.log(err);
                return res.status(500).json({ success: false, message: "Database Error", sqlMessage: err.sqlMessage });
            }

            res.json({ success: true });

        }
    );

});

/* ===========================
        DELETE OFFER
=========================== */
router.delete("/offers/:id", (req, res) => {

    const { id } = req.params;

    db.query("DELETE FROM offers WHERE id = ?", [id], (err) => {

        if (err) {
            console.log(err);
            return res.status(500).json({ success: false, message: "Database Error" });
        }

        res.json({ success: true });

    });

});

export default router;