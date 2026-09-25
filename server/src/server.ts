import express from "express";
import { pool } from "./config/db.js";
import productRouter from "./routes/product.routes.js"

const app = express();
app.use(express.json()); 
app.get("/", async (req, res) => {
    const result = await pool.query("SELECT NOW()");

    res.json({
        message: "Server works",
        databaseTime: result.rows[0].now,
    });
});

app.use("/api/products", productRouter);

app.listen(5459, () => {
    console.log("Server running on http://localhost:5459");
});