import express from "express";
import cors from "cors";

import contactRouter from "./router/contactform.js";
import teamRouter from "./router/team.js";
import adminAuthRouter from "./router/adminAuth.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));

app.use("/contact-form", contactRouter);
app.use("/team-member", teamRouter);
app.use("/admin-auth", adminAuthRouter);

const PORT = 8080;

app.listen(PORT, () => {
    console.log(`Server Running On http://localhost:${PORT}`);
});