import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import db from "../config/db.js";

const router = express.Router();

const uploadPath = "uploads/";

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath);
}

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, uploadPath);
    },
    filename(req, file, cb) {
        const uniqueName =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1e9) +
            path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

const upload = multer({ storage });

const productUpload = upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "video", maxCount: 1 },
    { name: "screenshots", maxCount: 10 }
]);

const deleteFileIfExists = (filename) => {
    if (!filename) return;
    const filePath = uploadPath + filename;
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
};

/* ===========================
        GET ALL PRODUCTS
=========================== */
router.get("/", (req, res) => {

    db.query(
        "SELECT * FROM products ORDER BY sort_order ASC, id DESC",
        (err, result) => {

            if (err) {
                console.log(err);
                return res.status(500).json(err);
            }

            res.json(result);

        }
    );

});

/* ===========================
    GET SINGLE PRODUCT (with usages, features, screenshots)
=========================== */
router.get("/:id", (req, res) => {

    const { id } = req.params;

    db.query("SELECT * FROM products WHERE id = ?", [id], (err, productResult) => {

        if (err) return res.status(500).json(err);

        if (productResult.length === 0) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        const product = productResult[0];

        db.query(
            "SELECT * FROM product_usages WHERE product_id = ? ORDER BY sort_order ASC",
            [id],
            (err, usages) => {

                if (err) return res.status(500).json(err);

                db.query(
                    "SELECT * FROM product_features WHERE product_id = ? ORDER BY sort_order ASC",
                    [id],
                    (err, features) => {

                        if (err) return res.status(500).json(err);

                        db.query(
                            "SELECT * FROM product_screenshots WHERE product_id = ? ORDER BY sort_order ASC",
                            [id],
                            (err, screenshots) => {

                                if (err) return res.status(500).json(err);

                                res.json({
                                    ...product,
                                    usages,
                                    features,
                                    screenshots
                                });

                            }
                        );

                    }
                );

            }
        );

    });

});

/* ===========================
        ADD PRODUCT
=========================== */
router.post("/", productUpload, (req, res) => {

    const {
        name,
        slug,
        short_description,
        title,
        long_description,
        demo_link,
        accent_color,
        sort_order
    } = req.body;

    const usages = req.body.usages ? JSON.parse(req.body.usages) : [];
    const features = req.body.features ? JSON.parse(req.body.features) : [];

    const logo = req.files?.logo ? req.files.logo[0].filename : null;
    const video = req.files?.video ? req.files.video[0].filename : null;
    const screenshots = req.files?.screenshots || [];

    const sql = `
        INSERT INTO products
        (name, slug, logo, short_description, title, long_description, video, demo_link, accent_color, sort_order, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')
    `;

    db.query(
        sql,
        [
            name,
            slug,
            logo,
            short_description,
            title,
            long_description,
            video,
            demo_link,
            accent_color,
            sort_order || 0
        ],
        (err, result) => {

            if (err) {
                console.log("ADD PRODUCT ERROR:", err);
                return res.status(500).json(err);
            }

            const productId = result.insertId;

            const insertUsages = usages.map(
                (u, i) => new Promise((resolve, reject) => {
                    db.query(
                        "INSERT INTO product_usages (product_id, usage_text, sort_order) VALUES (?, ?, ?)",
                        [productId, u, i],
                        (err) => (err ? reject(err) : resolve())
                    );
                })
            );

            const insertFeatures = features.map(
                (f, i) => new Promise((resolve, reject) => {
                    db.query(
                        "INSERT INTO product_features (product_id, feature_text, sort_order) VALUES (?, ?, ?)",
                        [productId, f, i],
                        (err) => (err ? reject(err) : resolve())
                    );
                })
            );

            const insertScreenshots = screenshots.map(
                (file, i) => new Promise((resolve, reject) => {
                    db.query(
                        "INSERT INTO product_screenshots (product_id, image, sort_order) VALUES (?, ?, ?)",
                        [productId, file.filename, i],
                        (err) => (err ? reject(err) : resolve())
                    );
                })
            );

            Promise.all([...insertUsages, ...insertFeatures, ...insertScreenshots])
                .then(() => res.json({ success: true, message: "Product Added", id: productId }))
                .catch((err) => {
                    console.log("RELATED INSERT ERROR:", err);
                    res.status(500).json(err);
                });

        }
    );

});

/* ===========================
        UPDATE PRODUCT
=========================== */
router.put("/:id", productUpload, (req, res) => {

    const { id } = req.params;

    const {
        name,
        slug,
        short_description,
        title,
        long_description,
        demo_link,
        accent_color,
        sort_order
    } = req.body;

    const usages = req.body.usages ? JSON.parse(req.body.usages) : [];
    const features = req.body.features ? JSON.parse(req.body.features) : [];

    db.query("SELECT * FROM products WHERE id = ?", [id], (err, existingResult) => {

        if (err) return res.status(500).json(err);
        if (existingResult.length === 0) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        const existing = existingResult[0];

        let logo = existing.logo;
        if (req.files?.logo) {
            deleteFileIfExists(existing.logo);
            logo = req.files.logo[0].filename;
        }

        let video = existing.video;
        if (req.files?.video) {
            deleteFileIfExists(existing.video);
            video = req.files.video[0].filename;
        }

        const sql = `
            UPDATE products SET
                name = ?, slug = ?, logo = ?, short_description = ?, title = ?,
                long_description = ?, video = ?, demo_link = ?, accent_color = ?, sort_order = ?
            WHERE id = ?
        `;

        db.query(
            sql,
            [
                name,
                slug,
                logo,
                short_description,
                title,
                long_description,
                video,
                demo_link,
                accent_color,
                sort_order || 0,
                id
            ],
            (err) => {

                if (err) {
                    console.log("UPDATE PRODUCT ERROR:", err);
                    return res.status(500).json(err);
                }

                // Replace usages
                db.query("DELETE FROM product_usages WHERE product_id = ?", [id], () => {

                    const insertUsages = usages.map(
                        (u, i) => new Promise((resolve, reject) => {
                            db.query(
                                "INSERT INTO product_usages (product_id, usage_text, sort_order) VALUES (?, ?, ?)",
                                [id, u, i],
                                (err) => (err ? reject(err) : resolve())
                            );
                        })
                    );

                    // Replace features
                    db.query("DELETE FROM product_features WHERE product_id = ?", [id], () => {

                        const insertFeatures = features.map(
                            (f, i) => new Promise((resolve, reject) => {
                                db.query(
                                    "INSERT INTO product_features (product_id, feature_text, sort_order) VALUES (?, ?, ?)",
                                    [id, f, i],
                                    (err) => (err ? reject(err) : resolve())
                                );
                            })
                        );

                        const newScreenshots = req.files?.screenshots || [];

                        db.query(
                            "SELECT COALESCE(MAX(sort_order), -1) AS maxOrder FROM product_screenshots WHERE product_id = ?",
                            [id],
                            (err, maxResult) => {

                                if (err) {
                                    console.log("MAX SORT ORDER ERROR:", err);
                                    return res.status(500).json(err);
                                }

                                const startOrder = maxResult[0].maxOrder + 1;

                                const insertScreenshots = newScreenshots.map(
                                    (file, i) => new Promise((resolve, reject) => {
                                        db.query(
                                            "INSERT INTO product_screenshots (product_id, image, sort_order) VALUES (?, ?, ?)",
                                            [id, file.filename, startOrder + i],
                                            (err) => (err ? reject(err) : resolve())
                                        );
                                    })
                                );

                                Promise.all([...insertUsages, ...insertFeatures, ...insertScreenshots])
                                    .then(() => res.json({ success: true, message: "Product Updated" }))
                                    .catch((err) => {
                                        console.log("RELATED UPDATE ERROR:", err);
                                        res.status(500).json(err);
                                    });

                            }
                        );

                    });

                });

            }
        );

    });

});

/* ===========================
    TOGGLE ACTIVE / INACTIVE
=========================== */
router.patch("/:id/status", (req, res) => {

    const { id } = req.params;
    const { status } = req.body;

    if (!["active", "inactive"].includes(status)) {
        return res.status(400).json({ success: false, message: "Invalid status" });
    }

    db.query(
        "UPDATE products SET status = ? WHERE id = ?",
        [status, id],
        (err) => {

            if (err) {
                console.log(err);
                return res.status(500).json(err);
            }

            res.json({ success: true, message: "Status updated" });

        }
    );

});

/* ===========================
    REORDER SCREENSHOTS
=========================== */
router.patch("/:id/screenshots/reorder", (req, res) => {

    const { order } = req.body; 

    if (!Array.isArray(order)) {
        return res.status(400).json({ success: false, message: "order must be an array" });
    }

    const updates = order.map(
        (screenshotId, index) => new Promise((resolve, reject) => {
            db.query(
                "UPDATE product_screenshots SET sort_order = ? WHERE id = ?",
                [index, screenshotId],
                (err) => (err ? reject(err) : resolve())
            );
        })
    );

    Promise.all(updates)
        .then(() => res.json({ success: true }))
        .catch((err) => {
            console.log("REORDER ERROR:", err);
            res.status(500).json(err);
        });

});

/* ===========================
    DELETE A SINGLE SCREENSHOT
=========================== */
router.delete("/screenshot/:screenshotId", (req, res) => {

    const { screenshotId } = req.params;

    db.query(
        "SELECT * FROM product_screenshots WHERE id = ?",
        [screenshotId],
        (err, result) => {

            if (err) return res.status(500).json(err);
            if (result.length === 0) {
                return res.status(404).json({ success: false, message: "Screenshot not found" });
            }

            deleteFileIfExists(result[0].image);

            db.query(
                "DELETE FROM product_screenshots WHERE id = ?",
                [screenshotId],
                (err) => {
                    if (err) return res.status(500).json(err);
                    res.json({ success: true });
                }
            );

        }
    );

});

/* ===========================
        DELETE PRODUCT
=========================== */
router.delete("/:id", (req, res) => {

    const { id } = req.params;

    db.query("SELECT * FROM products WHERE id = ?", [id], (err, productResult) => {

        if (err) return res.status(500).json(err);
        if (productResult.length === 0) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        const product = productResult[0];

        db.query(
            "SELECT * FROM product_screenshots WHERE product_id = ?",
            [id],
            (err, screenshots) => {

                if (err) return res.status(500).json(err);

                deleteFileIfExists(product.logo);
                deleteFileIfExists(product.video);
                screenshots.forEach((s) => deleteFileIfExists(s.image));

                db.query("DELETE FROM products WHERE id = ?", [id], (err) => {

                    if (err) return res.status(500).json(err);

                    res.json({ success: true, message: "Product deleted" });

                });

            }
        );

    });

});

export default router;