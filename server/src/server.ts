import express from "express";
import productRouter from "./routes/product.routes.js"
import categoryRouter from "./routes/categories.routes.js"
import userRouter from "./routes/users.routes.js"
import orderRouter from "./routes/orders.routes.js"
import variantRouter from "./routes/product-variants.routes.js"

const app = express();
app.use(express.json()); 

app.use("/api/products", productRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);
app.use("/api/variants", variantRouter);

app.listen(5459, () => {
    console.log("Server running on http://localhost:5459");
});