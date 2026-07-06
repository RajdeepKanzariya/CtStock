import express from "express";
import db from "../config/db.js";

const router = express.Router();

// Save Contact Form
router.post("/", (req, res) => {

    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !phone || !subject || !message) {
        return res.status(400).json({
            success: false,
            message: "All fields are required."
        });
    }

    const sql = `
        INSERT INTO contact_form
        (name, email, phone, subject, message, created_at)
        VALUES (?, ?, ?, ?, ?, UTC_TIMESTAMP())
    `;

    db.query(
        sql,
        [name, email, phone, subject, message],
        (err, result) => {

            if (err) {
                console.log(err);
                return res.status(500).json({
                    success: false,
                    message: "Database Error"
                });
            }

            res.status(201).json({
                success: true,
                message: "Contact Form Submitted Successfully",
                id: result.insertId
            });

        }
    );

});

// Get All Messages
router.get("/", (req, res) => {

    db.query(
        "SELECT * FROM contact_form ORDER BY id DESC",
        (err, result) => {

            if (err) {
                console.log(err);
                return res.status(500).json({
                    success: false,
                    message: "Database Error"
                });
            }

            res.json(result);

        }
    );

});

export default router;