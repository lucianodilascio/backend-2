import express from "express";
const router = express.Router();

import ProductController from "../controllers/product.controller.js";
const controller = new ProductController();



//aca taba el paginate con el get products
router.get("/", controller.getProducts);

//obtener por id
router.get("/:pid", controller.getProductsById);

//agregar nuevo producto
router.post("/", controller.createProduct);

//actualizar por ID
router.put("/:pid", controller.updateProduct);

//eliminar producto
router.delete("/:pid", controller.deleteProduct);

export default router;
