import express from "express";
import db from "../config/db.js";

const router = express.Router();

router.post("/login", (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email and password are required."
        });
    }

    const sql = "SELECT id, name, email, password FROM admin_users WHERE email = ?";

    db.query(sql, [email], (err, result) => {

        if (err) {
            console.log("ADMIN LOGIN ERROR:", err);
            return res.status(500).json({
                success: false,
                message: "Database Error"
            });
        }

        if (result.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        const admin = result[0];

        if (admin.password !== password) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        res.json({
            success: true,
            message: "Login successful",
            admin: {
                id: admin.id,
                name: admin.name,
                email: admin.email
            }
        });

    });

});

export default router;