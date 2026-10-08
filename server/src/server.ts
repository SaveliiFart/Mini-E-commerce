import "./config/env.js";  
import cors from "cors"
import { startBot } from "./bot/bot.js";
import express from "express";
import productRouter from "./routes/product.routes.js"
import categoryRouter from "./routes/category.routes.js"
import userRouter from "./routes/user.routes.js"
import orderRouter from "./routes/order.routes.js"
import variantRouter from "./routes/product-variant.routes.js"

const app = express();
app.use(express.json()); 
app.use(cors())

app.use("/api/products", productRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);
app.use("/api/variants", variantRouter);

app.listen(5459, () => {
    console.log("Server running on http://localhost:5459");
});

startBot();
