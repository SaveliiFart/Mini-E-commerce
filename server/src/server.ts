import express from "express";
import { pool } from "./config/db.js";
import productRouter from "./routes/product.routes.js"
import categoryRouter from "./routes/categories.routes.js"
import userRouter from "./routes/users.routes.js"

const app = express();
app.use(express.json()); 

app.use("/api/products", productRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/users", userRouter);

app.listen(5459, () => {
    console.log("Server running on http://localhost:5459");
});