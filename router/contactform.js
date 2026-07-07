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

// Get All Messages (optional ?status=pending|contacted|resolved filter)
router.get("/", (req, res) => {

    const { status } = req.query;

    let sql = "SELECT * FROM contact_form";
    const params = [];

    if (status && ["pending", "contacted", "resolved"].includes(status)) {
        sql += " WHERE status = ?";
        params.push(status);
    }

    sql += " ORDER BY id DESC";

    db.query(sql, params, (err, result) => {

        if (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: "Database Error"
            });
        }

        res.json(result);

    });

});

// Update status / is_called / notes for a message
router.patch("/:id", (req, res) => {

    const { id } = req.params;
    const { status, is_called, notes } = req.body;

    const fields = [];
    const values = [];

    if (status !== undefined) {
        fields.push("status = ?");
        values.push(status);
    }

    if (is_called !== undefined) {
        fields.push("is_called = ?");
        values.push(is_called ? 1 : 0);
    }

    if (notes !== undefined) {
        fields.push("notes = ?");
        values.push(notes);
    }

    if (fields.length === 0) {
        return res.status(400).json({
            success: false,
            message: "Nothing to update"
        });
    }

    values.push(id);

    const sql = `UPDATE contact_form SET ${fields.join(", ")} WHERE id = ?`;

    db.query(sql, values, (err, result) => {

        if (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: "Database Error"
            });
        }

        res.json({
            success: true,
            message: "Message updated successfully"
        });

    });

});

// Delete a message
router.delete("/:id", (req, res) => {

    const { id } = req.params;

    db.query("DELETE FROM contact_form WHERE id = ?", [id], (err) => {

        if (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: "Database Error"
            });
        }

        res.json({
            success: true,
            message: "Message deleted"
        });

    });

});

export default router;