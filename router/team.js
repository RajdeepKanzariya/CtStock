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
            Math.round(Math.random() * 1E9) +
            path.extname(file.originalname);

        cb(null, uniqueName);
    }

});

const upload = multer({
    storage
});



/* ===========================
        GET ALL MEMBERS
=========================== */

router.get("/", (req, res) => {

    db.query(
        "SELECT * FROM team_member ORDER BY id DESC",
        (err, result) => {

            if (err)
                return res.status(500).json(err);

            const formatted = result.map(row => ({
                id: row.id,
                fullName: row.full_name,
                designation: row.designation,
                linkedinUrl: row.linkedin_url,
                facebookUrl: row.facebook_url,
                mobileNumber: row.mobile_number,
                image: row.image
            }));

            res.json(formatted);

        }
    );

});



/* ===========================
        ADD MEMBER
=========================== */

router.post("/", upload.single("image"), (req, res) => {

    const {
        fullName,
        designation,
        linkedinUrl,
        facebookUrl,
        mobileNumber
    } = req.body;

    const image = req.file ? req.file.filename : null;

    const sql = `
    INSERT INTO team_member
    (
        full_name,
        designation,
        linkedin_url,
        facebook_url,
        mobile_number,
        image
    )
    VALUES(?,?,?,?,?,?)
    `;

    db.query(
        sql,
        [
            fullName,
            designation,
            linkedinUrl,
            facebookUrl,
            mobileNumber,
            image
        ],
        (err, result) => {

            if (err) {
                console.log("ADD MEMBER ERROR:", err);
                return res.status(500).json(err);
            }

            res.json({
                success: true,
                message: "Member Added"
            });

        }
    );

});



/* ===========================
        UPDATE MEMBER
=========================== */

router.put("/:id", upload.single("image"), (req, res) => {

    const id = req.params.id;

    const {
        fullName,
        designation,
        linkedinUrl,
        facebookUrl,
        mobileNumber
    } = req.body;

    if (req.file) {

        db.query(
            "SELECT image FROM team_member WHERE id=?",
            [id],
            (err, data) => {

                if (err) {
                    return res.status(500).json(err);
                }

                if (data.length && data[0].image) {
                    const oldImage = uploadPath + data[0].image;

                    if (fs.existsSync(oldImage)) {
                        fs.unlinkSync(oldImage);
                    }

                }

                const sql = `
                UPDATE team_member
                SET
                    full_name=?,
                    designation=?,
                    linkedin_url=?,
                    facebook_url=?,
                    mobile_number=?,
                    image=?
                WHERE id=?
                `;

                db.query(
                    sql,
                    [
                        fullName,
                        designation,
                        linkedinUrl,
                        facebookUrl,
                        mobileNumber,
                        req.file.filename,
                        id
                    ],
                    (err) => {

                        if (err) {
                            console.log("UPDATE MEMBER ERROR:", err);
                            return res.status(500).json(err);
                        }

                        res.json({
                            success: true
                        });

                    }
                );

            }
        );

    }

    else {

        const sql = `
        UPDATE team_member
        SET
            full_name=?,
            designation=?,
            linkedin_url=?,
            facebook_url=?,
            mobile_number=?
        WHERE id=?
        `;

        db.query(
            sql,
            [
                fullName,
                designation,
                linkedinUrl,
                facebookUrl,
                mobileNumber,
                id
            ],
            (err) => {

                if (err) {
                    console.log("UPDATE MEMBER ERROR:", err);
                    return res.status(500).json(err);
                }

                res.json({
                    success: true
                });

            }
        );

    }

});



/* ===========================
        DELETE MEMBER
=========================== */

router.delete("/:id", (req, res) => {

    const id = req.params.id;

    db.query(
        "SELECT image FROM team_member WHERE id=?",
        [id],
        (err, data) => {

            if (err) {
                return res.status(500).json(err);
            }

            if (data.length && data[0].image) {

                const image = uploadPath + data[0].image;

                if (fs.existsSync(image)) {
                    fs.unlinkSync(image);
                }

            }

            db.query(
                "DELETE FROM team_member WHERE id=?",
                [id],
                (err) => {

                    if (err)
                        return res.status(500).json(err);

                    res.json({
                        success: true
                    });

                }
            );

        }
    );

});

export default router;