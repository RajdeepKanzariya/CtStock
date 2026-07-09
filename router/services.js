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
    GET OFFERS FOR A CATEGORY (by slug)
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

export default router;